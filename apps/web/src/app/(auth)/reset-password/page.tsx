import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/features/auth'

export const metadata: Metadata = { title: 'Reset Password' }

export default function ResetPasswordPage() {
  return (
    <div className="grid gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your new password below.</p>
      </div>

      <ResetPasswordForm />
    </div>
  )
}
