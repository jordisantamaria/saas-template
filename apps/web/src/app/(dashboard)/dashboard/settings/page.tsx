import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from 'db'
import { accounts } from 'db/schemas'
import { eq } from 'drizzle-orm'
import { ProfileForm } from '@/features/settings/components/profile-form'
import { ConnectedAccounts } from '@/features/settings/components/connected-accounts'
import { DeleteAccount } from '@/features/settings/components/delete-account'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userAccounts = await db
    .select({ provider: accounts.provider })
    .from(accounts)
    .where(eq(accounts.userId, session.user.id))

  const providers = userAccounts.map((a) => a.provider)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>

      <ProfileForm initialName={session.user.name ?? ''} email={session.user.email ?? ''} />

      <ConnectedAccounts providers={providers} />

      <DeleteAccount />
    </div>
  )
}
