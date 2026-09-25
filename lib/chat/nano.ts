/**
 * callum-nano: the budget model that covers when the human is away. Pure and
 * local, no network. Replaces the terminal-era autoresponder copy.
 */

const RULES: [RegExp, string][] = [
  [/human|real|robot|\bbot\b|\bai\b|person|alive/i, "Callum is. I'm callum-nano, a budget model of him. Easy way to tell us apart: he sleeps, I don't."],
  [/role|job|hir|work with|available|opportunit|contract|freelance/i, "Roles are above my pay grade, which is zero. Switch to Callum 1.0 up top, or email him. He reads everything."],
  [/build|working on|project/i, "Right now: the quality and safety platform at RJE Global, plus whatever side project he started last night. There's always one."],
  [/coffee|melbourne|meet|catch up|drink/i, "He's in Melbourne and he drinks coffee, so the odds are good. I can only confirm that coffee exists. Callum 1.0 can confirm a time."],
  [/\b(hi|hey|hello|yo|g'?day|sup)\b/i, "Hi, you've reached callum-nano, the budget model. The premium one (Callum) is a switch away, up top."],
];

const GENERIC = [
  "I've read your message carefully and have no idea. Saving that thought for the good model.",
  "I only have two brain cells and they're both load-bearing. The human would do better here.",
  "Noted. The real Callum is better at this than me. Low bar, but still.",
];

let turn = 0;

export function nanoReply(text: string): string {
  const hit = RULES.find(([re]) => re.test(text));
  return hit ? hit[1] : GENERIC[turn++ % GENERIC.length];
}

export const NANO_SKETCH_REPLY = "Nice sketch. I'd rate it, but I'm a language model and I don't have eyes.";
