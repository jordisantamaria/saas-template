import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { UsersTable } from '@/features/admin/components/users-table'

export const metadata: Metadata = { title: 'Users - Admin' }

export default function AdminUsersPage() {
  // TODO: Fetch users from DB with pagination
  const users: {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
  }[] = []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage all platform users.</p>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Users className="size-5 text-muted-foreground/70" />
          </div>
          <p className="mt-3 text-sm font-medium">No users yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Users will appear here when they sign up.</p>
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  )
}
