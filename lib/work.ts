import { getProjects } from "@/lib/content";
import { PROJECT_META } from "@/data/project-meta";
import type { WorkItem } from "@/components/site/work-list";
import type { Project } from "@/types/project";

/** A live link worth sending people to: a real site, not a Drive file or this site. */
function liveLink(p: Project) {
  const l = p.link?.trim();
  if (!l || !/^https?:\/\//.test(l) || l.includes("drive.google.com")) return undefined;
  if (/^https?:\/\/(www\.)?callum-thomas\.com\/?$/.test(l)) return undefined;
  return l;
}

export function toWorkItem(p: Project): WorkItem {
  const meta = PROJECT_META[p.slug] ?? {};
  return {
    slug: p.slug,
    title: meta.title ?? p.title,
    summary: p.summary,
    kind: meta.kind ?? "own",
    live: liveLink(p),
    peek: meta.peek,
  };
}

export async function getWorkItems(): Promise<WorkItem[]> {
  return (await getProjects()).map(toWorkItem);
}
