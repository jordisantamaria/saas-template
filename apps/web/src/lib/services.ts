import Stripe from 'stripe'
import { createPaymentService } from 'payments'
import { db } from 'db'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('Missing NEXT_PUBLIC_APP_URL environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const payments = createPaymentService({
  db,
  stripe,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
})

export { stripe }
