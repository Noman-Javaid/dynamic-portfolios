"use client";

import { useActionState } from "react";
import type { Action } from "./action-form";

export function DeleteButton({
  action,
  id,
  stackId,
  label,
  buttonLabel = "Delete",
  confirmMessage,
}: {
  action: Action;
  id: string;
  stackId?: string;
  label: string;
  buttonLabel?: string;
  confirmMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const msg = confirmMessage ?? `Delete ${label}? This can't be undone.`;
        if (!confirm(msg)) e.preventDefault();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      {stackId !== undefined && (
        <input type="hidden" name="stack_id" value={stackId} />
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Working…" : buttonLabel}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
