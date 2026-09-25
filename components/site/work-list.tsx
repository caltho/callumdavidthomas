"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";

export type WorkItem = {
  slug: string;
  title: string;
  summary: string;
  kind: "work" | "client" | "own";
  live?: string;
  peek?: string;
};

type Filter = "all" | "live" | "work" | "own";
const KIND = { work: "Work", client: "Client", own: "Personal" } as const;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "work", label: "Work & clients" },
  { id: "own", label: "Personal" },
];
// Only show the cursor preview where there's a real pointer to follow.
const subscribeHover = (cb: () => void) => {
  const mq = matchMedia("(hover: hover)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const matches = (w: WorkItem, f: Filter) =>
  f === "all" || (f === "live" && !!w.live) || (f === "work" && w.kind !== "own") || (f === "own" && w.kind === "own");

/** Filter buttons live in the strip's margin column, the list in the main one. */
export function WorkStrip({ items, initial = 10 }: { items: WorkItem[]; initial?: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const shown = useMemo(() => {
    const list = items.filter((w) => matches(w, filter));
    return filter === "all" && !expanded ? list.slice(0, initial) : list;
  }, [items, filter, expanded, initial]);

  return (
    <section className="row strip" id="work">
      <div className="cell side">
        <div className="in">
          <h2>
            <span>01</span>Work
          </h2>
          <p>{items.length} projects, newest first. The live ones are real, so go and use them.</p>
          <div className="filters" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label} <sup>{items.filter((w) => matches(w, f.id)).length}</sup>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="cell main">
        <p className="kicker">
          Things I&apos;ve built for construction sites, traffic engineers, clients, and <em>my own life.</em>
        </p>
        <WorkRows items={shown} />
        {filter === "all" && !expanded && items.length > initial && (
          <div className="showall">
            <button type="button" onClick={() => setExpanded(true)}>
              Show all {items.length}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** The ruled list, with a screenshot that follows the cursor where there's one to show. */
export function WorkRows({ items, className = "" }: { items: WorkItem[]; className?: string }) {
  const peek = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const hover = useSyncExternalStore(subscribeHover, () => matchMedia("(hover: hover)").matches, () => false);

  const onMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!hover || !peek.current) return;
    const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-peek]");
    if (!li) return setSrc(null);
    setSrc(li.dataset.peek!);
    peek.current.style.left = Math.min(e.clientX, innerWidth - 340) + "px";
    peek.current.style.top = e.clientY + "px";
  };

  return (
    <>
      <ul className={`list work ${className}`} onMouseMove={onMove} onMouseLeave={() => setSrc(null)}>
        {items.map((w, i) => (
          <li key={w.slug} data-peek={w.peek}>
            <div className="wr">
              <span className="no">CT-{String(i + 1).padStart(2, "0")}</span>
              <Link className="t" href={`/work/${w.slug}`}>
                {w.title}
              </Link>
              <span className="w">{w.summary}</span>
              <span className="k">{KIND[w.kind]}</span>
              <span className={`go${w.live ? " live" : ""}`}>
                {w.live ? (
                  <a href={w.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${w.title} (live)`}>
                    Live ↗
                  </a>
                ) : (
                  "Read →"
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {hover && (
        <div className={`peek${src ? " on" : ""}`} ref={peek} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src && <img src={src} alt="" />}
        </div>
      )}
    </>
  );
}
