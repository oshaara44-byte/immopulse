"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type InquiryType = "information" | "visit";

type PublicInquiryFormProps = {
  propertyId: string;
  organizationId: string;
};

export default function PublicInquiryForm({
  propertyId,
  organizationId,
}: PublicInquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] =
    useState<InquiryType>("information");
  const [message, setMessage] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    if (!contactConsent) {
      setStatusMessage(
        "Veuillez accepter d’être recontacté au sujet de cette demande.",
      );
      return;
    }

    if (!email && !phone) {
      setStatusMessage("Indiquez un email ou un numéro de téléphone.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: prospectError } = await supabase
        .from("prospects")
        .insert({
          organization_id: organizationId,
          property_id: propertyId,
          full_name: fullName,
          email: email || null,
          phone: phone || null,
          source: "public_property_page",
          request: inquiryType,
          status: "new",
          priority: inquiryType === "visit" ? 1 : 2,
          notes: message || null,
        });

      if (prospectError) {
        setStatusMessage(
          "Impossible d’enregistrer la demande pour le moment.",
        );
        return;
      }

      setFullName("");
      setEmail("");
      setPhone("");
      setInquiryType("information");
      setMessage("");
      setContactConsent(false);
      setStatusMessage(
        "Votre demande a bien été envoyée. L’agent vous recontactera.",
      );
    } catch {
      setStatusMessage("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 border-t border-slate-800 pt-6"
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
        <span className="mb-2 block text-sm text-slate-300">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">
          Téléphone
        </span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">
          Type de demande
        </span>
        <select
          value={inquiryType}
          onChange={(event) =>
            setInquiryType(event.target.value as InquiryType)
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        >
          <option value="information">Demande d’informations</option>
          <option value="visit">Demande de visite</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">
          Message facultatif
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input
          required
          type="checkbox"
          checked={contactConsent}
          onChange={(event) => setContactConsent(event.target.checked)}
          className="mt-1"
        />
        <span>
          J’accepte d’être recontacté au sujet de cette demande.
        </span>
      </label>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Envoi..." : "Envoyer ma demande"}
      </button>

      {statusMessage ? (
        <p className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}