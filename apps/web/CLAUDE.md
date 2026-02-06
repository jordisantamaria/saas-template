# apps/web

Next.js 15 application with App Router.

## Structure

```
src/
  app/                    — Route handlers and pages
    (marketing)/          — Public marketing pages (SSG)
    (legal)/              — Terms, privacy pages
    (auth)/               — Login, register, check-email
    (onboarding)/         — Welcome, setup wizard
    (dashboard)/          — Protected dashboard pages
    (admin)/              — Admin-only pages (role check)
    api/                  — API routes
  components/layouts/     — Shared layout components
  features/               — Feature modules
    auth/                 — Auth forms, social buttons, user menu
    billing/              — Pricing, checkout, subscription status
    dashboard/            — Stats cards, activity feed
    settings/             — Profile, team, notifications
    marketing/            — Hero, features, pricing sections
    admin/                — Admin stats, user tables, charts
    onboarding/           — Welcome and setup forms
  lib/                    — Shared utilities
    auth.ts               — NextAuth config
    services.ts           — Payment service instances
    safe-action.ts        — Server action wrapper (auth + zod)
    logger.ts             — Structured JSON logger
    utils.ts              — cn() helper
  middleware.ts           — Auth + rate limiting
```

## Route Groups

| Group         | Auth     | Layout                    |
|---------------|----------|---------------------------|
| (marketing)   | None     | Header + Footer           |
| (legal)       | None     | Header + Footer (narrow)  |
| (auth)        | None     | Centered, logo            |
| (onboarding)  | Required | Minimal, progress         |
| (dashboard)   | Required | Sidebar + Header          |
| (admin)       | Admin    | Admin sidebar + Header    |

## Conventions

- Server Components by default
- `'use client'` only for interactive components (forms, menus)
- Use `@/` alias for imports
- Feature components go in `features/[name]/components/`
- Server actions go in `features/[name]/actions.ts`
- Use `createAction()` wrapper for all server actions
