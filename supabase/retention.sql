-- Daily auto-cleanup (matches the privacy policy): requires pg_cron
create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'pm_retention';
select cron.schedule('pm_retention', '30 19 * * *', $$
  delete from public.daigou   where deadline < current_date - 30;
  delete from public.errands  where date < current_date - 30;
  delete from public.listings where created_at < now() - interval '180 days';
  delete from public.reports  where created_at < now() - interval '365 days';
$$);
