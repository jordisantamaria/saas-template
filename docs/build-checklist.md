# Build Checklist — Nyxidiom SaaS Template

> Check off with [x] as each item is completed. Organized by build order.

---

# REPO 1: `nyxidiom-packages`

## P1. Repo setup

- [x] Initialize repo with git
- [x] Root `package.json` with workspaces
- [x] `pnpm-workspace.yaml`
- [x] `turbo.json` (build, dev, lint, test, typecheck)
- [x] `.gitignore`
- [x] `.nvmrc` (Node 22)
- [x] Changesets configured
- [x] Root `CLAUDE.md`
- [x] `README.md`

## P2. `@nyxidiom/config`

- [x] `package.json`
- [x] Base ESLint config
- [x] ESLint rule: prohibit `<img>`
- [x] ESLint rule: prohibit heavy imports (moment, lodash)
- [x] ESLint rule: no `any`
- [x] `tsconfig.base.json` (strict)
- [x] `tsconfig.nextjs.json`
- [x] `tsconfig.library.json`
- [x] Prettier config
- [x] Base Sentry config

## P3. `@nyxidiom/ui` — Setup

- [x] `package.json`
- [x] Tailwind CSS v4
- [x] shadcn/ui installed and configured
- [x] Base theme CSS variables (Zinc + customizable --primary)
- [x] Geist Sans + Geist Mono as fonts

## P4. `@nyxidiom/ui` — Base components

- [x] Button (default, secondary, outline, ghost, destructive)
- [x] Input
- [x] Textarea
- [x] Select
- [x] Checkbox
- [x] Switch
- [x] Dialog / Modal
- [x] Dropdown Menu
- [x] Card
- [x] Badge
- [x] Avatar
- [x] Tooltip
- [x] Toast / Sonner
- [x] Tabs
- [x] Separator
- [x] Label
- [x] Form (react-hook-form + zod integration)
- [x] Sheet (mobile sidebar)
- [x] Command (cmdk search palette)
- [x] Popover

## P5. `@nyxidiom/ui` — SaaS components

- [x] DataTable (TanStack Table wrapper: sorting, filtering, pagination)
- [x] PageHeader (title + description + actions)
- [x] EmptyState (Lucide icon + title + description + CTA)
- [x] StatsCard (label + value + trend icon)
- [x] GradientBackground (CSS mesh gradient for hero sections)

## P6. `@nyxidiom/ui` — Skeletons

- [x] Base Skeleton (pulse animation)
- [x] CardSkeleton
- [x] StatsGridSkeleton
- [x] TableSkeleton
- [x] ChartSkeleton

## P7. `@nyxidiom/ui` — Themes

- [x] Base theme (Zinc + neutral primary)
- [x] Dark mode
- [x] Example theme: fintech (blue)
- [x] Example theme: marketing (violet)
- [x] Example theme: health (green)
- [x] Docs: how to create a theme per client

## P8. `@nyxidiom/ui` — Storybook

- [x] Storybook 8 configured
- [x] Stories: all base components (P4)
- [x] Stories: SaaS components (P5)
- [x] Stories: Skeletons (P6)
- [ ] Stories: theme preview (light/dark + primary colors)
- [x] Script `pnpm storybook`

## P9. `@nyxidiom/ui` — Tests

- [x] DataTable: renders data, empty state, sorting
- [ ] Form integration: validation errors display

## P10. `@nyxidiom/ui` — CLAUDE.md

- [x] Component rules, variants, styling

## P11. `@nyxidiom/email`

- [x] `package.json`
- [x] Resend + React Email installed
- [x] Base template layout (logo, footer, unsubscribe)
- [x] Template: Welcome
- [x] Template: Magic link
- [x] Template: Invoice
- [x] Template: Subscription confirmation
- [x] Template: Password reset
- [x] Template: Team invitation
- [x] `createEmailService(resendApiKey)` with sendWelcome, sendMagicLink, sendInvoice, sendTeamInvitation
- [x] CLAUDE.md

## P12. `@nyxidiom/email` — Tests

- [x] Render test: each template renders without errors
- [x] Render test: templates contain expected content (name, links)

## P13. `@nyxidiom/shared`

- [x] `package.json`
- [x] Zod validations: email, password, pagination, id (uuid)
- [x] Shared types: UserRole, PlanType, PaginatedResponse
- [x] Constants: roles, plan names, limits
- [x] Utils: formatCurrency, formatDate, slugify, cn

## P14. `@nyxidiom/shared` — Tests

- [x] Validations: email (valid, invalid, edge cases)
- [x] Validations: password (min length, complexity)
- [x] Validations: pagination (defaults, max limit cap)
- [x] Utils: formatCurrency (EUR, USD, zero, negative)
- [x] Utils: formatDate
- [x] Utils: slugify

## P15. Reference app `apps/reference`

- [ ] Minimal Next.js app
- [ ] Imports and renders components from @nyxidiom/ui
- [ ] Catalog page with all components and themes
- [ ] Verify that build works

## P16. Repo CI/CD

- [x] GitHub Action: lint + typecheck + test (on PR)
- [x] GitHub Action: publish with Changesets (on merge to main)
- [ ] GitHub Packages configured as private registry

---

# REPO 2: `saas-template`

## T1. Repo setup

- [x] Initialize repo with git
- [x] Root `package.json` with workspaces + @nyxidiom/\* deps
- [x] `pnpm-workspace.yaml`
- [x] `turbo.json` (build, dev, lint, test, typecheck)
- [x] `.gitignore`
- [x] `.nvmrc` (Node 22)
- [x] `.npmrc` for GitHub Packages registry
- [ ] Mark as GitHub Template Repository
- [x] `README.md`

## T2. `packages/db`

- [x] `package.json`
- [x] Drizzle ORM + drizzle-kit configured
- [x] Connection to Neon PostgreSQL
- [x] `client.ts` export db
- [x] `schemas/base.ts` — id uuid, createdAt, updatedAt
- [x] `schemas/auth.ts` — users, accounts, sessions, verificationTokens
- [x] `schemas/billing.ts` — plans, subscriptions, invoices
- [x] `schemas/teams.ts` — organizations, members, invitations
- [x] `schemas/index.ts` — re-exports
- [x] Exported inferred types (InferSelect, InferInsert)
- [x] Script `db:generate`
- [x] Script `db:migrate`
- [x] Script `db:studio`
- [x] Script `db:seed`
- [x] CLAUDE.md

## T3. `packages/auth`

- [x] `package.json`
- [x] Auth.js (next-auth v5) installed
- [x] `providers.ts` — Google, Magic Link, Credentials
- [x] `config.ts` — `createAuthConfig()` with Drizzle adapter, JWT strategy
- [x] `callbacks.ts` — jwt + session callbacks
- [x] `middleware.ts` — `createAuthMiddleware()` with protected routes
- [x] `rate-limit.ts` — Upstash rate limiters (auth: 10/min, api: 60/min)
- [x] Extended session types (user.id, user.role, user.orgId)
- [x] CLAUDE.md

## T4. `packages/payments`

- [x] `package.json`
- [x] Stripe SDK installed
- [x] `service.ts` — createPaymentService(db, stripe)
- [x] createCheckoutSession()
- [x] createCustomerPortalSession()
- [x] getSubscription()
- [x] cancelSubscription()
- [x] `webhooks.ts` — handleWebhook()
- [x] Webhook: checkout.session.completed
- [x] Webhook: customer.subscription.updated
- [x] Webhook: customer.subscription.deleted
- [x] Webhook: invoice.payment_succeeded
- [x] Webhook: invoice.payment_failed
- [x] `plans.ts` — free, pro, enterprise
- [x] CLAUDE.md

## T5. `apps/web` — Setup

- [x] Next.js 15 app with App Router
- [x] Tailwind CSS with @nyxidiom/ui theme
- [x] `next.config.ts` (security headers, bundle analyzer)
- [x] Sentry client + server config
- [x] PostHog config
- [x] Geist font via next/font
- [x] `.env.example` with all variables
- [x] `middleware.ts` (auth + rate limiting combined)
- [x] `lib/auth.ts` — NextAuth config with providers
- [x] `lib/services.ts` — service instances
- [x] `lib/safe-action.ts` — Server Actions wrapper (auth + validation + rate limit)
- [x] `lib/logger.ts` — structured logger
- [x] `lib/fetch-with-retry.ts` — retry for external APIs
- [x] `lib/utils.ts` — cn() and helpers

## T6. `apps/web` — Layouts

- [x] `app/layout.tsx` — root layout (fonts, providers, metadata)
- [x] `app/(marketing)/layout.tsx` — marketing header + footer, force-static
- [x] `app/(legal)/layout.tsx` — same marketing layout
- [x] `app/(auth)/layout.tsx` — centered, logo on top, no nav
- [x] `app/(onboarding)/layout.tsx` — minimal, progress bar, no sidebar
- [x] `app/(dashboard)/layout.tsx` — sidebar + header + auth check
- [x] `app/(admin)/layout.tsx` — admin sidebar + role check (admin only)

## T7. `apps/web` — Shared components

- [x] `components/layouts/marketing-header.tsx` — logo + nav + CTA, no auth check
- [x] `components/layouts/footer.tsx`
- [x] `components/layouts/sidebar.tsx` — dashboard sidebar
- [x] `components/layouts/admin-sidebar.tsx` — admin sidebar
- [x] `components/layouts/header.tsx` — dashboard header with user menu
- [x] `components/shared/page-header.tsx`

## T8. Marketing pages (SSG)

- [x] `/` — Landing: hero gradient + screenshot, features with Lucide icons, pricing preview, CTA
- [x] `/pricing` — 3 cards (Free/Pro/Enterprise), feature comparison, FAQ
- [x] `/blog` — post list (placeholder, MDX or CMS)
- [x] `/blog/[slug]` — individual post (ISR)
- [x] `/changelog` — product update timeline

## T9. Legal pages (SSG)

- [x] `/terms` — terms of service
- [x] `/privacy` — privacy policy (GDPR)

## T10. Auth pages

- [x] `/login` — social buttons (Google) on top + separator + magic link form + link to register
- [x] `/register` — social buttons + form (email, name) + link to login + ToS checkbox
- [x] `/check-email` — email icon + "Check your email"
- [x] `/verify` — token verification + redirect to onboarding or dashboard
- [x] `/forgot-password` — email form (only if credentials enabled)
- [x] `/reset-password` — new password form with token
- [x] `/error` — generic error + link to login

## T11. Onboarding pages

- [x] `/welcome` — step 1: name, avatar
- [x] `/setup` — step 2: create org / choose plan

## T12. Dashboard pages

- [x] `/dashboard` — overview: stats cards + recent activity
- [x] `/dashboard/settings` — profile: name, email, avatar
- [x] `/dashboard/settings/billing` — current plan, usage, Stripe portal button
- [x] `/dashboard/settings/team` — member list, roles, invite by email
- [x] `/dashboard/settings/notifications` — email/in-app/marketing toggles

## T13. Dashboard pages — CRUD resource (placeholder)

- [x] `/dashboard/[resource]` — list with DataTable, filters, search, pagination
- [x] `/dashboard/[resource]/new` — creation form
- [x] `/dashboard/[resource]/[id]` — detail view with tabs
- [x] `/dashboard/[resource]/[id]/edit` — edit form

## T14. Admin pages

- [x] `/admin` — overview: total users, MRR, active subs, churn, recent signups
- [x] `/admin/users` — DataTable all users: email, plan, status, registration date
- [x] `/admin/users/[id]` — detail: info, subscription, activity, actions
- [x] `/admin/subscriptions` — DataTable: filter by plan, status, revenue
- [x] `/admin/analytics` — charts: revenue over time, signups, churn, plan distribution

## T15. Error pages

- [x] `not-found.tsx` — 404: Lucide FileQuestion + "Page not found" + Home button
- [x] `error.tsx` — 500: Lucide AlertTriangle + "Something went wrong" + Retry

## T16. Dev page (development only)

- [x] `/catalog` — visual catalog of components, themes (redirect in production)

## T17. API Routes

- [x] `/api/auth/[...nextauth]/route.ts` — Auth.js handler
- [x] `/api/webhooks/stripe/route.ts` — Stripe webhooks (signature verification)
- [x] `/api/health/route.ts` — health check (Edge runtime)

## T18. Features

- [x] `features/auth/components/login-form.tsx`
- [x] `features/auth/components/register-form.tsx`
- [x] `features/auth/components/social-buttons.tsx`
- [x] `features/auth/components/user-menu.tsx`
- [x] `features/auth/actions.ts`
- [x] `features/billing/components/pricing-cards.tsx`
- [x] `features/billing/components/checkout-button.tsx`
- [x] `features/billing/components/subscription-status.tsx`
- [x] `features/billing/actions.ts`
- [x] `features/dashboard/components/stats-cards.tsx`
- [x] `features/dashboard/components/recent-activity.tsx`
- [x] `features/dashboard/actions.ts`
- [x] `features/settings/components/profile-form.tsx`
- [x] `features/settings/components/team-members-table.tsx`
- [x] `features/settings/components/notification-preferences.tsx`
- [x] `features/settings/actions.ts`
- [x] `features/marketing/components/hero.tsx`
- [x] `features/marketing/components/features-section.tsx`
- [x] `features/marketing/components/pricing-section.tsx`
- [x] `features/marketing/components/testimonials.tsx`
- [x] `features/admin/components/admin-stats.tsx`
- [x] `features/admin/components/users-table.tsx`
- [x] `features/admin/components/revenue-chart.tsx`
- [x] `features/admin/actions.ts`
- [x] `features/onboarding/components/welcome-form.tsx`
- [x] `features/onboarding/components/setup-form.tsx`
- [x] `features/onboarding/actions.ts`

## T19. Tests — Unit (Vitest)

- [x] Vitest configured
- [x] `packages/auth/middleware` — public routes pass, protected redirect, logged-in redirects from /login
- [x] `packages/payments/webhooks` — checkout.completed activates sub, subscription.deleted cancels, unknown event doesn't crash
- [x] `lib/safe-action` — validates zod input, rejects without auth, rate limit works

## T20. Tests — E2E (Playwright)

- [x] Playwright configured
- [x] Auth: /dashboard redirects to /login without session
- [x] Auth: /login shows social buttons and form
- [x] Auth: /register shows form and link to login
- [x] Marketing: landing loads and has CTA
- [x] Marketing: /pricing shows the 3 plans
- [x] Error: unknown route shows 404

## T21. Claude Code configuration

- [x] Root `CLAUDE.md`
- [x] `.claude/settings.json` — allow/deny permissions
- [x] `.claude/commands/create-module.md`
- [x] `.claude/commands/create-page.md`
- [x] `.claude/commands/add-schema.md`
- [x] `apps/web/CLAUDE.md`
- [x] `packages/db/CLAUDE.md`
- [x] `packages/auth/CLAUDE.md`

## T22. CI/CD

- [x] GitHub Action: lint + typecheck + test (on PR)
- [x] GitHub Action: build (on PR)
- [x] GitHub Action: weekly database backup
- [x] Renovate or Dependabot configured
- [ ] Vercel project configured
- [ ] Vercel preview deployments
- [ ] Vercel environment variables

## T23. Documentation

- [x] `docs/architecture-decisions.md`
- [x] `docs/build-checklist.md`
- [x] `docs/clean-code.md`
- [x] `docs/playbook.md`
- [x] `docs/pitch.md`
- [x] `docs/setup-cloudflare.md`
- [x] `docs/setup-monitoring.md`
- [x] `docs/new-project-guide.md`

## T24. Scripts

- [x] `pnpm dev`
- [x] `pnpm build`
- [x] `pnpm test`
- [x] `pnpm test:e2e`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm db:generate`
- [x] `pnpm db:migrate`
- [x] `pnpm db:studio`
- [x] `pnpm db:seed`
- [x] `pnpm analyze`
