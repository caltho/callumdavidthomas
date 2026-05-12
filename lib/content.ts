/**
 * Content access layer.
 *
 * Reads from Supabase. If Supabase is unreachable / a row is missing /
 * env isn't set, falls back to the local /data/*.ts files so the site
 * still renders during dev or in a broken-network state.
 */
import { createClient } from "@/lib/supabase/server";
import { projects as fallbackProjects } from "@/data/projects";
import { stuff as fallbackStuff } from "@/data/stuff";
import { about as fallbackAbout } from "@/data/about";
import type { Project } from "@/types/project";
import type { Stuff } from "@/types/stuff";

const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Map a DB row to the `Project` type the UI expects. */
type ProjectRow = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  long_description: string;
  year: number | null;
  role: string | null;
  tech_stack: string[];
  tags: string[];
  thumbnail: string | null;
  images: string[];
  link: string | null;
  github: string | null;
  codeblock: Project["codeblock"] | null;
};
function rowToProject(r: ProjectRow): Project {
  return {
    slug: r.slug,
    number: r.number,
    title: r.title,
    summary: r.summary,
    longDescription: r.long_description,
    year: r.year ?? undefined,
    role: r.role ?? undefined,
    techStack: r.tech_stack,
    tags: r.tags,
    thumbnail: r.thumbnail ?? "",
    image: r.images,
    link: r.link ?? "",
    github: r.github ?? "",
    codeblock: r.codeblock ?? undefined,
  };
}

type StuffRow = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  long_description: string;
  year: number | null;
  location: string | null;
  tags: string[];
  thumbnail: string | null;
  images: string[];
  links: { label: string; href: string }[];
};
function rowToStuff(r: StuffRow): Stuff {
  return {
    slug: r.slug,
    number: r.number,
    title: r.title,
    summary: r.summary,
    longDescription: r.long_description,
    year: r.year ?? undefined,
    location: r.location ?? undefined,
    tags: r.tags,
    thumbnail: r.thumbnail ?? "",
    image: r.images,
    links: r.links,
  };
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  if (!supabaseConfigured) return sortedFallbackProjects();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select(
        "slug,number,title,summary,long_description,year,role,tech_stack,tags,thumbnail,images,link,github,codeblock"
      )
      .order("number", { ascending: true });
    if (error || !data || data.length === 0) return sortedFallbackProjects();
    return data.map(rowToProject);
  } catch {
    return sortedFallbackProjects();
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  if (!supabaseConfigured) return fallbackProject(slug);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select(
        "slug,number,title,summary,long_description,year,role,tech_stack,tags,thumbnail,images,link,github,codeblock"
      )
      .eq("slug", slug)
      .maybeSingle();
    return data ? rowToProject(data) : fallbackProject(slug);
  } catch {
    return fallbackProject(slug);
  }
}

export async function getStuff(): Promise<Stuff[]> {
  if (!supabaseConfigured) return sortedFallbackStuff();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_stuff")
      .select(
        "slug,number,title,summary,long_description,year,location,tags,thumbnail,images,links"
      )
      .order("number", { ascending: true });
    if (error || !data || data.length === 0) return sortedFallbackStuff();
    return data.map(rowToStuff);
  } catch {
    return sortedFallbackStuff();
  }
}

export async function getStuffItem(slug: string): Promise<Stuff | undefined> {
  if (!supabaseConfigured) return fallbackStuffItem(slug);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_stuff")
      .select(
        "slug,number,title,summary,long_description,year,location,tags,thumbnail,images,links"
      )
      .eq("slug", slug)
      .maybeSingle();
    return data ? rowToStuff(data) : fallbackStuffItem(slug);
  } catch {
    return fallbackStuffItem(slug);
  }
}

export async function getAbout() {
  if (!supabaseConfigured) return fallbackAbout;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_about")
      .select("summary,description")
      .eq("id", "singleton")
      .maybeSingle();
    return data ?? fallbackAbout;
  } catch {
    return fallbackAbout;
  }
}

// ---------------------------------------------------------------------
// Local-file fallbacks
// ---------------------------------------------------------------------
function sortedFallbackProjects() {
  return [...fallbackProjects].sort((a, b) => a.number - b.number);
}
function fallbackProject(slug: string) {
  return fallbackProjects.find((p) => p.slug === slug);
}
function sortedFallbackStuff() {
  return [...fallbackStuff].sort((a, b) => a.number - b.number);
}
function fallbackStuffItem(slug: string) {
  return fallbackStuff.find((s) => s.slug === slug);
}
