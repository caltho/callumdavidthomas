/**
 * Counter-AI host — Server Component.
 *
 * Reads Callum's real last-night sleep (same Almanac RPC as the sleep meter)
 * and hands it to the client widget, where it becomes a parody "operator status"
 * line. Failure is silent — the widget just omits the sleep quip.
 */
import { createClient } from "@/lib/supabase/server";
import { CounterAI } from "./counter-ai";

type SleepRow = { log_date: string; hours: string | number };

async function lastNightHours(): Promise<number | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("portfolio_recent_sleep", { days_back: 3 });
    const rows = (data ?? []) as SleepRow[];
    if (rows.length === 0) return null;
    const latest = rows.reduce((a, b) => (a.log_date > b.log_date ? a : b));
    return Number(latest.hours);
  } catch {
    return null;
  }
}

export async function CounterAIHost() {
  const hours = await lastNightHours();
  return <CounterAI lastNightHours={hours} />;
}
