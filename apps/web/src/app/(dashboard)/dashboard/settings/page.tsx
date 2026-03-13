import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from 'db'
import { users, accounts } from 'db/schemas'
import { eq } from 'drizzle-orm'
import { ProfileForm, ConnectedAccounts, DeleteAccount } from '@/features/settings'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [currentUser, userAccounts] = await Promise.all([
    db.query.users.findFirst({
      columns: { image: true },
      where: eq(users.id, session.user.id),
    }),
    db
      .select({ provider: accounts.provider })
      .from(accounts)
      .where(eq(accounts.userId, session.user.id)),
  ])

  const providers = [...new Set(userAccounts.map((a) => a.provider))]

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings.</p>
      </div>

      <ProfileForm
        initialName={session.user.name ?? ''}
        email={session.user.email ?? ''}
        initialImage={currentUser?.image ?? null}
      />

      <ConnectedAccounts providers={providers} />

      <DeleteAccount />
    </div>
  )
}
