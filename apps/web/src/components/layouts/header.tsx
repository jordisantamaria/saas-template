import Link from 'next/link'
import { auth } from '@/lib/auth'
import { UserMenu } from '@/features/auth/components/user-menu'

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="lg:hidden">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          SaaS App
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {session?.user && (
          <UserMenu name={session.user.name ?? null} email={session.user.email ?? ''} />
        )}
      </div>
    </header>
  )
}
