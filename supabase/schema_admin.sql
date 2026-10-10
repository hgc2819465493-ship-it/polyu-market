-- 理大二手網 · admin / moderation (apply after schema_v2.sql)
-- Admin rights live only in the database: public.admins (user ids) checked by public.is_admin().

-- ---------- admin list ----------
create table if not exists public.admin_emails (email text primary key check (email = lower(email)));
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admin_emails enable row level security;
alter table public.admins enable row level security;
revoke all on public.admin_emails, public.admins from public, anon, authenticated;
insert into public.admin_emails (email) values ('2819465493@qq.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- seed: a NEW auth user whose email is on the list becomes admin (insert only — changing email later never grants admin)
create or replace function public.pm_seed_admin() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.admin_emails where email = lower(new.email)) then
    insert into public.admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists pm_seed_admin on auth.users;
create trigger pm_seed_admin after insert on auth.users for each row execute function public.pm_seed_admin();
insert into public.admins (user_id)
  select u.id from auth.users u join public.admin_emails a on a.email = lower(u.email) on conflict do nothing;

-- ---------- bans ----------
create table if not exists public.bans (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  reason text not null default '' check (char_length(reason) <= 200),
  banned_by uuid,
  created_at timestamptz not null default now()
);
alter table public.bans enable row level security;
revoke all on public.bans from public, anon, authenticated;
grant select on public.bans to authenticated;
drop policy if exists "admin read" on public.bans;
create policy "admin read" on public.bans for select to authenticated using ((select public.is_admin()));

create or replace function public.pm_is_banned(p_uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.bans where user_id = p_uid);
$$;
revoke execute on function public.pm_is_banned(uuid) from public, anon;
grant execute on function public.pm_is_banned(uuid) to authenticated;

-- ---------- moderation log ----------
create table if not exists public.mod_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  admin_id uuid,
  action text not null,
  target_kind text,
  target_id uuid,
  target_user uuid,
  note text not null default ''
);
alter table public.mod_log enable row level security;
revoke all on public.mod_log from public, anon, authenticated;
grant select on public.mod_log to authenticated;
drop policy if exists "admin read" on public.mod_log;
create policy "admin read" on public.mod_log for select to authenticated using ((select public.is_admin()));

-- ---------- reports: admins read + handle ----------
alter table public.reports add column if not exists handled_at timestamptz;
alter table public.reports add column if not exists handled_by uuid;
grant select on public.reports to authenticated;
drop policy if exists "admin read" on public.reports;
create policy "admin read" on public.reports for select to authenticated using ((select public.is_admin()));

-- ---------- hidden posts ----------
alter table public.listings add column if not exists hidden_at timestamptz;
alter table public.daigou   add column if not exists hidden_at timestamptz;
alter table public.errands  add column if not exists hidden_at timestamptz;
grant select (hidden_at) on public.listings, public.daigou, public.errands to anon, authenticated;  -- no update grant: only admin RPCs change it

drop policy if exists "read" on public.listings;
create policy "read" on public.listings for select to anon, authenticated using (
  ((status <> 'removed' and hidden_at is null) or user_id = (select auth.uid())) or (select public.is_admin()));
drop policy if exists "read" on public.daigou;
create policy "read" on public.daigou for select to anon, authenticated using (
  ((status <> 'cancelled' and hidden_at is null) or user_id = (select auth.uid()) or taker_id = (select auth.uid())) or (select public.is_admin()));
drop policy if exists "read" on public.errands;
create policy "read" on public.errands for select to anon, authenticated using (
  ((status <> 'cancelled' and hidden_at is null) or user_id = (select auth.uid()) or taker_id = (select auth.uid())) or (select public.is_admin()));

-- ---------- ban enforcement ----------
-- posting: checked in the post guard trigger (insert)
create or replace function public.pm_ban_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.bans where user_id = new.user_id) then raise exception 'banned'; end if;
  return new;
end $$;
drop trigger if exists pm_ban_guard on public.listings;
drop trigger if exists pm_ban_guard on public.daigou;
drop trigger if exists pm_ban_guard on public.errands;
create trigger pm_ban_guard before insert on public.listings for each row execute function public.pm_ban_guard();
create trigger pm_ban_guard before insert on public.daigou   for each row execute function public.pm_ban_guard();
create trigger pm_ban_guard before insert on public.errands  for each row execute function public.pm_ban_guard();
-- taking orders: any row getting a new taker is checked (covers pm_take)
create or replace function public.pm_ban_take_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.taker_id is not null and new.taker_id is distinct from old.taker_id
     and exists (select 1 from public.bans where user_id = new.taker_id) then raise exception 'banned'; end if;
  return new;
end $$;
drop trigger if exists pm_ban_take_guard on public.daigou;
drop trigger if exists pm_ban_take_guard on public.errands;
create trigger pm_ban_take_guard before update on public.daigou  for each row execute function public.pm_ban_take_guard();
create trigger pm_ban_take_guard before update on public.errands for each row execute function public.pm_ban_take_guard();
-- photo uploads
drop policy if exists "pm images insert own folder" on storage.objects;
create policy "pm images insert own folder" on storage.objects for insert to authenticated with check (
  bucket_id = 'post-images' and (storage.foldername(name))[1] = (select auth.uid())::text and not public.pm_is_banned((select auth.uid())));
-- admins may delete any post photo (Storage needs SELECT visibility to delete)
drop policy if exists "pm images select admin" on storage.objects;
create policy "pm images select admin" on storage.objects for select to authenticated using (
  bucket_id = 'post-images' and (select public.is_admin()));
drop policy if exists "pm images delete admin" on storage.objects;
create policy "pm images delete admin" on storage.objects for delete to authenticated using (
  bucket_id = 'post-images' and (select public.is_admin()));

-- ---------- RPCs ----------
create or replace function public.pm_me() returns table (is_admin boolean, banned boolean)
language sql stable security definer set search_path = '' as $$
  select public.is_admin(), exists (select 1 from public.bans where user_id = (select auth.uid()));
$$;

create or replace function public.pm_admin_hide(p_kind text, p_id uuid, p_hidden boolean, p_note text default '') returns boolean
language plpgsql security definer set search_path = '' as $$
declare owner uuid;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_kind not in ('listings','daigou','errands') then raise exception 'bad_kind'; end if;
  perform set_config('pm.rpc', '1', true);
  execute format('update public.%I set hidden_at = case when $2 then now() else null end where id = $1 returning user_id', p_kind)
    into owner using p_id, p_hidden;
  perform set_config('pm.rpc', '', true);
  if owner is null then return false; end if;
  insert into public.mod_log (admin_id, action, target_kind, target_id, target_user, note)
    values (auth.uid(), case when p_hidden then 'hide' else 'unhide' end, p_kind, p_id, owner, left(coalesce(p_note, ''), 300));
  return true;
end $$;

-- deletes the row and returns its image paths so the client can remove them from Storage (admin delete policy above)
create or replace function public.pm_admin_delete(p_kind text, p_id uuid, p_note text default '') returns text[]
language plpgsql security definer set search_path = '' as $$
declare owner uuid; imgs text[]; ttl text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_kind not in ('listings','daigou','errands') then raise exception 'bad_kind'; end if;
  execute format('delete from public.%I where id = $1 returning user_id, images, %s', p_kind,
    case p_kind when 'listings' then 'title' when 'daigou' then 'item' else 'pickup' end)
    into owner, imgs, ttl using p_id;
  if owner is null then return null; end if;
  insert into public.mod_log (admin_id, action, target_kind, target_id, target_user, note)
    values (auth.uid(), 'delete', p_kind, p_id, owner, left(coalesce(ttl, '') || case when coalesce(p_note, '') <> '' then ' — ' || p_note else '' end, 300));
  update public.reports set handled_at = coalesce(handled_at, now()), handled_by = coalesce(handled_by, auth.uid()) where target_id = p_id;
  return coalesce(imgs, '{}');
end $$;

create or replace function public.pm_admin_report(p_id uuid, p_handled boolean) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  update public.reports set handled_at = case when p_handled then now() else null end, handled_by = case when p_handled then auth.uid() else null end where id = p_id;
  get diagnostics n = row_count;
  if n > 0 then insert into public.mod_log (admin_id, action, target_kind, target_id, note) values (auth.uid(), case when p_handled then 'report_handled' else 'report_reopened' end, 'reports', p_id, ''); end if;
  return n > 0;
end $$;

create or replace function public.pm_admin_ban(p_user uuid, p_banned boolean, p_reason text default '') returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_user = auth.uid() or exists (select 1 from public.admins where user_id = p_user) then raise exception 'cannot_ban_admin'; end if;
  if not exists (select 1 from public.profiles where id = p_user) then return false; end if;
  if p_banned then
    insert into public.bans (user_id, reason, banned_by) values (p_user, left(coalesce(p_reason, ''), 200), auth.uid())
      on conflict (user_id) do update set reason = excluded.reason, banned_by = excluded.banned_by, created_at = now();
  else
    delete from public.bans where user_id = p_user;
  end if;
  insert into public.mod_log (admin_id, action, target_user, note) values (auth.uid(), case when p_banned then 'ban' else 'unban' end, p_user, left(coalesce(p_reason, ''), 300));
  return true;
end $$;

revoke execute on function public.pm_me(), public.pm_admin_hide(text, uuid, boolean, text), public.pm_admin_delete(text, uuid, text),
  public.pm_admin_report(uuid, boolean), public.pm_admin_ban(uuid, boolean, text) from public, anon;
grant execute on function public.pm_me(), public.pm_admin_hide(text, uuid, boolean, text), public.pm_admin_delete(text, uuid, text),
  public.pm_admin_report(uuid, boolean), public.pm_admin_ban(uuid, boolean, text) to authenticated;
