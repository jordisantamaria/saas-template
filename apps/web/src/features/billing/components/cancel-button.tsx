'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cancelSubscription } from '../actions'

export function CancelButton({ variant = 'outline' }: { variant?: 'primary' | 'outline' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCancel() {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? You will keep access until the end of your billing period.',
      )
    ) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await cancelSubscription({})

      if (result.success) {
        router.refresh()
        setLoading(false)
        return
      }

      setError(result.error)
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={loading}
        className={`inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
          variant === 'primary'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'border hover:bg-accent'
        }`}
      >
        {loading ? 'Processing...' : 'Downgrade'}
      </button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
