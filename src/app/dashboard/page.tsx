import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TrialCountdown from "@/components/TrialCountdown";

const planLabels: Record<string, string> = {
  essential: "Essentiel",
  professional: "Professionnel",
  agency: "Agence",
};

const trialStatusLabels: Record<string, string> = {
  registered: "Inscription enregistrée",
  trial_active: "Essai actif",
  trial_expiring: "Essai bientôt terminé",
  trial_expired: "Essai terminé",
  plan_selected: "Forfait sélectionné",
  payment_pending: "Paiement en attente",
  active_subscriber: "Abonnement actif",
  cancelled: "Annulé",
  data_deletion_requested: "Suppression demandée",
};

const roleLabels: Record<string, string> = {
  agent: "Agent immobilier",
  agency_admin: "Administrateur d’agence",
  buyer: "Acheteur",
  tenant: "Locataire",
  platform_admin: "Administrateur plateforme",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: trial }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, preferred_language, role, organization_id")
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("trials")
      .select("status, mode, starts_at, ends_at, selected_plan")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const endsAt = trial?.ends_at
    ? new Date(trial.ends_at).toLocaleDateString("fr-FR")
    : "Non disponible";

  const readableRole = profile?.role
    ? roleLabels[profile.role] || profile.role
    : "Non défini";

  const readableTrialStatus = trial?.status
    ? trialStatusLabels[trial.status] || trial.status
    : "Non disponible";

  const readablePlan = trial?.selected_plan
    ? planLabels[trial.selected_plan] || trial.selected_plan
    : "À choisir";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              ImmoPulse
            </p>

            <h1 className="mt-2 text-4xl font-bold">Tableau de bord</h1>

            <p className="mt-2 text-slate-300">
              Bienvenue {profile?.full_name || user.email}.
            </p>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              Se déconnecter
            </button>
          </form>
        </header>

        <TrialCountdown
          endsAt={trial?.ends_at ?? null}
          status={trial?.status ?? null}
        />

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Profil</p>

            <h2 className="mt-2 text-xl font-semibold">{readableRole}</h2>

            <p className="mt-2 text-sm text-slate-400">
              Langue : {profile?.preferred_language || "en"}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Statut de l’essai</p>

            <h2 className="mt-2 text-xl font-semibold text-cyan-300">
              {readableTrialStatus}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Mode : {trial?.mode || "discovery"}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Fin de l’essai</p>

            <h2 className="mt-2 text-xl font-semibold">{endsAt}</h2>

            <p className="mt-2 text-sm text-slate-400">
              Forfait : {readablePlan}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-semibold">Prochaines actions</h2>

          <p className="mt-3 max-w-2xl text-slate-300">
            Ajoutez votre premier bien, centralisez vos prospects et préparez
            vos premières relances. Les fonctions seront ajoutées
            progressivement.
          </p>
        </section>
      </div>
    </main>
  );
}