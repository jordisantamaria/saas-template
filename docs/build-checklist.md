# Build Checklist — Nyxidiom SaaS Template

> Marcar con [x] a medida que se complete. Organizado por orden de construccion.

---

# REPO 1: `nyxidiom-packages`

## P1. Setup del repo

- [x] Inicializar repo con git
- [x] `package.json` raiz con workspaces
- [x] `pnpm-workspace.yaml`
- [x] `turbo.json` (build, dev, lint, test, typecheck)
- [x] `.gitignore`
- [x] `.nvmrc` (Node 22)
- [x] Changesets configurado
- [x] `CLAUDE.md` raiz
- [x] `README.md`

## P2. `@nyxidiom/config`

- [x] `package.json`
- [x] ESLint config base
- [x] ESLint regla: prohibir `<img>`
- [x] ESLint regla: prohibir imports pesados (moment, lodash)
- [x] ESLint regla: no `any`
- [x] `tsconfig.base.json` (strict)
- [x] `tsconfig.nextjs.json`
- [x] `tsconfig.library.json`
- [x] Prettier config
- [x] Sentry config base

## P3. `@nyxidiom/ui` — Setup

- [x] `package.json`
- [x] Tailwind CSS v4
- [x] shadcn/ui instalado y configurado
- [x] Tema base CSS variables (Zinc + --primary customizable)
- [x] Geist Sans + Geist Mono como fuentes

## P4. `@nyxidiom/ui` — Componentes base

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

## P5. `@nyxidiom/ui` — Componentes SaaS

- [x] DataTable (TanStack Table wrapper: sorting, filtering, pagination)
- [x] PageHeader (titulo + descripcion + actions)
- [x] EmptyState (icono Lucide + titulo + descripcion + CTA)
- [x] StatsCard (label + valor + trend icon)
- [x] GradientBackground (CSS mesh gradient para hero sections)

## P6. `@nyxidiom/ui` — Skeletons

- [x] Skeleton base (pulse animation)
- [x] CardSkeleton
- [x] StatsGridSkeleton
- [x] TableSkeleton
- [x] ChartSkeleton

## P7. `@nyxidiom/ui` — Temas

- [x] Tema base (Zinc + neutral primary)
- [x] Dark mode
- [x] Tema ejemplo: fintech (azul)
- [x] Tema ejemplo: marketing (violeta)
- [x] Tema ejemplo: health (verde)
- [x] Docs: como crear tema por cliente

## P8. `@nyxidiom/ui` — Storybook

- [x] Storybook 8 configurado
- [x] Stories: todos los componentes base (P4)
- [x] Stories: componentes SaaS (P5)
- [x] Stories: Skeletons (P6)
- [ ] Stories: preview de temas (light/dark + primary colors)
- [x] Script `pnpm storybook`

## P9. `@nyxidiom/ui` — Tests

- [x] DataTable: renders data, empty state, sorting
- [ ] Form integration: validation errors display

## P10. `@nyxidiom/ui` — CLAUDE.md

- [x] Reglas de componentes, variants, styling

## P11. `@nyxidiom/email`

- [x] `package.json`
- [x] Resend + React Email instalados
- [x] Template base layout (logo, footer, unsubscribe)
- [x] Template: Welcome
- [x] Template: Magic link
- [x] Template: Invoice
- [x] Template: Subscription confirmation
- [x] Template: Password reset
- [x] Template: Team invitation
- [x] `createEmailService(resendApiKey)` con sendWelcome, sendMagicLink, sendInvoice, sendTeamInvitation
- [x] CLAUDE.md

## P12. `@nyxidiom/email` — Tests

- [x] Render test: cada template renderiza sin errores
- [x] Render test: templates contienen contenido esperado (nombre, links)

## P13. `@nyxidiom/shared`

- [x] `package.json`
- [x] Validaciones Zod: email, password, pagination, id (uuid)
- [x] Tipos compartidos: UserRole, PlanType, PaginatedResponse
- [x] Constantes: roles, plan names, limits
- [x] Utils: formatCurrency, formatDate, slugify, cn

## P14. `@nyxidiom/shared` — Tests

- [x] Validaciones: email (validos, invalidos, edge cases)
- [x] Validaciones: password (min length, complexity)
- [x] Validaciones: pagination (defaults, max limit cap)
- [x] Utils: formatCurrency (EUR, USD, zero, negative)
- [x] Utils: formatDate
- [x] Utils: slugify

## P15. App de referencia `apps/reference`

- [ ] Next.js app minima
- [ ] Importa y renderiza componentes de @nyxidiom/ui
- [ ] Pagina catalog con todos los componentes y temas
- [ ] Verifica que build funciona

## P16. CI/CD del repo

- [x] GitHub Action: lint + typecheck + test (on PR)
- [x] GitHub Action: publish con Changesets (on merge to main)
- [ ] GitHub Packages configurado como registry privado

---

# REPO 2: `saas-template`

## T1. Setup del repo

- [x] Inicializar repo con git
- [x] `package.json` raiz con workspaces + deps de @nyxidiom/\*
- [x] `pnpm-workspace.yaml`
- [x] `turbo.json` (build, dev, lint, test, typecheck)
- [x] `.gitignore`
- [x] `.nvmrc` (Node 22)
- [x] `.npmrc` para GitHub Packages registry
- [ ] Marcar como GitHub Template Repository
- [x] `README.md`

## T2. `packages/db`

- [x] `package.json`
- [x] Drizzle ORM + drizzle-kit configurado
- [x] Connection con Neon PostgreSQL
- [x] `client.ts` export db
- [x] `schemas/base.ts` — id uuid, createdAt, updatedAt
- [x] `schemas/auth.ts` — users, accounts, sessions, verificationTokens
- [x] `schemas/billing.ts` — plans, subscriptions, invoices
- [x] `schemas/teams.ts` — organizations, members, invitations
- [x] `schemas/index.ts` — re-exports
- [x] Tipos inferidos exportados (InferSelect, InferInsert)
- [x] Script `db:generate`
- [x] Script `db:migrate`
- [x] Script `db:studio`
- [x] Script `db:seed`
- [x] CLAUDE.md

## T3. `packages/auth`

- [x] `package.json`
- [x] Auth.js (next-auth v5) instalado
- [x] `providers.ts` — Google, Magic Link, Credentials
- [x] `config.ts` — `createAuthConfig()` con Drizzle adapter, JWT strategy
- [x] `callbacks.ts` — jwt + session callbacks
- [x] `middleware.ts` — `createAuthMiddleware()` con rutas protegidas
- [x] `rate-limit.ts` — Rate limiters Upstash (auth: 10/min, api: 60/min)
- [x] Tipos extendidos de sesion (user.id, user.role, user.orgId)
- [x] CLAUDE.md

## T4. `packages/payments`

- [x] `package.json`
- [x] Stripe SDK instalado
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

- [x] Next.js 15 app con App Router
- [x] Tailwind CSS con tema de @nyxidiom/ui
- [x] `next.config.ts` (security headers, bundle analyzer)
- [x] Sentry client + server config
- [x] PostHog config
- [x] Geist font via next/font
- [x] `.env.example` con todas las variables
- [x] `middleware.ts` (auth + rate limiting combinados)
- [x] `lib/auth.ts` — NextAuth config con providers
- [x] `lib/services.ts` — instancias de servicios
- [x] `lib/safe-action.ts` — wrapper Server Actions (auth + validation + rate limit)
- [x] `lib/logger.ts` — logger estructurado
- [x] `lib/fetch-with-retry.ts` — retry para APIs externas
- [x] `lib/utils.ts` — cn() y helpers

## T6. `apps/web` — Layouts

- [x] `app/layout.tsx` — root layout (fonts, providers, metadata)
- [x] `app/(marketing)/layout.tsx` — marketing header + footer, force-static
- [x] `app/(legal)/layout.tsx` — mismo layout marketing
- [x] `app/(auth)/layout.tsx` — centrado, logo arriba, sin nav
- [x] `app/(onboarding)/layout.tsx` — minimal, progress bar, sin sidebar
- [x] `app/(dashboard)/layout.tsx` — sidebar + header + auth check
- [x] `app/(admin)/layout.tsx` — sidebar admin + role check (admin only)

## T7. `apps/web` — Componentes compartidos

- [x] `components/layouts/marketing-header.tsx` — logo + nav + CTA, sin auth check
- [x] `components/layouts/footer.tsx`
- [x] `components/layouts/sidebar.tsx` — dashboard sidebar
- [x] `components/layouts/admin-sidebar.tsx` — admin sidebar
- [x] `components/layouts/header.tsx` — dashboard header con user menu
- [x] `components/shared/page-header.tsx`

## T8. Paginas Marketing (SSG)

- [x] `/` — Landing: hero gradient + screenshot, features con Lucide icons, pricing preview, CTA
- [x] `/pricing` — 3 cards (Free/Pro/Enterprise), feature comparison, FAQ
- [x] `/blog` — lista de posts (placeholder, MDX o CMS)
- [x] `/blog/[slug]` — post individual (ISR)
- [x] `/changelog` — timeline de updates del producto

## T9. Paginas Legales (SSG)

- [x] `/terms` — terminos de servicio
- [x] `/privacy` — politica de privacidad (GDPR)

## T10. Paginas Auth

- [x] `/login` — social buttons (Google) arriba + separador + magic link form + link a register
- [x] `/register` — social buttons + form (email, name) + link a login + checkbox ToS
- [x] `/check-email` — icono email + "Revisa tu email"
- [x] `/verify` — verificacion token + redirect a onboarding o dashboard
- [x] `/forgot-password` — form email (solo si credentials activo)
- [x] `/reset-password` — form nueva password con token
- [x] `/error` — error generico + link a login

## T11. Paginas Onboarding

- [x] `/welcome` — paso 1: nombre, avatar
- [x] `/setup` — paso 2: crear org / elegir plan

## T12. Paginas Dashboard

- [x] `/dashboard` — overview: stats cards + recent activity
- [x] `/dashboard/settings` — profile: nombre, email, avatar
- [x] `/dashboard/settings/billing` — plan actual, usage, boton Stripe portal
- [x] `/dashboard/settings/team` — lista miembros, roles, invitar por email
- [x] `/dashboard/settings/notifications` — toggles email/in-app/marketing

## T13. Paginas Dashboard — Recurso CRUD (placeholder)

- [x] `/dashboard/[recurso]` — lista con DataTable, filtros, search, paginacion
- [x] `/dashboard/[recurso]/new` — form de creacion
- [x] `/dashboard/[recurso]/[id]` — vista detalle con tabs
- [x] `/dashboard/[recurso]/[id]/edit` — form de edicion

## T14. Paginas Admin

- [x] `/admin` — overview: total users, MRR, active subs, churn, signups recientes
- [x] `/admin/users` — DataTable todos los users: email, plan, status, fecha registro
- [x] `/admin/users/[id]` — detalle: info, subscription, actividad, acciones
- [x] `/admin/subscriptions` — DataTable: filtrar por plan, status, revenue
- [x] `/admin/analytics` — charts: revenue over time, signups, churn, plan distribution

## T15. Paginas Error

- [x] `not-found.tsx` — 404: Lucide FileQuestion + "Page not found" + boton Home
- [x] `error.tsx` — 500: Lucide AlertTriangle + "Something went wrong" + Retry

## T16. Pagina Dev (solo desarrollo)

- [x] `/catalog` — visual catalog de componentes, temas (redirect en produccion)

## T17. API Routes

- [x] `/api/auth/[...nextauth]/route.ts` — Auth.js handler
- [x] `/api/webhooks/stripe/route.ts` — Stripe webhooks (verificacion firma)
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

- [x] Vitest configurado
- [x] `packages/auth/middleware` — rutas publicas pasan, protegidas redirigen, logged-in redirige desde /login
- [x] `packages/payments/webhooks` — checkout.completed activa sub, subscription.deleted cancela, unknown event no crashea
- [x] `lib/safe-action` — valida input zod, rechaza sin auth, rate limit funciona

## T20. Tests — E2E (Playwright)

- [x] Playwright configurado
- [x] Auth: /dashboard redirige a /login sin sesion
- [x] Auth: /login muestra social buttons y form
- [x] Auth: /register muestra form y link a login
- [x] Marketing: landing carga y tiene CTA
- [x] Marketing: /pricing muestra los 3 planes
- [x] Error: ruta desconocida muestra 404

## T21. Configuracion Claude Code

- [x] `CLAUDE.md` raiz
- [x] `.claude/settings.json` — permisos allow/deny
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
- [x] Renovate o Dependabot configurado
- [ ] Vercel proyecto configurado
- [ ] Vercel preview deployments
- [ ] Vercel environment variables

## T23. Documentacion

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
