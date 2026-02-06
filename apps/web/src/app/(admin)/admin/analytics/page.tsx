import type { Metadata } from 'next'
import { RevenueChart } from '@/features/admin/components/revenue-chart'

export const metadata: Metadata = { title: 'Analytics - Admin' }

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Platform analytics and insights.</p>
      </div>

      <div className="grid gap-6">
        <RevenueChart />
      </div>
    </div>
  )
}
