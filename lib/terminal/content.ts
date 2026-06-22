/**
 * Static content for the terminal commands. Work/projects are dynamic (passed
 * from the server page); these are the canned bits.
 */

/** Brutally generic welcome messages — picked at random on boot / WELCOME. */
export const WELCOMES = [
  "WELCOME, TRAVELLER. YOU ARE VISITOR No. 00013371.",
  "GREETINGS, USER. PLEASE ENJOY YOUR STAY.",
  "HELLO AND WELCOME TO MY HOMEPAGE.",
  "SYSTEM ONLINE. WELCOME BACK.",
  "THANK YOU FOR VISITING. TELL YOUR FRIENDS.",
  "ACCESS GRANTED. MIND THE GAP.",
  "YOU HAVE 1 (ONE) NEW FRIEND. IT IS ME.",
  "WELCOME TO THE INTERNET. PLEASE WIPE YOUR FEET.",
  "CONNECTION ESTABLISHED. DON'T GET TOO COMFORTABLE.",
];

/** The stack, hand-curated (reads better than de-duping every project tag). */
export const STACK = [
  "Next.js 16",
  "TypeScript",
  "React 19",
  "SvelteKit",
  "Supabase / Postgres",
  "Angular",
  "Node.js",
  "PHP / MySQL",
  "Tailwind v4",
  "Motion",
  "Vercel",
  "PWA",
  "Figma",
  "VBScript / VBA",
];

export const ABOUT = [
  "Callum David Thomas — software developer.",
  "I build clean, modular web apps, slowly and on purpose.",
  "Construction tools, traffic-engineering software, late-night experiments.",
  "This site boots like an old machine on purpose.",
];

export function pickWelcome(): string {
  return WELCOMES[Math.floor(Math.random() * WELCOMES.length)];
}
