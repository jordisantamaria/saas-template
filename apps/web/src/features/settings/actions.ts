'use server'

import { z } from 'zod'
import { createAction } from '@/lib/safe-action'
import { db } from 'db'
import { users, subscriptions } from 'db/schemas'
import { eq } from 'drizzle-orm'
import { stripe } from '@/lib/services'
import { storage } from '@/lib/storage'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export const updateProfile = createAction({
  schema: z.object({ name: z.string().min(1).max(100) }),
  handler: async ({ input, userId }) => {
    await db.update(users).set({ name: input.name }).where(eq(users.id, userId))
    return { success: true }
  },
})

export const updateNotificationPreferences = createAction({
  schema: z.object({
    emailNotifications: z.boolean(),
    marketingEmails: z.boolean(),
  }),
  handler: async ({ input, userId }) => {
    // TODO: Store preferences in user metadata or separate table
    void userId
    void input
    return { success: true }
  },
})

export const deleteAccount = createAction({
  schema: z.object({ confirmation: z.literal('DELETE') }),
  handler: async ({ userId }) => {
    // Cancel active Stripe subscriptions before deleting
    const activeSubs = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, userId),
    })
    for (const sub of activeSubs) {
      if (sub.stripeSubscriptionId && sub.status !== 'canceled') {
        await stripe.subscriptions.cancel(sub.stripeSubscriptionId).catch(noop)
      }
    }

    // Clean up avatar from storage (non-blocking)
    const user = await db.query.users.findFirst({
      columns: { image: true },
      where: eq(users.id, userId),
    })
    if (user?.image?.includes('/avatars/')) {
      const key = user.image.split('/').slice(-2).join('/')
      storage.delete(key).catch(noop)
    }

    // FK cascade handles: accounts, sessions, subscriptions, invoices, organizations, members, invitations
    await db.delete(users).where(eq(users.id, userId))
    return { success: true }
  },
})
