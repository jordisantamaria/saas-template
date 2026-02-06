'use server'

import { z } from 'zod'
import { createAction } from '@/lib/safe-action'
import { db } from 'db'
import { users } from 'db/schemas'
import { eq } from 'drizzle-orm'

export const getUsers = createAction({
  handler: async ({ userRole }) => {
    if (userRole !== 'admin') throw new Error('Forbidden')
    const allUsers = await db.select().from(users)
    return allUsers
  },
})

export const getUserById = createAction({
  schema: z.object({ id: z.string().uuid() }),
  handler: async ({ input, userRole }) => {
    if (userRole !== 'admin') throw new Error('Forbidden')
    const [user] = await db.select().from(users).where(eq(users.id, input.id))
    if (!user) throw new Error('User not found')
    return user
  },
})

export const updateUserRole = createAction({
  schema: z.object({
    userId: z.string().uuid(),
    role: z.enum(['member', 'admin']),
  }),
  handler: async ({ input, userRole }) => {
    if (userRole !== 'admin') throw new Error('Forbidden')
    await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId))
    return { success: true }
  },
})
