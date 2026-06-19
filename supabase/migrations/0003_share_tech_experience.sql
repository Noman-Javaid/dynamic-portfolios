-- ===========================================================================
-- Tech categories and experiences become many-to-many with stacks (like
-- projects already are): one entity can appear under several stacks, and
-- "removing" it from a stack just deletes the association, not the entity.
-- Safe to re-run.
-- ===========================================================================

create table if not exists public.tech_category_stacks (
  tech_category_id uuid not null references public.tech_categories(id) on delete cascade,
  stack_id         uuid not null references public.stacks(id)          on delete cascade,
  sort_order int not null default 0,
  primary key (tech_category_id, stack_id)
);

create table if not exists public.experience_stacks (
  experience_id uuid not null references public.experiences(id) on delete cascade,
  stack_id      uuid not null references public.stacks(id)      on delete cascade,
  sort_order int not null default 0,
  primary key (experience_id, stack_id)
);

create index if not exists idx_tech_category_stacks_stack on public.tech_category_stacks(stack_id);
create index if not exists idx_tech_category_stacks_tech  on public.tech_category_stacks(tech_category_id);
create index if not exists idx_experience_stacks_stack    on public.experience_stacks(stack_id);
create index if not exists idx_experience_stacks_exp      on public.experience_stacks(experience_id);

-- Backfill associations from the original one-to-many columns.
insert into public.tech_category_stacks (tech_category_id, stack_id, sort_order)
select id, stack_id, sort_order
from public.tech_categories
where stack_id is not null
on conflict (tech_category_id, stack_id) do nothing;

insert into public.experience_stacks (experience_id, stack_id, sort_order)
select id, stack_id, sort_order
from public.experiences
where stack_id is not null
on conflict (experience_id, stack_id) do nothing;

-- The legacy columns are no longer the source of truth; associations now live
-- in the join tables (mirrors what 0002 did for projects).
alter table public.tech_categories alter column stack_id drop not null;
alter table public.experiences     alter column stack_id drop not null;

-- Row Level Security : public read of associations.
alter table public.tech_category_stacks enable row level security;
alter table public.experience_stacks    enable row level security;

drop policy if exists "public read tech_category_stacks" on public.tech_category_stacks;
drop policy if exists "public read experience_stacks"    on public.experience_stacks;

create policy "public read tech_category_stacks"
  on public.tech_category_stacks for select using (true);
create policy "public read experience_stacks"
  on public.experience_stacks for select using (true);
