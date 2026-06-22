import { getProjects } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { callumStatus } from "@/lib/status";
import { Terminal, type TermProject } from "@/components/terminal/terminal";

type SleepRow = { log_date: string; hours: string | number };

/** Callum's most recent night of sleep (same Almanac RPC as the sleep meter). */
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

export default async function Home() {
  const projects = await getProjects();
  const term: TermProject[] = projects.slice(0, 12).map((p) => ({
    slug: p.slug,
    title: p.title,
    live: p.link && p.link.startsWith("http") ? p.link : undefined,
    kind: (p.techStack ?? p.tags ?? [])[0],
  }));
  const hours = await lastNightHours();

  return (
    <Terminal projects={term} lastNightHours={hours} initialStatus={callumStatus()} />
  );
}
