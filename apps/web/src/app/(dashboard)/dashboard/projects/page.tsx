import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  // TODO: Fetch projects from DB with DataTable
  const projects: { id: string; name: string; status: string; createdAt: string }[] = []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your projects.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:brightness-110"
        >
          <Plus className="size-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-16 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="size-6 text-muted-foreground/70" />
          </div>
          <h3 className="mt-4 font-semibold">No projects yet</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create your first project to get started.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:brightness-110"
          >
            <Plus className="size-4" />
            New Project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {/* TODO: Replace with DataTable component */}
          <p className="p-6 text-sm text-muted-foreground">Projects table placeholder</p>
        </div>
      )}
    </div>
  )
}
