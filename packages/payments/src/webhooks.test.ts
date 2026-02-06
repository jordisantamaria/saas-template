import { describe, it, expect, vi, beforeEach } from 'vitest'
import type Stripe from 'stripe'

// Mock db/schemas module
vi.mock('db/schemas', () => ({
  subscriptions: { stripeSubscriptionId: 'stripeSubscriptionId', userId: 'userId' },
  invoices: { stripeInvoiceId: 'stripeInvoiceId' },
  plans: { stripePriceId: 'stripePriceId' },
}))

// Mock drizzle-orm eq function
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
}))

// Mock db module
vi.mock('db', () => ({
  db: {},
}))

import { handleWebhook } from './webhooks'

function createMockDb() {
  const chainable = {
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  }

  return {
    insert: vi.fn().mockReturnValue(chainable),
    update: vi.fn().mockReturnValue(chainable),
    query: {
      subscriptions: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
      plans: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    },
    _chain: chainable,
  }
}

function createMockStripe(eventType: string, eventData: unknown) {
  return {
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({
        type: eventType,
        data: { object: eventData },
      }),
    },
    subscriptions: {
      retrieve: vi.fn().mockResolvedValue({
        current_period_start: 1700000000,
        current_period_end: 1702592000,
      }),
    },
  } as unknown as Stripe
}

describe('handleWebhook', () => {
  const defaultParams = {
    payload: 'test-payload',
    signature: 'test-signature',
    webhookSecret: 'whsec_test',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns received: true for any valid event', async () => {
    const db = createMockDb()
    const stripe = createMockStripe('unknown.event', {})

    const result = await handleWebhook({
      db: db as never,
      stripe,
      ...defaultParams,
    })

    expect(result).toEqual({ received: true, type: 'unknown.event' })
  })

  it('does not crash on unhandled event types', async () => {
    const db = createMockDb()
    const stripe = createMockStripe('some.random.event', {})

    await expect(
      handleWebhook({ db: db as never, stripe, ...defaultParams }),
    ).resolves.not.toThrow()

    expect(db.insert).not.toHaveBeenCalled()
    expect(db.update).not.toHaveBeenCalled()
  })

  describe('checkout.session.completed', () => {
    it('creates a subscription record', async () => {
      const db = createMockDb()
      const sessionData = {
        metadata: { userId: 'user-1', planId: 'plan-1' },
        subscription: 'sub_123',
        customer: 'cus_123',
      }
      const stripe = createMockStripe('checkout.session.completed', sessionData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_123')
      expect(db.insert).toHaveBeenCalled()
      expect(db._chain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          planId: 'plan-1',
          stripeSubscriptionId: 'sub_123',
          stripeCustomerId: 'cus_123',
          status: 'active',
        }),
      )
    })

    it('throws when metadata is missing', async () => {
      const db = createMockDb()
      const sessionData = { metadata: {}, subscription: 'sub_123', customer: 'cus_123' }
      const stripe = createMockStripe('checkout.session.completed', sessionData)

      await expect(
        handleWebhook({ db: db as never, stripe, ...defaultParams }),
      ).rejects.toThrow('Missing userId or planId')
    })
  })

  describe('customer.subscription.deleted', () => {
    it('marks subscription as canceled', async () => {
      const db = createMockDb()
      const subData = { id: 'sub_123' }
      const stripe = createMockStripe('customer.subscription.deleted', subData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      expect(db.update).toHaveBeenCalled()
      expect(db._chain.set).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'canceled' }),
      )
    })
  })

  describe('customer.subscription.updated', () => {
    it('skips if subscription not found in DB', async () => {
      const db = createMockDb()
      db.query.subscriptions.findFirst.mockResolvedValue(null)

      const subData = {
        id: 'sub_123',
        status: 'active',
        current_period_start: 1700000000,
        current_period_end: 1702592000,
        cancel_at_period_end: false,
        items: { data: [{ price: { id: 'price_123' } }] },
      }
      const stripe = createMockStripe('customer.subscription.updated', subData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      // Should not update since the sub wasn't found
      expect(db.update).not.toHaveBeenCalled()
    })

    it('updates subscription when found', async () => {
      const db = createMockDb()
      db.query.subscriptions.findFirst.mockResolvedValue({ id: 'existing-sub' })

      const subData = {
        id: 'sub_123',
        status: 'active',
        current_period_start: 1700000000,
        current_period_end: 1702592000,
        cancel_at_period_end: false,
        items: { data: [{ price: { id: 'price_123' } }] },
      }
      const stripe = createMockStripe('customer.subscription.updated', subData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      expect(db.update).toHaveBeenCalled()
      expect(db._chain.set).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }),
      )
    })
  })

  describe('invoice.payment_succeeded', () => {
    it('creates an invoice record', async () => {
      const db = createMockDb()
      const invoiceData = {
        id: 'inv_123',
        amount_paid: 2900,
        currency: 'usd',
        hosted_invoice_url: 'https://invoice.stripe.com/i/123',
        subscription_details: { metadata: { userId: 'user-1' } },
      }
      const stripe = createMockStripe('invoice.payment_succeeded', invoiceData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      expect(db.insert).toHaveBeenCalled()
      expect(db._chain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          stripeInvoiceId: 'inv_123',
          amount: 2900,
          status: 'paid',
        }),
      )
    })

    it('skips if no userId in metadata', async () => {
      const db = createMockDb()
      const invoiceData = {
        id: 'inv_123',
        amount_paid: 2900,
        currency: 'usd',
        subscription_details: { metadata: {} },
      }
      const stripe = createMockStripe('invoice.payment_succeeded', invoiceData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      expect(db.insert).not.toHaveBeenCalled()
    })
  })

  describe('invoice.payment_failed', () => {
    it('creates uncollectible invoice and updates subscription to past_due', async () => {
      const db = createMockDb()
      const invoiceData = {
        id: 'inv_456',
        amount_due: 2900,
        currency: 'usd',
        hosted_invoice_url: null,
        subscription: 'sub_123',
        subscription_details: { metadata: { userId: 'user-1' } },
      }
      const stripe = createMockStripe('invoice.payment_failed', invoiceData)

      await handleWebhook({ db: db as never, stripe, ...defaultParams })

      // Should insert invoice
      expect(db.insert).toHaveBeenCalled()
      expect(db._chain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'uncollectible',
          amount: 2900,
        }),
      )

      // Should update subscription to past_due
      expect(db.update).toHaveBeenCalled()
      expect(db._chain.set).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'past_due' }),
      )
    })
  })

  it('verifies webhook signature', async () => {
    const db = createMockDb()
    const stripe = createMockStripe('unknown.event', {})

    await handleWebhook({
      db: db as never,
      stripe,
      payload: 'my-payload',
      signature: 'my-sig',
      webhookSecret: 'whsec_secret',
    })

    expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
      'my-payload',
      'my-sig',
      'whsec_secret',
    )
  })
})
