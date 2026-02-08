import { AlertTriangle } from 'lucide-react'

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Could not start the sign-in process. Please try again.',
  OAuthCallback: 'Could not complete the sign-in process. Please try again.',
  OAuthCreateAccount: 'Could not create your account. Please try again.',
  OAuthAccountNotLinked:
    'This email is already associated with another sign-in method. Please use your original sign-in method.',
  EmailCreateAccount: 'Could not create your account. Please try again.',
  EmailSignin: 'Could not send the sign-in email. Please try again.',
  CredentialsSignin: 'Invalid email or password.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An unexpected error occurred. Please try again.',
}

interface AuthErrorProps {
  code: string
}

export function AuthError({ code }: AuthErrorProps) {
  const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default

  return (
    <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  )
}
