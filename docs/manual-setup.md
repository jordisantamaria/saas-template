# Manual Setup Checklist

Everything that needs to be configured manually in external services for the template to work at 100%.

---

## 1. GitHub — Repos

### REPO 1: `nyxidiom-packages` — Publishing the packages

This repo contains the shared packages (`@nyxidiom/ui`, `@nyxidiom/config`, etc.).
The goal is to publish them to **GitHub Packages** (a free private npm registry from GitHub)
so that `saas-template` can install them with `pnpm install`.

#### Step 1: Repo and permissions

- [x] Create `nyxidiom-packages` repo on GitHub (private)
- [x] Push the code
- [x] Settings → Actions → General → Workflow permissions → leave the default (the workflow already defines its permissions in the YAML)
- [ ] Settings → Actions → General → check **"Allow GitHub Actions to create and approve pull requests"** (needed for Changesets to automatically create the versioning PR)

#### Step 2: First publish (automatic via GitHub Actions)

The repo already has a workflow `.github/workflows/publish.yml` that uses Changesets.
Changesets is a tool that manages versions: you tell it "I changed X",
and it bumps the version and publishes automatically.

- [ ] In your terminal, from the root of `nyxidiom-packages`:

```bash
# 1. Create a changeset — it will ask which packages changed and whether it's patch/minor/major
pnpm changeset
# Select all packages (space to select, enter to confirm)
# Type: minor (first release)
# Summary: "Initial release"
```

This creates a file in `.changeset/` describing the changes.

- [x] Apply the versions:

```bash
# 2. This reads the changesets and updates the versions in each package.json
pnpm version-packages
```

You'll see that the `package.json` of each package changes its version (e.g., 0.1.0 → 0.2.0).

- [x] Commit and push to main:

```bash
git add .
git commit -m "chore: version packages for first release"
git push
```

- [x] The `Publish` GitHub Action will run automatically:
  1. Builds all packages
  2. Publishes each `@nyxidiom/*` to GitHub Packages
  3. If it fails, check the **Actions** tab of the repo for the log

#### Step 4: Verify they were published

- [x] Go to your repo on GitHub → **Packages** tab (in the right sidebar)
- [x] The 4 packages should appear:
  - [x] `@nyxidiom/config`
  - [x] `@nyxidiom/ui`
  - [x] `@nyxidiom/email`
  - [x] `@nyxidiom/shared`
  - [x] `@nyxidiom/storage`

If the Packages tab doesn't appear, go to `https://github.com/YOUR_USERNAME?tab=packages`.

#### For future releases

Every time you want to publish changes:

```bash
pnpm changeset          # Describe what changed
pnpm version-packages   # Update versions
git add . && git commit -m "chore: version packages" && git push
# The Action publishes automatically
```

---

### REPO 2: `saas-template` — Configure to install the packages

This repo has an `.npmrc` that already points to GitHub Packages for `@nyxidiom/*`.
But it needs a token to authenticate when running `pnpm install`.

#### Step 1: Basic repo

- [x] Create `saas-template` repo on GitHub (private)
- [x] Push the code
- [x] Settings → General → **Template repository** → Check the checkbox
- [x] Settings → Actions → General → Workflow permissions → leave the default (the workflow defines its permissions in the YAML)

#### Step 2: Token to install private packages

For `pnpm install` to be able to download `@nyxidiom/*` from GitHub Packages,
you need a Personal Access Token (PAT).

- [ ] Go to GitHub → Settings (your profile, not the repo) → Developer settings → **Personal access tokens** → **Tokens (classic)**
- [ ] Generate new token (classic):
  - Note: `nyxidiom-packages-read`
  - Expiration: **No expiration** (or 1 year)
  - Scopes: check only **`read:packages`**
  - Click **Generate token**
  - **Copy the token** (starts with `ghp_...`) — you won't see it again

#### Step 3: Configure the token on your local machine

- [x] Run this in your terminal (replace `TOKEN` with your token):

```bash
npm config set //npm.pkg.github.com/:_authToken TOKEN
```

This saves the token in your global `~/.npmrc`. Now `pnpm install` can download `@nyxidiom/*`.

#### Step 4: Configure the token for CI (GitHub Actions)

- [ ] In the `saas-template` repo → Settings → Secrets and variables → Actions → **New repository secret**:
  - Name: `NPM_TOKEN`
  - Value: the same `ghp_...` token

- [ ] Other secrets needed for CI:
  - [ ] `DATABASE_URL` — Neon connection string (can be a test branch)
  - [ ] `AUTH_SECRET` — generate with `openssl rand -base64 32`

#### Step 5: Verify

```bash
cd saas-template
pnpm install   # Should install @nyxidiom/* from GitHub Packages without errors
```

If you get a 401 or 403 error, the token doesn't have permissions or isn't configured correctly.

---

## 2. Neon PostgreSQL

- [x] Create an account at [neon.tech](https://neon.tech)
- [x] Create a project (region: `eu-central-1` Frankfurt — closest to Spain)
- [x] Copy the connection string (format: `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)
- [x] Save as `DATABASE_URL` in `apps/web/.env.local`:

```bash
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local and paste the connection string in DATABASE_URL
```

> **Note:** The `.env.local` goes in `apps/web/` because Next.js loads it from there. The `packages/db` scripts (drizzle, seed) also read it from that path.

- [x] Generate migrations from schemas: `pnpm db:generate`
- [x] Apply migrations to the database: `pnpm db:migrate`
- [x] Run seed: `pnpm db:seed`
- [x] Verify in the Neon Dashboard that tables exist:
  - [x] `users`, `accounts`, `sessions`, `verification_tokens`
  - [x] `plans`, `subscriptions`, `invoices`
  - [x] `organizations`, `members`, `invitations`
- [x] Verify that the seed created the 3 plans: `free`, `pro`, `enterprise`

---

## 3. Google OAuth

- [x] Go to [Google Cloud Console](https://console.cloud.google.cox)
- [x] Create a project (or use an existing one)
- [x] APIs & Services → OAuth consent screen:
  - [x] User Type: **External**
  - [x] App name, logo, support email
  - [x] Test users: add your email during development
- [x] APIs & Services → Credentials → Create OAuth Client ID:
  - [x] Application type: **Web application**
  - [x] Authorized JavaScript origins: `http://localhost:3000`
  - [x] Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- [x] Copy **Client ID** → `AUTH_GOOGLE_ID` in `apps/web/.env.local`
- [x] Copy **Client Secret** → `AUTH_GOOGLE_SECRET` in `apps/web/.env.local`
- [x] Generate `AUTH_SECRET` and add to `apps/web/.env.local`:

```bash
npx auth secret
```

This generates a random secret and prints it. Copy it to `.env.local` as `AUTH_SECRET=...`. It's needed to sign session JWTs.

---

## 4. Stripe

### Account and products

- [x] Create an account at [stripe.com](https://stripe.com) (or use an existing one)
- [x] Enable **Test mode** (toggle in the top right)
- [x] Create 3 products in Products:

| Product    | Price   | Recurrence  | Lookup Key   |
| ---------- | ------- | ----------- | ------------ |
| Free       | $0      | —           | `free`       |
| Pro        | $29/mo  | Monthly     | `pro`        |
| Enterprise | $99/mo  | Monthly     | `enterprise` |

- [x] Copy each **Price ID** (`price_xxx`) and update in the DB:

```bash
# Open Drizzle Studio (visual DB dashboard)
pnpm db:studio
```

In Drizzle Studio, go to the `plans` table and update the `stripe_price_id` column for each plan with its corresponding Price ID. You can edit by clicking directly on the cell.

### API Keys

- [x] Developers → API keys:
  - [x] Copy **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY` in `apps/web/.env.local`

### Webhooks — Local (development)

- [x] Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [x] Login: `stripe login`
- [x] Listen to local webhooks:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- [x] Copy the **webhook signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

---

## 5. Resend (Email)

- [x] Create an account at [resend.com](https://resend.com)
- [x] API Keys → Create API Key → copy → `RESEND_API_KEY` in `apps/web/.env.local`

---

## 6. Upstash Redis (Rate Limiting)

- [x] Create an account at [upstash.com](https://upstash.com)
- [x] Create a Redis database:
  - [x] Region: same as your app (e.g., `eu-central-1`)
  - [x] Type: **Regional** (cheaper) or **Global** (faster)
- [x] Copy **REST URL** → `UPSTASH_REDIS_REST_URL`
- [x] Copy **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

---

## 7. Sentry (Error Tracking)

- [x] Create an account at [sentry.io](https://sentry.io)
- [x] Create a project → Platform: **Next.js**
- [x] Copy **DSN** → `NEXT_PUBLIC_SENTRY_DSN` in `apps/web/.env.local`

---

## 8. PostHog (Analytics)

- [z] Create an account at [posthog.com](https://posthog.com) (free tier: 1M events/month)
- [x] Project Settings → copy **Project API Key** → `NEXT_PUBLIC_POSTHOG_KEY` in `apps/web/.env.local`
- [x] Copy **Host** based on your region → `NEXT_PUBLIC_POSTHOG_HOST` in `apps/web/.env.local`:
  - EU Cloud: `https://eu.i.posthog.com`
  - US Cloud: `https://us.i.posthog.com`

---

## 9. Cloudflare R2 (File Storage)

The template uses Cloudflare R2 (S3-compatible) for uploading avatars and other files.
R2 has no egress cost, you only pay for storage ($0.015/GB/month) and operations.

### Account and bucket

- [x] Create an account at [cloudflare.com](https://cloudflare.com) (if you don't have one already)
- [x] Dashboard → R2 Object Storage → **Create bucket**:
  - [x] Name: `your-project-storage` (or similar)
  - [x] Region: **Automatic** (or closest to your users)

### API Token

- [x] R2 Object Storage → Overview → **Manage R2 API Tokens** → **Create API token**:
  - [x] Permissions: **Object Read & Write**
  - [x] Specify bucket: select the bucket you just created
  - [x] TTL: **No expiration** (or per your preference)
  - [x] Click **Create API Token**
- [x] Copy the values that appear:
  - [x] **Access Key ID** → `R2_ACCESS_KEY_ID` in `apps/web/.env.local`
  - [x] **Secret Access Key** → `R2_SECRET_ACCESS_KEY` in `apps/web/.env.local`

### Endpoint and public URL

- [x] Copy the **S3 API endpoint** of the bucket (format: `https://ACCOUNT_ID.r2.cloudflarestorage.com`) → `R2_ENDPOINT` in `apps/web/.env.local`
- [x] The **Account ID** can be found in the Cloudflare dashboard URL or in the bucket's Overview
- [x] Set the bucket name → `R2_BUCKET_NAME` in `apps/web/.env.local`

### Public access (for serving avatars)

Avatars need to be publicly accessible. There are two options:

**Option A: r2.dev subdomain (quick for dev)**

- [x] R2 → bucket → Settings → **Public Development URL** → enable toggle
- [x] Copy the URL (format: `https://pub-xxx.r2.dev`) → `NEXT_PUBLIC_R2_PUBLIC_URL` in `apps/web/.env.local`

**Option B: Custom domain (recommended for production)**

- [ ] R2 → bucket → Settings → **Public access** → **Custom Domains** → Connect Domain
- [ ] Use a subdomain like `assets.yourdomain.com`
- [ ] Cloudflare configures DNS automatically if the domain is already on Cloudflare
- [ ] Use `https://assets.yourdomain.com` → `NEXT_PUBLIC_R2_PUBLIC_URL`

### Verify

```bash
# The .env.local should have these 5 variables:
# R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
# R2_ACCESS_KEY_ID=xxx
# R2_SECRET_ACCESS_KEY=xxx
# R2_BUCKET_NAME=your-project-storage
# NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

- [x] `pnpm dev` → go to Settings → upload an avatar → it displays correctly

---

## 10. Local Verification

Once everything is configured, run these checks:

- [x] `pnpm dev` → the app loads at `localhost:3000`
- [x] `pnpm typecheck` → 0 errors
- [x] `pnpm lint` → 0 errors
- [x] `pnpm test` → tests pass

### Auth flow

- [x] Register with Google → redirects to `/welcome`
- [x] Register with Magic Link → email arrives, link works
- [x] Login → redirects to `/dashboard`
- [x] Logout → redirects to `/login`
- [x] `/dashboard` without session → redirects to `/login`

### Payments flow

- [x] Click "Start Free Trial" on pricing → opens Stripe Checkout
- [x] Complete checkout with test card (`4242 4242 4242 4242`)
- [x] Webhook processes → subscription appears in DB
- [x] Billing settings → "Manage Subscription" opens Stripe Customer Portal
- [x] Cancel subscription → webhook updates DB

---

---

# Production Configuration

> Everything below requires a real domain. Configure when deploying.

---

## 11. Vercel (Deploy)

### Project

- [x] Go to [vercel.com](https://vercel.com) → Import Git Repository
- [x] Select the `saas-template` repo
- [x] Configure all Environment Variables

### Domain

- [ ] Settings → Domains → Add Domain
- [ ] Configure DNS in Cloudflare (see section 12)
- [ ] Verify that SSL works

### Preview Deployments

- [ ] Verify that the first deploy works
- [ ] Optional: protect previews with Vercel Authentication

---

## 12. Cloudflare (CDN/Security)

- [ ] Create an account at [cloudflare.com](https://cloudflare.com) (free tier works)
- [ ] Add site → Enter domain
- [ ] Change nameservers at your registrar to Cloudflare's
- [ ] Wait for DNS propagation (up to 24h, usually minutes)
- [ ] DNS records:
  - [ ] `A` → `76.76.21.21` (Vercel)
  - [ ] `CNAME www` → `cname.vercel-dns.com`
- [ ] SSL/TLS → **Full (strict)**
- [ ] Edge Certificates → Always Use HTTPS → **On**
- [ ] Edge Certificates → Minimum TLS Version → **1.2**
- [ ] Speed → Optimization:
  - [ ] Brotli → **On**
  - [ ] Early Hints → **On**
- [ ] Security → Bot Fight Mode → **On**
- [ ] See `docs/setup-cloudflare.md` for WAF rules and Page Rules

---

## 13. Google OAuth — Production

- [ ] APIs & Services → Credentials → edit the OAuth Client ID:
  - [ ] Add to Authorized JavaScript origins: `https://yourdomain.com`
  - [ ] Add to Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

---

## 14. Stripe — Production

### Webhooks

- [ ] Developers → Webhooks → Add endpoint:
  - [ ] URL: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Events to listen to:
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`
  - [ ] Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### Customer Portal

- [ ] Settings → Billing → Customer portal:
  - [ ] Enable portal
  - [ ] Configure which plans can be changed
  - [ ] Allow cancellation
  - [ ] Configure branding (logo, colors)

---

## 15. Sentry — Production

- [ ] Settings → **Organization** Auth Tokens → Create Token (DO NOT use Personal token)
- [ ] Add to Vercel env vars:
  - [ ] `SENTRY_AUTH_TOKEN` — the token you just created
  - [ ] `SENTRY_ORG` — org slug (visible in the URL: `sentry.io/organizations/YOUR_ORG/`)
  - [ ] `SENTRY_PROJECT` — project slug (visible in Settings → Projects)
- [ ] Configure alerts:
  - [ ] New issue → notify by email/Slack
  - [ ] Issue frequency > 10/hour → critical alert

---

## 16. Resend — Production

- [ ] Domains → Add Domain → add your domain
- [ ] Configure DNS records (SPF, DKIM, DMARC) according to Resend's instructions
- [ ] Wait for verification
- [ ] Update `EMAIL_FROM` in Vercel: `"App Name <noreply@yourdomain.com>"`

---

## 17. Vercel Observability — Recommended

- [ ] In Vercel project settings → Observability
- [ ] Enable Log Drains ($10/month) for 30-day log retention
- [ ] (Optional) Add an external uptime monitor (UptimeRobot or Better Stack free) pointing to `https://yourdomain.com/api/health`

---

## 18. Production Verification

- [ ] Deploy to Vercel works without errors
- [ ] Domain with HTTPS works
- [ ] Security headers present (check at [securityheaders.com](https://securityheaders.com))
- [ ] Sentry receives events (force an error and verify)
- [ ] PostHog records pageviews
- [ ] Uptime monitor is green
