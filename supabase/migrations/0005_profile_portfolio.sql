alter table public.profile
  add column if not exists portfolio text,
  add column if not exists portfolio_label text;
