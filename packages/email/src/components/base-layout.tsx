import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type BaseLayoutProps = {
  preview: string
  children: React.ReactNode
  appName?: string
  logoUrl?: string
  unsubscribeUrl?: string
}

export function BaseLayout({
  preview,
  children,
  appName = 'App',
  logoUrl,
  unsubscribeUrl,
}: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            {logoUrl ? (
              <Img src={logoUrl} width="120" height="36" alt={appName} />
            ) : (
              <Text style={logoText}>{appName}</Text>
            )}
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
            {unsubscribeUrl && (
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const header = {
  padding: '24px 0',
  textAlign: 'center' as const,
}

const logoText = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#09090b',
}

const content = {
  backgroundColor: '#ffffff',
  border: '1px solid #e4e4e7',
  borderRadius: '8px',
  padding: '32px 24px',
}

const hr = {
  borderColor: '#e4e4e7',
  margin: '24px 0',
}

const footer = {
  textAlign: 'center' as const,
}

const footerText = {
  color: '#71717a',
  fontSize: '12px',
  lineHeight: '16px',
}

const footerLink = {
  color: '#71717a',
  fontSize: '12px',
  textDecoration: 'underline',
}
