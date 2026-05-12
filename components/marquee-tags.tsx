"use client";

import { motion, useReducedMotion } from "motion/react";

export function MarqueeTags({ items }: { items: string[] }) {
  const prefersReduced = useReducedMotion();
  const row = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-border/60 py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-bone-400"
        animate={prefersReduced ? undefined : { x: ["0%", "-33.333%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {row.map((tag, i) => (
          <span key={`${tag}-${i}`} className="inline-flex items-center gap-3">
            <span aria-hidden className="size-1 rounded-full bg-ember/80" />
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
