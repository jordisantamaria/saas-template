import type { Metadata } from 'next'
import { SetupForm } from '@/features/onboarding/components/setup-form'

export const metadata: Metadata = { title: 'Setup' }

export default function SetupPage() {
  return <SetupForm />
}
