"use client";

import { motion } from "framer-motion";
import type { TechCategory } from "@/data/portfolio";
import { DynamicIcon } from "@/lib/icons";
import { staggerContainer, staggerItem } from "@/components/site/reveal";

interface TechGridProps {
  tech: TechCategory[];
}

export function TechGrid({ tech }: TechGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {tech.map((cat, i) => (
        <motion.div
          key={`${cat.label}-${i}`}
          variants={staggerItem}
          className="card-hover group rounded-2xl glass p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#43e1f0]/30 bg-[#43e1f0]/10 text-[#14b6cc] transition-all duration-300 group-hover:border-[#43e1f0]/60 group-hover:shadow-[0_0_18px_-6px_rgba(67,225,240,0.7)]">
              <DynamicIcon name={cat.icon} className="h-5 w-5" />
            </span>
            <h3 className="text-[15px] font-semibold text-zinc-950">{cat.label}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item, j) => (
              <span
                key={`${item}-${j}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 transition-colors duration-200 hover:border-zinc-300 hover:text-zinc-950"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
