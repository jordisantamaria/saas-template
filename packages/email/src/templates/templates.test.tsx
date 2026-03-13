import { describe, expect, it } from 'vitest'
import { render } from '@react-email/components'
import { WelcomeEmail } from './welcome'
import { MagicLinkEmail } from './magic-link'
import { InvoiceEmail } from './invoice'
import { SubscriptionConfirmationEmail } from './subscription-confirmation'
import { PasswordResetEmail } from './password-reset'
import { TeamInvitationEmail } from './team-invitation'

describe('email templates', () => {
  it('renders WelcomeEmail without errors', async () => {
    const html = await render(
      <WelcomeEmail name="John" dashboardUrl="https://app.example.com/dashboard" />,
    )
    expect(html).toContain('John')
    expect(html).toContain('dashboard')
  })

  it('renders MagicLinkEmail without errors', async () => {
    const html = await render(
      <MagicLinkEmail magicLinkUrl="https://app.example.com/auth/magic?token=abc" />,
    )
    expect(html).toContain('Sign in')
    expect(html).toContain('token=abc')
  })

  it('renders InvoiceEmail without errors', async () => {
    const html = await render(
      <InvoiceEmail
        name="Jane"
        invoiceNumber="INV-001"
        amount="$29.00"
        planName="Pro"
        billingPeriod="Jan 2025"
      />,
    )
    expect(html).toContain('INV-001')
    expect(html).toContain('$29.00')
    expect(html).toContain('Pro')
  })

  it('renders SubscriptionConfirmationEmail without errors', async () => {
    const html = await render(
      <SubscriptionConfirmationEmail
        name="John"
        planName="Pro"
        dashboardUrl="https://app.example.com/dashboard"
      />,
    )
    expect(html).toContain('Pro')
    expect(html).toContain('dashboard')
  })

  it('renders PasswordResetEmail without errors', async () => {
    const html = await render(
      <PasswordResetEmail resetUrl="https://app.example.com/reset?token=xyz" />,
    )
    expect(html).toContain('Reset')
    expect(html).toContain('token=xyz')
  })

  it('renders TeamInvitationEmail without errors', async () => {
    const html = await render(
      <TeamInvitationEmail
        inviterName="Alice"
        teamName="Acme Corp"
        inviteUrl="https://app.example.com/invite/abc"
      />,
    )
    expect(html).toContain('Alice')
    expect(html).toContain('Acme Corp')
    expect(html).toContain('invite/abc')
  })
})
