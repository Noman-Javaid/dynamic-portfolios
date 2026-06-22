"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/stacks/new-portfolio", label: "+ Create full Portfolio", exact: true },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/stacks", label: "Portfolios", exact: true },
  { href: "/admin/tech", label: "Tech Categories" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/themes", label: "Themes" },
  { href: "/admin/generate", label: "✦ Generate with AI", exact: true },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
