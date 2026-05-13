/**
 * Sleep meter relic — live hours-per-night from Almanac.
 *
 * Hits the SECURITY DEFINER function `portfolio_recent_sleep` which only
 * exposes (date, hours). No quality, no times, no notes — by design.
 */
import { createClient } from "@/lib/supabase/server";

type SleepRow = { log_date: string; hours: string | number };

const DAYS = 14;
const MAX_HOURS = 10;
const CHART_HEIGHT = 120;

function buildSeries(rows: SleepRow[] | null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const byDate = new Map<string, number>();
  for (const r of rows ?? []) byDate.set(r.log_date, Number(r.hours));

  const series: { iso: string; date: Date; hours: number | null }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    series.push({ iso, date: d, hours: byDate.get(iso) ?? null });
  }
  return series;
}

export async function SleepMeter() {
  let rows: SleepRow[] | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("portfolio_recent_sleep", {
      days_back: DAYS,
    });
    rows = (data ?? []) as SleepRow[];
  } catch {
    rows = [];
  }

  const series = buildSeries(rows);
  const valid = series.filter((d) => d.hours !== null) as {
    iso: string;
    date: Date;
    hours: number;
  }[];
  const avg =
    valid.length > 0
      ? (valid.reduce((s, d) => s + d.hours, 0) / valid.length).toFixed(1)
      : "—";
  const last = valid.length > 0 ? valid[valid.length - 1].hours.toFixed(1) : "—";

  return (
    <div className="flex h-full flex-col border border-border bg-ink-700/40">
      <div className="border-b border-border/60 px-6 py-4">
        <p className="eyebrow flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-ember" aria-hidden />
          Sleep · last {DAYS} days
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
              Last night
            </p>
            <p className="font-display mt-2 text-4xl text-bone-50 md:text-5xl">
              {last}
              <span className="ml-1 text-xl text-bone-400">h</span>
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
              Avg ({valid.length}/{DAYS})
            </p>
            <p className="font-display mt-2 text-4xl text-bone-50 md:text-5xl">
              {avg}
              <span className="ml-1 text-xl text-bone-400">h</span>
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <div
            className="relative flex items-end gap-1"
            style={{ height: CHART_HEIGHT }}
          >
            {/* horizon rule at 8h */}
            <div
              className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-border/80"
              style={{ bottom: `${(8 / MAX_HOURS) * 100}%` }}
              aria-hidden
            />
            {series.map((d, i) => {
              const h =
                d.hours !== null ? (d.hours / MAX_HOURS) * CHART_HEIGHT : 0;
              return (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-stretch justify-end"
                  title={
                    d.hours !== null
                      ? `${d.iso}: ${d.hours}h`
                      : `${d.iso}: no log`
                  }
                >
                  {d.hours !== null ? (
                    <div
                      className="bg-ember"
                      style={{
                        height: Math.max(h, 4),
                        boxShadow: "0 0 12px color-mix(in srgb, var(--ember) 50%, transparent)",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-ink-500"
                      style={{ height: 2 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* x-axis: just first / mid / last for clarity */}
          <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-bone-600">
            <span>{series[0]?.date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>
            <span>{series[Math.floor(DAYS / 2)]?.date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>
            <span>Now</span>
          </div>
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-600">
          live from almanac · hours only · no times, quality, or notes
        </p>
      </div>
    </div>
  );
}
