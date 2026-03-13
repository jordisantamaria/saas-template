# Architecture Overview

## Project Structure

This SaaS template uses a **monorepo** with **Feature Slice Design (FSD)** to maximize scalability and reusability.

```
saas-template/
├── apps/web/src/              → Next.js 15 application
│   ├── app/                   → Route groups (App Router)
│   │   ├── (marketing)/       → Public pages (/, /pricing, /blog)
│   │   ├── (auth)/            → Login, register, password reset
│   │   ├── (dashboard)/       → Protected app area
│   │   ├── (admin)/           → Admin panel (role-gated)
│   │   ├── (onboarding)/      → Post-signup flow
│   │   ├── (legal)/           → Terms, privacy
│   │   └── api/               → Minimal API routes (4 total)
│   │
│   ├── features/              → Feature Slice Design modules
│   │   ├── auth/              → Authentication (cross-cutting)
│   │   ├── billing/           → Stripe payments (cross-cutting)
│   │   ├── admin/             → Admin management
│   │   ├── dashboard/         → Dashboard stats & activity
│   │   ├── marketing/         → Landing page sections
│   │   ├── onboarding/        → User onboarding flow
│   │   └── settings/          → User settings & team
│   │
│   ├── components/            → Shared layout components
│   │   ├── layouts/           → Header, sidebar, footer
│   │   └── shared/            → Reusable UI primitives
│   │
│   └── lib/                   → Utilities & service initialization
│
├── packages/                  → Shared workspace packages
│   ├── db/                    → Drizzle ORM schemas & client
│   ├── auth/                  → Auth.js config & middleware
│   └── payments/              → Stripe service & webhooks
```

## Feature Slice Design

Each feature is a self-contained module with a **barrel export** (`index.ts`) as its public API:

```
features/auth/
├── index.ts           → Public API (barrel export)
├── actions.ts         → Server actions (createAction wrapper)
└── components/        → UI components (Server & Client)
    ├── login-form.tsx
    ├── register-form.tsx
    └── ...
```

### Rules

1. **Import via barrel exports only** — route files import from `@/features/auth`, never from `@/features/auth/components/login-form`
2. **No cross-feature imports** — features don't import from each other. Shared logic goes in `lib/` or `packages/`
3. **Server by default** — components are Server Components unless they need interactivity (`'use client'`)
4. **Actions wrap with `createAction`** — Zod validation, auth check, and error handling in one wrapper

### Import Flow

```
Route (app/)  →  Feature (features/)  →  Package (packages/)
     ↓                  ↓                       ↓
  page.tsx         actions.ts              db, auth, payments
  layout.tsx       components/
```

## Route Groups

Each route group has its own layout providing different UI shells:

| Group | Layout | Auth |
|-------|--------|------|
| `(marketing)` | Marketing header + footer | No |
| `(auth)` | Centered card | No |
| `(dashboard)` | Sidebar + header | Yes + onboarding check |
| `(admin)` | Admin sidebar | Yes + admin role |
| `(onboarding)` | Minimal centered | Yes |

## Monorepo Packages

Shared packages use **dependency injection** (`createXxxService(db, ...)`) so they remain framework-agnostic:

- **`packages/db`** — Drizzle schemas, client, migrations
- **`packages/auth`** — Auth.js config, providers, rate limiting
- **`packages/payments`** — Stripe service, webhook handlers, plan definitions

## Data Flow

- **Data fetching**: Server Components query DB directly via Drizzle
- **Mutations**: Server Actions with `createAction()` wrapper
- **API routes**: Only 4 — auth handler, Stripe webhook, file upload, health check
- **No REST layer needed** for internal operations

## Key Conventions

- Files: `kebab-case.tsx` | Components: `PascalCase`
- Amounts in cents, formatted with `Intl.NumberFormat`
- Dates in UTC, converted to local on display
- No `any` — use `unknown` + narrowing
- Functional only, no classes
