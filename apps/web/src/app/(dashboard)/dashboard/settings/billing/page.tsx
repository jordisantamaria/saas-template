import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { payments } from '@/lib/services'
import { SubscriptionStatus } from '@/features/billing/components/subscription-status'
import { PricingCards } from '@/features/billing/components/pricing-cards'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const subscription = await payments.getSubscription({ userId: session.user.id })

  return (
    <div className="max-w-4xl space-y-8">
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
          cancelAtPeriodEnd={
            subscription.cancelAtPeriodEnd
              ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
                  subscription.cancelAtPeriodEnd,
                )
              : null
          }
        />
      ) : (
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">
            You are on the <strong>Free</strong> plan. Upgrade to unlock more features.
          </p>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-medium">Available plans</h2>
        <PricingCards
          currentPlanSlug={subscription?.plan.slug}
          isCanceling={!!subscription?.cancelAtPeriodEnd}
        />
      </div>
    </div>
  )
}
