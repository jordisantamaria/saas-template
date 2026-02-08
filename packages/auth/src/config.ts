import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import type { NextAuthConfig } from 'next-auth'
import type { Provider } from 'next-auth/providers'

type AuthTables = {
  users: unknown
  accounts: unknown
  sessions: unknown
  verificationTokens: unknown
}

type CreateAuthConfigParams = {
  db: unknown // Drizzle DB instance
  tables: AuthTables
  providers: Provider[]
  pages?: Partial<NextAuthConfig['pages']>
}

export function createAuthConfig({ db, tables, providers, pages }: CreateAuthConfigParams) {
  return NextAuth({
    adapter: DrizzleAdapter(
      db as never,
      {
        usersTable: tables.users,
        accountsTable: tables.accounts,
        sessionsTable: tables.sessions,
        verificationTokensTable: tables.verificationTokens,
      } as never,
    ),
    trustHost: true,
    session: { strategy: 'jwt' },
    providers,
    pages: {
      signIn: '/login',
      signOut: '/login',
      error: '/login',
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
    },
  })
}
