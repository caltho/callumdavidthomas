-- =====================================================================
-- portfolio_recent_sleep — narrow public-readable view of sleep hours
--
-- Security model: SECURITY DEFINER function that exposes ONLY two columns
-- from almanac.sleep_logs (log_date, rounded hours_slept) for the homepage
-- "sleep meter" relic on callumdavidthomas.com.
--
-- The function is the ONLY surface anon callers have on the almanac
-- schema. It cannot:
--   - be parameterised to read another user's data (owner_id is hardcoded)
--   - return any field besides date + hours (no quality, notes, bed/wake
--     times, comments, or anything from the `custom` jsonb)
--   - return more than 30 days of history (days_back is clamped 1..30,
--     plus a hard LIMIT 30)
-- search_path is pinned so a malicious schema can't shadow the table.
-- =====================================================================

create or replace function public.portfolio_recent_sleep(days_back int default 14)
returns table(log_date date, hours numeric)
language sql
stable
security definer
set search_path = public, almanac, pg_catalog
as $$
  -- Sum within a date so split sleep + naps roll up into a single bar.
  select
    log_date,
    round(sum(hours_slept)::numeric, 1) as hours
  from almanac.sleep_logs
  where owner_id  = 'ca077e8d-d973-476c-bf4f-cbf3335bf829'  -- Callum (gmail)
    and deleted_at is null
    and hours_slept is not null
    and log_date >= current_date - greatest(1, least(days_back, 30))
    and log_date <= current_date
  group by log_date
  order by log_date asc
  limit 30;
$$;

-- Lock down by default; allow only the read-side roles.
revoke all on function public.portfolio_recent_sleep(int) from public;
grant execute on function public.portfolio_recent_sleep(int) to anon, authenticated;

comment on function public.portfolio_recent_sleep(int) is
  'Public sleep-hours summary for callumdavidthomas.com. Exposes ONLY log_date + rounded hours_slept; never quality, notes, bed/wake times, custom jsonb, or any other column.';
