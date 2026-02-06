import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// Auth endpoints: 10 requests per minute
export const authRateLimit = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
})

// API endpoints: 60 requests per minute
export const apiRateLimit = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
})

// General rate limit: 120 requests per minute
export const generalRateLimit = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(120, '1 m'),
  analytics: true,
  prefix: 'ratelimit:general',
})
