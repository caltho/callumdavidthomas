# callumdavidthomas.com

Personal portfolio. Rebuild — fully AI built, editorial brutalism × basement-club design, content driven from Supabase with a custom admin panel.

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

Tokens in [`app/globals.css`](app/globals.css):

- `--ink-900..400` deep, warm blacks
- `--bone-50..600` bulb whites
- `--ember` oxide red, `--ultra` violet — the club lights
- `.font-display` Fraunces, tight letter-spacing, soft + wonk axes
- `.clublights` slow CSS radial-gradient drift behind every page
- `.sweep` hover-reveal sweep across rows
- `.pulse-dot` breathing accent dot

No scroll hijacking — ever. Native scroll only. `prefers-reduced-motion` disables everything.

## Architecture notes

- **`lib/content.ts`** — single content access layer. Reads from Supabase, falls back to `/data/*.ts`. Swap data sources here, not in pages.
- **`lib/supabase/{server,client,admin,middleware}.ts`** — distinct Supabase clients for each runtime context. The `admin.ts` service-role client is `"server-only"` to prevent shipping it to the browser.
- **`proxy.ts`** — refreshes auth cookies on every request so RSCs see the right user.
- **`app/admin/*`** — admin pages guard themselves with `requireAdmin()` from `lib/auth.ts`.

## Deploying

```bash
# Vercel: connect this repo, set the same env vars from .env.local
# DNS points to the Vercel project — see ~/projects/callumdavidthomas memory.
```

---

Built in the dark.
