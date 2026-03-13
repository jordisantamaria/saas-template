'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Mail } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('resend', {
        email,
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.error) {
        setError('Could not send the sign-in email. Please try again.')
      } else if (result?.ok) {
        window.location.href = '/check-email'
        return
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
      >
        <Mail className="size-4" />
        {loading ? 'Sending link...' : 'Sign in with Email'}
      </button>
    </form>
  )
}
