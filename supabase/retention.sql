-- Daily auto-cleanup (matches the privacy policy): requires pg_cron. 19:30 UTC = 03:30 HKT.
-- Note: images of auto-deleted posts are not removed from Storage by this job (see README).
create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'pm_retention';
select cron.schedule('pm_retention', '30 19 * * *', $$
  delete from public.daigou   where deadline < current_date - 30 or (status = 'cancelled' and updated_at < now() - interval '30 days');
  delete from public.errands  where date < current_date - 30 or (status = 'cancelled' and updated_at < now() - interval '30 days');
  delete from public.listings where created_at < now() - interval '180 days' or (status in ('sold','removed') and updated_at < now() - interval '60 days');
  delete from public.reports  where created_at < now() - interval '365 days';
$$);
