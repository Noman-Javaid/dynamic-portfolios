"use client";

import { motion } from "framer-motion";
import type { ProjectItem } from "@/data/portfolio";
import { ProjectCard } from "@/components/site/project-card";
import { staggerContainer, staggerItem } from "@/components/site/reveal";

export function ProjectGrid({ projects }: { projects: ProjectItem[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {projects.map((p, i) => (
        <motion.div key={`${p.name}-${i}`} variants={staggerItem} className="h-full">
          <ProjectCard project={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
