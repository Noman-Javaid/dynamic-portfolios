import type { ReactNode } from "react";
import Link from "next/link";
import type {
  StackRow,
  TechRow,
  ExperienceRow,
  ProjectRow,
} from "@server/lib/admin-queries";
import {
  updateStack,
  addTechCategory,
  updateTechCategory,
  attachTechCategory,
  detachTechCategory,
  addExperience,
  updateExperience,
  attachExperience,
  detachExperience,
  addProject,
  attachProject,
  detachProject,
} from "@server/actions/content";
import { ActionForm, Full } from "@/app/admin/_components/action-form";
import { Field, Area } from "@/app/admin/_components/fields";
import { IconPicker } from "@/app/admin/_components/icon-picker";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { AttachExisting } from "@/app/admin/_components/attach-existing";
import { StackFields } from "@/app/admin/_components/stack-fields";
import { RowCard, Pills } from "@/app/admin/_components/row-card";

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function AddBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function AlsoIn({
  stacks,
  currentId,
}: {
  stacks: { id: string; name: string }[];
  currentId: string;
}) {
  const others = stacks.filter((s) => s.id !== currentId);
  if (others.length === 0) return null;
  return (
    <p className="mt-0.5 text-[11px] text-zinc-400">
      Also in: {others.map((s) => s.name).join(", ")}
    </p>
  );
}

export function StackEditor({
  stack,
  tech,
  experiences,
  projects,
  attachableTech,
  attachableExperiences,
  attachableProjects,
}: {
  stack: StackRow;
  tech: TechRow[];
  experiences: ExperienceRow[];
  projects: ProjectRow[];
  attachableTech: { id: string; name: string }[];
  attachableExperiences: { id: string; name: string }[];
  attachableProjects: { id: string; name: string }[];
}) {
  const sid = stack.id;

  return (
    <div className="space-y-5">

      <ActionForm action={updateStack} bare hiddenId={sid} submitLabel="Save portfolio details">
        <StackFields row={stack} />
      </ActionForm>

      <SubSection title={`Tech categories (${tech.length})`}>
        {tech.length === 0 ? (
          <p className="text-xs text-zinc-400">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {tech.map((t) => (
              <RowCard
                key={t.id}
                title={t.label}
                meta={`sort ${t.sort_order}`}
                body={
                  <>
                    <Pills items={t.items} />
                    <AlsoIn stacks={t.stacks} currentId={sid} />
                  </>
                }
                del={
                  <DeleteButton
                    action={detachTechCategory}
                    id={t.id}
                    stackId={sid}
                    label={`“${t.label}”`}
                    buttonLabel="Remove"
                    confirmMessage={`Remove “${t.label}” from this portfolio? The category itself is kept (it may still belong to other portfolios).`}
                  />
                }
                edit={
                  <ActionForm action={updateTechCategory} bare hiddenId={t.id} submitLabel="Save">
                    <Field label="Label" name="label" required defaultValue={t.label} />
                    <IconPicker name="icon" defaultValue={t.icon ?? "Boxes"} />
                    <Field label="Sort order" name="sort_order" type="number" defaultValue={t.sort_order} />
                    <Full>
                      <Area
                        label="Items"
                        name="items"
                        rows={2}
                        hint="Comma- or newline-separated."
                        defaultValue={t.items.join(", ")}
                      />
                    </Full>
                  </ActionForm>
                }
              />
            ))}
          </ul>
        )}

        <AttachExisting
          action={attachTechCategory}
          stackId={sid}
          options={attachableTech}
          label="Add an existing tech category"
          emptyHint="No other tech categories available to add."
        />

        <AddBox title="Create a new tech category">
          <ActionForm action={addTechCategory} bare submitLabel="Add tech category">
            <input type="hidden" name="stack_id" value={sid} />
            <Field label="Label" name="label" required placeholder="Backend" />
            <IconPicker name="icon" />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={tech.length} />
            <Full>
              <Area label="Items" name="items" rows={2} hint="Comma- or newline-separated, e.g. Go, gRPC" />
            </Full>
          </ActionForm>
        </AddBox>
      </SubSection>

      <SubSection title={`Experience (${experiences.length})`}>
        {experiences.length === 0 ? (
          <p className="text-xs text-zinc-400">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {experiences.map((e) => (
              <RowCard
                key={e.id}
                title={`${e.company}${e.role ? ` — ${e.role}` : ""}`}
                meta={`${e.period ?? "—"} · sort ${e.sort_order}`}
                body={
                  <>
                    {e.points.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5">
                        {e.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    )}
                    <AlsoIn stacks={e.stacks} currentId={sid} />
                  </>
                }
                del={
                  <DeleteButton
                    action={detachExperience}
                    id={e.id}
                    stackId={sid}
                    label={`experience at “${e.company}”`}
                    buttonLabel="Remove"
                    confirmMessage={`Remove the experience at “${e.company}” from this portfolio? The entry itself is kept (it may still belong to other portfolios).`}
                  />
                }
                edit={
                  <ActionForm action={updateExperience} bare hiddenId={e.id} submitLabel="Save">
                    <Field label="Company" name="company" required defaultValue={e.company} />
                    <Field label="Role" name="role" defaultValue={e.role ?? ""} />
                    <Field label="Period" name="period" defaultValue={e.period ?? ""} placeholder="Mar 2020 – Present" />
                    <Field label="Location" name="location" defaultValue={e.location ?? ""} />
                    <Field label="Sort order" name="sort_order" type="number" defaultValue={e.sort_order} />
                    <Full>
                      <Area label="Highlights" name="points" rows={3} hint="One per line." defaultValue={e.points.join("\n")} />
                    </Full>
                  </ActionForm>
                }
              />
            ))}
          </ul>
        )}

        <AttachExisting
          action={attachExperience}
          stackId={sid}
          options={attachableExperiences}
          label="Add an existing experience"
          emptyHint="No other experiences available to add."
        />

        <AddBox title="Create a new experience">
          <ActionForm action={addExperience} bare submitLabel="Add experience">
            <input type="hidden" name="stack_id" value={sid} />
            <Field label="Company" name="company" required />
            <Field label="Role" name="role" />
            <Field label="Period" name="period" placeholder="Mar 2020 – Present" />
            <Field label="Location" name="location" />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={experiences.length} />
            <Full>
              <Area label="Highlights" name="points" rows={3} hint="One bullet per line." />
            </Full>
          </ActionForm>
        </AddBox>
      </SubSection>

      <SubSection title={`Projects (${projects.length})`}>
        {projects.length === 0 ? (
          <p className="text-xs text-zinc-400">None in this portfolio yet.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {p.link ? (
                      <Link href={p.link} target="_blank" className="hover:underline">
                        {p.name}
                      </Link>
                    ) : (
                      p.name
                    )}
                  </p>
                  {p.stacks.length > 1 && (
                    <p className="mt-0.5 text-[11px] text-zinc-400">
                      Also in: {p.stacks.filter((s) => s.id !== sid).map((s) => s.name).join(", ")}
                    </p>
                  )}
                </div>
                <DeleteButton
                  action={detachProject}
                  id={p.id}
                  stackId={sid}
                  label={`“${p.name}”`}
                  buttonLabel="Remove"
                  confirmMessage={`Remove “${p.name}” from this portfolio? The project itself is kept (it may still belong to other portfolios).`}
                />
              </li>
            ))}
          </ul>
        )}

        <AttachExisting
          action={attachProject}
          stackId={sid}
          options={attachableProjects}
          label="Add an existing project"
          emptyHint="No other projects available to add."
        />

        <AddBox title="Create a new project for this portfolio">
          <ActionForm action={addProject} bare submitLabel="Add project">
            <input type="hidden" name="stack_ids" value={sid} />
            <Field label="Name" name="name" required />
            <Field label="Link" name="link" placeholder="https://…" />
            <Field label="Role" name="role" />
            <Field label="Also spans" name="also_spans" placeholder="Python · AI / GenAI" />
            <Full>
              <Area label="Tech stack" name="tech" rows={2} hint="Comma- or newline-separated tags." />
            </Full>
            <Full>
              <Area label="Highlights" name="points" rows={3} hint="One bullet per line." />
            </Full>
          </ActionForm>
        </AddBox>
      </SubSection>
    </div>
  );
}
