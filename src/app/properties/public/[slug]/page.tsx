import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PublicInquiryForm from "@/components/PublicInquiryForm";

type PublicPropertyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Property = {
  id: string;
  organization_id: string;
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

type PropertyMedia = {
  id: string;
  media_type: "image" | "video";
  storage_path: string;
  file_name: string;
  sort_order: number;
  is_cover: boolean;
  signed_url?: string;
};

export default async function PublicPropertyPage({
  params,
}: PublicPropertyPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select(
      "id, organization_id, title, description, transaction, property_type, price, currency, city, area, bedrooms, rooms, surface, status",
    )
    .eq("public_slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (propertyError || !property) {
    notFound();
  }

  const { data: mediaRows } = await supabase
    .from("property_media")
    .select(
      "id, media_type, storage_path, file_name, sort_order, is_cover",
    )
    .eq("property_id", property.id)
    .order("sort_order", { ascending: true });

  const media: PropertyMedia[] = [];

  for (const mediaRow of mediaRows ?? []) {
    const { data: signedData } = await supabase.storage
      .from("property-media")
      .createSignedUrl(mediaRow.storage_path, 60 * 60);

    media.push({
      ...mediaRow,
      signed_url: signedData?.signedUrl,
    });
  }

  const images = media.filter(
    (item) => item.media_type === "image" && item.signed_url,
  );

  const videos = media.filter(
    (item) => item.media_type === "video" && item.signed_url,
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-4 text-4xl font-bold">{property.title}</h1>

          <p className="mt-3 text-slate-300">
            {property.property_type} ·{" "}
            {property.transaction === "sale" ? "Vente" : "Location"}
          </p>
        </header>

        {images.length > 0 ? (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
              >
                <img
                  src={image.signed_url}
                  alt={`${property.title} - ${image.file_name}`}
                  className="h-72 w-full object-cover"
                />
              </figure>
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
            <p className="text-slate-300">
              Les images de ce bien seront bientôt disponibles.
            </p>
          </section>
        )}

        {videos.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Vidéo du bien</h2>

            <div className="mt-4 space-y-4">
              {videos.map((video) => (
                <video
                  key={video.id}
                  controls
                  preload="metadata"
                  className="w-full rounded-2xl border border-slate-800 bg-black"
                  src={video.signed_url}
                >
                  Votre navigateur ne prend pas en charge la lecture vidéo.
                </video>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Présentation du bien</h2>

            <p className="mt-4 whitespace-pre-wrap text-slate-300">
              {property.description ||
                "Aucune description disponible pour le moment."}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Prix</dt>
                <dd className="mt-1 text-xl font-semibold text-cyan-300">
                  {property.price
                    ? `${property.price.toLocaleString("fr-FR")} ${property.currency}`
                    : "Prix à renseigner"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Localisation</dt>
                <dd className="mt-1 text-slate-200">
                  {[property.area, property.city].filter(Boolean).join(", ") ||
                    "Non renseignée"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Pièces</dt>
                <dd className="mt-1 text-slate-200">
                  {property.rooms ?? "Non renseigné"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Chambres</dt>
                <dd className="mt-1 text-slate-200">
                  {property.bedrooms ?? "Non renseigné"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Surface</dt>
                <dd className="mt-1 text-slate-200">
                  {property.surface
                    ? `${property.surface} m²`
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

            <PublicInquiryForm
              propertyId={property.id}
              organizationId={property.organization_id}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}