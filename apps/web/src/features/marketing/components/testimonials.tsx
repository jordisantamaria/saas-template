const testimonials = [
  {
    quote:
      'This tool has completely transformed how we manage our projects. The simplicity is unmatched.',
    name: 'Sarah Chen',
    title: 'CTO at TechFlow',
  },
  {
    quote:
      'We migrated from three different tools to this single platform. Best decision we made this year.',
    name: 'Marcus Rodriguez',
    title: 'Head of Product at Scaleup',
  },
  {
    quote:
      'The onboarding was seamless and the support team is incredibly responsive. Highly recommended.',
    name: 'Emily Park',
    title: 'Founder at Launchpad',
  },
]

export function Testimonials() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Loved by teams</h2>
          <p className="mt-2 text-muted-foreground">See what our customers have to say.</p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-lg border p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
