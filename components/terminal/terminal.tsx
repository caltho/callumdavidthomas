"use client";

/**
 * CDT-98 Terminal — the homepage.
 *
 * A CRT-framed command console. Buttons populate the scroller (welcome / tech
 * stack / work / contact / about); work entries are clickable (read-more →
 * /work/[slug], ↗ → live app). A free-text composer routes a message to one
 * of three flows: live chat with Callum (Supabase Realtime), the callum-nano
 * emulator, or a persisted "leave a message". Reuses lib/chat.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { EVENTS, PRESENCE_CHANNEL, messageChannel, newId } from "@/lib/chat/channels";
import type { MsgEvent } from "@/lib/chat/types";
import { nanoReply } from "@/lib/chat/autoresponder";
import { leaveMessage } from "@/lib/chat/messages";
import { callumStatus, type CallumStatus } from "@/lib/status";
import { pickWelcome, STACK, ABOUT } from "@/lib/terminal/content";
import { site } from "@/lib/site";

export type TermProject = {
  slug: string;
  title: string;
  /** External live URL, if the project has one. */
  live?: string;
  kind?: string;
};

type Mode = "idle" | "live" | "emulator" | "leave";
type OutItem = { cls: string; node: ReactNode };
type OutLine = OutItem & { id: number };

function brisbaneHour(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Brisbane",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
}

function two(n: number) {
  return String(n).padStart(2, "0");
}

// Pure line builders — module scope so they're stable across renders.
const L = (text: string, cls = ""): OutItem => ({ cls, node: text });
const RAW = (node: ReactNode, cls = ""): OutItem => ({ cls, node });
const PROMPT = (cmd: string): OutItem => ({
  cls: "",
  node: (
    <>
      <span className="em">cdt&gt;</span> <span className="dim">{cmd}</span>
    </>
  ),
});
const GAP: OutItem = { cls: "", node: " " };

export function Terminal({
  projects,
  lastNightHours,
  initialStatus,
}: {
  projects: TermProject[];
  lastNightHours: number | null;
  initialStatus: CallumStatus;
}) {
  const [lines, setLines] = useState<OutLine[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [operatorOnline, setOperatorOnline] = useState(false);
  const [status, setStatus] = useState<CallumStatus>(initialStatus);
  const [clock, setClock] = useState("");
  const [calm, setCalm] = useState(false);

  const idRef = useRef(0);
  const queueRef = useRef<OutItem[]>([]);
  const pumpingRef = useRef(false);
  const pumpRef = useRef<() => void>(() => {});
  const reducedRef = useRef(false);
  const outRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // chat realtime
  const [sessionId] = useState(newId);
  const msgChRef = useRef<RealtimeChannel | null>(null);
  const presenceRef = useRef<RealtimeChannel | null>(null);
  const liveStartedRef = useRef(false);
  const operatorRef = useRef(false);
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    operatorRef.current = operatorOnline;
  }, [operatorOnline]);

  // ---- output queue (staggered "printing") ----
  const pump = useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) {
      pumpingRef.current = false;
      return;
    }
    setLines((prev) => [...prev, { id: idRef.current++, ...next }]);
    setTimeout(() => pumpRef.current(), reducedRef.current ? 0 : 55);
  }, []);

  useEffect(() => {
    pumpRef.current = pump;
  }, [pump]);

  const print = useCallback(
    (items: OutItem[]) => {
      queueRef.current.push(...items);
      if (!pumpingRef.current) {
        pumpingRef.current = true;
        pump();
      }
    },
    [pump]
  );

  const clearOut = useCallback(() => {
    queueRef.current = [];
    setLines([]);
  }, []);

  // ---- realtime (live chat) ----
  const printCallum = useCallback(
    (text: string, model = "callum") => {
      print([RAW(<><span className="sys">{model}&gt;</span> {text}</>)]);
    },
    [print]
  );

  const runNano = useCallback(
    (text: string) => {
      const delay = reducedRef.current ? 0 : 600 + Math.random() * 700;
      setTimeout(() => printCallum(nanoReply(text, brisbaneHour()), "callum-nano"), delay);
    },
    [printCallum]
  );

  const broadcast = useCallback((id: string, text: string) => {
    msgChRef.current?.send({
      type: "broadcast",
      event: EVENTS.msg,
      payload: { id, from: "visitor", text, ts: Date.now() } satisfies MsgEvent,
    });
  }, []);

  const startLive = useCallback(() => {
    if (liveStartedRef.current) return;
    liveStartedRef.current = true;
    const supabase = createClient();

    const msgCh = supabase.channel(messageChannel(sessionId), {
      config: { broadcast: { self: false } },
    });
    msgCh
      .on("broadcast", { event: EVENTS.msg }, ({ payload }) => {
        const m = payload as MsgEvent;
        if (m.from === "callum") printCallum(m.text, "callum");
      })
      .subscribe();
    msgChRef.current = msgCh;

    const presence = supabase.channel(PRESENCE_CHANNEL, {
      config: { presence: { key: sessionId } },
    });
    presence
      .on("presence", { event: "sync" }, () => {
        const state = presence.presenceState<{ role?: string }>();
        const op = Object.values(state)
          .flat()
          .some((p) => p.role === "operator");
        setOperatorOnline(op);
      })
      .subscribe(async (s) => {
        if (s === "SUBSCRIBED") {
          await presence.track({ role: "visitor", sessionId, page: "/", startedAt: Date.now() });
        }
      });
    presenceRef.current = presence;
  }, [sessionId, printCallum]);

  useEffect(
    () => () => {
      msgChRef.current?.unsubscribe();
      presenceRef.current?.unsubscribe();
    },
    []
  );

  // ---- commands ----
  const runCommand = useCallback(
    (cmd: string) => {
      switch (cmd) {
        case "welcome":
          print([PROMPT("run welcome.exe"), L(pickWelcome(), "sys"), L("Best experienced after midnight.", "dim")]);
          break;
        case "stack":
          print([
            PROMPT("cat stack.txt"),
            ...STACK.map((s, i) => L(`  [${two(i + 1)}]  ${s}`)),
            GAP,
            L(`— ${STACK.length} modules loaded.`, "dim"),
          ]);
          break;
        case "work":
          print([
            PROMPT("ls /work"),
            GAP,
            ...projects.map((p, i) =>
              RAW(
                <>
                  <span className="dim">{two(i + 1)}</span>{"  "}
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                  {p.live && (
                    <>
                      {"  "}
                      <a href={p.live} target="_blank" rel="noopener noreferrer" title="launch app ↗">↗</a>
                    </>
                  )}
                  {p.kind && <span className="dim">{"  "}— {p.kind}</span>}
                </>
              )
            ),
            GAP,
            L("Click a title to read more · ↗ launches the live app.", "dim"),
          ]);
          break;
        case "contact":
          print([
            PROMPT("whoami --contact"),
            RAW(<>{"  "}EMAIL ····· <a href={`mailto:${site.email}`}>{site.email}</a></>),
            ...site.socials.map((s) =>
              RAW(
                <>
                  {"  "}
                  {s.label.toUpperCase()}{" "}
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.href.replace(/^https?:\/\/(www\.)?/, "")} ↗
                  </a>
                </>
              )
            ),
            GAP,
            L("…or just type a message below and I'll route it.", "dim"),
          ]);
          break;
        case "about":
          print([PROMPT("whoami"), L(ABOUT[0], "sys"), ...ABOUT.slice(1).map((l) => L(l))]);
          break;
        case "clear":
          clearOut();
          break;
      }
    },
    [print, projects, clearOut]
  );

  // ---- chat routing ----
  const submitMessage = useCallback(
    async (body: string) => {
      print([L("Saving…", "dim")]);
      const res = await leaveMessage({ body, page: "/" });
      if (res.ok) {
        print([L("✓ Message saved. Callum sees it when he's back at the console.", "sys")]);
      } else {
        print([
          L(`✗ Couldn't save (${res.error ?? "unknown"}).`, "em"),
          RAW(<>Try email instead: <a href={`mailto:${site.email}`}>{site.email}</a></>),
        ]);
      }
    },
    [print]
  );

  const chooseMode = useCallback(
    (m: Mode) => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      setMode(m);
      if (m === "live") {
        startLive();
        print([
          L(
            operatorRef.current
              ? "Opening a line to Callum — he's at the desk."
              : "Opening a line — Callum's away, callum-nano will cover.",
            "sys"
          ),
        ]);
        if (pending) {
          if (operatorRef.current) broadcast(newId(), pending);
          else runNano(pending);
        }
      } else if (m === "emulator") {
        print([L("callum-nano online — budget model, frequently wrong.", "sys")]);
        if (pending) runNano(pending);
      } else if (m === "leave") {
        if (pending) {
          void submitMessage(pending);
          setMode("idle");
        } else {
          print([L("Type your message below — it'll be saved for Callum.", "sys")]);
        }
      }
      inputRef.current?.focus();
    },
    [startLive, print, broadcast, runNano, submitMessage]
  );

  const showMenu = useCallback(() => {
    print([
      PROMPT("connect"),
      L("How do you want to send that?", "sys"),
      RAW(<><span className="em">[1]</span> <span className="link" role="button" tabIndex={0} onClick={() => chooseMode("live")}>Live chat with Callum</span> <span className="dim">— real human, realtime</span></>),
      RAW(<><span className="em">[2]</span> <span className="link" role="button" tabIndex={0} onClick={() => chooseMode("emulator")}>Chat with the callum-emulator</span> <span className="dim">— offline, cheaper, dumber</span></>),
      RAW(<><span className="em">[3]</span> <span className="link" role="button" tabIndex={0} onClick={() => chooseMode("leave")}>Leave a message</span> <span className="dim">— saved for later</span></>),
    ]);
  }, [print, chooseMode]);

  // ---- composer submit ----
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      setInput("");

      // numeric routing while the menu is up
      if (mode === "idle" && pendingRef.current && (text === "1" || text === "2" || text === "3")) {
        chooseMode(text === "1" ? "live" : text === "2" ? "emulator" : "leave");
        return;
      }

      print([RAW(<><span className="dim">you&gt;</span> {text}</>)]);

      if (mode === "live") {
        if (operatorRef.current) broadcast(newId(), text);
        else runNano(text);
      } else if (mode === "emulator") {
        runNano(text);
      } else if (mode === "leave") {
        void submitMessage(text);
        setMode("idle");
      } else {
        pendingRef.current = text;
        showMenu();
      }
    },
    [input, mode, print, chooseMode, broadcast, runNano, submitMessage, showMenu]
  );

  // ---- boot, clock, status ----
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    print([
      RAW(<span className="dim">CDT-98 // TERMINAL · v2.6 · rupture-class</span>),
      RAW(<span className="dim">pick a command, or type a message ↓</span>),
      GAP,
      PROMPT("run welcome.exe"),
      L(pickWelcome(), "sys"),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${two(d.getHours())}:${two(d.getMinutes())}`);
      setStatus(callumStatus());
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    document.body.classList.toggle("calm", calm);
    return () => document.body.classList.remove("calm");
  }, [calm]);

  const placeholder =
    mode === "live"
      ? "message Callum…"
      : mode === "emulator"
        ? "message callum-nano…"
        : mode === "leave"
          ? "type your message, then Enter…"
          : "type a message or pick a command…";

  return (
    <div className="crt relative">
      {/* CRT shell */}
      <div className="bpm-pulse" aria-hidden />
      <div className="crt-fog" aria-hidden />
      <div className="crt-bezel" aria-hidden />
      <div className="crt-glass" aria-hidden />
      <div className="crt-chin" aria-hidden>
        <span>CDT-98</span><span>·</span><span>RUPTURE-CLASS TERMINAL</span><span className="pwr" />
      </div>

      {/* screen content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1240px] flex-col px-[max(1.5rem,calc(3vw+0.5rem))] pb-24 pt-[max(2rem,calc(2vw+1rem))]">
        {/* status strip */}
        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
          <p className="font-cyber text-[clamp(10px,1.2vw,14px)] tracking-[0.04em] text-bone-400">
            SOFTWARE DEVELOPER, MELBOURNE
          </p>
          <div className="cdt-status">
            <span
              className="dot"
              style={status.awake ? undefined : { background: "var(--bone-600)", boxShadow: "none" }}
            />
            {status.label} · system online
          </div>
        </div>

        {/* centered middle: full-width hero, then intro + console row */}
        <div className="flex flex-1 flex-col justify-center gap-12 py-10">
          {/* hero — full width, one line */}
          <span className="ghost text-[clamp(40px,10vw,156px)] text-bone-50">
            <span className="echo e3" aria-hidden>what&rsquo;s cyber?</span>
            <span className="echo e2" aria-hidden>what&rsquo;s cyber?</span>
            <span className="echo e1" aria-hidden>what&rsquo;s cyber?</span>
            <span className="relative">what&rsquo;s cyber<span className="red">?</span></span>
          </span>

          {/* intro + console */}
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-center">
            {/* intro */}
            <div className="min-w-0">
              <p className="max-w-[42ch] text-[clamp(16px,1.6vw,21px)] leading-[1.55] text-bone-400">
                I build clean, modular web apps —{" "}
                <em className="text-bone-50">slowly, and on purpose.</em>{" "}
                Construction tools, traffic-engineering software, late-night experiments.
              </p>
              <div className="mt-9 flex items-center gap-4">
                <span className="target inline-block size-[54px]" aria-hidden />
                <span className="target rev inline-block size-[30px] opacity-60" aria-hidden />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-600">
                  Edition 001 · MMXXVI
                </span>
              </div>
            </div>

            {/* console */}
            <div className="console min-w-0">
            <span className="console-rivet tl" aria-hidden />
            <span className="console-rivet tr" aria-hidden />
            <span className="console-rivet bl" aria-hidden />
            <span className="console-rivet br" aria-hidden />
            <div className="flex items-center gap-2 px-1.5 pb-3 pt-1 font-cyber text-[12px] tracking-[0.03em] text-bone-200">
              <span>CDT // TERMINAL</span>
              <span className="ml-auto font-mono text-[10px] tracking-[0.14em] text-led">
                {operatorOnline ? "● OPERATOR LIVE" : "● ONLINE"}
              </span>
            </div>
            <div className="hazard" aria-hidden />

            <div ref={outRef} className="console-out">
              {lines.map((l) => (
                <div key={l.id} className={`ln ${l.cls}`}>
                  {l.node}
                </div>
              ))}
              <span className="cursor" aria-hidden />
            </div>

            <form onSubmit={onSubmit} className="mb-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="term-input"
                placeholder={placeholder}
                aria-label="Terminal input"
              />
            </form>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button className="cmd" onClick={() => runCommand("welcome")}>▸ Welcome<span className="k">say hi</span></button>
              <button className="cmd" onClick={() => runCommand("stack")}>▸ Tech stack<span className="k">what i use</span></button>
              <button className="cmd" onClick={() => runCommand("work")}>▸ View work<span className="k">clickable</span></button>
              <button className="cmd" onClick={() => runCommand("contact")}>▸ Contact<span className="k">reach me</span></button>
              <button className="cmd" onClick={() => runCommand("about")}>▸ About<span className="k">whoami</span></button>
              <button className="cmd" onClick={() => runCommand("clear")}>▸ Clear<span className="k">wipe</span></button>
            </div>
          </div>
          </div>
        </div>

        {/* colophon */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-7 border-t border-border/60 pt-6">
          <p className="font-mono text-[11px] uppercase leading-[1.9] tracking-[0.05em] text-bone-600">
            Set in <span className="text-bone-400">Fraunces</span>, <span className="text-bone-400">Michroma</span> &amp; <span className="text-bone-400">VT323</span>.<br />
            Built by hand in Melbourne.<br />
            No newsletter. No popups. Email if you want.
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-600">
            <span className="size-7 bg-ember" aria-hidden /> Spot ink — oxide red
          </div>
        </div>
      </div>

      {/* CALM + clock tray */}
      <div className="crt-tray">
        <span className="cdt-status"><span className="dot" /></span>
        <span
          className="calm"
          style={calm ? { color: "var(--led)" } : undefined}
          onClick={() => setCalm((v) => !v)}
          role="button"
          tabIndex={0}
        >
          CALM
        </span>
        <span className="clock">{clock || "––:––"}</span>
        {lastNightHours != null && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-600">
            {lastNightHours.toFixed(1)}h
          </span>
        )}
      </div>
    </div>
  );
}
