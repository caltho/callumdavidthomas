/**
 * Counter-AI shared types.
 *
 * The whole feature is a Reverse Turing Test: it looks like an LLM chat, but
 * visitor messages reach the real Callum and he replies in realtime. Nothing
 * is persisted — these types only ever travel over Supabase Realtime Broadcast.
 */

export type Sender = "visitor" | "callum";

export type ChatMessage = {
  id: string;
  from: Sender;
  text: string;
  ts: number;
  /** Model label to show on `callum` bubbles (real reply vs offline nano). */
  model?: string;
};

/** Presence tracked on PRESENCE_CHANNEL so the console can discover visitors. */
export type VisitorPresence = {
  role: "visitor";
  sessionId: string;
  page: string;
  startedAt: number;
};

export type OperatorPresence = { role: "operator" };

export type Presence = VisitorPresence | OperatorPresence;

/* ---- Broadcast event payloads (per-session message channel) ---- */

export type MsgEvent = {
  id: string;
  from: Sender;
  text: string;
  ts: number;
};

/** Operator/visitor "is typing" signal — drives the "Callum is thinking…" dots. */
export type TypingEvent = { from: Sender; typing: boolean };

/** Console → visitor receipt, so the widget can stop resending its first message. */
export type AckEvent = { id: string };
