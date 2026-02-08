'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { deleteAccount } from '../actions'

export function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    if (confirmation !== 'DELETE') return
    setLoading(true)
    setError('')

    const result = await deleteAccount({ confirmation: 'DELETE' })
    if (result.success) {
      await signOut({ callbackUrl: '/login' })
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  if (!showConfirm) {
    return (
      <div className="rounded-lg border border-destructive/30 p-6">
        <h3 className="text-lg font-medium text-destructive">Danger zone</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="mt-4 inline-flex h-9 items-center rounded-md border border-destructive/30 px-4 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          Delete account
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-destructive/30 p-6">
      <h3 className="text-lg font-medium text-destructive">Are you sure?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        This will permanently delete your account, all your data, and cancel any active
        subscriptions. Type <strong>DELETE</strong> to confirm.
      </p>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Type DELETE"
          className="flex h-9 w-40 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={handleDelete}
          disabled={confirmation !== 'DELETE' || loading}
          className="inline-flex h-9 items-center rounded-md bg-destructive px-4 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Confirm delete'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowConfirm(false)
            setConfirmation('')
            setError('')
          }}
          className="inline-flex h-9 items-center rounded-md px-4 text-sm text-muted-foreground hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
