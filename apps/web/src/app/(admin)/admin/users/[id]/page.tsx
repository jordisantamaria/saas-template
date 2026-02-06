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

      <div className="grid max-w-md gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="mt-1 font-medium capitalize">{user.role}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Joined</p>
          <p className="mt-1 font-medium">{user.createdAt}</p>
        </div>
      </div>
    </div>
  )
}
