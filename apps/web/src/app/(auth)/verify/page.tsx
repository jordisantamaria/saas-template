import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Email Verified' }

export default function VerifyPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Email verified</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your email has been verified successfully. You can now sign in to your account.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Continue to sign in
      </Link>
    </div>
  )
}
