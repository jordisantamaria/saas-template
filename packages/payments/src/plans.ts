export type PlanConfig = {
  slug: string
  name: string
  price: number // cents
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: { members: number; projects: number }
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    slug: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: ['3 projects', '1 team member', 'Basic support'],
    limits: { members: 1, projects: 3 },
  },
  pro: {
    slug: 'pro',
    name: 'Pro',
    price: 2900,
    currency: 'usd',
    interval: 'month',
    features: ['50 projects', '10 team members', 'Priority support', 'Advanced analytics'],
    limits: { members: 10, projects: 50 },
  },
  enterprise: {
    slug: 'enterprise',
    name: 'Enterprise',
    price: 9900,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited projects',
      'Unlimited members',
      'Dedicated support',
      'Custom integrations',
      'SLA',
    ],
    limits: { members: -1, projects: -1 },
  },
}

export function getPlan(slug: string): PlanConfig | undefined {
  return PLANS[slug]
}

export function isFreePlan(slug: string): boolean {
  return slug === 'free'
}
