"use client";

import { useEffect, useRef, useState } from "react";
import { createWordmark } from "@/lib/particles";

/** The dot-matrix name in its ruled drawing cell, with the fatigue readout. */
export function Wordmark() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<ReturnType<typeof createWordmark> | null>(null);
  const [moved, setMoved] = useState({ moved: 0, total: 0 });

  useEffect(() => {
    if (!host.current) return;
    // next/font exposes the generated family name through this CSS variable.
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-inter-tight").trim() || "system-ui, sans-serif";
    api.current = createWordmark(host.current, {
      family,
      weight: 800,
      entropy: true,
      // Generous fatigue: a few dots give way on the first pass or two, and
      // it keeps building up to a quarter of the word under sustained stirring.
      yieldMin: 5,
      yieldMean: 95,
      maxYield: 0.22,
      maxDrift: 3,
      stressRelax: 0.98,
      onEntropy: ({ moved, total }) => setMoved({ moved, total }),
    });
    return () => api.current?.destroy();
  }, []);

  const pct = moved.total ? Math.max(1, Math.round((moved.moved / moved.total) * 100)) : 0;

  return (
    <section className="row" id="top">
      <div className="cell mark">
        <div className="mark-inner">
          <span className="cross tl" />
          <span className="cross tr" />
          <span className="cross bl" />
          <span className="cross br" />
          <div className="ruler" />
          <div id="wordmark" ref={host}>
            <span className="sr">Callum Thomas</span>
          </div>
          <div className="ruler bottom" />
          <div className="mark-notes">
            <span className="label">DWG CT-000 · Sheet 1 of 1</span>
            <span className="label" aria-live="polite">
              {moved.moved ? (
                <>
                  Stress test · {moved.moved} dots past yield ({pct}%)
                  <button type="button" onClick={() => api.current?.restore()}>
                    Reset ↺
                  </button>
                </>
              ) : (
                "Please disturb ↖ run your cursor through it"
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
