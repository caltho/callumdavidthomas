/**
 * Channel + event naming for Counter-AI realtime.
 *
 * Kept pure and dependency-free so the same helpers can be reused server-side
 * by a future Telegram-bridge route handler (the seam for replying off-site).
 */

/** Shared channel for presence: who's browsing + whether the operator is live. */
export const PRESENCE_CHANNEL = "cdt-presence";

/** One Broadcast channel per visitor session (privacy: no cross-visitor leakage). */
export function messageChannel(sessionId: string) {
  return `cdt-chat:${sessionId}`;
}

export const EVENTS = {
  msg: "msg",
  typing: "typing",
  ack: "ack",
} as const;

export function newId() {
  return crypto.randomUUID();
}
