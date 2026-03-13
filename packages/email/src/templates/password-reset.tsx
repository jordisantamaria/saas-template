import { Button, Heading, Text } from '@react-email/components'
import { BaseLayout } from '../components/base-layout'

type PasswordResetEmailProps = {
  resetUrl: string
  appName?: string
  logoUrl?: string
}

export function PasswordResetEmail({
  resetUrl,
  appName = 'App',
  logoUrl,
}: PasswordResetEmailProps) {
  return (
    <BaseLayout preview={`Reset your ${appName} password`} appName={appName} logoUrl={logoUrl}>
      <Heading style={heading}>Reset your password</Heading>
      <Text style={text}>
        We received a request to reset your password. Click the button below to choose a new one.
      </Text>
      <Button href={resetUrl} style={button}>
        Reset password
      </Button>
      <Text style={textSmall}>
        This link expires in 1 hour. If you didn&apos;t request a password reset, you can safely
        ignore this email.
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
