"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

type PlanCode = "essential" | "professional" | "agency";

const planDetails: Record<
  PlanCode,
  {
    name: string;
    monthlyPrice: number;
    setupPrice: number;
  }
> = {
  essential: {
    name: "Essentiel",
    monthlyPrice: 39,
    setupPrice: 49,
  },
  professional: {
    name: "Professionnel",
    monthlyPrice: 59,
    setupPrice: 79,
  },
  agency: {
    name: "Agence",
    monthlyPrice: 129,
    setupPrice: 149,
  },
};

export default function SelectPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");

  const [message, setMessage] = useState("Chargement...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function selectPlan() {
      if (
        requestedPlan !== "essential" &&
        requestedPlan !== "professional" &&
        requestedPlan !== "agency"
      ) {
        setMessage("Forfait invalide.");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/pricing/select?plan=${requestedPlan}`);
        return;
      }

      const { data: trial, error: trialError } = await supabase
        .from("trials")
        .select("id, status, ends_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (trialError || !trial) {
        setMessage("Essai introuvable.");
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("trials")
        .update({
          selected_plan: requestedPlan,
          status:
            trial.status === "trial_expired"
              ? "trial_expired"
              : "plan_selected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", trial.id)
        .eq("user_id", user.id);

      if (updateError) {
        setMessage("Impossible d’enregistrer votre choix.");
        setIsLoading(false);
        return;
      }

      setMessage("Forfait sélectionné.");
      setIsLoading(false);
    }

    selectPlan();
  }, [requestedPlan, router]);

  const selectedPlan =
    requestedPlan && requestedPlan in planDetails
      ? planDetails[requestedPlan as PlanCode]
      : null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/pricing"
          className="text-sm text-cyan-300 hover:underline"
        >
          ← Retour aux tarifs
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {selectedPlan
              ? `Forfait ${selectedPlan.name}`
              : "Sélection du forfait"}
          </h1>

          {selectedPlan ? (
            <div className="mt-6 rounded-xl bg-slate-950 p-5">
              <p className="text-3xl font-bold">
                {selectedPlan.monthlyPrice} €{" "}
                <span className="text-base font-normal text-slate-400">
                  / mois
                </span>
              </p>

              <p className="mt-2 text-slate-400">
                Mise en place : {selectedPlan.setupPrice} €
              </p>
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            <p className="text-slate-300">{message}</p>

            <p className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-4 text-sm text-cyan-200">
              Votre essai gratuit de 14 jours reste actif. Aucun paiement
              n’est effectué dans cette version de test.
            </p>
          </div>

          {!isLoading && message === "Forfait sélectionné." ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Retour au tableau de bord
              </Link>

              <Link
                href="/pricing"
                className="rounded-lg border border-slate-700 px-4 py-3 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
              >
                Voir les autres forfaits
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}