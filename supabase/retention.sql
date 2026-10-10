-- Daily auto-cleanup (matches the privacy policy): requires pg_cron. 19:30 UTC = 03:30 HKT.
-- Photos of deleted posts/messages are queued in public.storage_trash by triggers and removed by the pm-sweep Edge Function (schema_v4.sql).
create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'pm_retention';
select cron.schedule('pm_retention', '30 19 * * *', $$
  delete from public.daigou   where deadline < current_date - 30 or (status = 'cancelled' and updated_at < now() - interval '30 days');
  delete from public.errands  where date < current_date - 30 or (status = 'cancelled' and updated_at < now() - interval '30 days');
  delete from public.listings where created_at < now() - interval '180 days' or (status in ('sold','removed') and updated_at < now() - interval '60 days');
  delete from public.reports  where created_at < now() - interval '365 days';
  delete from public.mod_log  where created_at < now() - interval '365 days';
  delete from public.conversations c where coalesce(c.last_message_at, c.created_at) < now() - interval '180 days' and not public.pm_chat_open_report(c.id);
  delete from public.storage_trash where attempts >= 20;
$$);
