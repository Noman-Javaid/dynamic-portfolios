"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "@server/actions/content";

export type Action = (
  state: ActionState,
  formData: FormData
) => Promise<ActionState>;

export function ActionForm({
  action,
  title,
  description,
  submitLabel = "Save",
  bare = false,
  hiddenId,
  children,
}: {
  action: Action;
  title?: string;
  description?: string;
  submitLabel?: string;

  bare?: boolean;

  hiddenId?: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  const form = (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {hiddenId !== undefined && <input type="hidden" name="id" value={hiddenId} />}
      {children}
      <div className="sm:col-span-2 flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#43e1f0] px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#2fd6e8] disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {state?.ok && state.message && (
          <span className="text-sm text-emerald-600">{state.message}</span>
        )}
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );

  if (bare) return form;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      {title && (
        <h2 className="text-base font-semibold tracking-tight text-zinc-950">
          {title}
        </h2>
      )}
      {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      <div className="mt-5">{form}</div>
    </section>
  );
}

export function Full({ children }: { children: ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>;
}
