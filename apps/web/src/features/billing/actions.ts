'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
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
    if (result.url) redirect(result.url)
    return result
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
    if (result.url) redirect(result.url)
    return result
  },
})

export const getSubscription = createAction({
  handler: async ({ userId }) => {
    const subscription = await payments.getSubscription({ userId })
    return subscription
  },
})
