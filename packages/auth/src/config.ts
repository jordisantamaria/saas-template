import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import type { NextAuthConfig } from 'next-auth'
import type { Provider } from 'next-auth/providers'

type CreateAuthConfigParams = {
  db: unknown // Drizzle DB instance
  providers: Provider[]
  pages?: Partial<NextAuthConfig['pages']>
}

export function createAuthConfig({ db, providers, pages }: CreateAuthConfigParams) {
  return NextAuth({
    adapter: DrizzleAdapter(db as never),
    session: { strategy: 'jwt' },
    providers,
    pages: {
      signIn: '/login',
      signOut: '/login',
      error: '/error',
      verifyRequest: '/check-email',
      newUser: '/welcome',
      ...pages,
    },
    callbacks: {
      jwt({ token, user }) {
        if (user) {
          token.id = user.id
          token.role = (user as never as { role: string }).role ?? 'member'
        }
        return token
      },
      session({ session, token }) {
        if (session.user && token) {
          session.user.id = token.id as string
          ;(session.user as never as { role: string }).role = token.role as string
        }
        return session
      },
      authorized({ auth, request }) {
        const isLoggedIn = !!auth?.user
        const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard')
        const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')
        const isOnAuth = ['/login', '/register'].some((p) =>
          request.nextUrl.pathname.startsWith(p),
        )

        if (isOnDashboard || isOnAdmin) {
          return isLoggedIn
        }

        // Redirect logged-in users away from auth pages
        if (isOnAuth && isLoggedIn) {
          return Response.redirect(new URL('/dashboard', request.nextUrl))
        }

        return true
      },
    },
  })
}
