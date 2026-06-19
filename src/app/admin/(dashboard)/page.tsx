import Link from "next/link";
import { counts } from "@server/lib/admin-queries";

const CARDS = [
  { href: "/admin/profile", label: "Profile", hint: "Edit your details", key: null },
  { href: "/admin/stacks", label: "Portfolios", key: "stacks" as const },
  { href: "/admin/tech", label: "Tech", key: "tech" as const },
  { href: "/admin/experience", label: "Experience", key: "experiences" as const },
  { href: "/admin/projects", label: "Projects", key: "projects" as const },
];

export default async function OverviewPage() {
  const c = await counts();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage every section of your portfolio.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300"
          >
            <p className="text-sm font-medium text-zinc-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              {card.key ? c[card.key] : card.hint}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
