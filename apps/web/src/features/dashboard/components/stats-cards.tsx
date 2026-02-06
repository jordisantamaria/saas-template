import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react'

type StatsData = {
  totalRevenue: string
  subscriptions: number
  activeUsers: number
  growth: string
}

export function StatsCards({ data }: { data: StatsData }) {
  const cards = [
    { label: 'Total Revenue', value: data.totalRevenue, icon: CreditCard },
    { label: 'Subscriptions', value: data.subscriptions.toString(), icon: Users },
    { label: 'Active Users', value: data.activeUsers.toString(), icon: Activity },
    { label: 'Growth', value: data.growth, icon: TrendingUp },
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
