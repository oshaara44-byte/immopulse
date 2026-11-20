import AppNavigation from "@/components/AppNavigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Plan = {
  code: "essential" | "professional" | "agency";
  name: string;
  monthly_price: number;
  setup_price: number;
  max_users: number;
  max_properties: number;
  max_prospects: number;
};

const fallbackPlans: Plan[] = [
  {
    code: "essential",
    name: "Essentiel",
    monthly_price: 39,
    setup_price: 49,
    max_users: 1,
    max_properties: 2,
    max_prospects: 50,
  },
  {
    code: "professional",
    name: "Professionnel",
    monthly_price: 59,
    setup_price: 79,
    max_users: 1,
    max_properties: 10,
    max_prospects: 250,
  },
  {
    code: "agency",
    name: "Agence",
    monthly_price: 129,
    setup_price: 149,
    max_users: 5,
    max_properties: 30,
    max_prospects: 1000,
  },
];

const features: Record<Plan["code"], string[]> = {
  essential: [
    "Tableau de suivi des prospects",
    "Priorisation basique",
    "Modèles de relance",
    "Jusqu’à 2 biens",
    "Jusqu’à 50 prospects",
    "Scripts vidéo simples",
  ],
  professional: [
    "Toutes les fonctions Essentiel",
    "Actions du jour",
    "Suivi des visites",
    "Pages publiques de biens",
    "Formulaires de demande",
    "Jusqu’à 10 biens",
    "Jusqu’à 250 prospects",
    "Statistiques de base",
  ],
  agency: [
    "Toutes les fonctions Professionnel",
    "Jusqu’à 5 utilisateurs",
    "Répartition des prospects",
    "Tableau de bord d’équipe",
    "Modèles partagés",
    "Rapports d’agence",
    "Jusqu’à 30 biens",
    "Jusqu’à 1 000 prospects",
  ],
};

export default async function PricingPage() {
  const supabase = await createClient();

  const { data: databasePlans } = await supabase
    .from("plans")
    .select(
      "code, name, monthly_price, setup_price, max_users, max_properties, max_prospects",
    )
    .eq("is_active", true)
    .order("monthly_price", { ascending: true });

  const plans = (databasePlans?.length
    ? databasePlans
    : fallbackPlans) as Plan[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><AppNavigation />
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            ImmoPulse
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Choisissez le forfait adapté à votre activité
          </h1>

          <p className="mt-4 text-slate-300">
            Testez gratuitement toutes les fonctionnalités pendant 14 jours.
            Aucun paiement n’est effectué dans cette version de test.
          </p>

          <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-sm text-cyan-200">
            Votre essai gratuit de 14 jours commence à la création de votre
            compte. Vous pourrez choisir un forfait pendant ou après l’essai.
            Les paiements seront activés séparément dans la version
            commerciale.
          </div>
        </header>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.code}
              className={`rounded-2xl border p-6 ${
                plan.code === "professional"
                  ? "border-cyan-400 bg-slate-900 shadow-2xl shadow-cyan-950/30"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              {plan.code === "professional" ? (
                <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">
                  Recommandé
                </span>
              ) : null}

              <h2 className="mt-4 text-2xl font-semibold">{plan.name}</h2>

              <p className="mt-2 text-slate-400">
                {plan.code === "essential"
                  ? "Pour commencer simplement"
                  : plan.code === "professional"
                    ? "Pour les agents actifs"
                    : "Pour les petites équipes"}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold">
                  {plan.monthly_price} €
                </span>
                <span className="text-slate-400"> / mois</span>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Mise en place : {plan.setup_price} €
              </p>

              <p className="mt-4 rounded-lg bg-slate-950 p-3 text-sm text-cyan-200">
                14 jours gratuits · Aucun paiement maintenant
              </p>

              <ul className="mt-8 space-y-3">
                {features[plan.code].map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm text-slate-200"
                  >
                    <span className="text-cyan-300">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/pricing/select?plan=${plan.code}`}
                className="mt-8 block rounded-lg bg-cyan-400 px-4 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Choisir {plan.name}
              </Link>
            </article>
          ))}
        </section>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-slate-500">
          Le montage vidéo complet, la publicité payante et les intégrations
          personnalisées peuvent faire l’objet d’options séparées.
        </p>
      </div>
    </main>
  );
}