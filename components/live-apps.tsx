"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { LiveApp } from "@/data/live-apps";
import { cn, pad } from "@/lib/utils";

const accentRing: Record<NonNullable<LiveApp["accent"]>, string> = {
  ember: "from-ember/40 via-ember/0 to-transparent",
  ultra: "from-ultra/40 via-ultra/0 to-transparent",
  halo:  "from-halo/40 via-halo/0 to-transparent",
};

const accentText: Record<NonNullable<LiveApp["accent"]>, string> = {
  ember: "text-ember",
  ultra: "text-ultra",
  halo:  "text-halo",
};

/**
 * Big tile linking out to a deployed app. Subtle hover: accent gradient grows
 * brighter, the title shifts, and the URL strip slides up.
 */
export function LiveAppCard({ app, index }: { app: LiveApp; index: number }) {
  const [hover, setHover] = useState(false);
  const prefersReduced = useReducedMotion();
  const accent = app.accent ?? "ember";

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative isolate flex h-full flex-col justify-between overflow-hidden border border-border bg-ink-700/40 p-7 transition-colors hover:border-bone-400/30 md:p-9"
    >
      {/* Accent halo — sits behind everything */}
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px -z-10 bg-gradient-to-br opacity-30 blur-2xl",
          accentRing[accent]
        )}
        animate={prefersReduced ? undefined : { opacity: hover ? 0.7 : 0.25 }}
        transition={{ duration: 0.5 }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-600">
          {pad(index + 1)} · {app.kind}
        </span>
        <span className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", accentText[accent])}>
          ● Live
        </span>
      </div>

      {/* Title */}
      <motion.h3
        animate={prefersReduced ? undefined : { y: hover ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
        className="font-display mt-8 text-5xl leading-[0.9] tracking-[-0.03em] text-bone-50 md:text-6xl"
      >
        {app.name}
      </motion.h3>

      {/* Blurb */}
      <p className="mt-4 max-w-md text-sm text-bone-400 md:text-base">{app.blurb}</p>

      {/* Bottom strip: URL + arrow */}
      <div className="mt-10 flex items-baseline justify-between border-t border-border/60 pt-4 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span className="text-bone-400">
          {app.url.replace(/^https?:\/\/(www\.)?/, "")}
        </span>
        <span className={cn("transition-colors", hover ? accentText[accent] : "text-bone-400")}>
          Visit ↗
        </span>
      </div>
    </a>
  );
}

export function LiveAppsGrid({ apps }: { apps: LiveApp[] }) {
  // Asymmetric grid: first tile is the hero (8/12), rest fill 4/12 each.
  // 5 apps → row 1: [8 | 4], row 2: [4 | 4 | 4].
  return (
    <div className="grid grid-cols-12 gap-5 md:gap-6">
      {apps.map((app, i) => (
        <div
          key={app.slug}
          className={cn(
            "col-span-12",
            i === 0 ? "md:col-span-8" : "md:col-span-4"
          )}
        >
          <LiveAppCard app={app} index={i} />
        </div>
      ))}
    </div>
  );
}
