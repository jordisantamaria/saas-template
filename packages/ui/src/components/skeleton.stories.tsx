import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton, CardSkeleton, StatsGridSkeleton, TableSkeleton, ChartSkeleton } from './skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Loading/Skeletons',
  component: Skeleton,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Base: Story = {
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  ),
}

export const Card: Story = {
  render: () => <CardSkeleton className="w-[350px]" />,
}

export const StatsGrid: Story = {
  render: () => <StatsGridSkeleton />,
}

export const Table: Story = {
  render: () => <TableSkeleton />,
}

export const Chart: Story = {
  render: () => <ChartSkeleton />,
}
