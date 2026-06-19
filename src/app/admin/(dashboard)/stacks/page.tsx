import Link from "next/link";
import {
  listStacks,
  listTechCategories,
  listExperiences,
  listProjects,
} from "@server/lib/admin-queries";
import { addStack, deleteStack } from "@server/actions/content";
import { randomHash } from "@/lib/utils";
import { ActionForm } from "@/app/admin/_components/action-form";
import { StackFields } from "@/app/admin/_components/stack-fields";
import { StackEditor } from "@/app/admin/_components/stack-editor";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { RowCard, EmptyState } from "@/app/admin/_components/row-card";

export default async function StacksPage() {
  const [stacks, tech, experiences, projects] = await Promise.all([
    listStacks(),
    listTechCategories(),
    listExperiences(),
    listProjects(),
  ]);
  const newSlug = randomHash();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950">Portfolios</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Each portfolio lives at <code className="rounded bg-zinc-100 px-1">/&lt;slug&gt;</code>.
            Expand <strong>Edit</strong> to manage its tech, experience and projects.
          </p>
        </div>
        <Link
          href="/admin/stacks/new-portfolio"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          + Create full Portfolio
        </Link>
      </header>

      <ActionForm action={addStack} title="Quick add (portfolio only)" submitLabel="Add portfolio">
        <StackFields newSlug={newSlug} />
      </ActionForm>

      <ul className="space-y-3">
        {stacks.length === 0 && <EmptyState>No portfolios yet. Add one above.</EmptyState>}
        {stacks.map((s) => {
          const stackTech = tech.filter((t) => t.stack_ids.includes(s.id));
          const stackExp = experiences.filter((e) => e.stack_ids.includes(s.id));
          const stackProjects = projects.filter((p) => p.stack_ids.includes(s.id));
          const attachableTech = tech
            .filter((t) => !t.stack_ids.includes(s.id))
            .map((t) => ({ id: t.id, name: t.label }));
          const attachableExperiences = experiences
            .filter((e) => !e.stack_ids.includes(s.id))
            .map((e) => ({
              id: e.id,
              name: `${e.company}${e.role ? ` — ${e.role}` : ""}`,
            }));
          const attachableProjects = projects
            .filter((p) => !p.stack_ids.includes(s.id))
            .map((p) => ({ id: p.id, name: p.name }));

          return (
            <RowCard
              key={s.id}
              title={
                <Link href={`/${s.slug}`} target="_blank" className="hover:underline">
                  {s.name}
                </Link>
              }
              meta={`/${s.slug} · ${stackTech.length} tech · ${stackExp.length} exp · ${stackProjects.length} projects`}
              del={<DeleteButton action={deleteStack} id={s.id} label={`portfolio “${s.name}”`} />}
              edit={
                <StackEditor
                  stack={s}
                  tech={stackTech}
                  experiences={stackExp}
                  projects={stackProjects}
                  attachableTech={attachableTech}
                  attachableExperiences={attachableExperiences}
                  attachableProjects={attachableProjects}
                />
              }
            />
          );
        })}
      </ul>
    </div>
  );
}
