"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/client";
import { requireAdmin } from "../auth/dal";

export type ActionState = { ok?: boolean; error?: string; message?: string };

export type CreateStackState =
  | { ok: true; slug: string; name: string }
  | { ok?: false; error: string }
  | undefined;

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function tokens(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function num(value: FormDataEntryValue | null): number {
  return Number(value) || 0;
}

async function slugOf(stackId: string): Promise<string | null> {
  const { data } = await supabaseAdmin()
    .from("stacks")
    .select("slug")
    .eq("id", stackId)
    .maybeSingle();
  return data?.slug ?? null;
}

function revalidatePublic(slug?: string | null) {
  revalidatePath("/");
  if (slug) revalidatePath(`/${slug}`);
}

async function revalidateAllPublic() {
  revalidatePath("/");
  const { data } = await supabaseAdmin().from("stacks").select("slug");
  for (const row of (data ?? []) as { slug: string }[]) {
    revalidatePath(`/${row.slug}`);
  }
}

async function revalidateStacksByIds(stackIds: string[]) {
  revalidatePath("/");
  if (stackIds.length === 0) return;
  const { data } = await supabaseAdmin()
    .from("stacks")
    .select("slug")
    .in("id", stackIds);
  for (const row of (data ?? []) as { slug: string }[]) {
    revalidatePath(`/${row.slug}`);
  }
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = str(formData.get("name"));
  const title = str(formData.get("title"));
  if (!name || !title) return { error: "Name and title are required." };

  const { error } = await supabaseAdmin().from("profile").upsert(
    {
      id: 1,
      name,
      title,
      tagline: str(formData.get("tagline")),
      intro: str(formData.get("intro")),
      email: str(formData.get("email")),
      github: str(formData.get("github")),
      github_label: str(formData.get("github_label")),
      linkedin: str(formData.get("linkedin")),
      linkedin_label: str(formData.get("linkedin_label")),
      location: str(formData.get("location")),
      availability: str(formData.get("availability")),
      education: str(formData.get("education")),
      certifications: lines(formData.get("certifications")),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) return { error: error.message };
  await revalidateAllPublic();
  return { ok: true, message: "Profile saved." };
}

const SlugRe = /^[a-z0-9-]+$/;

export async function addStack(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const slug = str(formData.get("slug")).toLowerCase();
  const name = str(formData.get("name"));
  const shortName = str(formData.get("short_name"));

  if (!slug || !name || !shortName) {
    return { error: "Slug, name and short name are required." };
  }
  if (!SlugRe.test(slug)) {
    return { error: "Slug may only contain lowercase letters, numbers and dashes." };
  }

  const { error } = await supabaseAdmin().from("stacks").insert({
    slug,
    name,
    short_name: shortName,
    tagline: str(formData.get("tagline")),
    icon: str(formData.get("icon")) || "Boxes",
    accent: str(formData.get("accent")) || "from-zinc-500 to-zinc-700",
    blurb: str(formData.get("blurb")),
    sort_order: num(formData.get("sort_order")),
  });

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : error.message,
    };
  }
  revalidatePublic(slug);
  return { ok: true, message: `Stack “${name}” added.` };
}

export async function updateStack(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  const slug = str(formData.get("slug")).toLowerCase();
  const name = str(formData.get("name"));
  const shortName = str(formData.get("short_name"));

  if (!id) return { error: "Missing stack id." };
  if (!slug || !name || !shortName) {
    return { error: "Slug, name and short name are required." };
  }
  if (!SlugRe.test(slug)) {
    return { error: "Slug may only contain lowercase letters, numbers and dashes." };
  }

  const { error } = await supabaseAdmin()
    .from("stacks")
    .update({
      slug,
      name,
      short_name: shortName,
      tagline: str(formData.get("tagline")),
      icon: str(formData.get("icon")) || "Boxes",
      accent: str(formData.get("accent")) || "from-zinc-500 to-zinc-700",
      blurb: str(formData.get("blurb")),
      sort_order: num(formData.get("sort_order")),
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "That slug is already in use." : error.message,
    };
  }
  revalidatePublic(slug);
  return { ok: true, message: "Stack updated." };
}

export async function deleteStack(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  if (!id) return { error: "Missing stack id." };

  const slug = await slugOf(id);

  const { error } = await supabaseAdmin().from("stacks").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePublic(slug);
  return { ok: true, message: "Stack deleted." };
}

async function stackIdsForTech(techId: string): Promise<string[]> {
  const { data } = await supabaseAdmin()
    .from("tech_category_stacks")
    .select("stack_id")
    .eq("tech_category_id", techId);
  return ((data ?? []) as { stack_id: string }[]).map((r) => r.stack_id);
}

export async function addTechCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const stackId = str(formData.get("stack_id"));
  const label = str(formData.get("label"));
  if (!stackId || !label) return { error: "Stack and label are required." };

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("tech_categories")
    .insert({
      label,
      icon: str(formData.get("icon")) || "Boxes",
      items: tokens(formData.get("items")),
      sort_order: num(formData.get("sort_order")),
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Could not create tech category." };

  const { error: linkErr } = await db.from("tech_category_stacks").insert({
    tech_category_id: data.id,
    stack_id: stackId,
    sort_order: num(formData.get("sort_order")),
  });
  if (linkErr) return { error: linkErr.message };

  revalidatePublic(await slugOf(stackId));
  return { ok: true, message: `Tech category “${label}” added.` };
}

export async function updateTechCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  const label = str(formData.get("label"));
  if (!id) return { error: "Missing tech category id." };
  if (!label) return { error: "Label is required." };

  const { error } = await supabaseAdmin()
    .from("tech_categories")
    .update({
      label,
      icon: str(formData.get("icon")) || "Boxes",
      items: tokens(formData.get("items")),
      sort_order: num(formData.get("sort_order")),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  await revalidateStacksByIds(await stackIdsForTech(id));
  return { ok: true, message: "Tech category updated." };
}

export async function deleteTechCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  if (!id) return { error: "Missing tech category id." };

  const stackIds = await stackIdsForTech(id);

  const { error } = await supabaseAdmin().from("tech_categories").delete().eq("id", id);
  if (error) return { error: error.message };

  await revalidateStacksByIds(stackIds);
  return { ok: true, message: "Tech category deleted." };
}

export async function attachTechCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const techId = str(formData.get("id"));
  const stackId = str(formData.get("stack_id"));
  if (!techId || !stackId) return { error: "Missing tech category or stack." };

  const { error } = await supabaseAdmin()
    .from("tech_category_stacks")
    .upsert(
      { tech_category_id: techId, stack_id: stackId, sort_order: 0 },
      { onConflict: "tech_category_id,stack_id" }
    );

  if (error) return { error: error.message };
  await revalidateStacksByIds([stackId]);
  return { ok: true, message: "Tech category attached." };
}

export async function detachTechCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const techId = str(formData.get("id"));
  const stackId = str(formData.get("stack_id"));
  if (!techId || !stackId) return { error: "Missing tech category or stack." };

  const { error } = await supabaseAdmin()
    .from("tech_category_stacks")
    .delete()
    .eq("tech_category_id", techId)
    .eq("stack_id", stackId);

  if (error) return { error: error.message };
  await revalidateStacksByIds([stackId]);
  return { ok: true, message: "Tech category removed from stack." };
}

async function stackIdsForExperience(experienceId: string): Promise<string[]> {
  const { data } = await supabaseAdmin()
    .from("experience_stacks")
    .select("stack_id")
    .eq("experience_id", experienceId);
  return ((data ?? []) as { stack_id: string }[]).map((r) => r.stack_id);
}

export async function addExperience(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const stackId = str(formData.get("stack_id"));
  const company = str(formData.get("company"));
  if (!stackId || !company) return { error: "Stack and company are required." };

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("experiences")
    .insert({
      company,
      role: str(formData.get("role")),
      period: str(formData.get("period")),
      location: str(formData.get("location")) || null,
      points: lines(formData.get("points")),
      sort_order: num(formData.get("sort_order")),
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Could not create experience." };

  const { error: linkErr } = await db.from("experience_stacks").insert({
    experience_id: data.id,
    stack_id: stackId,
    sort_order: num(formData.get("sort_order")),
  });
  if (linkErr) return { error: linkErr.message };

  revalidatePublic(await slugOf(stackId));
  return { ok: true, message: `Experience at “${company}” added.` };
}

export async function updateExperience(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  const company = str(formData.get("company"));
  if (!id) return { error: "Missing experience id." };
  if (!company) return { error: "Company is required." };

  const { error } = await supabaseAdmin()
    .from("experiences")
    .update({
      company,
      role: str(formData.get("role")),
      period: str(formData.get("period")),
      location: str(formData.get("location")) || null,
      points: lines(formData.get("points")),
      sort_order: num(formData.get("sort_order")),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  await revalidateStacksByIds(await stackIdsForExperience(id));
  return { ok: true, message: "Experience updated." };
}

export async function deleteExperience(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  if (!id) return { error: "Missing experience id." };

  const stackIds = await stackIdsForExperience(id);

  const { error } = await supabaseAdmin().from("experiences").delete().eq("id", id);
  if (error) return { error: error.message };

  await revalidateStacksByIds(stackIds);
  return { ok: true, message: "Experience deleted." };
}

export async function attachExperience(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const experienceId = str(formData.get("id"));
  const stackId = str(formData.get("stack_id"));
  if (!experienceId || !stackId) return { error: "Missing experience or stack." };

  const { error } = await supabaseAdmin()
    .from("experience_stacks")
    .upsert(
      { experience_id: experienceId, stack_id: stackId, sort_order: 0 },
      { onConflict: "experience_id,stack_id" }
    );

  if (error) return { error: error.message };
  await revalidateStacksByIds([stackId]);
  return { ok: true, message: "Experience attached." };
}

export async function detachExperience(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const experienceId = str(formData.get("id"));
  const stackId = str(formData.get("stack_id"));
  if (!experienceId || !stackId) return { error: "Missing experience or stack." };

  const { error } = await supabaseAdmin()
    .from("experience_stacks")
    .delete()
    .eq("experience_id", experienceId)
    .eq("stack_id", stackId);

  if (error) return { error: error.message };
  await revalidateStacksByIds([stackId]);
  return { ok: true, message: "Experience removed from stack." };
}

async function syncProjectStacks(projectId: string, stackIds: string[]) {
  const db = supabaseAdmin();
  await db.from("project_stacks").delete().eq("project_id", projectId);
  if (stackIds.length === 0) return;
  const rows = stackIds.map((stack_id, idx) => ({
    project_id: projectId,
    stack_id,
    sort_order: idx,
  }));
  await db.from("project_stacks").insert(rows);
}

export async function addProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = str(formData.get("name"));
  const stackIds = formData.getAll("stack_ids").map(String).filter(Boolean);
  if (!name) return { error: "Project name is required." };
  if (stackIds.length === 0) return { error: "Pick at least one stack." };

  const { data, error } = await supabaseAdmin()
    .from("projects")
    .insert({
      name,
      link: str(formData.get("link")) || null,
      role: str(formData.get("role")) || null,
      tech: tokens(formData.get("tech")),
      points: lines(formData.get("points")),
      also_spans: str(formData.get("also_spans")) || null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Could not create project." };
  await syncProjectStacks(data.id, stackIds);

  await revalidateStacksByIds(stackIds);
  return { ok: true, message: `Project “${name}” added.` };
}

export async function updateProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  const stackIds = formData.getAll("stack_ids").map(String).filter(Boolean);
  if (!id) return { error: "Missing project id." };
  if (!name) return { error: "Project name is required." };
  if (stackIds.length === 0) return { error: "Pick at least one stack." };

  const { data: before } = await supabaseAdmin()
    .from("project_stacks")
    .select("stack_id")
    .eq("project_id", id);
  const prevStackIds = ((before ?? []) as { stack_id: string }[]).map(
    (r) => r.stack_id
  );

  const { error } = await supabaseAdmin()
    .from("projects")
    .update({
      name,
      link: str(formData.get("link")) || null,
      role: str(formData.get("role")) || null,
      tech: tokens(formData.get("tech")),
      points: lines(formData.get("points")),
      also_spans: str(formData.get("also_spans")) || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  await syncProjectStacks(id, stackIds);

  await revalidateStacksByIds([...new Set([...prevStackIds, ...stackIds])]);
  return { ok: true, message: "Project updated." };
}

export async function deleteProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  if (!id) return { error: "Missing project id." };

  const { data: before } = await supabaseAdmin()
    .from("project_stacks")
    .select("stack_id")
    .eq("project_id", id);
  const stackIds = ((before ?? []) as { stack_id: string }[]).map((r) => r.stack_id);

  const { error } = await supabaseAdmin().from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  await revalidateStacksByIds(stackIds);
  return { ok: true, message: "Project deleted." };
}

export async function attachProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const projectId = str(formData.get("id"));
  const stackId = str(formData.get("stack_id"));
  if (!projectId || !stackId) return { error: "Missing project or stack." };

  const { error } = await supabaseAdmin()
    .from("project_stacks")
    .upsert(
      { project_id: projectId, stack_id: stackId, sort_order: 0 },
      { onConflict: "project_id,stack_id" }
    );

  if (error) return { error: error.message };
  await revalidateStacksByIds([stackId]);
  return { ok: true, message: "Project attached." };
}

export async function detachProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const projectId = str(formData.get("id"));
  const stackId = str(formData.get("stack_id"));
  if (!projectId || !stackId) return { error: "Missing project or stack." };

  const { error } = await supabaseAdmin()
    .from("project_stacks")
    .delete()
    .eq("project_id", projectId)
    .eq("stack_id", stackId);

  if (error) return { error: error.message };
  await revalidateStacksByIds([stackId]);
  return { ok: true, message: "Project removed from stack." };
}

const CreateStackSchema = z.object({
  stack: z.object({
    slug: z.string().trim().toLowerCase().regex(SlugRe, "Invalid slug."),
    name: z.string().trim().min(1),
    short_name: z.string().trim().min(1),
    tagline: z.string().trim().default(""),
    icon: z.string().trim().default("Boxes"),
    accent: z.string().trim().default("from-zinc-500 to-zinc-700"),
    blurb: z.string().trim().default(""),
    sort_order: z.number().int().default(0),
  }),
  tech: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        icon: z.string().trim().default("Boxes"),
        items: z.array(z.string()).default([]),
      })
    )
    .default([]),

  existingTechIds: z.array(z.string()).default([]),
  experiences: z
    .array(
      z.object({
        company: z.string().trim().min(1),
        role: z.string().trim().default(""),
        period: z.string().trim().default(""),
        location: z.string().trim().default(""),
        points: z.array(z.string()).default([]),
      })
    )
    .default([]),

  existingExperienceIds: z.array(z.string()).default([]),
  newProjects: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        link: z.string().trim().default(""),
        role: z.string().trim().default(""),
        tech: z.array(z.string()).default([]),
        points: z.array(z.string()).default([]),
        also_spans: z.string().trim().default(""),
      })
    )
    .default([]),

  existingProjectIds: z.array(z.string()).default([]),
});

export async function createStackWithContent(
  _prev: CreateStackState,
  formData: FormData
): Promise<CreateStackState> {
  await requireAdmin();

  const parsed = CreateStackSchema.safeParse(
    JSON.parse(str(formData.get("payload")) || "{}")
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }
  const {
    stack,
    tech,
    existingTechIds,
    experiences,
    existingExperienceIds,
    newProjects,
    existingProjectIds,
  } = parsed.data;
  const db = supabaseAdmin();

  const { data: stackRow, error: stackErr } = await db
    .from("stacks")
    .insert({
      slug: stack.slug,
      name: stack.name,
      short_name: stack.short_name,
      tagline: stack.tagline,
      icon: stack.icon,
      accent: stack.accent,
      blurb: stack.blurb,
      sort_order: stack.sort_order,
    })
    .select("id")
    .single();
  if (stackErr || !stackRow) {
    return {
      error:
        stackErr?.code === "23505"
          ? "That slug is already in use."
          : stackErr?.message ?? "Could not create the stack.",
    };
  }
  const stackId = stackRow.id as string;

  {
    const techLinks: { tech_category_id: string; stack_id: string; sort_order: number }[] = [];
    let order = 0;
    if (tech.length) {
      const { data: inserted, error } = await db
        .from("tech_categories")
        .insert(
          tech.map((t, idx) => ({
            label: t.label,
            icon: t.icon,
            items: t.items,
            sort_order: idx,
          }))
        )
        .select("id");
      if (error) return { error: `Stack created, but tech failed: ${error.message}` };
      for (const row of inserted ?? []) {
        techLinks.push({ tech_category_id: row.id as string, stack_id: stackId, sort_order: order++ });
      }
    }
    for (const techId of existingTechIds) {
      techLinks.push({ tech_category_id: techId, stack_id: stackId, sort_order: order++ });
    }
    if (techLinks.length) {
      const { error } = await db
        .from("tech_category_stacks")
        .upsert(techLinks, { onConflict: "tech_category_id,stack_id" });
      if (error)
        return { error: `Stack created, but linking tech failed: ${error.message}` };
    }
  }

  {
    const expLinks: { experience_id: string; stack_id: string; sort_order: number }[] = [];
    let order = 0;
    if (experiences.length) {
      const { data: inserted, error } = await db
        .from("experiences")
        .insert(
          experiences.map((e, idx) => ({
            company: e.company,
            role: e.role,
            period: e.period,
            location: e.location || null,
            points: e.points,
            sort_order: idx,
          }))
        )
        .select("id");
      if (error)
        return { error: `Stack created, but experience failed: ${error.message}` };
      for (const row of inserted ?? []) {
        expLinks.push({ experience_id: row.id as string, stack_id: stackId, sort_order: order++ });
      }
    }
    for (const experienceId of existingExperienceIds) {
      expLinks.push({ experience_id: experienceId, stack_id: stackId, sort_order: order++ });
    }
    if (expLinks.length) {
      const { error } = await db
        .from("experience_stacks")
        .upsert(expLinks, { onConflict: "experience_id,stack_id" });
      if (error)
        return { error: `Stack created, but linking experience failed: ${error.message}` };
    }
  }

  const linkRows: { project_id: string; stack_id: string; sort_order: number }[] = [];
  let order = 0;
  if (newProjects.length) {
    const { data: inserted, error } = await db
      .from("projects")
      .insert(
        newProjects.map((p) => ({
          name: p.name,
          link: p.link || null,
          role: p.role || null,
          tech: p.tech,
          points: p.points,
          also_spans: p.also_spans || null,
        }))
      )
      .select("id");
    if (error)
      return { error: `Stack created, but projects failed: ${error.message}` };
    for (const row of inserted ?? []) {
      linkRows.push({ project_id: row.id as string, stack_id: stackId, sort_order: order++ });
    }
  }

  for (const projectId of existingProjectIds) {
    linkRows.push({ project_id: projectId, stack_id: stackId, sort_order: order++ });
  }

  if (linkRows.length) {
    const { error } = await db
      .from("project_stacks")
      .upsert(linkRows, { onConflict: "project_id,stack_id" });
    if (error)
      return { error: `Stack created, but linking projects failed: ${error.message}` };
  }

  revalidatePublic(stack.slug);
  return { ok: true, slug: stack.slug, name: stack.name };
}
