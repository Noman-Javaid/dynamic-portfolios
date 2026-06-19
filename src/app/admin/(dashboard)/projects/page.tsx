import Link from "next/link";
import {
  listProjects,
  stackOptions,
  type ProjectRow,
  type StackOption,
} from "@server/lib/admin-queries";
import {
  addProject,
  updateProject,
  deleteProject,
} from "@server/actions/content";
import { ActionForm, Full } from "@/app/admin/_components/action-form";
import { Area, Field, CheckboxGroup } from "@/app/admin/_components/fields";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { RowCard, EmptyState, Pills } from "@/app/admin/_components/row-card";

function ProjectFields({
  options,
  row,
}: {
  options: StackOption[];
  row?: ProjectRow;
}) {
  return (
    <>
      <Full>
        <CheckboxGroup
          label="Portfolios"
          name="stack_ids"
          required
          options={options}
          selected={row?.stack_ids}
          hint="A project can appear under multiple portfolios."
        />
      </Full>
      <Field label="Name" name="name" required defaultValue={row?.name} />
      <Field label="Link" name="link" defaultValue={row?.link ?? ""} placeholder="https://…" />
      <Field label="Role" name="role" defaultValue={row?.role ?? ""} />
      <Field
        label="Also spans"
        name="also_spans"
        defaultValue={row?.also_spans ?? ""}
        placeholder="Python · AI / GenAI"
      />
      <Full>
        <Area
          label="Tech stack"
          name="tech"
          rows={2}
          hint="Comma- or newline-separated tags."
          defaultValue={row?.tech.join(", ")}
        />
      </Full>
      <Full>
        <Area
          label="Highlights"
          name="points"
          rows={4}
          hint="One bullet per line."
          defaultValue={row?.points.join("\n")}
        />
      </Full>
    </>
  );
}

export default async function ProjectsPage() {
  const [rows, options] = await Promise.all([listProjects(), stackOptions()]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Projects
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Featured work. Each project can be shared across multiple stacks.
        </p>
      </header>

      {options.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-5 text-sm text-zinc-500">
          Create a <Link href="/admin/stacks" className="font-medium text-zinc-900 underline">portfolio</Link> first.
        </div>
      ) : (
        <ActionForm action={addProject} title="Add a project" submitLabel="Add project">
          <ProjectFields options={options} />
        </ActionForm>
      )}

      <ul className="space-y-3">
        {rows.length === 0 && <EmptyState>No projects yet.</EmptyState>}
        {rows.map((r) => (
          <RowCard
            key={r.id}
            title={
              r.link ? (
                <Link href={r.link} target="_blank" className="hover:underline">
                  {r.name}
                </Link>
              ) : (
                r.name
              )
            }
            meta={
              <>
                {r.stacks.length > 0
                  ? r.stacks.map((s) => s.name).join(", ")
                  : "No stacks"}
                {r.role ? ` · ${r.role}` : ""}
              </>
            }
            body={
              <div className="space-y-2">
                <Pills items={r.tech} />
                {r.points.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5">
                    {r.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            }
            del={
              <DeleteButton
                action={deleteProject}
                id={r.id}
                label={`project “${r.name}”`}
              />
            }
            edit={
              <ActionForm
                action={updateProject}
                bare
                hiddenId={r.id}
                submitLabel="Save changes"
              >
                <ProjectFields options={options} row={r} />
              </ActionForm>
            }
          />
        ))}
      </ul>
    </div>
  );
}
