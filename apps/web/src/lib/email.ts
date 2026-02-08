import { createEmailService } from '@nyxidiom/email'

export const email = createEmailService(process.env.RESEND_API_KEY ?? '', {
  from: process.env.EMAIL_FROM ?? 'App <noreply@example.com>',
  appName: 'SaaS App',
})
