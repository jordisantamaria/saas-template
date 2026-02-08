import Link from 'next/link'
import { auth } from '@/lib/auth'
import { UserMenu } from '@/features/auth/components/user-menu'

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
          <UserMenu
            name={session.user.name ?? null}
            email={session.user.email ?? ''}
          />
        )}
      </div>
    </header>
  )
}
