import type { Metadata } from 'next'
import { StatsCards } from '@/features/dashboard/components/stats-cards'
import { RecentActivity } from '@/features/dashboard/components/recent-activity'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  // TODO: Fetch real data from server actions
  const stats = {
    totalRevenue: '$0.00',
    subscriptions: 0,
    activeUsers: 1,
    growth: '+0%',
  }

  const activity: { id: string; description: string; timestamp: string }[] = []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your workspace activity and metrics.
        </p>
      </div>

      <StatsCards data={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity items={activity} />
      </div>
    </div>
  )
}
