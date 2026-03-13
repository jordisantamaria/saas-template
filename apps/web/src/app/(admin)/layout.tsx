export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/layouts/admin-sidebar'
import { Header } from '@/components/layouts/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const role = (session?.user as unknown as { role?: string })?.role

  if (role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
