import Link from 'next/link'
import { Check } from 'lucide-react'
import { PLANS } from 'payments'

const plans = Object.values(PLANS)

export function PricingSection() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="mt-2 text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-lg border p-8 ${plan.slug === 'pro' ? 'border-primary shadow-sm' : ''}`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${(plan.price / 100).toFixed(0)}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.slug === 'free' ? '/register' : '/register?plan=' + plan.slug}
                className={`mt-8 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  plan.slug === 'pro'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border hover:bg-accent'
                }`}
              >
                {plan.slug === 'free' ? 'Get Started' : 'Start Free Trial'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
