import { Mail } from "lucide-react";
import type { Person } from "@/data/portfolio";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

interface SocialLinksProps {
  person: Pick<Person, "email" | "github" | "linkedin">;
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({
  person,
  className = "",
  iconClassName = "w-5 h-5",
}: SocialLinksProps) {
  const links = [
    { href: `mailto:${person.email}`, label: "Email", node: <Mail className={iconClassName} /> },
    { href: person.github, label: "GitHub", node: <GithubIcon className={iconClassName} /> },
    { href: person.linkedin, label: "LinkedIn", node: <LinkedinIcon className={iconClassName} /> },
  ].filter((l) => Boolean(l.href));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.label === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={l.label}
          className="group flex items-center justify-center w-10 h-10 rounded-xl glass text-zinc-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:text-[var(--accent-strong)]"
        >
          {l.node}
        </a>
      ))}
    </div>
  );
}

export { GithubIcon, LinkedinIcon };
