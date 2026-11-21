"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Locale = "en" | "fr" | "es";

const content = {
  en: {
    welcome: "Welcome to ImmoPulse",
    chooseLanguage: "Choose your language to continue.",
    chooseProfile: "How would you like to use ImmoPulse?",
    agent: "I am a real estate professional",
    seeker: "I am looking for an apartment, house or home",
    agentDescription:
      "Manage your properties, prospects and follow-ups.",
    seekerDescription:
      "Search for properties and receive personalized alerts.",
  },
  fr: {
    welcome: "Bienvenue sur ImmoPulse",
    chooseLanguage: "Choisissez votre langue pour continuer.",
    chooseProfile: "Comment souhaitez-vous utiliser ImmoPulse ?",
    agent: "Je suis un professionnel de l’immobilier",
    seeker: "Je recherche un appartement, une maison ou un logement",
    agentDescription:
      "Gérez vos biens, vos prospects et vos relances.",
    seekerDescription:
      "Recherchez un bien et recevez des alertes personnalisées.",
  },
  es: {
    welcome: "Bienvenido a ImmoPulse",
    chooseLanguage: "Elige tu idioma para continuar.",
    chooseProfile: "¿Cómo quieres utilizar ImmoPulse?",
    agent: "Soy un profesional inmobiliario",
    seeker: "Busco un apartamento, una casa o una vivienda",
    agentDescription:
      "Gestiona tus propiedades, prospectos y seguimientos.",
    seekerDescription:
      "Busca una propiedad y recibe alertas personalizadas.",
  },
};

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialLocale =
    searchParams.get("locale") === "fr" ||
    searchParams.get("locale") === "es"
      ? (searchParams.get("locale") as Locale)
      : "en";

  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("immopulse_locale");

    if (savedLocale === "en" || savedLocale === "fr" || savedLocale === "es") {
      setLocale(savedLocale);
    }
  }, []);

  function changeLocale(value: Locale) {
    setLocale(value);
    window.localStorage.setItem("immopulse_locale", value);
  }

  function goTo(path: "/agents" | "/search") {
    router.push(`${path}?locale=${locale}`);
  }

  const text = content[locale];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-6 text-4xl font-bold sm:text-6xl">
            {text.welcome}
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            {text.chooseLanguage}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            {(["en", "fr", "es"] as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeLocale(item)}
                className={`rounded-lg px-5 py-3 text-sm font-semibold ${
                  locale === item
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
                }`}
              >
                {item === "en"
                  ? "English"
                  : item === "fr"
                    ? "Français"
                    : "Español"}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-center text-2xl font-semibold">
            {text.chooseProfile}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => goTo("/agents")}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition hover:border-cyan-400 hover:bg-slate-800"
            >
              <span className="text-3xl">🏢</span>

              <h3 className="mt-5 text-2xl font-semibold">
                {text.agent}
              </h3>

              <p className="mt-3 text-slate-300">
                {text.agentDescription}
              </p>

              <span className="mt-6 inline-block text-cyan-300">
                Continuer →
              </span>
            </button>

            <button
              type="button"
              onClick={() => goTo("/search")}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left transition hover:border-cyan-400 hover:bg-slate-800"
            >
              <span className="text-3xl">🏠</span>

              <h3 className="mt-5 text-2xl font-semibold">
                {text.seeker}
              </h3>

              <p className="mt-3 text-slate-300">
                {text.seekerDescription}
              </p>

              <span className="mt-6 inline-block text-cyan-300">
                Continuer →
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function WelcomeFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <p className="text-slate-300">Chargement...</p>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<WelcomeFallback />}>
      <WelcomeContent />
    </Suspense>
  );
}