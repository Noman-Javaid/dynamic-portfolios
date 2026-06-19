-- ===========================================================================
-- Projects become many-to-many with stacks: one project can appear under
-- several stacks. Tech categories and experiences stay one-to-many.
-- Safe to re-run.
-- ===========================================================================

create table if not exists public.project_stacks (
  project_id uuid not null references public.projects(id) on delete cascade,
  stack_id   uuid not null references public.stacks(id)   on delete cascade,
  sort_order int  not null default 0,
  primary key (project_id, stack_id)
);

create index if not exists idx_project_stacks_stack   on public.project_stacks(stack_id);
create index if not exists idx_project_stacks_project on public.project_stacks(project_id);

-- Backfill associations from the original one-to-many column.
insert into public.project_stacks (project_id, stack_id, sort_order)
select id, stack_id, sort_order
from public.projects
where stack_id is not null
on conflict (project_id, stack_id) do nothing;

-- The legacy column is no longer the source of truth; allow projects to exist
-- without a single owning stack (associations now live in project_stacks).
alter table public.projects alter column stack_id drop not null;

-- Row Level Security : public read of associations.
alter table public.project_stacks enable row level security;
drop policy if exists "public read project_stacks" on public.project_stacks;
create policy "public read project_stacks"
  on public.project_stacks for select using (true);
