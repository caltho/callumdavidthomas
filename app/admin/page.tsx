import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ count: pCount }, { count: sCount }] = await Promise.all([
    supabase.from("portfolio_projects").select("*", { count: "exact", head: true }),
    supabase.from("portfolio_stuff").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-12">
      <header>
        <p className="eyebrow">§ Backstage</p>
        <h1 className="font-display mt-4 text-6xl leading-none text-bone-50 md:text-8xl">
          The basement<span className="text-ember">.</span>
        </h1>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <DashCard
          href="/admin/projects"
          title="Projects"
          count={pCount ?? 0}
          subtitle="Selected work"
        />
        <DashCard
          href="/admin/stuff"
          title="Stuff"
          count={sCount ?? 0}
          subtitle="Hikes, hobbies, adventures"
        />
        <DashCard
          href="/admin/about"
          title="About"
          subtitle="Bio + description"
        />
      </div>

      <div className="border-t border-border/60 pt-8">
        <p className="eyebrow">Live site</p>
        <Link
          href="/"
          className="font-display mt-3 inline-block text-3xl text-bone-200 transition-colors hover:text-ember"
        >
          callumdavidthomas.com →
        </Link>
      </div>
    </div>
  );
}

function DashCard({
  href,
  title,
  count,
  subtitle,
}: {
  href: string;
  title: string;
  count?: number;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="sweep group col-span-12 block border border-border bg-ink-700/40 p-8 md:col-span-4"
    >
      <p className="eyebrow text-bone-400">{title}</p>
      {typeof count === "number" && (
        <p className="font-display mt-4 text-7xl leading-none text-bone-50 transition-colors group-hover:text-ember">
          {count}
        </p>
      )}
      <p className="mt-4 text-sm text-bone-400">{subtitle}</p>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 group-hover:text-ember">
        Manage →
      </p>
    </Link>
  );
}
