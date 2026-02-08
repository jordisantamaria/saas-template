import { createAuthConfig, createProviders } from 'auth'
import { db } from 'db'
import { users, accounts, sessions, verificationTokens } from 'db/schemas'

const providers = createProviders({
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
})

export const { handlers, auth, signIn, signOut } = createAuthConfig({
  db,
  tables: { users, accounts, sessions, verificationTokens },
  providers,
})
