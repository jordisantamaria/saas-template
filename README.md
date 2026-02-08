# SaaS Template

Production-ready SaaS starter built with Next.js 15, powered by Nyxidiom.

## Quick Start

```bash
# Clone from template
gh repo create my-saas --template nyxidiom/saas-template --private

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Set up database
pnpm db:migrate
pnpm db:seed

# Start development
pnpm dev
```

## What's Included

- **Auth** — Google OAuth + Magic Link (Auth.js)
- **Payments** — Stripe subscriptions, checkout, portal
- **Email** — Transactional emails (Resend + React Email)
- **UI** — 25+ components (shadcn/ui + Tailwind CSS v4)
- **Database** — PostgreSQL + Drizzle ORM (Neon)
- **Security** — Rate limiting, DDoS protection, security headers
- **Monitoring** — Error tracking (Sentry), uptime, analytics (PostHog)
- **CI/CD** — GitHub Actions, Vercel preview deploys

## Project Structure

```
apps/
  web/                — Next.js 15 app (App Router)
packages/
  db/                 — Drizzle ORM schemas + client (Neon)
  auth/               — Auth.js config + middleware + rate limiting
  payments/           — Stripe service + webhooks
docs/                 — Architecture decisions, setup guides
```

## Commands

```bash
pnpm dev              # Start all packages in dev mode
pnpm build            # Build everything
pnpm test             # Run unit tests (Vitest)
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed plans (free, pro, enterprise)
```

## Cloud Services

Todo el entorno (local incluido) usa servicios cloud. No hay Docker.

| Servicio | Uso | Free tier |
|----------|-----|-----------|
| [Neon](https://neon.tech) | PostgreSQL | 10 proyectos, 0.5 GB |
| [Upstash](https://upstash.com) | Redis (rate limiting) | 10K commands/day |
| [Stripe](https://stripe.com) | Pagos | Test mode ilimitado |
| [Resend](https://resend.com) | Email transaccional | 3K emails/mes |
| [Sentry](https://sentry.io) | Error tracking | 5K events/mes |
| [PostHog](https://posthog.com) | Analytics | 1M events/mes |
| [Vercel](https://vercel.com) | Deploy | Hobby plan gratis |
| [Cloudflare](https://cloudflare.com) | CDN / DDoS | Free tier |

Los servicios se comparten por equipo. La unica variable que cambia por desarrollador es `DATABASE_URL` (cada uno usa su propio branch de Neon).

## Onboarding de un nuevo dev

### 1. Requisitos

- Node.js 22+ (`nvm use`)
- pnpm 9+ (`corepack enable`)
- Acceso al repo
- Credenciales del equipo (1Password, Vault, o lo que useis)

### 2. Setup

```bash
git clone git@github.com:org/project.git
cd project
pnpm install
cp .env.example .env
```

### 3. Variables de entorno

Copia las variables compartidas del equipo en `.env`. Todas son identicas para todos **excepto `DATABASE_URL`**.

### 4. Crear tu branch de base de datos

Cada dev trabaja contra su propio branch de Neon (copia aislada de la DB):

1. Entra en [Neon Dashboard](https://console.neon.tech)
2. Proyecto del equipo → **Branches** → **Create Branch**
3. Nombre: `dev-tunombre`
4. Parent: `main`
5. Copia el connection string del branch
6. Pegalo como `DATABASE_URL` en tu `.env`

```bash
# Migrar y seedear tu branch
pnpm db:migrate
pnpm db:seed
```

### 5. Verificar

```bash
pnpm dev        # Abre http://localhost:3000
pnpm typecheck  # 0 errores
pnpm test       # 46 tests pasan
```

### 6. Stripe local (webhooks)

Para probar pagos en local, necesitas el Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copia el `whsec_...` que imprime como `STRIPE_WEBHOOK_SECRET` en tu `.env`.

## Crear un nuevo proyecto de cliente

Ver [docs/new-project-guide.md](docs/new-project-guide.md).

## Configuracion manual de servicios

Ver [docs/manual-setup.md](docs/manual-setup.md) para la checklist completa de setup inicial de todos los servicios.

## Documentacion

| Doc | Contenido |
|-----|-----------|
| [architecture-decisions.md](docs/architecture-decisions.md) | Decisiones tecnicas y trade-offs |
| [build-checklist.md](docs/build-checklist.md) | Checklist de construccion del template |
| [clean-code.md](docs/clean-code.md) | Convenciones de codigo |
| [playbook.md](docs/playbook.md) | Playbook de la agencia |
| [manual-setup.md](docs/manual-setup.md) | Setup manual de servicios cloud |
| [setup-cloudflare.md](docs/setup-cloudflare.md) | Guia de configuracion Cloudflare |
| [setup-monitoring.md](docs/setup-monitoring.md) | Guia de Sentry + PostHog + Better Stack |
| [new-project-guide.md](docs/new-project-guide.md) | Como crear proyecto nuevo desde el template |
