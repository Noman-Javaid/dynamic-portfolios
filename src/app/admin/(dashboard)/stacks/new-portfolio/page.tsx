import Link from "next/link";
import {
  listProjectOptions,
  listTechCategories,
  listExperiences,
} from "@server/lib/admin-queries";
import { iconNames } from "@/lib/icons";
import { randomHash } from "@/lib/utils";
import { StackCreator } from "@/app/admin/_components/stack-creator";

export default async function NewStackPage() {
  const [projectOptions, tech, experiences] = await Promise.all([
    listProjectOptions(),
    listTechCategories(),
    listExperiences(),
  ]);
  const initialSlug = randomHash();

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/stacks"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Portfolios
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
          New portfolio
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a portfolio with its tech, experience and projects in one go.
        </p>
      </header>

      <StackCreator
        iconNames={iconNames}
        existingTech={tech.map((t) => ({ id: t.id, name: t.label }))}
        existingExperiences={experiences.map((e) => ({
          id: e.id,
          name: `${e.company}${e.role ? ` — ${e.role}` : ""}`,
        }))}
        existingProjects={projectOptions.map((p) => ({ id: p.id, name: p.name }))}
        initialSlug={initialSlug}
      />
    </div>
  );
}
