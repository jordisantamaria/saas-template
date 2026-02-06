import { type NextRequest, NextResponse } from 'next/server'
import { authRateLimit, apiRateLimit } from './rate-limit'

const PUBLIC_PATHS = [
  '/',
  '/pricing',
  '/blog',
  '/changelog',
  '/terms',
  '/privacy',
  '/login',
  '/register',
  '/check-email',
  '/error',
  '/api/health',
  '/api/webhooks',
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  )
}

export function createAuthMiddleware(authMiddleware: (req: NextRequest) => Promise<NextResponse | Response | null | undefined>) {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'

    // Rate limit auth endpoints
    if (pathname.startsWith('/api/auth')) {
      const { success } = await authRateLimit.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    }

    // Rate limit API endpoints
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
      const { success } = await apiRateLimit.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    }

    // Skip auth check for public paths and static files
    if (isPublicPath(pathname) || pathname.startsWith('/_next') || pathname.includes('.')) {
      return NextResponse.next()
    }

    // Auth middleware for protected routes
    const result = await authMiddleware(request)
    return result ?? NextResponse.next()
  }
}
