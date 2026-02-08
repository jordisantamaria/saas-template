'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resumeSubscription } from '../actions'

type SubscriptionStatusProps = {
  planName: string
  status: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: string | null
}

export function SubscriptionStatus({
  planName,
  status,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: SubscriptionStatusProps) {
  const isCanceling = !!cancelAtPeriodEnd
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleResume() {
    setLoading(true)
    try {
      await resumeSubscription({})
      router.refresh()
    } catch {
      // ignore
    }
    setLoading(false)
  }

  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="mt-1 text-xl font-bold">{planName}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isCanceling
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : status === 'past_due'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {isCanceling ? 'canceling' : status}
        </span>
      </div>
      {isCanceling ? (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Your subscription will be canceled on {cancelAtPeriodEnd}. You will keep access until
            then.
          </p>
          <button
            onClick={handleResume}
            disabled={loading}
            className="ml-4 shrink-0 text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            {loading ? 'Resuming...' : 'Resume subscription'}
          </button>
        </div>
      ) : currentPeriodEnd ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Current period ends on {currentPeriodEnd}
        </p>
      ) : null}
    </div>
  )
}
