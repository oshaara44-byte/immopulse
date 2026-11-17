"use client";

import { useState } from "react";

const statuses = [
  ["new", "Nouveau"],
  ["to_qualify", "À qualifier"],
  ["to_follow_up", "À relancer"],
  ["visit_scheduled", "Visite planifiée"],
  ["visit_completed", "Visite réalisée"],
  ["offer", "Offre"],
  ["converted", "Converti"],
  ["not_relevant", "Non pertinent"],
  ["archived", "Archivé"],
] as const;

type ProspectActionControlsProps = {
  prospectId: string;
  initialStatus: string;
  initialPriority: number;
  initialNextActionAt: string | null;
  initialNotes: string | null;
};

export default function ProspectActionControls({
  prospectId,
  initialStatus,
  initialPriority,
  initialNextActionAt,
  initialNotes,
}: ProspectActionControlsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(String(initialPriority));
  const [nextActionAt, setNextActionAt] = useState(
    initialNextActionAt ? initialNextActionAt.slice(0, 16) : "",
  );
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveChanges() {
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/prospects/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prospectId,
          status,
          priority: Number(priority),
          nextActionAt: nextActionAt
            ? new Date(nextActionAt).toISOString()
            : null,
          notes: notes || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Impossible d’enregistrer.");
        return;
      }

      setMessage("Enregistré.");
    } catch {
      setMessage("Erreur de connexion.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-5 border-t border-slate-800 pt-5">
      <h3 className="text-sm font-semibold text-slate-200">
        Mettre à jour l’action
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs text-slate-400">Statut</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          >
            {statuses.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs text-slate-400">Priorité</span>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          >
            <option value="1">Haute</option>
            <option value="2">Moyenne</option>
            <option value="3">Faible</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs text-slate-400">
            Prochaine action
          </span>
          <input
            type="datetime-local"
            value={nextActionAt}
            onChange={(event) => setNextActionAt(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs text-slate-400">Note</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Ajoutez une note de suivi..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={saveChanges}
          disabled={isSaving}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>

        {message ? (
          <span className="text-sm text-slate-300">{message}</span>
        ) : null}
      </div>
    </div>
  );
}