import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatsCardProps = {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ label, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn('gap-0 transition-shadow duration-200 hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[13px] font-medium text-muted-foreground">{label}</CardTitle>
        {Icon && (
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted/60">
            <Icon className="size-4 text-muted-foreground/70" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums tracking-tight">{value}</div>
        {trend && (
          <div
            className={cn(
              'mt-1.5 flex items-center gap-1 text-xs font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600',
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
