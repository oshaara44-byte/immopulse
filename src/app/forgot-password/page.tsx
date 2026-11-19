"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const supabase = createClient();

      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Si cette adresse possède un compte, un email de réinitialisation a été envoyé.",
      );
    } catch {
      setMessage("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <Link href="/login" className="text-sm text-cyan-300 hover:underline">
          ← Retour à la connexion
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Mot de passe oublié
          </h1>

          <p className="mt-3 text-slate-300">
            Saisissez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>

            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {isLoading ? "Envoi..." : "Envoyer le lien"}
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