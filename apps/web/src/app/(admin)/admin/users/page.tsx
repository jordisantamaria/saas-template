import type { Metadata } from 'next'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage all platform users.</p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">No users yet.</p>
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  )
}
