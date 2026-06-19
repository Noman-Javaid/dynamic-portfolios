"use client";

import { useActionState } from "react";
import Link from "next/link";
import { generatePortfolio, type GenerateState } from "@server/actions/generate";

const textareaCls =
  "w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#43e1f0] focus:ring-2 focus:ring-[#43e1f0]/30";

function ResultCard({ state }: { state: Extract<GenerateState, { ok: true }> }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
        Portfolio generated
      </p>
      <h3 className="mt-1 text-lg font-semibold text-emerald-900">{state.name}</h3>
      {state.summary && (
        <p className="mt-2 text-sm text-emerald-800">{state.summary}</p>
      )}

      <p className="mt-3 text-sm text-emerald-800">
        Selected <strong>{state.counts.projects}</strong> projects,{" "}
        <strong>{state.counts.experiences}</strong> experiences and{" "}
        <strong>{state.counts.tech}</strong> tech categories from your existing content.
      </p>

      {state.keywords.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {state.keywords.map((k, i) => (
            <li
              key={i}
              className="rounded-full border border-emerald-300 bg-white/60 px-2.5 py-0.5 text-xs text-emerald-800"
            >
              {k}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/${state.slug}`}
          target="_blank"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          View portfolio → /{state.slug}
        </Link>
        <Link
          href="/admin/stacks"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          Edit in Portfolios
        </Link>
      </div>
      <p className="mt-3 text-xs text-emerald-700">
        It now appears in the <strong>Portfolios</strong> tab — refine its content, name or slug there anytime.
      </p>
    </div>
  );
}

export function GeneratePanel() {
  const [state, formAction, pending] = useActionState<GenerateState, FormData>(
    generatePortfolio,
    undefined
  );

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Job description
          </span>
          <textarea
            name="jd"
            rows={12}
            required
            placeholder="Paste the full job description here — responsibilities, required stack, seniority…"
            className={textareaCls}
            disabled={pending}
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[#43e1f0] px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#2fd6e8] disabled:opacity-60"
          >
            {pending ? "Generating…" : "Generate portfolio"}
          </button>
          {pending && (
            <span className="text-sm text-zinc-500">
              Matching your projects &amp; experience to the role…
            </span>
          )}
        </div>
      </form>

      {state?.ok === true && <ResultCard state={state} />}
      {state && state.ok !== true && state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
