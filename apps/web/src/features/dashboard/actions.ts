'use server'

import { createAction } from '@/lib/safe-action'
import { db } from 'db'

export const getDashboardStats = createAction({
  handler: async ({ userId }) => {
    // TODO: Fetch real stats from database
    void db
    void userId
    return {
      totalRevenue: '$0.00',
      subscriptions: 0,
      activeUsers: 1,
      growth: '+0%',
    }
  },
})

export const getRecentActivity = createAction({
  handler: async ({ userId }) => {
    // TODO: Fetch real activity from database
    void userId
    return [] as { id: string; description: string; timestamp: string }[]
  },
})
