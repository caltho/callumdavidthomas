"use client";

/**
 * Heartbeat — the parody of an LLM token-usage meter.
 *
 * A live BPM read-out + a scrolling ECG trace. Idles around a resting rate and
 * spikes whenever a message lands (bump the `excite` counter from the parent).
 * Honors reduced-motion: trace stops, BPM holds steady.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const RESTING = 62;

// One ECG segment: flat baseline with a P-QRS-T-ish spike. Tiled + scrolled.
const SEG_W = 120;
const H = 34;
const MID = H / 2;
const ECG_SEG = `M0 ${MID} H${SEG_W * 0.34} l6 -3 l5 9 l5 -22 l5 28 l6 -12 H${SEG_W}`;

export function Heartbeat({ excite }: { excite: number }) {
  const prefersReduced = useReducedMotion();
  const [bpm, setBpm] = useState(RESTING);
  const firstRun = useRef(true);

  // Spike on each new message.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setBpm(98 + Math.floor(Math.random() * 32));
  }, [excite]);

  // Decay back toward resting, with a little idle wander.
  useEffect(() => {
    const id = setInterval(() => {
      setBpm((prev) => {
        if (prev > RESTING + 1) return Math.max(RESTING, prev - 4);
        return RESTING + Math.floor(Math.random() * 4) - 1;
      });
    }, 850);
    return () => clearInterval(id);
  }, []);

  // Trace scrolls faster when the heart races.
  const duration = Math.max(0.6, 90 / bpm);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-[34px] flex-1 overflow-hidden">
        {prefersReduced ? (
          <svg width="100%" height={H} viewBox={`0 0 ${SEG_W} ${H}`} preserveAspectRatio="none">
            <path d={ECG_SEG} fill="none" stroke="var(--ember)" strokeWidth={1.5} />
          </svg>
        ) : (
          <motion.div
            className="flex h-full"
            style={{ width: SEG_W * 6 }}
            animate={{ x: [0, -SEG_W * 3] }}
            transition={{ duration: duration * 3, ease: "linear", repeat: Infinity }}
          >
            <svg width={SEG_W * 6} height={H} viewBox={`0 0 ${SEG_W * 6} ${H}`} preserveAspectRatio="none">
              {Array.from({ length: 6 }).map((_, i) => (
                <path
                  key={i}
                  d={ECG_SEG}
                  fill="none"
                  stroke="var(--ember)"
                  strokeWidth={1.5}
                  transform={`translate(${i * SEG_W} 0)`}
                  style={{ filter: "drop-shadow(0 0 4px color-mix(in srgb, var(--ember) 60%, transparent))" }}
                />
              ))}
            </svg>
          </motion.div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <span className="font-display text-xl leading-none text-bone-50 tabular-nums">{bpm}</span>
        <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone-400">bpm</span>
      </div>
    </div>
  );
}
