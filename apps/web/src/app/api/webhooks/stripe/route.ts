import { NextResponse } from 'next/server'
import { handleWebhook } from 'payments'
import { db } from 'db'
import { stripe } from '@/lib/services'

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  try {
    const result = await handleWebhook({
      db,
      stripe,
      payload,
      signature,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 400 },
    )
  }
}
