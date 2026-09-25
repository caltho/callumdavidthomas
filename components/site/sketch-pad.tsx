"use client";

/**
 * Scratch pad. No instructions. Tap the ink to cycle colours and the pen to
 * cycle sizes, like a drawer of technical pens.
 */

import { useEffect, useRef, useState } from "react";

const PENS: [string, number][] = [["0.25", 1.4], ["0.5", 2.6], ["0.7", 4], ["1.0", 6.5]];
const INKS: [string, string][] = [
  ["Black", "#171715"],
  ["Red", "#ec4a1d"],
  ["Blue", "#2445ff"],
  ["Green", "#2f9e44"],
  ["Pencil", "#8a877d"],
];

export function SketchPad() {
  const pad = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const colourRef = useRef(INKS[0][1]);
  const penRef = useRef(1);
  const [ink, setInk] = useState(0);
  const [pen, setPen] = useState(1);
  const [dirty, setDirty] = useState(false);
  const colour = INKS[ink][1];

  // Keep the canvas crisp and keep the drawing when the pad resizes.
  useEffect(() => {
    const canvas = cv.current!, box = pad.current!, g = canvas.getContext("2d")!;
    const size = () => {
      const r = box.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      const keep = document.createElement("canvas");
      keep.width = canvas.width;
      keep.height = canvas.height;
      if (canvas.width) keep.getContext("2d")!.drawImage(canvas, 0, 0);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (keep.width) g.drawImage(keep, 0, 0);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineCap = "round";
      g.lineJoin = "round";
    };
    const ro = new ResizeObserver(size);
    ro.observe(box);

    type P = { x: number; y: number; w: number };
    let last: P | null = null, mid: P | null = null;
    const pos = (e: PointerEvent): P => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: e.pointerType === "pen" && e.pressure ? 0.4 + e.pressure * 1.4 : 1 };
    };
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      last = mid = pos(e);
      g.fillStyle = colourRef.current;
      g.beginPath();
      g.arc(last.x, last.y, (PENS[penRef.current][1] * last.w) / 2, 0, Math.PI * 2);
      g.fill();
      setDirty(true);
    };
    const move = (e: PointerEvent) => {
      if (!last || !mid) return;
      g.strokeStyle = colourRef.current;
      for (const ev of e.getCoalescedEvents ? e.getCoalescedEvents() : [e]) {
        const p = pos(ev), m = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2, w: p.w };
        g.lineWidth = PENS[penRef.current][1] * p.w;
        g.beginPath();
        g.moveTo(mid.x, mid.y);
        g.quadraticCurveTo(last.x, last.y, m.x, m.y);
        g.stroke();
        last = p;
        mid = m;
      }
    };
    const up = () => (last = null);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  const cursor = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><circle cx="11" cy="11" r="5" fill="${colour}" stroke="white" stroke-width="1.5"/></svg>`
  )}") 11 11, crosshair`;

  const erase = () => {
    const c = cv.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setDirty(false);
  };
  const send = () => {
    const c = cv.current!;
    const scale = Math.min(1, 480 / c.width), out = document.createElement("canvas");
    out.width = c.width * scale;
    out.height = c.height * scale;
    const o = out.getContext("2d")!;
    o.fillStyle = "#f7f5ef";
    o.fillRect(0, 0, out.width, out.height);
    o.drawImage(c, 0, 0, out.width, out.height);
    window.dispatchEvent(new CustomEvent("ct:sketch", { detail: out.toDataURL("image/png") }));
    document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="row strip" id="sketch">
      <div className="cell side">
        <div className="in">
          <h2>
            <span>SK</span>Scratch area
          </h2>
        </div>
      </div>
      <div className="cell main">
        <div className="pad" ref={pad} style={{ cursor }}>
          <canvas ref={cv} aria-label="Scratch pad" />
          <span className="nfc">Not for construction</span>
        </div>
        <div className="padbar">
          <button
            type="button"
            className="ink"
            aria-label={`Ink: ${INKS[ink][0]}. Change colour`}
            onClick={() => {
              const n = (ink + 1) % INKS.length;
              colourRef.current = INKS[n][1];
              setInk(n);
            }}
          >
            <span key={ink} className={`sw${ink ? " pulse" : ""}`} style={{ background: colour }} />
            <span>{INKS[ink][0]}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const n = (pen + 1) % PENS.length;
              penRef.current = n;
              setPen(n);
            }}
            aria-label={`Pen ${PENS[pen][0]}. Change size`}
          >
            Pen {PENS[pen][0]}
          </button>
          <span className="grow" />
          <button type="button" onClick={erase}>
            Erase
          </button>
          <button type="button" className="send" aria-disabled={!dirty} onClick={() => dirty && send()}>
            Send to Callum ↗
          </button>
        </div>
      </div>
    </section>
  );
}
