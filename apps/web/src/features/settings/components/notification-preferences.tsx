'use client'

import { useState } from 'react'

interface Preferences {
  emailNotifications: boolean
  marketingEmails: boolean
}

export function NotificationPreferences({ initial }: { initial: Preferences }) {
  const [prefs, setPrefs] = useState(initial)

  function toggle(key: keyof Preferences) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
    // TODO: Server action to update preferences
  }

  return (
    <div className="grid max-w-md gap-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Email notifications</p>
          <p className="text-xs text-muted-foreground">Receive emails about account activity.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.emailNotifications}
          onClick={() => toggle('emailNotifications')}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            prefs.emailNotifications ? 'bg-primary' : 'bg-input'
          }`}
        >
          <span
            className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform ${
              prefs.emailNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Marketing emails</p>
          <p className="text-xs text-muted-foreground">Receive product updates and tips.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.marketingEmails}
          onClick={() => toggle('marketingEmails')}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            prefs.marketingEmails ? 'bg-primary' : 'bg-input'
          }`}
        >
          <span
            className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform ${
              prefs.marketingEmails ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
