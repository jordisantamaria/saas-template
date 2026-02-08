import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const isRedisConfigured =
  process.env.UPSTASH_REDIS_REST_URL &&
  !process.env.UPSTASH_REDIS_REST_URL.includes('xxx')

function createRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

const noopRateLimit = { limit: async () => ({ success: true }) }

function createRateLimit(window: number, interval: string, prefix: string) {
  if (!isRedisConfigured) return noopRateLimit as unknown as Ratelimit
  return new Ratelimit({
    redis: createRedis(),
    limiter: Ratelimit.slidingWindow(window, interval as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: true,
    prefix,
  })
}

// Auth endpoints: 10 requests per minute
export const authRateLimit = createRateLimit(10, '1 m', 'ratelimit:auth')

// API endpoints: 60 requests per minute
export const apiRateLimit = createRateLimit(60, '1 m', 'ratelimit:api')

// General rate limit: 120 requests per minute
export const generalRateLimit = createRateLimit(120, '1 m', 'ratelimit:general')
