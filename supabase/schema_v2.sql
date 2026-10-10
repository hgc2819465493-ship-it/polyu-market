-- 理大二手網 · PolyU Marketplace — schema v2 (Supabase Auth accounts + images)
-- v1 tables (owner_token based) are kept as private backups named legacy_* (no API access).

do $$ begin
  if to_regclass('public.listings') is not null and to_regclass('public.legacy_listings_v1') is null
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='listings' and column_name='owner_token') then
    alter table public.listings rename to legacy_listings_v1;
    alter table public.daigou rename to legacy_daigou_v1;
    alter table public.errands rename to legacy_errands_v1;
    alter table public.reports rename to legacy_reports_v1;
  end if;
end $$;
revoke all on public.legacy_listings_v1, public.legacy_daigou_v1, public.legacy_errands_v1, public.legacy_reports_v1 from anon, authenticated;
drop trigger if exists pm_rate on public.legacy_listings_v1;
drop trigger if exists pm_rate on public.legacy_daigou_v1;
drop trigger if exists pm_rate on public.legacy_errands_v1;
drop trigger if exists pm_rate on public.legacy_reports_v1;
drop function if exists public.pm_delete_post(text, uuid, text);
drop function if exists public.pm_take_post(text, uuid, text);
drop function if exists public.pm_complete_errand(uuid, text);
drop function if exists public.pm_rate_guard();

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 30),
  is_polyu boolean not null default false
);
alter table public.profiles enable row level security;
drop policy if exists "profiles read" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles read" on public.profiles for select to anon, authenticated using (true);
create policy "profiles update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
revoke all on public.profiles from anon, authenticated;
grant select (id, display_name, is_polyu) on public.profiles to anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

create or replace function public.pm_handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, is_polyu)
  -- default name never derives from the email (a PolyU address contains the student ID)
  values (new.id, '同學 ' || upper(substr(replace(new.id::text, '-', ''), 1, 4)), coalesce(lower(new.email) like '%@connect.polyu.hk', false))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists pm_on_auth_user_created on auth.users;
create trigger pm_on_auth_user_created after insert on auth.users for each row execute function public.pm_handle_new_user();
create or replace function public.pm_handle_user_email() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set is_polyu = coalesce(lower(new.email) like '%@connect.polyu.hk', false) where id = new.id;
  return new;
end $$;
drop trigger if exists pm_on_auth_user_email on auth.users;
create trigger pm_on_auth_user_email after update of email on auth.users for each row execute function public.pm_handle_user_email();
insert into public.profiles (id, display_name, is_polyu)
  select id, left(coalesce(nullif(split_part(email, '@', 1), ''), 'user'), 30), coalesce(lower(email) like '%@connect.polyu.hk', false) from auth.users
  on conflict (id) do nothing;

-- ---------- posts ----------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 60),
  cat text not null check (cat in ('book','tech','furn','wear','misc')),
  price integer not null check (price between 0 and 100000),
  cond text not null check (cond in ('new','likenew','good','used')),
  description text not null default '' check (char_length(description) <= 400),
  ctype text not null check (ctype in ('WhatsApp','WeChat','Instagram')),
  contact text not null check (char_length(btrim(contact)) between 1 and 60),
  spot text not null check (spot in ('corea','lib','hh','hall','jcit')),
  images text[] not null default '{}' check (cardinality(images) <= 4),
  status text not null default 'available' check (status in ('available','reserved','sold','removed'))
);

create table if not exists public.daigou (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  item text not null check (char_length(btrim(item)) between 1 and 60),
  from_region text not null check (from_region in ('sz','jp','kr','tw','mo','other')),
  budget integer not null check (budget between 0 and 100000),
  tip integer not null default 0 check (tip between 0 and 100000),
  deadline date not null,
  note text not null default '' check (char_length(note) <= 300),
  ctype text not null check (ctype in ('WhatsApp','WeChat','Instagram')),
  contact text not null check (char_length(btrim(contact)) between 1 and 60),
  images text[] not null default '{}' check (cardinality(images) <= 4),
  status text not null default 'open' check (status in ('open','taken','done','cancelled')),
  taker_id uuid references public.profiles(id) on delete set null,
  taker_ctype text check (taker_ctype in ('WhatsApp','WeChat','Instagram')),
  taker_contact text check (char_length(taker_contact) <= 60),
  taken_at timestamptz
);

create table if not exists public.errands (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  type text not null check (type in ('parcel','food')),
  pickup text not null check (char_length(btrim(pickup)) between 1 and 60),
  hall text not null check (hall in ('hh','hmt')),
  floor text not null default '' check (char_length(floor) <= 20),
  date date not null,
  time_from time not null,
  time_to time not null,
  fee integer not null default 0 check (fee between 0 and 10000),
  note text not null default '' check (char_length(note) <= 200),
  ctype text not null check (ctype in ('WhatsApp','WeChat','Instagram')),
  contact text not null check (char_length(btrim(contact)) between 1 and 60),
  images text[] not null default '{}' check (cardinality(images) <= 4),
  status text not null default 'open' check (status in ('open','taken','done','cancelled')),
  taker_id uuid references public.profiles(id) on delete set null,
  taker_ctype text check (taker_ctype in ('WhatsApp','WeChat','Instagram')),
  taker_contact text check (char_length(taker_contact) <= 60),
  taken_at timestamptz
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reporter_id uuid default auth.uid() references public.profiles(id) on delete set null,
  target_kind text not null check (target_kind in ('listings','daigou','errands')),
  target_id uuid not null,
  target_title text not null default '' check (char_length(target_title) <= 120),
  reason text not null check (reason in ('prohibited','scam','fake','offensive','other')),
  note text not null default '' check (char_length(note) <= 300)
);

create index if not exists listings_status_idx on public.listings (status, created_at desc);
create index if not exists listings_user_idx on public.listings (user_id, created_at desc);
create index if not exists daigou_status_idx on public.daigou (status, created_at desc);
create index if not exists daigou_user_idx on public.daigou (user_id);
create index if not exists daigou_taker_idx on public.daigou (taker_id);
create index if not exists errands_hall_idx on public.errands (hall, status, created_at desc);
create index if not exists errands_user_idx on public.errands (user_id);
create index if not exists errands_taker_idx on public.errands (taker_id);
create index if not exists reports_target_idx on public.reports (target_id, created_at);

-- ---------- RLS ----------
alter table public.listings enable row level security;
alter table public.daigou   enable row level security;
alter table public.errands  enable row level security;
alter table public.reports  enable row level security;

do $$ declare t text; begin
  foreach t in array array['listings','daigou','errands'] loop
    execute format('drop policy if exists "read" on public.%I', t);
    execute format('drop policy if exists "insert own" on public.%I', t);
    execute format('drop policy if exists "update own" on public.%I', t);
    execute format('drop policy if exists "delete own" on public.%I', t);
    execute format('create policy "insert own" on public.%I for insert to authenticated with check (user_id = (select auth.uid()))', t);
    execute format('create policy "update own" on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
    execute format('create policy "delete own" on public.%I for delete to authenticated using (user_id = (select auth.uid()))', t);
  end loop;
end $$;
-- removed / cancelled posts are visible only to the owner (and taker)
create policy "read" on public.listings for select to anon, authenticated using (status <> 'removed' or user_id = (select auth.uid()));
create policy "read" on public.daigou   for select to anon, authenticated using (status <> 'cancelled' or user_id = (select auth.uid()) or taker_id = (select auth.uid()));
create policy "read" on public.errands  for select to anon, authenticated using (status <> 'cancelled' or user_id = (select auth.uid()) or taker_id = (select auth.uid()));
drop policy if exists "insert" on public.reports;
create policy "insert" on public.reports for insert to anon, authenticated with check (reporter_id is null or reporter_id = (select auth.uid()));

-- ---------- column privileges ----------
-- anon: no contact columns; authenticated: contact visible; taker_contact never directly selectable (RPC only)
revoke all on public.listings, public.daigou, public.errands, public.reports from anon, authenticated;
grant select (id, created_at, updated_at, user_id, title, cat, price, cond, description, spot, images, status) on public.listings to anon;
grant select (id, created_at, updated_at, user_id, title, cat, price, cond, description, spot, images, status, ctype, contact) on public.listings to authenticated;
grant insert (title, cat, price, cond, description, ctype, contact, spot, images) on public.listings to authenticated;
grant update (title, cat, price, cond, description, ctype, contact, spot, images, status) on public.listings to authenticated;
grant delete on public.listings to authenticated;

grant select (id, created_at, updated_at, user_id, item, from_region, budget, tip, deadline, note, images, status, taker_id, taken_at) on public.daigou to anon;
grant select (id, created_at, updated_at, user_id, item, from_region, budget, tip, deadline, note, images, status, taker_id, taken_at, ctype, contact) on public.daigou to authenticated;
grant insert (item, from_region, budget, tip, deadline, note, ctype, contact, images) on public.daigou to authenticated;
grant update (item, from_region, budget, tip, deadline, note, ctype, contact, images, status) on public.daigou to authenticated;
grant delete on public.daigou to authenticated;

grant select (id, created_at, updated_at, user_id, type, pickup, hall, floor, date, time_from, time_to, fee, note, images, status, taker_id, taken_at) on public.errands to anon;
grant select (id, created_at, updated_at, user_id, type, pickup, hall, floor, date, time_from, time_to, fee, note, images, status, taker_id, taken_at, ctype, contact) on public.errands to authenticated;
grant insert (type, pickup, hall, floor, date, time_from, time_to, fee, note, ctype, contact, images) on public.errands to authenticated;
grant update (type, pickup, hall, floor, date, time_from, time_to, fee, note, ctype, contact, images, status) on public.errands to authenticated;
grant delete on public.errands to authenticated;

grant insert (target_kind, target_id, target_title, reason, note) on public.reports to anon, authenticated;

-- ---------- integrity triggers ----------
create or replace function public.pm_guard_post() returns trigger
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n_min int; n_day int; p text; d date; rpc boolean := coalesce(current_setting('pm.rpc', true), '') = '1';
begin
  -- images must live in the poster's own folder in the post-images bucket
  foreach p in array coalesce(new.images, '{}') loop
    if p !~ ('^' || new.user_id::text || '/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+\.(webp|jpg|jpeg|png)$') then raise exception 'bad_image_path'; end if;
  end loop;
  if tg_op = 'INSERT' then
    if tg_table_name = 'listings' then
      if new.status <> 'available' then raise exception 'bad_status'; end if;
    else
      if new.status <> 'open' or new.taker_id is not null then raise exception 'bad_status'; end if;
      -- read via jsonb: plpgsql resolves every new.<field> in an expression, and daigou/errands have different date columns
      if tg_table_name = 'daigou' then
        d := (to_jsonb(new) ->> 'deadline')::date;
        if d < current_date - 1 or d > current_date + 365 then raise exception 'bad_date'; end if;
      else
        d := (to_jsonb(new) ->> 'date')::date;
        if d < current_date - 1 or d > current_date + 60 then raise exception 'bad_date'; end if;
      end if;
    end if;
    execute format('select count(*) filter (where created_at > now() - interval ''1 minute''), count(*) from public.%I where user_id = $1 and created_at > now() - interval ''1 day''', tg_table_name)
      into n_min, n_day using new.user_id;
    if n_min >= 5 or n_day >= 30 then raise exception 'rate_limited'; end if;
    return new;
  end if;
  -- UPDATE
  new.updated_at := now();
  if new.user_id <> old.user_id then raise exception 'not_allowed'; end if;
  if tg_table_name <> 'listings' and not rpc then
    -- owner-side status transitions only
    if new.status <> old.status and not (
         (old.status = 'open' and new.status = 'cancelled') or
         (old.status = 'taken' and new.status in ('done','cancelled')) or
         (old.status = 'cancelled' and new.status = 'open')) then
      raise exception 'bad_transition';
    end if;
    if new.status = 'open' and old.status = 'cancelled' then
      new.taker_id := null; new.taker_ctype := null; new.taker_contact := null; new.taken_at := null;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists pm_guard on public.listings;
drop trigger if exists pm_guard on public.daigou;
drop trigger if exists pm_guard on public.errands;
create trigger pm_guard before insert or update on public.listings for each row execute function public.pm_guard_post();
create trigger pm_guard before insert or update on public.daigou   for each row execute function public.pm_guard_post();
create trigger pm_guard before insert or update on public.errands  for each row execute function public.pm_guard_post();

create or replace function public.pm_report_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  select count(*) into n from public.reports where target_id = new.target_id and created_at > now() - interval '1 hour';
  if n >= 20 then raise exception 'rate_limited'; end if;
  select count(*) into n from public.reports where created_at > now() - interval '1 minute';
  if n >= 30 then raise exception 'rate_limited'; end if;
  return new;
end $$;
drop trigger if exists pm_report_guard on public.reports;
create trigger pm_report_guard before insert on public.reports for each row execute function public.pm_report_guard();

-- ---------- RPCs ----------
create or replace function public.pm_take(p_kind text, p_id uuid, p_ctype text, p_contact text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n int;
begin
  if uid is null then raise exception 'login_required'; end if;
  if p_ctype not in ('WhatsApp','WeChat','Instagram') or char_length(btrim(coalesce(p_contact,''))) not between 1 and 60 then raise exception 'bad_contact'; end if;
  perform set_config('pm.rpc', '1', true);
  if p_kind = 'daigou' then
    update public.daigou set status = 'taken', taker_id = uid, taker_ctype = p_ctype, taker_contact = btrim(p_contact), taken_at = now()
      where id = p_id and status = 'open' and user_id <> uid;
  elsif p_kind = 'errands' then
    update public.errands set status = 'taken', taker_id = uid, taker_ctype = p_ctype, taker_contact = btrim(p_contact), taken_at = now()
      where id = p_id and status = 'open' and user_id <> uid;
  else raise exception 'bad_kind'; end if;
  get diagnostics n = row_count;
  perform set_config('pm.rpc', '', true);
  return n > 0;
end $$;

create or replace function public.pm_release(p_kind text, p_id uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n int;
begin
  if uid is null then raise exception 'login_required'; end if;
  perform set_config('pm.rpc', '1', true);
  if p_kind = 'daigou' then
    update public.daigou set status = 'open', taker_id = null, taker_ctype = null, taker_contact = null, taken_at = null where id = p_id and status = 'taken' and taker_id = uid;
  elsif p_kind = 'errands' then
    update public.errands set status = 'open', taker_id = null, taker_ctype = null, taker_contact = null, taken_at = null where id = p_id and status = 'taken' and taker_id = uid;
  else raise exception 'bad_kind'; end if;
  get diagnostics n = row_count;
  perform set_config('pm.rpc', '', true);
  return n > 0;
end $$;

-- taker contact: only the poster (or the taker) can read it
create or replace function public.pm_taker_contact(p_kind text, p_id uuid) returns table (ctype text, contact text, display_name text)
language plpgsql security definer set search_path = '' stable as $$
begin
  if p_kind = 'daigou' then
    return query select d.taker_ctype, d.taker_contact, pr.display_name from public.daigou d left join public.profiles pr on pr.id = d.taker_id
      where d.id = p_id and auth.uid() is not null and (d.user_id = auth.uid() or d.taker_id = auth.uid());
  elsif p_kind = 'errands' then
    return query select e.taker_ctype, e.taker_contact, pr.display_name from public.errands e left join public.profiles pr on pr.id = e.taker_id
      where e.id = p_id and auth.uid() is not null and (e.user_id = auth.uid() or e.taker_id = auth.uid());
  end if;
end $$;

-- account deletion (client removes the user's images first)
create or replace function public.pm_delete_account() returns boolean
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'login_required'; end if;
  delete from auth.users where id = uid;   -- cascades to profiles and all posts
  return true;
end $$;

revoke execute on function public.pm_take(text, uuid, text, text), public.pm_release(text, uuid), public.pm_taker_contact(text, uuid), public.pm_delete_account() from public, anon;
grant execute on function public.pm_take(text, uuid, text, text), public.pm_release(text, uuid), public.pm_taker_contact(text, uuid), public.pm_delete_account() to authenticated;
revoke execute on function public.pm_guard_post(), public.pm_report_guard(), public.pm_handle_new_user(), public.pm_handle_user_email() from public, anon, authenticated;

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 2097152, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/webp','image/png'];

drop policy if exists "pm images insert own folder" on storage.objects;
drop policy if exists "pm images select own folder" on storage.objects;
drop policy if exists "pm images delete own" on storage.objects;
create policy "pm images insert own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "pm images select own folder" on storage.objects for select to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "pm images delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
