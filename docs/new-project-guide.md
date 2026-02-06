# New Project Guide

Step-by-step guide to create a new client project from this template.

## 1. Create Repository

1. Click **"Use this template"** on GitHub to create a new repo
2. Clone the new repo locally
3. Run `pnpm install`

## 2. Environment Setup

```bash
cp .env.example .env
```

Fill in all required values:

| Variable | How to get it |
|----------|---------------|
| `DATABASE_URL` | Create a Neon project at [neon.tech](https://neon.tech) |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google Cloud Console → APIs → Credentials |
| `AUTH_GOOGLE_SECRET` | Same as above |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `UPSTASH_REDIS_REST_URL` | Create a database at [upstash.com](https://upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Same as above |

## 3. Database Setup

```bash
pnpm db:generate   # Generate migrations from schemas
pnpm db:migrate    # Apply migrations to Neon
pnpm db:seed       # Seed plans (free, pro, enterprise)
```

## 4. Customize for Client

### Branding
- Update `apps/web/src/app/globals.css` — Change primary color in `@theme`
- Update `apps/web/src/app/layout.tsx` — Change app name in metadata
- Replace `public/` assets (favicon, og-image, logo)

### Plans & Pricing
- Edit `packages/payments/src/plans.ts` — Change plan names, prices, features
- Update Stripe Dashboard with matching products and prices
- Re-run `pnpm db:seed` after changes

### Content
- Edit landing page at `apps/web/src/features/marketing/components/hero.tsx`
- Edit features section in `features-section.tsx`
- Update testimonials in `testimonials.tsx`
- Update legal pages in `apps/web/src/app/(legal)/`

### Schema Changes
- Add domain-specific tables in `packages/db/src/schemas/`
- Follow the existing pattern with `baseColumns`
- Run `pnpm db:generate && pnpm db:migrate`

## 5. Stripe Configuration

1. Create products in Stripe matching your plans
2. Add price IDs to plan configuration or use Stripe lookup keys
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy
vercel deploy
```

Add all environment variables in Vercel project settings.

## 7. Post-Deploy Checklist

- [ ] Verify OAuth redirect URIs include production domain
- [ ] Update Stripe webhook URL to production
- [ ] Set up Cloudflare DNS (see `docs/setup-cloudflare.md`)
- [ ] Configure monitoring (see `docs/setup-monitoring.md`)
- [ ] Test full auth flow (register → verify → login → dashboard)
- [ ] Test payment flow (checkout → webhook → subscription active)
- [ ] Verify email delivery (magic link, welcome email)
- [ ] Check security headers at [securityheaders.com](https://securityheaders.com)
