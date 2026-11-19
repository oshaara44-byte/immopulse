"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Email ou mot de passe incorrect.");
        return;
      }

      setMessage("Connexion réussie.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-3 text-4xl font-bold">Se connecter</h1>

          <p className="mt-3 text-slate-300">
            Retrouvez vos biens, prospects et actions prioritaires.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>

            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Mot de passe
            </span>

            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-cyan-300 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
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