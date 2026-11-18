import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Property = {
  id: string;
  title: string;
  public_slug: string | null;
  status: string;
  city: string | null;
  area: string | null;
  price: number | null;
  surface: number | null;
  rooms: number | null;
  bedrooms: number | null;
};

type Match = {
  alert_id: string;
  owner_id: string | null;
  transaction: "sale" | "rent";
  property_type: string | null;
  city: string | null;
  area: string | null;
  min_price: number | null;
  max_price: number | null;
  min_surface: number | null;
  min_rooms: number | null;
  bedrooms: number | null;
  language: "en" | "fr" | "es";
};

function formatNumber(value: number | null) {
  if (value === null || value === undefined) return "Non défini";

  return value.toLocaleString("fr-FR");
}

function criteriaSummary(match: Match) {
  const criteria = [];

  if (match.city) criteria.push(match.city);
  if (match.area) criteria.push(match.area);
  if (match.max_price) {
    criteria.push(`budget max. ${formatNumber(match.max_price)}`);
  }
  if (match.min_surface) {
    criteria.push(`surface min. ${formatNumber(match.min_surface)} m²`);
  }
  if (match.min_rooms) {
    criteria.push(`${match.min_rooms} pièces min.`);
  }
  if (match.bedrooms) {
    criteria.push(`${match.bedrooms} chambres`);
  }

  return criteria.length ? criteria.join(" · ") : "Critères larges";
}

export default async function MatchesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.organization_id) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            Organisation introuvable.
          </p>
        </div>
      </main>
    );
  }

  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select(
      "id, title, public_slug, status, city, area, price, surface, rooms, bedrooms",
    )
    .eq("organization_id", profile.organization_id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const selectedProperty = properties?.[0] as Property | undefined;

  let matches: Match[] = [];
  let matchesError: string | null = null;

  if (selectedProperty) {
    const { data, error } = await supabase.rpc("match_property_alerts", {
      target_property_id: selectedProperty.id,
    });

    if (error) {
      matchesError = error.message;
    } else {
      matches = (data ?? []) as Match[];
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-slate-800 pb-8">
          <Link
            href="/dashboard"
            className="text-sm text-cyan-300 hover:underline"
          >
            ← Retour au tableau de bord
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Correspondances immobilières
          </h1>

          <p className="mt-3 text-slate-300">
            Découvrez les recherches correspondant à vos biens publiés.
          </p>
        </header>

        {!properties?.length || !selectedProperty ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
            <h2 className="text-2xl font-semibold">
              Aucun bien publié
            </h2>

            <p className="mt-3 text-slate-300">
              Publiez d’abord un bien pour rechercher des correspondances.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-block rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950"
            >
              Voir mes biens
            </Link>
          </section>
        ) : (
          <>
            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Bien analysé</p>

              <h2 className="mt-2 text-2xl font-semibold">
                {selectedProperty.title}
              </h2>

              <p className="mt-2 text-slate-300">
                {[selectedProperty.area, selectedProperty.city]
                  .filter(Boolean)
                  .join(", ") || "Localisation non renseignée"}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Prix</p>
                  <p className="mt-1 text-cyan-300">
                    {formatNumber(selectedProperty.price)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Surface</p>
                  <p className="mt-1">
                    {selectedProperty.surface
                      ? `${formatNumber(selectedProperty.surface)} m²`
                      : "Non défini"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Pièces</p>
                  <p className="mt-1">
                    {selectedProperty.rooms ?? "Non défini"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Correspondances</p>
                  <p className="mt-1 text-2xl font-bold text-cyan-300">
                    {matches.length}
                  </p>
                </div>
              </div>
            </section>

            {matchesError ? (
              <p className="mt-8 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
                Impossible de charger les correspondances.
              </p>
            ) : null}

            {!matches.length && !matchesError ? (
              <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
                <h2 className="text-2xl font-semibold">
                  Aucune correspondance
                </h2>

                <p className="mt-3 text-slate-300">
                  Aucune recherche active ne correspond actuellement à ce bien.
                </p>
              </section>
            ) : (
              <section className="mt-8 grid gap-5 md:grid-cols-2">
                {matches.map((match) => (
                  <article
                    key={match.alert_id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">
                          Recherche compatible
                        </p>

                        <h2 className="mt-2 text-xl font-semibold">
                          {match.transaction === "sale"
                            ? "Achat"
                            : "Location"}{" "}
                          · {match.property_type || "Tout type"}
                        </h2>
                      </div>

                      <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs text-emerald-200">
                        Correspond
                      </span>
                    </div>

                    <p className="mt-5 text-slate-300">
                      {criteriaSummary(match)}
                    </p>

                    <p className="mt-5 text-sm text-slate-500">
                      Langue de l’alerte : {match.language}
                    </p>

                    <button
                      type="button"
                      className="mt-6 w-full rounded-lg border border-cyan-400 px-4 py-3 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
                    >
                      Préparer une notification
                    </button>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}