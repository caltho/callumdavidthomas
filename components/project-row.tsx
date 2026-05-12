"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/types/project";
import { pad } from "@/lib/utils";

/**
 * A single editorial-style row in the work index.
 * Hover triggers a "club light" sweep + ember accent on the index number,
 * with the title nudging slightly. No layout shift, no scroll trap.
 */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const prefersReduced = useReducedMotion();

  const slug = project.link?.startsWith("http") ? null : project.slug;
  const href = slug ? `/work/${slug}` : project.link || `/work/${project.slug}`;
  const external = !!project.link?.startsWith("http") && !slug;

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="sweep group block border-t border-border/60 first:border-t-0"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 items-baseline gap-6 px-6 py-7 md:px-10 md:py-10">
        <span className="col-span-2 font-mono text-xs uppercase tracking-[0.2em] text-bone-600 md:col-span-1">
          {pad(index + 1)}
        </span>

        <div className="col-span-10 md:col-span-7">
          <motion.h3
            animate={prefersReduced ? undefined : { x: hover ? 6 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="font-display text-3xl text-bone-50 md:text-5xl lg:text-6xl"
          >
            {project.title}
          </motion.h3>
        </div>

        <p className="col-span-7 hidden text-sm text-bone-400 md:col-span-3 md:block">
          {project.summary}
        </p>

        <span className="col-span-5 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400 md:col-span-1">
          {external ? "↗ Live" : "Read →"}
        </span>
      </div>
    </Link>
  );
}
