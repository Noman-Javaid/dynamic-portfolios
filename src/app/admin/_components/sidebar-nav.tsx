"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CREATE_HREF = "/admin/stacks/new-portfolio";
const GENERATE_HREF = "/admin/generate";

const ITEMS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/profile", label: "Profile" },

  { href: "/admin/stacks", label: "Portfolios", exact: true },
  { href: "/admin/tech", label: "Tech Categories" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const createActive = pathname === CREATE_HREF;
  const generateActive = pathname === GENERATE_HREF;

  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Fragment key={item.href}>
            <Link
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              {item.label}
            </Link>

            {item.href === "/admin" && (
              <>
                <Link
                  href={CREATE_HREF}
                  className={`mb-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
                    createActive
                      ? "bg-[#2fd6e8] text-zinc-950 ring-2 ring-[#43e1f0]/40"
                      : "bg-[#43e1f0] text-zinc-950 hover:bg-[#2fd6e8]"
                  }`}
                >
                  + Create full Portfolio
                </Link>
                <Link
                  href={GENERATE_HREF}
                  className={`mb-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
                    generateActive
                      ? "bg-zinc-900 text-white ring-2 ring-zinc-400/40"
                      : "bg-zinc-900 text-white hover:bg-zinc-700"
                  }`}
                >
                  ✦ Generate with AI
                </Link>
              </>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
