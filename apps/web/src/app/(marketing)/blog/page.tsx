import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest updates, guides, and news.',
}

const POSTS = [
  {
    slug: 'getting-started',
    title: 'Getting Started with Our Platform',
    description: 'Learn how to set up your account and start building.',
    date: '2026-01-15',
  },
  {
    slug: 'new-features-january',
    title: 'New Features: January 2026',
    description: 'A roundup of everything new this month.',
    date: '2026-01-01',
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">Latest updates and guides.</p>

      <div className="mt-12 space-y-8">
        {POSTS.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`}>
              <time className="text-sm text-muted-foreground">{post.date}</time>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-muted-foreground transition-colors">
                {post.title}
              </h2>
              <p className="mt-1 text-muted-foreground">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
