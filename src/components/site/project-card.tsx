import { ExternalLink, GitBranch } from "lucide-react";
import type { ProjectItem } from "@/data/portfolio";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <div className="card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-zinc-950">
          {project.name}
        </h3>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.name}`}
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-400 transition-colors duration-300 hover:border-[#43e1f0]/50 hover:text-[#14b6cc]"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {project.role && (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-accent">
          {project.role}
        </p>
      )}

      <ul className="mt-4 flex-1 space-y-2">
        {project.points.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-zinc-600">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((t) => (
          <span
            key={t}
            className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-500"
          >
            {t}
          </span>
        ))}
      </div>

      {project.alsoSpans && (
        <p className="mt-4 flex items-center gap-1.5 border-t border-zinc-200 pt-3 text-[11px] text-zinc-400">
          <GitBranch className="h-3.5 w-3.5" />
          Also spans: {project.alsoSpans}
        </p>
      )}
    </div>
  );
}
