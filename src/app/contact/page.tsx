"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

type UserType = "agent" | "buyer" | "tenant" | "other";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("other");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    if (!consent) {
      setStatusMessage(
        "Veuillez accepter d’être recontacté au sujet de votre message.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("contact_messages")
        .insert({
          full_name: fullName,
          email,
          user_type: userType,
          subject,
          message,
          consent_to_reply: consent,
        });

      if (error) {
        setStatusMessage(
          "Impossible d’envoyer votre message pour le moment.",
        );
        return;
      }

      setFullName("");
      setEmail("");
      setUserType("other");
      setSubject("");
      setMessage("");
      setConsent(false);
      setStatusMessage(
        "Votre message a bien été envoyé. Nous vous répondrons dès que possible.",
      );
    } catch {
      setStatusMessage("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-cyan-300 hover:underline"
        >
          ← Retour à l’accueil
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-3 text-4xl font-bold">Nous contacter</h1>

          <p className="mt-3 text-slate-300">
            Une question, un problème ou une suggestion ? Envoyez-nous un
            message.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Nom complet
            </span>

            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Email
            </span>

            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Vous êtes
            </span>

            <select
              value={userType}
              onChange={(event) =>
                setUserType(event.target.value as UserType)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="agent">Agent immobilier</option>
              <option value="buyer">Acheteur</option>
              <option value="tenant">Locataire</option>
              <option value="other">Autre</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Sujet
            </span>

            <input
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Comment pouvons-nous vous aider ?"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Message
            </span>

            <textarea
              required
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input
              required
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
            />

            <span>
              J’accepte d’être recontacté au sujet de ce message.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Envoi..." : "Envoyer le message"}
          </button>

          {statusMessage ? (
            <p className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
              {statusMessage}
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}