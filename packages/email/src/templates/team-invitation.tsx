import { Button, Heading, Text } from '@react-email/components'
import { BaseLayout } from '../components/base-layout'

type TeamInvitationEmailProps = {
  inviterName: string
  teamName: string
  inviteUrl: string
  appName?: string
  logoUrl?: string
}

export function TeamInvitationEmail({
  inviterName,
  teamName,
  inviteUrl,
  appName = 'App',
  logoUrl,
}: TeamInvitationEmailProps) {
  return (
    <BaseLayout
      preview={`${inviterName} invited you to join ${teamName}`}
      appName={appName}
      logoUrl={logoUrl}
    >
      <Heading style={heading}>You&apos;re invited</Heading>
      <Text style={text}>
        <strong>{inviterName}</strong> has invited you to join <strong>{teamName}</strong> on{' '}
        {appName}.
      </Text>
      <Button href={inviteUrl} style={button}>
        Accept invitation
      </Button>
      <Text style={textSmall}>
        If you don&apos;t want to join, you can safely ignore this email.
      </Text>
    </BaseLayout>
  )
}

const heading = { fontSize: '24px', fontWeight: '700', color: '#09090b', marginBottom: '16px' }
const text = { fontSize: '14px', lineHeight: '24px', color: '#3f3f46' }
const textSmall = { fontSize: '12px', lineHeight: '20px', color: '#71717a', marginTop: '24px' }
const button = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#fafafa',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '24px 0',
}
