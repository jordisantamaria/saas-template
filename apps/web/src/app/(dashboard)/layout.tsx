export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from 'db'
import { users } from 'db/schemas'
import { eq } from 'drizzle-orm'
import { Sidebar } from '@/components/layouts/sidebar'
import { Header } from '@/components/layouts/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [user] = await db
    .select({ onboardingCompleted: users.onboardingCompleted })
    .from(users)
    .where(eq(users.id, session.user.id))

  if (!user?.onboardingCompleted) {
    redirect('/welcome')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
