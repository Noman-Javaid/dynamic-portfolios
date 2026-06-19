"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Stack, Person } from "@/data/portfolio";
import { Magnetic } from "@/components/site/magnetic";

const SECTIONS = [
  { id: "", label: "Home" },
  { id: "#features", label: "What I Do" },
  { id: "#experience", label: "Experience" },
  { id: "#projects", label: "Projects" },
];

export function StackNav({ stack, person }: { stack: Stack; person: Person }) {
  const base = `/${stack.slug}`;
  const [scrolled, setScrolled] = useState(false);

  const nameParts = person.name.trim().split(/\s+/).filter(Boolean);
  const initials = (
    nameParts[0]?.[0] + (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")
  ).toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "glass-strong border-b border-zinc-200 py-2.5"
          : "border-b border-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href={base}
          className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-zinc-950"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-950 transition-colors duration-300 group-hover:border-zinc-300">
            {initials}
          </span>
          <span>{person.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <Link
              key={s.label}
              href={`${base}${s.id}`}
              className="group relative rounded-full px-3.5 py-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
              {s.label}
              <span className="absolute inset-x-3.5 -bottom-px h-0.5 origin-left scale-x-0 rounded-full bg-[#43e1f0] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <Magnetic>
          <a
            href={`mailto:${person.email}`}
            className="inline-block rounded-full bg-[#43e1f0] px-5 py-2 text-sm font-semibold text-zinc-950 shadow-[0_6px_18px_-8px_rgba(67,225,240,0.7)] transition-all duration-300 hover:bg-[#2fd6e8]"
          >
            Let&apos;s Talk
          </a>
        </Magnetic>
      </div>
    </nav>
  );
}
