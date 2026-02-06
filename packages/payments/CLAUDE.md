# packages/payments

Stripe integration layer with checkout, subscriptions, and webhook handling.

## Structure

```
src/
  service.ts    — createPaymentService(db, stripe, appUrl)
  webhooks.ts   — handleWebhook() for Stripe events
  plans.ts      — Plan definitions (free, pro, enterprise)
  index.ts
```

## Usage in apps/web

```ts
// lib/services.ts
import Stripe from 'stripe'
import { createPaymentService } from 'payments'
import { db } from 'db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const payments = createPaymentService({
  db,
  stripe,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
})

// Server Action
const { url } = await payments.createCheckoutSession({
  userId: session.user.id,
  userEmail: session.user.email,
  planSlug: 'pro',
})
```

## Webhook Route

```ts
// api/webhooks/stripe/route.ts
import { handleWebhook } from 'payments'

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')!

  const result = await handleWebhook({
    db,
    stripe,
    payload,
    signature,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  })

  return Response.json(result)
}
```

## Webhook Events Handled

- `checkout.session.completed` — Creates subscription record
- `customer.subscription.updated` — Updates status, plan, period
- `customer.subscription.deleted` — Marks subscription as canceled
- `invoice.payment_succeeded` — Records paid invoice
- `invoice.payment_failed` — Records failed invoice, sets sub to past_due

## Conventions

- All amounts in cents (e.g., 2900 = $29.00)
- Stripe metadata carries userId and planId for webhook processing
- Uses onConflictDoUpdate for idempotent webhook handling
- Plan limits: -1 means unlimited
