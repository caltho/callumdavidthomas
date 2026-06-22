/**
 * Callum status — a best-guess of what Callum is probably doing right now,
 * inferred from the Brisbane clock + day of week. Pure and deterministic so
 * the server render and the client hydrate agree (no flicker), then the client
 * re-evaluates on an interval.
 *
 * Brisbane, not Melbourne: the site copy says Melbourne but he's actually in
 * Brisbane (UTC+10, no DST) — matches the chat autoresponder's timezone.
 */

export type CallumStatus = {
  /** Short status shown next to "system online". */
  label: string;
  /** Is he plausibly at the keyboard / reachable right now? Drives the dot. */
  awake: boolean;
};

/** Current hour (0–23) in Brisbane, regardless of the viewer's timezone. */
export function brisbaneNow(): { hour: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Brisbane",
    hour: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const wk = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wk);
  return { hour, day };
}

/**
 * Map (day, hour) → a likely status. Weekends and weeknights skew toward life;
 * weekdays 9–17 skew toward RJE / shipping. Kept deterministic per hour so it
 * doesn't strobe, but the bucket has a little personality.
 */
export function callumStatus(now = brisbaneNow()): CallumStatus {
  const { hour, day } = now;
  const weekend = day === 0 || day === 6;

  // Asleep — late night into early morning.
  if (hour >= 0 && hour < 6) return { label: "asleep (allegedly)", awake: false };
  if (hour >= 6 && hour < 8) return { label: "pre-coffee, unresponsive", awake: false };

  if (weekend) {
    if (hour >= 8 && hour < 11) return { label: "slow weekend start", awake: true };
    if (hour >= 11 && hour < 16) return { label: "outside, touching grass", awake: true };
    if (hour >= 16 && hour < 19) return { label: "on the boat (probably)", awake: true };
    if (hour >= 19 && hour < 23) return { label: "side-project o'clock", awake: true };
    return { label: "watching techno sets", awake: true };
  }

  // Weekday
  if (hour >= 8 && hour < 9) return { label: "first coffee", awake: true };
  if (hour >= 9 && hour < 12) return { label: "at RJE, heads-down", awake: true };
  if (hour >= 12 && hour < 13) return { label: "eating lunch", awake: true };
  if (hour >= 13 && hour < 17) return { label: "deep in TypeScript", awake: true };
  if (hour >= 17 && hour < 19) return { label: "off the clock, cooking", awake: true };
  if (hour >= 19 && hour < 23) return { label: "shipping something", awake: true };
  return { label: "should be asleep", awake: true };
}
