import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileX2, Users, Inbox } from 'lucide-react'
import { EmptyState } from './empty-state'
import { Button } from './ui/button'

const meta: Meta<typeof EmptyState> = {
  title: 'SaaS/EmptyState',
  component: EmptyState,
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: FileX2,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
}

export const WithAction: Story = {
  args: {
    icon: Users,
    title: 'No team members',
    description: 'Invite your first team member to get started.',
    action: <Button size="sm">Invite Member</Button>,
  },
}

export const Inbox_: Story = {
  name: 'Inbox Empty',
  args: {
    icon: Inbox,
    title: 'All caught up',
    description: 'No new notifications.',
  },
}
