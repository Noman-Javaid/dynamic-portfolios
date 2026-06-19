import Link from "next/link";
import {
  listTechCategories,
  stackOptions,
  type TechRow,
  type StackOption,
} from "@server/lib/admin-queries";
import {
  addTechCategory,
  updateTechCategory,
  deleteTechCategory,
} from "@server/actions/content";
import { iconNames } from "@/lib/icons";
import { ActionForm, Full } from "@/app/admin/_components/action-form";
import { Area, Field, Select } from "@/app/admin/_components/fields";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { RowCard, EmptyState, Pills } from "@/app/admin/_components/row-card";

function TechFields({
  options,
  row,
}: {

  options?: StackOption[];
  row?: TechRow;
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
      <Field label="Label" name="label" required defaultValue={row?.label} placeholder="Backend" />
      <Select label="Icon" name="icon" defaultValue={row?.icon ?? "Boxes"}>
        {iconNames.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </Select>
      <Field
        label="Sort order"
        name="sort_order"
        type="number"
        defaultValue={row?.sort_order ?? 0}
      />
      <Full>
        <Area
          label="Items"
          name="items"
          rows={3}
          hint="Comma- or newline-separated, e.g. Go, gRPC, Gin"
          defaultValue={row?.items.join(", ")}
        />
      </Full>
    </>
  );
}

export default async function TechPage() {
  const [rows, options] = await Promise.all([
    listTechCategories(),
    stackOptions(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Tech categories
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Grouped lists of technologies shown on each portfolio page.
        </p>
      </header>

      {options.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-5 text-sm text-zinc-500">
          Create a <Link href="/admin/stacks" className="font-medium text-zinc-900 underline">portfolio</Link> first.
        </div>
      ) : (
        <ActionForm action={addTechCategory} title="Add a tech category" submitLabel="Add tech category">
          <TechFields options={options} />
        </ActionForm>
      )}

      <ul className="space-y-3">
        {rows.length === 0 && <EmptyState>No tech categories yet.</EmptyState>}
        {rows.map((r) => (
          <RowCard
            key={r.id}
            title={r.label}
            meta={`${r.stacks.map((s) => s.name).join(", ") || "—"} · sort ${r.sort_order}`}
            body={<Pills items={r.items} />}
            del={
              <DeleteButton
                action={deleteTechCategory}
                id={r.id}
                label={`“${r.label}”`}
              />
            }
            edit={
              <ActionForm
                action={updateTechCategory}
                bare
                hiddenId={r.id}
                submitLabel="Save changes"
              >
                <TechFields row={r} />
              </ActionForm>
            }
          />
        ))}
      </ul>
    </div>
  );
}
