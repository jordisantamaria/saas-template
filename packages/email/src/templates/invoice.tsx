import { Heading, Hr, Text } from '@react-email/components'
import { BaseLayout } from '../components/base-layout'

type InvoiceEmailProps = {
  name: string
  invoiceNumber: string
  amount: string
  planName: string
  billingPeriod: string
  appName?: string
  logoUrl?: string
}

export function InvoiceEmail({
  name,
  invoiceNumber,
  amount,
  planName,
  billingPeriod,
  appName = 'App',
  logoUrl,
}: InvoiceEmailProps) {
  return (
    <BaseLayout preview={`Invoice ${invoiceNumber}`} appName={appName} logoUrl={logoUrl}>
      <Heading style={heading}>Invoice #{invoiceNumber}</Heading>
      <Text style={text}>Hi {name}, here&apos;s your invoice for {appName}.</Text>
      <Hr style={hr} />
      <table style={table}>
        <tbody>
          <tr>
            <td style={labelCell}>Plan</td>
            <td style={valueCell}>{planName}</td>
          </tr>
          <tr>
            <td style={labelCell}>Period</td>
            <td style={valueCell}>{billingPeriod}</td>
          </tr>
          <tr>
            <td style={labelCell}>Amount</td>
            <td style={amountCell}>{amount}</td>
          </tr>
        </tbody>
      </table>
    </BaseLayout>
  )
}

const heading = { fontSize: '24px', fontWeight: '700', color: '#09090b', marginBottom: '16px' }
const text = { fontSize: '14px', lineHeight: '24px', color: '#3f3f46' }
const hr = { borderColor: '#e4e4e7', margin: '16px 0' }
const table = { width: '100%', borderCollapse: 'collapse' as const }
const labelCell = { fontSize: '14px', color: '#71717a', padding: '8px 0' }
const valueCell = { fontSize: '14px', color: '#09090b', padding: '8px 0', textAlign: 'right' as const }
const amountCell = { fontSize: '18px', fontWeight: '700', color: '#09090b', padding: '8px 0', textAlign: 'right' as const }
