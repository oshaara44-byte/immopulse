import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Property = {
  id: string;
  title: string;
  description: string | null;
  transaction: "sale" | "rent";
  property_type: string;
  price: number | null;
  currency: string;
  city: string | null;
  area: string | null;
  bedrooms: number | null;
  rooms: number | null;
  surface: number | null;
  public_slug: string | null;
};

export default async function SearchPage() {
  const supabase = await createClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select(
      "id, title, description, transaction, property_type, price, currency, city, area, bedrooms, rooms, surface, public_slug",
    )
    .eq("status", "published")
    .not("public_slug", "is", null)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-800 pb-8">
          <Link
            href="/"
            className="text-sm text-cyan-300 hover:underline"
          >
            ← Retour à l’accueil
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Rechercher un bien
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Consultez les biens actuellement publiés et créez une alerte pour
            recevoir les offres correspondant à vos critères.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/alerts/new"
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Créer une alerte personnalisée
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-5 py-3 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              Se connecter
            </Link>
          </div>
        </header>

        {error ? (
          <p className="mt-8 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            Impossible de charger les biens pour le moment.
          </p>
        ) : null}

        {!properties?.length ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
            <h2 className="text-2xl font-semibold">
              Aucun bien disponible pour le moment
            </h2>

            <p className="mt-3 text-slate-300">
              Créez une alerte et nous vous préviendrons lorsqu’un bien
              correspondant sera publié.
            </p>

            <Link
              href="/alerts/new"
              className="mt-6 inline-block rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Créer mon alerte
            </Link>
          </section>
        ) : (
          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Biens disponibles
              </h2>

              <p className="text-sm text-slate-400">
                {properties.length} bien
                {properties.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(properties as Property[]).map((property) => (
                <article
                  key={property.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      {property.title}
                    </h3>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {property.transaction === "sale"
                        ? "Vente"
                        : "Location"}
                    </span>
                  </div>

                  <p className="mt-4 text-slate-300">
                    {property.property_type}
                  </p>

                  <p className="mt-2 text-cyan-300">
                    {property.price
                      ? `${property.price.toLocaleString("fr-FR")} ${property.currency}`
                      : "Prix à renseigner"}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {[property.area, property.city]
                      .filter(Boolean)
                      .join(", ") || "Localisation non renseignée"}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-400">
                    <span>
                      {property.rooms ?? "—"} pièces
                    </span>
                    <span>
                      {property.bedrooms ?? "—"} chambres
                    </span>
                    <span>
                      {property.surface
                        ? `${property.surface} m²`
                        : "—"}
                    </span>
                  </div>

                  {property.public_slug ? (
                    <Link
                      href={`/properties/public/${property.public_slug}`}
                      className="mt-6 block rounded-lg border border-cyan-400 px-4 py-3 text-center text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
                    >
                      Voir le bien
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}