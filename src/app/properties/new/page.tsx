"use client";

import { FormEvent, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

type Transaction = "sale" | "rent";
type MediaType = "image" | "video";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export default function NewPropertyPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transaction, setTransaction] = useState<Transaction>("sale");
  const [propertyType, setPropertyType] = useState("apartment");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [rooms, setRooms] = useState("");
  const [surface, setSurface] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    const invalidType = selectedFiles.find(
      (file) => !IMAGE_TYPES.includes(file.type),
    );

    if (invalidType) {
      setMessage("Images autorisées : JPG, PNG ou WebP.");
      event.target.value = "";
      setImages([]);
      return;
    }

    const oversized = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE,
    );

    if (oversized) {
      setMessage("Chaque image doit faire au maximum 10 MB.");
      event.target.value = "";
      setImages([]);
      return;
    }

    setMessage("");
    setImages(selectedFiles);
  }

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setVideo(null);
      return;
    }

    if (!VIDEO_TYPES.includes(selectedFile.type)) {
      setMessage("Formats vidéo autorisés : MP4 ou WebM.");
      event.target.value = "";
      setVideo(null);
      return;
    }

    if (selectedFile.size > MAX_VIDEO_SIZE) {
      setMessage("La vidéo doit faire au maximum 50 MB.");
      event.target.value = "";
      setVideo(null);
      return;
    }

    setMessage("");
    setVideo(selectedFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.organization_id) {
        setMessage("Organisation introuvable.");
        return;
      }

      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          organization_id: profile.organization_id,
          created_by: user.id,
          title,
          description: description || null,
          transaction,
          property_type: propertyType,
          price: price ? Number(price) : null,
          currency,
          city: city || null,
          area: area || null,
          bedrooms: bedrooms ? Number(bedrooms) : null,
          rooms: rooms ? Number(rooms) : null,
          surface: surface ? Number(surface) : null,
          status: "draft",
        })
        .select("id")
        .single();

      if (propertyError || !property) {
        setMessage(
          propertyError?.message || "Impossible de créer le bien.",
        );
        return;
      }

      const selectedMedia: Array<{
        file: File;
        mediaType: MediaType;
        sortOrder: number;
        isCover: boolean;
      }> = [
        ...images.map((file, index) => ({
          file,
          mediaType: "image" as const,
          sortOrder: index,
          isCover: index === 0,
        })),
        ...(video
          ? [
              {
                file: video,
                mediaType: "video" as const,
                sortOrder: images.length,
                isCover: false,
              },
            ]
          : []),
      ];

      for (const media of selectedMedia) {
        const safeName = sanitizeFileName(media.file.name);
        const storagePath = `${profile.organization_id}/${property.id}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-media")
          .upload(storagePath, media.file, {
            cacheControl: "3600",
            upsert: false,
            contentType: media.file.type,
          });

        if (uploadError) {
          setMessage(`Échec du téléversement de ${media.file.name}.`);
          return;
        }

        const { error: mediaError } = await supabase
          .from("property_media")
          .insert({
            property_id: property.id,
            organization_id: profile.organization_id,
            media_type: media.mediaType,
            storage_path: storagePath,
            public_url: null,
            mime_type: media.file.type,
            file_name: media.file.name,
            file_size: media.file.size,
            sort_order: media.sortOrder,
            is_cover: media.isCover,
            created_by: user.id,
          });

        if (mediaError) {
          setMessage(
            `Le fichier ${media.file.name} a été envoyé, mais son enregistrement a échoué.`,
          );
          return;
        }
      }

      router.push("/properties");
      router.refresh();
    } catch {
      setMessage("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/properties"
          className="text-sm text-cyan-300 hover:underline"
        >
          ← Retour aux biens
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>
          <h1 className="mt-2 text-4xl font-bold">Ajouter un bien</h1>
          <p className="mt-3 text-slate-300">
            Commencez par enregistrer les informations essentielles du bien.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Titre</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Appartement lumineux avec terrasse"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Présentez les points forts du bien..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Transaction
              </span>
              <select
                value={transaction}
                onChange={(event) =>
                  setTransaction(event.target.value as Transaction)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Type de bien
              </span>
              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="land">Terrain</option>
                <option value="office">Bureau</option>
                <option value="other">Autre</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Prix</span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Devise
              </span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="XOF">XOF</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Ville</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Zone</span>
              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Chambres
              </span>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(event) => setBedrooms(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Pièces
              </span>
              <input
                type="number"
                min="0"
                value={rooms}
                onChange={(event) => setRooms(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Surface (m²)
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={surface}
                onChange={(event) => setSurface(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <section className="space-y-5 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <div>
              <h2 className="text-lg font-semibold">Médias du bien</h2>
              <p className="mt-1 text-sm text-slate-400">
                Ajoutez des images et une vidéo pour préparer la page publique
                du bien.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Images
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
              />
              <span className="mt-2 block text-xs text-slate-500">
                JPG, PNG ou WebP · 10 MB maximum par image.
              </span>
              {images.length > 0 ? (
                <span className="mt-2 block text-sm text-cyan-300">
                  {images.length} image(s) sélectionnée(s).
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Vidéo
              </span>
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoChange}
                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
              />
              <span className="mt-2 block text-xs text-slate-500">
                MP4 ou WebM · 50 MB maximum.
              </span>
              {video ? (
                <span className="mt-2 block text-sm text-cyan-300">
                  Vidéo sélectionnée : {video.name}
                </span>
              ) : null}
            </label>
          </section>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer le bien"}
          </button>

          {message ? (
            <p className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}