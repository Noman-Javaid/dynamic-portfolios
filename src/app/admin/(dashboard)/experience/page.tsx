import Link from "next/link";
import {
  listExperiences,
  stackOptions,
  type ExperienceRow,
  type StackOption,
} from "@server/lib/admin-queries";
import {
  addExperience,
  updateExperience,
  deleteExperience,
} from "@server/actions/content";
import { ActionForm, Full } from "@/app/admin/_components/action-form";
import { Area, Field, Select } from "@/app/admin/_components/fields";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { RowCard, EmptyState } from "@/app/admin/_components/row-card";

function ExperienceFields({
  options,
  row,
}: {

  options?: StackOption[];
  row?: ExperienceRow;
}) {
  return (
    <>
      {options && (
        <Select label="Stack" name="stack_id" required>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
      )}
      <Field label="Company" name="company" required defaultValue={row?.company} />
      <Field label="Role" name="role" defaultValue={row?.role ?? ""} />
      <Field label="Period" name="period" defaultValue={row?.period ?? ""} placeholder="Mar 2020 – Present" />
      <Field label="Location" name="location" defaultValue={row?.location ?? ""} />
      <Field
        label="Sort order"
        name="sort_order"
        type="number"
        defaultValue={row?.sort_order ?? 0}
      />
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

export default async function ExperiencePage() {
  const [rows, options] = await Promise.all([listExperiences(), stackOptions()]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Experience
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Work history entries shown on each portfolio page.
        </p>
      </header>

      {options.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-5 text-sm text-zinc-500">
          Create a <Link href="/admin/stacks" className="font-medium text-zinc-900 underline">portfolio</Link> first.
        </div>
      ) : (
        <ActionForm action={addExperience} title="Add an experience" submitLabel="Add experience">
          <ExperienceFields options={options} />
        </ActionForm>
      )}

      <ul className="space-y-3">
        {rows.length === 0 && <EmptyState>No experience entries yet.</EmptyState>}
        {rows.map((r) => (
          <RowCard
            key={r.id}
            title={`${r.company}${r.role ? ` — ${r.role}` : ""}`}
            meta={`${r.stacks.map((s) => s.name).join(", ") || "—"} · ${r.period ?? "—"} · sort ${r.sort_order}`}
            body={
              r.points.length > 0 && (
                <ul className="list-disc space-y-1 pl-5">
                  {r.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )
            }
            del={
              <DeleteButton
                action={deleteExperience}
                id={r.id}
                label={`experience at “${r.company}”`}
              />
            }
            edit={
              <ActionForm
                action={updateExperience}
                bare
                hiddenId={r.id}
                submitLabel="Save changes"
              >
                <ExperienceFields row={r} />
              </ActionForm>
            }
          />
        ))}
      </ul>
    </div>
  );
}
