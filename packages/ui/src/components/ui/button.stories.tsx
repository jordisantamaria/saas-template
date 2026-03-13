import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: 'Button' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }
export const Link: Story = { args: { variant: 'link', children: 'Link' } }

export const WithIcon: Story = {
  args: { children: <><Mail /> Send Email</> },
}

export const Loading: Story = {
  args: { disabled: true, children: <><Loader2 className="animate-spin" /> Please wait</> },
}

export const Small: Story = { args: { size: 'sm', children: 'Small' } }
export const Large: Story = { args: { size: 'lg', children: 'Large' } }
