import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { WelcomeForm } from '@/features/onboarding'

export const metadata: Metadata = { title: 'Welcome' }

export default async function WelcomePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return <WelcomeForm initialName={session.user.name ?? ''} />
}
