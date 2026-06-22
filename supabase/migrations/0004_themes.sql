-- ===========================================================================
-- Themes: selectable, fully customizable design-token sets. One theme is active
-- site-wide (profile.active_theme_id). Safe to re-run.
-- ===========================================================================

create table if not exists public.themes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  tokens     jsonb not null default '{}',
  is_preset  boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profile
  add column if not exists active_theme_id uuid references public.themes(id) on delete set null;

alter table public.themes enable row level security;
drop policy if exists "public read themes" on public.themes;
create policy "public read themes" on public.themes for select using (true);

-- Seeded presets (all light, readable; accent + roundness vary).
insert into public.themes (name, slug, is_preset, sort_order, tokens) values
  ('Cyan',     'cyan',     true, 0, '{"accent":"#43e1f0","accentStrong":"#14b6cc","base":"#ffffff","panel":"#ffffff","text":"#0a0a0a","border":"#ebebed","radius":"0.5rem","font":"inter"}'),
  ('Violet',   'violet',   true, 1, '{"accent":"#8b5cf6","accentStrong":"#6d28d9","base":"#ffffff","panel":"#ffffff","text":"#0a0a0a","border":"#ececef","radius":"0.875rem","font":"inter"}'),
  ('Emerald',  'emerald',  true, 2, '{"accent":"#10b981","accentStrong":"#047857","base":"#ffffff","panel":"#ffffff","text":"#0a0a0a","border":"#e8ebe9","radius":"0.5rem","font":"inter"}'),
  ('Rose',     'rose',     true, 3, '{"accent":"#f43f5e","accentStrong":"#be123c","base":"#fffafa","panel":"#ffffff","text":"#0a0a0a","border":"#f0e6e8","radius":"0.875rem","font":"inter"}'),
  ('Amber',    'amber',    true, 4, '{"accent":"#f59e0b","accentStrong":"#b45309","base":"#fffdf7","panel":"#ffffff","text":"#0a0a0a","border":"#efe9dd","radius":"0.35rem","font":"inter"}'),
  ('Graphite', 'graphite', true, 5, '{"accent":"#3f3f46","accentStrong":"#18181b","base":"#ffffff","panel":"#ffffff","text":"#09090b","border":"#e4e4e7","radius":"0.5rem","font":"inter"}')
on conflict (slug) do nothing;

-- Activate the default theme if none is set yet.
update public.profile
set active_theme_id = (select id from public.themes where slug = 'cyan')
where id = 1 and active_theme_id is null;
