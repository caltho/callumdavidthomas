"use client";

/**
 * Counter-AI — the visitor-facing widget.
 *
 * Looks like an LLM chat window; is actually a line to the real Callum over
 * Supabase Realtime Broadcast (no persistence). When the operator console is
 * open, messages reach him and he replies live. When it isn't, `callum-nano`
 * (the parody autoresponder) covers for him.
 *
 * All the chrome — heartbeat meter, model selector, "thinking…" dots, streaming
 * replies, context-window gauge — parodies a real model UI, then undercuts it.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { EVENTS, PRESENCE_CHANNEL, messageChannel, newId } from "@/lib/chat/channels";
import type { AckEvent, ChatMessage, MsgEvent, TypingEvent } from "@/lib/chat/types";
import { nanoReply } from "@/lib/chat/autoresponder";
import { Heartbeat } from "./heartbeat";
import { cn } from "@/lib/utils";

const MODELS = [
  { id: "opus", label: "callum-opus-4.8", note: "1M context · brisbane" },
  { id: "haiku", label: "callum-haiku", note: "fast, terse, possibly rude" },
  { id: "thinking", label: "callum-opus (thinking)", note: "thoughtful, very slow" },
  { id: "coffee", label: "callum-after-coffee", note: "peak performance window" },
  { id: "2am", label: "callum-2am", note: "unhinged · do not trust output" },
] as const;

const CONTEXT_BUDGET = 1400; // chars before the "context window" is "full"

function brisbaneHour(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Brisbane",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
}

export function CounterAI({ lastNightHours }: { lastNightHours: number | null }) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [operatorOnline, setOperatorOnline] = useState(false);
  const [callumTyping, setCallumTyping] = useState(false);
  const [nanoTyping, setNanoTyping] = useState(false);
  const [model, setModel] = useState<(typeof MODELS)[number]>(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [excite, setExcite] = useState(0);

  const [sessionId] = useState(newId);

  const msgChRef = useRef<RealtimeChannel | null>(null);
  const presenceRef = useRef<RealtimeChannel | null>(null);
  const modelLabelRef = useRef(model.label);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef(
    new Map<string, { attempts: number; timer: ReturnType<typeof setTimeout> | null }>()
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    modelLabelRef.current = model.label;
  }, [model]);

  const addMessage = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  // Subscribe: one per-session message channel + the shared presence channel.
  useEffect(() => {
    if (!started) return;
    const supabase = createClient();

    const msgCh = supabase.channel(messageChannel(sessionId), {
      config: { broadcast: { self: false } },
    });
    msgCh
      .on("broadcast", { event: EVENTS.msg }, ({ payload }) => {
        const m = payload as MsgEvent;
        if (m.from !== "callum") return;
        setCallumTyping(false);
        addMessage({ ...m, model: modelLabelRef.current });
        setExcite((e) => e + 1);
      })
      .on("broadcast", { event: EVENTS.typing }, ({ payload }) => {
        const t = payload as TypingEvent;
        if (t.from !== "callum") return;
        if (typingTimer.current) clearTimeout(typingTimer.current);
        setCallumTyping(t.typing);
        if (t.typing) typingTimer.current = setTimeout(() => setCallumTyping(false), 4000);
      })
      .on("broadcast", { event: EVENTS.ack }, ({ payload }) => {
        const a = payload as AckEvent;
        const entry = pendingRef.current.get(a.id);
        if (entry?.timer) clearTimeout(entry.timer);
        pendingRef.current.delete(a.id);
      })
      .subscribe();
    msgChRef.current = msgCh;

    const presence = supabase.channel(PRESENCE_CHANNEL, {
      config: { presence: { key: sessionId } },
    });
    presence
      .on("presence", { event: "sync" }, () => {
        const state = presence.presenceState<{ role?: string }>();
        const operator = Object.values(state)
          .flat()
          .some((p) => p.role === "operator");
        setOperatorOnline(operator);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presence.track({
            role: "visitor",
            sessionId,
            page: window.location.pathname,
            startedAt: Date.now(),
          });
        }
      });
    presenceRef.current = presence;

    const pending = pendingRef.current;
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      pending.forEach((e) => e.timer && clearTimeout(e.timer));
      pending.clear();
      supabase.removeChannel(msgCh);
      supabase.removeChannel(presence);
    };
  }, [started, sessionId, addMessage]);

  // Stick to the bottom as the transcript grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, callumTyping, nanoTyping]);

  const broadcastMsg = useCallback((m: ChatMessage) => {
    msgChRef.current?.send({
      type: "broadcast",
      event: EVENTS.msg,
      payload: { id: m.id, from: "visitor", text: m.text, ts: m.ts } satisfies MsgEvent,
    });
  }, []);

  // Resend the message until the console acks it (covers the join race).
  const scheduleResend = useCallback(
    (m: ChatMessage) => {
      const entry = { attempts: 0, timer: null as ReturnType<typeof setTimeout> | null };
      const tick = () => {
        if (!pendingRef.current.has(m.id)) return;
        if (entry.attempts >= 3) {
          pendingRef.current.delete(m.id);
          return;
        }
        entry.attempts += 1;
        broadcastMsg(m);
        entry.timer = setTimeout(tick, 1500);
      };
      pendingRef.current.set(m.id, entry);
      entry.timer = setTimeout(tick, 1500);
    },
    [broadcastMsg]
  );

  const runNano = useCallback(
    (text: string) => {
      setNanoTyping(true);
      const delay = 700 + Math.random() * 900;
      setTimeout(() => {
        setNanoTyping(false);
        addMessage({
          id: newId(),
          from: "callum",
          text: nanoReply(text, brisbaneHour()),
          ts: Date.now(),
          model: "callum-nano",
        });
        setExcite((e) => e + 1);
      }, delay);
    },
    [addMessage]
  );

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const m: ChatMessage = { id: newId(), from: "visitor", text, ts: Date.now() };
    addMessage(m);
    setInput("");
    setExcite((e) => e + 1);
    if (operatorOnline && msgChRef.current) {
      broadcastMsg(m);
      scheduleResend(m);
    } else {
      runNano(text);
    }
  }, [input, operatorOnline, addMessage, broadcastMsg, scheduleResend, runNano]);

  // Hidden on /admin and on the terminal homepage (which has its own console).
  if (pathname?.startsWith("/admin") || pathname === "/") return null;

  const chars = messages.reduce((s, m) => s + m.text.length, 0);
  const ctxPct = Math.min(100, Math.round((chars / CONTEXT_BUDGET) * 100));

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="flex h-[min(34rem,75vh)] w-[min(23rem,calc(100vw-2rem))] flex-col border border-border bg-ink-800/95 shadow-2xl backdrop-blur-md"
          >
            {/* Header — model badge + status */}
            <div className="relative border-b border-border/60 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setModelOpen((v) => !v)}
                  className="group flex min-w-0 items-center gap-2 text-left"
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      operatorOnline ? "bg-ember pulse-dot" : "bg-bone-600"
                    )}
                    aria-hidden
                  />
                  <span className="truncate font-mono text-xs text-bone-50">{model.label}</span>
                  <span className="font-mono text-[10px] text-bone-600 group-hover:text-bone-400">▾</span>
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs text-bone-400 transition-colors hover:text-ember"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-600">
                {operatorOnline ? "operator online · live" : "operator away · callum-nano"}
              </p>

              {modelOpen && (
                <div className="absolute left-3 right-3 top-full z-10 mt-1 border border-border bg-ink-700 shadow-xl">
                  {MODELS.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setModel(mod);
                        setModelOpen(false);
                      }}
                      className={cn(
                        "block w-full px-3 py-2 text-left transition-colors hover:bg-ink-500",
                        mod.id === model.id && "bg-ink-600"
                      )}
                    >
                      <span className="block font-mono text-xs text-bone-50">{mod.label}</span>
                      <span className="block font-mono text-[10px] text-bone-600">{mod.note}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stats strip — heartbeat + context window */}
            <div className="space-y-2 border-b border-border/60 px-4 py-3">
              <Heartbeat excite={excite} />
              <div>
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-bone-600">
                  <span>context window</span>
                  <span className={cn(ctxPct >= 100 && "text-ember")}>{ctxPct}%</span>
                </div>
                <div className="mt-1 h-1 w-full bg-ink-500">
                  <div
                    className={cn("h-full transition-all", ctxPct >= 100 ? "bg-ember" : "bg-bone-400")}
                    style={{ width: `${ctxPct}%` }}
                  />
                </div>
                {ctxPct >= 100 && (
                  <p className="mt-1 font-mono text-[9px] text-ember">
                    context full — callum has forgotten how this started
                  </p>
                )}
              </div>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <p className="text-sm leading-relaxed text-bone-400">
                  Hi — ask me anything. Looks like a chatbot, but every reply is a real
                  human{operatorOnline ? " who's online right now" : ""}.
                </p>
              )}
              {messages.map((m) => (
                <Bubble key={m.id} message={m} animate={!prefersReduced} />
              ))}
              {(callumTyping || nanoTyping) && (
                <ThinkingDots label={callumTyping ? "Callum is thinking" : "callum-nano is generating"} />
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-border/60 px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="Message Callum…"
                  className="max-h-24 flex-1 resize-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-bone-50 placeholder:text-bone-600 focus:border-ember focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="shrink-0 bg-ember px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-bone-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </form>
              <p className="mt-2 font-mono text-[9px] leading-relaxed text-bone-600">
                Callum can make mistakes. Verify important info.
                {lastNightHours != null && (
                  <> Ran on {lastNightHours.toFixed(1)}h sleep — responses may be slow & grumpy.</>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher — opening the line on first interaction keeps every page view off the wire. */}
      <button
        onClick={() => {
          setStarted(true);
          setOpen((v) => !v);
        }}
        className="sweep flex items-center gap-2 border border-border bg-ink-700 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-200 shadow-xl transition-colors hover:border-ember/60 hover:text-bone-50"
      >
        <span className="size-1.5 rounded-full bg-ember pulse-dot" aria-hidden />
        {open ? "Close" : "Ask Callum"}
      </button>
    </div>
  );
}

function Bubble({ message, animate }: { message: ChatMessage; animate: boolean }) {
  const mine = message.from === "visitor";
  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      {!mine && message.model && (
        <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-bone-600">
          {message.model}
        </span>
      )}
      <div
        className={cn(
          "max-w-[85%] px-3 py-2 text-sm leading-relaxed",
          mine
            ? "border border-border bg-ink-600 text-bone-100"
            : "border border-ember/30 bg-ember/5 text-bone-50"
        )}
      >
        {mine ? message.text : <StreamingText text={message.text} animate={animate} />}
      </div>
    </div>
  );
}

function StreamingText({ text, animate }: { text: string; animate: boolean }) {
  // A given bubble's text is immutable (messages are keyed by id), so this only
  // ever streams once, on mount — no need to react to `text`/`animate` changes.
  const [shown, setShown] = useState(() => (animate ? "" : text));
  useEffect(() => {
    if (!animate) return;
    const words = text.split(" ");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(words.slice(0, i).join(" "));
      if (i >= words.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{shown}</>;
}

function ThinkingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-400">
      <span>{label}</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1 rounded-full bg-ember"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </span>
    </div>
  );
}
