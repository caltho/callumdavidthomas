"use client";

/**
 * Counter-AI operator console.
 *
 * The human side of the Reverse Turing Test. Tracks operator presence (so the
 * widget shows "online"), discovers live visitors via the shared presence
 * channel, joins each visitor's Broadcast channel, and lets Callum reply in
 * realtime. Pings + notifies on new inbound messages. Nothing is persisted —
 * close the tab and it's gone.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { EVENTS, PRESENCE_CHANNEL, messageChannel, newId } from "@/lib/chat/channels";
import type {
  AckEvent,
  ChatMessage,
  MsgEvent,
  OperatorPresence,
  TypingEvent,
  VisitorPresence,
} from "@/lib/chat/types";
import { cn } from "@/lib/utils";

type SessionState = {
  sessionId: string;
  page: string;
  startedAt: number;
  online: boolean;
  messages: ChatMessage[];
  unread: number;
};

function ping() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.26);
    o.onended = () => ctx.close();
  } catch {
    /* audio is best-effort */
  }
}

function maybeNotify(body: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("Counter-AI — new message", { body });
  }
}

const shortId = (id: string) => id.slice(0, 8);

export function ChatConsole() {
  const supabase = useMemo(() => createClient(), []);
  const [sessions, setSessions] = useState<Record<string, SessionState>>({});
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>("default");

  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());
  const activeRef = useRef<string | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    // One-time read of an external (browser) API on mount; intentionally syncs into state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (typeof Notification !== "undefined") setNotifPerm(Notification.permission);
  }, []);

  useEffect(() => {
    const channels = channelsRef.current;

    const ensureSession = (meta: VisitorPresence) => {
      if (channels.has(meta.sessionId)) return;
      const ch = supabase.channel(messageChannel(meta.sessionId), {
        config: { broadcast: { self: false } },
      });
      ch.on("broadcast", { event: EVENTS.msg }, ({ payload }) => {
        const m = payload as MsgEvent;
        if (m.from !== "visitor") return;
        ch.send({ type: "broadcast", event: EVENTS.ack, payload: { id: m.id } satisfies AckEvent });
        const viewing = activeRef.current === meta.sessionId && !document.hidden;
        setSessions((prev) => {
          const s = prev[meta.sessionId];
          if (!s || s.messages.some((x) => x.id === m.id)) return prev; // dedupe resends
          return {
            ...prev,
            [meta.sessionId]: {
              ...s,
              messages: [...s.messages, { id: m.id, from: "visitor", text: m.text, ts: m.ts }],
              unread: viewing ? 0 : s.unread + 1,
            },
          };
        });
        if (!viewing) {
          ping();
          maybeNotify(m.text);
        }
      });
      ch.subscribe();
      channels.set(meta.sessionId, ch);
      setSessions((prev) =>
        prev[meta.sessionId]
          ? prev
          : {
              ...prev,
              [meta.sessionId]: {
                sessionId: meta.sessionId,
                page: meta.page,
                startedAt: meta.startedAt,
                online: true,
                messages: [],
                unread: 0,
              },
            }
      );
    };

    const presence = supabase.channel(PRESENCE_CHANNEL, {
      config: { presence: { key: "operator" } },
    });
    presence
      .on("presence", { event: "sync" }, () => {
        const state = presence.presenceState<VisitorPresence | OperatorPresence>();
        const present = new Set<string>();
        Object.values(state)
          .flat()
          .forEach((p) => {
            if (p.role === "visitor") {
              present.add(p.sessionId);
              ensureSession(p);
            }
          });
        setSessions((prev) => {
          const next: Record<string, SessionState> = {};
          for (const [id, s] of Object.entries(prev)) next[id] = { ...s, online: present.has(id) };
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await presence.track({ role: "operator" } satisfies OperatorPresence);
      });

    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      channels.forEach((ch) => supabase.removeChannel(ch));
      channels.clear();
      supabase.removeChannel(presence);
    };
  }, [supabase]);

  const selectSession = useCallback((id: string) => {
    setActive(id);
    setDraft("");
    setSessions((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], unread: 0 } } : prev));
  }, []);

  const onDraftChange = useCallback(
    (v: string) => {
      setDraft(v);
      const ch = activeRef.current ? channelsRef.current.get(activeRef.current) : null;
      if (!ch) return;
      ch.send({ type: "broadcast", event: EVENTS.typing, payload: { from: "callum", typing: true } satisfies TypingEvent });
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        ch.send({ type: "broadcast", event: EVENTS.typing, payload: { from: "callum", typing: false } satisfies TypingEvent });
      }, 1500);
    },
    []
  );

  const reply = useCallback(() => {
    const text = draft.trim();
    const id = activeRef.current;
    if (!text || !id) return;
    const ch = channelsRef.current.get(id);
    if (!ch) return;
    const m: ChatMessage = { id: newId(), from: "callum", text, ts: Date.now() };
    ch.send({ type: "broadcast", event: EVENTS.msg, payload: { id: m.id, from: "callum", text, ts: m.ts } satisfies MsgEvent });
    ch.send({ type: "broadcast", event: EVENTS.typing, payload: { from: "callum", typing: false } satisfies TypingEvent });
    setSessions((prev) => ({ ...prev, [id]: { ...prev[id], messages: [...prev[id].messages, m] } }));
    setDraft("");
  }, [draft]);

  const list = Object.values(sessions).sort((a, b) => {
    if (a.online !== b.online) return a.online ? -1 : 1;
    const at = a.messages.at(-1)?.ts ?? a.startedAt;
    const bt = b.messages.at(-1)?.ts ?? b.startedAt;
    return bt - at;
  });
  const activeSession = active ? sessions[active] : null;
  const liveCount = list.filter((s) => s.online).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 border border-border bg-ink-700/40 px-4 py-3">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-ember pulse-dot" aria-hidden />
          {liveCount} live · {list.length} total
        </p>
        {notifPerm !== "granted" && (
          <button
            onClick={() => Notification.requestPermission().then(setNotifPerm)}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 transition-colors hover:text-ember"
          >
            Enable notifications ↗
          </button>
        )}
      </div>

      <div className="grid min-h-[28rem] grid-cols-12 gap-4">
        {/* Session list */}
        <div className="col-span-12 space-y-2 md:col-span-4">
          {list.length === 0 && (
            <p className="border border-border bg-ink-700/40 p-4 text-sm text-bone-400">
              No visitors yet. Keep this tab open — anyone who opens the chat shows up here.
            </p>
          )}
          {list.map((s) => {
            const last = s.messages.at(-1);
            return (
              <button
                key={s.sessionId}
                onClick={() => selectSession(s.sessionId)}
                className={cn(
                  "block w-full border border-border bg-ink-700/40 p-3 text-left transition-colors hover:border-ember/50",
                  active === s.sessionId && "border-ember/60 bg-ink-600"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-mono text-xs text-bone-50">
                    <span
                      className={cn("size-1.5 rounded-full", s.online ? "bg-ember" : "bg-bone-600")}
                      aria-hidden
                    />
                    {shortId(s.sessionId)}
                  </span>
                  {s.unread > 0 && (
                    <span className="bg-ember px-1.5 font-mono text-[10px] text-ink-900">{s.unread}</span>
                  )}
                </div>
                <p className="mt-1 truncate font-mono text-[10px] text-bone-600">{s.page}</p>
                {last && <p className="mt-1 truncate text-xs text-bone-400">{last.text}</p>}
              </button>
            );
          })}
        </div>

        {/* Active conversation */}
        <div className="col-span-12 flex min-h-[28rem] flex-col border border-border bg-ink-700/40 md:col-span-8">
          {!activeSession ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-bone-600">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="border-b border-border/60 px-4 py-3">
                <p className="font-mono text-xs text-bone-50">
                  {shortId(activeSession.sessionId)}
                  <span className="ml-2 text-bone-600">{activeSession.online ? "online" : "left"}</span>
                </p>
                <p className="font-mono text-[10px] text-bone-600">on {activeSession.page}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {activeSession.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.from === "callum" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] px-3 py-2 text-sm leading-relaxed",
                        m.from === "callum"
                          ? "border border-ember/30 bg-ember/5 text-bone-50"
                          : "border border-border bg-ink-600 text-bone-100"
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 px-4 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    reply();
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        reply();
                      }
                    }}
                    rows={1}
                    placeholder="Reply as Callum…"
                    disabled={!activeSession.online}
                    className="max-h-24 flex-1 resize-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-bone-50 placeholder:text-bone-600 focus:border-ember focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || !activeSession.online}
                    className="shrink-0 bg-ember px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-bone-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
                {!activeSession.online && (
                  <p className="mt-2 font-mono text-[10px] text-bone-600">visitor has left — replies won&apos;t reach them</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
