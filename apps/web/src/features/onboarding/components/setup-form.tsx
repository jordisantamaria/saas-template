'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SetupForm() {
  const router = useRouter()
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: Server action to create org + mark onboarding complete
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Set up your workspace</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create your organization.</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="org-name" className="text-sm font-medium">
          Organization name
        </label>
        <input
          id="org-name"
          type="text"
          required
          placeholder="Acme Inc."
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Workspace'}
      </button>
    </form>
  )
}
