-- v4: no personal contact details (chat only) + deal-complete chat deletion with a dispute window.
-- Idempotent. Apply after schema_chat.sql.

-- ================= 1. remove personal contact details =================
CREATE OR REPLACE FUNCTION public.pm_guard_post()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
      new.taker_id := null; new.taken_at := null;
    end if;
  end if;
  return new;
end $function$;

create or replace function public.pm_take(p_kind text, p_id uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n int;
begin
  if uid is null then raise exception 'login_required'; end if;
  perform set_config('pm.rpc', '1', true);
  if p_kind = 'daigou' then
    update public.daigou set status = 'taken', taker_id = uid, taken_at = now() where id = p_id and status = 'open' and user_id <> uid;
  elsif p_kind = 'errands' then
    update public.errands set status = 'taken', taker_id = uid, taken_at = now() where id = p_id and status = 'open' and user_id <> uid;
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
    update public.daigou set status = 'open', taker_id = null, taken_at = null where id = p_id and status = 'taken' and taker_id = uid;
  elsif p_kind = 'errands' then
    update public.errands set status = 'open', taker_id = null, taken_at = null where id = p_id and status = 'taken' and taker_id = uid;
  else raise exception 'bad_kind'; end if;
  get diagnostics n = row_count;
  perform set_config('pm.rpc', '', true);
  return n > 0;
end $$;

drop function if exists public.pm_take(text, uuid, text, text);
drop function if exists public.pm_taker_contact(text, uuid);
revoke execute on function public.pm_take(text, uuid) from public, anon;
grant execute on function public.pm_take(text, uuid) to authenticated;

alter table public.listings drop column if exists contact, drop column if exists ctype;
alter table public.daigou   drop column if exists contact, drop column if exists ctype, drop column if exists taker_contact, drop column if exists taker_ctype;
alter table public.errands  drop column if exists contact, drop column if exists ctype, drop column if exists taker_contact, drop column if exists taker_ctype;
-- (legacy_*_v1 tables are untouched: not exposed, kept until Boa decides)

-- ================= 2. storage deletion queue =================
-- Any deleted chat photo / post photo is queued here; the pm-sweep Edge Function (service role) removes the files.
create table if not exists public.storage_trash (
  id bigint generated always as identity primary key,
  bucket text not null,
  path text not null,
  queued_at timestamptz not null default now(),
  attempts int not null default 0
);
alter table public.storage_trash enable row level security;   -- no policies: service role only
revoke all on public.storage_trash from anon, authenticated;

create or replace function public.pm_trash_message() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.image is not null then insert into public.storage_trash (bucket, path) values ('chat-images', old.image); end if;
  return old;
end $$;
drop trigger if exists pm_trash_message on public.messages;
create trigger pm_trash_message after delete on public.messages for each row execute function public.pm_trash_message();

create or replace function public.pm_trash_post() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.storage_trash (bucket, path) select 'post-images', p from unnest(coalesce(old.images, '{}')) p;
  return old;
end $$;
drop trigger if exists pm_trash_post on public.listings;
drop trigger if exists pm_trash_post on public.daigou;
drop trigger if exists pm_trash_post on public.errands;
create trigger pm_trash_post after delete on public.listings for each row execute function public.pm_trash_post();
create trigger pm_trash_post after delete on public.daigou   for each row execute function public.pm_trash_post();
create trigger pm_trash_post after delete on public.errands  for each row execute function public.pm_trash_post();

-- ================= 3. deal confirmation + dispute window =================
create table if not exists public.pm_config (key text primary key, value text not null);
alter table public.pm_config enable row level security;      -- no policies: not readable by clients
revoke all on public.pm_config from anon, authenticated;
insert into public.pm_config (key, value) values ('chat_dispute_hours', '48') on conflict (key) do nothing;

create or replace function public.pm_dispute_hours() returns numeric
language sql stable security definer set search_path = '' as $$
  select coalesce((select value::numeric from public.pm_config where key = 'chat_dispute_hours'), 48);
$$;

alter table public.conversations add column if not exists owner_confirmed_at timestamptz;
alter table public.conversations add column if not exists other_confirmed_at timestamptz;
alter table public.conversations add column if not exists purge_after timestamptz;
grant select (owner_confirmed_at, other_confirmed_at, purge_after) on public.conversations to authenticated;

-- window starts when BOTH sides have confirmed; cleared if either confirmation is withdrawn
create or replace function public.pm_conv_window() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.owner_confirmed_at is not null and new.other_confirmed_at is not null then
    if new.purge_after is null then new.purge_after := now() + make_interval(secs => public.pm_dispute_hours() * 3600); end if;
  else
    new.purge_after := null;
  end if;
  return new;
end $$;
drop trigger if exists pm_conv_window on public.conversations;
create trigger pm_conv_window before update on public.conversations for each row execute function public.pm_conv_window();

-- poster's confirmation = marking the post 已售出 (sold) / 已完成 (done); undone if the status is changed back
create or replace function public.pm_post_confirm() returns trigger
language plpgsql security definer set search_path = '' as $$
declare fin text := case when tg_table_name = 'listings' then 'sold' else 'done' end;
begin
  if new.status = fin and old.status is distinct from fin then
    update public.conversations set owner_confirmed_at = now()
      where post_kind = tg_table_name and post_id = new.id and owner_id = new.user_id and owner_confirmed_at is null;
  elsif old.status = fin and new.status <> fin then
    update public.conversations set owner_confirmed_at = null
      where post_kind = tg_table_name and post_id = new.id and owner_id = new.user_id;
  end if;
  return null;
end $$;
drop trigger if exists pm_post_confirm on public.listings;
drop trigger if exists pm_post_confirm on public.daigou;
drop trigger if exists pm_post_confirm on public.errands;
create trigger pm_post_confirm after update of status on public.listings for each row execute function public.pm_post_confirm();
create trigger pm_post_confirm after update of status on public.daigou   for each row execute function public.pm_post_confirm();
create trigger pm_post_confirm after update of status on public.errands  for each row execute function public.pm_post_confirm();

-- buyer / taker confirms inside the chat
create or replace function public.pm_chat_confirm(p_conv uuid) returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare r timestamptz;
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  update public.conversations set other_confirmed_at = coalesce(other_confirmed_at, now())
    where id = p_conv and other_id = auth.uid() returning purge_after into r;
  if not found then raise exception 'not_allowed'; end if;
  return r;
end $$;
revoke execute on function public.pm_chat_confirm(uuid) from public, anon;
grant execute on function public.pm_chat_confirm(uuid) to authenticated;

create or replace function public.pm_chat_open_report(p_conv uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.reports where target_kind = 'chat' and target_id = p_conv and handled_at is null);
$$;

-- hourly job: delete confirmed chats whose dispute window is over and that have no unhandled report
create or replace function public.pm_chat_purge() returns int
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  delete from public.conversations c where c.purge_after is not null and c.purge_after <= now()
    and not public.pm_chat_open_report(c.id);
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function public.pm_chat_purge(), public.pm_chat_open_report(uuid), public.pm_dispute_hours(),
  public.pm_conv_window(), public.pm_post_confirm(), public.pm_trash_message(), public.pm_trash_post() from public, anon, authenticated;

-- ================= 4. schedules =================
create extension if not exists pg_net;
select cron.unschedule(jobid) from cron.job where jobname in ('pm_chat_purge', 'pm_storage_sweep');
select cron.schedule('pm_chat_purge', '5 * * * *', $$ select public.pm_chat_purge(); $$);
select cron.schedule('pm_storage_sweep', '20 * * * *', $$
  select net.http_post(url := 'https://upmzeccwedqihvfymick.supabase.co/functions/v1/pm-sweep',
    headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb, timeout_milliseconds := 30000);
$$);
