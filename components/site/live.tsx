"use client";

/**
 * Melbourne clock and "probably doing X" status. Renders the server's guess
 * first, then keeps itself current on the client.
 */

import { useEffect, useState } from "react";
import { callumStatus, clockLabel, melbourneNow } from "@/lib/status";

function useMelbourne() {
  const [now, setNow] = useState(melbourneNow);
  useEffect(() => {
    const tick = () => setNow(melbourneNow());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Clock({ className }: { className?: string }) {
  const now = useMelbourne();
  return (
    <span className={className} suppressHydrationWarning>
      {clockLabel(now)}
    </span>
  );
}

export function Status() {
  const now = useMelbourne();
  return <span suppressHydrationWarning>{callumStatus(now).label}</span>;
}

/** Header status: dot, status and time, greyed out while he's likely asleep. */
export function HeaderStatus() {
  const now = useMelbourne();
  const s = callumStatus(now);
  return (
    <div className={`cell stat${s.awake ? "" : " is-away"}`} suppressHydrationWarning>
      <span className="dot" />
      <span suppressHydrationWarning>
        {s.label} · {clockLabel(now)} Melb
      </span>
    </div>
  );
}
