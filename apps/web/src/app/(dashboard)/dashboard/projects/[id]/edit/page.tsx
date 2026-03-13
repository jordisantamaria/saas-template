import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // TODO: Fetch project from DB
  const project = null as { name: string; description: string } | null

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/projects/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to project
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit Project</h1>
      </div>

      <div className="max-w-lg rounded-xl border bg-card p-6 shadow-sm">
        <form className="grid gap-5">
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Project name
            </label>
            <input
              id="name"
              type="text"
              required
              defaultValue={project.name}
              className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              defaultValue={project.description}
              className="flex rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:brightness-110"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
