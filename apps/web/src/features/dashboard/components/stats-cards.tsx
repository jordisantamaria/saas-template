'use client'

import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react'
import { StatsCard } from '@nyxidiom/ui'

interface StatsData {
  totalRevenue: string
  subscriptions: number
  activeUsers: number
  growth: string
}

export function StatsCards({ data }: { data: StatsData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="Total Revenue" value={data.totalRevenue} icon={CreditCard} />
      <StatsCard label="Subscriptions" value={data.subscriptions} icon={Users} />
      <StatsCard label="Active Users" value={data.activeUsers} icon={Activity} />
      <StatsCard label="Growth" value={data.growth} icon={TrendingUp} />
    </div>
  )
}
