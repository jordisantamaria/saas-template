import type { Metadata } from 'next'
import { WelcomeForm } from '@/features/onboarding/components/welcome-form'

export const metadata: Metadata = { title: 'Welcome' }

export default function WelcomePage() {
  return <WelcomeForm />
}
