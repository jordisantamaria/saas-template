'use server'

import { z } from 'zod'
import { emailSchema } from '@nyxidiom/shared'
import { createAction } from '@/lib/safe-action'
import { signIn, signOut } from '@/lib/auth'

export const signInWithEmail = createAction({
  requireAuth: false,
  schema: z.object({ email: emailSchema }),
  handler: async ({ input }) => {
    await signIn('resend', { email: input.email, redirect: false })
    return { success: true }
  },
})

export const signInWithGoogle = createAction({
  requireAuth: false,
  handler: async () => {
    await signIn('google', { redirectTo: '/dashboard' })
    return { success: true }
  },
})

export const signOutAction = createAction({
  handler: async () => {
    await signOut({ redirectTo: '/login' })
    return { success: true }
  },
})
