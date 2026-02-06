import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'All the latest updates and improvements.',
}

const ENTRIES = [
  {
    version: '0.2.0',
    date: '2026-02-01',
    title: 'Team Management',
    changes: [
      'Added team invitations via email',
      'Role-based permissions (admin, member, viewer)',
      'Organization settings page',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-01-15',
    title: 'Initial Release',
    changes: [
      'Authentication with Google and magic links',
      'Stripe subscription billing',
      'Dashboard with analytics overview',
      'Admin panel with user management',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
      <p className="mt-2 text-muted-foreground">All the latest updates and improvements.</p>

      <div className="mt-12 space-y-12">
        {ENTRIES.map((entry) => (
          <div key={entry.version} className="relative border-l pl-6">
            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <time className="text-sm text-muted-foreground">{entry.date}</time>
            <h2 className="mt-1 text-xl font-semibold">
              {entry.title}{' '}
              <span className="text-sm font-normal text-muted-foreground">v{entry.version}</span>
            </h2>
            <ul className="mt-3 space-y-1">
              {entry.changes.map((change) => (
                <li key={change} className="text-sm text-muted-foreground">
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
