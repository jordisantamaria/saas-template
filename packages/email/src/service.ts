import { Resend } from 'resend'
import { WelcomeEmail } from './templates/welcome'
import { MagicLinkEmail } from './templates/magic-link'
import { InvoiceEmail } from './templates/invoice'
import { SubscriptionConfirmationEmail } from './templates/subscription-confirmation'
import { PasswordResetEmail } from './templates/password-reset'
import { TeamInvitationEmail } from './templates/team-invitation'
import { createElement } from 'react'

type EmailServiceConfig = {
  from: string
  appName?: string
  logoUrl?: string
}

export function createEmailService(resendApiKey: string, config: EmailServiceConfig) {
  const resend = new Resend(resendApiKey)
  const { from, appName, logoUrl } = config

  return {
    async sendWelcome({ to, name, dashboardUrl }: { to: string; name: string; dashboardUrl: string }) {
      return resend.emails.send({
        from,
        to,
        subject: `Welcome to ${appName}`,
        react: createElement(WelcomeEmail, { name, dashboardUrl, appName, logoUrl }),
      })
    },

    async sendMagicLink({ to, magicLinkUrl }: { to: string; magicLinkUrl: string }) {
      return resend.emails.send({
        from,
        to,
        subject: `Sign in to ${appName}`,
        react: createElement(MagicLinkEmail, { magicLinkUrl, appName, logoUrl }),
      })
    },

    async sendInvoice({
      to,
      name,
      invoiceNumber,
      amount,
      planName,
      billingPeriod,
    }: {
      to: string
      name: string
      invoiceNumber: string
      amount: string
      planName: string
      billingPeriod: string
    }) {
      return resend.emails.send({
        from,
        to,
        subject: `Invoice #${invoiceNumber}`,
        react: createElement(InvoiceEmail, {
          name,
          invoiceNumber,
          amount,
          planName,
          billingPeriod,
          appName,
          logoUrl,
        }),
      })
    },

    async sendSubscriptionConfirmation({
      to,
      name,
      planName,
      dashboardUrl,
    }: {
      to: string
      name: string
      planName: string
      dashboardUrl: string
    }) {
      return resend.emails.send({
        from,
        to,
        subject: `You're now on the ${planName} plan`,
        react: createElement(SubscriptionConfirmationEmail, {
          name,
          planName,
          dashboardUrl,
          appName,
          logoUrl,
        }),
      })
    },

    async sendPasswordReset({ to, resetUrl }: { to: string; resetUrl: string }) {
      return resend.emails.send({
        from,
        to,
        subject: `Reset your ${appName} password`,
        react: createElement(PasswordResetEmail, { resetUrl, appName, logoUrl }),
      })
    },

    async sendTeamInvitation({
      to,
      inviterName,
      teamName,
      inviteUrl,
    }: {
      to: string
      inviterName: string
      teamName: string
      inviteUrl: string
    }) {
      return resend.emails.send({
        from,
        to,
        subject: `${inviterName} invited you to join ${teamName}`,
        react: createElement(TeamInvitationEmail, {
          inviterName,
          teamName,
          inviteUrl,
          appName,
          logoUrl,
        }),
      })
    },
  }
}
