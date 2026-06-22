"use client";

import { useActionState, useState, type CSSProperties, type ReactNode } from "react";
import { saveTheme, setActiveTheme, deleteTheme } from "@server/actions/theme";
import {
  DEFAULT_TOKENS,
  COLOR_FIELDS,
  RADIUS_OPTIONS,
  FONT_OPTIONS,
  themeStyle,
  type ThemeTokens,
} from "@/lib/theme";
import type { ThemeRow } from "@server/lib/admin-queries";

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]";

function Swatches({ tokens }: { tokens: ThemeTokens }) {
  const keys: (keyof ThemeTokens)[] = ["accent", "accentStrong", "base", "panel", "text", "border"];
  return (
    <div className="flex gap-1">
      {keys.map((k) => (
        <span
          key={k}
          className="h-5 w-5 rounded-full border border-zinc-200"
          style={{ background: tokens[k] }}
          title={`${k}: ${tokens[k]}`}
        />
      ))}
    </div>
  );
}

function Preview({ tokens }: { tokens: ThemeTokens }) {
  return (
    <div
      style={themeStyle(tokens) as CSSProperties}
      className="overflow-hidden rounded-2xl border"
    >
      <div style={{ background: "var(--base)" }} className="p-5">
        <div className="glass card-hover rounded-2xl p-5" style={{ borderRadius: "var(--radius-2xl)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Preview</p>
          <h3 className="mt-1 text-xl font-semibold" style={{ color: "var(--text)" }}>
            The quick <span className="accent-gradient">brown fox</span>
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Jumps over the lazy dog with this theme applied.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-950"
              style={{ background: "var(--accent)" }}
            >
              Primary
            </span>
            <span
              className="rounded-xl border px-4 py-2 text-sm font-medium"
              style={{ background: "var(--panel)", color: "var(--text)" }}
            >
              Secondary
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs"
              style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
            >
              Badge
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniForm({ id, action, children, confirm }: {
  id: string;
  action: typeof setActiveTheme;
  children: ReactNode;
  confirm?: string;
}) {
  const [, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
      >
        {pending ? "…" : children}
      </button>
    </form>
  );
}

export function ThemesManager({ themes, activeId }: { themes: ThemeRow[]; activeId: string | null }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tokens, setTokens] = useState<ThemeTokens>(DEFAULT_TOKENS);
  const [state, formAction, pending] = useActionState(saveTheme, {});

  const set = (k: keyof ThemeTokens, v: string) => setTokens((t) => ({ ...t, [k]: v }));

  const startNew = () => {
    setEditingId(null);
    setName("");
    setTokens(DEFAULT_TOKENS);
  };
  const startEdit = (t: ThemeRow) => {
    setEditingId(t.id);
    setName(t.name);
    setTokens(t.tokens);
  };

  return (
    <div className="space-y-6">
      <section>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <div key={t.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-950">{t.name}</h3>
                  {t.id === activeId && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Active
                    </span>
                  )}
                  {t.is_preset && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                      Preset
                    </span>
                  )}
                </div>
                <Swatches tokens={t.tokens} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {t.id !== activeId && (
                  <MiniForm id={t.id} action={setActiveTheme}>Set active</MiniForm>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  Edit
                </button>
                {!t.is_preset && (
                  <MiniForm
                    id={t.id}
                    action={deleteTheme}
                    confirm={`Delete theme “${t.name}”?`}
                  >
                    Delete
                  </MiniForm>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-950">
            {editingId ? "Edit theme" : "New theme"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={startNew}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
            >
              + Start a new theme
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form action={formAction} className="space-y-4">
            {editingId && <input type="hidden" name="id" value={editingId} />}

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600">Name</span>
              <input
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My theme"
                className={inputCls}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              {COLOR_FIELDS.map((f) => (
                <label key={f.key} className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-600">{f.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tokens[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-300 bg-white p-1"
                      aria-label={f.label}
                    />
                    <input
                      name={f.key}
                      value={tokens[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">Roundness</span>
                <select
                  name="radius"
                  value={tokens.radius}
                  onChange={(e) => set("radius", e.target.value)}
                  className={inputCls}
                >
                  {RADIUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">Font</span>
                <select
                  name="font"
                  value={tokens.font}
                  onChange={(e) => set("font", e.target.value)}
                  className={inputCls}
                >
                  {FONT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {!editingId && (
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" name="activate" value="1" className="accent-[var(--accent)]" />
                Activate this theme after saving
              </label>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
              >
                {pending ? "Saving…" : editingId ? "Save changes" : "Create theme"}
              </button>
              {state?.message && <span className="text-sm text-emerald-600">{state.message}</span>}
              {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
            </div>
          </form>

          <div>
            <span className="mb-1 block text-xs font-medium text-zinc-600">Live preview</span>
            <Preview tokens={tokens} />
          </div>
        </div>
      </section>
    </div>
  );
}
