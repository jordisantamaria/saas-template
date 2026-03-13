import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader } from './data-table'
import { Badge } from './ui/badge'

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
]

const data: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Member', status: 'active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'inactive' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Member', status: 'active' },
  { id: '5', name: 'Eve Wilson', email: 'eve@example.com', role: 'Admin', status: 'active' },
]

const meta: Meta<typeof DataTable> = {
  title: 'SaaS/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof DataTable>

export const Default: Story = {
  args: { columns, data },
}

export const WithSearch: Story = {
  args: { columns, data, searchKey: 'name', searchPlaceholder: 'Search users...' },
}

export const Empty: Story = {
  args: { columns, data: [], emptyTitle: 'No users', emptyDescription: 'Add your first team member.' },
}
