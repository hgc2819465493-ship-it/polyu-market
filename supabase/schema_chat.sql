-- 理大二手網 · 1:1 chat (apply after schema_v2.sql + schema_admin.sql)

-- ---------- contact details become optional (chat is the default) ----------
alter table public.listings drop constraint if exists listings_contact_check1;
alter table public.daigou   drop constraint if exists daigou_contact_check1;
alter table public.errands  drop constraint if exists errands_contact_check1;
alter table public.listings alter column contact set default '';
alter table public.daigou   alter column contact set default '';
alter table public.errands  alter column contact set default '';
alter table public.listings drop constraint if exists listings_contact_len;
alter table public.listings add constraint listings_contact_len check (char_length(contact) <= 60);
alter table public.daigou drop constraint if exists daigou_contact_len;
alter table public.daigou   add constraint daigou_contact_len   check (char_length(contact) <= 60);
alter table public.errands drop constraint if exists errands_contact_len;
alter table public.errands  add constraint errands_contact_len  check (char_length(contact) <= 60);

create or replace function public.pm_take(p_kind text, p_id uuid, p_ctype text, p_contact text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n int; c text := btrim(coalesce(p_contact, ''));
begin
  if uid is null then raise exception 'login_required'; end if;
  if char_length(c) > 60 or (c <> '' and coalesce(p_ctype, '') not in ('WhatsApp','WeChat','Instagram')) then raise exception 'bad_contact'; end if;
  perform set_config('pm.rpc', '1', true);
  if p_kind = 'daigou' then
    update public.daigou set status = 'taken', taker_id = uid, taker_ctype = nullif(case when c = '' then null else p_ctype end, ''), taker_contact = nullif(c, ''), taken_at = now()
      where id = p_id and status = 'open' and user_id <> uid;
  elsif p_kind = 'errands' then
    update public.errands set status = 'taken', taker_id = uid, taker_ctype = nullif(case when c = '' then null else p_ctype end, ''), taker_contact = nullif(c, ''), taken_at = now()
      where id = p_id and status = 'open' and user_id <> uid;
  else raise exception 'bad_kind'; end if;
  get diagnostics n = row_count;
  perform set_config('pm.rpc', '', true);
  return n > 0;
end $$;

-- ---------- tables ----------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_kind text not null check (post_kind in ('listings','daigou','errands')),
  post_id uuid not null,
  post_title text not null default '' check (char_length(post_title) <= 120),
  post_thumb text,                                   -- public post-images path (snapshot)
  owner_id uuid not null references public.profiles(id) on delete cascade,   -- the poster
  other_id uuid not null references public.profiles(id) on delete cascade,   -- the user who started the chat
  last_message_at timestamptz,
  last_message text not null default '',
  last_sender uuid,
  owner_read_at timestamptz not null default now(),
  other_read_at timestamptz not null default now(),
  check (owner_id <> other_id),
  unique (post_kind, post_id, other_id)
);
create index if not exists conversations_owner_idx on public.conversations (owner_id, last_message_at desc);
create index if not exists conversations_other_idx on public.conversations (other_id, last_message_at desc);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null default '' check (char_length(body) <= 1000),
  image text,
  created_at timestamptz not null default now(),
  check (char_length(btrim(body)) > 0 or image is not null)
);
create index if not exists messages_conv_idx on public.messages (conversation_id, id);
create index if not exists messages_sender_idx on public.messages (sender_id, created_at desc);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
revoke all on public.conversations, public.messages from public, anon, authenticated;
grant select on public.conversations to authenticated;
grant select on public.messages to authenticated;
grant insert (conversation_id, body, image) on public.messages to authenticated;

create or replace function public.pm_is_participant(p_conv uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.conversations c where c.id = p_conv and (select auth.uid()) in (c.owner_id, c.other_id));
$$;
create or replace function public.pm_chat_reported(p_conv uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.reports r where r.target_kind = 'chat' and r.target_id = p_conv);
$$;
revoke execute on function public.pm_is_participant(uuid), public.pm_chat_reported(uuid) from public, anon;
grant execute on function public.pm_is_participant(uuid), public.pm_chat_reported(uuid) to authenticated;

drop policy if exists "participants read" on public.conversations;
create policy "participants read" on public.conversations for select to authenticated
  using ((select auth.uid()) in (owner_id, other_id));
drop policy if exists "participants read" on public.messages;
create policy "participants read" on public.messages for select to authenticated
  using ((select public.pm_is_participant(conversation_id)));
drop policy if exists "participants send" on public.messages;
create policy "participants send" on public.messages for insert to authenticated
  with check (sender_id = (select auth.uid()) and (select public.pm_is_participant(conversation_id)) and not public.pm_is_banned((select auth.uid())));

-- message guard: rate limit, image path, then bump the conversation preview
create or replace function public.pm_message_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if exists (select 1 from public.bans where user_id = new.sender_id) then raise exception 'banned'; end if;
  select count(*) into n from public.messages where sender_id = new.sender_id and created_at > now() - interval '1 minute';
  if n >= 20 then raise exception 'rate_limited'; end if;
  select count(*) into n from public.messages where sender_id = new.sender_id and created_at > now() - interval '1 day';
  if n >= 1000 then raise exception 'rate_limited'; end if;
  if new.image is not null and new.image !~ ('^' || new.conversation_id::text || '/' || new.sender_id::text || '/[A-Za-z0-9_-]+\.(webp|jpg|jpeg|png)$') then
    raise exception 'bad_image_path';
  end if;
  new.body := btrim(new.body);
  new.created_at := now();
  return new;
end $$;
drop trigger if exists pm_message_guard on public.messages;
create trigger pm_message_guard before insert on public.messages for each row execute function public.pm_message_guard();

create or replace function public.pm_message_after() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations set last_message_at = new.created_at,
    last_message = left(case when new.body <> '' then new.body else '[image]' end, 120),
    last_sender = new.sender_id,
    owner_read_at = case when owner_id = new.sender_id then new.created_at else owner_read_at end,
    other_read_at = case when other_id = new.sender_id then new.created_at else other_read_at end
  where id = new.conversation_id;
  return null;
end $$;
drop trigger if exists pm_message_after on public.messages;
create trigger pm_message_after after insert on public.messages for each row execute function public.pm_message_after();

-- ---------- RPCs ----------
-- open (or reuse) the conversation between the caller and the poster of a post
create or replace function public.pm_chat_open(p_kind text, p_id uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); owner uuid; ttl text; imgs text[]; cid uuid; hidden timestamptz;
begin
  if uid is null then raise exception 'login_required'; end if;
  if exists (select 1 from public.bans where user_id = uid) then raise exception 'banned'; end if;
  select id into cid from public.conversations where post_kind = p_kind and post_id = p_id and (other_id = uid or owner_id = uid) order by (other_id = uid) desc limit 1;
  if cid is not null then return cid; end if;
  if p_kind = 'listings' then select user_id, title, images, hidden_at into owner, ttl, imgs, hidden from public.listings where id = p_id and status in ('available','reserved');
  elsif p_kind = 'daigou' then select user_id, item, images, hidden_at into owner, ttl, imgs, hidden from public.daigou where id = p_id and status in ('open','taken');
  elsif p_kind = 'errands' then select user_id, pickup, images, hidden_at into owner, ttl, imgs, hidden from public.errands where id = p_id and status in ('open','taken');
  else raise exception 'bad_kind'; end if;
  if owner is null or hidden is not null then raise exception 'post_unavailable'; end if;
  if owner = uid then raise exception 'own_post'; end if;
  if (select count(*) from public.conversations where other_id = uid and created_at > now() - interval '1 hour') >= 30 then raise exception 'rate_limited'; end if;
  insert into public.conversations (post_kind, post_id, post_title, post_thumb, owner_id, other_id)
    values (p_kind, p_id, left(coalesce(ttl, ''), 120), imgs[1], owner, uid)
    on conflict (post_kind, post_id, other_id) do update set post_title = excluded.post_title
    returning id into cid;
  return cid;
end $$;

create or replace function public.pm_chat_read(p_conv uuid) returns void
language sql security definer set search_path = '' as $$
  update public.conversations set
    owner_read_at = case when owner_id = (select auth.uid()) then now() else owner_read_at end,
    other_read_at = case when other_id = (select auth.uid()) then now() else other_read_at end
  where id = p_conv and (select auth.uid()) in (owner_id, other_id);
$$;

-- participants report a conversation (direct inserts of chat reports are blocked below)
create or replace function public.pm_chat_report(p_conv uuid, p_reason text, p_note text default '') returns boolean
language plpgsql security definer set search_path = '' as $$
declare ttl text;
begin
  if not public.pm_is_participant(p_conv) then raise exception 'not_allowed'; end if;
  select post_title into ttl from public.conversations where id = p_conv;
  insert into public.reports (reporter_id, target_kind, target_id, target_title, reason, note)
    values (auth.uid(), 'chat', p_conv, left(coalesce(ttl, ''), 120), p_reason, left(coalesce(p_note, ''), 300));
  return true;
end $$;

-- admins read a conversation only if it has been reported
create or replace function public.pm_admin_chat(p_conv uuid)
returns table (id bigint, created_at timestamptz, sender_id uuid, sender_name text, body text, image text)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if not public.pm_chat_reported(p_conv) then raise exception 'not_reported'; end if;
  insert into public.mod_log (admin_id, action, target_kind, target_id, note) values (auth.uid(), 'view_chat', 'chat', p_conv, '');
  return query select m.id, m.created_at, m.sender_id, p.display_name, m.body, m.image
    from public.messages m left join public.profiles p on p.id = m.sender_id where m.conversation_id = p_conv order by m.id;
end $$;

revoke execute on function public.pm_chat_open(text, uuid), public.pm_chat_read(uuid), public.pm_chat_report(uuid, text, text), public.pm_admin_chat(uuid) from public, anon;
grant execute on function public.pm_chat_open(text, uuid), public.pm_chat_read(uuid), public.pm_chat_report(uuid, text, text), public.pm_admin_chat(uuid) to authenticated;

-- ---------- reports may target a chat (only via pm_chat_report) ----------
alter table public.reports drop constraint if exists reports_target_kind_check1;
alter table public.reports drop constraint if exists reports_target_kind_check;
alter table public.reports add constraint reports_target_kind_check check (target_kind in ('listings','daigou','errands','chat'));
drop policy if exists "insert" on public.reports;
create policy "insert" on public.reports for insert to anon, authenticated
  with check ((reporter_id is null or reporter_id = (select auth.uid())) and target_kind <> 'chat');

-- text-keyed helpers for storage policies (no uuid casts on arbitrary object paths)
create or replace function public.pm_chat_member_path(p_folder text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.conversations c where c.id::text = p_folder and (select auth.uid()) in (c.owner_id, c.other_id));
$$;
create or replace function public.pm_chat_reported_path(p_folder text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.reports r where r.target_kind = 'chat' and r.target_id::text = p_folder);
$$;
revoke execute on function public.pm_chat_member_path(text), public.pm_chat_reported_path(text) from public, anon;
grant execute on function public.pm_chat_member_path(text), public.pm_chat_reported_path(text) to authenticated;

-- ---------- private bucket for chat photos: <conversation id>/<sender id>/<file> ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat-images', 'chat-images', false, 2097152, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "chat images read" on storage.objects;
create policy "chat images read" on storage.objects for select to authenticated using (
  bucket_id = 'chat-images' and (
    public.pm_chat_member_path((storage.foldername(name))[1])
    or ((select public.is_admin()) and public.pm_chat_reported_path((storage.foldername(name))[1]))));
drop policy if exists "chat images upload" on storage.objects;
create policy "chat images upload" on storage.objects for insert to authenticated with check (
  bucket_id = 'chat-images' and (storage.foldername(name))[2] = (select auth.uid())::text
  and public.pm_chat_member_path((storage.foldername(name))[1]) and not public.pm_is_banned((select auth.uid())));
drop policy if exists "chat images delete own" on storage.objects;
create policy "chat images delete own" on storage.objects for delete to authenticated using (
  bucket_id = 'chat-images' and (storage.foldername(name))[2] = (select auth.uid())::text);

-- ---------- realtime ----------
do $$ begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then create publication supabase_realtime; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'conversations') then
    alter publication supabase_realtime add table public.conversations; end if;
end $$;
