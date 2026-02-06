# SaaS Template

Monorepo template for building SaaS applications. Built by Nyxidiom.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **DB:** Neon PostgreSQL + Drizzle ORM
- **Auth:** Auth.js (next-auth v5) — JWT strategy
- **Payments:** Stripe
- **UI:** Tailwind CSS v4 + shadcn/ui (from @nyxidiom/ui)
- **Email:** Resend + React Email (from @nyxidiom/email)

## Structure

```
apps/
  web/              — Next.js 15 app
packages/
  db/               — Drizzle schemas + client
  auth/             — Auth.js config + middleware
  payments/         — Stripe service + webhooks
docs/               — Architecture decisions, guides
```

## Commands

```bash
pnpm dev            # Start all services
pnpm build          # Build all packages + app
pnpm typecheck      # TypeScript check all packages
pnpm lint           # Lint all packages
pnpm test           # Run unit tests
pnpm db:generate    # Generate Drizzle migrations
pnpm db:migrate     # Apply migrations
pnpm db:studio      # Open Drizzle Studio
pnpm db:seed        # Seed initial data
```

## Conventions

- **Files:** kebab-case (e.g., `user-menu.tsx`)
- **Components:** PascalCase (e.g., `UserMenu`)
- **Server Components** by default, `'use client'` as exception
- **Feature-based** folder structure in `apps/web/src/features/`
- **Dependency injection:** `createXxxService(db, ...)` pattern in packages
- **No `any`:** Use `unknown` + type narrowing
- **No classes:** Functional style only
- **Dates:** UTC in DB, `Intl.DateTimeFormat` for display
- **Amounts:** Store in cents, format with `Intl.NumberFormat`

## Adding a new page

1. Create route in `apps/web/src/app/(group)/path/page.tsx`
2. Create feature components in `apps/web/src/features/[feature]/components/`
3. Create server actions in `apps/web/src/features/[feature]/actions.ts`
4. Use `createAction()` from `lib/safe-action.ts` for auth + validation

## Adding a new schema

1. Create or edit file in `packages/db/src/schemas/`
2. Use `baseColumns` for id + timestamps
3. Add relations in same file
4. Export from `packages/db/src/schemas/index.ts`
5. Run `pnpm db:generate` then `pnpm db:migrate`
