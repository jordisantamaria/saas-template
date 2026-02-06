import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SubscriptionStatus } from '@/features/billing/components/subscription-status'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // TODO: Fetch subscription from payments service
  const subscription = null as {
    plan: { name: string }
    status: string
    currentPeriodEnd: Date | null
  } | null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing.</p>
      </div>

      {subscription ? (
        <SubscriptionStatus
          planName={subscription.plan.name}
          status={subscription.status}
          currentPeriodEnd={
            subscription.currentPeriodEnd
              ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
                  subscription.currentPeriodEnd,
                )
              : null
          }
        />
      ) : (
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">
            You are on the <strong>Free</strong> plan.
          </p>
        </div>
      )}
    </div>
  )
}
