"use client";

/**
 * Scratch pad. No instructions: you draw in the colour of whatever you last
 * touched anywhere on the page. Photos give their actual pixel colour.
 */

import { useEffect, useRef, useState } from "react";

const PENS: [string, number][] = [["0.25", 1.4], ["0.5", 2.6], ["0.7", 4], ["1.0", 6.5]];
const PAPERS = [[241, 239, 232], [233, 230, 220], [247, 245, 239], [211, 207, 195]];
const START = "rgb(23, 23, 21)";

const parse = (c: string | null) => {
  const m = (c || "").match(/[\d.]+/g);
  if (!m || m.length < 3 || (m.length > 3 && +m[3] < 0.1)) return null;
  return m.slice(0, 3).map(Number);
};
const paperish = (c: number[]) => PAPERS.some((q) => Math.abs(c[0] - q[0]) + Math.abs(c[1] - q[1]) + Math.abs(c[2] - q[2]) < 30);
const rgb = (c: number[]) => `rgb(${c.map(Math.round).join(", ")})`;
const toHex = (c: string) =>
  "#" + (c.match(/\d+/g) || ["0", "0", "0"]).slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("").toUpperCase();

function sampleImg(img: HTMLImageElement, e: PointerEvent) {
  try {
    const r = img.getBoundingClientRect(), cs = getComputedStyle(img), iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw) return null;
    let sc = r.width / iw, ox = 0, oy = 0;
    if (cs.objectFit === "cover") {
      sc = Math.max(r.width / iw, r.height / ih);
      const [px, py] = cs.objectPosition.split(" ").map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : 0.5));
      ox = (r.width - iw * sc) * px;
      oy = (r.height - ih * sc) * py;
    }
    const x = (e.clientX - r.left - ox) / sc, y = (e.clientY - r.top - oy) / sc;
    const c = document.createElement("canvas");
    c.width = c.height = 3;
    const cx = c.getContext("2d", { willReadFrequently: true })!;
    cx.drawImage(img, x - 1, y - 1, 3, 3, 0, 0, 3, 3);
    const d = cx.getImageData(0, 0, 3, 3).data, sum = [0, 0, 0];
    for (let i = 0; i < d.length; i += 4) { sum[0] += d[i]; sum[1] += d[i + 1]; sum[2] += d[i + 2]; }
    return rgb(sum.map((v) => v / 9));
  } catch {
    return null; // cross-origin images can't be read
  }
}

function colourOf(e: PointerEvent): string | null {
  const el = e.target;
  if (!(el instanceof Element) || el.closest(".pad, .padbar")) return null;
  if (el instanceof HTMLImageElement) return sampleImg(el, e);
  if (el instanceof HTMLCanvasElement) {
    try {
      const r = el.getBoundingClientRect();
      const d = el.getContext("2d")!.getImageData(((e.clientX - r.left) * el.width) / r.width, ((e.clientY - r.top) * el.height) / r.height, 1, 1).data;
      if (d[3] > 60) return rgb([d[0], d[1], d[2]]);
    } catch {}
  }
  if (el instanceof SVGElement) {
    const cs = getComputedStyle(el);
    const c = parse(cs.stroke) || parse(cs.fill);
    if (c) return rgb(c);
  }
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
    const bg = parse(getComputedStyle(n).backgroundColor);
    if (bg && !paperish(bg)) return rgb(bg);
    if (bg) break;
  }
  const fg = parse(getComputedStyle(el).color);
  return fg ? rgb(fg) : null;
}

export function SketchPad() {
  const pad = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const colourRef = useRef(START);
  const penRef = useRef(1);
  const [colour, setColour] = useState(START);
  const [pen, setPen] = useState(1);
  const [dirty, setDirty] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Pick up the colour of whatever was touched last, anywhere on the page.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const c = colourOf(e);
      if (!c || c === colourRef.current) return;
      colourRef.current = c;
      setColour(c);
      setPulse((n) => n + 1);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, []);

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
          <span className="ink">
            <span key={pulse} className={`sw${pulse ? " pulse" : ""}`} style={{ background: colour }} />
            <span>{toHex(colour)}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              const n = (pen + 1) % PENS.length;
              penRef.current = n;
              setPen(n);
            }}
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
