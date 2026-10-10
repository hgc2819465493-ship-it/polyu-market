-- 理大二手網 · PolyU Marketplace — Supabase schema (v1, no login)
-- Ownership: each browser keeps a random owner_token in localStorage. The token itself is never readable
-- by the public API; only its sha256 (owner_hash) is exposed so the UI can tell "my" posts.
-- Updates/deletes happen only through SECURITY DEFINER RPCs that check the token.

-- ---------- tables ----------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null check (char_length(btrim(title)) between 1 and 60),
  cat text not null check (cat in ('book','tech','furn','wear','misc')),
  price integer not null check (price between 0 and 100000),
  cond text not null check (cond in ('new','likenew','good','used')),
  description text not null default '' check (char_length(description) <= 400),
  ctype text not null check (ctype in ('WhatsApp','WeChat','Instagram')),
  contact text not null check (char_length(btrim(contact)) between 1 and 60),
  spot text not null check (spot in ('corea','lib','hh','hall','jcit')),
  owner_token text not null check (char_length(owner_token) between 16 and 128),
  owner_hash text generated always as (encode(extensions.digest(owner_token, 'sha256'), 'hex')) stored
);

create table if not exists public.daigou (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  item text not null check (char_length(btrim(item)) between 1 and 60),
  from_region text not null check (from_region in ('sz','jp','kr','tw','mo','other')),
  budget integer not null check (budget between 0 and 100000),
  tip integer not null default 0 check (tip between 0 and 100000),
  deadline date not null check (deadline >= current_date - 1 and deadline <= current_date + 365),
  note text not null default '' check (char_length(note) <= 300),
  ctype text not null check (ctype in ('WhatsApp','WeChat','Instagram')),
  contact text not null check (char_length(btrim(contact)) between 1 and 60),
  status text not null default 'open' check (status in ('open','taken')),
  taker_hash text,
  taken_at timestamptz,
  owner_token text not null check (char_length(owner_token) between 16 and 128),
  owner_hash text generated always as (encode(extensions.digest(owner_token, 'sha256'), 'hex')) stored
);

create table if not exists public.errands (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('parcel','food')),
  pickup text not null check (char_length(btrim(pickup)) between 1 and 60),
  hall text not null check (hall in ('hh','hmt')),
  floor text not null default '' check (char_length(floor) <= 20),
  date date not null check (date >= current_date - 1 and date <= current_date + 60),
  time_from time not null,
  time_to time not null,
  fee integer not null default 0 check (fee between 0 and 10000),
  note text not null default '' check (char_length(note) <= 200),
  ctype text not null check (ctype in ('WhatsApp','WeChat','Instagram')),
  contact text not null check (char_length(btrim(contact)) between 1 and 60),
  status text not null default 'open' check (status in ('open','taken','done')),
  taker_hash text,
  taken_at timestamptz,
  owner_token text not null check (char_length(owner_token) between 16 and 128),
  owner_hash text generated always as (encode(extensions.digest(owner_token, 'sha256'), 'hex')) stored
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  target_kind text not null check (target_kind in ('listings','daigou','errands')),
  target_id uuid not null,
  target_title text not null default '' check (char_length(target_title) <= 120),
  reason text not null check (reason in ('prohibited','scam','fake','offensive','other')),
  note text not null default '' check (char_length(note) <= 300)
);

create index if not exists listings_created_idx on public.listings (created_at desc);
create index if not exists daigou_created_idx on public.daigou (created_at desc);
create index if not exists errands_hall_idx on public.errands (hall, created_at desc);
create index if not exists listings_owner_idx on public.listings (owner_token, created_at);
create index if not exists daigou_owner_idx on public.daigou (owner_token, created_at);
create index if not exists errands_owner_idx on public.errands (owner_token, created_at);
create index if not exists reports_target_idx on public.reports (target_id, created_at);

-- ---------- RLS ----------
alter table public.listings enable row level security;
alter table public.daigou   enable row level security;
alter table public.errands  enable row level security;
alter table public.reports  enable row level security;

drop policy if exists "public read" on public.listings;
drop policy if exists "public read" on public.daigou;
drop policy if exists "public read" on public.errands;
create policy "public read" on public.listings for select to anon, authenticated using (true);
create policy "public read" on public.daigou   for select to anon, authenticated using (true);
create policy "public read" on public.errands  for select to anon, authenticated using (true);

drop policy if exists "public insert" on public.listings;
drop policy if exists "public insert" on public.daigou;
drop policy if exists "public insert" on public.errands;
drop policy if exists "public insert" on public.reports;
create policy "public insert" on public.listings for insert to anon, authenticated with check (true);
create policy "public insert" on public.daigou   for insert to anon, authenticated with check (status = 'open' and taker_hash is null and taken_at is null);
create policy "public insert" on public.errands  for insert to anon, authenticated with check (status = 'open' and taker_hash is null and taken_at is null);
create policy "public insert" on public.reports  for insert to anon, authenticated with check (true);
-- no update / delete policies: changes only via RPCs below. No select policy on reports.

-- ---------- column privileges (hide owner_token) ----------
revoke all on public.listings, public.daigou, public.errands, public.reports from anon, authenticated;
grant select (id, created_at, title, cat, price, cond, description, ctype, contact, spot, owner_hash) on public.listings to anon, authenticated;
grant insert (title, cat, price, cond, description, ctype, contact, spot, owner_token) on public.listings to anon, authenticated;
grant select (id, created_at, item, from_region, budget, tip, deadline, note, ctype, contact, status, taker_hash, taken_at, owner_hash) on public.daigou to anon, authenticated;
grant insert (item, from_region, budget, tip, deadline, note, ctype, contact, owner_token) on public.daigou to anon, authenticated;
grant select (id, created_at, type, pickup, hall, floor, date, time_from, time_to, fee, note, ctype, contact, status, taker_hash, taken_at, owner_hash) on public.errands to anon, authenticated;
grant insert (type, pickup, hall, floor, date, time_from, time_to, fee, note, ctype, contact, owner_token) on public.errands to anon, authenticated;
grant insert (target_kind, target_id, target_title, reason, note) on public.reports to anon, authenticated;

-- ---------- simple rate guard ----------
create or replace function public.pm_rate_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n_min int; n_day int;
begin
  if tg_table_name = 'reports' then
    select count(*) into n_min from public.reports where target_id = new.target_id and created_at > now() - interval '1 hour';
    if n_min >= 20 then raise exception 'rate_limited' using errcode = 'P0001'; end if;
    select count(*) into n_day from public.reports where created_at > now() - interval '1 minute';
    if n_day >= 30 then raise exception 'rate_limited' using errcode = 'P0001'; end if;
    return new;
  end if;
  execute format('select count(*) filter (where created_at > now() - interval ''1 minute''), count(*) from public.%I where owner_token = $1 and created_at > now() - interval ''1 day''', tg_table_name)
    into n_min, n_day using new.owner_token;
  if n_min >= 5 or n_day >= 30 then raise exception 'rate_limited' using errcode = 'P0001'; end if;
  return new;
end $$;

drop trigger if exists pm_rate on public.listings;
drop trigger if exists pm_rate on public.daigou;
drop trigger if exists pm_rate on public.errands;
drop trigger if exists pm_rate on public.reports;
create trigger pm_rate before insert on public.listings for each row execute function public.pm_rate_guard();
create trigger pm_rate before insert on public.daigou   for each row execute function public.pm_rate_guard();
create trigger pm_rate before insert on public.errands  for each row execute function public.pm_rate_guard();
create trigger pm_rate before insert on public.reports  for each row execute function public.pm_rate_guard();
revoke execute on function public.pm_rate_guard() from public, anon, authenticated;

-- ---------- RPCs ----------
create or replace function public.pm_delete_post(p_kind text, p_id uuid, p_token text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if p_kind = 'listings' then delete from public.listings where id = p_id and owner_token = p_token;
  elsif p_kind = 'daigou' then delete from public.daigou where id = p_id and owner_token = p_token;
  elsif p_kind = 'errands' then delete from public.errands where id = p_id and owner_token = p_token;
  else raise exception 'bad kind'; end if;
  get diagnostics n = row_count;
  return n > 0;
end $$;

create or replace function public.pm_take_post(p_kind text, p_id uuid, p_taker_token text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n int; h text;
begin
  if p_taker_token is null or char_length(p_taker_token) not between 16 and 128 then raise exception 'bad token'; end if;
  h := encode(extensions.digest(p_taker_token, 'sha256'), 'hex');
  if p_kind = 'daigou' then update public.daigou set status = 'taken', taker_hash = h, taken_at = now() where id = p_id and status = 'open';
  elsif p_kind = 'errands' then update public.errands set status = 'taken', taker_hash = h, taken_at = now() where id = p_id and status = 'open';
  else raise exception 'bad kind'; end if;
  get diagnostics n = row_count;
  return n > 0;
end $$;

create or replace function public.pm_complete_errand(p_id uuid, p_token text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  update public.errands set status = 'done' where id = p_id and owner_token = p_token and status <> 'done';
  get diagnostics n = row_count;
  return n > 0;
end $$;

revoke execute on function public.pm_delete_post(text, uuid, text), public.pm_take_post(text, uuid, text), public.pm_complete_errand(uuid, text) from public;
grant execute on function public.pm_delete_post(text, uuid, text), public.pm_take_post(text, uuid, text), public.pm_complete_errand(uuid, text) to anon, authenticated;
