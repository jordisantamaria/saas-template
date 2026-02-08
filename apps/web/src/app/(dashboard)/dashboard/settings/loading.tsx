function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ''}`} />
}

export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {/* Profile form skeleton */}
      <div className="grid max-w-md gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Connected accounts skeleton */}
      <div className="rounded-lg border p-6">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Danger zone skeleton */}
      <div className="rounded-lg border border-destructive/30 p-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-2 h-4 w-80" />
        <Skeleton className="mt-4 h-9 w-32" />
      </div>
    </div>
  )
}
