import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import type { Provider } from 'next-auth/providers'

export function createProviders({
  resendApiKey,
  emailFrom,
}: {
  resendApiKey?: string
  emailFrom?: string
}): Provider[] {
  const providers: Provider[] = [Google]

  if (resendApiKey) {
    providers.push(
      Resend({
        apiKey: resendApiKey,
        from: emailFrom ?? 'App <noreply@example.com>',
      }),
    )
  }

  return providers
}
