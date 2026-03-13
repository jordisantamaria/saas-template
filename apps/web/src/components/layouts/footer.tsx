import Link from 'next/link'

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'Blog', href: '/blog' }],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold tracking-tight">SaaS App</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your SaaS application description.
            </p>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-6">
          <p className="text-center text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} SaaS App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
