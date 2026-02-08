/**
 * Returns the app's base URL.
 *
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (explicit, set by the developer)
 * 2. VERCEL_URL (auto-provided by Vercel deployments)
 * 3. localhost fallback for local dev
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}
