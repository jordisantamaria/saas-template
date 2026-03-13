import { notFound } from 'next/navigation'

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params

  // TODO: Fetch user from DB using userId
  void userId
  const user = null as {
    name: string | null
    email: string
    role: string
    createdAt: string
  } | null

  if (!user) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{user.name ?? user.email}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid max-w-lg gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</p>
          <p className="mt-2 text-lg font-semibold capitalize">{user.role}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Joined</p>
          <p className="mt-2 text-lg font-semibold">{user.createdAt}</p>
        </div>
      </div>
    </div>
  )
}
