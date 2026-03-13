import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { PageHeader } from './page-header'
import { Button } from './ui/button'

const meta: Meta<typeof PageHeader> = {
  title: 'SaaS/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'Dashboard',
    description: 'Overview of your account activity.',
  },
}

export const WithActions: Story = {
  args: {
    title: 'Projects',
    description: 'Manage your projects.',
    actions: <Button size="sm"><Plus /> New Project</Button>,
  },
}

export const TitleOnly: Story = {
  args: { title: 'Settings' },
}
