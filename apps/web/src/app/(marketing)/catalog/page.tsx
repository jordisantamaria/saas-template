import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Component Catalog' }

const components = [
  { name: 'Button — Primary', className: 'inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90' },
  { name: 'Button — Outline', className: 'inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent' },
  { name: 'Button — Ghost', className: 'inline-flex h-10 items-center rounded-md px-4 text-sm font-medium hover:bg-accent' },
  { name: 'Button — Destructive', className: 'inline-flex h-10 items-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90' },
]

const badges = [
  { label: 'Default', className: 'inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium' },
  { label: 'Primary', className: 'inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary' },
  { label: 'Success', className: 'inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  { label: 'Warning', className: 'inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { label: 'Destructive', className: 'inline-flex rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive' },
]

export default function CatalogPage() {
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Component Catalog</h1>
      <p className="mt-2 text-muted-foreground">
        Visual reference of UI patterns used in this app. Only available in development.
      </p>

      {/* Colors */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {['bg-background', 'bg-foreground', 'bg-primary', 'bg-muted', 'bg-accent', 'bg-destructive', 'bg-card', 'bg-border'].map((c) => (
            <div key={c} className="space-y-1">
              <div className={`h-16 rounded-md border ${c}`} />
              <p className="text-xs text-muted-foreground">{c.replace('bg-', '')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Typography</h2>
        <div className="mt-4 space-y-3">
          <p className="text-4xl font-bold tracking-tight">Heading 1 (text-4xl)</p>
          <p className="text-3xl font-bold tracking-tight">Heading 2 (text-3xl)</p>
          <p className="text-2xl font-bold tracking-tight">Heading 3 (text-2xl)</p>
          <p className="text-xl font-semibold">Heading 4 (text-xl)</p>
          <p className="text-lg font-semibold">Heading 5 (text-lg)</p>
          <p className="text-sm text-muted-foreground">Body text (text-sm, muted)</p>
          <p className="text-xs text-muted-foreground">Caption (text-xs, muted)</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {components.map((c) => (
            <button key={c.name} className={c.className}>{c.name}</button>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {badges.map((b) => (
            <span key={b.label} className={b.className}>{b.label}</span>
          ))}
        </div>
      </section>

      {/* Inputs */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="mt-4 grid max-w-md gap-4">
          <input
            type="text"
            placeholder="Text input"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            type="text"
            value="Disabled input"
            disabled
            readOnly
            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
      </section>

      {/* Cards */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Default Card</h3>
            <p className="mt-1 text-sm text-muted-foreground">Card with border and padding.</p>
          </div>
          <div className="rounded-lg border border-primary p-6 shadow-sm">
            <h3 className="font-semibold">Highlighted Card</h3>
            <p className="mt-1 text-sm text-muted-foreground">Card with primary border and shadow.</p>
          </div>
        </div>
      </section>

      {/* Switch */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Toggle Switch</h2>
        <div className="mt-4 flex gap-4">
          <div className="relative inline-flex h-6 w-11 shrink-0 rounded-full bg-primary">
            <span className="pointer-events-none block h-5 w-5 translate-x-5 rounded-full bg-background shadow-lg" />
          </div>
          <div className="relative inline-flex h-6 w-11 shrink-0 rounded-full bg-input">
            <span className="pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-background shadow-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
