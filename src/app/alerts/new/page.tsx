"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Transaction = "sale" | "rent";

export default function NewAlertPage() {
  const [email, setEmail] = useState("");
  const [transaction, setTransaction] = useState<Transaction>("sale");
  const [propertyType, setPropertyType] = useState("apartment");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSurface, setMinSurface] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [language, setLanguage] = useState("en");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("property_alerts").insert({
        owner_id: user?.id ?? null,
        email,
        transaction,
        property_type: propertyType,
        city: city || null,
        area: area || null,
        min_price: minPrice ? Number(minPrice) : null,
        max_price: maxPrice ? Number(maxPrice) : null,
        min_surface: minSurface ? Number(minSurface) : null,
        min_rooms: minRooms ? Number(minRooms) : null,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        language,
        is_active: true,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Votre alerte est créée. Vous recevrez les offres correspondant à vos critères.",
      );

      setCity("");
      setArea("");
      setMinPrice("");
      setMaxPrice("");
      setMinSurface("");
      setMinRooms("");
      setBedrooms("");
    } catch {
      setMessage("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          ImmoPulse
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Recevez les biens qui vous correspondent
        </h1>

        <p className="mt-4 text-slate-300">
          Définissez vos critères et soyez prévenu lorsqu’une offre
          intéressante est disponible.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Votre email
            </span>

            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Recherche
              </span>

              <select
                value={transaction}
                onChange={(event) =>
                  setTransaction(event.target.value as Transaction)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >
                <option value="sale">Acheter</option>
                <option value="rent">Louer</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Type de bien
              </span>

              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
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
              <span className="mb-2 block text-sm text-slate-300">Ville</span>

              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Zone</span>

              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Budget minimum
              </span>

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Budget maximum
              </span>

              <input
                required
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Surface minimale
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={minSurface}
                onChange={(event) => setMinSurface(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Pièces minimum
              </span>

              <input
                type="number"
                min="0"
                value={minRooms}
                onChange={(event) => setMinRooms(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Chambres
              </span>

              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(event) => setBedrooms(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Langue des alertes
            </span>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </label>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Création..." : "Créer mon alerte"}
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