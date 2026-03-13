import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Base/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'Badge' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Destructive' } }
