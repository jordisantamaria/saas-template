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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workspace.</p>
      </div>

      <StatsCards data={stats} />
      <RecentActivity items={activity} />
    </div>
  )
}
