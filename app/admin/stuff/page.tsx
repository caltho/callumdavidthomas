import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { pad } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminStuff() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("portfolio_stuff")
    .select("id,slug,title,number,published")
    .order("number", { ascending: true });

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <p className="eyebrow">§ Stuff</p>
          <h1 className="font-display mt-3 text-6xl leading-none text-bone-50">
            Stuff<span className="text-ember">.</span>
          </h1>
        </div>
        <Link href="/admin/stuff/new">
          <Button>+ New entry</Button>
        </Link>
      </header>

      <div className="border-y border-border/60">
        {(rows ?? []).map((r) => (
          <Link
            key={r.id}
            href={`/admin/stuff/${r.id}`}
            className="sweep group grid grid-cols-12 items-baseline gap-4 border-t border-border/60 px-2 py-5 first:border-t-0"
          >
            <span className="col-span-1 font-mono text-xs uppercase tracking-[0.2em] text-bone-600">
              {pad(r.number)}
            </span>
            <span className="col-span-7 font-display text-2xl text-bone-50 transition-colors group-hover:text-ember md:text-3xl">
              {r.title}
            </span>
            <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400">
              {r.slug}
            </span>
            <span className="col-span-1 text-right font-mono text-[10px] uppercase tracking-[0.2em]">
              {r.published ? (
                <span className="text-ember">● Live</span>
              ) : (
                <span className="text-bone-600">○ Draft</span>
              )}
            </span>
            <span className="col-span-1 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400">
              Edit →
            </span>
          </Link>
        ))}
        {(!rows || rows.length === 0) && (
          <p className="px-2 py-10 text-bone-400">No stuff yet.</p>
        )}
      </div>
    </div>
  );
}
