# Build Checklist — Nyxidiom SaaS Template

> Marcar con [x] a medida que se complete. Organizado por orden de construccion.

---

# REPO 1: `nyxidiom-packages`

## P1. Setup del repo
- [ ] Inicializar repo con git
- [ ] `package.json` raiz con workspaces
- [ ] `pnpm-workspace.yaml`
- [ ] `turbo.json` (build, dev, lint, test, typecheck)
- [ ] `.gitignore`
- [ ] `.nvmrc` (Node 22)
- [ ] Changesets configurado
- [ ] `CLAUDE.md` raiz
- [ ] `README.md`

## P2. `@nyxidiom/config`
- [ ] `package.json`
- [ ] ESLint config base
- [ ] ESLint regla: prohibir `<img>`
- [ ] ESLint regla: prohibir imports pesados (moment, lodash)
- [ ] ESLint regla: no `any`
- [ ] `tsconfig.base.json` (strict)
- [ ] `tsconfig.nextjs.json`
- [ ] `tsconfig.library.json`
- [ ] Prettier config
- [ ] Sentry config base

## P3. `@nyxidiom/ui` — Setup
- [ ] `package.json`
- [ ] Tailwind CSS v4
- [ ] shadcn/ui instalado y configurado
- [ ] Tema base CSS variables (Zinc + --primary customizable)
- [ ] Geist Sans + Geist Mono como fuentes

## P4. `@nyxidiom/ui` — Componentes base
- [ ] Button (default, secondary, outline, ghost, destructive)
- [ ] Input
- [ ] Textarea
- [ ] Select
- [ ] Checkbox
- [ ] Switch
- [ ] Dialog / Modal
- [ ] Dropdown Menu
- [ ] Card
- [ ] Badge
- [ ] Avatar
- [ ] Tooltip
- [ ] Toast / Sonner
- [ ] Tabs
- [ ] Separator
- [ ] Label
- [ ] Form (react-hook-form + zod integration)
- [ ] Sheet (mobile sidebar)
- [ ] Command (cmdk search palette)
- [ ] Popover

## P5. `@nyxidiom/ui` — Componentes SaaS
- [ ] DataTable (TanStack Table wrapper: sorting, filtering, pagination)
- [ ] PageHeader (titulo + descripcion + actions)
- [ ] EmptyState (icono Lucide + titulo + descripcion + CTA)
- [ ] StatsCard (label + valor + trend icon)
- [ ] GradientBackground (CSS mesh gradient para hero sections)

## P6. `@nyxidiom/ui` — Skeletons
- [ ] Skeleton base (pulse animation)
- [ ] CardSkeleton
- [ ] StatsGridSkeleton
- [ ] TableSkeleton
- [ ] ChartSkeleton

## P7. `@nyxidiom/ui` — Temas
- [ ] Tema base (Zinc + neutral primary)
- [ ] Dark mode
- [ ] Tema ejemplo: fintech (azul)
- [ ] Tema ejemplo: marketing (violeta)
- [ ] Tema ejemplo: health (verde)
- [ ] Docs: como crear tema por cliente

## P8. `@nyxidiom/ui` — Storybook
- [ ] Storybook 8 configurado
- [ ] Stories: todos los componentes base (P4)
- [ ] Stories: componentes SaaS (P5)
- [ ] Stories: Skeletons (P6)
- [ ] Stories: preview de temas (light/dark + primary colors)
- [ ] Script `pnpm storybook`

## P9. `@nyxidiom/ui` — Tests
- [ ] DataTable: renders data, empty state, sorting
- [ ] Form integration: validation errors display

## P10. `@nyxidiom/ui` — CLAUDE.md
- [ ] Reglas de componentes, variants, styling

## P11. `@nyxidiom/email`
- [ ] `package.json`
- [ ] Resend + React Email instalados
- [ ] Template base layout (logo, footer, unsubscribe)
- [ ] Template: Welcome
- [ ] Template: Magic link
- [ ] Template: Invoice
- [ ] Template: Subscription confirmation
- [ ] Template: Password reset
- [ ] Template: Team invitation
- [ ] `createEmailService(resendApiKey)` con sendWelcome, sendMagicLink, sendInvoice, sendTeamInvitation
- [ ] CLAUDE.md

## P12. `@nyxidiom/email` — Tests
- [ ] Render test: cada template renderiza sin errores
- [ ] Render test: templates contienen contenido esperado (nombre, links)

## P13. `@nyxidiom/shared`
- [ ] `package.json`
- [ ] Validaciones Zod: email, password, pagination, id (uuid)
- [ ] Tipos compartidos: UserRole, PlanType, PaginatedResponse
- [ ] Constantes: roles, plan names, limits
- [ ] Utils: formatCurrency, formatDate, slugify, cn

## P14. `@nyxidiom/shared` — Tests
- [ ] Validaciones: email (validos, invalidos, edge cases)
- [ ] Validaciones: password (min length, complexity)
- [ ] Validaciones: pagination (defaults, max limit cap)
- [ ] Utils: formatCurrency (EUR, USD, zero, negative)
- [ ] Utils: formatDate
- [ ] Utils: slugify

## P15. App de referencia `apps/reference`
- [ ] Next.js app minima
- [ ] Importa y renderiza componentes de @nyxidiom/ui
- [ ] Pagina catalog con todos los componentes y temas
- [ ] Verifica que build funciona

## P16. CI/CD del repo
- [ ] GitHub Action: lint + typecheck + test (on PR)
- [ ] GitHub Action: publish con Changesets (on merge to main)
- [ ] GitHub Packages configurado como registry privado

---

# REPO 2: `saas-template`

## T1. Setup del repo
- [ ] Inicializar repo con git
- [ ] `package.json` raiz con workspaces + deps de @nyxidiom/*
- [ ] `pnpm-workspace.yaml`
- [ ] `turbo.json` (build, dev, lint, test, typecheck)
- [ ] `.gitignore`
- [ ] `.nvmrc` (Node 22)
- [ ] `.npmrc` para GitHub Packages registry
- [ ] Marcar como GitHub Template Repository
- [ ] `README.md`

## T2. `packages/db`
- [ ] `package.json`
- [ ] Drizzle ORM + drizzle-kit configurado
- [ ] Connection con Neon PostgreSQL
- [ ] `client.ts` export db
- [ ] `schemas/base.ts` — id uuid, createdAt, updatedAt
- [ ] `schemas/auth.ts` — users, accounts, sessions, verificationTokens
- [ ] `schemas/billing.ts` — plans, subscriptions, invoices
- [ ] `schemas/teams.ts` — organizations, members, invitations
- [ ] `schemas/index.ts` — re-exports
- [ ] Tipos inferidos exportados (InferSelect, InferInsert)
- [ ] Script `db:generate`
- [ ] Script `db:migrate`
- [ ] Script `db:studio`
- [ ] Script `db:seed`
- [ ] CLAUDE.md

## T3. `packages/auth`
- [ ] `package.json`
- [ ] Auth.js (next-auth v5) instalado
- [ ] `providers.ts` — Google, Magic Link, Credentials
- [ ] `config.ts` — `createAuthConfig()` con Drizzle adapter, JWT strategy
- [ ] `callbacks.ts` — jwt + session callbacks
- [ ] `middleware.ts` — `createAuthMiddleware()` con rutas protegidas
- [ ] `rate-limit.ts` — Rate limiters Upstash (auth: 10/min, api: 60/min)
- [ ] Tipos extendidos de sesion (user.id, user.role, user.orgId)
- [ ] CLAUDE.md

## T4. `packages/payments`
- [ ] `package.json`
- [ ] Stripe SDK instalado
- [ ] `service.ts` — createPaymentService(db, stripe)
- [ ] createCheckoutSession()
- [ ] createCustomerPortalSession()
- [ ] getSubscription()
- [ ] cancelSubscription()
- [ ] `webhooks.ts` — handleWebhook()
- [ ] Webhook: checkout.session.completed
- [ ] Webhook: customer.subscription.updated
- [ ] Webhook: customer.subscription.deleted
- [ ] Webhook: invoice.payment_succeeded
- [ ] Webhook: invoice.payment_failed
- [ ] `plans.ts` — free, pro, enterprise
- [ ] CLAUDE.md

## T5. `apps/web` — Setup
- [ ] Next.js 15 app con App Router
- [ ] Tailwind CSS con tema de @nyxidiom/ui
- [ ] `next.config.ts` (security headers, bundle analyzer)
- [ ] Sentry client + server config
- [ ] PostHog config
- [ ] Geist font via next/font
- [ ] `.env.example` con todas las variables
- [ ] `middleware.ts` (auth + rate limiting combinados)
- [ ] `lib/auth.ts` — NextAuth config con providers
- [ ] `lib/services.ts` — instancias de servicios
- [ ] `lib/safe-action.ts` — wrapper Server Actions (auth + validation + rate limit)
- [ ] `lib/logger.ts` — logger estructurado
- [ ] `lib/fetch-with-retry.ts` — retry para APIs externas
- [ ] `lib/utils.ts` — cn() y helpers

## T6. `apps/web` — Layouts
- [ ] `app/layout.tsx` — root layout (fonts, providers, metadata)
- [ ] `app/(marketing)/layout.tsx` — marketing header + footer, force-static
- [ ] `app/(legal)/layout.tsx` — mismo layout marketing
- [ ] `app/(auth)/layout.tsx` — centrado, logo arriba, sin nav
- [ ] `app/(onboarding)/layout.tsx` — minimal, progress bar, sin sidebar
- [ ] `app/(dashboard)/layout.tsx` — sidebar + header + auth check
- [ ] `app/(admin)/layout.tsx` — sidebar admin + role check (admin only)

## T7. `apps/web` — Componentes compartidos
- [ ] `components/layouts/marketing-header.tsx` — logo + nav + CTA, sin auth check
- [ ] `components/layouts/footer.tsx`
- [ ] `components/layouts/sidebar.tsx` — dashboard sidebar
- [ ] `components/layouts/admin-sidebar.tsx` — admin sidebar
- [ ] `components/layouts/header.tsx` — dashboard header con user menu
- [ ] `components/shared/page-header.tsx`

## T8. Paginas Marketing (SSG)
- [ ] `/` — Landing: hero gradient + screenshot, features con Lucide icons, pricing preview, CTA
- [ ] `/pricing` — 3 cards (Free/Pro/Enterprise), feature comparison, FAQ
- [ ] `/blog` — lista de posts (placeholder, MDX o CMS)
- [ ] `/blog/[slug]` — post individual (ISR)
- [ ] `/changelog` — timeline de updates del producto

## T9. Paginas Legales (SSG)
- [ ] `/terms` — terminos de servicio
- [ ] `/privacy` — politica de privacidad (GDPR)

## T10. Paginas Auth
- [ ] `/login` — social buttons (Google) arriba + separador + magic link form + link a register
- [ ] `/register` — social buttons + form (email, name) + link a login + checkbox ToS
- [ ] `/check-email` — icono email + "Revisa tu email"
- [ ] `/verify` — verificacion token + redirect a onboarding o dashboard
- [ ] `/forgot-password` — form email (solo si credentials activo)
- [ ] `/reset-password` — form nueva password con token
- [ ] `/error` — error generico + link a login

## T11. Paginas Onboarding
- [ ] `/welcome` — paso 1: nombre, avatar
- [ ] `/setup` — paso 2: crear org / elegir plan

## T12. Paginas Dashboard
- [ ] `/dashboard` — overview: stats cards + recent activity
- [ ] `/dashboard/settings` — profile: nombre, email, avatar
- [ ] `/dashboard/settings/billing` — plan actual, usage, boton Stripe portal
- [ ] `/dashboard/settings/team` — lista miembros, roles, invitar por email
- [ ] `/dashboard/settings/notifications` — toggles email/in-app/marketing

## T13. Paginas Dashboard — Recurso CRUD (placeholder)
- [ ] `/dashboard/[recurso]` — lista con DataTable, filtros, search, paginacion
- [ ] `/dashboard/[recurso]/new` — form de creacion
- [ ] `/dashboard/[recurso]/[id]` — vista detalle con tabs
- [ ] `/dashboard/[recurso]/[id]/edit` — form de edicion

## T14. Paginas Admin
- [ ] `/admin` — overview: total users, MRR, active subs, churn, signups recientes
- [ ] `/admin/users` — DataTable todos los users: email, plan, status, fecha registro
- [ ] `/admin/users/[id]` — detalle: info, subscription, actividad, acciones
- [ ] `/admin/subscriptions` — DataTable: filtrar por plan, status, revenue
- [ ] `/admin/analytics` — charts: revenue over time, signups, churn, plan distribution

## T15. Paginas Error
- [ ] `not-found.tsx` — 404: Lucide FileQuestion + "Page not found" + boton Home
- [ ] `error.tsx` — 500: Lucide AlertTriangle + "Something went wrong" + Retry

## T16. Pagina Dev (solo desarrollo)
- [ ] `/catalog` — visual catalog de componentes, temas (redirect en produccion)

## T17. API Routes
- [ ] `/api/auth/[...nextauth]/route.ts` — Auth.js handler
- [ ] `/api/webhooks/stripe/route.ts` — Stripe webhooks (verificacion firma)
- [ ] `/api/health/route.ts` — health check (Edge runtime)

## T18. Features
- [ ] `features/auth/components/login-form.tsx`
- [ ] `features/auth/components/register-form.tsx`
- [ ] `features/auth/components/social-buttons.tsx`
- [ ] `features/auth/components/user-menu.tsx`
- [ ] `features/auth/actions.ts`
- [ ] `features/billing/components/pricing-cards.tsx`
- [ ] `features/billing/components/checkout-button.tsx`
- [ ] `features/billing/components/subscription-status.tsx`
- [ ] `features/billing/actions.ts`
- [ ] `features/dashboard/components/stats-cards.tsx`
- [ ] `features/dashboard/components/recent-activity.tsx`
- [ ] `features/dashboard/actions.ts`
- [ ] `features/settings/components/profile-form.tsx`
- [ ] `features/settings/components/team-members-table.tsx`
- [ ] `features/settings/components/notification-preferences.tsx`
- [ ] `features/settings/actions.ts`
- [ ] `features/marketing/components/hero.tsx`
- [ ] `features/marketing/components/features-section.tsx`
- [ ] `features/marketing/components/pricing-section.tsx`
- [ ] `features/marketing/components/testimonials.tsx`
- [ ] `features/admin/components/admin-stats.tsx`
- [ ] `features/admin/components/users-table.tsx`
- [ ] `features/admin/components/revenue-chart.tsx`
- [ ] `features/admin/actions.ts`
- [ ] `features/onboarding/components/welcome-form.tsx`
- [ ] `features/onboarding/components/setup-form.tsx`
- [ ] `features/onboarding/actions.ts`

## T19. Tests — Unit (Vitest)
- [ ] Vitest configurado
- [ ] `packages/auth/middleware` — rutas publicas pasan, protegidas redirigen, logged-in redirige desde /login
- [ ] `packages/payments/webhooks` — checkout.completed activa sub, subscription.deleted cancela, unknown event no crashea
- [ ] `lib/safe-action` — valida input zod, rechaza sin auth, rate limit funciona

## T20. Tests — E2E (Playwright)
- [ ] Playwright configurado
- [ ] Auth: /dashboard redirige a /login sin sesion
- [ ] Auth: /login muestra social buttons y form
- [ ] Auth: /register muestra form y link a login
- [ ] Marketing: landing carga y tiene CTA
- [ ] Marketing: /pricing muestra los 3 planes
- [ ] Error: ruta desconocida muestra 404

## T21. Configuracion Claude Code
- [ ] `CLAUDE.md` raiz
- [ ] `.claude/settings.json` — permisos allow/deny
- [ ] `.claude/commands/create-module.md`
- [ ] `.claude/commands/create-page.md`
- [ ] `.claude/commands/add-schema.md`
- [ ] `apps/web/CLAUDE.md`
- [ ] `packages/db/CLAUDE.md`
- [ ] `packages/auth/CLAUDE.md`

## T22. CI/CD
- [ ] GitHub Action: lint + typecheck + test (on PR)
- [ ] GitHub Action: build (on PR)
- [ ] GitHub Action: weekly database backup
- [ ] Renovate o Dependabot configurado
- [ ] Vercel proyecto configurado
- [ ] Vercel preview deployments
- [ ] Vercel environment variables

## T23. Documentacion
- [x] `docs/architecture-decisions.md`
- [x] `docs/build-checklist.md`
- [x] `docs/clean-code.md`
- [x] `docs/playbook.md`
- [x] `docs/pitch.md`
- [ ] `docs/setup-cloudflare.md`
- [ ] `docs/setup-monitoring.md`
- [ ] `docs/new-project-guide.md`

## T24. Scripts
- [ ] `pnpm dev`
- [ ] `pnpm build`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm db:generate`
- [ ] `pnpm db:migrate`
- [ ] `pnpm db:studio`
- [ ] `pnpm db:seed`
- [ ] `pnpm analyze`
