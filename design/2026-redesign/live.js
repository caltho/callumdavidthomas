/**
 * The small "live" bits every route shares: Melbourne clock, a best guess at
 * what Callum is doing, sleep data (mocked here, real from Almanac later),
 * and a mock of the say-hi chat with callum-nano covering for him.
 *
 * Hooks by attribute so each route can style them however it likes:
 *   [data-clock]        "10:42 pm"
 *   [data-status]       "probably shipping something"
 *   [data-awake]        gets .is-away when he's likely asleep
 *   [data-desk]         "at his desk" / "away from the desk"
 *   form[data-chat]     + [data-thread] inside the same [data-chat-root]
 */
(function () {
  const TZ = "Australia/Melbourne";

  function melbourne() {
    const parts = new Intl.DateTimeFormat("en-AU", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      weekday: "short",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const hour = Number(get("hour")) % 24;
    const minute = Number(get("minute"));
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { hour, minute, day };
  }

  // Same buckets as lib/status.ts, in Melbourne time.
  function status({ hour, day }) {
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

  function clock({ hour, minute }) {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:${String(minute).padStart(2, "0")} ${hour < 12 ? "am" : "pm"}`;
  }

  function tick() {
    const now = melbourne();
    const s = status(now);
    document.querySelectorAll("[data-clock]").forEach((e) => (e.textContent = clock(now)));
    document.querySelectorAll("[data-status]").forEach((e) => (e.textContent = s.label));
    document.querySelectorAll("[data-awake]").forEach((e) => e.classList.toggle("is-away", !s.awake));
    // Mockup: pretend he's at the desk in the evenings.
    const desk = now.hour >= 19 && now.hour < 23;
    document.querySelectorAll("[data-desk]").forEach((e) => {
      e.textContent = desk ? "Callum's at his desk. You'll chat live." : "Callum's away. Leave a message, or chat with callum-nano.";
    });
    document.querySelectorAll("[data-desk-dot]").forEach((e) => e.classList.toggle("is-away", !desk));
  }

  // Fourteen nights, oldest first. Real version: portfolio_recent_sleep RPC.
  const sleep = [7.2, 6.4, 8.1, 5.9, 7.0, 7.6, null, 6.8, 7.9, 6.1, 7.3, 8.4, 6.6, 6.9];
  const logged = sleep.filter((h) => h != null);
  const sleepStats = {
    nights: sleep,
    last: sleep[sleep.length - 1],
    avg: logged.reduce((a, b) => a + b, 0) / logged.length,
    logged: logged.length,
  };

  const NANO = [
    "Hi, you've reached callum-nano, the budget model. The premium one (Callum) will see this when he's back.",
    "callum-nano has read your message carefully and has no idea. Saving it for the good model.",
    "That sounds like real work, which is above my pay grade. Callum replies to these himself, usually within a day.",
    "I only have two brain cells and they're both load-bearing. Your note is safe with the human.",
    "Logged. The real Callum is better at this than me. Low bar, but still.",
  ];

  function wireChat(root) {
    const form = root.querySelector("form[data-chat]");
    const thread = root.querySelector("[data-thread]");
    if (!form || !thread) return;
    let n = 0;
    const add = (who, text, cls) => {
      const row = document.createElement("div");
      row.className = `msg ${cls}`;
      row.innerHTML = `<span class="who"></span><span class="txt"></span>`;
      row.querySelector(".who").textContent = who;
      row.querySelector(".txt").textContent = text;
      thread.appendChild(row);
      thread.scrollTop = thread.scrollHeight;
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("textarea, input");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      add("You", text, "me");
      setTimeout(() => add("callum-nano", NANO[n++ % NANO.length], "them"), 700);
    });
  }

  window.CT = { melbourne, status, clock, sleep: sleepStats };

  document.addEventListener("DOMContentLoaded", () => {
    // Screenshot mode (see particles.js) hides the mockup's own navigation.
    if (/[?&](still|poke|intro)/.test(location.search)) {
      document.querySelectorAll(".mock").forEach((e) => e.remove());
      document.documentElement.classList.add("still");
    }
    tick();
    setInterval(tick, 20000);
    document.querySelectorAll("[data-chat-root]").forEach(wireChat);
  });
})();
