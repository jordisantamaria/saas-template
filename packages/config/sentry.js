/**
 * Base Sentry configuration for Nyxidiom projects.
 * Usage: Sentry.init({ ...createSentryConfig({ dsn: '...', environment: '...' }) })
 */
export function createSentryConfig({ dsn, environment = 'production' }) {
  return {
    dsn,
    environment,
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    debug: environment === 'development',
  }
}
