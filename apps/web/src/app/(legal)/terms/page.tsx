import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: January 1, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using this service, you agree to be bound by these Terms of Service
        and all applicable laws and regulations.
      </p>

      <h2>2. Use License</h2>
      <p>
        Permission is granted to temporarily use the service for personal or business use.
        This is the grant of a license, not a transfer of title.
      </p>

      <h2>3. Disclaimer</h2>
      <p>
        The service is provided on an &quot;as is&quot; basis. We make no warranties, expressed
        or implied, and hereby disclaim all warranties.
      </p>

      <h2>4. Limitations</h2>
      <p>
        In no event shall we be liable for any damages arising out of the use or inability
        to use the service.
      </p>

      <h2>5. Changes</h2>
      <p>
        We reserve the right to modify these terms at any time. Changes will be effective
        immediately upon posting.
      </p>
    </div>
  )
}
