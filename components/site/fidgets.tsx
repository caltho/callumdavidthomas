"use client";

/**
 * Small things to fiddle with, for no reason: an "I'm not a robot" checkbox
 * and a slide-to-prove-your-humanity slider.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export function HumanCheck() {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((v) => !v);
  return (
    <div
      className={`human-check${on ? " on" : ""}`}
      role="checkbox"
      aria-checked={on}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <span className="box">
        <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" aria-hidden="true">
          <path d="M3 8.5l3.2 3L13 4.5" />
        </svg>
      </span>
      <span>
        <span className="t">{on ? "Verified. Welcome, fellow human." : "I'm not a robot either"}</span>
        <br />
        <span className="s">
          {on ? (
            <>
              The human would love to hear from you. <a href="#ask" onClick={(e) => e.stopPropagation()}>Ask Callum ↓</a>
            </>
          ) : (
            "Tick to continue. Humans only beyond this point."
          )}
        </span>
      </span>
    </div>
  );
}

const START = "Slide to prove your humanity";
const STEPS: [number, string][] = [
  [0.04, "Good."],
  [0.2, "Doing great."],
  [0.38, "Very human of you."],
  [0.55, "Keep going."],
  [0.72, "Nearly there…"],
  [0.9, "Almost…"],
];

type Drag = { x0: number; p0: number; lastY: number; dirY: number; wobbles: number; lastX: number; dirX: number; flips: number };

export function HumanSlider() {
  const track = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLSpanElement>(null);
  const [msg, setMsg] = useState(START);
  const [done, setDone] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const s = useRef({ p: 0, drag: null as Drag | null, anim: 0, hold: false, done: false });

  // Position is driven imperatively so dragging never waits on React.
  const render = useCallback(() => {
    const t = track.current, k = knob.current;
    if (!t || !k) return;
    const { p, drag, hold, done } = s.current;
    const kw = k.offsetWidth, x = p * (t.clientWidth - kw - 2);
    k.style.transform = `translateX(${x}px)`;
    fill.current!.style.width = x + kw / 2 + "px";
    t.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    // The message sits in whichever side of the knob has more room.
    const right = p < 0.5 && !done;
    box.current!.style.left = right ? x + kw + "px" : "0px";
    box.current!.style.right = right || done ? "0px" : t.clientWidth - x + "px";
    if (done || hold) return;
    let m = START;
    for (const [at, text] of STEPS) if (p >= at) m = text;
    if (drag && drag.flips >= 4 && p > 0.04) m = "Fidgeting detected. Very human.";
    setMsg(m);
  }, []);

  const glideTo = useCallback(
    (target: number, ms: number, then?: () => void) => {
      cancelAnimationFrame(s.current.anim);
      const from = s.current.p, t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
        s.current.p = from + (target - from) * e;
        render();
        if (k < 1) s.current.anim = requestAnimationFrame(tick);
        else then?.();
      };
      s.current.anim = requestAnimationFrame(tick);
    },
    [render]
  );

  const complete = useCallback(
    (wobbles: number) => {
      Object.assign(s.current, { done: true, drag: null, p: 1 });
      setDone(true);
      setMsg("Verified human ✓");
      setSub(wobbles > 3 ? `Your hand wobbled ${wobbles} times on the way. Definitely human.` : "Suspiciously smooth. I'll let it slide.");
      render();
    },
    [render]
  );

  useEffect(() => {
    render();
    addEventListener("resize", render);
    return () => removeEventListener("resize", render);
  }, [render]);

  const onDown = (e: React.PointerEvent) => {
    if (s.current.done) return;
    cancelAnimationFrame(s.current.anim);
    s.current.hold = false;
    knob.current!.setPointerCapture(e.pointerId);
    s.current.drag = { x0: e.clientX, p0: s.current.p, lastY: e.clientY, dirY: 0, wobbles: 0, lastX: e.clientX, dirX: 0, flips: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = s.current.drag;
    if (!d) return;
    const dy = e.clientY - d.lastY, dx = e.clientX - d.lastX;
    if (Math.abs(dy) >= 1) {
      const dir = Math.sign(dy);
      if (dir !== d.dirY) { d.wobbles++; d.dirY = dir; }
      d.lastY = e.clientY;
    }
    if (Math.abs(dx) >= 3) {
      const dir = Math.sign(dx);
      if (d.dirX && dir !== d.dirX) d.flips++;
      d.dirX = dir;
      d.lastX = e.clientX;
    }
    const span = track.current!.clientWidth - knob.current!.offsetWidth - 2;
    s.current.p = Math.max(0, Math.min(1, d.p0 + (e.clientX - d.x0) / span));
    render();
    if (s.current.p >= 1) complete(d.wobbles);
  };
  const onUp = () => {
    if (!s.current.drag || s.current.done) return;
    s.current.drag = null;
    if (s.current.p > 0.02) {
      s.current.hold = true;
      setMsg("Don't give up. Humans persevere.");
      glideTo(0, 520, () =>
        setTimeout(() => {
          s.current.hold = false;
          if (!s.current.done && !s.current.drag) render();
        }, 1100)
      );
    } else glideTo(0, 200);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (s.current.done) return;
    const step = ({ ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1, End: 1, Home: -1 } as Record<string, number>)[e.key];
    if (step === undefined) return;
    e.preventDefault();
    s.current.p = Math.max(0, Math.min(1, s.current.p + step));
    render();
    if (s.current.p >= 1) complete(0);
  };
  const again = () => {
    Object.assign(s.current, { done: false });
    setDone(false);
    setSub(null);
    glideTo(0, 500);
  };

  return (
    <div className="slide">
      <div
        className={`track${done ? " done" : ""}`}
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label="Slide to prove your humanity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        onKeyDown={onKey}
      >
        <span className="fill" ref={fill} />
        <span className="msg" ref={box}>
          <span aria-live="polite">{msg}</span>
        </span>
        <span className="knob" ref={knob} aria-hidden="true" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          →
        </span>
      </div>
      <p className="s">
        {sub}
        {sub && (
          <button type="button" onClick={again}>
            Again?
          </button>
        )}
      </p>
    </div>
  );
}
