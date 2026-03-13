import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'

type TestRow = { id: string; name: string; email: string }

const columns: ColumnDef<TestRow>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]

const testData: TestRow[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
]

describe('DataTable', () => {
  it('renders data rows', () => {
    render(<DataTable columns={columns} data={testData} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<DataTable columns={columns} data={[]} emptyTitle="No users found" />)
    expect(screen.getByText('No users found')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<DataTable columns={columns} data={testData} />)
    const thead = screen.getAllByRole('rowgroup')[0]!
    expect(within(thead).getByText('Name')).toBeInTheDocument()
    expect(within(thead).getByText('Email')).toBeInTheDocument()
  })

  it('shows result count', () => {
    render(<DataTable columns={columns} data={testData} />)
    expect(screen.getByText(/2 result/)).toBeInTheDocument()
  })

  it('renders search input when searchKey provided', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchKey="name"
        searchPlaceholder="Search users..."
      />,
    )
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
  })
})
