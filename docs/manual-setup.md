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
- [x] Settings → Actions → General → Workflow permissions → dejar el default (el workflow ya define sus permisos en el YAML)

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

- [x] Crear repo `saas-template` en GitHub (privado)
- [x] Push del codigo
- [x] Settings → General → **Template repository** → Marcar checkbox ✅
- [x] Settings → Actions → General → Workflow permissions → dejar el default (el workflow define sus permisos en el YAML)

#### Paso 2: Token para instalar paquetes privados

Para que `pnpm install` pueda descargar `@nyxidiom/*` desde GitHub Packages,
necesitas un Personal Access Token (PAT).

- [ ] Ve a GitHub → Settings (tu perfil, no el repo) → Developer settings → **Personal access tokens** → **Tokens (classic)**
- [ ] Generate new token (classic):
  - Note: `nyxidiomanualm-packages-read`
  - Expiration: **No expiration** (o 1 year)
  - Scopes: marcar solo **`read:packages`**
  - Click **Generate token**
  - **Copia el token** (empieza por `ghp_...`) — no lo volveras a ver

#### Paso 3: Configurar el token en tu maquina local

- [x] Ejecuta esto en tu terminal (reemplaza `TOKEN` por tu token):

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

- [x] Crear cuenta en [neon.tech](https://neon.tech)
- [x] Crear proyecto (region: `eu-central-1` Frankfurt — la mas cercana a España)
- [x] Copiar el connection string (formato: `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)
- [x] Guardar como `DATABASE_URL` en `apps/web/.env.local`:

```bash
cp apps/web/.env.example apps/web/.env.local
# Editar apps/web/.env.local y pegar el connection string en DATABASE_URL
```

> **Nota:** El `.env.local` va en `apps/web/` porque Next.js lo carga desde ahi. Los scripts de `packages/db` (drizzle, seed) tambien lo leen desde esa ruta.

- [x] Generar migraciones a partir de los schemas: `pnpm db:generate`
- [x] Aplicar migraciones a la base de datos: `pnpm db:migrate`
- [x] Ejecutar seed: `pnpm db:seed`
- [x] Verificar en Neon Dashboard que las tablas existen:
  - [x] `users`, `accounts`, `sessions`, `verification_tokens`
  - [x] `plans`, `subscriptions`, `invoices`
  - [x] `organizations`, `members`, `invitations`
- [x] Verificar que el seed creo los 3 planes: `free`, `pro`, `enterprise`

---

## 3. Google OAuth

- [x] Ir a [Google Cloud Console](https://console.cloud.google.cox)
- [x] Crear proyecto (o usar uno existente)
- [x] APIs & Services → OAuth consent screen:
  - [x] User Type: **External**
  - [x] App name, logo, support email
  - [x] Test users: añadir tu email durante desarrollo
- [x] APIs & Services → Credentials → Create OAuth Client ID:
  - [x] Application type: **Web application**
  - [x] Authorized JavaScript origins: `http://localhost:3000`
  - [x] Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- [x] Copiar **Client ID** → `AUTH_GOOGLE_ID` en `apps/web/.env.local`
- [x] Copiar **Client Secret** → `AUTH_GOOGLE_SECRET` en `apps/web/.env.local`
- [x] Generar `AUTH_SECRET` y añadir en `apps/web/.env.local`:

```bash
npx auth secret
```

Esto genera un secret aleatorio y lo imprime. Copialo al `.env.local` como `AUTH_SECRET=...`. Es necesario para firmar los JWT de sesion.

---

## 4. Stripe

### Cuenta y productos

- [x] Crear cuenta en [stripe.com](https://stripe.com) (o usar cuenta existente)
- [x] Activar **Test mode** (toggle arriba a la derecha)
- [x] Crear 3 productos en Products:

| Producto   | Precio  | Recurrencia | Lookup Key   |
| ---------- | ------- | ----------- | ------------ |
| Free       | $0      | —           | `free`       |
| Pro        | $29/mes | Monthly     | `pro`        |
| Enterprise | $99/mes | Monthly     | `enterprise` |

- [x] Copiar cada **Price ID** (`price_xxx`) y actualizar en la DB:

```bash
# Abrir Drizzle Studio (dashboard visual de la DB)
pnpm db:studio
```

En Drizzle Studio, ir a la tabla `plans` y actualizar la columna `stripe_price_id` de cada plan con su Price ID correspondiente. Se puede editar haciendo click en la celda directamente.

### API Keys

- [x] Developers → API keys:
  - [x] Copiar **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY` en `apps/web/.env.local`

### Webhooks — Local (desarrollo)

- [x] Instalar Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [x] Login: `stripe login`
- [x] Escuchar webhooks locales:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- [x] Copiar el **webhook signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

---

## 5. Resend (Email)

- [x] Crear cuenta en [resend.com](https://resend.com)
- [x] API Keys → Create API Key → copiar → `RESEND_API_KEY` en `apps/web/.env.local`

---

## 6. Upstash Redis (Rate Limiting)

- [x] Crear cuenta en [upstash.com](https://upstash.com)
- [x] Crear base de datos Redis:
  - [x] Region: misma que tu app (ej: `eu-central-1`)
  - [x] Type: **Regional** (mas barato) o **Global** (mas rapido)
- [x] Copiar **REST URL** → `UPSTASH_REDIS_REST_URL`
- [x] Copiar **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

---

## 7. Sentry (Error Tracking)

- [x] Crear cuenta en [sentry.io](https://sentry.io)
- [x] Crear proyecto → Platform: **Next.js**
- [x] Copiar **DSN** → `NEXT_PUBLIC_SENTRY_DSN` en `apps/web/.env.local`

---

## 8. PostHog (Analytics)

- [z] Crear cuenta en [posthog.com](https://posthog.com) (free tier: 1M events/mes)
- [x] Project Settings → copiar **Project API Key** → `NEXT_PUBLIC_POSTHOG_KEY` en `apps/web/.env.local`
- [x] Copiar **Host** segun tu region → `NEXT_PUBLIC_POSTHOG_HOST` en `apps/web/.env.local`:
  - EU Cloud: `https://eu.i.posthog.com`
  - US Cloud: `https://us.i.posthog.com`

---

## 9. Verificacion Local

Una vez todo configurado, ejecutar estas comprobaciones:

- [x] `pnpm dev` → la app carga en `localhost:3000`
- [x] `pnpm typecheck` → 0 errores
- [x] `pnpm lint` → 0 errores
- [x] `pnpm test` → tests pasan

### Auth flow

- [x] Registro con Google → redirige a `/welcome`
- [x] Registro con Magic Link → email llega, link funciona
- [x] Login → redirige a `/dashboard`
- [x] Logout → redirige a `/login`
- [x] `/dashboard` sin sesion → redirige a `/login`

### Payments flow

- [x] Click en "Start Free Trial" en pricing → abre Stripe Checkout
- [x] Completar checkout con tarjeta de test (`4242 4242 4242 4242`)
- [x] Webhook procesa → subscription aparece en DB
- [x] Billing settings → "Manage Subscription" abre Stripe Customer Portal
- [x] Cancelar subscription → webhook actualiza DB

---

---

# Configuracion de Produccion

> Todo lo de abajo requiere un dominio real. Configurar cuando se haga deploy.

---

## 10. Vercel (Deploy)

### Proyecto

- [x] Ir a [vercel.com](https://vercel.com) → Import Git Repository
- [x] Seleccionar repo `saas-template`
- [x] Configura todas las Environment Variables

### Dominio

- [ ] Settings → Domains → Add Domain
- [ ] Configurar DNS en Cloudflare (ver seccion 11)
- [ ] Verificar que SSL funciona

### Preview Deployments

- [ ] Verificar que el primer deploy funciona
- [ ] Opcional: proteger previews con Vercel Authentication

---

## 11. Cloudflare (CDN/Security)

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

## 12. Google OAuth — Produccion

- [ ] APIs & Services → Credentials → editar el OAuth Client ID:
  - [ ] Añadir a Authorized JavaScript origins: `https://tudominio.com`
  - [ ] Añadir a Authorized redirect URIs: `https://tudominio.com/api/auth/callback/google`

---

## 13. Stripe — Produccion

### Webhooks

- [ ] Developers → Webhooks → Add endpoint:
  - [ ] URL: `https://tudominio.com/api/webhooks/stripe`
  - [ ] Events a escuchar:
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`
  - [ ] Copiar **Signing secret** → `STRIPE_WEBHOOK_SECRET` en Vercel env vars

### Customer Portal

- [ ] Settings → Billing → Customer portal:
  - [ ] Activar portal
  - [ ] Configurar que planes pueden cambiar
  - [ ] Permitir cancelacion
  - [ ] Configurar branding (logo, colores)

---

## 14. Sentry — Produccion

- [ ] Settings → **Organization** Auth Tokens → Create Token (NO usar Personal token)
- [ ] Añadir en Vercel env vars:
  - [ ] `SENTRY_AUTH_TOKEN` — el token que acabas de crear
  - [ ] `SENTRY_ORG` — org slug (se ve en la URL: `sentry.io/organizations/TU_ORG/`)
  - [ ] `SENTRY_PROJECT` — project slug (se ve en Settings → Projects)
- [ ] Configurar alertas:
  - [ ] New issue → notificar por email/Slack
  - [ ] Issue frequency > 10/hora → alerta critica

---

## 15. Resend — Produccion

- [ ] Domains → Add Domain → añadir tu dominio
- [ ] Configurar DNS records (SPF, DKIM, DMARC) segun instrucciones de Resend
- [ ] Esperar verificacion
- [ ] Actualizar `EMAIL_FROM` en Vercel: `"App Name <noreply@tudominio.com>"`

---

## 16. Vercel Observability — Recomendado

- [ ] En Vercel project settings → Observability
- [ ] Activar Log Drains ($10/mes) para 30 dias de retencion de logs
- [ ] (Opcional) Anadir uptime monitor externo (UptimeRobot o Better Stack gratis) apuntando a `https://tudominio.com/api/health`

---

## 17. Verificacion Produccion

- [ ] Deploy en Vercel funciona sin errores
- [ ] Dominio con HTTPS funciona
- [ ] Security headers presentes (comprobar en [securityheaders.com](https://securityheaders.com))
- [ ] Sentry recibe eventos (forzar un error y verificar)
- [ ] PostHog registra pageviews
- [ ] Uptime monitor esta verde
