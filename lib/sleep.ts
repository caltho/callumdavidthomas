/**
 * Last 14 nights of sleep, from Almanac's `portfolio_recent_sleep` RPC (hours
 * only, by design). When Almanac has nothing recent, a sample fortnight stands
 * in, flagged so the page can say so honestly.
 */
import { createClient } from "@/lib/supabase/server";

export type SleepData = { nights: (number | null)[]; last: number; avg: number; sample: boolean };

const DAYS = 14;
const SAMPLE = [7.2, 6.4, 8.1, 5.9, 7.0, 7.6, null, 6.8, 7.9, 6.1, 7.3, 8.4, 6.6, 6.9];

function summarise(nights: (number | null)[], sample: boolean): SleepData {
  const logged = nights.filter((h): h is number => h != null);
  return {
    nights,
    last: logged.at(-1) ?? 0,
    avg: logged.reduce((a, b) => a + b, 0) / (logged.length || 1),
    sample,
  };
}

export async function getSleep(): Promise<SleepData> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("portfolio_recent_sleep", { days_back: DAYS });
    const rows = (data ?? []) as { log_date: string; hours: string | number }[];
    if (rows.length >= 3) {
      const byDate = new Map(rows.map((r) => [r.log_date, Number(r.hours)]));
      const today = new Date();
      const nights = Array.from({ length: DAYS }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (DAYS - 1 - i));
        return byDate.get(d.toISOString().slice(0, 10)) ?? null;
      });
      return summarise(nights, false);
    }
  } catch {
    // fall through to the sample
  }
  return summarise(SAMPLE, true);
}
