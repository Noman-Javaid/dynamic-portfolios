import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { person, stacks } from "../src/data/portfolio";

config({ path: [".env.local", "supabase/.env"] });

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const db = createClient(
  required("NEXT_PUBLIC_SUPABASE_URL"),
  required("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

async function seedProfile() {
  const { error } = await db.from("profile").upsert(
    {
      id: 1,
      name: person.name,
      title: person.title,
      tagline: person.tagline,
      intro: person.intro,
      email: person.email,
      github: person.github,
      github_label: person.githubLabel,
      linkedin: person.linkedin,
      linkedin_label: person.linkedinLabel,
      location: person.location,
      availability: person.availability,
      education: person.education,
      certifications: person.certifications,
      stats: person.stats,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) throw error;
  console.log("✓ profile");
}

async function seedStacks() {

  await db.from("projects").delete().not("id", "is", null);
  await db.from("tech_categories").delete().not("id", "is", null);
  await db.from("experiences").delete().not("id", "is", null);

  for (let i = 0; i < stacks.length; i++) {
    const s = stacks[i];

    const { data: stackRow, error: stackErr } = await db
      .from("stacks")
      .upsert(
        {
          slug: s.slug,
          name: s.name,
          short_name: s.shortName,
          tagline: s.tagline,
          icon: s.icon,
          accent: s.accent,
          blurb: s.blurb,
          sort_order: i,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (stackErr) throw stackErr;

    const stackId = stackRow.id as string;

    const tech = s.tech.map((t) => ({
      label: t.label,
      icon: t.icon,
      items: t.items,
      sort_order: 0,
    }));
    const experiences = s.experience.map((e) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      location: e.location ?? null,
      points: e.points,
      sort_order: 0,
    }));
    const projects = s.projects.map((p) => ({
      name: p.name,
      link: p.link ?? null,
      role: p.role ?? null,
      tech: p.stack,
      points: p.points,
      also_spans: p.alsoSpans ?? null,
    }));

    if (tech.length) {
      const { data: inserted, error } = await db
        .from("tech_categories")
        .insert(tech)
        .select("id");
      if (error) throw error;
      const links = (inserted ?? []).map((row, idx) => ({
        tech_category_id: row.id as string,
        stack_id: stackId,
        sort_order: idx,
      }));
      const { error: linkErr } = await db.from("tech_category_stacks").insert(links);
      if (linkErr) throw linkErr;
    }
    if (experiences.length) {
      const { data: inserted, error } = await db
        .from("experiences")
        .insert(experiences)
        .select("id");
      if (error) throw error;
      const links = (inserted ?? []).map((row, idx) => ({
        experience_id: row.id as string,
        stack_id: stackId,
        sort_order: idx,
      }));
      const { error: linkErr } = await db.from("experience_stacks").insert(links);
      if (linkErr) throw linkErr;
    }
    if (projects.length) {
      const { data: inserted, error } = await db
        .from("projects")
        .insert(projects)
        .select("id");
      if (error) throw error;
      const links = (inserted ?? []).map((row, idx) => ({
        project_id: row.id as string,
        stack_id: stackId,
        sort_order: idx,
      }));
      const { error: linkErr } = await db.from("project_stacks").insert(links);
      if (linkErr) throw linkErr;
    }

    console.log(
      `✓ stack ${s.shortName} (${tech.length} tech, ${experiences.length} exp, ${projects.length} projects)`
    );
  }
}

async function seedAdmin() {
  const email = required("SEED_ADMIN_EMAIL").toLowerCase();
  const password = required("SEED_ADMIN_PASSWORD");

  const { data: existing } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    console.log(`✓ admin user already exists (${email}) — left unchanged`);
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);
  const { error } = await db
    .from("users")
    .insert({ email, password_hash, role: "admin" });
  if (error) throw error;
  console.log(`✓ admin user created (${email})`);
}

async function main() {
  console.log("Seeding database…");
  await seedProfile();
  await seedStacks();
  await seedAdmin();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
