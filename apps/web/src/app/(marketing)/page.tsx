import { Hero } from '@/features/marketing/components/hero'
import { FeaturesSection } from '@/features/marketing/components/features-section'
import { PricingSection } from '@/features/marketing/components/pricing-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <PricingSection />
    </>
  )
}
