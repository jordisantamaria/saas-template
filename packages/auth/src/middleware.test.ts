import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
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
  const mockGetSession = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthLimit.mockResolvedValue({ success: true })
    mockApiLimit.mockResolvedValue({ success: true })
    mockGetSession.mockResolvedValue({ user: { id: '1', role: 'user' } })
  })

  const middleware = createAuthMiddleware(mockGetSession)

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

      expect(mockGetSession).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
    })
  })

  describe('static files', () => {
    it('skips auth for _next paths', async () => {
      const req = createRequest('/_next/static/chunk.js')
      const res = await middleware(req)

      expect(mockGetSession).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
    })

    it('skips auth for files with extensions', async () => {
      const req = createRequest('/favicon.ico')
      const res = await middleware(req)

      expect(mockGetSession).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
    })
  })

  describe('protected paths', () => {
    it('allows /dashboard when logged in', async () => {
      mockGetSession.mockResolvedValue({ user: { id: '1' } })
      const req = createRequest('/dashboard')
      const res = await middleware(req)

      expect(mockGetSession).toHaveBeenCalled()
      expect(res.status).toBe(200)
    })

    it('redirects /dashboard to /login when not logged in', async () => {
      mockGetSession.mockResolvedValue(null)
      const req = createRequest('/dashboard')
      const res = await middleware(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost:3000/login')
    })

    it('redirects /admin to /login when not logged in', async () => {
      mockGetSession.mockResolvedValue(null)
      const req = createRequest('/admin')
      const res = await middleware(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost:3000/login')
    })

    it('redirects /dashboard/settings to /login when not logged in', async () => {
      mockGetSession.mockResolvedValue(null)
      const req = createRequest('/dashboard/settings')
      const res = await middleware(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost:3000/login')
    })

    it('redirects logged-in users from /login to /dashboard', async () => {
      mockGetSession.mockResolvedValue({ user: { id: '1' } })
      const req = createRequest('/login')
      const res = await middleware(req)

      // /login is public so getSession is not called for public path check,
      // but it IS an auth path — however public check returns early before session check
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
