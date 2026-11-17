import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProspectActionControls from "@/components/ProspectActionControls";

type ActionProspect = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  request: string | null;
  status: string;
  priority: number;
  last_contact_at: string | null;
  next_action_at: string | null;
  created_at: string;
  notes: string | null;
  property: {
    title: string;
  } | null;
};

function priorityLabel(priority: number) {
  if (priority === 1) return "Haute";
  if (priority === 3) return "Faible";
  return "Moyenne";
}

function formatDate(value: string | null) {
  if (!value) return "À définir";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getActionLabel(prospect: ActionProspect) {
  if (prospect.request === "visit") {
    return "Confirmer la demande de visite";
  }

  if (!prospect.last_contact_at) {
    return "Effectuer le premier contact";
  }

  if (prospect.next_action_at) {
    return "Effectuer la relance prévue";
  }

  return "Définir la prochaine action";
}

export default async function ActionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.organization_id) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            Organisation introuvable.
          </p>
        </div>
      </main>
    );
  }

  const now = new Date().toISOString();

  const { data: prospects, error } = await supabase
    .from("prospects")
    .select(
      `
        id,
        full_name,
        email,
        phone,
        request,
        status,
        priority,
        last_contact_at,
        next_action_at,
        created_at,
        notes,
        property:properties (
          title
        )
      `,
    )
    .eq("organization_id", profile.organization_id)
    .not("status", "in", '("converted","not_relevant","archived")')
    .or(`next_action_at.lte.${now},next_action_at.is.null`)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  const typedProspects = (prospects ?? []) as unknown as ActionProspect[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-slate-800 pb-8">
          <Link
            href="/dashboard"
            className="text-sm text-cyan-300 hover:underline"
          >
            ← Retour au tableau de bord
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Actions du jour</h1>
              <p className="mt-3 text-slate-300">
                Voici les prospects qui nécessitent votre attention.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
              <p className="text-sm text-slate-400">Actions à traiter</p>
              <p className="mt-1 text-2xl font-bold">
                {typedProspects.length}
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <p className="mt-8 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            Impossible de charger les actions.
          </p>
        ) : null}

        {!typedProspects.length ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
            <h2 className="text-2xl font-semibold">
              Aucune action urgente
            </h2>

            <p className="mt-3 text-slate-300">
              Les demandes à traiter apparaîtront ici.
            </p>
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            {typedProspects.map((prospect) => (
              <article
                key={prospect.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold">
                        {prospect.full_name || "Contact sans nom"}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          prospect.priority === 1
                            ? "bg-red-950 text-red-200"
                            : prospect.priority === 3
                              ? "bg-slate-800 text-slate-400"
                              : "bg-amber-950 text-amber-200"
                        }`}
                      >
                        Priorité {priorityLabel(prospect.priority)}
                      </span>
                    </div>

                    <p className="mt-3 text-slate-300">
                      {prospect.property?.title || "Bien non renseigné"}
                    </p>

                    <p className="mt-2 text-cyan-300">
                      {getActionLabel(prospect)}
                    </p>
                  </div>

                  <div className="text-left text-sm text-slate-400 lg:text-right">
                    <p>Créé le {formatDate(prospect.created_at)}</p>
                    <p className="mt-1">
                      Prochaine action : {formatDate(prospect.next_action_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-slate-800 pt-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Email
                    </p>
                    <p className="mt-1 break-all text-slate-200">
                      {prospect.email || "Non renseigné"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Téléphone
                    </p>
                    <p className="mt-1 text-slate-200">
                      {prospect.phone || "Non renseigné"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Statut
                    </p>
                    <p className="mt-1 text-slate-200">{prospect.status}</p>
                  </div>
                </div>

                {prospect.notes ? (
                  <p className="mt-5 rounded-lg bg-slate-950 p-4 text-sm text-slate-300">
                    {prospect.notes}
                  </p>
                ) : null}

                <ProspectActionControls
                  prospectId={prospect.id}
                  initialStatus={prospect.status}
                  initialPriority={prospect.priority}
                  initialNextActionAt={prospect.next_action_at}
                  initialNotes={prospect.notes}
                />
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}