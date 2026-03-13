import type { PlanType, UserRole } from './types'

export const ROLES = {
  admin: 'admin',
  member: 'member',
  viewer: 'viewer',
} as const satisfies Record<UserRole, UserRole>

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      members: 1,
      projects: 3,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    limits: {
      members: 10,
      projects: 50,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    limits: {
      members: -1, // unlimited
      projects: -1,
    },
  },
} as const satisfies Record<PlanType, { name: string; price: number; limits: Record<string, number> }>

export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
}
