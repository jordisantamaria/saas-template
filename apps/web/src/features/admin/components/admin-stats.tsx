import { Users, CreditCard, TrendingUp, TrendingDown } from 'lucide-react'

type AdminStatsData = {
  totalUsers: number
  mrr: string
  activeSubscriptions: number
  churnRate: string
}

export function AdminStats({ data }: { data: AdminStatsData }) {
  const cards = [
    { label: 'Total Users', value: data.totalUsers.toString(), icon: Users },
    { label: 'MRR', value: data.mrr, icon: CreditCard },
    { label: 'Active Subscriptions', value: data.activeSubscriptions.toString(), icon: TrendingUp },
    { label: 'Churn Rate', value: data.churnRate, icon: TrendingDown },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
