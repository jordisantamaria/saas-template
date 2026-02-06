import type Stripe from 'stripe'
import { eq } from 'drizzle-orm'
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
      stripeCustomerId,
    }: {
      userId: string
      userEmail: string
      planSlug: string
      stripeCustomerId?: string
    }) {
      const plan = await db.query.plans.findFirst({
        where: eq(plans.slug, planSlug),
      })

      if (!plan?.stripePriceId) {
        throw new Error(`Plan "${planSlug}" not found or missing Stripe Price ID`)
      }

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
      })

      return sub ?? null
    },

    async cancelSubscription({ stripeSubscriptionId }: { stripeSubscriptionId: string }) {
      return stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    },

    async resumeSubscription({ stripeSubscriptionId }: { stripeSubscriptionId: string }) {
      return stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: false,
      })
    },
  }
}
