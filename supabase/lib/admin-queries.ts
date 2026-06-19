import "server-only";
import { supabaseAdmin } from "./client";

export interface StackRow {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  tagline: string | null;
  icon: string | null;
  accent: string | null;
  blurb: string | null;
  sort_order: number;
}

export interface TechRow {
  id: string;
  label: string;
  icon: string | null;
  items: string[];
  sort_order: number;

  stacks: { id: string; name: string; slug: string }[];
  stack_ids: string[];
}

export interface ExperienceRow {
  id: string;
  company: string;
  role: string | null;
  period: string | null;
  location: string | null;
  points: string[];
  sort_order: number;

  stacks: { id: string; name: string; slug: string }[];
  stack_ids: string[];
}

export interface ProjectRow {
  id: string;
  name: string;
  link: string | null;
  role: string | null;
  tech: string[];
  points: string[];
  also_spans: string | null;

  stacks: { id: string; name: string; slug: string }[];
  stack_ids: string[];
}

export interface StackOption {
  id: string;
  name: string;
}

export interface ProjectOption {
  id: string;
  name: string;
  stackIds: string[];
}

export async function listStacks(): Promise<StackRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("stacks")
    .select(
      "id, slug, name, short_name, tagline, icon, accent, blurb, sort_order"
    )
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as StackRow[];
}

export async function stackOptions(): Promise<StackOption[]> {
  const { data, error } = await supabaseAdmin()
    .from("stacks")
    .select("id, name")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as StackOption[];
}

interface TechJoinRow {
  id: string;
  label: string;
  icon: string | null;
  items: string[] | null;
  sort_order: number;
  tech_category_stacks: { stack_id: string; stacks: { name: string; slug: string } | null }[];
}

export async function listTechCategories(): Promise<TechRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("tech_categories")
    .select(
      "id, label, icon, items, sort_order, tech_category_stacks(stack_id, stacks(name, slug))"
    )
    .order("sort_order", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as unknown as TechJoinRow[]).map((t) => ({
    id: t.id,
    label: t.label,
    icon: t.icon,
    items: t.items ?? [],
    sort_order: t.sort_order,
    stacks: (t.tech_category_stacks ?? [])
      .filter((ts) => ts.stacks)
      .map((ts) => ({ id: ts.stack_id, name: ts.stacks!.name, slug: ts.stacks!.slug })),
    stack_ids: (t.tech_category_stacks ?? []).map((ts) => ts.stack_id),
  }));
}

interface ExperienceJoinRow {
  id: string;
  company: string;
  role: string | null;
  period: string | null;
  location: string | null;
  points: string[] | null;
  sort_order: number;
  experience_stacks: { stack_id: string; stacks: { name: string; slug: string } | null }[];
}

export async function listExperiences(): Promise<ExperienceRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("experiences")
    .select(
      "id, company, role, period, location, points, sort_order, experience_stacks(stack_id, stacks(name, slug))"
    )
    .order("sort_order", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as unknown as ExperienceJoinRow[]).map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    period: e.period,
    location: e.location,
    points: e.points ?? [],
    sort_order: e.sort_order,
    stacks: (e.experience_stacks ?? [])
      .filter((es) => es.stacks)
      .map((es) => ({ id: es.stack_id, name: es.stacks!.name, slug: es.stacks!.slug })),
    stack_ids: (e.experience_stacks ?? []).map((es) => es.stack_id),
  }));
}

interface ProjectJoinRow {
  id: string;
  name: string;
  link: string | null;
  role: string | null;
  tech: string[] | null;
  points: string[] | null;
  also_spans: string | null;
  project_stacks: { stack_id: string; stacks: { name: string; slug: string } | null }[];
}

export async function listProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("projects")
    .select(
      "id, name, link, role, tech, points, also_spans, project_stacks(stack_id, stacks(name, slug))"
    )
    .order("name", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as unknown as ProjectJoinRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    link: p.link,
    role: p.role,
    tech: p.tech ?? [],
    points: p.points ?? [],
    also_spans: p.also_spans,
    stacks: (p.project_stacks ?? [])
      .filter((ps) => ps.stacks)
      .map((ps) => ({
        id: ps.stack_id,
        name: ps.stacks!.name,
        slug: ps.stacks!.slug,
      })),
    stack_ids: (p.project_stacks ?? []).map((ps) => ps.stack_id),
  }));
}

export async function listProjectOptions(): Promise<ProjectOption[]> {
  const { data, error } = await supabaseAdmin()
    .from("projects")
    .select("id, name, project_stacks(stack_id)")
    .order("name", { ascending: true });
  if (error) throw error;

  return (
    (data ?? []) as unknown as {
      id: string;
      name: string;
      project_stacks: { stack_id: string }[];
    }[]
  ).map((p) => ({
    id: p.id,
    name: p.name,
    stackIds: (p.project_stacks ?? []).map((ps) => ps.stack_id),
  }));
}

export async function counts(): Promise<{
  stacks: number;
  tech: number;
  experiences: number;
  projects: number;
}> {
  const db = supabaseAdmin();
  const head = { count: "exact" as const, head: true };
  const [s, t, e, p] = await Promise.all([
    db.from("stacks").select("*", head),
    db.from("tech_categories").select("*", head),
    db.from("experiences").select("*", head),
    db.from("projects").select("*", head),
  ]);
  return {
    stacks: s.count ?? 0,
    tech: t.count ?? 0,
    experiences: e.count ?? 0,
    projects: p.count ?? 0,
  };
}
