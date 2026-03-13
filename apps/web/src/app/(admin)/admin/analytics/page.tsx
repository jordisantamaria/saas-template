import type { Metadata } from 'next'
import { RevenueChart } from '@/features/admin'

export const metadata: Metadata = { title: 'Analytics - Admin' }

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform analytics and insights.</p>
      </div>

      <div className="grid gap-6">
        <RevenueChart />
      </div>
    </div>
  )
}
