'use server'

import { z } from 'zod'
import { createAction } from '@/lib/safe-action'
import { payments } from '@/lib/services'
import { auth } from '@/lib/auth'

export const createCheckoutSession = createAction({
  schema: z.object({ planSlug: z.string() }),
  handler: async ({ input, userId }) => {
    const session = await auth()
    const result = await payments.createCheckoutSession({
      userId,
      userEmail: session?.user?.email ?? '',
      planSlug: input.planSlug,
    })
    return { url: result.url }
  },
})

export const cancelSubscription = createAction({
  handler: async ({ userId }) => {
    const subscription = await payments.getSubscription({ userId })
    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription found')
    }
    await payments.cancelSubscription({
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    })
    return { success: true }
  },
})

export const resumeSubscription = createAction({
  handler: async ({ userId }) => {
    const subscription = await payments.getSubscription({ userId })
    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription found')
    }
    await payments.resumeSubscription({
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    })
    return { success: true }
  },
})

export const createPortalSession = createAction({
  handler: async () => {
    const session = await auth()
    const stripeCustomerId = (session?.user as unknown as { stripeCustomerId?: string })
      ?.stripeCustomerId
    if (!stripeCustomerId) {
      throw new Error('No billing account found')
    }
    const result = await payments.createCustomerPortalSession({ stripeCustomerId })
    return { url: result.url }
  },
})
