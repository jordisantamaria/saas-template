import Stripe from 'stripe'
import { createPaymentService } from 'payments'
import { db } from 'db'
import { getAppUrl } from './url'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const payments = createPaymentService({
  db,
  stripe,
  appUrl: getAppUrl(),
})

export { stripe }
