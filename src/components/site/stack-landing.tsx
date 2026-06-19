"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileDown, Mail, MapPin } from "lucide-react";
import type { Stack, Person } from "@/data/portfolio";
import { DynamicIcon } from "@/lib/icons";
import { StackNav } from "@/components/site/stack-nav";
import { Footer } from "@/components/site/footer";
import { SocialLinks } from "@/components/site/social-links";
import { StackPortfolio } from "@/components/site/stack-portfolio";
import { AuroraBackground } from "@/components/site/aurora-background";
import { HeroBackground } from "@/components/site/hero-background";
import { Magnetic } from "@/components/site/magnetic";
import { CountUp } from "@/components/site/count-up";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

function StackHeroContent({ stack, person }: { stack: Stack; person: Person }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-screen-xl flex-col items-start justify-between gap-10 px-5 text-zinc-950 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8"
    >
      <div className="w-full lg:w-1/2 lg:pr-8">
        <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700 sm:px-3.5 sm:text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {person.availability}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[11px] font-medium text-zinc-700 sm:px-3.5 sm:text-xs">
            <DynamicIcon name={stack.icon} className="h-3.5 w-3.5 text-accent" />
            {stack.name}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-[2.1rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[1.05]"
        >
          <span className="text-zinc-950">Hi, I&apos;m {person.name.split(" ")[0]}.</span>
          <br />
          <span className="accent-gradient">{stack.shortName} Engineer</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-md font-mono text-[11px] leading-relaxed tracking-wide text-zinc-500 sm:mt-5 sm:text-xs"
        >
          {stack.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-7 flex max-w-md flex-wrap gap-x-8 gap-y-4 sm:mt-8"
        >
          {person.stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-semibold text-zinc-950 sm:text-[1.75rem]">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex w-full flex-col items-start lg:w-1/2 lg:pl-8">
        <motion.p
          variants={fadeUp}
          className="mb-6 max-w-md text-[15px] leading-relaxed text-zinc-600 sm:mb-7 sm:text-lg"
        >
          {stack.blurb}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="pointer-events-auto flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Magnetic className="w-full sm:w-auto">
            <a
              href={`mailto:${person.email}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#43e1f0] px-6 py-3.5 font-semibold text-zinc-950 shadow-[0_8px_24px_-8px_rgba(67,225,240,0.6)] transition-all duration-300 hover:bg-[#2fd6e8] hover:shadow-[0_10px_30px_-8px_rgba(67,225,240,0.8)] sm:w-auto sm:px-7"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </a>
          </Magnetic>

          <Magnetic className="w-full sm:w-auto">
            <a
              href={`/${stack.slug}/cv`}
              download
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 font-semibold text-zinc-950 shadow-sm transition-colors duration-300 hover:bg-zinc-50 sm:w-auto sm:px-7"
            >
              <FileDown className="h-4 w-4" />
              Download CV
            </a>
          </Magnetic>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mt-7">
          <SocialLinks person={person} className="pointer-events-auto" />
          <span className="flex items-center gap-1.5 text-sm text-zinc-500">
            <MapPin className="h-4 w-4" />
            {person.location}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function StackLanding({
  stack,
  person,
}: {
  stack: Stack;
  person: Person;
}) {
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current && window.innerWidth >= 1024) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
          const maxScroll = 420;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
          heroContentRef.current!.style.opacity = opacity.toString();
          heroContentRef.current!.style.transform = `translateY(${scrollPosition * 0.16}px)`;
        });
      } else if (heroContentRef.current) {
        heroContentRef.current.style.opacity = "1";
        heroContentRef.current.style.transform = "none";
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      <AuroraBackground />
      <StackNav stack={stack} person={person} />

      <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pt-32 lg:py-0">

        <div className="pointer-events-none absolute inset-0 z-0 lg:pointer-events-auto">
          <HeroBackground />
        </div>

        <div ref={heroContentRef} className="pointer-events-none relative z-10 w-full">
          <StackHeroContent stack={stack} person={person} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden justify-center lg:flex">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-zinc-300 p-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-zinc-400" />
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <StackPortfolio stack={stack} />
        <Footer person={person} homeHref={`/${stack.slug}`} />
      </div>
    </div>
  );
}
