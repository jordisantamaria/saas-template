import { Check } from 'lucide-react'
import { PLANS } from 'payments'
import { CheckoutButton } from './checkout-button'

const plans = Object.values(PLANS)

export function PricingCards() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.slug}
          className={`rounded-lg border p-8 ${plan.slug === 'pro' ? 'border-primary shadow-sm' : ''}`}
        >
          {plan.slug === 'pro' && (
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Most Popular
            </span>
          )}

          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">${(plan.price / 100).toFixed(0)}</span>
            {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
          </div>

          <ul className="mt-8 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <CheckoutButton
              planSlug={plan.slug}
              label={plan.slug === 'free' ? 'Get Started' : 'Start Free Trial'}
              variant={plan.slug === 'pro' ? 'primary' : 'outline'}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
