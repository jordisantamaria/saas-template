# Monitoring Setup Guide

## 1. Sentry (Error Tracking)

### Setup

1. Create a Sentry project at [sentry.io](https://sentry.io)
2. Select **Next.js** as the platform
3. Copy the DSN

### Environment Variables

```env
NEXT_PUBLIC_SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
SENTRY_AUTH_TOKEN="sntrys_..."  # For source map uploads
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
```

### Alerts

- Set up alert rules for:
  - New issues (notify immediately)
  - Issue frequency > 10 in 1 hour
  - Performance: p95 latency > 2s

## 2. Better Stack (Uptime Monitoring)

### Setup

1. Create account at [betterstack.com](https://betterstack.com)
2. Add a monitor for your `/api/health` endpoint
3. Set check interval to 60 seconds

### Monitors to Create

| URL                                 | Interval | Timeout | Regions |
| ----------------------------------- | -------- | ------- | ------- |
| `https://yourdomain.com/api/health` | 60s      | 30s     | US, EU  |
| `https://yourdomain.com`            | 300s     | 30s     | US, EU  |

### Incident Management

- Connect Slack or email for alerts
- Set escalation: email immediately, Slack after 5 min, phone after 15 min

## 3. PostHog (Product Analytics)

### Setup

1. Create project at [posthog.com](https://posthog.com)
2. Copy the project API key and host

### Environment Variables

```env
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

### Key Events to Track

- `user_signed_up` — Registration completed
- `user_logged_in` — Login success
- `checkout_started` — Clicked upgrade button
- `checkout_completed` — Stripe checkout success
- `subscription_cancelled` — User cancelled plan
- `feature_used` — Key feature interactions

### Dashboards to Create

1. **Growth** — Signups over time, active users, retention
2. **Revenue** — Checkout funnel, upgrade rate, churn
3. **Feature Usage** — Most used features, power users

## 4. Vercel Analytics (Optional)

If deployed on Vercel:

1. Enable **Web Analytics** in project settings
2. Enable **Speed Insights** for Core Web Vitals
3. No code changes needed — Vercel injects the script automatically

## 5. Health Check Endpoint

Already implemented at `/api/health`:

```
GET /api/health → { status: "ok", timestamp: "..." }
```

Use this endpoint for uptime monitoring, load balancer health checks, and deployment verification.
