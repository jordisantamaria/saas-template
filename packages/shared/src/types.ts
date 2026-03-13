export type UserRole = 'admin' | 'member' | 'viewer'

export type PlanType = 'free' | 'pro' | 'enterprise'

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
