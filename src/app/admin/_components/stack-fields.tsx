import type { StackRow } from "@server/lib/admin-queries";
import { Full } from "@/app/admin/_components/action-form";
import { Field, Area } from "@/app/admin/_components/fields";
import { NameSlugFields } from "@/app/admin/_components/name-slug-fields";
import { IconPicker } from "@/app/admin/_components/icon-picker";

export function StackFields({ row, newSlug }: { row?: StackRow; newSlug?: string }) {
  return (
    <>
      <NameSlugFields defaultName={row?.name} defaultSlug={row?.slug ?? newSlug} />
      <Field label="Short name" name="short_name" required defaultValue={row?.short_name} placeholder="Go" />
      <Field label="Tagline" name="tagline" defaultValue={row?.tagline ?? ""} placeholder="Go · gRPC · Kubernetes" />
      <IconPicker name="icon" defaultValue={row?.icon ?? "Boxes"} />
      <Field
        label="Accent (tailwind gradient)"
        name="accent"
        defaultValue={row?.accent ?? ""}
        placeholder="from-sky-500 to-cyan-500"
      />
      <Field
        label="Sort order"
        name="sort_order"
        type="number"
        defaultValue={row?.sort_order ?? 0}
      />
      <Full>
        <Area label="Blurb" name="blurb" rows={3} defaultValue={row?.blurb ?? ""} />
      </Full>
    </>
  );
}
