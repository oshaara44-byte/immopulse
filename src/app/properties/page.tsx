import AppNavigation from "@/components/AppNavigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Property = {
  id: string;
  title: string;
  transaction: "sale" | "rent";
  property_type: string;
  price: number | null;
  city: string | null;
  area: string | null;
  status: "draft" | "published" | "archived" | "sold" | "rented";
};

export default async function PropertiesPage() {
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

  const { data: properties, error } = profile?.organization_id
    ? await supabase
        .from("properties")
        .select(
          "id, title, transaction, property_type, price, city, area, status",
        )
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><AppNavigation />
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              ImmoPulse
            </p>
            <h1 className="mt-2 text-4xl font-bold">Mes biens</h1>
            <p className="mt-2 text-slate-300">
              Gérez les biens liés à votre espace immobilier.
            </p>
          </div>

          <Link
            href="/properties/new"
            className="rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Ajouter un bien
          </Link>
        </header>

        {error ? (
          <p className="mt-8 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            Impossible de charger les biens.
          </p>
        ) : null}

        {!properties?.length ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
            <h2 className="text-2xl font-semibold">Aucun bien pour le moment</h2>
            <p className="mt-3 text-slate-300">
              Ajoutez votre premier bien pour commencer à recevoir et suivre
              des demandes.
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(properties as Property[]).map((property) => (
              <article
                key={property.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold">{property.title}</h2>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {property.status}
                  </span>
                </div>

                <p className="mt-4 text-slate-300">
                  {property.property_type} ·{" "}
                  {property.transaction === "sale" ? "Vente" : "Location"}
                </p>

                <p className="mt-2 text-cyan-300">
                  {property.price
                    ? `${property.price.toLocaleString("fr-FR")} €`
                    : "Prix à renseigner"}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {[property.area, property.city].filter(Boolean).join(", ") ||
                    "Localisation non renseignée"}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}