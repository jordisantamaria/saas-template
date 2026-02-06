import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { createAuthMiddleware } from './middleware'

// Mock rate limiters — always allow by default
const mockAuthLimit = vi.fn().mockResolvedValue({ success: true })
const mockApiLimit = vi.fn().mockResolvedValue({ success: true })

vi.mock('./rate-limit', () => ({
  authRateLimit: { limit: (...args: unknown[]) => mockAuthLimit(...args) },
  apiRateLimit: { limit: (...args: unknown[]) => mockApiLimit(...args) },
}))

function createRequest(pathname: string, headers?: Record<string, string>) {
  const url = `http://localhost:3000${pathname}`
  return new NextRequest(url, {
    headers: headers ?? {},
  })
}

describe('createAuthMiddleware', () => {
  const mockAuthMiddleware = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthLimit.mockResolvedValue({ success: true })
    mockApiLimit.mockResolvedValue({ success: true })
    mockAuthMiddleware.mockResolvedValue(NextResponse.next())
  })

  const middleware = createAuthMiddleware(mockAuthMiddleware)

  describe('public paths', () => {
    const publicPaths = [
      '/',
      '/pricing',
      '/blog',
      '/blog/some-post',
      '/changelog',
      '/terms',
      '/privacy',
      '/login',
      '/register',
      '/check-email',
      '/error',
      '/api/health',
      '/api/webhooks',
      '/api/webhooks/stripe',
    ]

    it.each(publicPaths)('allows %s without auth check', async (path) => {
      const req = createRequest(path)
      const res = await middleware(req)

      expect(mockAuthMiddleware).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
    })
  })

  describe('static files', () => {
    it('skips auth for _next paths', async () => {
      const req = createRequest('/_next/static/chunk.js')
      const res = await middleware(req)

      expect(mockAuthMiddleware).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
    })

    it('skips auth for files with extensions', async () => {
      const req = createRequest('/favicon.ico')
      const res = await middleware(req)

      expect(mockAuthMiddleware).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
    })
  })

  describe('protected paths', () => {
    it('calls authMiddleware for /dashboard', async () => {
      const req = createRequest('/dashboard')
      await middleware(req)

      expect(mockAuthMiddleware).toHaveBeenCalledWith(req)
    })

    it('calls authMiddleware for /admin', async () => {
      const req = createRequest('/admin')
      await middleware(req)

      expect(mockAuthMiddleware).toHaveBeenCalledWith(req)
    })

    it('calls authMiddleware for /dashboard/settings', async () => {
      const req = createRequest('/dashboard/settings')
      await middleware(req)

      expect(mockAuthMiddleware).toHaveBeenCalledWith(req)
    })

    it('returns NextResponse.next() when authMiddleware returns null', async () => {
      mockAuthMiddleware.mockResolvedValue(null)
      const req = createRequest('/dashboard')
      const res = await middleware(req)

      expect(res.status).toBe(200)
    })
  })

  describe('rate limiting', () => {
    it('rate limits /api/auth endpoints', async () => {
      const req = createRequest('/api/auth/session')
      await middleware(req)

      expect(mockAuthLimit).toHaveBeenCalledWith('127.0.0.1')
    })

    it('rate limits /api/ endpoints (non-auth)', async () => {
      const req = createRequest('/api/some-endpoint')
      await middleware(req)

      expect(mockApiLimit).toHaveBeenCalledWith('127.0.0.1')
    })

    it('returns 429 when auth rate limit exceeded', async () => {
      mockAuthLimit.mockResolvedValue({ success: false })
      const req = createRequest('/api/auth/session')
      const res = await middleware(req)

      expect(res.status).toBe(429)
    })

    it('returns 429 when api rate limit exceeded', async () => {
      mockApiLimit.mockResolvedValue({ success: false })
      const req = createRequest('/api/some-endpoint')
      const res = await middleware(req)

      expect(res.status).toBe(429)
    })

    it('uses x-forwarded-for header for IP', async () => {
      const req = createRequest('/api/auth/session', {
        'x-forwarded-for': '1.2.3.4',
      })
      await middleware(req)

      expect(mockAuthLimit).toHaveBeenCalledWith('1.2.3.4')
    })
  })
})
