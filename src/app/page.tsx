"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Test en cours...");

  useEffect(() => {
    try {
      const supabase = createClient();

      if (supabase) {
        setStatus("Client Supabase initialisé correctement.");
      }
    } catch {
      setStatus("Erreur : variables Supabase absentes.");
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Test Supabase</h1>
        <p className="mt-4 text-slate-300">{status}</p>
      </div>
    </main>
  );
}