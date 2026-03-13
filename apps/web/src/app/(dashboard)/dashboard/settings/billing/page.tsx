import type { Metadata } from 'next'
import { formatDate } from '@nyxidiom/shared'
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
        <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and billing.</p>
      </div>

      {subscription ? (
        <SubscriptionStatus
          planName={subscription.plan.name}
          status={subscription.status}
          currentPeriodEnd={
            subscription.currentPeriodEnd
              ? formatDate(subscription.currentPeriodEnd, 'long')
              : null
          }
          cancelAtPeriodEnd={
            subscription.cancelAtPeriodEnd
              ? formatDate(subscription.cancelAtPeriodEnd, 'long')
              : null
          }
        />
      ) : (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium">Free plan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You are on the free plan. Upgrade to unlock more features.
          </p>
        </div>
      )}

      <div>
        <h2 className="mb-4 font-semibold">Available plans</h2>
        <PricingCards
          currentPlanSlug={subscription?.plan.slug}
          isCanceling={!!subscription?.cancelAtPeriodEnd}
        />
      </div>
    </div>
  )
}
