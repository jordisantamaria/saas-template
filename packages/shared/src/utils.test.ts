import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, slugify } from './utils'

describe('formatCurrency', () => {
  it('formats EUR amounts', () => {
    const result = formatCurrency(29.99, 'EUR')
    // Result depends on locale, but should contain the number and currency
    expect(result).toContain('29')
    expect(result).toContain('99')
  })

  it('formats USD amounts', () => {
    const result = formatCurrency(100, 'USD')
    expect(result).toContain('100')
  })

  it('handles zero', () => {
    const result = formatCurrency(0, 'EUR')
    expect(result).toContain('0')
  })

  it('handles negative amounts', () => {
    const result = formatCurrency(-50, 'USD')
    expect(result).toContain('50')
  })
})

describe('formatDate', () => {
  it('formats a Date object', () => {
    const date = new Date('2025-06-15T12:00:00Z')
    const result = formatDate(date)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formats a date string', () => {
    const result = formatDate('2025-01-01T00:00:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('supports long format', () => {
    const short = formatDate('2025-06-15T12:00:00Z', 'short')
    const long = formatDate('2025-06-15T12:00:00Z', 'long')
    // Long format should be at least as long as short
    expect(long.length).toBeGreaterThanOrEqual(short.length)
  })
})

describe('slugify', () => {
  it('converts to lowercase kebab-case', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes diacritics', () => {
    expect(slugify('café résumé')).toBe('cafe-resume')
  })

  it('handles special characters', () => {
    expect(slugify('Hello! @World #2025')).toBe('hello-world-2025')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('a   b   c')).toBe('a-b-c')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})
