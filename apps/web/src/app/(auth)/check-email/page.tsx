import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Check Your Email' }

export default function CheckEmailPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Mail className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Check your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent you a sign-in link. Click the link in the email to continue.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block text-sm text-muted-foreground underline hover:text-foreground"
      >
        Back to sign in
      </Link>
    </div>
  )
}
