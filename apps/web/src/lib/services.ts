import Stripe from 'stripe'
import { createPaymentService } from 'payments'
import { db } from 'db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const payments = createPaymentService({
  db,
  stripe,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
})

export { stripe }
