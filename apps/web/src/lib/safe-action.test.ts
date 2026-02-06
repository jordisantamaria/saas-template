import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { createAction } from './safe-action'

// Mock auth module
const mockAuth = vi.fn()
vi.mock('@/lib/auth', () => ({
  auth: () => mockAuth(),
}))

describe('createAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('with auth required (default)', () => {
    it('returns Unauthorized when no session', async () => {
      mockAuth.mockResolvedValue(null)

      const action = createAction({
        handler: async ({ input }) => input,
      })

      const result = await action('test')
      expect(result).toEqual({ success: false, error: 'Unauthorized' })
    })

    it('returns Unauthorized when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: {} })

      const action = createAction({
        handler: async ({ input }) => input,
      })

      const result = await action('test')
      expect(result).toEqual({ success: false, error: 'Unauthorized' })
    })

    it('calls handler with userId and role when authenticated', async () => {
      mockAuth.mockResolvedValue({
        user: { id: 'user-1', role: 'admin' },
      })

      const handler = vi.fn().mockResolvedValue('result')
      const action = createAction({ handler })

      const result = await action('my-input')

      expect(result).toEqual({ success: true, data: 'result' })
      expect(handler).toHaveBeenCalledWith({
        input: 'my-input',
        userId: 'user-1',
        userRole: 'admin',
      })
    })

    it('defaults role to member', async () => {
      mockAuth.mockResolvedValue({
        user: { id: 'user-1' },
      })

      const handler = vi.fn().mockResolvedValue('ok')
      const action = createAction({ handler })
      await action('test')

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ userRole: 'member' }),
      )
    })
  })

  describe('with schema validation', () => {
    const schema = z.object({
      name: z.string().min(2, 'Name too short'),
      email: z.string().email('Invalid email'),
    })

    it('validates input and returns error on invalid data', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'member' } })

      const action = createAction({
        schema,
        handler: async ({ input }) => input,
      })

      const result = await action({ name: 'a', email: 'bad' } as never)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Name too short')
      }
    })

    it('passes validated data to handler', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'member' } })

      const handler = vi.fn().mockResolvedValue('ok')
      const action = createAction({ schema, handler })

      await action({ name: 'John', email: 'john@example.com' } as never)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { name: 'John', email: 'john@example.com' },
        }),
      )
    })
  })

  describe('with requireAuth: false', () => {
    it('skips auth check', async () => {
      const handler = vi.fn().mockResolvedValue('public-result')
      const action = createAction({
        requireAuth: false,
        handler,
      })

      const result = await action('input')

      expect(mockAuth).not.toHaveBeenCalled()
      expect(result).toEqual({ success: true, data: 'public-result' })
    })

    it('still validates schema without auth', async () => {
      const schema = z.string().min(5, 'Too short')

      const action = createAction({
        requireAuth: false,
        schema,
        handler: async ({ input }) => input,
      })

      const result = await action('ab' as never)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Too short')
      }
    })
  })

  describe('error handling', () => {
    it('catches handler errors and returns failure', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'member' } })

      const action = createAction({
        handler: async () => {
          throw new Error('DB connection failed')
        },
      })

      const result = await action('input')
      expect(result).toEqual({ success: false, error: 'DB connection failed' })
    })

    it('returns generic message for non-Error throws', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'member' } })

      const action = createAction({
        handler: async () => {
          throw 'string error'
        },
      })

      const result = await action('input')
      expect(result).toEqual({ success: false, error: 'Something went wrong' })
    })
  })
})
