'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckoutSession } from '../actions'

export function CheckoutButton({
  planSlug,
  label,
  variant = 'primary',
}: {
  planSlug: string
  label: string
  variant?: 'primary' | 'outline'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')

    try {
      const result = await createCheckoutSession({ planSlug })

      if (result.success) {
        if (result.data.url) {
          // New subscription — redirect to Stripe Checkout
          window.location.href = result.data.url
          return
        }
        // Plan change — already updated, refresh page
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
        onClick={handleCheckout}
        disabled={loading || planSlug === 'free'}
        className={`inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
          variant === 'primary'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'border hover:bg-accent'
        }`}
      >
        {loading ? 'Processing...' : label}
      </button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
