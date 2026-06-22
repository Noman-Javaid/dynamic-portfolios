"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/client";
import { requireAdmin } from "../auth/dal";
import { DEFAULT_TOKENS } from "@/lib/theme";

export type ThemeState = { ok?: boolean; error?: string; message?: string };

const HEX = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, "Use a hex color.");
const TokensSchema = z.object({
  accent: HEX,
  accentStrong: HEX,
  base: HEX,
  panel: HEX,
  text: HEX,
  border: HEX,
  radius: z.string().regex(/^[0-9]*\.?[0-9]+rem$/, "Invalid radius."),
  font: z.enum(["inter", "system", "serif", "mono"]),
});

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function revalidateEverything(slugs: string[]) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  for (const s of slugs) revalidatePath(`/${s}`);
}

async function allSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin().from("stacks").select("slug");
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}

function parseTokens(formData: FormData) {
  const raw = { ...DEFAULT_TOKENS };
  for (const key of Object.keys(DEFAULT_TOKENS) as (keyof typeof DEFAULT_TOKENS)[]) {
    const v = str(formData.get(key));
    if (v) raw[key] = v;
  }
  return TokensSchema.safeParse(raw);
}

export async function addTheme(_prev: ThemeState, formData: FormData): Promise<ThemeState> {
  await requireAdmin();

  const name = str(formData.get("name"));
  if (!name) return { error: "Theme name is required." };

  const parsed = parseTokens(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid theme." };

  const slug =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
    `theme-${Date.now()}`;

  const db = supabaseAdmin();
  const { count } = await db.from("themes").select("*", { count: "exact", head: true });
  const { data, error } = await db
    .from("themes")
    .insert({ name, slug, tokens: parsed.data, is_preset: false, sort_order: count ?? 0 })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.code === "23505" ? "A theme with that name exists." : error?.message ?? "Could not create theme." };
  }

  const activate = str(formData.get("activate")) === "1";
  if (activate) {
    await db.from("profile").update({ active_theme_id: data.id }).eq("id", 1);
  }

  revalidateEverything(await allSlugs());
  return { ok: true, message: `Theme “${name}” created.` };
}

export async function updateTheme(_prev: ThemeState, formData: FormData): Promise<ThemeState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!id) return { error: "Missing theme id." };
  if (!name) return { error: "Theme name is required." };

  const parsed = parseTokens(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid theme." };

  const { error } = await supabaseAdmin()
    .from("themes")
    .update({ name, tokens: parsed.data })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidateEverything(await allSlugs());
  return { ok: true, message: "Theme saved." };
}

export async function saveTheme(prev: ThemeState, formData: FormData): Promise<ThemeState> {
  return str(formData.get("id")) ? updateTheme(prev, formData) : addTheme(prev, formData);
}

export async function deleteTheme(_prev: ThemeState, formData: FormData): Promise<ThemeState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  if (!id) return { error: "Missing theme id." };

  const { error } = await supabaseAdmin().from("themes").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateEverything(await allSlugs());
  return { ok: true, message: "Theme deleted." };
}

export async function setActiveTheme(_prev: ThemeState, formData: FormData): Promise<ThemeState> {
  await requireAdmin();

  const id = str(formData.get("id"));
  if (!id) return { error: "Missing theme id." };

  const { error } = await supabaseAdmin()
    .from("profile")
    .update({ active_theme_id: id })
    .eq("id", 1);
  if (error) return { error: error.message };

  revalidateEverything(await allSlugs());
  return { ok: true, message: "Theme activated." };
}
