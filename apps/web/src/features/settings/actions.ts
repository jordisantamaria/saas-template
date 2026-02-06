'use server'

import { z } from 'zod'
import { createAction } from '@/lib/safe-action'
import { db } from 'db'
import { users } from 'db/schemas'
import { eq } from 'drizzle-orm'

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
