# SaaS Template

Production-ready SaaS starter built with Next.js 15, powered by Nyxidiom.

## Quick Start

```bash
# Clone from template
gh repo create my-saas --template nyxidiom/saas-template --private

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Set up database
pnpm db:generate
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
  web/                — Next.js 15 app
packages/
  db/                 — Drizzle ORM schemas + client
  auth/               — Auth.js configuration
  payments/           — Stripe service + webhooks
docs/                 — Architecture decisions, guides
```

## Commands

```bash
pnpm dev              # Start all packages in dev mode
pnpm build            # Build everything
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
pnpm db:studio        # Open Drizzle Studio
```
