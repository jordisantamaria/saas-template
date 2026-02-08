import type Stripe from 'stripe'
import { eq, desc } from 'drizzle-orm'
import type { Database } from 'db'
import { plans, subscriptions, invoices } from 'db/schemas'

type CreatePaymentServiceParams = {
  db: Database
  stripe: Stripe
  appUrl: string
}

export function createPaymentService({ db, stripe, appUrl }: CreatePaymentServiceParams) {
  return {
    async createCheckoutSession({
      userId,
      userEmail,
      planSlug,
    }: {
      userId: string
      userEmail: string
      planSlug: string
    }) {
      const plan = await db.query.plans.findFirst({
        where: eq(plans.slug, planSlug),
      })

      if (!plan?.stripePriceId) {
        throw new Error(`Plan "${planSlug}" not found or missing Stripe Price ID`)
      }

      // Check if user already has an active subscription
      const existing = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
        orderBy: [desc(subscriptions.createdAt)],
      })

      // If user has an active subscription, update it instead of creating a new checkout
      if (existing?.stripeSubscriptionId && ['active', 'trialing'].includes(existing.status)) {
        const stripeSub = await stripe.subscriptions.retrieve(existing.stripeSubscriptionId)
        const itemId = stripeSub.items.data[0]?.id

        if (itemId) {
          const updated = await stripe.subscriptions.update(existing.stripeSubscriptionId, {
            items: [{ id: itemId, price: plan.stripePriceId }],
            proration_behavior: 'create_prorations',
            metadata: { userId, planId: plan.id },
          })

          // Update DB immediately
          await db
            .update(subscriptions)
            .set({
              planId: plan.id,
              currentPeriodStart: new Date(updated.current_period_start * 1000),
              currentPeriodEnd: new Date(updated.current_period_end * 1000),
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existing.id))

          return { url: null, updated: true }
        }
      }

      // New subscription — create Stripe Checkout
      const stripeCustomerId = existing?.stripeCustomerId

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: stripeCustomerId ?? undefined,
        customer_email: stripeCustomerId ? undefined : userEmail,
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard/settings/billing?success=true`,
        cancel_url: `${appUrl}/dashboard/settings/billing?canceled=true`,
        metadata: { userId, planId: plan.id },
        subscription_data: {
          metadata: { userId, planId: plan.id },
        },
      })

      return { url: session.url, sessionId: session.id }
    },

    async createCustomerPortalSession({
      stripeCustomerId,
    }: {
      stripeCustomerId: string
    }) {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${appUrl}/dashboard/settings/billing`,
      })

      return { url: session.url }
    },

    async getSubscription({ userId }: { userId: string }) {
      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
        with: { plan: true },
        orderBy: [desc(subscriptions.createdAt)],
      })

      return sub ?? null
    },

    async cancelSubscription({ stripeSubscriptionId }: { stripeSubscriptionId: string }) {
      const updated = await stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      })

      // Update DB immediately so UI reflects the change without waiting for webhook
      await db
        .update(subscriptions)
        .set({
          cancelAtPeriodEnd: new Date(updated.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))

      return updated
    },

    async resumeSubscription({ stripeSubscriptionId }: { stripeSubscriptionId: string }) {
      const updated = await stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: false,
      })

      await db
        .update(subscriptions)
        .set({
          cancelAtPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))

      return updated
    },
  }
}
