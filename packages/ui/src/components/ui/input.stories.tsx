import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = { args: { placeholder: 'Enter text...' } }
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } }
export const File: Story = { args: { type: 'file' } }
