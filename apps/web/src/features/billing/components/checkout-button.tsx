'use client'

import { useState } from 'react'

export function CheckoutButton({
  planSlug,
  label,
  variant = 'primary',
}: {
  planSlug: string
  label: string
  variant?: 'primary' | 'outline'
}) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    // TODO: Server action to create checkout session and redirect
    void planSlug
    setLoading(false)
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
        variant === 'primary'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border hover:bg-accent'
      }`}
    >
      {loading ? 'Loading...' : label}
    </button>
  )
}
