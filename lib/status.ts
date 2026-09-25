/**
 * A best guess at what Callum is probably doing right now, from the Melbourne
 * clock and the day of the week. Pure, so server and client agree on it.
 */

export const TIMEZONE = "Australia/Melbourne";

export type CallumStatus = {
  /** Short, lowercase: "probably {label}". */
  label: string;
  /** Plausibly awake and reachable. Drives the status dot. */
  awake: boolean;
};

export type MelbourneNow = { hour: number; minute: number; day: number };

export function melbourneNow(date = new Date()): MelbourneNow {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return {
    hour: Number(get("hour")) % 24,
    minute: Number(get("minute")),
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
  };
}

export function callumStatus({ hour, day }: MelbourneNow = melbourneNow()): CallumStatus {
  const weekend = day === 0 || day === 6;
  if (hour < 6) return { label: "asleep (allegedly)", awake: false };
  if (hour < 8) return { label: "pre-coffee, unresponsive", awake: false };
  if (weekend) {
    if (hour < 11) return { label: "having a slow weekend start", awake: true };
    if (hour < 16) return { label: "outside, touching grass", awake: true };
    if (hour < 19) return { label: "on the boat (probably)", awake: true };
    if (hour < 23) return { label: "on side-project o'clock", awake: true };
    return { label: "watching techno sets", awake: true };
  }
  if (hour < 9) return { label: "on the first coffee", awake: true };
  if (hour < 12) return { label: "at RJE, heads-down", awake: true };
  if (hour < 13) return { label: "eating lunch", awake: true };
  if (hour < 17) return { label: "deep in TypeScript", awake: true };
  if (hour < 19) return { label: "off the clock, cooking", awake: true };
  if (hour < 23) return { label: "shipping something", awake: true };
  return { label: "up past his bedtime", awake: true };
}

/** "10:42 pm" */
export function clockLabel({ hour, minute }: MelbourneNow = melbourneNow()) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${String(minute).padStart(2, "0")} ${hour < 12 ? "am" : "pm"}`;
}
