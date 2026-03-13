'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resumeSubscription } from '../actions'

interface SubscriptionStatusProps {
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
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Plan</p>
          <p className="mt-1.5 text-xl font-bold">{planName}</p>
        </div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            isCanceling
              ? 'border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
              : status === 'active'
                ? 'border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                : status === 'past_due'
                  ? 'border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                  : 'border-rose-200/60 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400'
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
