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

The entire environment (including local) uses cloud services. No Docker.

| Service                              | Usage                 | Free tier              |
| ------------------------------------ | --------------------- | ---------------------- |
| [Neon](https://neon.tech)            | PostgreSQL            | 10 projects, 0.5 GB   |
| [Upstash](https://upstash.com)       | Redis (rate limiting) | 10K commands/day       |
| [Stripe](https://stripe.com)         | Payments              | Unlimited test mode    |
| [Resend](https://resend.com)         | Transactional email   | 3K emails/month        |
| [Sentry](https://sentry.io)          | Error tracking        | 5K events/month        |
| [PostHog](https://posthog.com)       | Analytics             | 1M events/month        |
| [Vercel](https://vercel.com)         | Deploy                | Free Hobby plan        |
| [Cloudflare](https://cloudflare.com) | CDN / DDoS            | Free tier              |

Services are shared across the team. The only variable that changes per developer is `DATABASE_URL` (each one uses their own Neon branch).

## Onboarding a New Dev

### 1. Prerequisites

- Node.js 22+ (`nvm use`)
- pnpm 9+ (`corepack enable`)
- Access to the repo
- Team credentials (1Password, Vault, or whatever you use)

### 2. Setup

```bash
git clone git@github.com:org/project.git
cd project
pnpm install
cp .env.example .env
```

### 3. Environment Variables

Copy the shared team variables into `.env`. They are all identical for everyone **except `DATABASE_URL`**.

### 4. Create Your Database Branch

Each dev works against their own Neon branch (an isolated copy of the DB):

1. Go to [Neon Dashboard](https://console.neon.tech)
2. Team project → **Branches** → **Create Branch**
3. Name: `dev-yourname`
4. Parent: `main`
5. Copy the branch's connection string
6. Paste it as `DATABASE_URL` in your `.env`

```bash
# Migrate and seed your branch
pnpm db:migrate
pnpm db:seed
```

### 5. Verify

```bash
pnpm dev        # Open http://localhost:3000
pnpm typecheck  # 0 errors
pnpm test       # 46 tests pass
```

### 6. Local Stripe (webhooks)

To test payments locally, you need the Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` it prints as `STRIPE_WEBHOOK_SECRET` in your `.env`.

## Creating a New Client Project

See [docs/new-project-guide.md](docs/new-project-guide.md).

## Manual Service Setup

See [docs/manual-setup.md](docs/manual-setup.md) for the complete initial setup checklist of all services.

## Documentation

| Doc                                                         | Contents                                          |
| ----------------------------------------------------------- | ------------------------------------------------- |
| [architecture-decisions.md](docs/architecture-decisions.md) | Technical decisions and trade-offs                |
| [build-checklist.md](docs/build-checklist.md)               | Template build checklist                          |
| [clean-code.md](docs/clean-code.md)                         | Code conventions                                  |
| [playbook.md](docs/playbook.md)                             | Agency playbook                                   |
| [manual-setup.md](docs/manual-setup.md)                     | Manual cloud services setup                       |
| [setup-cloudflare.md](docs/setup-cloudflare.md)             | Cloudflare configuration guide                    |
| [setup-monitoring.md](docs/setup-monitoring.md)             | Sentry + PostHog + Vercel Logs guide              |
| [new-project-guide.md](docs/new-project-guide.md)           | How to create a new project from the template     |
