type SubscriptionStatusProps = {
  planName: string
  status: string
  currentPeriodEnd: string | null
}

export function SubscriptionStatus({ planName, status, currentPeriodEnd }: SubscriptionStatusProps) {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="mt-1 text-xl font-bold">{planName}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : status === 'past_due'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {status}
        </span>
      </div>
      {currentPeriodEnd && (
        <p className="mt-2 text-xs text-muted-foreground">
          Current period ends on {currentPeriodEnd}
        </p>
      )}
    </div>
  )
}
