import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@nyxidiom/ui'
import { PostHogProvider } from '@/lib/posthog'
import { PostHogPageView } from '@/lib/posthog-pageview'
import { getAppUrl } from '@/lib/url'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SaaS App',
    template: '%s | SaaS App',
  },
  description: 'Your SaaS application description',
  metadataBase: new URL(getAppUrl()),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PostHogPageView />
            {children}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
