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

const AUTH_PATHS = ['/login', '/register']
const PROTECTED_PATHS = ['/dashboard', '/admin']

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))
}

type Session = { user?: { id?: string; role?: string } } | null

export function createAuthMiddleware(getSession: () => Promise<Session>) {
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

    const session = await getSession()
    const isLoggedIn = !!session?.user

    // Protected routes require authentication
    if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // Redirect logged-in users away from auth pages
    if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    return NextResponse.next()
  }
}
