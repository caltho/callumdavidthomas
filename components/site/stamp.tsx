"use client";

import { useRef, useState } from "react";

/** A rubber stamp. It's rubber, so you can stamp it. */
export function Stamp({ top, main, interactive = false }: { top: string; main: string; interactive?: boolean }) {
  const [date] = useState(() =>
    new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "Australia/Melbourne" }).format(new Date())
  );
  const [count, setCount] = useState(0);
  const [tilt, setTilt] = useState(-2.5);
  const ref = useRef<HTMLSpanElement>(null);

  const hit = () => {
    if (!interactive) return;
    setCount((n) => n + 1);
    setTilt(Number((Math.random() * 5 - 4).toFixed(1)));
    const el = ref.current;
    if (el) {
      el.classList.remove("thunk");
      void el.offsetWidth; // restart the animation
      el.classList.add("thunk");
    }
  };

  return (
    <>
      <span
        ref={ref}
        className="stamp"
        style={{ transform: `rotate(${tilt}deg)`, cursor: interactive ? "pointer" : "default" }}
        {...(interactive
          ? {
              role: "button",
              tabIndex: 0,
              title: "Stamp it",
              onClick: hit,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  hit();
                }
              },
            }
          : {})}
        aria-label={`${top} ${main}`}
      >
        <small>{top}</small>
        <strong>{main}</strong>
        <em suppressHydrationWarning>{date || " "}</em>
      </span>
      {interactive && (
        <span className="label stamped" aria-live="polite">
          {count === 0 ? "" : count === 1 ? "Stamped once. Very official." : count < 10 ? `Stamped ${count} times.` : `Stamped ${count} times. HR has been notified.`}
        </span>
      )}
    </>
  );
}
