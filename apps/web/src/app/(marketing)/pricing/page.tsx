import type { Metadata } from 'next'
import { PricingSection } from '@/features/marketing'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing. Start free and scale as you grow.',
}

export default function PricingPage() {
  return (
    <div className="py-12">
      <PricingSection />
    </div>
  )
}
