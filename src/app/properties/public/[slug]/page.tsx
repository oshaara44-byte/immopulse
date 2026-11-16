import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PublicPropertyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
  status: "draft" | "published" | "archived" | "sold" | "rented";
};

export default async function PublicPropertyPage({
  params,
}: PublicPropertyPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select(
      "id, title, description, transaction, property_type, price, currency, city, area, bedrooms, rooms, surface, status",
    )
    .eq("public_slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !property) {
    notFound();
  }

  const typedProperty = property as Property;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>
          <h1 className="mt-4 text-4xl font-bold">{typedProperty.title}</h1>
          <p className="mt-3 text-slate-300">
            {typedProperty.property_type} ·{" "}
            {typedProperty.transaction === "sale" ? "Vente" : "Location"}
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Présentation du bien</h2>

            <p className="mt-4 whitespace-pre-wrap text-slate-300">
              {typedProperty.description ||
                "Aucune description disponible pour le moment."}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Prix</dt>
                <dd className="mt-1 text-xl font-semibold text-cyan-300">
                  {typedProperty.price
                    ? `${typedProperty.price.toLocaleString("fr-FR")} ${typedProperty.currency}`
                    : "Prix à renseigner"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Localisation</dt>
                <dd className="mt-1 text-slate-200">
                  {[typedProperty.area, typedProperty.city]
                    .filter(Boolean)
                    .join(", ") || "Non renseignée"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Pièces</dt>
                <dd className="mt-1 text-slate-200">
                  {typedProperty.rooms ?? "Non renseigné"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Chambres</dt>
                <dd className="mt-1 text-slate-200">
                  {typedProperty.bedrooms ?? "Non renseigné"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Surface</dt>
                <dd className="mt-1 text-slate-200">
                  {typedProperty.surface
                    ? `${typedProperty.surface} m²`
                    : "Non renseignée"}
                </dd>
              </div>
            </dl>
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Intéressé ?</h2>
            <p className="mt-3 text-slate-300">
              Demandez des informations ou proposez un créneau de visite.
            </p>

            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Demander une visite
            </button>

            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-3 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              Recevoir des biens similaires
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}