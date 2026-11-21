"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function handleAuthCode() {
      const code = searchParams.get("code");

      if (!code) {
        return;
      }

      setIsProcessing(true);

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        router.replace("/dashboard");
        router.refresh();
      } else {
        setIsProcessing(false);
      }
    }

    void handleAuthCode();
  }, [router, searchParams]);

  if (isProcessing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <p className="text-slate-300">Confirmation de votre compte...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between border-b border-slate-800 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              Se connecter
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Commencer gratuitement
            </Link>
          </div>
        </nav>

        <section className="grid gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Suivi immobilier intelligent
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-tight sm:text-6xl">
              Ne laissez plus vos prospects immobiliers refroidir.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              ImmoPulse aide les professionnels de lÔÇÖimmobilier ├á centraliser
              leurs demandes, suivre leurs biens et savoir chaque jour qui
              relancer.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Essai gratuit de 14 jours
              </Link>

              <Link
                href="/pricing"
                className="rounded-lg border border-slate-700 px-5 py-3 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
              >
                Voir les forfaits
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
            <p className="text-sm text-slate-400">Votre prochaine action</p>

            <h2 className="mt-3 text-2xl font-semibold">
              Relancer les bons prospects au bon moment.
            </h2>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-cyan-300">Demande de visite</p>
                <p className="mt-2 text-slate-200">
                  Appartement lumineux avec terrasse
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-cyan-300">Alerte immobili├¿re</p>
                <p className="mt-2 text-slate-200">
                  Un nouveau bien correspond aux crit├¿res dÔÇÖun chercheur.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-cyan-300">Essai gratuit</p>
                <p className="mt-2 text-slate-200">
                  Commencez sans paiement pendant 14 jours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <p className="text-slate-300">Chargement dÔÇÖImmoPulse...</p>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
