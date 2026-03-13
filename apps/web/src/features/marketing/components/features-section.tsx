import { Shield, Zap, CreditCard, Users, BarChart3, Mail } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Authentication',
    description: 'Google OAuth and magic link sign-in with JWT sessions. Rate-limited and secure.',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Stripe subscriptions with checkout, customer portal, and webhook handling.',
  },
  {
    icon: Users,
    title: 'Teams',
    description: 'Organizations with member roles, invitations, and permission management.',
  },
  {
    icon: BarChart3,
    title: 'Admin Dashboard',
    description: 'Built-in admin panel with user management, revenue metrics, and analytics.',
  },
  {
    icon: Mail,
    title: 'Transactional Email',
    description: 'Beautiful email templates for welcome, invoices, invitations, and more.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description:
      'Server Components by default, edge middleware, and optimized for Core Web Vitals.',
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Production-ready features so you can focus on what makes your product unique.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl bg-background p-6 shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="size-5 text-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
