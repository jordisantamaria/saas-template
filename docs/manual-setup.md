# Manual Setup Checklist

Todo lo que hay que configurar a mano en servicios externos para que el template funcione al 100%.

---

## 1. GitHub — Repos

### REPO 1: `nyxidiom-packages` — Publicar los paquetes

Este repo contiene los paquetes compartidos (`@nyxidiom/ui`, `@nyxidiom/config`, etc.).
El objetivo es publicarlos a **GitHub Packages** (un registry npm privado gratuito de GitHub)
para que `saas-template` los pueda instalar con `pnpm install`.

#### Paso 1: Repo y permisos

- [x] Crear repo `nyxidiom-packages` en GitHub (privado)
- [x] Push del codigo
- [x] Settings → Actions → General → Workflow permissions → **Read and write**

#### Paso 2: Primer publish (automatico via GitHub Actions)

El repo ya tiene un workflow `.github/workflows/publish.yml` que usa Changesets.
Changesets es una herramienta que gestiona versiones: tu le dices "he cambiado X",
y ella sube la version y publica automaticamente.

- [ ] En tu terminal, desde la raiz de `nyxidiom-packages`:

```bash
# 1. Crear un changeset — te preguntara que paquetes cambiaron y si es patch/minor/major
pnpm changeset
# Selecciona todos los paquetes (space para seleccionar, enter para confirmar)
# Tipo: minor (primera release)
# Summary: "Initial release"
```

Esto crea un fichero en `.changeset/` describiendo los cambios.

- [x] Aplicar las versiones:

```bash
# 2. Esto lee los changesets y actualiza las versiones en cada package.json
pnpm version-packages
```

Veras que los `package.json` de cada paquete cambian su version (ej: 0.1.0 → 0.2.0).

- [x] Commit y push a main:

```bash
git add .
git commit -m "chore: version packages for first release"
git push
```

- [x] El GitHub Action `Publish` se ejecutara automaticamente:
  1. Hace build de todos los paquetes
  2. Publica cada `@nyxidiom/*` a GitHub Packages
  3. Si falla, mira la tab **Actions** del repo para ver el log

#### Paso 4: Verificar que se publicaron

- [x] Ve a tu repo en GitHub → tab **Packages** (en la sidebar derecha)
- [x] Deben aparecer los 4 paquetes:
  - [x] `@nyxidiom/config`
  - [x] `@nyxidiom/ui`
  - [x] `@nyxidiom/email`
  - [x] `@nyxidiom/shared`

Si no aparece la tab Packages, ve a `https://github.com/TU_USUARIO?tab=packages`.

#### Para futuras releases

Cada vez que quieras publicar cambios:

```bash
pnpm changeset          # Describir que cambio
pnpm version-packages   # Actualizar versiones
git add . && git commit -m "chore: version packages" && git push
# El Action publica automaticamente
```

---

### REPO 2: `saas-template` — Configurar para instalar los paquetes

Este repo tiene un `.npmrc` que ya apunta a GitHub Packages para `@nyxidiom/*`.
Pero necesita un token para autenticarse al hacer `pnpm install`.

#### Paso 1: Repo basico

- [ ] Crear repo `saas-template` en GitHub (privado)
- [ ] Push del codigo
- [ ] Settings → General → **Template repository** → Marcar checkbox ✅
- [ ] Settings → Actions → General → Workflow permissions → **Read and write**

#### Paso 2: Token para instalar paquetes privados

Para que `pnpm install` pueda descargar `@nyxidiom/*` desde GitHub Packages,
necesitas un Personal Access Token (PAT).

- [ ] Ve a GitHub → Settings (tu perfil, no el repo) → Developer settings → **Personal access tokens** → **Tokens (classic)**
- [ ] Generate new token (classic):
  - Note: `nyxidiom-packages-read`
  - Expiration: **No expiration** (o 1 year)
  - Scopes: marcar solo **`read:packages`**
  - Click **Generate token**
  - **Copia el token** (empieza por `ghp_...`) — no lo volveras a ver

#### Paso 3: Configurar el token en tu maquina local

- [ ] Ejecuta esto en tu terminal (reemplaza `TOKEN` por tu token):

```bash
npm config set //npm.pkg.github.com/:_authToken TOKEN
```

Esto guarda el token en tu `~/.npmrc` global. Ahora `pnpm install` puede descargar `@nyxidiom/*`.

#### Paso 4: Configurar el token para CI (GitHub Actions)

- [ ] En el repo `saas-template` → Settings → Secrets and variables → Actions → **New repository secret**:
  - Name: `NPM_TOKEN`
  - Value: el mismo token `ghp_...`

- [ ] Otros secrets necesarios para CI:
  - [ ] `DATABASE_URL` — connection string de Neon (puede ser un branch de test)
  - [ ] `AUTH_SECRET` — generar con `openssl rand -base64 32`

#### Paso 5: Verificar

```bash
cd saas-template
pnpm install   # Deberia instalar @nyxidiom/* desde GitHub Packages sin errores
```

Si da error 401 o 403, el token no tiene permisos o no esta configurado correctamente.

---

## 2. Neon PostgreSQL

- [ ] Crear cuenta en [neon.tech](https://neon.tech)
- [ ] Crear proyecto (region: `eu-central-1` o `us-east-1` segun cliente)
- [ ] Copiar el connection string (formato: `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)
- [ ] Guardar como `DATABASE_URL` en `.env`
- [ ] Ejecutar migraciones: `pnpm db:migrate`
- [ ] Ejecutar seed: `pnpm db:seed`
- [ ] Verificar en Neon Dashboard que las tablas existen:
  - [ ] `users`, `accounts`, `sessions`, `verification_tokens`
  - [ ] `plans`, `subscriptions`, `invoices`
  - [ ] `organizations`, `members`, `invitations`
- [ ] Verificar que el seed creo los 3 planes: `free`, `pro`, `enterprise`

---

## 3. Google OAuth

- [ ] Ir a [Google Cloud Console](https://console.cloud.google.com)
- [ ] Crear proyecto (o usar uno existente)
- [ ] APIs & Services → OAuth consent screen:
  - [ ] User Type: **External**
  - [ ] App name, logo, support email
  - [ ] Scopes: `email`, `profile`, `openid`
  - [ ] Test users: añadir tu email durante desarrollo
- [ ] APIs & Services → Credentials → Create OAuth Client ID:
  - [ ] Application type: **Web application**
  - [ ] Authorized JavaScript origins: `http://localhost:3000`
  - [ ] Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
  - [ ] **PRODUCCION:** Añadir tambien `https://tudominio.com` y `https://tudominio.com/api/auth/callback/google`
- [ ] Copiar **Client ID** → `AUTH_GOOGLE_ID` en `.env`
- [ ] Copiar **Client Secret** → `AUTH_GOOGLE_SECRET` en `.env`

---

## 4. Stripe

### Cuenta y productos

- [ ] Crear cuenta en [stripe.com](https://stripe.com) (o usar cuenta existente)
- [ ] Activar **Test mode** (toggle arriba a la derecha)
- [ ] Crear 3 productos en Products:

| Producto | Precio | Recurrencia | Lookup Key |
|----------|--------|-------------|------------|
| Free | $0 | — | `free` |
| Pro | $29/mes | Monthly | `pro` |
| Enterprise | $99/mes | Monthly | `enterprise` |

- [ ] Copiar cada **Price ID** (`price_xxx`) y actualizar en la DB (tabla `plans`, columna `stripe_price_id`)
- [ ] Alternativa: actualizar `packages/payments/src/plans.ts` con los Price IDs

### API Keys

- [ ] Developers → API keys:
  - [ ] Copiar **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] Copiar **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`

### Webhooks — Local (desarrollo)

- [ ] Instalar Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [ ] Login: `stripe login`
- [ ] Escuchar webhooks locales:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- [ ] Copiar el **webhook signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### Webhooks — Produccion

- [ ] Developers → Webhooks → Add endpoint:
  - [ ] URL: `https://tudominio.com/api/webhooks/stripe`
  - [ ] Events a escuchar:
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`
  - [ ] Copiar **Signing secret** → `STRIPE_WEBHOOK_SECRET` (produccion)

### Customer Portal

- [ ] Settings → Billing → Customer portal:
  - [ ] Activar portal
  - [ ] Configurar que planes pueden cambiar
  - [ ] Permitir cancelacion
  - [ ] Configurar branding (logo, colores)

---

## 5. Resend (Email)

- [ ] Crear cuenta en [resend.com](https://resend.com)
- [ ] API Keys → Create API Key → copiar → `RESEND_API_KEY`
- [ ] Domains → Add Domain:
  - [ ] Añadir tu dominio
  - [ ] Configurar DNS records (SPF, DKIM, DMARC) segun instrucciones de Resend
  - [ ] Esperar verificacion (puede tardar minutos a horas)
- [ ] Actualizar `EMAIL_FROM` en `.env`: `"App Name <noreply@tudominio.com>"`
- [ ] Probar envio: `stripe trigger checkout.session.completed` deberia generar un email

---

## 6. Upstash Redis (Rate Limiting)

- [ ] Crear cuenta en [upstash.com](https://upstash.com)
- [ ] Crear base de datos Redis:
  - [ ] Region: misma que tu app (ej: `us-east-1`)
  - [ ] Type: **Regional** (mas barato) o **Global** (mas rapido)
- [ ] Copiar **REST URL** → `UPSTASH_REDIS_REST_URL`
- [ ] Copiar **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

---

## 7. Sentry (Error Tracking)

- [ ] Crear cuenta en [sentry.io](https://sentry.io)
- [ ] Crear proyecto → Platform: **Next.js**
- [ ] Copiar **DSN** → `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Settings → Auth Tokens → Create Token → `SENTRY_AUTH_TOKEN`
- [ ] Anotar org slug → `SENTRY_ORG` (para CI)
- [ ] Anotar project slug → `SENTRY_PROJECT` (para CI)
- [ ] Configurar alertas:
  - [ ] New issue → notificar por email/Slack
  - [ ] Issue frequency > 10/hora → alerta critica

---

## 8. PostHog (Analytics)

- [ ] Crear cuenta en [posthog.com](https://posthog.com) (free tier: 1M events/mes)
- [ ] Project Settings → copiar **Project API Key** → `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] Copiar **Host** (normalmente `https://us.i.posthog.com`) → `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] Crear dashboards:
  - [ ] **Growth:** signups, DAU, WAU, retention
  - [ ] **Revenue:** checkout funnel, conversions
  - [ ] **Feature Usage:** feature flags, top features

---

## 9. Vercel (Deploy)

### Proyecto

- [ ] Ir a [vercel.com](https://vercel.com) → Import Git Repository
- [ ] Seleccionar repo `saas-template`
- [ ] Framework Preset: **Next.js**
- [ ] Root Directory: `apps/web`
- [ ] Build Command: `cd ../.. && pnpm turbo build --filter=web`
- [ ] Install Command: `pnpm install`

### Environment Variables

Añadir **todas** estas en Vercel (Settings → Environment Variables):

```
# Database
DATABASE_URL=postgresql://...

# Auth
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_URL=https://tudominio.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=App <noreply@tudominio.com>

# Upstash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=...
SENTRY_PROJECT=...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://tudominio.com
NEXT_PUBLIC_APP_NAME=AppName
```

### Dominio

- [ ] Settings → Domains → Add Domain
- [ ] Configurar DNS en Cloudflare (ver seccion 10)
- [ ] Verificar que SSL funciona

### Preview Deployments

- [ ] Vercel crea previews automaticamente en cada PR
- [ ] Verificar que el primer deploy funciona
- [ ] Opcional: proteger previews con Vercel Authentication

---

## 10. Cloudflare (CDN/Security)

- [ ] Crear cuenta en [cloudflare.com](https://cloudflare.com) (free tier vale)
- [ ] Add site → Introducir dominio
- [ ] Cambiar nameservers en tu registrar a los de Cloudflare
- [ ] Esperar propagacion DNS (hasta 24h, normalmente minutos)
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
- [ ] Ver `docs/setup-cloudflare.md` para reglas WAF y Page Rules

---

## 11. Better Stack (Uptime) — Opcional

- [ ] Crear cuenta en [betterstack.com](https://betterstack.com) (free tier)
- [ ] Monitors → Create Monitor:
  - [ ] URL: `https://tudominio.com/api/health`
  - [ ] Check interval: 60s
  - [ ] Regions: US + EU
- [ ] Configurar alertas: email + Slack

---

## 12. Verificacion Final

Una vez todo configurado, ejecutar estas comprobaciones:

### Local
- [ ] `pnpm dev` → la app carga en `localhost:3000`
- [ ] `pnpm typecheck` → 0 errores
- [ ] `pnpm lint` → 0 errores
- [ ] `pnpm test` → 46 tests pasan

### Auth flow
- [ ] Registro con Google → redirige a `/welcome`
- [ ] Registro con Magic Link → email llega, link funciona
- [ ] Login → redirige a `/dashboard`
- [ ] Logout → redirige a `/login`
- [ ] `/dashboard` sin sesion → redirige a `/login`

### Payments flow
- [ ] Click en "Start Free Trial" en pricing → abre Stripe Checkout
- [ ] Completar checkout con tarjeta de test (`4242 4242 4242 4242`)
- [ ] Webhook procesa → subscription aparece en DB
- [ ] Billing settings → "Manage Subscription" abre Stripe Customer Portal
- [ ] Cancelar subscription → webhook actualiza DB

### Email
- [ ] Magic link llega al email correcto
- [ ] Email tiene branding correcto (logo, colores)

### Produccion
- [ ] Deploy en Vercel funciona sin errores
- [ ] Dominio con HTTPS funciona
- [ ] Security headers presentes (comprobar en [securityheaders.com](https://securityheaders.com))
- [ ] Sentry recibe eventos (forzar un error y verificar)
- [ ] PostHog registra pageviews
- [ ] Uptime monitor esta verde

---

## Resumen de variables `.env`

| Variable | Servicio | Donde conseguirla |
|----------|----------|-------------------|
| `DATABASE_URL` | Neon | Dashboard → Connection string |
| `AUTH_SECRET` | Local | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google Cloud | Credentials → OAuth Client |
| `AUTH_GOOGLE_SECRET` | Google Cloud | Credentials → OAuth Client |
| `AUTH_URL` | — | Tu dominio (produccion) |
| `STRIPE_SECRET_KEY` | Stripe | Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Developers → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | Developers → API keys |
| `RESEND_API_KEY` | Resend | API Keys |
| `EMAIL_FROM` | — | `App <noreply@tudominio.com>` |
| `UPSTASH_REDIS_REST_URL` | Upstash | Database details |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | Database details |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry | Project Settings → Client Keys |
| `SENTRY_AUTH_TOKEN` | Sentry | Settings → Auth Tokens |
| `SENTRY_ORG` | Sentry | Organization slug |
| `SENTRY_PROJECT` | Sentry | Project slug |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog | Project Settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog | Project Settings |
| `NEXT_PUBLIC_APP_URL` | — | `http://localhost:3000` o tu dominio |
| `NEXT_PUBLIC_APP_NAME` | — | Nombre de la app |
