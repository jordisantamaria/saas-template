import { MarketingHeader } from '@/components/layouts/marketing-header'
import { Footer } from '@/components/layouts/footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      <Footer />
    </>
  )
}
