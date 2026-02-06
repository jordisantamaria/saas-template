import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  // TODO: Fetch projects from DB with DataTable
  const projects: { id: string; name: string; status: string; createdAt: string }[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your projects.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No projects yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create your first project to get started.</p>
          <Link
            href="/dashboard/projects/new"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          {/* TODO: Replace with DataTable component */}
          <p className="p-4 text-sm text-muted-foreground">Projects table placeholder</p>
        </div>
      )}
    </div>
  )
}
