import { MarketingHeader } from '@/components/layouts/marketing-header'
import { Footer } from '@/components/layouts/footer'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">{children}</main>
      <Footer />
    </>
  )
}
