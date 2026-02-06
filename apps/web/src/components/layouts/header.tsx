import Link from 'next/link'
import { auth } from '@/lib/auth'

export async function Header() {
  const session = await auth()

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
      <div className="lg:hidden">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          SaaS App
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{session.user.email}</span>
          </div>
        )}
      </div>
    </header>
  )
}
