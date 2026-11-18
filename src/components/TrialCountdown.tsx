"use client";

import { useEffect, useMemo, useState } from "react";

type TrialCountdownProps = {
  endsAt: string | null;
  status: string | null;
};

function calculateDaysRemaining(
  endsAt: string | null,
  now: number,
): number | null {
  if (!endsAt) return null;

  const end = new Date(endsAt).getTime();
  const difference = end - now;

  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

export default function TrialCountdown({
  endsAt,
  status,
}: TrialCountdownProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const calculatedDays = useMemo(
    () => calculateDaysRemaining(endsAt, now),
    [endsAt, now],
  );

  if (
    calculatedDays === null ||
    status === "trial_expired" ||
    status === "cancelled"
  ) {
    return (
      <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-950/30 p-4 text-amber-200">
        Votre période d’essai est terminée. Choisissez un forfait pour
        continuer.
      </div>
    );
  }

  if (calculatedDays === 0) {
    return (
      <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-950/30 p-4 text-amber-200">
        Votre période d’essai expire aujourd’hui. Choisissez un forfait pour
        continuer.
      </div>
    );
  }

  const daysRemaining = calculatedDays;
  const formattedEndDate = endsAt
    ? new Date(endsAt).toLocaleDateString("fr-FR")
    : "";

  const tone =
    daysRemaining <= 3
      ? "border-red-500/40 bg-red-950/30 text-red-200"
      : daysRemaining <= 7
        ? "border-amber-500/40 bg-amber-950/30 text-amber-200"
        : "border-cyan-500/40 bg-cyan-950/30 text-cyan-200";

  return (
    <div className={`mt-4 rounded-lg border p-4 ${tone}`}>
      <p className="font-semibold">
        Il vous reste {daysRemaining} jour
        {daysRemaining > 1 ? "s" : ""} d’essai gratuit.
      </p>

      <p className="mt-1 text-sm opacity-80">
        Votre essai se termine le {formattedEndDate}.
      </p>
    </div>
  );
}