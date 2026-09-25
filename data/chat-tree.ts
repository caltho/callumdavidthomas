/**
 * Suggested questions for Ask Callum, with answers written in advance.
 * Three starters, each with three follow-ups, each with three more (39 in all).
 * Edit freely: the chat walks whatever shape this is.
 */

export type ChatNode = { q: string; a: string; next?: ChatNode[] };

export const CHAT_TREE: ChatNode[] = [
  {
    q: "Are you open to new roles?",
    a: "I'm lead developer at RJE Global and I like it there, but I'm always up for a conversation about interesting work. Especially anything where software meets the physical world: construction, transport, the stuff people actually use.",
    next: [
      {
        q: "What kind of work suits you best?",
        a: "Owning a product end to end. At RJE I'm the developer and the product owner, so I talk to the people using it, decide what's worth building, then build it. I'm happiest doing both halves.",
        next: [
          {
            q: "Front end or back end?",
            a: "Both. TypeScript all the way down: React or Svelte up front, Node and Postgres behind. I lean front end, because that's where people feel the difference.",
          },
          {
            q: "Do you work with AI tools?",
            a: "Every day. Claude writes a lot of my first drafts, and it helped build this site. My job is knowing what to ask for, and noticing when the answer is confidently wrong.",
          },
          {
            q: "Remote or in the office?",
            a: "I'm in Melbourne, and an Australian citizen now, so no visa paperwork required. Tell me what you have in mind and I'll tell you if it fits.",
          },
        ],
      },
      {
        q: "Why did you leave traffic engineering?",
        a: "I didn't really leave it, I changed tools. I kept writing scripts and building little apps to speed up my own work, until the software became the part I cared about most.",
        next: [
          {
            q: "Do you miss it?",
            a: "The site visits, yes. The council meetings, less so. I still build free calculators for traffic engineers, so I haven't fully escaped.",
          },
          {
            q: "Does engineering help with coding?",
            a: "Constantly. Engineering teaches you to check your assumptions and design for the worst day, not the average one. That's most of good software too.",
          },
          {
            q: "What's Traffic Tools?",
            a: "Free calculators for traffic engineers and town planners: parking rates, ramp design, turn treatments, trip generation. The tools I wished I'd had. It's live, so go and try it.",
          },
        ],
      },
      {
        q: "How do I get in touch?",
        a: "Right here works: switch to Callum 1.0 at the top and send a message. Or email callumdavidthomas@gmail.com. I read everything, and I usually reply within a day.",
        next: [
          {
            q: "Can I see your CV?",
            a: "You're looking at it. The CV section on this page has the short version, and LinkedIn has the long one.",
          },
          {
            q: "Do you do freelance work?",
            a: "I've built client sites before, like NZOPA and Modal Group. These days it depends on the project and the timing, so tell me about yours.",
          },
          {
            q: "What's the best way to pitch me something?",
            a: "Tell me the problem, not the solution. If there's something annoying that people put up with every day, I'm interested.",
          },
        ],
      },
    ],
  },
  {
    q: "What are you building right now?",
    a: "By day, the quality and safety platform at RJE Global, used on live construction sites. By night, whatever side project I started last night. There's always one.",
    next: [
      {
        q: "Tell me about the RJE platform.",
        a: "Site staff use it to capture quality and safety data on active construction sites, instead of on paper. I took over the legacy app and rebuilt it front to back: JavaScript to TypeScript, modular, and much faster.",
        next: [
          {
            q: "What's the stack?",
            a: "Angular up front, Node and MySQL behind, all TypeScript now. It's a different world from my side projects, which keeps me honest.",
          },
          {
            q: "What was hardest about the rebuild?",
            a: "Rebuilding it while people relied on it every day. It had to change underneath them without anyone noticing, apart from it getting faster.",
          },
          {
            q: "Who uses it?",
            a: "People on active construction sites, recording quality and safety checks as they go. So it has to be quick, and hard to get wrong.",
          },
        ],
      },
      {
        q: "What side projects are you working on?",
        a: "Almanac, which runs my life: journal, habits, money, sleep. Boatlog, for days on the boat. And What's Cyber Terminal, this site's old homepage, kept running as a museum piece.",
        next: [
          {
            q: "What's Almanac?",
            a: "My personal life-tracking app. Journal, habits, tasks, recipes, money and sleep, all in one searchable place. I use it every day. It's SvelteKit and Supabase.",
          },
          {
            q: "Why a boat logbook?",
            a: "Because the paper one on the chart table kept getting damp. Boatlog tracks distance, weather, fuel and crew, one-handed, on a phone. Every entry says windy.",
          },
          {
            q: "What was What's Cyber?",
            a: "This site's previous homepage: a CRT terminal you had to type commands into. Fun, but too much work just to find my projects. It lives on at whats-cyber.callum-thomas.com.",
          },
        ],
      },
      {
        q: "How did you build this site?",
        a: "Next.js and Supabase, drawn as an engineering sheet on warm paper. I built it with Claude as a very fast colleague: I decided what it should be, and it did a lot of the typing.",
        next: [
          {
            q: "Why the drawing-sheet look?",
            a: "Eight years of reading engineering drawings leaves a mark. Title blocks, revision letters and stamps felt more like me than another dark portfolio.",
          },
          {
            q: "How does the name animation work?",
            a: "Your cursor pushes the dots and they spring back. Stir it for long enough and it gets tired: the springs go soft and some dots never find their way home. Try it.",
          },
          {
            q: "Is this chat real?",
            a: "Yes. When I'm at my desk, Callum 1.0 is me, typing live. When I'm not, your message is saved and I reply later. These suggested answers I wrote in advance.",
          },
        ],
      },
    ],
  },
  {
    q: "Are you actually human?",
    a: "Last time I checked. I sleep, I get sunburnt, and I lose at jiu-jitsu. No language model has done all three.",
    next: [
      {
        q: "Prove it.",
        a: "I climbed a 5,130 m mountain in Kyrgyzstan for fun, and became an Australian citizen in a gold jacket. A model would have picked something sensible to wear.",
        next: [
          {
            q: "Tell me about the mountain.",
            a: "Yukhin Peak, in the Alay Mountains. Two weeks acclimatising, one awful night at base camp, then a summit day so sunny I wore a t-shirt. The write-up's under Proof of humanity.",
          },
          {
            q: "Why the gold jacket?",
            a: "If you're only going to become a citizen once, you should dress like it.",
          },
          {
            q: "What else can't a robot do?",
            a: "Tap out at jiu-jitsu and say thanks afterwards. Keep a plant alive (jury's still out). Worry about whether a website is too much.",
          },
        ],
      },
      {
        q: "So what's callum-nano?",
        a: "My budget model. Instant, free, and frequently wrong. It covers while I'm asleep, which is about a third of the time.",
        next: [
          {
            q: "Is callum-nano an AI?",
            a: "Barely. It's a handful of canned lines and a lot of confidence. Think answering machine, with opinions.",
          },
          {
            q: "Who's smarter, you or nano?",
            a: "Me, on most days. Nano does reply faster, and it never needs a coffee first.",
          },
          {
            q: "Can I talk to it?",
            a: "Pick callum-nano from the menu at the top of this chat. Be gentle, it only has two brain cells.",
          },
        ],
      },
      {
        q: "What do you do for fun?",
        a: "Ultralight hiking, Brazilian jiu-jitsu, days on the boat, and art: digital, and the kind with glue.",
        next: [
          {
            q: "Why jiu-jitsu?",
            a: "It's the most honest feedback loop I know. You either get out of the hold or you tap. No amount of confidence helps.",
          },
          {
            q: "Where do you hike?",
            a: "Anywhere uphill. The biggest so far was Yukhin Peak in Kyrgyzstan, at 5,130 m. Closer to home, wherever I can get to in a weekend.",
          },
          {
            q: "Coffee in Melbourne?",
            a: "Always. Send me a message with a time and a suburb, and I'll bring the opinions.",
          },
        ],
      },
    ],
  },
];
