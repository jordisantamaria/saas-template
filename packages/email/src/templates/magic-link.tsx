import { Button, Heading, Text } from '@react-email/components'
import { BaseLayout } from '../components/base-layout'

type MagicLinkEmailProps = {
  magicLinkUrl: string
  appName?: string
  logoUrl?: string
}

export function MagicLinkEmail({
  magicLinkUrl,
  appName = 'App',
  logoUrl,
}: MagicLinkEmailProps) {
  return (
    <BaseLayout preview={`Your login link for ${appName}`} appName={appName} logoUrl={logoUrl}>
      <Heading style={heading}>Sign in to {appName}</Heading>
      <Text style={text}>Click the button below to sign in to your account.</Text>
      <Button href={magicLinkUrl} style={button}>
        Sign in
      </Button>
      <Text style={textSmall}>
        If you didn&apos;t request this email, you can safely ignore it.
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
