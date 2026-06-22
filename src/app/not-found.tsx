import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Person } from "@/data/portfolio";
import { getStacks, getProfile } from "@server/lib/queries";
import { DynamicIcon } from "@/lib/icons";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/site/reveal";
import { AuroraBackground } from "@/components/site/aurora-background";

export const dynamic = "force-dynamic";

const FALLBACK_PERSON: Person = {
  name: "Portfolio",
  title: "",
  tagline: "",
  intro: "",
  email: "",
  github: "",
  githubLabel: "",
  linkedin: "",
  linkedinLabel: "",
  location: "",
  availability: "",
  education: "",
  certifications: [],
  stats: [],
};

export default async function NotFound() {
  let stacks: Awaited<ReturnType<typeof getStacks>> = [];
  let person: Person = FALLBACK_PERSON;
  try {
    [stacks, person] = await Promise.all([
      getStacks(),
      getProfile().then((p) => p ?? FALLBACK_PERSON),
    ]);
  } catch {

  }

  const defaultStack = stacks[0]?.slug;

  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pt-28 pb-20">
        <div className="relative w-full max-w-2xl text-center">
          <Reveal>
            <p className="accent-gradient text-[7rem] font-black leading-none tracking-tighter sm:text-[11rem]">
              404
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">
              This page took a different path.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
              There&apos;s no page at this URL. Pick a portfolio below to
              explore the work.
            </p>
          </Reveal>

          {defaultStack && (
            <Reveal delay={0.2}>
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/${defaultStack}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition-all duration-300 hover:bg-[var(--accent-strong)]"
                >
                  Open {stacks[0]?.shortName} portfolio
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          )}

          {/* {stacks.length > 0 && (
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {stacks.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-sm text-zinc-600 transition-all duration-300 hover:border-zinc-300 hover:text-zinc-950"
                  >
                    <DynamicIcon name={s.icon} className="h-4 w-4" />
                    {s.shortName}
                  </Link>
                ))}
              </div>
            </Reveal>
          )} */}
        </div>
      </main>

      <Footer person={person} homeHref={defaultStack ? `/${defaultStack}` : "/"} />
    </div>
  );
}
