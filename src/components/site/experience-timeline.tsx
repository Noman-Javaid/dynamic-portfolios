"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import type { ExperienceItem } from "@/data/portfolio";
import { staggerContainer, staggerItem } from "@/components/site/reveal";

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
}

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  return (
    <div className="relative">

      <motion.div
        className="absolute left-[21px] top-3 hidden w-px bg-gradient-to-b from-zinc-300 via-zinc-200 to-transparent sm:block"
        initial={{ height: 0 }}
        whileInView={{ height: "calc(100% - 1.5rem)" }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.div
        className="space-y-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {experience.map((job, i) => (
          <motion.div key={`${job.company}-${i}`} variants={staggerItem} className="relative sm:pl-14">

            <span className="absolute left-0 top-1 hidden h-11 w-11 place-items-center rounded-xl border border-[#43e1f0]/40 bg-[#43e1f0]/10 text-[#14b6cc] shadow-[0_0_22px_-6px_rgba(67,225,240,0.6)] sm:grid">
              <Briefcase className="h-4 w-4" />
            </span>

            <div className="card-hover rounded-2xl glass p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950">{job.role}</h3>
                  <p className="text-sm font-medium text-accent">{job.company}</p>
                </div>
                <span className="mt-1 shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs text-zinc-500 sm:mt-0">
                  {job.period}
                </span>
              </div>

              {job.location && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </p>
              )}

              <ul className="mt-4 space-y-2.5">
                {job.points.map((p, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-zinc-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
