import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { baseColumns } from './base'
import { users } from './auth'

export const plans = pgTable('plans', {
  ...baseColumns,
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  price: integer('price').notNull(), // cents
  currency: text('currency').default('usd').notNull(),
  interval: text('interval', { enum: ['month', 'year'] }).default('month').notNull(),
  stripePriceId: text('stripe_price_id').unique(),
  features: text('features').array(),
  limits: text('limits'), // JSON string of plan limits
})

export const subscriptions = pgTable('subscriptions', {
  ...baseColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeCustomerId: text('stripe_customer_id'),
  status: text('status', {
    enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete'],
  })
    .default('active')
    .notNull(),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  cancelAtPeriodEnd: timestamp('cancel_at_period_end', { withTimezone: true }),
})

export const invoices = pgTable('invoices', {
  ...baseColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeInvoiceId: text('stripe_invoice_id').unique(),
  amount: integer('amount').notNull(), // cents
  currency: text('currency').default('usd').notNull(),
  status: text('status', { enum: ['draft', 'open', 'paid', 'void', 'uncollectible'] })
    .default('draft')
    .notNull(),
  invoiceUrl: text('invoice_url'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
})

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}))

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
}))
