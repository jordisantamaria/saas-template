import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.8_0.15_270),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Build your SaaS
            <br />
            <span className="text-muted-foreground">faster than ever</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Everything you need to launch your SaaS product. Authentication, payments,
            dashboards, and more — ready out of the box.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-accent"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
