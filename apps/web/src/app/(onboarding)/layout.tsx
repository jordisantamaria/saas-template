import Link from 'next/link'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <header className="flex h-14 items-center border-b bg-background px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          SaaS App
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-xl border bg-card p-8 shadow-sm">{children}</div>
      </main>
    </div>
  )
}
