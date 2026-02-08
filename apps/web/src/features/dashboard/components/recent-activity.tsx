interface ActivityItem {
  id: string
  description: string
  timestamp: string
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-4 py-3">
            <p className="text-sm">{item.description}</p>
            <time className="text-xs text-muted-foreground">{item.timestamp}</time>
          </div>
        ))}
      </div>
    </div>
  )
}
