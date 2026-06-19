# Multi‑Stack Portfolio Platform

A database‑backed, multi‑portfolio personal site with a full admin CMS, an AI
portfolio generator, and on‑demand ATS‑friendly PDF CV export.

One person, many audiences. Instead of a single static résumé site, this app
lets you publish **multiple tailored portfolios** — each at its own URL
(`/<slug>`), each with its own name, tagline, tech, experience and projects —
all sharing a single pool of content you manage once.

---

## What problem it solves

A senior/polyglot engineer applies to very different roles (e.g. Ruby on Rails,
Node.js + GCP, AI/GenAI). A generic portfolio dilutes the message; maintaining
several hand‑built sites is tedious.

This platform lets you:

- Maintain **one knowledge base** of tech categories, work experience and
  projects, and **reuse** those items across many portfolios (many‑to‑many).
- Spin up a **role‑tailored portfolio** in seconds — manually, or by pasting a
  **job description** and letting AI assemble the best‑matching one for you.
- Hand a recruiter a clean, **ATS‑approved PDF CV** generated live from whatever
  portfolio they're viewing.

> Terminology: in the UI a portfolio is called a **“Portfolio.”** Internally
> (DB table, routes, code) it is a **`stack`** — the two words mean the same
> thing.

---

## Key features

### Public site
- **Multiple portfolios**, one per `stack`, served at `/<slug>`.
- Animated, modern landing per portfolio (hero, stats, tech grid, experience
  timeline, project grid) built with Framer Motion + a Three.js/Spline hero.
- **Download CV** button → a real, selectable‑text **PDF** generated on demand
  from that portfolio’s content (`/<slug>/cv`).
- Custom 404 that lets visitors jump into any existing portfolio.
- The root path `/` intentionally 404s — there is no single landing page; every
  portfolio is its own entry point.

### Admin CMS (`/admin`)
- Custom email/password auth (admin‑only), JWT session cookie.
- **Overview** dashboard with content counts.
- **Profile** editor (name, title, contact, education, certifications, stats…).
- **Portfolios** — create/edit/delete portfolios; inline editor to manage each
  portfolio’s tech, experience and projects.
- **Create full Portfolio** — build a portfolio plus its content in one form,
  mixing brand‑new items with existing shared ones.
- **Tech / Experience / Projects** managers — global CRUD for each entity type.
- **Many‑to‑many content model**: a tech category, experience or project can
  belong to several portfolios. In the portfolio editor you **Remove** an item
  (detaches it from that portfolio; the item itself is kept) rather than
  deleting it, and you can **attach an existing** item or **create a new** one.

### AI portfolio generator (`/admin/generate`)
- Paste a **job description** → one LLM call assembles a tailored portfolio.
- The AI only **selects** from your existing tech/experience/projects — it never
  invents content — then proposes a short name, tagline, icon, accent and a
  16‑char hash slug.
- Returns matched JD keywords and a fit summary; the new portfolio appears in
  the **Portfolios** tab for review/editing.
- Provider: **Groq** (free, OpenAI‑compatible) by default; swappable to any
  OpenAI‑compatible endpoint via env, with no code change.

### ATS‑friendly PDF CV
- Generated per portfolio with `@react-pdf/renderer`.
- Single column, standard fonts, real selectable text, standard section
  headings (Summary, Skills, Experience, Projects, Education, Certifications),
  no tables/graphics — i.e. parses cleanly in applicant tracking systems.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack), **React 19**, TypeScript |
| Styling | **Tailwind CSS v4** |
| Database | **Supabase** (PostgreSQL, Row Level Security; no pgvector) |
| Auth | Custom `users` table, **bcryptjs** hashes, **jose** JWT session cookie |
| AI | **Groq** Chat Completions (OpenAI‑compatible) via `fetch` |
| PDF | **@react-pdf/renderer** |
| Animation/3D | Framer Motion, three / @react-three/fiber + drei, GSAP, Lenis, Spline |
| Validation | **Zod** |
| Icons | **lucide-react** (stored as string names, resolved at runtime) |

---

## Architecture

### Data layer
Portfolio content lives in Supabase. `src/data/portfolio.ts` is **only the seed
source + shared TypeScript types** — runtime reads come from
`supabase/lib/queries.ts` (public, anon client + RLS) and
`supabase/lib/admin-queries.ts` (admin, service‑role client). Icons are stored
as strings and resolved to Lucide components via `src/lib/icons.tsx`
(`DynamicIcon`), because component references can’t cross the server→client
boundary.

The knowledge base is small (~15k tokens), so the AI feature passes the whole
thing to the model in one prompt — **no embeddings/RAG required.**

### Many‑to‑many content
`tech_categories`, `experiences` and `projects` are each many‑to‑many with
`stacks` through join tables (`tech_category_stacks`, `experience_stacks`,
`project_stacks`). “Removing” an item from a portfolio deletes the join row, not
the item.

### Auth
Custom `users` table with bcrypt password hashes; a signed JWT session cookie
(`jose`). `requireAdmin` (`supabase/auth/dal.ts`) guards admin pages and server
actions and redirects unauthenticated visitors to `/admin/login`.

### Writes
All mutations are **Next.js Server Actions** in `supabase/actions/`, using the
service‑role client (bypasses RLS) behind `requireAdmin`, and revalidate the
affected public pages.

### AI
`supabase/ai/llm.ts` is a thin, swappable wrapper over an OpenAI‑compatible
Chat Completions endpoint (JSON‑object mode). `supabase/actions/generate.ts`
builds the knowledge base, prompts the model to select items **by numeric ref**
(reliable, unlike echoing UUIDs), validates the response with Zod, drops any
hallucinated refs, then creates the portfolio and links the selected items.

### CV
`GET /<slug>/cv` (route handler, Node runtime) loads the portfolio + profile and
renders an ATS‑optimized PDF (layout in
`src/app/[stack]/cv/cv-document.tsx`). `@react-pdf/renderer` is listed in
`serverExternalPackages` so the bundler leaves it as a normal Node dependency.

---

## Routes

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | dynamic | 404 (no single landing page) |
| `/<slug>` | dynamic | A portfolio’s public page |
| `/<slug>/cv` | route handler | Download that portfolio’s PDF CV |
| `/admin/login` | page | Admin sign‑in |
| `/admin` | page | Overview / counts |
| `/admin/profile` | page | Edit profile |
| `/admin/stacks` | page | Portfolios list + per‑portfolio editor |
| `/admin/stacks/new-portfolio` | page | Create a full portfolio in one go |
| `/admin/generate` | page | AI: job description → tailored portfolio |
| `/admin/tech` | page | Tech category manager |
| `/admin/experience` | page | Experience manager |
| `/admin/projects` | page | Projects manager |

---

## Data model

| Table | Notes |
| --- | --- |
| `profile` | Single row (id = 1): person, contact, education, certifications, stats |
| `stacks` | One per portfolio; `slug` drives the URL |
| `tech_categories` | Grouped skill lists (`stack_id` legacy/nullable) |
| `experiences` | Work history entries (`stack_id` legacy/nullable) |
| `projects` | Project entries (`stack_id` legacy/nullable) |
| `tech_category_stacks` | M2M join: tech category ↔ portfolio |
| `experience_stacks` | M2M join: experience ↔ portfolio |
| `project_stacks` | M2M join: project ↔ portfolio |
| `users` | Admin accounts (bcrypt password hashes) |

RLS: public **read** on all content tables; **writes** only via the service‑role
key (server side). Migrations live in `supabase/migrations/` (`0001`–`0003`).

---

## Project structure

```
src/
  app/
    [stack]/            public portfolio page
      cv/               PDF CV route handler + document layout
    admin/
      login/            sign-in
      (dashboard)/      overview, profile, stacks, generate, tech, experience, projects
      _components/      admin UI (editors, forms, AI panel, pickers)
    page.tsx            root (404)
    not-found.tsx
  components/
    site/               public site UI (hero, grids, timeline, footer, 3D bg)
    ui/                 shared primitives (button, card, badge)
  data/portfolio.ts     seed data + shared types
  lib/                  icons, utils
  instrumentation.ts    loads supabase/.env on server startup
supabase/
  lib/                  client.ts, queries.ts, admin-queries.ts  (alias: @server/lib/*)
  actions/              server actions: content, auth, generate
  auth/                 dal.ts (requireAdmin), session.ts (JWT)
  ai/                   llm.ts (Groq/OpenAI-compatible wrapper)
  migrations/           0001_init, 0002_project_stacks, 0003_share_tech_experience
  config.toml           Supabase project config
  seed.ts               seeds DB from src/data/portfolio.ts + creates admin
```

The `@server` path alias points at `supabase/`; `@/` points at `src/`.

---

## Getting started

### Prerequisites
- **Node 22** (see `.nvmrc`)
- A **Supabase** project (free tier is fine)
- A **Groq** API key for the AI feature (free — optional if you don’t use it)

### 1. Install
```bash
npm install
```

### 2. Configure environment

Two env files — frontend (public) and backend (secret).

**`.env.local`** (project root) — copy from `.env.local.example`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

**`supabase/.env`** (server‑only secrets) — copy from `supabase/.env.example`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
SESSION_SECRET=generate-with-"openssl rand -base64 32"
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change-me

# AI (Generate with AI tab) — get a key at https://console.groq.com
GROQ_API_KEY=gsk_your-key-here
# Optional overrides:
# GROQ_MODEL=llama-3.3-70b-versatile
# GROQ_BASE_URL=https://api.groq.com/openai/v1
```

> Never prefix secrets with `NEXT_PUBLIC_` — those are inlined into the browser
> bundle. `supabase/.env` is loaded on server startup by `src/instrumentation.ts`.

### 3. Apply database migrations
Run the SQL in `supabase/migrations/` (`0001` → `0002` → `0003`) against your
Supabase database — via the **SQL Editor** in the dashboard, or the CLI:
```bash
supabase db push --db-url "postgresql://...:5432/postgres"   # use the session/port-5432 URL
```
All migrations are idempotent and safe to re‑run.

### 4. Seed content + create the admin user
```bash
npm run seed
```
Loads `src/data/portfolio.ts` into the database and creates the first admin from
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

### 5. Run
```bash
npm run dev
```
Visit a seeded portfolio at `http://localhost:3000/<slug>` and the admin at
`http://localhost:3000/admin`.

---

## Using the admin

1. Sign in at `/admin/login` with the seeded admin credentials.
2. **Profile** — fill in your details (used on every portfolio and in the CV).
3. **Portfolios** — create a portfolio, then expand **Edit** to attach existing
   tech/experience/projects or create new ones. Use **Remove** to detach an item
   from a portfolio without deleting it.
4. **Generate with AI** — paste a job description; review the generated portfolio
   in the **Portfolios** tab.
5. On any public portfolio, click **Download CV** for the ATS PDF.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed DB + create admin user |

---

## Deployment

Deploy to any Node host (e.g. Vercel). Set the same environment variables in the
host’s project settings (both the `NEXT_PUBLIC_*` values and the server secrets,
including `GROQ_API_KEY`). Apply the migrations to your production Supabase
database and run the seed once if you want the starter content. The CV route
needs the **Node.js runtime** (already configured) because `@react-pdf/renderer`
relies on Node APIs.
