-- ===========================================================================
-- Portfolio schema — profile, stacks and their nested content, plus admin users.
-- Safe to re-run (idempotent).
-- ===========================================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- profile : single row describing the person (id is pinned to 1)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id             int primary key default 1,
  name           text not null,
  title          text not null,
  tagline        text,
  intro          text,
  email          text,
  github         text,
  github_label   text,
  linkedin       text,
  linkedin_label text,
  location       text,
  availability   text,
  education       text,
  certifications text[] not null default '{}',
  stats          jsonb  not null default '[]',
  updated_at     timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);

-- ---------------------------------------------------------------------------
-- stacks : one per stack-portfolio (Rails, Python, JS, …). `slug` drives URLs.
-- ---------------------------------------------------------------------------
create table if not exists public.stacks (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  short_name text not null,
  tagline    text,
  icon       text,            -- Lucide icon name, e.g. "Gem"
  accent     text,            -- tailwind gradient utility classes
  blurb      text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tech_categories / experiences / projects : nested content per stack
-- ---------------------------------------------------------------------------
create table if not exists public.tech_categories (
  id         uuid primary key default gen_random_uuid(),
  stack_id   uuid not null references public.stacks(id) on delete cascade,
  label      text not null,
  icon       text,
  items      text[] not null default '{}',
  sort_order int not null default 0
);

create table if not exists public.experiences (
  id         uuid primary key default gen_random_uuid(),
  stack_id   uuid not null references public.stacks(id) on delete cascade,
  company    text not null,
  role       text,
  period     text,
  location   text,
  points     text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  stack_id   uuid not null references public.stacks(id) on delete cascade,
  name       text not null,
  link       text,
  role       text,
  tech       text[] not null default '{}',  -- the project's tech-tag list
  points     text[] not null default '{}',
  also_spans text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- users : admin accounts (custom auth, bcrypt password hashes)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  role          text not null default 'admin',
  created_at    timestamptz not null default now()
);

create index if not exists idx_tech_categories_stack on public.tech_categories(stack_id);
create index if not exists idx_experiences_stack     on public.experiences(stack_id);
create index if not exists idx_projects_stack         on public.projects(stack_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   * portfolio content : public read, no public write
--   * users             : no public access at all (service_role bypasses RLS)
-- ---------------------------------------------------------------------------
alter table public.profile         enable row level security;
alter table public.stacks          enable row level security;
alter table public.tech_categories enable row level security;
alter table public.experiences     enable row level security;
alter table public.projects        enable row level security;
alter table public.users           enable row level security;

drop policy if exists "public read profile" on public.profile;
drop policy if exists "public read stacks" on public.stacks;
drop policy if exists "public read tech" on public.tech_categories;
drop policy if exists "public read experiences" on public.experiences;
drop policy if exists "public read projects" on public.projects;

create policy "public read profile"     on public.profile         for select using (true);
create policy "public read stacks"      on public.stacks          for select using (true);
create policy "public read tech"        on public.tech_categories for select using (true);
create policy "public read experiences" on public.experiences     for select using (true);
create policy "public read projects"    on public.projects        for select using (true);
