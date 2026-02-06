import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Subscriptions - Admin' }

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">Manage all platform subscriptions.</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No subscriptions yet. Subscriptions will appear here when users subscribe.
        </p>
      </div>
    </div>
  )
}
