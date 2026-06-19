"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/client";
import { requireAdmin } from "../auth/dal";
import { listTechCategories, listExperiences, listProjects } from "../lib/admin-queries";
import { chatJSON } from "../ai/llm";
import { iconNames } from "@/lib/icons";
import { randomHash } from "@/lib/utils";

export type GenerateState =
  | {
      ok: true;
      slug: string;
      name: string;
      summary: string;
      keywords: string[];
      counts: { tech: number; experiences: number; projects: number };
    }
  | { ok?: false; error: string }
  | undefined;

const ModelOutput = z.object({
  name: z.string().trim().min(1),
  short_name: z.string().trim().default(""),
  tagline: z.string().trim().default(""),
  blurb: z.string().trim().default(""),
  icon: z.string().trim().default("Boxes"),
  accent: z.string().trim().default("from-zinc-500 to-zinc-700"),
  tech_refs: z.array(z.coerce.number().int()).default([]),
  experience_refs: z.array(z.coerce.number().int()).default([]),
  project_refs: z.array(z.coerce.number().int()).default([]),
  matched_keywords: z.array(z.string()).default([]),
  summary: z.string().trim().default(""),
});

const SYSTEM_PROMPT = `You are an expert technical recruiter and portfolio strategist.
You receive a Job Description (JD) and a KNOWLEDGE BASE of a candidate's EXISTING
tech categories, work experiences and projects. Every item has a numeric "ref".

Goal: assemble the STRONGEST possible portfolio for THIS job description by selecting
relevant existing items, returned as their "ref" numbers. Rules you MUST obey:
- Only use ref numbers that appear in the knowledge base. Never invent items.
- INCLUDE EVERY item relevant to the JD. For a broad role (e.g. full-stack) this is
  usually MANY items across all three lists. A match counts if the item shares ANY of
  the JD's technologies, responsibilities, domains or seniority signals. When unsure,
  INCLUDE it. Only omit items that are clearly unrelated. Never return all-empty lists
  when plausibly-relevant items exist.
- Order each list best-match first.
- "name": a SHORT role-style title, at most 3-4 words / ~32 chars (e.g.
  "Senior Full-Stack Engineer" or "Node.js + GCP Engineer"). No parentheticals or long
  tech lists. "short_name": 1-2 words (e.g. "Full-Stack").
- Choose "icon" from ALLOWED_ICONS and an "accent" = two Tailwind gradient classes
  (e.g. "from-sky-500 to-cyan-500").
- "matched_keywords" = the key JD terms you optimized for. "summary" = 1-2 sentences on
  why this selection fits the JD.
Respond with a SINGLE JSON object and nothing else.`;

async function uniqueHashSlug(): Promise<string> {
  const db = supabaseAdmin();
  for (let i = 0; i < 5; i++) {
    const candidate = randomHash(8);
    const { data } = await db
      .from("stacks")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  return randomHash(10);
}

export async function generatePortfolio(
  _prev: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  await requireAdmin();

  const jd = String(formData.get("jd") ?? "").trim();
  if (jd.length < 40) {
    return { error: "Paste a fuller job description (at least a few sentences)." };
  }

  const [tech, experiences, projects] = await Promise.all([
    listTechCategories(),
    listExperiences(),
    listProjects(),
  ]);

  if (tech.length === 0 && experiences.length === 0 && projects.length === 0) {
    return { error: "No existing content to select from. Add some stacks first." };
  }

  const knowledgeBase = {
    tech_categories: tech.map((t, i) => ({ ref: i + 1, label: t.label, items: t.items })),
    experiences: experiences.map((e, i) => ({
      ref: i + 1,
      company: e.company,
      role: e.role,
      period: e.period,
      points: e.points,
    })),
    projects: projects.map((p, i) => ({
      ref: i + 1,
      name: p.name,
      role: p.role,
      tech: p.tech,
      points: p.points,
      also_spans: p.also_spans,
    })),
  };

  const userPrompt = [
    "ALLOWED_ICONS:",
    JSON.stringify(iconNames),
    "",
    "KNOWLEDGE_BASE (select items by their `ref` number):",
    JSON.stringify(knowledgeBase),
    "",
    "JOB_DESCRIPTION:",
    jd,
    "",
    "Return JSON with exactly these keys: name (short, <=4 words), short_name, tagline,",
    "blurb, icon, accent, tech_refs, experience_refs, project_refs, matched_keywords, summary.",
    "tech_refs/experience_refs/project_refs are arrays of ref NUMBERS from the knowledge base.",
  ].join("\n");

  let parsed: z.infer<typeof ModelOutput>;
  try {
    const raw = await chatJSON([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);
    const json = JSON.parse(raw);
    const result = ModelOutput.safeParse(json);
    if (!result.success) {
      return { error: "The AI response did not match the expected format. Try again." };
    }
    parsed = result.data;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "AI generation failed." };
  }

  const pick = <T extends { id: string }>(refs: number[], arr: T[]): string[] => {
    const ids: string[] = [];
    const seen = new Set<number>();
    for (const ref of refs) {
      const idx = ref - 1;
      if (Number.isInteger(idx) && idx >= 0 && idx < arr.length && !seen.has(idx)) {
        seen.add(idx);
        ids.push(arr[idx].id);
      }
    }
    return ids;
  };

  const selTech = pick(parsed.tech_refs, tech);
  const selExp = pick(parsed.experience_refs, experiences);
  const selProj = pick(parsed.project_refs, projects);

  if (selTech.length === 0 && selExp.length === 0 && selProj.length === 0) {
    return {
      error:
        "The AI couldn't match any existing content to this job description. Try a more detailed JD.",
    };
  }

  const db = supabaseAdmin();

  const { count } = await db.from("stacks").select("*", { count: "exact", head: true });
  const slug = await uniqueHashSlug();
  const icon = iconNames.includes(parsed.icon) ? parsed.icon : "Boxes";

  const name = parsed.name.split(/\s+/).slice(0, 4).join(" ");

  const { data: stackRow, error: stackErr } = await db
    .from("stacks")
    .insert({
      slug,
      name,
      short_name: parsed.short_name || name,
      tagline: parsed.tagline,
      icon,
      accent: parsed.accent || "from-zinc-500 to-zinc-700",
      blurb: parsed.blurb,
      sort_order: count ?? 0,
    })
    .select("id")
    .single();

  if (stackErr || !stackRow) {
    return { error: stackErr?.message ?? "Could not create the generated stack." };
  }
  const stackId = stackRow.id as string;

  const link = async (
    table: string,
    fk: string,
    ids: string[]
  ): Promise<string | null> => {
    if (ids.length === 0) return null;
    const rows = ids.map((id, idx) => ({
      [fk]: id,
      stack_id: stackId,
      sort_order: idx,
    }));
    const { error } = await db.from(table).upsert(rows, { onConflict: `${fk},stack_id` });
    return error?.message ?? null;
  };

  const linkErr =
    (await link("tech_category_stacks", "tech_category_id", selTech)) ??
    (await link("experience_stacks", "experience_id", selExp)) ??
    (await link("project_stacks", "project_id", selProj));

  if (linkErr) {
    return { error: `Stack created, but linking content failed: ${linkErr}` };
  }

  revalidatePath("/");
  revalidatePath(`/${slug}`);

  return {
    ok: true,
    slug,
    name,
    summary: parsed.summary,
    keywords: parsed.matched_keywords,
    counts: { tech: selTech.length, experiences: selExp.length, projects: selProj.length },
  };
}
