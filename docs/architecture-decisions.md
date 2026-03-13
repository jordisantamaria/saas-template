# Architecture Decisions Record (ADR)

> Reference document with all architectural decisions of the SaaS template and the justification for each one.

---

## Technology Summary

| Layer              | Technology                      | Justification                                            |
| ------------------ | ------------------------------- | -------------------------------------------------------- |
| **Monorepo**       | Turborepo + pnpm                | Smart caching, efficient workspaces                      |
| **Framework**      | Next.js 15 (App Router)        | SSR + API + React in one, Server Components              |
| **UI Library**     | React 19                        | Largest ecosystem, Server Components                     |
| **Styling**        | Tailwind CSS v4                 | Utility-first, zero runtime, themes with CSS vars        |
| **Components**     | shadcn/ui (@nyxidiom/ui)        | Radix primitives, customizable, Linear/Vercel style      |
| **Icons**          | Lucide React                    | +1500 icons, tree-shakeable                              |
| **Typography**     | Geist Sans/Mono (next/font)     | Zero layout shift, modern aesthetic                      |
| **ORM**            | Drizzle ORM                     | Native TypeScript, modular schemas, no code gen          |
| **Database**       | Neon PostgreSQL                 | Serverless, branching, scale-to-zero, PITR               |
| **Auth**           | Auth.js (NextAuth v5) — JWT     | Free, data in our DB, 80+ providers                      |
| **Payments**       | Stripe                          | Subscriptions, invoices, checkout, customer portal        |
| **File Storage**   | Cloudflare R2                   | S3-compatible, no egress fees, $0.015/GB                 |
| **Email**          | Resend + React Email            | Templates in JSX, 3k/month free                          |
| **Rate Limiting**  | Upstash Redis                   | Serverless, Edge-compatible                              |
| **CDN / Security** | Cloudflare (free)               | DDoS, WAF, bot detection, SSL                            |
| **Hosting**        | Vercel                          | Zero-config for Next.js, preview deploys                 |
| **Analytics**      | PostHog                         | Product analytics, funnels, retention, 1M free events    |
| **Error Tracking** | Sentry                          | Stack traces, performance monitoring                     |
| **Logs / Uptime**  | Vercel Observability            | 30-day retention, traces, $10/month                      |
| **Validation**     | Zod                             | Schema validation TypeScript-first                       |
| **Formatting**     | Native Intl (browser)           | Zero bundle, auto-detects user locale                    |
| **Dates**          | UTC in DB, Intl.DateTimeFormat  | No libraries, automatic formatting by locale             |
| **Packages**       | GitHub Packages (@nyxidiom/\*)  | Private npm registry, Changesets for versioning          |
| **Linting**        | ESLint + Prettier (@nyxidiom/config) | Shared rules, consistent style                      |
| **TypeScript**     | TypeScript 5 (strict)           | noUncheckedIndexedAccess, verbatimModuleSyntax           |
| **Testing**        | Vitest + Playwright             | Unit tests + E2E                                         |

---

## ADR-001: Monorepo with Turborepo

### Decision

Monorepo managed with Turborepo + pnpm workspaces.

### Context

As an agency, we need to reuse modules across different client projects and maintain consistency across the entire team.

### Alternatives evaluated

| Option               | Pros                                           | Cons                                                 |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| **Turborepo + pnpm** | Simple, fast, smart caching, zero-config       | Two tools                                            |
| Nx                   | More features, plugins, graph visualization    | Overkill for <15 packages, steep learning curve      |
| Bun only             | Single tool, fast                              | No task orchestration or smart caching               |
| Bun + Turborepo      | Faster installs                                | Less battle-tested, edge cases with packages         |
| Separate repos       | Total independence                             | Friction between front/back, duplicated types, separate CI/CD |

### Justification

- A single PR touches front + back + shared types
- Painless refactoring across packages
- Unified CI/CD
- Faster onboarding for new devs
- pnpm is the most disk-efficient package manager (symlinks)
- Turborepo caches builds locally and remotely
- The most battle-tested combination in production for monorepos

### Note on Bun

Bun is maturing rapidly. In 6-12 months, evaluate migrating from pnpm to Bun as a package manager. The migration is trivial (change lockfile). Turborepo stays as the task runner.

---

## ADR-002: Next.js Full-Stack (App Router)

### Decision

Next.js 15 with App Router as the single framework for frontend and backend.

### Context

For SaaS startups, delivery speed is critical. Separating frontend and backend at the start creates unnecessary friction.

### Alternatives evaluated

| Option                   | Pros                                   | Cons                                       |
| ------------------------ | -------------------------------------- | ------------------------------------------ |
| **Next.js full-stack**   | SSR + API + React in one, excellent DX | Coupled to Vercel for max performance      |
| React SPA + separate API | Front/back independence                | More infra, CORS, double deployment        |
| Remix                    | Good form handling                     | Smaller ecosystem, fewer SaaS integrations |
| Nuxt (Vue)               | Good if team knows Vue                 | Smaller SaaS ecosystem                     |
| Angular                  | Enterprise-ready                       | Slow to iterate, overkill for startup      |

### Justification

- React has the largest ecosystem and most available talent
- SSR/SSG for SEO (landing pages, pricing, blog)
- Server Components drastically reduce JS sent to the browser
- Server Actions eliminate the need for internal API routes
- If the backend grows too much, it can be extracted later
- Premature separation kills startups

---

## ADR-003: React over Vue and Angular

### Decision

React 19 as the UI library.

### Justification

- Largest ecosystem for SaaS (shadcn/ui, Tremor, TanStack, etc.)
- Largest pool of available talent for hiring
- Better tooling and integrations
- Server Components (exclusive to React in Next.js)
- Vue: smaller SaaS ecosystem, fewer ready-made components
- Angular: overkill for startup, slower iteration

---

## ADR-004: No Universal / No Tamagui

### Decision

Do not use Tamagui or a universal approach (web + mobile sharing UI) at the start.

### Context

We evaluated offering "web + mobile" as a value proposition for the agency.

### Alternatives evaluated

| Option                         | Pros                                        | Cons                                 |
| ------------------------------ | ------------------------------------------- | ------------------------------------ |
| **Web-first + mobile later**   | Max speed, UX optimized per platform        | No native app at the start           |
| Tamagui + Solito               | Shared web/mobile UI                        | +40-60% slower, UX compromises      |
| React Native Web               | One codebase                                | Inferior web UX vs native Next.js    |

### Justification

- B2B SaaS (fintech/marketing) is 90%+ web
- Dashboard interfaces don't translate 1:1 to mobile
- What's shared between platforms is business logic, not UI
- The monorepo is already set up to add `apps/mobile/` with Expo when needed
- Better to sell web first and upsell mobile as phase 2

### Mobile strategy when the time comes

```
apps/mobile/     → Expo + React Native
packages/shared/ → Types, validations, API client (already existing)
```

The UI is built natively for each platform. Business logic is shared via packages/.

---

## ADR-005: Drizzle ORM over Prisma

### Decision

Drizzle ORM for database access with modular schemas.

### Alternatives evaluated

| Option      | Pros                                                        | Cons                                                      |
| ----------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| **Drizzle** | Native TypeScript, composable schemas, no code generation   | Newer                                                     |
| Prisma      | Very popular, good DX                                       | Monolithic schema, requires code gen, hard to modularize  |
| Kysely      | Lightweight, type-safe                                      | Fewer features, more manual                               |
| Raw SQL     | Full control                                                | No type safety, vulnerable to SQL injection               |

### Justification

- Schemas are pure TypeScript: they can be imported, composed, and reused across packages
- No code generation step (prisma generate)
- Each module (auth, billing, teams) defines its own schema
- The app composes only the modules it needs
- SQL-based and composable migrations
- Superior performance (queries closer to SQL)

### Modular schemas pattern

```
packages/db/schemas/auth.ts     → users, sessions, accounts
packages/db/schemas/billing.ts  → subscriptions, invoices, plans
packages/db/schemas/teams.ts    → organizations, members

apps/web/src/db/schema.ts       → imports and composes only what it needs
```

### Dependency injection

Packages receive the db client, they don't import it directly:

```ts
export function createAuthService(db: DrizzleDB) { ... }
```

---

## ADR-006: Neon PostgreSQL over Supabase

### Decision

Neon PostgreSQL as the database, without using Supabase.

### Context

Supabase is the most popular alternative for startups: it includes PostgreSQL + Auth + Storage + Realtime + Edge Functions in a single dashboard. The question is whether to use Supabase as an all-in-one platform or compose specialized services.

### Alternatives evaluated

| Option                  | Pros                                                       | Cons                                                                           |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Neon PostgreSQL**     | DB only, serverless, branching per PR, scale-to-zero       | Database only, need to compose the rest                                        |
| Supabase                | All-in-one (DB + Auth + Storage + Realtime), dashboard     | Auth/Storage overlap with our modules, vendor lock-in, less control            |
| PlanetScale             | Branching, good DX                                         | MySQL (not PostgreSQL), pricing changed for the worse                          |
| AWS RDS                 | Full control, cheap at scale                               | Not serverless, manual config, no branching                                    |
| Vercel Postgres (Neon)  | Integrated with Vercel                                     | Markup over direct Neon, same technology but more expensive                    |

### Justification

**The problem with Supabase all-in-one:**

- Supabase Auth overlaps with Auth.js — and Auth.js gives us JWT without DB queries, 80+ providers, and total control over callbacks and UI
- Supabase Storage overlaps with Cloudflare R2 — and R2 has no egress fees ($0 vs Supabase which charges for bandwidth)
- Supabase Realtime and Edge Functions are not needed at the start
- Using only Supabase PostgreSQL without its other services has no advantage over Neon

**Why Neon specifically:**

- **Scale-to-zero**: in dev and pre-revenue, the DB shuts down when there are no connections ($0)
- **Branching**: each PR can have its own copy of the DB to test migrations
- **Serverless driver**: connection via HTTP, no persistent connection pool (ideal for Vercel serverless)
- **PITR (Point-in-Time Recovery)**: continuous backup included in all plans
- **Pure PostgreSQL**: no proprietary abstractions, migrating to any other PostgreSQL is trivial

**Template philosophy:**

We prefer composing best-of-breed services that each do one thing well (Neon = DB, Auth.js = auth, R2 = storage, Stripe = payments) instead of depending on an all-in-one platform where if you want to leave, you have to migrate everything at once.

### When to consider Supabase

- Rapid prototyping (hackathon, 1-week MVP) where speed matters more than control
- The team doesn't want to manage multiple services
- You need Realtime (presence, collaborative cursors) from day 1

---

## ADR-007: Auth.js for Authentication

### Decision

Auth.js (NextAuth v5) as the authentication solution.

### Alternatives evaluated

| Option        | Pros                                                 | Cons                                          |
| ------------- | ---------------------------------------------------- | --------------------------------------------- |
| **Auth.js**   | Free, data in your DB, 80+ providers, customizable  | UI must be built, config can be complex       |
| Clerk         | Pre-built UI, built-in multi-tenancy                 | $0.02/MAU, vendor lock-in, data not in your DB|
| Better Auth   | TypeScript-first, plugins                            | Newer, smaller community                      |
| Supabase Auth | Integrated with Supabase                             | Conflicts with our own module, lock-in        |
| Custom        | Full control                                         | Insecure, reinventing the wheel               |

### Justification

- Always free: doesn't eat into client margins (50k users on Clerk = $800/month)
- Data in our DB (schema packages/db/schemas/auth.ts)
- 100% customizable: every client wants their own login screen
- No vendor lock-in
- Default providers: Google + Magic Link
- Easy to add: Microsoft, GitHub, Apple, Credentials

### Session strategy: JWT over Database Session

- JWT: local verification (crypto), ~1-2ms, no DB query
- Database session: DB query per request, ~50-100ms
- JWT for performance; enriched session data in the callback

### Why not Neon Auth

Neon offers its own authentication module (Neon Auth). We don't use it because:

- Auth.js gives total control over providers, callbacks, and UI
- JWT strategy without DB queries on every request
- Doesn't tie authentication to the database provider
- If we migrate from Neon to another PostgreSQL, auth keeps working without changes

### Public pages and auth

- Marketing pages (/, /pricing, /blog): ZERO auth checks, SSG, CDN
- Protected pages (/dashboard, /settings): JWT check in Edge middleware
- Google never sees protected pages: SEO is not affected

---

## ADR-008: Folder Structure (Feature-Based)

### Decision

Feature-based structure, inspired by Feature Slice Design but adapted to Next.js App Router.

### Alternatives evaluated

| Option                     | Pros                                       | Cons                                           |
| -------------------------- | ------------------------------------------ | ---------------------------------------------- |
| **Adapted feature-based**  | Intuitive, colocation, learned in 5 min    | Less formal than FSD                           |
| Full FSD (7 layers)        | Very structured                            | Conflicts with App Router, overkill, steep curve|
| Everything in app/         | Simple                                     | 500-line files, impossible to reuse            |
| Flat components/           | Simple                                     | 200 files with no organization                 |

### Structure

```
app/               → Routing and composition only (Next.js App Router)
features/          → Business logic by domain (components + actions + hooks)
components/        → Shared app components (layouts, wrappers)
lib/               → Utilities and configuration
packages/          → Reusable modules across projects
```

### Dependency rule (from FSD)

Dependencies only flow downward:

```
app/ → features/ → components/ → lib/ → packages/
```

Never cross-imports between features. If two features need to communicate, they are composed in app/.

---

## ADR-009: Rendering Strategy

### Decision

Server Components by default. "use client" is the exception.

### Strategy by zone

| Zone                    | Pattern              | Auth           | Cache              | SEO           |
| ----------------------- | -------------------- | -------------- | ------------------ | ------------- |
| Marketing (/, /pricing) | SSG (force-static)   | None           | CDN edge           | Yes           |
| Blog (/blog/[slug])     | ISR (revalidate)     | None           | CDN + revalidation | Yes           |
| Auth (/login)           | SSR                  | None           | No cache           | No (noindex)  |
| Dashboard               | Dynamic SSR          | JWT middleware | No cache           | N/A (private) |
| Settings                | SSR + Server Actions | JWT middleware | No cache           | N/A (private) |

### Data fetching

- Read: async Server Component (server-side fetch)
- Write: Server Actions (forms and mutations)
- Webhooks: Route Handlers (/api/webhooks/\*)
- Do not create API Routes for internal app use

### "use client" rule

Only when the compiler requires it:

- useState, useEffect, useRef
- Event handlers (onClick, onChange)
- Browser libraries (charts, maps, drag & drop)
- Browser APIs (localStorage, geolocation)

---

## ADR-010: No TanStack Query by Default

### Decision

Do not include TanStack Query in the base template.

### Context

With Server Components + Server Actions + Suspense, 95% of TanStack Query use cases are already covered.

### When to install it (per project)

- Real-time polling (refetchInterval)
- Infinite scroll (useInfiniteQuery)
- Optimistic updates
- Search with debounce and client-side cache

### Justification

Fewer dependencies = less maintenance = more margin for the agency. It can be installed in 5 minutes when a specific project needs it.

---

## ADR-011: Performance Strategy

### Decision

Leverage what Next.js gives for free + team discipline with specific rules.

### What Next.js does automatically

- Code splitting per route
- Prefetch of visible `<Link>` elements
- Image optimization (next/image)
- Font optimization (next/font)
- Tree-shaking

### What we configure in the template

- next/font with display swap (zero layout shift)
- next/image mandatory (ESLint rule prohibits `<img>`)
- Lucide icons with tree-shaking (no SVG sprites)
- Bundle analyzer script
- Heavy libraries prohibited via ESLint (moment.js, lodash, etc.)
- dynamic() for client components >50KB (charts, editors, maps)

### Suspense pattern for slow APIs

Each independent section wrapped in Suspense with its own Skeleton. The page loads progressively, the user always sees content.

### Prohibited libraries

| Prohibited   | Alternative                   |
| ------------ | ----------------------------- |
| moment.js    | date-fns                      |
| lodash       | lodash-es or native functions |
| @fortawesome | lucide-react                  |
| chart.js     | recharts                      |
| Draft.js     | Tiptap                        |

---

## ADR-012: SVG Management

### Decision

Lucide for standard icons + typed `<Icon>` component for custom ones + catalog page for discovery.

### Strategy by type

| Type            | Solution                                      | Discovery        |
| --------------- | --------------------------------------------- | ---------------- |
| Standard icons  | Lucide React (tree-shakeable)                 | lucide.dev/icons |
| Custom icons    | `<Icon name="..." />` with SVGR, typed IconName | Catalog page   |
| Illustrations   | `<EmptyState illustration="..." />`           | Catalog page     |

### Why not SVG sprites

With tree-shaking and Server Components, sprites are obsolete. A sprite loads ALL icons. Tree-shaking loads only the ones used.

### Why catalog page over Storybook (initially)

- Storybook is overkill just for SVGs
- A page at `/catalog` (dev only) with zero extra tooling
- If the design system grows to 50+ components, migrate to Storybook

### Storybook

Included in `packages/ui` for the reusable design system. Only components from packages/ui, not pages or features.

---

## ADR-013: Cloud & Infrastructure

### Decision

Composed services: Vercel + Neon + Cloudflare + specialized services.

### Alternatives evaluated

| Option              | Pros                                 | Cons                                        |
| ------------------- | ------------------------------------ | ------------------------------------------- |
| **Composed**        | Best-of-breed, no overlap, flexible  | Multiple dashboards                         |
| Supabase all-in-one | Single dashboard, fast               | Overlaps with our modules (auth, storage)   |
| Full AWS            | Full control, cheap at scale         | Needs DevOps, complex                       |
| Firebase            | Fast                                 | Extreme vendor lock-in, no SQL              |

### Chosen stack

| Layer          | Service               | Justification                               |
| -------------- | --------------------- | ------------------------------------------- |
| Hosting        | Vercel                | Zero-config for Next.js, preview deploys    |
| Database       | Neon PostgreSQL       | Serverless, branching per PR, scale-to-zero |
| CDN + DDoS     | Cloudflare (free)     | Absorbs 95% of attacks, $0                  |
| File Storage   | Cloudflare R2         | S3 compatible, no egress fees               |
| Auth           | Auth.js (self-hosted) | $0, data in our DB                          |
| Email          | Resend                | React Email templates, 3k/month free        |
| Payments       | Stripe                | Subscriptions, invoices                     |
| Cache/Queues   | Upstash Redis         | Serverless, rate limiting                   |
| Analytics      | PostHog               | Product analytics, 1M free events           |
| Error Tracking | Sentry                | Stack traces, performance, free             |
| Logs + Uptime  | Vercel Observability  | 30-day logs, integrated, $10/month          |

### Costs by phase

| Phase       | Users    | Cost/month        |
| ----------- | -------- | ----------------- |
| Pre-revenue | 0-100    | $0 (Vercel Hobby) |
| MVP         | 100-1k   | $20 (Vercel Pro)  |
| Growth      | 1k-10k   | ~$96              |
| Scale       | 10k-50k  | ~$352             |

---

## ADR-014: Security — Defense in Depth

### Decision

4 layers of protection: Cloudflare → Vercel Edge → App → Database.

### Layers

1. **Cloudflare (free)**: DDoS mitigation, WAF, bot detection
2. **Edge Middleware**: Rate limiting with Upstash Redis (auth: 10/min, API: 60/min)
3. **Application**: Security headers, Server Actions with zod validation, webhook signature verification
4. **Database**: Connection pooling, query timeouts, mandatory pagination (max 100)

### Rate Limiting

| Route            | Limit             | Reason                       |
| ---------------- | ----------------- | ---------------------------- |
| /api/auth/\*     | 10 req/min per IP | Prevent brute force          |
| /api/\* general  | 60 req/min per IP | General protection           |
| /api/webhooks/\* | 200 req/min       | Stripe can send many         |

### Response to active DDoS attack

1. Activate "Under Attack Mode" in Cloudflare (1 click)
2. Temporarily lower rate limits
3. Block IPs/countries in Cloudflare
4. Review logs in Vercel + Cloudflare

---

## ADR-015: Backups and Monitoring

### Backups

- **Continuous**: Neon PITR (Point-in-Time Recovery) automatic, included
- **Weekly**: Dump to Cloudflare R2 via GitHub Action (~$1/month)
- **Pre-migration**: Manual dump before each schema migration

### Monitoring

| Tool         | Function                                 | Cost                  |
| ------------ | ---------------------------------------- | --------------------- |
| Sentry       | Error tracking + performance             | Free (5k errors/month)|
| Vercel Obs.  | 30-day logs + uptime + alerts            | $10/month             |
| PostHog      | Product analytics + session replay       | Free (1M events/month)|
| Vercel       | Build logs, web vitals, function metrics | Included in Pro       |

### Health Check

Endpoint `/api/health` that verifies DB connectivity. Vercel Observability ($10/month) provides 30 days of log retention with advanced search and request traces. For external uptime monitoring, you can add Better Stack or UptimeRobot (both free) pointing to `/api/health`.

---

## ADR-016: PostHog for Product Analytics

### Decision

PostHog as the sole analytics tool. Do not include Google Analytics.

### Context

A SaaS startup needs to understand how users use the product to make decisions. There are two types of analytics:

- **Web/marketing analytics** (traffic, sources, SEO): Google Analytics, Plausible
- **Product analytics** (in-app behavior, funnels, retention): PostHog, Mixpanel, Amplitude

### Alternatives evaluated

| Option           | Pros                                                                 | Cons                                                  |
| ---------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| **PostHog**      | Product analytics + pageviews in one, 1M free events, open source    | Less powerful for campaign attribution                |
| Google Analytics | Free, ad attribution, SEO insights                                   | No product funnels, doesn't measure feature usage     |
| Mixpanel         | Very powerful for product                                            | Expensive (only 1k users on free), closed source      |
| Amplitude        | Enterprise-grade                                                     | Overkill, complex                                     |
| PostHog + GA     | Best of both                                                         | Two tools, more complexity                            |

### Justification

- PostHog covers 90% of what a SaaS needs: pageviews, funnels, retention, feature usage
- For a startup, knowing "70% drop off at step 2 of checkout" is worth more than "100 visits came from Google"
- 1M free events/month is more than enough for early-stage startups
- If a client needs Google Ads campaign attribution, GA is added in that specific project
- It's not the base template's responsibility

### What to measure with PostHog

| Type          | Example                                           |
| ------------- | ------------------------------------------------- |
| Funnels       | Signup → Onboarding → First action → Subscription |
| Feature usage | How many users use feature X per week              |
| Retention     | How many return after 7/30 days                    |
| Pageviews     | Most visited pages, bounce rate                    |

---

## ADR-017: Two Repos — Published Packages + Project Template

### Decision

Separate into two repositories: one for shared packages (published to GitHub Packages) and another as a project template for clients.

### Structure

```
REPO 1: nyxidiom/nyxidiom-packages (source of truth)
  packages/
    ui/           → components, design system
    config/       → ESLint, TS, Prettier
    email/        → email templates
    shared/       → validations, utils, constants
  apps/
    reference/    → Next.js app to test packages

REPO 2: nyxidiom/saas-template (GitHub Template)
  packages/
    db/           → schemas (custom per project)
    auth/         → auth config (providers vary)
    payments/     → Stripe config (plans vary)
  apps/
    web/          → the client's app
  package.json
    "@nyxidiom/ui": "^1.0.0"         ← from registry
    "@nyxidiom/config": "^1.0.0"
    "@nyxidiom/email": "^1.0.0"
    "@nyxidiom/shared": "^1.0.0"
```

### Alternatives evaluated

| Option                             | Pros                                                | Cons                                                               |
| ---------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| **2 repos + registry**             | Zero drift, simple onboarding, every dev gets it    | Two repos to maintain                                              |
| All in-repo (template copy)        | Zero friction when developing                       | Component drift between projects (different bugs per project)      |
| Mega monorepo (all clients)        | Packages always up to date                          | No isolation, complicated permissions                              |
| Git submodules                     | Direct reference                                    | Terrible DX, nobody understands them                               |
| pnpm link workflow                 | Real-time cross-development                         | Onboarding complexity, confusing for new devs                      |

### Justification

- The main problem to solve: **prevent the same component (e.g., `<Input/>`) from having different versions with different bugs in each project**
- 2 repos is the simplest mental model: "packages = library, project = app"
- Onboarding: any dev understands "I install a package and use it"
- Changesets + GitHub Actions = automatic publish without friction
- `pnpm update @nyxidiom/ui` in any project = everyone up to date

### What gets published vs what stays in-repo

| Published (same in all projects)          | In-repo (varies per project)         |
| ----------------------------------------- | ------------------------------------ |
| @nyxidiom/ui (components, design system)  | packages/db (domain schemas)         |
| @nyxidiom/config (ESLint, TS, Prettier)   | packages/auth (providers, callbacks) |
| @nyxidiom/email (base templates)          | packages/payments (plans, webhooks)  |
| @nyxidiom/shared (validations, utils)     |                                      |

**Rule:** if you would modify it per project, it goes in-repo. If it should NOT change between projects, it gets published.

### Workflow

1. Dev finds a bug in `<Input/>` → fix in nyxidiom-packages repo
2. Commit with changeset → CI automatically publishes new version
3. In each client project: `pnpm update @nyxidiom/ui`
4. All projects have the fix. Zero drift.

### Per-project customization: wrap, never fork

```ts
// GOOD: wrapper that extends the base component
import { Input } from '@nyxidiom/ui'
export function CurrencyInput(props) {
  return <Input inputMode="decimal" {...props} />
}

// BAD: copy Input to the project and modify it
```

---

## ADR-018: Design System without a Designer

### Decision

Design system based on shadcn/ui with minimal per-client customization. No custom illustrations. Minimalist aesthetic in the style of Linear/Vercel.

### Color palette

- Base: shadcn/ui default (Zinc grays)
- Customization: only 1 CSS variable `--primary` per client
- Dark mode: included for free with shadcn/ui
- Do not use external palettes (Nord, Material, etc.)

### Typography

- Geist Sans (by Vercel): free, modern, optimized for interfaces
- Geist Mono: for code blocks
- Alternative: Inter
- Loaded with next/font (zero layout shift)

### Iconography

- Lucide React: +1,500 icons, tree-shakeable, consistent style
- Simple Icons: only for brand logos (Google, GitHub in social login)
- No custom icon sets, no SVG sprites

### Illustrations: DO NOT use

- Empty states: large Lucide icon + text
- Error pages: icon + clear message
- Backgrounds: abstract CSS gradients
- Marketing hero: screenshot of the actual product

### Images

- Dashboard screenshots as hero image (what Linear, Vercel do)
- Mesh gradients with pure CSS for backgrounds
- No stock photos (they look generic)
- No custom photos (need a photographer)

### Justification

- No designer on the team: the template must look professional out-of-the-box
- shadcn/ui + Zinc + Geist is the same visual stack as Linear, Vercel, Raycast
- Customizing per client = change 1 color + logo (5 minutes)

---

## ADR-019: Claude Code Configuration for the Team

### Decision

CLAUDE.md at the root and per package + custom commands + shared settings. Configured in BOTH repos.

### Structure

```
nyxidiom-packages/ (repo 1)
  CLAUDE.md                  → Design system stack, component rules
  packages/ui/CLAUDE.md      → UI rules, component API
  packages/shared/CLAUDE.md  → Validation and utils rules

saas-template/ (repo 2)
  CLAUDE.md                  → Full stack, conventions, commands
  .claude/settings.json      → Team permissions (allow/deny)
  .claude/commands/*.md      → Custom commands (/create-module, /create-page, /add-schema)
  apps/web/CLAUDE.md         → App instructions
  packages/*/CLAUDE.md       → Per-package instructions
```

### Benefit

- Consistent style across the entire team
- Claude uses the project's components and patterns
- Instant onboarding: new dev reads CLAUDE.md and is up to speed
- Custom commands eliminate repetitive tasks

---

## ADR-020: Dates, Formatting, and Language

### Decision

- Dates stored in **UTC** in the database
- Date, number, and currency formatting with the browser's **native `Intl`** (no libraries)
- Template in **English** without an i18n library
- Do not include next-intl, i18next, moment.js, or date-fns

### Context

The template serves startups launching in an initial market. i18n from day 1 adds unnecessary complexity. However, users may be in different time zones and locales, so date and number formatting must adapt automatically.

### Alternatives evaluated

| Option                | Pros                                                             | Cons                                                                      |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Native Intl**       | Zero bundle, works in all browsers, auto-detects locale          | No UI translations                                                        |
| date-fns              | Functional API, tree-shakeable                                   | +7KB unnecessary, `Intl` already solves it                                |
| moment.js             | Popular                                                          | 300KB, deprecated, prohibited by ESLint                                   |
| next-intl from day 1  | Multi-language ready                                             | Premature complexity, `[locale]` folders, JSON translation files          |

### Implementation

**Database — always UTC:**

```ts
// Drizzle schema
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
```

**Date formatting — `Intl.DateTimeFormat`:**

```ts
// @nyxidiom/shared
function formatDate(date: Date | string, style: 'short' | 'long' = 'short') {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(undefined, { dateStyle: style }).format(d)
}
// locale=undefined → uses the browser's locale automatically
// Spain: "6 feb 2026" | USA: "Feb 6, 2026" | Japan: "2026/2/6"
```

**Relative dates — `Intl.RelativeTimeFormat`:**

```ts
function formatRelative(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (diff < 60_000) return rtf.format(-Math.floor(diff / 1000), 'second')
  if (diff < 3_600_000) return rtf.format(-Math.floor(diff / 60_000), 'minute')
  if (diff < 86_400_000) return rtf.format(-Math.floor(diff / 3_600_000), 'hour')
  return rtf.format(-Math.floor(diff / 86_400_000), 'day')
}
// Spain: "hace 5 minutos" | USA: "5 minutes ago"
```

**Currency — `Intl.NumberFormat`:**

```ts
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
}
// formatCurrency(29.99, 'EUR') → Spain: "29,99 €" | USA: "€29.99"
```

### Language

- UI in English by default (strings directly in components, not in translation files)
- If a client needs another language: change the strings directly in their project
- If they need multi-language: add `next-intl` with `[locale]` segment in that specific project
- It's not the base template's responsibility

### Benefit

- Zero date/formatting dependencies (0KB extra bundle)
- Dates and numbers adapt to the user's locale automatically
- No i18n complexity until a project needs it
- Easy to evolve: adding `next-intl` later is a localized change, not a rewrite

---

## ADR-021: React Native (Mobile) Scalability

### Decision

The architecture is prepared to add a mobile app with Expo + React Native without restructuring the project. UI is built natively per platform; business logic is shared via packages.

### Context

B2B SaaS is 90%+ web, but some clients need a mobile app (push notifications, offline access, app store presence). The template must be able to scale to mobile without a rewrite.

### Fundamental difference: Server Components don't exist in React Native

| Concept | Next.js (web) | React Native (mobile) |
| --- | --- | --- |
| Server Components | Yes — render on server | No — everything is client |
| Server Actions | Yes — forms call the server directly | No — needs fetch to HTTP API |
| SSR / SSG | Yes — pre-rendered HTML | No — there is no HTML |
| Auth | Cookies / JWT on server | Token stored on device (SecureStore) |
| Rendering | Server + browser | Only on the device |

### Current architecture (web only)

```
┌─────────────────────────────────────────┐
│  apps/web (Next.js)                     │
│                                         │
│  Server Components ──► Direct DB        │
│  Server Actions ────► Direct DB         │
│  /api/webhooks/* ───► Stripe only       │
└─────────────────────────────────────────┘
```

The web does NOT need internal API routes because Server Components/Actions access the DB directly.

### Architecture with mobile (phase 2)

```
┌─────────────────────────────────────────┐
│  apps/web (Next.js)                     │
│                                         │
│  Server Components ──► Direct DB        │
│  Server Actions ────► Direct DB         │
│  /api/v1/* ─────────► API routes (NEW)  │
│  /api/webhooks/* ───► Stripe            │
└──────────────┬──────────────────────────┘
               │ HTTPS
┌──────────────┴──────────────────────────┐
│  apps/mobile (Expo)                     │
│                                         │
│  fetch('/api/v1/...') ──► API routes    │
│  100% client-side                       │
└─────────────────────────────────────────┘
```

The mobile app calls Next.js API routes over HTTP. No separate backend is created.

### What is shared and what is not

| Layer | Shared | Explanation |
| --- | --- | --- |
| packages/db | Yes | Reusable schemas and queries |
| packages/auth | Partial | Verification logic is reused; the login flow changes (OAuth with deep links) |
| packages/payments | Yes | Same Stripe logic |
| @nyxidiom/shared | Yes | Zod validations, types, utils |
| @nyxidiom/ui | No | Web uses shadcn/ui; mobile uses native components (React Native Paper, Tamagui, NativeWind) |
| @nyxidiom/email | Yes | Emails are sent from the server, they don't change |

### Changes needed to add mobile

**1. Create API routes (`/api/v1/*`)**

The web currently uses Server Actions for everything. For mobile, HTTP endpoints must be exposed:

```ts
// apps/web/src/app/api/v1/dashboard/stats/route.ts
import { auth } from '@/lib/auth'
import { db } from 'db'

export async function GET() {
  const session = await auth() // JWT from Authorization header
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const stats = await getStats(db, session.user.id)
  return Response.json(stats)
}
```

No logic is duplicated — the handler calls the same functions as the Server Components.

**2. Auth for mobile**

- Web: cookies with httpOnly (automatic with Auth.js)
- Mobile: OAuth flow with deep links → receives JWT → stores in SecureStore → sends in header `Authorization: Bearer xxx`

The JWT is the same one the web uses. Only how it's obtained and where it's stored changes.

**3. Monorepo structure**

```
apps/
  web/              → Next.js (already exists)
  mobile/           → Expo + React Native (new)
packages/
  db/               → shared
  auth/             → shared (add token-based flow)
  payments/         → shared
  api-client/       → Typed SDK for mobile (new, optional)
```

**4. Typed API client (optional)**

To prevent mobile from duplicating URLs and types, a package can be created to generate the client:

```ts
// packages/api-client/src/index.ts
export function createApiClient(baseUrl: string, token: string) {
  return {
    dashboard: {
      getStats: () => fetch(`${baseUrl}/api/v1/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),
    },
  }
}
```

### Deploy

| App | Platform | Method |
| --- | --- | --- |
| Web | Vercel | Push to main → automatic deploy |
| Mobile | Expo EAS | `eas build` → App Store / Google Play |
| API | Vercel | Same web app, same functions |

No additional server is needed. Next.js API routes run as serverless functions on Vercel, just like the pages.

### Additional cost

| Service | Free | Paid |
| --- | --- | --- |
| Expo EAS Build | 30 builds/month | $99/month (unlimited) |
| Apple Developer | — | $99/year (required for App Store) |
| Google Play | — | $25 one-time (required for Play Store) |
| Vercel (more API calls) | Already included | May increase with heavy mobile traffic |

### When to add mobile

- Do not add mobile at SaaS launch
- Validate product-market fit with web first
- Add mobile when there is real demand (users request an app, push notifications are critical, offline is needed)
- The monorepo is already prepared: `apps/mobile/` + reuse packages

### Alternative: PWA before native

If you only need push notifications and "install to home screen", a PWA is faster to implement:

- Service worker with next-pwa
- Web Push API for notifications
- No app stores or developer accounts needed
- Limitation: cannot access Bluetooth, NFC, HealthKit, etc.

For most B2B SaaS, a PWA is sufficient as a first mobile step
