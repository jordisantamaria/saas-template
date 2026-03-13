const testimonials = [
  {
    quote:
      'This tool has completely transformed how we manage our projects. The simplicity is unmatched.',
    name: 'Sarah Chen',
    title: 'CTO at TechFlow',
    initials: 'SC',
  },
  {
    quote:
      'We migrated from three different tools to this single platform. Best decision we made this year.',
    name: 'Marcus Rodriguez',
    title: 'Head of Product at Scaleup',
    initials: 'MR',
  },
  {
    quote:
      'The onboarding was seamless and the support team is incredibly responsive. Highly recommended.',
    name: 'Emily Park',
    title: 'Founder at Launchpad',
    initials: 'EP',
  },
]

export function Testimonials() {
  return (
    <section className="border-t bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Loved by teams</h2>
          <p className="mt-4 text-lg text-muted-foreground">See what our customers have to say.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl bg-background p-6 shadow-sm ring-1 ring-border/50"
            >
              <p className="flex-1 text-sm leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
