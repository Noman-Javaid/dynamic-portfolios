"use client";

import { useActionState } from "react";
import type { Action } from "./action-form";

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#43e1f0] focus:ring-2 focus:ring-[#43e1f0]/30";

export function AttachExisting({
  action,
  stackId,
  options,
  label,
  verb = "Attach",
  emptyHint,
}: {
  action: Action;
  stackId: string;
  options: { id: string; name: string }[];
  label: string;
  verb?: string;
  emptyHint: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  if (options.length === 0) {
    return <p className="text-xs text-zinc-400">{emptyHint}</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="stack_id" value={stackId} />
      <label className="min-w-[12rem] flex-1">
        <span className="mb-1 block text-xs font-medium text-zinc-600">{label}</span>
        <select name="id" required defaultValue="" className={inputCls}>
          <option value="" disabled>
            Select…
          </option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
      >
        {pending ? `${verb}ing…` : verb}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
