import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const POSTS: Record<string, { title: string; date: string; content: string }> = {
  'getting-started': {
    title: 'Getting Started with Our Platform',
    date: '2026-01-15',
    content: 'This is a placeholder blog post. Replace this with your CMS integration or MDX content.',
  },
  'new-features-january': {
    title: 'New Features: January 2026',
    date: '2026-01-01',
    content: 'This is a placeholder blog post. Replace this with your CMS integration or MDX content.',
  },
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to blog
      </Link>

      <time className="mt-6 block text-sm text-muted-foreground">{post.date}</time>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{post.title}</h1>
      <div className="prose mt-8 max-w-none dark:prose-invert">
        <p>{post.content}</p>
      </div>
    </article>
  )
}
