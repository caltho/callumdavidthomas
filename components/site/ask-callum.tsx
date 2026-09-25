"use client";

/**
 * Ask Callum: dressed as an AI assistant, but "Callum 1.0" is the real human.
 *
 * - Callum at his desk (the admin chat console is open): messages go to him
 *   live over Supabase Realtime, the same protocol the console already speaks.
 * - Callum away: the message is saved to portfolio_messages, and the visitor
 *   can add an email for the reply.
 * - callum-nano: the local budget model. Instant, free, frequently wrong.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { EVENTS, PRESENCE_CHANNEL, messageChannel, newId } from "@/lib/chat/channels";
import type { AckEvent, MsgEvent, TypingEvent } from "@/lib/chat/types";
import { leaveMessage } from "@/lib/chat/messages";
import { NANO_SKETCH_REPLY, nanoReply } from "@/lib/chat/nano";
import { melbourneNow } from "@/lib/status";
import { site } from "@/lib/site";
import { CHAT_TREE, type ChatNode } from "@/data/chat-tree";

type Model = "callum" | "nano";
type Msg =
  | { id: string; kind: "me"; text?: string; img?: string }
  | { id: string; kind: "them"; who: string; think?: string; text: string; askEmail?: string }
  | { id: string; kind: "dots"; who: string; think: string };

// Flatten the question tree into ids like "0", "0.2", "0.2.1".
type Q = ChatNode & { id: string; parent: string | null };
const QUESTIONS = new Map<string, Q>();
(function index(nodes: ChatNode[], parent: string | null) {
  nodes.forEach((n, i) => {
    const id = parent === null ? String(i) : `${parent}.${i}`;
    QUESTIONS.set(id, { ...n, id, parent });
    if (n.next) index(n.next, id);
  });
})(CHAT_TREE, null);
const childrenOf = (id: string | null) => [...QUESTIONS.values()].filter((q) => q.parent === id);

/** Follow-ups for where the conversation is: its children, else what's left nearby. */
function suggestions(at: string | null, asked: Set<string>): Q[] {
  for (let level = at; ; level = QUESTIONS.get(level)?.parent ?? null) {
    const open = childrenOf(level).filter((q) => !asked.has(q.id));
    if (open.length || level === null) return open;
  }
}

function Fingerprint() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </svg>
  );
}

function greeting() {
  const h = melbourneNow().hour;
  return h < 5 ? "Hello, night owl." : h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening.";
}

export function AskCallum() {
  const [model, setModel] = useState<Model>("callum");
  const [menu, setMenu] = useState(false);
  const [atDesk, setAtDesk] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [hello] = useState(greeting);
  const [sessionId] = useState(newId);
  const [at, setAt] = useState<string | null>(null);
  const [asked, setAsked] = useState<Set<string>>(() => new Set());

  const body = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const supa = useRef<ReturnType<typeof createClient> | null>(null);
  const presence = useRef<RealtimeChannel | null>(null);
  const chan = useRef<RealtimeChannel | null>(null);
  const tracking = useRef(false);
  const pendingAcks = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const delivered = useRef(false);
  const modelRef = useRef(model);
  useEffect(() => {
    modelRef.current = model;
  }, [model]);
  useEffect(() => {
    // Braces matter: scrollTo() returns a Promise in newer browsers, and an
    // effect must not return anything but a cleanup function.
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const add = useCallback((m: Msg) => setMsgs((prev) => [...prev.filter((x) => x.kind !== "dots"), m]), []);

  // Listen for the operator on the shared presence channel.
  useEffect(() => {
    let cancelled = false;
    try {
      supa.current = createClient();
    } catch {
      return; // no Supabase configured: Callum is simply "away"
    }
    const p = supa.current.channel(PRESENCE_CHANNEL, { config: { presence: { key: sessionId } } });
    p.on("presence", { event: "sync" }, () => {
      if (cancelled) return;
      const state = p.presenceState<{ role?: string }>();
      setAtDesk(Object.values(state).flat().some((x) => x.role === "operator"));
    }).subscribe();
    presence.current = p;
    const acks = pendingAcks.current;
    return () => {
      cancelled = true;
      acks.forEach(clearTimeout);
      if (supa.current) {
        supa.current.removeChannel(p);
        if (chan.current) supa.current.removeChannel(chan.current);
      }
    };
  }, [sessionId]);

  // Open this visitor's private channel and show up in the console.
  const openLine = useCallback(async () => {
    if (!supa.current || chan.current) return;
    const ch = supa.current.channel(messageChannel(sessionId), { config: { broadcast: { self: false } } });
    ch.on("broadcast", { event: EVENTS.msg }, ({ payload }) => {
      const m = payload as MsgEvent;
      if (m.from === "callum") add({ id: m.id, kind: "them", who: "Callum 1.0", text: m.text });
    })
      .on("broadcast", { event: EVENTS.typing }, ({ payload }) => {
        const t = payload as TypingEvent;
        if (t.from !== "callum") return;
        setMsgs((prev) => {
          const rest = prev.filter((x) => x.kind !== "dots");
          return t.typing ? [...rest, { id: "dots", kind: "dots", who: "Callum 1.0", think: "Typing, with his actual fingers…" }] : rest;
        });
      })
      .on("broadcast", { event: EVENTS.ack }, ({ payload }) => {
        const a = payload as AckEvent;
        if (!pendingAcks.current.has(a.id)) return;
        clearTimeout(pendingAcks.current.get(a.id));
        pendingAcks.current.delete(a.id);
        if (!delivered.current) {
          delivered.current = true;
          add({ id: newId(), kind: "them", who: "Callum 1.0", think: "Delivered", text: "Got it. The human is reading. You'll see the dots when he's typing." });
        }
      })
      .subscribe();
    chan.current = ch;
    if (!tracking.current && presence.current) {
      tracking.current = true;
      await presence.current.track({ role: "visitor", sessionId, page: location.pathname, startedAt: Date.now() });
    }
  }, [sessionId, add]);

  // Resend until the console acks, which covers the moment it joins the
  // channel. No ack at all means nobody is really there: save it instead.
  const sendLive = useCallback(
    (id: string, body: string) => {
      let tries = 0;
      const fire = () => {
        if (tries++ >= 4) {
          pendingAcks.current.delete(id);
          void leaveMessage({ body, page: location.pathname }).then((res) =>
            add({
              id: newId(),
              kind: "them",
              who: "Callum 1.0",
              think: "Stepped away",
              text: res.ok ? "Looks like he's just stepped away, so it's saved for him instead. He'll reply within a day." : `That didn't go through. Email works: ${site.email}`,
              askEmail: res.ok ? body : undefined,
            })
          );
          return;
        }
        chan.current?.send({ type: "broadcast", event: EVENTS.msg, payload: { id, from: "visitor", text: body, ts: Date.now() } satisfies MsgEvent });
        pendingAcks.current.set(id, setTimeout(fire, 1500));
      };
      fire();
    },
    [add]
  );

  const saveEmail = async (forText: string, email: string) => {
    const res = await leaveMessage({ body: `Reply wanted for: "${forText.slice(0, 300)}"`, contact: email, page: "/" });
    return res.ok;
  };

  const send = useCallback(
    async (raw: string) => {
      const body = raw.trim();
      if (!body) return;
      add({ id: newId(), kind: "me", text: body });

      if (modelRef.current === "nano") {
        setMsgs((p) => [...p, { id: "dots", kind: "dots", who: "callum-nano", think: "" }]);
        setTimeout(() => add({ id: newId(), kind: "them", who: "callum-nano", think: "Thought for 0.4 seconds", text: nanoReply(body) }), 700);
        return;
      }

      if (atDesk) {
        await openLine();
        sendLive(newId(), body);
        setMsgs((p) => [...p, { id: "dots", kind: "dots", who: "Callum 1.0", think: "Connecting you to a human…" }]);
        return;
      }

      setMsgs((p) => [...p, { id: "dots", kind: "dots", who: "Callum 1.0", think: "Connecting you to a human…" }]);
      const res = await leaveMessage({ body, page: "/" });
      if (res.ok) {
        add({
          id: newId(),
          kind: "them",
          who: "Callum 1.0",
          think: "Thinking… (est. 4 to 24 hours)",
          text: "Delivered to the actual human. Real thinking takes a while, so expect a reply within a day.",
          askEmail: body,
        });
      } else {
        add({
          id: newId(),
          kind: "them",
          who: "Callum 1.0",
          text: `That didn't go through, which is very human of the internet. Email works: ${site.email}`,
        });
      }
    },
    [add, atDesk, openLine, sendLive]
  );

  // Suggested questions get the answer Callum wrote in advance.
  const ask = useCallback(
    (q: Q) => {
      add({ id: newId(), kind: "me", text: q.q });
      setMsgs((p) => [...p, { id: "dots", kind: "dots", who: "Callum 1.0", think: "Remembering what he wrote…" }]);
      setAsked((prev) => new Set(prev).add(q.id));
      setTimeout(() => {
        add({ id: newId(), kind: "them", who: "Callum 1.0", think: "Written in advance, by the human", text: q.a });
        setAt(q.id);
      }, 650);
    },
    [add]
  );

  // Sketches from the scratch pad land here.
  useEffect(() => {
    const onSketch = (e: Event) => {
      const img = (e as CustomEvent<string>).detail;
      add({ id: newId(), kind: "me", img });
      setTimeout(
        () =>
          add(
            modelRef.current === "nano"
              ? { id: newId(), kind: "them", who: "callum-nano", think: "Thought for 0.4 seconds", text: NANO_SKETCH_REPLY }
              : { id: newId(), kind: "them", who: "Callum 1.0", think: "Looked at it for a while", text: "Lovely. Sketches can't travel down the wire yet, so screenshot it and email it over. It's going on the fridge." }
          ),
        800
      );
    };
    window.addEventListener("ct:sketch", onSketch);
    return () => window.removeEventListener("ct:sketch", onSketch);
  }, [add]);

  useEffect(() => {
    const close = (e: MouseEvent) => picker.current && !picker.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const offline = model === "callum" && !atDesk;
  const waiting = msgs.some((m) => m.kind === "dots");
  const next = suggestions(at, asked);

  return (
    <div className="ask">
      <div className="top">
        <span className="name">
          <Fingerprint />
          Ask Callum
        </span>
        <div className={`picker${menu ? " open" : ""}`} ref={picker}>
          <button type="button" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            <span className={`dot${offline ? " is-away" : ""}`} />
            <span>{model === "callum" ? "Callum 1.0" : "callum-nano"}</span> ▾
          </button>
          <div className="menu" role="menu">
            {(
              [
                ["callum", "Callum 1.0", "The original. Human, thoughtful, replies within a day. Needs sleep."],
                ["nano", "callum-nano", "Instant, free, frequently wrong. Covers while the human sleeps."],
              ] as const
            ).map(([id, name, desc]) => (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={model === id}
                onClick={() => {
                  setModel(id);
                  setMenu(false);
                }}
              >
                <span className="tick">✓</span>
                <span>
                  <strong>{name}</strong>
                  <span className="d">{desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {offline && <p className="offline on">Callum 1.0 is away from his desk. Messages still reach him, and he&apos;ll reply within a day.</p>}
      {model === "callum" && atDesk && <p className="offline on">Callum is at his desk right now, so you&apos;ll get the actual human, live.</p>}
      <div className="ask-body" ref={body}>
        {msgs.length === 0 && (
          <div className="hello">
            <h3>
              <span suppressHydrationWarning>{hello}</span>
              <br />
              What can Callum help with?
            </h3>
          </div>
        )}
        <div className="thread" aria-live="polite">
          {msgs.map((m) =>
            m.kind === "me" ? (
              <div key={m.id} className="m me">
                <div className="who">
                  <span>You</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="txt">{m.img ? <img src={m.img} alt="Your sketch" /> : m.text}</div>
              </div>
            ) : m.kind === "dots" ? (
              <div key={m.id} className="m them">
                <div className="who">
                  <span>{m.who}</span>
                  {m.think && <span className="think">{m.think}</span>}
                </div>
                <div className="txt">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            ) : (
              <div key={m.id} className="m them">
                <div className="who">
                  <span>{m.who}</span>
                  {m.think && <span className="think">{m.think}</span>}
                </div>
                <div className="txt">
                  {m.text}
                  {m.askEmail && <EmailAsk onSave={(email) => saveEmail(m.askEmail!, email)} />}
                </div>
              </div>
            )
          )}
        </div>
        {!waiting && (next.length > 0 || at !== null) && (
          <div className="chips">
            {next.map((q) => (
              <button key={q.id} type="button" onClick={() => ask(q)}>
                {q.q}
              </button>
            ))}
            {at !== null && childrenOf(null).some((q) => !asked.has(q.id)) && !next.some((q) => q.parent === null) && (
              <button type="button" className="back" onClick={() => setAt(null)}>
                ↺ Something else
              </button>
            )}
          </div>
        )}
      </div>
      <div className="compose">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
            setText("");
          }}
        >
          <label className="sr" htmlFor="ask-q">
            Message
          </label>
          <textarea
            id="ask-q"
            rows={1}
            placeholder="Ask Callum anything…"
            value={text}
            maxLength={4000}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(text);
                setText("");
              }
            }}
          />
          <button className="send" type="submit" aria-label="Send">
            ↑
          </button>
        </form>
        <p className="fine">Callum can make mistakes. He&apos;s only human.</p>
      </div>
    </div>
  );
}

function EmailAsk({ onSave }: { onSave: (email: string) => Promise<boolean> }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  if (state === "saved")
    return (
      <p className="label" style={{ marginTop: 10, color: "var(--ink)" }}>
        ✓ Saved. He&apos;ll reply to {email}.
      </p>
    );
  return (
    <form
      className="replyto"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setState("saving");
        setState((await onSave(email.trim())) ? "saved" : "failed");
      }}
    >
      <input type="email" required placeholder={state === "failed" ? "That didn't save. Try again?" : "Where should he reply? (email)"} aria-label="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={state === "saving"}>{state === "saving" ? "Saving" : "Save"}</button>
    </form>
  );
}
