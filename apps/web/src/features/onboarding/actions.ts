'use server'

import { z } from 'zod'
import { createAction } from '@/lib/safe-action'
import { db } from 'db'
import { users, organizations, members } from 'db/schemas'
import { eq } from 'drizzle-orm'

export const updateUserName = createAction({
  schema: z.object({ name: z.string().min(1).max(100) }),
  handler: async ({ input, userId }) => {
    await db.update(users).set({ name: input.name }).where(eq(users.id, userId))
    return { success: true }
  },
})

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const createOrganization = createAction({
  schema: z.object({ name: z.string().min(1).max(100) }),
  handler: async ({ input, userId }) => {
    const slug = slugify(input.name) + '-' + Date.now().toString(36)

    const [org] = await db
      .insert(organizations)
      .values({ name: input.name, slug, ownerId: userId })
      .returning()

    if (!org) throw new Error('Failed to create organization')

    await db.insert(members).values({
      organizationId: org.id,
      userId,
      role: 'admin',
    })

    return { orgId: org.id }
  },
})
