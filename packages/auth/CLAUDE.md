# packages/auth

Authentication layer using Auth.js (next-auth v5) with JWT strategy.

## Structure

```
src/
  config.ts          — createAuthConfig() factory
  providers.ts       — Google + Magic Link + Credentials
  callbacks.ts       — JWT + session callbacks (inline in config)
  middleware.ts      — createAuthMiddleware() with rate limiting
  rate-limit.ts      — Upstash Redis rate limiters
  index.ts
```

## Usage in apps/web

```ts
// lib/auth.ts
import { createAuthConfig, createProviders } from 'auth'
import { db } from 'db'

const providers = createProviders({
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
})

export const { handlers, auth, signIn, signOut } = createAuthConfig({ db, providers })
```

## Rate Limits

- Auth endpoints: 10 req/min per IP
- API endpoints: 60 req/min per IP
- General: 120 req/min per IP

## Conventions

- JWT strategy (no DB sessions) for performance
- Public pages have ZERO auth overhead
- Extended session type includes user.id and user.role
- Logged-in users redirected from /login to /dashboard
