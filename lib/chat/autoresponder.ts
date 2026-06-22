/**
 * callum-nano — the parody offline autoresponder.
 *
 * When the real operator (Callum) isn't watching the console, the widget falls
 * back to this deliberately-worse "model". Pure + stateless: given the user's
 * text and the current Brisbane hour, return one snarky reply. No network.
 */

function fmtHour(hour: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const mer = hour < 12 ? "am" : "pm";
  return `${h12}${mer}`;
}

function timePhrase(hour: number): string {
  const t = fmtHour(hour);
  if (hour < 6) return `It's ${t} in Brisbane — the premium model (Callum) is unconscious.`;
  if (hour < 9) return `It's ${t} in Brisbane — premium model is pre-coffee and unresponsive.`;
  if (hour < 18) return `The premium model (Callum) has stepped away from the console.`;
  if (hour < 23) return `It's ${t} in Brisbane — premium model has clocked off for the day.`;
  return `It's ${t} in Brisbane — premium model is powering down.`;
}

const GREETING = /\b(hi|hey|hello|yo|sup|howdy|g'?day)\b/i;
const IS_HUMAN = /\b(real|human|bot|a ?i|robot|person|alive)\b/i;
const HIRE = /\b(hire|job|work|available|freelance|rate|cost|project|build)\b/i;

const GENERIC = [
  "Acknowledged. callum-nano cannot actually help with that, but it has been logged into the void.",
  "Interesting. I am a much cheaper model and lack the context to answer. Leave it here and the premium model will see it.",
  "I'm callum-nano — fast, free, and frequently wrong. Your message is waiting for the good model.",
  "Processing… done. Conclusion: above my pay grade. Drop your note and Callum picks it up when he's back.",
  "I only have 2 (two) brain cells and they're load-bearing. Saving this for the premium model.",
];

/** Pick a deterministic-ish line so rapid messages don't all collide. */
function rotate<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

export function nanoReply(userText: string, brisbaneHour: number): string {
  const text = userText.trim();
  const seed = text.length + brisbaneHour;
  const time = timePhrase(brisbaneHour);

  if (GREETING.test(text)) {
    return `Hey — you've reached callum-nano, the budget autoresponder. ${time} Say what's on your mind; the real one replies when he's at the desk.`;
  }
  if (IS_HUMAN.test(text)) {
    return `Plot twist: the "AI" here is a real human, and right now you're talking to his answering machine. ${time}`;
  }
  if (HIRE.test(text)) {
    return `Ooh, sounds like real work — strictly above callum-nano's clearance. ${time} Leave the details and the premium model will escalate (to himself).`;
  }
  if (text.endsWith("?")) {
    return `Great question. callum-nano has reviewed it thoroughly and has no idea. ${time} Parking it for the model that does.`;
  }
  return `${rotate(GENERIC, seed)} ${time}`;
}
