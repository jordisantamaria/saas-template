import type { Meta, StoryObj } from '@storybook/react-vite'
import { DollarSign, Users, Activity, CreditCard } from 'lucide-react'
import { StatsCard } from './stats-card'

const meta: Meta<typeof StatsCard> = {
  title: 'SaaS/StatsCard',
  component: StatsCard,
}

export default meta
type Story = StoryObj<typeof StatsCard>

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    trend: { value: 20.1, isPositive: true },
  },
}

export const Negative: Story = {
  args: {
    label: 'Churn Rate',
    value: '2.4%',
    icon: Activity,
    trend: { value: 0.3, isPositive: false },
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="Revenue" value="$45,231" icon={DollarSign} trend={{ value: 20.1, isPositive: true }} />
      <StatsCard label="Users" value="2,350" icon={Users} trend={{ value: 180, isPositive: true }} />
      <StatsCard label="Active" value="573" icon={Activity} trend={{ value: 19, isPositive: false }} />
      <StatsCard label="Subscriptions" value="89" icon={CreditCard} trend={{ value: 4, isPositive: true }} />
    </div>
  ),
  parameters: { layout: 'padded' },
}
