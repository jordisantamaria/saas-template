import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // TODO: Fetch project from DB
  const project = null as { name: string; description: string; createdAt: string } | null

  if (!project) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to projects
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
        </div>
        <Link
          href={`/dashboard/projects/${id}/edit`}
          className="inline-flex h-9 items-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium shadow-sm transition-all duration-150 hover:bg-accent"
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
      </div>
    </div>
  )
}
