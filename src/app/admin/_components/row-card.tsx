import type { ReactNode } from "react";

export function RowCard({
  title,
  meta,
  body,
  edit,
  del,
}: {
  title: ReactNode;
  meta?: ReactNode;
  body?: ReactNode;
  edit: ReactNode;
  del: ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-950">{title}</h3>
          {meta && <p className="mt-0.5 text-xs text-zinc-500">{meta}</p>}
        </div>
        {del}
      </div>
      {body && <div className="mt-3 text-sm text-zinc-600">{body}</div>}
      <details className="group mt-3">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900">
          <span className="transition-transform group-open:rotate-90">›</span>
          Edit
        </summary>
        <div className="mt-4 border-t border-zinc-100 pt-4">{edit}</div>
      </details>
    </li>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 py-8 text-center text-sm text-zinc-500">
      {children}
    </li>
  );
}

export function Pills({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <li
          key={i}
          className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600"
        >
          {it}
        </li>
      ))}
    </ul>
  );
}
