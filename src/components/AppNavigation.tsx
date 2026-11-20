"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/properties", label: "Mes biens" },
  { href: "/prospects", label: "Mes prospects" },
  { href: "/actions", label: "Actions du jour" },
  { href: "/alerts/new", label: "Créer une alerte" },
  { href: "/matches", label: "Correspondances" },
  { href: "/pricing", label: "Tarifs" },
];

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="mr-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300"
        >
          ImmoPulse
        </Link>

        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-cyan-400 font-semibold text-slate-950"
                  : "text-slate-300 hover:bg-slate-900 hover:text-cyan-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}