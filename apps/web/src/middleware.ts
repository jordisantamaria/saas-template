import { createAuthMiddleware } from 'auth'
import { auth } from '@/lib/auth'

export default createAuthMiddleware(auth)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
