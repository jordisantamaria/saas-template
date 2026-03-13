import { describe, expect, it } from 'vitest'
import { emailSchema, passwordSchema, paginationSchema, idSchema } from './validations'

describe('emailSchema', () => {
  it('accepts valid emails', () => {
    expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
    expect(emailSchema.parse('User@Example.COM')).toBe('user@example.com')
    expect(emailSchema.parse(' user@example.com ')).toBe('user@example.com')
  })

  it('rejects invalid emails', () => {
    expect(() => emailSchema.parse('')).toThrow()
    expect(() => emailSchema.parse('not-an-email')).toThrow()
    expect(() => emailSchema.parse('@example.com')).toThrow()
    expect(() => emailSchema.parse('user@')).toThrow()
  })

  it('rejects emails that are too long', () => {
    const longEmail = 'a'.repeat(250) + '@b.com'
    expect(() => emailSchema.parse(longEmail)).toThrow()
  })
})

describe('passwordSchema', () => {
  it('accepts valid passwords', () => {
    expect(passwordSchema.parse('MyPass123')).toBe('MyPass123')
    expect(passwordSchema.parse('Str0ngP@ssword')).toBe('Str0ngP@ssword')
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(() => passwordSchema.parse('Ab1')).toThrow()
    expect(() => passwordSchema.parse('Abcdef1')).toThrow()
  })

  it('rejects passwords without lowercase', () => {
    expect(() => passwordSchema.parse('ALLCAPS123')).toThrow()
  })

  it('rejects passwords without uppercase', () => {
    expect(() => passwordSchema.parse('alllower123')).toThrow()
  })

  it('rejects passwords without numbers', () => {
    expect(() => passwordSchema.parse('NoNumbersHere')).toThrow()
  })
})

describe('paginationSchema', () => {
  it('applies defaults', () => {
    const result = paginationSchema.parse({})
    expect(result).toEqual({ page: 1, limit: 20 })
  })

  it('parses string values (from query params)', () => {
    const result = paginationSchema.parse({ page: '3', limit: '50' })
    expect(result).toEqual({ page: 3, limit: 50 })
  })

  it('caps limit at 100', () => {
    expect(() => paginationSchema.parse({ limit: 200 })).toThrow()
  })

  it('rejects negative page', () => {
    expect(() => paginationSchema.parse({ page: -1 })).toThrow()
  })
})

describe('idSchema', () => {
  it('accepts valid UUIDs', () => {
    expect(idSchema.parse('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    )
  })

  it('rejects invalid UUIDs', () => {
    expect(() => idSchema.parse('not-a-uuid')).toThrow()
    expect(() => idSchema.parse('')).toThrow()
    expect(() => idSchema.parse('123')).toThrow()
  })
})
