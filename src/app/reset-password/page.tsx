"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsReady(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setIsReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmation) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.",
      );
      setPassword("");
      setConfirmation("");
    } catch {
      setMessage("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/login"
          className="text-sm text-cyan-300 hover:underline"
        >
          ← Retour à la connexion
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Réinitialiser le mot de passe
          </h1>

          <p className="mt-3 text-slate-300">
            Choisissez un nouveau mot de passe sécurisé.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Nouveau mot de passe
            </span>

            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Confirmer le mot de passe
            </span>

            <input
              required
              minLength={8}
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <button
            disabled={isLoading || !isReady}
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Modification..." : "Modifier le mot de passe"}
          </button>

          {!isReady ? (
            <p className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-200">
              Ouvrez cette page depuis le lien reçu par email.
            </p>
          ) : null}

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