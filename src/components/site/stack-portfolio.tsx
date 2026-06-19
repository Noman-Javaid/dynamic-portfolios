"use client";

import { Briefcase, FolderGit2, Layers } from "lucide-react";
import type { ElementType } from "react";
import type { Stack } from "@/data/portfolio";
import { TechGrid } from "@/components/site/tech-grid";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { ProjectGrid } from "@/components/site/project-grid";
import { Reveal } from "@/components/site/reveal";

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: ElementType;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#43e1f0]/40 bg-[#43e1f0]/10 text-[#14b6cc] shadow-[0_0_22px_-6px_rgba(67,225,240,0.65)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-7 h-px w-full bg-gradient-to-r from-[#43e1f0]/60 via-zinc-200 to-transparent" />
    </div>
  );
}

export function StackPortfolio({ stack: data }: { stack: Stack }) {
  return (
    <main className="relative bg-transparent">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <section id="features" className="py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              icon={Layers}
              eyebrow="What I do"
              title="Stack & Technologies"
            />
          </Reveal>
          <TechGrid tech={data.tech} />
        </section>

        <section id="experience" className="py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              icon={Briefcase}
              eyebrow="Where I've worked"
              title="Professional Experience"
            />
          </Reveal>
          <ExperienceTimeline experience={data.experience} />
        </section>

        <section id="projects" className="py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              icon={FolderGit2}
              eyebrow="Selected work"
              title="Projects"
            />
          </Reveal>
          <ProjectGrid projects={data.projects} />
        </section>
      </div>
    </main>
  );
}
