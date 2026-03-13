import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@nyxidiom/ui'

interface ActivityItem {
  id: string
  description: string
  timestamp: string
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <span className="text-xs text-muted-foreground">{items.length} events</span>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Activity className="size-5 text-muted-foreground/70" />
            </div>
            <p className="mt-3 text-sm font-medium">No activity yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Activity from your workspace will show up here.
            </p>
          </div>
        ) : (
          <div className="-mx-6 divide-y divide-border/50">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm">{item.description}</p>
                <time className="shrink-0 text-xs text-muted-foreground">{item.timestamp}</time>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
