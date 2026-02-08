'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '../actions'

interface ProfileFormProps {
  initialName: string
  email: string
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await updateProfile({ name })

    if (result.success) {
      setMessage('Profile updated.')
      router.refresh()
    } else {
      setMessage(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-medium">Profile</h3>
      <p className="mt-1 text-sm text-muted-foreground">Your personal information.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid max-w-md gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="flex h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
        </div>

        {message && (
          <p
            className={`text-sm ${message === 'Profile updated.' ? 'text-green-600' : 'text-destructive'}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
