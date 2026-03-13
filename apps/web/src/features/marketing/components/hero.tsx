import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.85_0.12_270),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 py-32 text-center md:py-40">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            Now in public beta
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build your SaaS
            <br />
            <span className="text-muted-foreground/70">faster than ever</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Everything you need to launch your SaaS product. Authentication, payments, dashboards,
            and more — ready out of the box.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:brightness-110"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center rounded-lg border border-border/60 px-8 text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-border hover:text-foreground"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
