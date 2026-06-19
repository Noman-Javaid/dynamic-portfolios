import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import type { Person } from "@/data/portfolio";
import { SocialLinks } from "@/components/site/social-links";

export function Footer({
  person,
  homeHref = "/",
}: {
  person: Person;
  homeHref?: string;
}) {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-zinc-200 bg-zinc-50/60">
      <div className="container relative mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">

          <div className="max-w-sm">
            <Link href={homeHref} className="text-xl font-bold tracking-tight text-zinc-950">
              {person.name}
              <span className="text-[#14b6cc]">.</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              {person.tagline}
            </p>
            <SocialLinks person={person} className="mt-6" />
          </div>

          <div className="md:text-right">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-zinc-600">
              <li>
                <a
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-zinc-950"
                >
                  <Mail className="h-4 w-4 text-zinc-400" />
                  {person.email}
                </a>
              </li>
              <li className="flex items-center gap-2 md:justify-end">
                <MapPin className="h-4 w-4 text-zinc-400" />
                {person.location}
              </li>
            </ul>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {person.availability}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
