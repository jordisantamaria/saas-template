import { Check } from 'lucide-react'
import { PLANS } from 'payments'
import { CheckoutButton } from './checkout-button'
import { CancelButton } from './cancel-button'

const plans = Object.values(PLANS)
const PLAN_ORDER = ['free', 'pro', 'enterprise']

interface PricingCardsProps {
  currentPlanSlug?: string
  isCanceling?: boolean
}

function getButtonLabel(planSlug: string, currentPlanSlug: string | undefined) {
  if (planSlug === currentPlanSlug) return 'Current plan'

  const currentIndex = PLAN_ORDER.indexOf(currentPlanSlug ?? 'free')
  const planIndex = PLAN_ORDER.indexOf(planSlug)

  if (planSlug === 'free') return 'Free'
  if (planIndex > currentIndex) return 'Upgrade'
  return 'Downgrade'
}

export function PricingCards({ currentPlanSlug, isCanceling }: PricingCardsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = plan.slug === currentPlanSlug
        const label = getButtonLabel(plan.slug, currentPlanSlug)

        return (
          <div
            key={plan.slug}
            className={`relative rounded-xl border bg-card p-8 shadow-sm transition-shadow duration-200 hover:shadow-md ${
              isCurrent
                ? 'border-primary ring-1 ring-primary'
                : plan.slug === 'pro' && !currentPlanSlug
                  ? 'border-primary shadow-md'
                  : ''
            }`}
          >
            {isCurrent && (
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Current plan
              </span>
            )}
            {plan.slug === 'pro' && !isCurrent && (
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Most Popular
              </span>
            )}

            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold tabular-nums tracking-tight">${(plan.price / 100).toFixed(0)}</span>
              {plan.price > 0 && <span className="text-sm text-muted-foreground">/month</span>}
            </div>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {isCurrent ? (
                <button
                  disabled
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border text-sm font-medium opacity-50"
                >
                  Current plan
                </button>
              ) : plan.slug === 'free' && currentPlanSlug && !isCanceling ? (
                <CancelButton />
              ) : plan.slug === 'free' && isCanceling ? (
                <button
                  disabled
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border text-sm font-medium opacity-50"
                >
                  Canceling...
                </button>
              ) : plan.slug === 'free' ? (
                <button
                  disabled
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border text-sm font-medium opacity-50"
                >
                  Free
                </button>
              ) : (
                <CheckoutButton
                  planSlug={plan.slug}
                  label={label}
                  variant={plan.slug === 'pro' ? 'primary' : 'outline'}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
