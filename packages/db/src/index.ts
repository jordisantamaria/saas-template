export { db, type Database } from './client'
export * from './schemas/index'

// Inferred types for convenience
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
