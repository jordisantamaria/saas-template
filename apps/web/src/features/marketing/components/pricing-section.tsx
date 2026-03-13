import Link from 'next/link'
import { Check } from 'lucide-react'
import { PLANS } from 'payments'

const plans = Object.values(PLANS)

export function PricingSection() {
  return (
    <section className="border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isHighlighted = plan.slug === 'pro'
            return (
              <div
                key={plan.slug}
                className={`relative rounded-xl p-8 transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-foreground text-background shadow-xl ring-1 ring-foreground'
                    : 'bg-background shadow-sm ring-1 ring-border/50'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Most popular
                  </div>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums">
                    ${(plan.price / 100).toFixed(0)}
                  </span>
                  {plan.price > 0 && (
                    <span className={isHighlighted ? 'text-background/60' : 'text-muted-foreground'}>
                      /month
                    </span>
                  )}
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${isHighlighted ? 'text-background/70' : 'text-muted-foreground'}`}
                      />
                      <span className={isHighlighted ? 'text-background/80' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.slug === 'free' ? '/register' : '/register?plan=' + plan.slug}
                  className={`mt-8 flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 ${
                    isHighlighted
                      ? 'bg-background text-foreground shadow-sm hover:bg-background/90'
                      : 'border border-border/60 hover:border-border hover:bg-accent'
                  }`}
                >
                  {plan.slug === 'free' ? 'Get Started' : 'Start Free Trial'}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
