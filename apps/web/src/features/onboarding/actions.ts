'use server'

import { z } from 'zod'
import { slugify } from '@nyxidiom/shared'
import { createAction } from '@/lib/safe-action'
import { email } from '@/lib/email'
import { getAppUrl } from '@/lib/url'
import { db } from 'db'
import { users, organizations, members } from 'db/schemas'
import { eq } from 'drizzle-orm'

const appUrl = getAppUrl()

export const updateUserName = createAction({
  schema: z.object({ name: z.string().min(1).max(100) }),
  handler: async ({ input, userId }) => {
    await db.update(users).set({ name: input.name }).where(eq(users.id, userId))
    return { success: true }
  },
})

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

    await db.update(users).set({ onboardingCompleted: new Date() }).where(eq(users.id, userId))

    // Send welcome email (non-blocking)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true, name: true },
    })
    if (user?.email) {
      email
        .sendWelcome({
          to: user.email,
          name: user.name ?? user.email.split('@')[0] ?? 'there',
          dashboardUrl: `${appUrl}/dashboard`,
        })
        .catch((err) => console.error('Failed to send welcome email:', err))
    }

    return { orgId: org.id }
  },
})
