import Link from 'next/link'
import { Card } from '@nyxidiom/ui'

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-muted/30">
              <td className="px-6 py-4">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="font-medium transition-colors hover:text-primary"
                >
                  {user.name ?? '—'}
                </Link>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    user.role === 'admin'
                      ? 'border border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
