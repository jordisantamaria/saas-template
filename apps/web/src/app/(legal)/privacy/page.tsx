import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: January 1, 2026</p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name, email address, and payment
        information when you create an account or subscribe to our service.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our services, process
        transactions, and send you related information.
      </p>

      <h2>3. Information Sharing</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personal information to outside parties
        except as described in this policy.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information. However, no
        method of transmission over the internet is 100% secure.
      </p>

      <h2>5. Your Rights (GDPR)</h2>
      <p>
        You have the right to access, correct, or delete your personal data. You may also request
        data portability or restrict processing. Contact us to exercise these rights.
      </p>

      <h2>6. Contact</h2>
      <p>For privacy-related inquiries, please contact us at privacy@example.com.</p>
    </div>
  )
}
