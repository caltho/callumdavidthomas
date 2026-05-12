-- =====================================================================
-- callumdavidthomas.com — portfolio schema
-- Colocated in `almanac` Supabase project; all objects prefixed
-- `portfolio_*` so they don't collide with the host app.
-- =====================================================================

-- ---------------------------------------------------------------------
-- updated_at trigger function (shared by all portfolio tables)
-- ---------------------------------------------------------------------
create or replace function public.portfolio_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- portfolio_admins — allowlist of users permitted to write content
-- ---------------------------------------------------------------------
create table if not exists public.portfolio_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;

drop policy if exists "portfolio_admins read" on public.portfolio_admins;
create policy "portfolio_admins read" on public.portfolio_admins
  for select using (
    exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid())
  );

-- A helper boolean: is_admin(uid)
create or replace function public.portfolio_is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.portfolio_admins where user_id = uid);
$$;

-- ---------------------------------------------------------------------
-- portfolio_projects
-- ---------------------------------------------------------------------
create table if not exists public.portfolio_projects (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  number           int  not null default 0,
  title            text not null,
  summary          text not null default '',
  long_description text not null default '',
  year             int,
  role             text,
  tech_stack       text[] not null default '{}',
  tags             text[] not null default '{}',
  thumbnail        text,
  images           text[] not null default '{}',
  link             text,
  github           text,
  codeblock        jsonb,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists portfolio_projects_number_idx on public.portfolio_projects(number);
create index if not exists portfolio_projects_published_idx on public.portfolio_projects(published);

alter table public.portfolio_projects enable row level security;

drop policy if exists "portfolio_projects public read" on public.portfolio_projects;
create policy "portfolio_projects public read" on public.portfolio_projects
  for select using (published = true);

drop policy if exists "portfolio_projects admin all" on public.portfolio_projects;
create policy "portfolio_projects admin all" on public.portfolio_projects
  for all
  using (public.portfolio_is_admin(auth.uid()))
  with check (public.portfolio_is_admin(auth.uid()));

drop trigger if exists portfolio_projects_set_updated_at on public.portfolio_projects;
create trigger portfolio_projects_set_updated_at
  before update on public.portfolio_projects
  for each row execute function public.portfolio_set_updated_at();

-- ---------------------------------------------------------------------
-- portfolio_stuff
-- ---------------------------------------------------------------------
create table if not exists public.portfolio_stuff (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  number           int  not null default 0,
  title            text not null,
  summary          text not null default '',
  long_description text not null default '',
  year             int,
  location         text,
  tags             text[] not null default '{}',
  thumbnail        text,
  images           text[] not null default '{}',
  links            jsonb not null default '[]'::jsonb,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists portfolio_stuff_number_idx on public.portfolio_stuff(number);
create index if not exists portfolio_stuff_published_idx on public.portfolio_stuff(published);

alter table public.portfolio_stuff enable row level security;

drop policy if exists "portfolio_stuff public read" on public.portfolio_stuff;
create policy "portfolio_stuff public read" on public.portfolio_stuff
  for select using (published = true);

drop policy if exists "portfolio_stuff admin all" on public.portfolio_stuff;
create policy "portfolio_stuff admin all" on public.portfolio_stuff
  for all
  using (public.portfolio_is_admin(auth.uid()))
  with check (public.portfolio_is_admin(auth.uid()));

drop trigger if exists portfolio_stuff_set_updated_at on public.portfolio_stuff;
create trigger portfolio_stuff_set_updated_at
  before update on public.portfolio_stuff
  for each row execute function public.portfolio_set_updated_at();

-- ---------------------------------------------------------------------
-- portfolio_about — singleton row
-- ---------------------------------------------------------------------
create table if not exists public.portfolio_about (
  id          text primary key default 'singleton'
              check (id = 'singleton'),
  summary     text not null default '',
  description text not null default '',
  updated_at  timestamptz not null default now()
);

alter table public.portfolio_about enable row level security;

drop policy if exists "portfolio_about public read" on public.portfolio_about;
create policy "portfolio_about public read" on public.portfolio_about
  for select using (true);

drop policy if exists "portfolio_about admin all" on public.portfolio_about;
create policy "portfolio_about admin all" on public.portfolio_about
  for all
  using (public.portfolio_is_admin(auth.uid()))
  with check (public.portfolio_is_admin(auth.uid()));

drop trigger if exists portfolio_about_set_updated_at on public.portfolio_about;
create trigger portfolio_about_set_updated_at
  before update on public.portfolio_about
  for each row execute function public.portfolio_set_updated_at();

-- ---------------------------------------------------------------------
-- Storage bucket for portfolio media
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

drop policy if exists "portfolio_media public read" on storage.objects;
create policy "portfolio_media public read" on storage.objects
  for select
  using (bucket_id = 'portfolio-media');

drop policy if exists "portfolio_media admin write" on storage.objects;
create policy "portfolio_media admin write" on storage.objects
  for insert
  with check (
    bucket_id = 'portfolio-media'
    and public.portfolio_is_admin(auth.uid())
  );

drop policy if exists "portfolio_media admin update" on storage.objects;
create policy "portfolio_media admin update" on storage.objects
  for update
  using (
    bucket_id = 'portfolio-media'
    and public.portfolio_is_admin(auth.uid())
  );

drop policy if exists "portfolio_media admin delete" on storage.objects;
create policy "portfolio_media admin delete" on storage.objects
  for delete
  using (
    bucket_id = 'portfolio-media'
    and public.portfolio_is_admin(auth.uid())
  );
