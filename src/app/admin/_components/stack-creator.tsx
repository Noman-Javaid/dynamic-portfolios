"use client";

import { useActionState, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  createStackWithContent,
  type CreateStackState,
} from "@server/actions/content";
import { slugify } from "@/lib/utils";
import { DynamicIcon } from "@/lib/icons";

const input =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#43e1f0] focus:ring-2 focus:ring-[#43e1f0]/30";

type Tech = { label: string; icon: string; items: string };
type Exp = {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string;
};
type Proj = {
  name: string;
  link: string;
  role: string;
  tech: string;
  points: string;
  also_spans: string;
};

const emptyTech: Tech = { label: "", icon: "Boxes", items: "" };
const emptyExp: Exp = { company: "", role: "", period: "", location: "", points: "" };
const emptyProj: Proj = {
  name: "",
  link: "",
  role: "",
  tech: "",
  points: "",
  also_spans: "",
};

const splitLines = (v: string) =>
  v.split("\n").map((s) => s.trim()).filter(Boolean);
const splitTokens = (v: string) =>
  v.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);

function patch<T>(list: T[], i: number, key: keyof T, value: string): T[] {
  return list.map((it, idx) => (idx === i ? { ...it, [key]: value } : it));
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-zinc-950">{title}</h2>
      {desc && <p className="mt-1 text-sm text-zinc-500">{desc}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function L({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-xs font-medium text-zinc-600">{children}</span>;
}

function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
    >
      {children}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-medium text-red-500 hover:text-red-700"
    >
      Remove
    </button>
  );
}

function SharePicker({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <L>{title}</L>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => onToggle(o.id)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                on
                  ? "border-[#43e1f0] bg-[#43e1f0]/10 text-zinc-900"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              {on ? "✓ " : ""}
              {o.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StackCreator({
  iconNames,
  existingTech,
  existingExperiences,
  existingProjects,
  initialSlug,
}: {
  iconNames: string[];
  existingTech: { id: string; name: string }[];
  existingExperiences: { id: string; name: string }[];
  existingProjects: { id: string; name: string }[];
  initialSlug: string;
}) {

  const [name, setName] = useState("");
  const [slug, setSlug] = useState(initialSlug);
  const [shortName, setShortName] = useState("");
  const [tagline, setTagline] = useState("");
  const [icon, setIcon] = useState("Boxes");
  const [accent, setAccent] = useState("");
  const [blurb, setBlurb] = useState("");

  const [tech, setTech] = useState<Tech[]>([]);
  const [exps, setExps] = useState<Exp[]>([]);
  const [projs, setProjs] = useState<Proj[]>([]);

  const [sharedTech, setSharedTech] = useState<string[]>([]);
  const [sharedExp, setSharedExp] = useState<string[]>([]);
  const [shared, setShared] = useState<string[]>([]);

  const toggle = (
    setter: (fn: (prev: string[]) => string[]) => void,
    id: string
  ) => setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const payload = {
    stack: {
      slug: slug || slugify(name),
      name,
      short_name: shortName,
      tagline,
      icon: icon || "Boxes",
      accent: accent.trim() || "from-zinc-500 to-zinc-700",
      blurb,
      sort_order: 0,
    },
    tech: tech
      .filter((t) => t.label.trim())
      .map((t) => ({ label: t.label, icon: t.icon || "Boxes", items: splitTokens(t.items) })),
    existingTechIds: sharedTech,
    experiences: exps
      .filter((e) => e.company.trim())
      .map((e) => ({
        company: e.company,
        role: e.role,
        period: e.period,
        location: e.location,
        points: splitLines(e.points),
      })),
    existingExperienceIds: sharedExp,
    newProjects: projs
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name,
        link: p.link,
        role: p.role,
        tech: splitTokens(p.tech),
        points: splitLines(p.points),
        also_spans: p.also_spans,
      })),
    existingProjectIds: shared,
  };

  const [state, formAction, pending] = useActionState<CreateStackState, FormData>(
    createStackWithContent,
    undefined
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-emerald-900">
          “{state.name}” created 🎉
        </h2>
        <p className="mt-1 text-sm text-emerald-700">
          Your stack portfolio is live with all its content.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${state.slug}`}
            target="_blank"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            View portfolio → /{state.slug}
          </Link>
          <Link
            href="/admin/stacks"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Back to portfolios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      <Section title="Portfolio" desc="The portfolio shell at /<slug>.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <L>Name *</L>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Go / Golang"
              className={input}
            />
          </label>
          <label className="block">
            <L>Slug *</L>
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="auto-generated hash"
              className={input}
            />
          </label>
          <label className="block">
            <L>Short name *</L>
            <input
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="Go"
              className={input}
            />
          </label>
          <label className="block">
            <L>Tagline</L>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Go · gRPC · Kubernetes"
              className={input}
            />
          </label>
          <label className="block">
            <L>Icon</L>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-700">
                <DynamicIcon name={icon} className="h-4 w-4" />
              </span>
              <select value={icon} onChange={(e) => setIcon(e.target.value)} className={input}>
                {iconNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="block">
            <L>Accent (tailwind gradient)</L>
            <input
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              placeholder="from-sky-500 to-cyan-500"
              className={input}
            />
          </label>
          <label className="block sm:col-span-2">
            <L>Blurb</L>
            <textarea
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              rows={3}
              className={`${input} resize-y`}
            />
          </label>
        </div>
      </Section>

      <Section
        title="Tech categories"
        desc="Optional. Add new categories and/or share existing ones into this stack."
      >
        <SharePicker
          title="Share existing tech categories"
          options={existingTech}
          selected={sharedTech}
          onToggle={(id) => toggle(setSharedTech, id)}
        />
        {tech.map((t, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <L>Label</L>
                <input
                  value={t.label}
                  onChange={(e) => setTech(patch(tech, i, "label", e.target.value))}
                  placeholder="Backend"
                  className={input}
                />
              </label>
              <label className="block">
                <L>Icon</L>
                <select
                  value={t.icon}
                  onChange={(e) => setTech(patch(tech, i, "icon", e.target.value))}
                  className={input}
                >
                  {iconNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <L>Items (comma- or newline-separated)</L>
                <textarea
                  value={t.items}
                  onChange={(e) => setTech(patch(tech, i, "items", e.target.value))}
                  rows={2}
                  placeholder="Go, gRPC, Gin"
                  className={`${input} resize-y`}
                />
              </label>
            </div>
            <div className="mt-2 text-right">
              <RemoveBtn onClick={() => setTech(tech.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => setTech([...tech, { ...emptyTech }])}>
          + Add tech category
        </AddBtn>
      </Section>

      <Section
        title="Experience"
        desc="Optional. Add new entries and/or share existing ones into this stack."
      >
        <SharePicker
          title="Share existing experiences"
          options={existingExperiences}
          selected={sharedExp}
          onToggle={(id) => toggle(setSharedExp, id)}
        />
        {exps.map((e, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <L>Company</L>
                <input
                  value={e.company}
                  onChange={(ev) => setExps(patch(exps, i, "company", ev.target.value))}
                  className={input}
                />
              </label>
              <label className="block">
                <L>Role</L>
                <input
                  value={e.role}
                  onChange={(ev) => setExps(patch(exps, i, "role", ev.target.value))}
                  className={input}
                />
              </label>
              <label className="block">
                <L>Period</L>
                <input
                  value={e.period}
                  onChange={(ev) => setExps(patch(exps, i, "period", ev.target.value))}
                  placeholder="Mar 2020 – Present"
                  className={input}
                />
              </label>
              <label className="block">
                <L>Location</L>
                <input
                  value={e.location}
                  onChange={(ev) => setExps(patch(exps, i, "location", ev.target.value))}
                  className={input}
                />
              </label>
              <label className="block sm:col-span-2">
                <L>Highlights (one per line)</L>
                <textarea
                  value={e.points}
                  onChange={(ev) => setExps(patch(exps, i, "points", ev.target.value))}
                  rows={3}
                  className={`${input} resize-y`}
                />
              </label>
            </div>
            <div className="mt-2 text-right">
              <RemoveBtn onClick={() => setExps(exps.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => setExps([...exps, { ...emptyExp }])}>
          + Add experience
        </AddBtn>
      </Section>

      <Section
        title="Projects"
        desc="Add new projects and/or share existing ones into this stack."
      >
        <SharePicker
          title="Share existing projects"
          options={existingProjects}
          selected={shared}
          onToggle={(id) => toggle(setShared, id)}
        />

        {projs.map((p, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <L>Name</L>
                <input
                  value={p.name}
                  onChange={(e) => setProjs(patch(projs, i, "name", e.target.value))}
                  className={input}
                />
              </label>
              <label className="block">
                <L>Link</L>
                <input
                  value={p.link}
                  onChange={(e) => setProjs(patch(projs, i, "link", e.target.value))}
                  placeholder="https://…"
                  className={input}
                />
              </label>
              <label className="block">
                <L>Role</L>
                <input
                  value={p.role}
                  onChange={(e) => setProjs(patch(projs, i, "role", e.target.value))}
                  className={input}
                />
              </label>
              <label className="block">
                <L>Also spans</L>
                <input
                  value={p.also_spans}
                  onChange={(e) => setProjs(patch(projs, i, "also_spans", e.target.value))}
                  placeholder="Python · AI / GenAI"
                  className={input}
                />
              </label>
              <label className="block sm:col-span-2">
                <L>Tech (comma- or newline-separated)</L>
                <textarea
                  value={p.tech}
                  onChange={(e) => setProjs(patch(projs, i, "tech", e.target.value))}
                  rows={2}
                  className={`${input} resize-y`}
                />
              </label>
              <label className="block sm:col-span-2">
                <L>Highlights (one per line)</L>
                <textarea
                  value={p.points}
                  onChange={(e) => setProjs(patch(projs, i, "points", e.target.value))}
                  rows={3}
                  className={`${input} resize-y`}
                />
              </label>
            </div>
            <div className="mt-2 text-right">
              <RemoveBtn onClick={() => setProjs(projs.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => setProjs([...projs, { ...emptyProj }])}>
          + Add new project
        </AddBtn>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#43e1f0] px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#2fd6e8] disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create stack"}
        </button>
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
