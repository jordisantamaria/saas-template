import { Heading, Link, Text } from '@react-email/components'
import { BaseLayout } from '../components/base-layout'

type SubscriptionConfirmationEmailProps = {
  name: string
  planName: string
  dashboardUrl: string
  appName?: string
  logoUrl?: string
}

export function SubscriptionConfirmationEmail({
  name,
  planName,
  dashboardUrl,
  appName = 'App',
  logoUrl,
}: SubscriptionConfirmationEmailProps) {
  return (
    <BaseLayout
      preview={`You're now on the ${planName} plan`}
      appName={appName}
      logoUrl={logoUrl}
    >
      <Heading style={heading}>Subscription confirmed</Heading>
      <Text style={text}>
        Hi {name}, you&apos;re now on the <strong>{planName}</strong> plan.
      </Text>
      <Text style={text}>
        Visit your{' '}
        <Link href={dashboardUrl} style={link}>
          dashboard
        </Link>{' '}
        to start using all the features included in your plan.
      </Text>
    </BaseLayout>
  )
}

const heading = { fontSize: '24px', fontWeight: '700', color: '#09090b', marginBottom: '16px' }
const text = { fontSize: '14px', lineHeight: '24px', color: '#3f3f46' }
const link = { color: '#18181b', textDecoration: 'underline' }
