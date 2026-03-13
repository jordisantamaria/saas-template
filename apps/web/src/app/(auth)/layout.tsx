import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <Link href="/" className="mb-8 text-xl font-semibold tracking-tight">
        SaaS App
      </Link>
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">{children}</div>
      <p className="mt-6 text-center text-xs text-muted-foreground/60">
        &copy; {new Date().getFullYear()} SaaS App. All rights reserved.
      </p>
    </div>
  )
}
