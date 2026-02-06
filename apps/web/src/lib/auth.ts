import { createAuthConfig, createProviders } from 'auth'
import { db } from 'db'

const providers = createProviders({
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
})

export const { handlers, auth, signIn, signOut } = createAuthConfig({ db, providers })
