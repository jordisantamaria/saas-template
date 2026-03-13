import type { Metadata } from 'next'
import { AdminStats, RevenueChart } from '@/features/admin'

export const metadata: Metadata = { title: 'Admin' }

export default function AdminPage() {
  // TODO: Fetch real admin stats
  const stats = {
    totalUsers: 0,
    mrr: '$0.00',
    activeSubscriptions: 0,
    churnRate: '0%',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform metrics and management.</p>
      </div>

      <AdminStats data={stats} />
      <RevenueChart />
    </div>
  )
}
