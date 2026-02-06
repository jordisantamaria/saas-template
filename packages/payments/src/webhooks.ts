import type Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import type { Database } from 'db'
import { subscriptions, invoices, plans } from 'db/schemas'

type HandleWebhookParams = {
  db: Database
  stripe: Stripe
  payload: string | Buffer
  signature: string
  webhookSecret: string
}

export async function handleWebhook({
  db,
  stripe,
  payload,
  signature,
  webhookSecret,
}: HandleWebhookParams) {
  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(db, stripe, event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(db, event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(db, event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(db, event.data.object)
      break
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(db, event.data.object)
      break
    default:
      break
  }

  return { received: true, type: event.type }
}

async function handleCheckoutCompleted(
  db: Database,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    throw new Error('Missing userId or planId in checkout session metadata')
  }

  const stripeSubscriptionId = session.subscription as string
  const stripeCustomerId = session.customer as string

  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId)

  await db
    .insert(subscriptions)
    .values({
      userId,
      planId,
      stripeSubscriptionId,
      stripeCustomerId,
      status: 'active',
      currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        planId,
        status: 'active',
        stripeCustomerId,
        currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        updatedAt: new Date(),
      },
    })
}

async function handleSubscriptionUpdated(db: Database, sub: Stripe.Subscription) {
  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, sub.id),
  })

  if (!existing) return

  const priceId = sub.items.data[0]?.price.id
  const plan = priceId
    ? await db.query.plans.findFirst({
        where: eq(plans.stripePriceId, priceId),
      })
    : null

  await db
    .update(subscriptions)
    .set({
      status: mapStripeStatus(sub.status),
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end ? new Date(sub.current_period_end * 1000) : null,
      ...(plan ? { planId: plan.id } : {}),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, sub.id))
}

async function handleSubscriptionDeleted(db: Database, sub: Stripe.Subscription) {
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, sub.id))
}

async function handleInvoicePaymentSucceeded(db: Database, invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.userId

  if (!userId) return

  await db
    .insert(invoices)
    .values({
      userId,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'paid',
      invoiceUrl: invoice.hosted_invoice_url ?? null,
      paidAt: new Date(),
    })
    .onConflictDoUpdate({
      target: invoices.stripeInvoiceId,
      set: {
        status: 'paid',
        amount: invoice.amount_paid,
        invoiceUrl: invoice.hosted_invoice_url ?? null,
        paidAt: new Date(),
        updatedAt: new Date(),
      },
    })
}

async function handleInvoicePaymentFailed(db: Database, invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.userId

  if (!userId) return

  await db
    .insert(invoices)
    .values({
      userId,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'uncollectible',
      invoiceUrl: invoice.hosted_invoice_url ?? null,
    })
    .onConflictDoUpdate({
      target: invoices.stripeInvoiceId,
      set: {
        status: 'uncollectible',
        amount: invoice.amount_due,
        invoiceUrl: invoice.hosted_invoice_url ?? null,
        updatedAt: new Date(),
      },
    })

  if (invoice.subscription) {
    const subId =
      typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id
    await db
      .update(subscriptions)
      .set({
        status: 'past_due',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subId))
  }
}

function mapStripeStatus(
  status: Stripe.Subscription.Status,
): 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' {
  const statusMap: Record<
    string,
    'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  > = {
    active: 'active',
    canceled: 'canceled',
    past_due: 'past_due',
    trialing: 'trialing',
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
    unpaid: 'past_due',
    paused: 'canceled',
  }

  return statusMap[status] ?? 'active'
}
