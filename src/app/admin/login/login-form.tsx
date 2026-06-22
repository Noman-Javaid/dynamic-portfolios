"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@server/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage portfolio content.
        </p>

        <form action={action} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
            />
          </label>

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
