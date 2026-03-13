/**
 * Format a number as currency using the browser's locale.
 * Uses Intl.NumberFormat — zero library dependencies.
 */
export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format a date using the browser's locale.
 * Uses Intl.DateTimeFormat — zero library dependencies.
 */
export function formatDate(date: Date | string, style: 'short' | 'long' = 'short') {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: style,
  }).format(d)
}

/**
 * Format a date as relative time (e.g., "5 minutes ago").
 * Uses Intl.RelativeTimeFormat — zero library dependencies.
 */
export function formatRelative(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (diff < 60_000) return rtf.format(-Math.floor(diff / 1000), 'second')
  if (diff < 3_600_000) return rtf.format(-Math.floor(diff / 60_000), 'minute')
  if (diff < 86_400_000) return rtf.format(-Math.floor(diff / 3_600_000), 'hour')
  return rtf.format(-Math.floor(diff / 86_400_000), 'day')
}

/**
 * Convert a string to a URL-friendly slug.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
