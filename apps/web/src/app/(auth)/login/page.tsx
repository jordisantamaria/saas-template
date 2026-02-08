import type { Metadata } from 'next'
import Link from 'next/link'
import { SocialButtons } from '@/features/auth/components/social-buttons'
import { LoginForm } from '@/features/auth/components/login-form'
import { AuthError } from '@/features/auth/components/auth-error'

export const metadata: Metadata = { title: 'Sign In' }

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="grid gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      {error && <AuthError code={error} />}

      <SocialButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="underline hover:text-foreground">
          Sign up
        </Link>
      </p>
    </div>
  )
}
