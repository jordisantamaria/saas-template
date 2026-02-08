import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import type { Provider } from 'next-auth/providers'

export function createProviders({
  resendApiKey,
  emailFrom,
  sendMagicLink,
}: {
  resendApiKey?: string
  emailFrom?: string
  sendMagicLink?: (params: { to: string; magicLinkUrl: string }) => Promise<void>
}): Provider[] {
  const providers: Provider[] = [Google({ allowDangerousEmailAccountLinking: true })]

  if (resendApiKey) {
    providers.push(
      Resend({
        apiKey: resendApiKey,
        from: emailFrom ?? 'App <noreply@example.com>',
        ...(sendMagicLink && {
          sendVerificationRequest: async ({ identifier, url }) => {
            await sendMagicLink({ to: identifier, magicLinkUrl: url })
          },
        }),
      }),
    )
  }

  return providers
}
