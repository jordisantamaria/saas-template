import type { Metadata } from 'next'
import { CreditCard } from 'lucide-react'

export const metadata: Metadata = { title: 'Subscriptions - Admin' }

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage all platform subscriptions.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 shadow-sm">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <CreditCard className="size-5 text-muted-foreground/70" />
        </div>
        <p className="mt-3 text-sm font-medium">No subscriptions yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Subscriptions will appear here when users subscribe.
        </p>
      </div>
    </div>
  )
}
