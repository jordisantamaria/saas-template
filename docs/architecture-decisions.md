# Architecture Decisions Record (ADR)

> Documento de referencia con todas las decisiones arquitectonicas de la plantilla SaaS y la justificacion de cada una.

---

## ADR-001: Monorepo con Turborepo

### Decision

Monorepo gestionado con Turborepo + pnpm workspaces.

### Contexto

Como agencia, necesitamos reutilizar modulos entre proyectos de distintos clientes y mantener consistencia en todo el equipo.

### Alternativas evaluadas

| Opcion               | Pros                                           | Contras                                                      |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| **Turborepo + pnpm** | Simple, rapido, cache inteligente, zero-config | Dos herramientas                                             |
| Nx                   | Mas features, plugins, graph visualization     | Overkill para <15 packages, curva alta                       |
| Bun solo             | Una herramienta, rapido                        | Sin task orchestration ni cache inteligente                  |
| Bun + Turborepo      | Install mas rapido                             | Menos battle-tested, edge cases con paquetes                 |
| Repos separados      | Independencia total                            | Friccion entre front/back, tipos duplicados, CI/CD separados |

### Justificacion

- Un solo PR toca front + back + tipos compartidos
- Refactoring sin dolor entre paquetes
- CI/CD unificado
- Onboarding de nuevos devs mas rapido
- pnpm es el package manager mas eficiente en disco (symlinks)
- Turborepo cachea builds localmente y en remoto
- La combinacion mas probada en produccion para monorepos

### Nota sobre Bun

Bun madura rapidamente. En 6-12 meses evaluar migracion de pnpm a Bun como package manager. La migracion es trivial (cambiar lockfile). Turborepo se mantiene como task runner.

---

## ADR-002: Next.js Full-Stack (App Router)

### Decision

Next.js 15 con App Router como framework unico para frontend y backend.

### Contexto

Para startups SaaS, la velocidad de entrega es critica. Separar frontend y backend al inicio genera friccion innecesaria.

### Alternativas evaluadas

| Opcion                   | Pros                                   | Contras                                    |
| ------------------------ | -------------------------------------- | ------------------------------------------ |
| **Next.js full-stack**   | SSR + API + React en uno, DX excelente | Acoplado a Vercel para max performance     |
| React SPA + API separada | Independencia front/back               | Mas infra, CORS, deployment doble          |
| Remix                    | Buen manejo de forms                   | Menor ecosistema, menos integraciones SaaS |
| Nuxt (Vue)               | Bueno si el equipo sabe Vue            | Ecosistema SaaS mas pequeno                |
| Angular                  | Enterprise-ready                       | Lento de iterar, overkill para startup     |

### Justificacion

- React tiene el ecosistema mas grande y mas talento disponible
- SSR/SSG para SEO (landing pages, pricing, blog)
- Server Components reducen JS al browser drasticamente
- Server Actions eliminan la necesidad de API routes internas
- Si el backend crece mucho, se puede extraer despues
- Premature separation kills startups

---

## ADR-003: React sobre Vue y Angular

### Decision

React 19 como libreria de UI.

### Justificacion

- Ecosistema mas grande para SaaS (shadcn/ui, Tremor, TanStack, etc.)
- Mayor pool de talento disponible para contratar
- Mejor tooling y integraciones
- Server Components (exclusivo de React en Next.js)
- Vue: ecosistema SaaS mas pequeno, menos componentes listos
- Angular: overkill para startup, iteracion mas lenta

---

## ADR-004: No Universal / No Tamagui

### Decision

No usar Tamagui ni enfoque universal (web + mobile compartiendo UI) al inicio.

### Contexto

Se evaluo ofrecer "web + mobile" como value proposition de la agencia.

### Alternativas evaluadas

| Opcion                         | Pros                                        | Contras                              |
| ------------------------------ | ------------------------------------------- | ------------------------------------ |
| **Web-first + mobile despues** | Max velocidad, UX optimizada por plataforma | No hay app nativa al inicio          |
| Tamagui + Solito               | UI compartida web/mobile                    | +40-60% mas lento, compromises en UX |
| React Native Web               | Un codebase                                 | Web UX inferior a Next.js nativo     |

### Justificacion

- SaaS B2B (fintech/marketing) es 90%+ web
- Las interfaces de dashboard no se traducen 1:1 a mobile
- Lo que se comparte entre plataformas es logica de negocio, no UI
- El monorepo ya esta preparado para anadir `apps/mobile/` con Expo cuando haga falta
- Mejor vender web primero y upsell mobile como fase 2

### Estrategia mobile cuando llegue el momento

```
apps/mobile/     → Expo + React Native
packages/shared/ → Tipos, validaciones, API client (ya existentes)
```

La UI se construye nativa para cada plataforma. La logica de negocio se comparte via packages/.

---

## ADR-005: Drizzle ORM sobre Prisma

### Decision

Drizzle ORM para acceso a base de datos con schemas modulares.

### Alternativas evaluadas

| Opcion      | Pros                                                        | Contras                                                   |
| ----------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| **Drizzle** | TypeScript nativo, schemas componibles, sin code generation | Mas nuevo                                                 |
| Prisma      | Muy popular, buena DX                                       | Schema monolitico, requiere code gen, dificil modularizar |
| Kysely      | Ligero, type-safe                                           | Menos features, mas manual                                |
| SQL raw     | Control total                                               | Sin type safety, vulnerable a SQL injection               |

### Justificacion

- Schemas son TypeScript puro: se pueden importar, componer y reutilizar entre packages
- No hay paso de code generation (prisma generate)
- Cada modulo (auth, billing, teams) define su propio schema
- La app compone solo los modulos que necesita
- Migraciones SQL-based y composables
- Performance superior (queries mas cercanas a SQL)

### Patron de schemas modulares

```
packages/db/schemas/auth.ts     → users, sessions, accounts
packages/db/schemas/billing.ts  → subscriptions, invoices, plans
packages/db/schemas/teams.ts    → organizations, members

apps/web/src/db/schema.ts       → import y compone solo lo que necesita
```

### Inyeccion de dependencias

Los packages reciben el db client, no lo importan directamente:

```ts
export function createAuthService(db: DrizzleDB) { ... }
```

---

## ADR-006: Auth.js para Autenticacion

### Decision

Auth.js (NextAuth v5) como solucion de autenticacion.

### Alternativas evaluadas

| Opcion        | Pros                                                 | Contras                                       |
| ------------- | ---------------------------------------------------- | --------------------------------------------- |
| **Auth.js**   | Gratis, data en tu DB, 80+ providers, personalizable | UI hay que hacerla, config puede ser compleja |
| Clerk         | UI pre-hecha, multi-tenancy built-in                 | $0.02/MAU, vendor lock-in, data no en tu DB   |
| Better Auth   | TypeScript-first, plugins                            | Mas nuevo, menor comunidad                    |
| Supabase Auth | Integrado con Supabase                               | Conflicto con modulo propio, lock-in          |
| Custom        | Control total                                        | Inseguro, reinventar la rueda                 |

### Justificacion

- Gratis siempre: no come margen del cliente (50k users en Clerk = $800/mes)
- Data en nuestra DB (schema packages/db/schemas/auth.ts)
- 100% personalizable: cada cliente quiere su propia pantalla de login
- Sin vendor lock-in
- Providers por defecto: Google + Magic Link
- Facil anadir: Microsoft, GitHub, Apple, Credentials

### Estrategia de sesion: JWT sobre Database Session

- JWT: verificacion local (crypto), ~1-2ms, sin DB query
- Database session: query a DB por request, ~50-100ms
- JWT para performance; datos de sesion enriquecidos en el callback

### Por que no Neon Auth

Neon ofrece su propio modulo de autenticacion (Neon Auth). No lo usamos porque:

- Auth.js da control total sobre providers, callbacks y UI
- JWT strategy sin queries a DB en cada request
- No ata la autenticacion al proveedor de base de datos
- Si migramos de Neon a otro PostgreSQL, auth sigue funcionando sin cambios

### Paginas publicas y auth

- Paginas marketing (/, /pricing, /blog): CERO auth check, SSG, CDN
- Paginas protegidas (/dashboard, /settings): JWT check en middleware Edge
- Google nunca ve las paginas protegidas: SEO no se ve afectado

---

## ADR-007: Estructura de Carpetas (Feature-Based)

### Decision

Estructura basada en features, inspirada en Feature Slice Design pero adaptada a Next.js App Router.

### Alternativas evaluadas

| Opcion                     | Pros                                       | Contras                                        |
| -------------------------- | ------------------------------------------ | ---------------------------------------------- |
| **Feature-based adaptado** | Intuitivo, colocation, se aprende en 5 min | Menos formal que FSD                           |
| FSD completo (7 capas)     | Muy estructurado                           | Conflicto con App Router, overkill, curva alta |
| Todo en app/               | Simple                                     | Archivos de 500 lineas, imposible reutilizar   |
| Components/ plano          | Simple                                     | 200 archivos sin organizacion                  |

### Estructura

```
app/               → Solo routing y composicion (Next.js App Router)
features/          → Logica de negocio por dominio (components + actions + hooks)
components/        → Componentes compartidos de la app (layouts, wrappers)
lib/               → Utilidades y configuracion
packages/          → Modulos reutilizables entre proyectos
```

### Regla de dependencias (de FSD)

Las dependencias solo van hacia abajo:

```
app/ → features/ → components/ → lib/ → packages/
```

Nunca imports cruzados entre features. Si dos features necesitan comunicarse, se componen en app/.

---

## ADR-008: Rendering Strategy

### Decision

Server Components por defecto. "use client" es la excepcion.

### Estrategia por zona

| Zona                    | Patron               | Auth           | Cache              | SEO           |
| ----------------------- | -------------------- | -------------- | ------------------ | ------------- |
| Marketing (/, /pricing) | SSG (force-static)   | Ninguno        | CDN edge           | Si            |
| Blog (/blog/[slug])     | ISR (revalidate)     | Ninguno        | CDN + revalidacion | Si            |
| Auth (/login)           | SSR                  | Ninguno        | No cache           | No (noindex)  |
| Dashboard               | SSR dinamico         | JWT middleware | No cache           | N/A (privado) |
| Settings                | SSR + Server Actions | JWT middleware | No cache           | N/A (privado) |

### Data fetching

- Lectura: async Server Component (fetch en servidor)
- Escritura: Server Actions (formularios y mutaciones)
- Webhooks: Route Handlers (/api/webhooks/\*)
- No crear API Routes para uso interno de la app

### Regla "use client"

Solo cuando el compilador lo requiera:

- useState, useEffect, useRef
- Event handlers (onClick, onChange)
- Librerias de browser (charts, maps, drag & drop)
- APIs del browser (localStorage, geolocation)

---

## ADR-009: No TanStack Query por Defecto

### Decision

No incluir TanStack Query en la plantilla base.

### Contexto

Con Server Components + Server Actions + Suspense, el 95% de los casos de uso de TanStack Query ya estan cubiertos.

### Cuando si instalarlo (por proyecto)

- Polling en tiempo real (refetchInterval)
- Infinite scroll (useInfiniteQuery)
- Optimistic updates
- Busqueda con debounce y cache client-side

### Justificacion

Menos dependencias = menos mantenimiento = mas margen para la agencia. Se instala en 5 minutos cuando un proyecto especifico lo necesita.

---

## ADR-010: Performance Strategy

### Decision

Aprovechar lo que Next.js da gratis + disciplina del equipo con reglas especificas.

### Lo que Next.js hace automaticamente

- Code splitting por ruta
- Prefetch de `<Link>` visibles
- Image optimization (next/image)
- Font optimization (next/font)
- Tree-shaking

### Lo que configuramos en la plantilla

- next/font con display swap (zero layout shift)
- next/image obligatorio (ESLint rule prohibe `<img>`)
- Lucide icons con tree-shaking (no SVG sprites)
- Bundle analyzer script
- Librerias pesadas prohibidas via ESLint (moment.js, lodash, etc.)
- dynamic() para client components >50KB (charts, editors, maps)

### Patron Suspense para APIs lentas

Cada seccion independiente envuelta en Suspense con su propio Skeleton. La pagina carga progresivamente, el usuario siempre ve contenido.

### Librerias prohibidas

| Prohibida    | Alternativa                   |
| ------------ | ----------------------------- |
| moment.js    | date-fns                      |
| lodash       | lodash-es o funciones nativas |
| @fortawesome | lucide-react                  |
| chart.js     | recharts                      |
| Draft.js     | Tiptap                        |

---

## ADR-011: Gestion de SVGs

### Decision

Lucide para iconos estandar + componente `<Icon>` tipado para custom + catalog page para descubrimiento.

### Estrategia por tipo

| Tipo            | Solucion                                      | Descubrimiento   |
| --------------- | --------------------------------------------- | ---------------- |
| Iconos estandar | Lucide React (tree-shakeable)                 | lucide.dev/icons |
| Iconos custom   | `<Icon name="..." />` con SVGR, tipo IconName | Catalog page     |
| Ilustraciones   | `<EmptyState illustration="..." />`           | Catalog page     |

### Por que no SVG sprites

Con tree-shaking y Server Components, los sprites son obsoletos. Un sprite carga TODOS los iconos. Tree-shaking solo los usados.

### Por que catalog page sobre Storybook (inicial)

- Storybook es overkill solo para SVGs
- Una pagina en `/catalog` (solo dev) con zero tooling extra
- Si el design system crece a 50+ componentes, migrar a Storybook

### Storybook

Se incluye en `packages/ui` para el design system reutilizable. Solo componentes de packages/ui, no pages ni features.

---

## ADR-012: Cloud & Infrastructure

### Decision

Servicios compuestos: Vercel + Neon + Cloudflare + servicios especializados.

### Alternativas evaluadas

| Opcion              | Pros                                 | Contras                                     |
| ------------------- | ------------------------------------ | ------------------------------------------- |
| **Compuesto**       | Best-of-breed, sin overlap, flexible | Varios dashboards                           |
| Supabase all-in-one | Un dashboard, rapido                 | Solapa con nuestros modulos (auth, storage) |
| AWS completo        | Control total, barato a escala       | Necesita DevOps, complejo                   |
| Firebase            | Rapido                               | Vendor lock-in extremo, no SQL              |

### Stack elegido

| Capa           | Servicio              | Justificacion                               |
| -------------- | --------------------- | ------------------------------------------- |
| Hosting        | Vercel                | Zero-config para Next.js, preview deploys   |
| Database       | Neon PostgreSQL       | Serverless, branching por PR, scale-to-zero |
| CDN + DDoS     | Cloudflare (free)     | Absorbe 95% de ataques, $0                  |
| File Storage   | Cloudflare R2         | Compatible S3, sin egress fees              |
| Auth           | Auth.js (self-hosted) | $0, data en nuestra DB                      |
| Email          | Resend                | React Email templates, 3k/mes gratis        |
| Payments       | Stripe                | Subscriptions, invoices                     |
| Cache/Queues   | Upstash Redis         | Serverless, rate limiting                   |
| Analytics      | PostHog               | Product analytics, 1M eventos gratis        |
| Error Tracking | Sentry                | Stack traces, performance, gratis           |
| Uptime         | Better Stack          | Monitoring + alertas, gratis                |

### Costes por fase

| Fase        | Usuarios | Coste/mes         |
| ----------- | -------- | ----------------- |
| Pre-revenue | 0-100    | $0 (Vercel Hobby) |
| MVP         | 100-1k   | $20 (Vercel Pro)  |
| Crecimiento | 1k-10k   | ~$96              |
| Escala      | 10k-50k  | ~$352             |

---

## ADR-013: Seguridad — Defensa por Capas

### Decision

4 capas de proteccion: Cloudflare → Vercel Edge → App → Database.

### Capas

1. **Cloudflare (gratis)**: DDoS mitigation, WAF, bot detection
2. **Middleware Edge**: Rate limiting con Upstash Redis (auth: 10/min, API: 60/min)
3. **Aplicacion**: Security headers, Server Actions con validacion zod, webhook signature verification
4. **Database**: Connection pooling, query timeouts, paginacion obligatoria (max 100)

### Rate Limiting

| Ruta             | Limite            | Motivo                     |
| ---------------- | ----------------- | -------------------------- |
| /api/auth/\*     | 10 req/min por IP | Prevenir brute force       |
| /api/\* general  | 60 req/min por IP | Proteccion general         |
| /api/webhooks/\* | 200 req/min       | Stripe puede enviar muchos |

### Respuesta ante ataque DDoS activo

1. Activar "Under Attack Mode" en Cloudflare (1 click)
2. Bajar rate limits temporalmente
3. Bloquear IPs/paises en Cloudflare
4. Revisar logs en Vercel + Cloudflare

---

## ADR-014: Backups y Monitoring

### Backups

- **Continuo**: Neon PITR (Point-in-Time Recovery) automatico, incluido
- **Semanal**: Dump a Cloudflare R2 via GitHub Action (~$1/mes)
- **Pre-migracion**: Dump manual antes de cada migracion de schema

### Monitoring

| Herramienta  | Funcion                                  | Coste                 |
| ------------ | ---------------------------------------- | --------------------- |
| Sentry       | Error tracking + performance             | Free (5k errores/mes) |
| Better Stack | Uptime monitoring + logs + alertas       | Free                  |
| PostHog      | Product analytics + session replay       | Free (1M eventos/mes) |
| Vercel       | Build logs, web vitals, function metrics | Incluido en Pro       |

### Health Check

Endpoint `/api/health` que verifica conectividad a DB. Better Stack lo monitorea cada minuto con alertas a Slack/SMS.

---

## ADR-015: PostHog para Product Analytics

### Decision

PostHog como unica herramienta de analytics. No incluir Google Analytics.

### Contexto

Una startup SaaS necesita entender como los usuarios usan el producto para tomar decisiones. Hay dos tipos de analytics:

- **Web/marketing analytics** (trafico, fuentes, SEO): Google Analytics, Plausible
- **Product analytics** (comportamiento dentro de la app, funnels, retencion): PostHog, Mixpanel, Amplitude

### Alternativas evaluadas

| Opcion           | Pros                                                                 | Contras                                               |
| ---------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| **PostHog**      | Product analytics + pageviews en uno, 1M eventos gratis, open source | Menos potente para attribution de campañas            |
| Google Analytics | Gratis, attribution de ads, SEO insights                             | No tiene funnels de producto, no mide uso de features |
| Mixpanel         | Muy potente para producto                                            | Caro (solo 1k usuarios en free), closed source        |
| Amplitude        | Enterprise-grade                                                     | Overkill, complejo                                    |
| PostHog + GA     | Lo mejor de ambos                                                    | Dos herramientas, mas complejidad                     |

### Justificacion

- PostHog cubre el 90% de lo que un SaaS necesita: pageviews, funnels, retencion, feature usage
- Para una startup, saber "el 70% abandona en el paso 2 del checkout" vale mas que "100 visitas vinieron de Google"
- 1M eventos gratis/mes es mas que suficiente para startups en fase inicial
- Si un cliente necesita attribution de campañas de Google Ads, se anade GA en ese proyecto especifico
- No es responsabilidad del template base

### Que medir con PostHog

| Tipo          | Ejemplo                                           |
| ------------- | ------------------------------------------------- |
| Funnels       | Signup → Onboarding → First action → Subscription |
| Feature usage | Cuantos usuarios usan feature X por semana        |
| Retencion     | Cuantos vuelven despues de 7/30 dias              |
| Pageviews     | Paginas mas visitadas, bounce rate                |

---

## ADR-016: Dos Repos — Packages Publicados + Template de Proyecto

### Decision

Separar en dos repositorios: uno para packages compartidos (publicados en GitHub Packages) y otro como template de proyecto para clientes.

### Estructura

```
REPO 1: nyxidiom/nyxidiom-packages (fuente de verdad)
  packages/
    ui/           → componentes, design system
    config/       → ESLint, TS, Prettier
    email/        → templates de email
    shared/       → validaciones, utils, constantes
  apps/
    reference/    → app Next.js para testear packages

REPO 2: nyxidiom/saas-template (GitHub Template)
  packages/
    db/           → schemas (custom por proyecto)
    auth/         → config de auth (providers varian)
    payments/     → config de Stripe (planes varian)
  apps/
    web/          → la app del cliente
  package.json
    "@nyxidiom/ui": "^1.0.0"         ← desde registry
    "@nyxidiom/config": "^1.0.0"
    "@nyxidiom/email": "^1.0.0"
    "@nyxidiom/shared": "^1.0.0"
```

### Alternativas evaluadas

| Opcion                             | Pros                                                | Contras                                                            |
| ---------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| **2 repos + registry**             | Zero drift, onboarding simple, cada dev lo entiende | Dos repos que mantener                                             |
| Todo in-repo (template copy)       | Zero friccion al desarrollar                        | Drift de componentes entre proyectos (bugs distintos por proyecto) |
| Mega monorepo (todos los clientes) | Packages siempre actualizados                       | Sin aislamiento, permisos complicados                              |
| Git submodules                     | Referencia directa                                  | DX terrible, nadie los entiende                                    |
| pnpm link workflow                 | Desarrollo cruzado en tiempo real                   | Complejidad de onboarding, confuso para devs nuevos                |

### Justificacion

- El problema principal a resolver: **evitar que el mismo componente (ej. `<Input/>`) tenga versiones distintas con bugs distintos en cada proyecto**
- 2 repos es el modelo mental mas simple: "packages = libreria, proyecto = app"
- Onboarding: cualquier dev entiende "instalo un package y lo uso"
- Changesets + GitHub Actions = publish automatico sin friccion
- `pnpm update @nyxidiom/ui` en cualquier proyecto = todos al dia

### Que se publica vs que se queda in-repo

| Publicar (igual en todos los proyectos)   | In-repo (varia por proyecto)         |
| ----------------------------------------- | ------------------------------------ |
| @nyxidiom/ui (componentes, design system) | packages/db (schemas del dominio)    |
| @nyxidiom/config (ESLint, TS, Prettier)   | packages/auth (providers, callbacks) |
| @nyxidiom/email (templates base)          | packages/payments (planes, webhooks) |
| @nyxidiom/shared (validaciones, utils)    |                                      |

**Regla:** si lo modificarias por proyecto, va in-repo. Si NO deberia cambiar entre proyectos, va publicado.

### Flujo de trabajo

1. Dev encuentra bug en `<Input/>` → fix en repo nyxidiom-packages
2. Commit con changeset → CI publica automaticamente nueva version
3. En cada proyecto de cliente: `pnpm update @nyxidiom/ui`
4. Todos los proyectos tienen el fix. Zero drift.

### Customizacion por proyecto: wrappear, nunca forkear

```ts
// BIEN: wrapper que extiende el componente base
import { Input } from '@nyxidiom/ui'
export function CurrencyInput(props) {
  return <Input inputMode="decimal" {...props} />
}

// MAL: copiar Input al proyecto y modificarlo
```

---

## ADR-017: Design System sin Disenador

### Decision

Design system basado en shadcn/ui con personalizacion minima por cliente. Sin ilustraciones custom. Estetica minimalista tipo Linear/Vercel.

### Paleta de colores

- Base: shadcn/ui default (Zinc grays)
- Personalizacion: solo 1 CSS variable `--primary` por cliente
- Dark mode: incluido gratis con shadcn/ui
- No usar paletas externas (Nord, Material, etc.)

### Tipografia

- Geist Sans (de Vercel): gratis, moderna, optimizada para interfaces
- Geist Mono: para bloques de codigo
- Alternativa: Inter
- Cargada con next/font (zero layout shift)

### Iconografia

- Lucide React: +1,500 iconos, tree-shakeable, estilo consistente
- Simple Icons: solo para logos de marca (Google, GitHub en social login)
- No icon sets custom, no SVG sprites

### Ilustraciones: NO usar

- Empty states: icono grande de Lucide + texto
- Error pages: icono + mensaje claro
- Backgrounds: gradientes CSS abstractos
- Marketing hero: screenshot del producto real

### Imagenes

- Screenshots del dashboard como hero image (lo que hacen Linear, Vercel)
- Gradientes mesh con CSS puro para fondos
- No stock photos (se ven genericas)
- No fotos custom (necesitan fotografo)

### Justificacion

- Sin disenador en el equipo: la plantilla debe verse profesional out-of-the-box
- shadcn/ui + Zinc + Geist es el mismo stack visual de Linear, Vercel, Raycast
- Personalizar por cliente = cambiar 1 color + logo (5 minutos)

---

## ADR-018: Configuracion Claude Code para el Equipo

### Decision

CLAUDE.md en raiz y por package + custom commands + settings compartidos. Se configura en AMBOS repos.

### Estructura

```
nyxidiom-packages/ (repo 1)
  CLAUDE.md                  → Stack del design system, reglas de componentes
  packages/ui/CLAUDE.md      → Reglas de UI, API de componentes
  packages/shared/CLAUDE.md  → Reglas de validaciones y utils

saas-template/ (repo 2)
  CLAUDE.md                  → Stack completo, convenciones, comandos
  .claude/settings.json      → Permisos del equipo (allow/deny)
  .claude/commands/*.md      → Comandos custom (/create-module, /create-page, /add-schema)
  apps/web/CLAUDE.md         → Instrucciones de la app
  packages/*/CLAUDE.md       → Instrucciones por package
```

### Beneficio

- Estilo consistente en todo el equipo
- Claude usa los componentes y patrones del proyecto
- Onboarding instantaneo: dev nuevo lee CLAUDE.md y esta al dia
- Comandos custom eliminan tareas repetitivas

---

## ADR-019: Fechas, Formateo e Idioma

### Decision

- Fechas almacenadas en **UTC** en la base de datos
- Formateo de fechas, numeros y moneda con **`Intl` nativo** del browser (sin librerias)
- Template en **ingles** sin libreria de i18n
- No incluir next-intl, i18next, moment.js, ni date-fns

### Contexto

La plantilla sirve a startups que lanzan en un mercado inicial. i18n desde el dia 1 anade complejidad innecesaria. Sin embargo, los usuarios pueden estar en diferentes zonas horarias y locales, por lo que el formateo de fechas y numeros debe adaptarse automaticamente.

### Alternativas evaluadas

| Opcion                | Pros                                                             | Contras                                                                   |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Intl nativo**       | Zero bundle, funciona en todos los browsers, auto-detecta locale | Sin traducciones de UI                                                    |
| date-fns              | API funcional, tree-shakeable                                    | +7KB innecesarios, `Intl` ya lo resuelve                                  |
| moment.js             | Popular                                                          | 300KB, deprecated, prohibido por ESLint                                   |
| next-intl desde dia 1 | Multi-idioma listo                                               | Complejidad prematura, carpetas `[locale]`, archivos JSON de traducciones |

### Implementacion

**Base de datos — siempre UTC:**

```ts
// Drizzle schema
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
```

**Formateo de fechas — `Intl.DateTimeFormat`:**

```ts
// @nyxidiom/shared
function formatDate(date: Date | string, style: 'short' | 'long' = 'short') {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(undefined, { dateStyle: style }).format(d)
}
// locale=undefined → usa el locale del browser automaticamente
// España: "6 feb 2026" | USA: "Feb 6, 2026" | Japon: "2026/2/6"
```

**Fechas relativas — `Intl.RelativeTimeFormat`:**

```ts
function formatRelative(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (diff < 60_000) return rtf.format(-Math.floor(diff / 1000), 'second')
  if (diff < 3_600_000) return rtf.format(-Math.floor(diff / 60_000), 'minute')
  if (diff < 86_400_000) return rtf.format(-Math.floor(diff / 3_600_000), 'hour')
  return rtf.format(-Math.floor(diff / 86_400_000), 'day')
}
// España: "hace 5 minutos" | USA: "5 minutes ago"
```

**Moneda — `Intl.NumberFormat`:**

```ts
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
}
// formatCurrency(29.99, 'EUR') → España: "29,99 €" | USA: "€29.99"
```

### Idioma

- UI en ingles por defecto (strings directos en componentes, no en archivos de traduccion)
- Si un cliente necesita otro idioma: se cambian los strings directamente en su proyecto
- Si necesita multi-idioma: se anade `next-intl` con `[locale]` segment en ese proyecto especifico
- No es responsabilidad de la plantilla base

### Beneficio

- Zero dependencias de fechas/formateo (0KB extra de bundle)
- Fechas y numeros se adaptan al locale del usuario automaticamente
- Sin complejidad de i18n hasta que un proyecto la necesite
- Facil de evolucionar: anadir `next-intl` despues es un cambio localizado, no una reescritura

---

## ADR-020: Escalabilidad a React Native (Mobile)

### Decision

La arquitectura esta preparada para anadir una app movil con Expo + React Native sin reestructurar el proyecto. La UI se construye nativa por plataforma; la logica de negocio se comparte via packages.

### Contexto

SaaS B2B es 90%+ web, pero algunos clientes necesitan app movil (notificaciones push, acceso offline, presencia en app stores). La plantilla debe poder escalar a mobile sin reescritura.

### Diferencia fundamental: Server Components no existen en React Native

| Concepto | Next.js (web) | React Native (mobile) |
| --- | --- | --- |
| Server Components | Si — renderizan en servidor | No — todo es cliente |
| Server Actions | Si — formularios llaman al servidor directamente | No — necesita fetch a API HTTP |
| SSR / SSG | Si — HTML pre-renderizado | No — no hay HTML |
| Auth | Cookies / JWT en servidor | Token almacenado en device (SecureStore) |
| Rendering | Servidor + browser | Solo en el dispositivo |

### Arquitectura actual (solo web)

```
┌─────────────────────────────────────────┐
│  apps/web (Next.js)                     │
│                                         │
│  Server Components ──► DB directa       │
│  Server Actions ────► DB directa        │
│  /api/webhooks/* ───► Solo Stripe       │
└─────────────────────────────────────────┘
```

El web NO necesita API routes internas porque Server Components/Actions acceden a la DB directamente.

### Arquitectura con mobile (fase 2)

```
┌─────────────────────────────────────────┐
│  apps/web (Next.js)                     │
│                                         │
│  Server Components ──► DB directa       │
│  Server Actions ────► DB directa        │
│  /api/v1/* ─────────► API routes (NEW)  │
│  /api/webhooks/* ───► Stripe            │
└──────────────┬──────────────────────────┘
               │ HTTPS
┌──────────────┴──────────────────────────┐
│  apps/mobile (Expo)                     │
│                                         │
│  fetch('/api/v1/...') ──► API routes    │
│  100% client-side                       │
└─────────────────────────────────────────┘
```

La app movil llama a API routes de Next.js por HTTP. No se crea un backend separado.

### Que se comparte y que no

| Capa | Compartido | Explicacion |
| --- | --- | --- |
| packages/db | Si | Schemas y queries reutilizables |
| packages/auth | Parcial | La logica de verificacion se reusa; el flow de login cambia (OAuth con deep links) |
| packages/payments | Si | Misma logica de Stripe |
| @nyxidiom/shared | Si | Validaciones zod, tipos, utils |
| @nyxidiom/ui | No | Web usa shadcn/ui; mobile usa componentes nativos (React Native Paper, Tamagui, NativeWind) |
| @nyxidiom/email | Si | Emails se envian desde el servidor, no cambian |

### Cambios necesarios para anadir mobile

**1. Crear API routes (`/api/v1/*`)**

El web actualmente usa Server Actions para todo. Para mobile hay que exponer endpoints HTTP:

```ts
// apps/web/src/app/api/v1/dashboard/stats/route.ts
import { auth } from '@/lib/auth'
import { db } from 'db'

export async function GET() {
  const session = await auth() // JWT desde header Authorization
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const stats = await getStats(db, session.user.id)
  return Response.json(stats)
}
```

No se duplica logica — el handler llama a las mismas funciones que los Server Components.

**2. Auth para mobile**

- Web: cookies con httpOnly (automatico con Auth.js)
- Mobile: OAuth flow con deep links → recibe JWT → almacena en SecureStore → envia en header `Authorization: Bearer xxx`

El JWT es el mismo que usa el web. Solo cambia como se obtiene y donde se guarda.

**3. Estructura del monorepo**

```
apps/
  web/              → Next.js (ya existe)
  mobile/           → Expo + React Native (nuevo)
packages/
  db/               → compartido
  auth/             → compartido (anadir token-based flow)
  payments/         → compartido
  api-client/       → SDK tipado para mobile (nuevo, opcional)
```

**4. API client tipado (opcional)**

Para evitar que mobile duplique URLs y tipos, se puede crear un package que genere el client:

```ts
// packages/api-client/src/index.ts
export function createApiClient(baseUrl: string, token: string) {
  return {
    dashboard: {
      getStats: () => fetch(`${baseUrl}/api/v1/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),
    },
  }
}
```

### Deploy

| App | Plataforma | Metodo |
| --- | --- | --- |
| Web | Vercel | Push a main → deploy automatico |
| Mobile | Expo EAS | `eas build` → App Store / Google Play |
| API | Vercel | Misma app web, mismas functions |

No se necesita un servidor adicional. Las API routes de Next.js corren como serverless functions en Vercel, igual que las paginas.

### Coste adicional

| Servicio | Free | Pagado |
| --- | --- | --- |
| Expo EAS Build | 30 builds/mes | $99/mes (unlimited) |
| Apple Developer | — | $99/ano (obligatorio para App Store) |
| Google Play | — | $25 unico (obligatorio para Play Store) |
| Vercel (mas API calls) | Ya incluido | Puede subir si hay mucho trafico mobile |

### Cuando anadir mobile

- No anadir mobile al lanzar el SaaS
- Validar product-market fit con web primero
- Anadir mobile cuando haya demanda real (usuarios piden app, push notifications son criticas, offline es necesario)
- El monorepo ya esta preparado: `apps/mobile/` + reusar packages

### Alternativa: PWA antes de nativa

Si solo necesitas push notifications y "install to home screen", una PWA es mas rapida de implementar:

- Service worker con next-pwa
- Web Push API para notificaciones
- No necesita app stores ni cuentas de developer
- Limitacion: no accede a Bluetooth, NFC, HealthKit, etc.

Para la mayoria de SaaS B2B, PWA es suficiente como primer paso mobile
