import { supabasePublic } from "./client";
import type {
  Person,
  Stack,
  TechCategory,
  ExperienceItem,
  ProjectItem,
} from "@/data/portfolio";
import { mergeTokens, type ThemeTokens } from "@/lib/theme";

export async function getActiveThemeTokens(): Promise<ThemeTokens> {
  const { data: profile } = await supabasePublic()
    .from("profile")
    .select("active_theme_id")
    .eq("id", 1)
    .maybeSingle<{ active_theme_id: string | null }>();

  if (!profile?.active_theme_id) return mergeTokens();

  const { data: theme } = await supabasePublic()
    .from("themes")
    .select("tokens")
    .eq("id", profile.active_theme_id)
    .maybeSingle<{ tokens: Partial<ThemeTokens> }>();

  return mergeTokens(theme?.tokens);
}

interface ProfileRow {
  name: string;
  title: string;
  tagline: string | null;
  intro: string | null;
  email: string | null;
  github: string | null;
  github_label: string | null;
  linkedin: string | null;
  linkedin_label: string | null;
  location: string | null;
  availability: string | null;
  education: string | null;
  certifications: string[] | null;
  stats: { label: string; value: string }[] | null;
}

interface TechRow {
  label: string;
  icon: string | null;
  items: string[] | null;
  sort_order: number | null;
}

interface ExperienceRow {
  company: string;
  role: string | null;
  period: string | null;
  location: string | null;
  points: string[] | null;
  sort_order: number | null;
}

interface ProjectRow {
  name: string;
  link: string | null;
  role: string | null;
  tech: string[] | null;
  points: string[] | null;
  also_spans: string | null;
  sort_order: number | null;
}

interface StackRow {
  slug: string;
  name: string;
  short_name: string;
  tagline: string | null;
  icon: string | null;
  accent: string | null;
  blurb: string | null;
  sort_order: number | null;
  tech_category_stacks?: { sort_order: number | null; tech_categories: TechRow | null }[];
  experience_stacks?: { sort_order: number | null; experiences: ExperienceRow | null }[];
  project_stacks?: { sort_order: number | null; projects: ProjectRow | null }[];
}

const bySortOrder = <T extends { sort_order: number | null }>(a: T, b: T) =>
  (a.sort_order ?? 0) - (b.sort_order ?? 0);

function mapTech(row: TechRow): TechCategory {
  return { label: row.label, icon: row.icon ?? "Boxes", items: row.items ?? [] };
}

function mapExperience(row: ExperienceRow): ExperienceItem {
  return {
    company: row.company,
    role: row.role ?? "",
    period: row.period ?? "",
    location: row.location ?? undefined,
    points: row.points ?? [],
  };
}

function mapProject(row: ProjectRow): ProjectItem {
  return {
    name: row.name,
    link: row.link ?? undefined,
    role: row.role ?? undefined,
    stack: row.tech ?? [],
    points: row.points ?? [],
    alsoSpans: row.also_spans ?? undefined,
  };
}

function mapStack(row: StackRow): Stack {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    tagline: row.tagline ?? "",
    icon: row.icon ?? "Boxes",
    accent: row.accent ?? "from-zinc-500 to-zinc-700",
    blurb: row.blurb ?? "",
    tech: (row.tech_category_stacks ?? [])
      .filter((ts) => ts.tech_categories)
      .sort(bySortOrder)
      .map((ts) => mapTech(ts.tech_categories as TechRow)),
    experience: (row.experience_stacks ?? [])
      .filter((es) => es.experiences)
      .sort(bySortOrder)
      .map((es) => mapExperience(es.experiences as ExperienceRow)),
    projects: (row.project_stacks ?? [])
      .filter((ps) => ps.projects)
      .sort(bySortOrder)
      .map((ps) => mapProject(ps.projects as ProjectRow)),
  };
}

export async function getProfile(): Promise<Person | null> {
  const { data, error } = await supabasePublic()
    .from("profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle<ProfileRow>();

  if (error) throw error;
  if (!data) return null;

  return {
    name: data.name,
    title: data.title,
    tagline: data.tagline ?? "",
    intro: data.intro ?? "",
    email: data.email ?? "",
    github: data.github ?? "",
    githubLabel: data.github_label ?? "",
    linkedin: data.linkedin ?? "",
    linkedinLabel: data.linkedin_label ?? "",
    location: data.location ?? "",
    availability: data.availability ?? "",
    education: data.education ?? "",
    certifications: data.certifications ?? [],
    stats: data.stats ?? [],
  };
}

export async function getStacks(): Promise<
  Pick<Stack, "slug" | "name" | "shortName" | "icon" | "accent" | "tagline">[]
> {
  const { data, error } = await supabasePublic()
    .from("stacks")
    .select("slug, name, short_name, icon, accent, tagline, sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  type StackListRow = Pick<
    StackRow,
    "slug" | "name" | "short_name" | "icon" | "accent" | "tagline"
  >;

  return ((data ?? []) as StackListRow[]).map((row) => ({
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    icon: row.icon ?? "Boxes",
    accent: row.accent ?? "from-zinc-500 to-zinc-700",
    tagline: row.tagline ?? "",
  }));
}

export async function getStackSlugs(): Promise<string[]> {
  const { data, error } = await supabasePublic().from("stacks").select("slug");
  if (error) throw error;
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getStackBySlug(slug: string): Promise<Stack | null> {
  const { data, error } = await supabasePublic()
    .from("stacks")
    .select(
      `slug, name, short_name, tagline, icon, accent, blurb, sort_order,
       tech_category_stacks(sort_order, tech_categories(*)),
       experience_stacks(sort_order, experiences(*)),
       project_stacks(sort_order, projects(*))`
    )
    .eq("slug", slug)
    .maybeSingle<StackRow>();

  if (error) throw error;
  if (!data) return null;
  return mapStack(data);
}
