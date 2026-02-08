import { createAuthConfig, createProviders } from 'auth'
import { db } from 'db'
import { users, accounts, sessions, verificationTokens } from 'db/schemas'
import { email } from './email'

const providers = createProviders({
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  sendMagicLink: async ({ to, magicLinkUrl }) => {
    await email.sendMagicLink({ to, magicLinkUrl })
  },
})

export const { handlers, auth, signIn, signOut } = createAuthConfig({
  db,
  tables: { users, accounts, sessions, verificationTokens },
  providers,
})
