# callum-thomas.com

Personal portfolio of Callum Thomas. A person. Drawn as an engineering sheet on warm paper, with a few things to fiddle with. Content comes from Supabase, with a custom admin panel.

## Stack

| Concern        | Tool                                        |
|----------------|---------------------------------------------|
| Framework      | Next.js 16 (App Router, RSC, Turbopack)     |
| Language       | TypeScript                                  |
| Styling        | Tailwind CSS v4 (CSS-first design tokens)   |
| Motion         | Motion (formerly framer-motion)             |
| Type display   | Fraunces (variable: opsz, SOFT, WONK)       |
| Database       | Supabase Postgres (colocated in `almanac`)  |
| Auth           | Supabase Auth (magic link)                  |
| Storage        | Supabase Storage (`portfolio-media` bucket) |

Schema lives in `supabase/migrations/`. All portfolio objects are prefixed `portfolio_*` so the project cohabits cleanly with other apps in the same Supabase project.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your own keys
npm run dev
```

Open http://localhost:3000 — public site. Admin at http://localhost:3000/admin.

## Content workflow

```bash
npm run seed                  # upsert /data/*.ts into Supabase
npm run seed:reset            # truncate + reseed
npm run bootstrap:admin -- you@example.com   # grant admin
```

Once seeded you can manage everything from the admin panel:
- `/admin/projects` — selected work CRUD
- `/admin/stuff` — non-software entries (hikes etc.)
- `/admin/about` — singleton bio
- Image uploads go directly to the `portfolio-media` Storage bucket.

The local `/data/*.ts` files act as a fallback when Supabase is unreachable, so the site still renders during dev.

## Design language

The public site (`app/(site)`) is one engineering drawing: hairline cells for the landing area, ruled strips below, and a title block as the footer. Styles live in [`app/(site)/site.css`](app/(site)/site.css), set in Inter Tight and JetBrains Mono on warm paper with one orange accent.

- **Wordmark** (`lib/particles.ts`): the name drawn in dots. It scatters from the cursor and gets tired: stir it enough and recovery slows and some dots never go home. Idle cost is zero.
- **Ask Callum** (`components/site/ask-callum.tsx`): an AI-assistant parody. "Callum 1.0" is the real human over Supabase Realtime when the admin chat console is open, otherwise messages save to `portfolio_messages`. `callum-nano` is the local budget model.
- **Fidgets**: an "I'm not a robot" checkbox, a slide-to-prove-humanity slider, a stampable stamp, and a scratch pad that draws in the colour of whatever you last clicked.
- Sleep data comes from Almanac when there is some, and falls back to a labelled sample.

The admin area (`app/(backstage)`) keeps the original dark styles in `app/globals.css`. The two halves have separate root layouts, so crossing between them is a full page load, and unmatched URLs use `app/global-not-found.tsx`.

The previous CDT-98 terminal homepage lives on as its own project: [whats-cyber.callum-thomas.com](https://whats-cyber.callum-thomas.com).

## Architecture notes

- **`lib/content.ts`** — single content access layer. Reads from Supabase, falls back to `/data/*.ts`. Swap data sources here, not in pages.
- **`lib/supabase/{server,client,admin,middleware}.ts`** — distinct Supabase clients for each runtime context. The `admin.ts` service-role client is `"server-only"` to prevent shipping it to the browser.
- **`proxy.ts`** — refreshes auth cookies on every request so RSCs see the right user.
- **`app/(backstage)/admin/*`**: admin pages guard themselves with `requireAdmin()` from `lib/auth.ts`.

## Deploying

```bash
# Vercel: connect this repo, set the same env vars from .env.local
# DNS points to the Vercel project — see ~/projects/callumdavidthomas memory.
```

---

Built in the dark.
