import { Heading, Link, Text } from '@react-email/components'
import { BaseLayout } from '../components/base-layout'

type WelcomeEmailProps = {
  name: string
  dashboardUrl: string
  appName?: string
  logoUrl?: string
}

export function WelcomeEmail({
  name,
  dashboardUrl,
  appName = 'App',
  logoUrl,
}: WelcomeEmailProps) {
  return (
    <BaseLayout preview={`Welcome to ${appName}`} appName={appName} logoUrl={logoUrl}>
      <Heading style={heading}>Welcome, {name}!</Heading>
      <Text style={text}>
        Thanks for signing up for {appName}. We&apos;re excited to have you on board.
      </Text>
      <Text style={text}>
        Get started by visiting your{' '}
        <Link href={dashboardUrl} style={link}>
          dashboard
        </Link>
        .
      </Text>
    </BaseLayout>
  )
}

const heading = { fontSize: '24px', fontWeight: '700', color: '#09090b', marginBottom: '16px' }
const text = { fontSize: '14px', lineHeight: '24px', color: '#3f3f46' }
const link = { color: '#18181b', textDecoration: 'underline' }
