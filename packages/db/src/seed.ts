import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { plans } from './schemas/billing'

async function seed() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle({ client: sql })

  console.log('Seeding plans...')

  await db.insert(plans).values([
    {
      name: 'Free',
      slug: 'free',
      price: 0,
      currency: 'usd',
      interval: 'month',
      features: ['3 projects', '1 team member', 'Basic support'],
      limits: JSON.stringify({ members: 1, projects: 3 }),
    },
    {
      name: 'Pro',
      slug: 'pro',
      price: 2900, // $29.00
      currency: 'usd',
      interval: 'month',
      features: ['50 projects', '10 team members', 'Priority support', 'Advanced analytics'],
      limits: JSON.stringify({ members: 10, projects: 50 }),
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: 9900, // $99.00
      currency: 'usd',
      interval: 'month',
      features: [
        'Unlimited projects',
        'Unlimited members',
        'Dedicated support',
        'Custom integrations',
        'SLA',
      ],
      limits: JSON.stringify({ members: -1, projects: -1 }),
    },
  ])

  console.log('Seed complete.')
}

seed().catch(console.error)
