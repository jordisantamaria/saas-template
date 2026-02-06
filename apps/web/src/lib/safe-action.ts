import { auth } from '@/lib/auth'
import type { z } from 'zod'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

type ActionOptions<TInput, TOutput> = {
  schema?: z.ZodType<TInput>
  requireAuth?: boolean
  handler: (params: {
    input: TInput
    userId: string
    userRole: string
  }) => Promise<TOutput>
}

export function createAction<TInput, TOutput>(options: ActionOptions<TInput, TOutput>) {
  return async (rawInput: TInput): Promise<ActionResult<TOutput>> => {
    try {
      // Auth check
      if (options.requireAuth !== false) {
        const session = await auth()
        if (!session?.user?.id) {
          return { success: false, error: 'Unauthorized' }
        }

        // Validate input
        let input = rawInput
        if (options.schema) {
          const parsed = options.schema.safeParse(rawInput)
          if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
          }
          input = parsed.data
        }

        const data = await options.handler({
          input,
          userId: session.user.id,
          userRole: (session.user as unknown as { role: string }).role ?? 'member',
        })

        return { success: true, data }
      }

      // No auth required
      let input = rawInput
      if (options.schema) {
        const parsed = options.schema.safeParse(rawInput)
        if (!parsed.success) {
          return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
        }
        input = parsed.data
      }

      const data = await options.handler({
        input,
        userId: '',
        userRole: 'member',
      })

      return { success: true, data }
    } catch (error) {
      console.error('Action error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      }
    }
  }
}
