/**
 * Seed Supabase from the local /data .ts files.
 *
 * Uses the service_role key — bypasses RLS — so run this server-side only.
 *
 *   npm run seed         # upsert all
 *   npm run seed -- --reset   # truncate first
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

import { projects } from "../data/projects";
import { stuff } from "../data/stuff";
import { about } from "../data/about";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const reset = process.argv.includes("--reset");

async function main() {
  if (reset) {
    console.log("→ Resetting portfolio_* tables…");
    for (const table of ["portfolio_projects", "portfolio_stuff", "portfolio_about"]) {
      const { error } = await supabase.from(table).delete().neq("slug", "__never__");
      if (error && table !== "portfolio_about") throw error;
    }
  }

  // Projects ----------------------------------------------------------
  console.log(`→ Upserting ${projects.length} projects…`);
  const projectRows = projects.map((p) => ({
    slug: p.slug,
    number: p.number,
    title: p.title,
    summary: p.summary,
    long_description: p.longDescription,
    year: p.year ?? null,
    role: p.role ?? null,
    tech_stack: p.techStack ?? [],
    tags: p.tags ?? [],
    thumbnail: p.thumbnail || null,
    images: p.image ?? [],
    link: p.link || null,
    github: p.github || null,
    codeblock: p.codeblock ?? null,
    published: true,
  }));
  const { error: pErr } = await supabase
    .from("portfolio_projects")
    .upsert(projectRows, { onConflict: "slug" });
  if (pErr) throw pErr;

  // Stuff -------------------------------------------------------------
  console.log(`→ Upserting ${stuff.length} stuff entries…`);
  const stuffRows = stuff.map((s) => ({
    slug: s.slug,
    number: s.number,
    title: s.title,
    summary: s.summary,
    long_description: s.longDescription,
    year: s.year ?? null,
    location: s.location ?? null,
    tags: s.tags ?? [],
    thumbnail: s.thumbnail || null,
    images: s.image ?? [],
    links: s.links ?? [],
    published: true,
  }));
  const { error: sErr } = await supabase
    .from("portfolio_stuff")
    .upsert(stuffRows, { onConflict: "slug" });
  if (sErr) throw sErr;

  // About -------------------------------------------------------------
  console.log("→ Upserting about…");
  const { error: aErr } = await supabase
    .from("portfolio_about")
    .upsert(
      { id: "singleton", summary: about.summary, description: about.description },
      { onConflict: "id" }
    );
  if (aErr) throw aErr;

  console.log("\nSeed complete ✓");
  console.log(`  ${projectRows.length} projects, ${stuffRows.length} stuff, 1 about row.`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message || err);
  process.exit(1);
});
