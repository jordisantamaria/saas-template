import type { Metadata } from 'next'
import { NotificationPreferences } from '@/features/settings/components/notification-preferences'

export const metadata: Metadata = { title: 'Notifications' }

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Manage your notification preferences.</p>
      </div>

      <NotificationPreferences initial={{ emailNotifications: true, marketingEmails: false }} />
    </div>
  )
}
