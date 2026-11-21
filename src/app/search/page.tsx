"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Transaction = "sale" | "rent";

type Property = {
  id: string;
  title: string;
  description: string | null;
  transaction: Transaction;
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

type SearchResponse = {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error?: string;
};

export default function SearchPage() {
  const [transaction, setTransaction] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSurface, setMinSurface] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    const values = {
      transaction,
      property_type: propertyType,
      city,
      area,
      min_price: minPrice,
      max_price: maxPrice,
      min_surface: minSurface,
      min_rooms: minRooms,
      bedrooms,
      page: String(page),
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return params.toString();
  }, [
    transaction,
    propertyType,
    city,
    area,
    minPrice,
    maxPrice,
    minSurface,
    minRooms,
    bedrooms,
    page,
  ]);

  const alertQueryString = useMemo(() => {
    const params = new URLSearchParams();

    const values = {
      transaction,
      property_type: propertyType,
      city,
      area,
      min_price: minPrice,
      max_price: maxPrice,
      min_surface: minSurface,
      min_rooms: minRooms,
      bedrooms,
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return params.toString();
  }, [
    transaction,
    propertyType,
    city,
    area,
    minPrice,
    maxPrice,
    minSurface,
    minRooms,
    bedrooms,
  ]);

  async function loadProperties() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/properties/search?${queryString}`,
        {
          cache: "no-store",
        },
      );

      const result = (await response.json()) as SearchResponse;

      if (!response.ok) {
        setMessage(result.error || "Impossible de charger les biens.");
        setProperties([]);
        setTotal(0);
        return;
      }

      setProperties(result.properties);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      setMessage("Impossible de contacter le serveur.");
      setProperties([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProperties();
  }, [queryString]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
  }

  function resetFilters() {
    setTransaction("");
    setPropertyType("");
    setCity("");
    setArea("");
    setMinPrice("");
    setMaxPrice("");
    setMinSurface("");
    setMinRooms("");
    setBedrooms("");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-800 pb-8">
          <Link
            href="/"
            className="text-sm text-cyan-300 hover:underline"
          >
            ← Changer de profil
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                ImmoPulse
              </p>

              <h1 className="mt-3 text-4xl font-bold">
                Rechercher un bien
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Filtrez les biens disponibles selon vos critères et créez une
                alerte pour recevoir les prochaines offres correspondantes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                S’inscrire
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-slate-700 px-4 py-3 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Vos critères de recherche
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Les résultats sont chargés progressivement pour éviter de
                parcourir toute la base.
              </p>
            </div>

            <Link
              href={`/alerts/new?${alertQueryString}`}
              className="rounded-lg border border-cyan-400 px-4 py-3 text-center text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
            >
              Créer une alerte
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Recherche
                </span>

                <select
                  value={transaction}
                  onChange={(event) => {
                    setTransaction(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                >
                  <option value="">Vente ou location</option>
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
                  onChange={(event) => {
                    setPropertyType(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                >
                  <option value="">Tous les types</option>
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="land">Terrain</option>
                  <option value="office">Bureau</option>
                  <option value="other">Autre</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Ville
                </span>

                <input
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Ex. Cotonou"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Zone
                </span>

                <input
                  value={area}
                  onChange={(event) => {
                    setArea(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Ex. Cocotiers"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Prix minimum
                </span>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Prix maximum
                </span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Surface minimale
                </span>

                <input
                  type="number"
                  min="0"
                  value={minSurface}
                  onChange={(event) => {
                    setMinSurface(event.target.value);
                    setPage(1);
                  }}
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
                  onChange={(event) => {
                    setMinRooms(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="block w-full md:max-w-xs">
                <span className="mb-2 block text-sm text-slate-300">
                  Chambres minimum
                </span>

                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(event) => {
                    setBedrooms(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                >
                  Rechercher
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-700 px-5 py-3 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Résultats</h2>

            <p className="text-sm text-slate-400">
              {total} bien{total > 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <p className="text-slate-300">Recherche en cours...</p>
            </div>
          ) : message ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-8">
              <p className="text-red-200">{message}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-semibold">
                Aucun bien ne correspond à vos critères
              </h3>

              <p className="mt-3 text-slate-300">
                Créez une alerte afin d’être informé lorsqu’un bien
                correspondant sera publié.
              </p>

              <Link
                href={`/alerts/new?${alertQueryString}`}
                className="mt-6 inline-block rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Créer une alerte
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
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
                      <span>{property.rooms ?? "—"} pièces</span>
                      <span>{property.bedrooms ?? "—"} chambres</span>
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

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Précédente
                </button>

                <span className="text-sm text-slate-400">
                  Page {page} sur {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivante
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}