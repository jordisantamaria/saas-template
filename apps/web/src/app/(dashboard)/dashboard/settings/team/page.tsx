import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TeamMembersTable } from '@/features/settings/components/team-members-table'

export const metadata: Metadata = { title: 'Team' }

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // TODO: Fetch team members from DB
  const members = [
    {
      id: session.user.id ?? '1',
      name: session.user.name ?? null,
      email: session.user.email ?? '',
      role: 'admin',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage your team members.</p>
        </div>
        <button className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Invite Member
        </button>
      </div>

      <TeamMembersTable members={members} />
    </div>
  )
}
