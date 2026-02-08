import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
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
