'use client'

import { Users, CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { StatsCard } from '@nyxidiom/ui'

interface AdminStatsData {
  totalUsers: number
  mrr: string
  activeSubscriptions: number
  churnRate: string
}

export function AdminStats({ data }: { data: AdminStatsData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="Total Users" value={data.totalUsers} icon={Users} />
      <StatsCard label="MRR" value={data.mrr} icon={CreditCard} />
      <StatsCard label="Active Subscriptions" value={data.activeSubscriptions} icon={TrendingUp} />
      <StatsCard label="Churn Rate" value={data.churnRate} icon={TrendingDown} />
    </div>
  )
}
