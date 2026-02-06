# Clean Code Guidelines

> Guia de estilo y buenas practicas para todo el equipo de desarrollo. Estas reglas se aplican a todos los proyectos que usen la plantilla.

---

## 1. Principios Generales

### Simplicidad sobre abstraccion
- No crees helpers, utilities o abstracciones para operaciones que se usan una vez
- Tres lineas de codigo similar son mejor que una abstraccion prematura
- No disenes para requisitos hipoteticos futuros
- La cantidad correcta de complejidad es el minimo necesario para la tarea actual

### Explicito sobre implicito
- Prefiere codigo que se lea como prosa
- Evita side effects ocultos
- Las funciones deben hacer lo que su nombre dice, nada mas
- Si una funcion necesita un comentario para explicar QUE hace, renombrala

### Colocation
- Lo que va junto, vive junto
- Tests junto al archivo: `user-service.test.ts`
- Types donde se usan, no en un archivo `types.ts` global
- Solo extraer a `packages/shared` si se reutiliza en 2+ proyectos

---

## 2. TypeScript

### Strict siempre
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Nunca `any`
```ts
// MAL
function processData(data: any) { ... }

// BIEN
function processData(data: unknown) { ... }

// MEJOR — tipo especifico
function processData(data: TransactionInput) { ... }
```

### Inferencia sobre anotacion explicita
```ts
// INNECESARIO — TypeScript ya lo infiere
const name: string = 'John'
const items: number[] = [1, 2, 3]

// CORRECTO — dejar que TS infiera
const name = 'John'
const items = [1, 2, 3]

// SI anotar: return types de funciones publicas
export function getUser(id: string): Promise<User | null> { ... }
```

### `as const` y satisfies
```ts
// BIEN — preserva tipos literales
const PLANS = {
  free: { price: 0, features: ['basic'] },
  pro: { price: 29, features: ['basic', 'advanced'] },
} as const

// BIEN — valida sin perder tipo
const config = {
  retries: 3,
  timeout: 5000,
} satisfies RetryConfig
```

### Discriminated unions sobre flags booleanos
```ts
// MAL
type Result = {
  success: boolean
  data?: User
  error?: string
}

// BIEN
type Result =
  | { success: true; data: User }
  | { success: false; error: string }
```

---

## 3. Naming Conventions

### Archivos
```
kebab-case para todo:
  user-profile.tsx
  create-transaction.ts
  use-auth.ts
  auth-service.test.ts
```

### Codigo
```ts
// Componentes: PascalCase
export function UserProfile() { ... }

// Funciones y variables: camelCase
const userName = 'John'
function getUserById(id: string) { ... }

// Tipos e interfaces: PascalCase, sin prefijo I
type User = { ... }
interface AuthConfig { ... }

// Constantes globales: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = '/api'

// Schemas DB: camelCase en TS, snake_case en SQL
export const users = pgTable('users', {
  firstName: text('first_name'),  // TS: firstName, SQL: first_name
})

// Enums: PascalCase con valores en snake_case o lowercase
type PlanType = 'free' | 'pro' | 'enterprise'
type UserRole = 'admin' | 'member' | 'viewer'

// Event handlers: handle + Evento
function handleSubmit() { ... }
function handleClick() { ... }

// Booleans: is/has/should/can prefix
const isLoading = true
const hasPermission = false
const shouldRedirect = true
```

### Nombres descriptivos
```ts
// MAL — abreviaciones crípticas
const usr = getUsr(id)
const txn = createTxn(data)
const btn = <Btn />

// BIEN — nombres claros
const user = getUser(id)
const transaction = createTransaction(data)
const button = <Button />

// MAL — nombres genericos
const data = await fetch(...)
const result = process(input)
const items = getAll()

// BIEN — nombres especificos
const transactions = await fetchTransactions(userId)
const validatedInput = validateTransactionInput(rawInput)
const activeSubscriptions = getActiveSubscriptions()
```

---

## 4. Funciones

### Pequenas y con un solo proposito
```ts
// MAL — hace demasiadas cosas
async function processPayment(userId: string, planId: string) {
  const user = await getUser(userId)
  if (!user) throw new Error('User not found')
  const plan = await getPlan(planId)
  if (!plan) throw new Error('Plan not found')
  const customer = await stripe.customers.create({ email: user.email })
  const subscription = await stripe.subscriptions.create({ ... })
  await db.insert(subscriptions).values({ ... })
  await sendEmail(user.email, 'Welcome to Pro!')
  await trackEvent('subscription_started', { userId, planId })
  return subscription
}

// BIEN — cada funcion hace una cosa
async function processPayment(userId: string, planId: string) {
  const user = await requireUser(userId)
  const plan = await requirePlan(planId)
  const subscription = await createStripeSubscription(user, plan)
  await saveSubscription(subscription, userId)
  await notifySubscriptionStarted(user, plan)
  return subscription
}
```

### Maximo 3 parametros, usar objeto si hay mas
```ts
// MAL
function createUser(name: string, email: string, role: string, orgId: string) { ... }

// BIEN
function createUser(input: CreateUserInput) { ... }

type CreateUserInput = {
  name: string
  email: string
  role: UserRole
  orgId: string
}
```

### Early returns
```ts
// MAL — nesting profundo
function getDiscount(user: User) {
  if (user) {
    if (user.subscription) {
      if (user.subscription.plan === 'enterprise') {
        return 0.2
      } else {
        return 0.1
      }
    } else {
      return 0
    }
  }
  return 0
}

// BIEN — early returns
function getDiscount(user: User | null) {
  if (!user) return 0
  if (!user.subscription) return 0
  if (user.subscription.plan === 'enterprise') return 0.2
  return 0.1
}
```

### No clases. Funciones y composicion.
```ts
// MAL — clase innecesaria
class UserService {
  constructor(private db: DrizzleDB) {}
  async getById(id: string) { ... }
  async create(input: CreateUserInput) { ... }
}

// BIEN — factory function
function createUserService(db: DrizzleDB) {
  return {
    getById: (id: string) => db.select().from(users).where(eq(users.id, id)),
    create: (input: CreateUserInput) => db.insert(users).values(input),
  }
}
```

---

## 5. React / Next.js

### Server Components por defecto
```tsx
// NO pongas "use client" hasta que sea necesario
// Server Component: 0 JS al browser

export default async function DashboardPage() {
  const data = await getStats()   // Fetch en servidor
  return <StatsCards data={data} />
}
```

### "use client" solo cuando sea estrictamente necesario
```tsx
// NECESITA "use client":
// - useState, useEffect, useRef
// - onClick, onChange, onSubmit
// - Librerias de browser (charts, maps)

'use client'

export function SearchInput() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
```

### Componentes pequenos y enfocados
```tsx
// MAL — componente que hace todo
export function DashboardPage() {
  // 200 lineas de JSX con logica inline
}

// BIEN — composicion de componentes pequenos
export default async function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

### Props destructuradas
```tsx
// MAL
function UserCard(props: UserCardProps) {
  return <div>{props.user.name}</div>
}

// BIEN
function UserCard({ user, onEdit }: UserCardProps) {
  return <div>{user.name}</div>
}
```

### No prop drilling — composicion
```tsx
// MAL — pasar props a traves de 4 niveles
<Layout user={user}>
  <Sidebar user={user}>
    <UserMenu user={user}>
      <Avatar user={user} />

// BIEN — composicion con children o Server Components
<Layout>
  <Sidebar>
    <UserMenu /> {/* Server Component: lee session directamente */}
  </Sidebar>
</Layout>
```

---

## 6. Data Fetching

### Server Actions para mutaciones
```tsx
// BIEN — Server Action tipada y validada
'use server'

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const input = profileSchema.parse({
    name: formData.get('name'),
  })

  await db.update(users).set(input).where(eq(users.id, session.user.id))
  revalidatePath('/settings')
}
```

### Fetch paralelo, nunca en cascada
```tsx
// MAL — cascada
const user = await getUser(id)
const stats = await getStats(id)
const activity = await getActivity(id)

// BIEN — paralelo
const [user, stats, activity] = await Promise.all([
  getUser(id),
  getStats(id),
  getActivity(id),
])
```

### Validacion con Zod en boundaries
```ts
// Validar en: Server Actions, API Routes, form submissions
// NO validar: funciones internas entre modulos de confianza

export const createTransactionSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  description: z.string().min(1).max(500),
  categoryId: z.string().uuid(),
})
```

---

## 7. Error Handling

### Errors en boundaries, no en cada linea
```ts
// MAL — try/catch en cada funcion
async function getUser(id: string) {
  try {
    return await db.query.users.findFirst({ where: eq(users.id, id) })
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// BIEN — dejar que el error suba, manejar en el boundary
async function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

// El ErrorBoundary de React o el error.tsx de Next.js lo captura
```

### Errores esperados vs inesperados
```ts
// Esperado: el usuario puede no existir — return null
async function findUserByEmail(email: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.email, email) })
}

// Esperado: validacion falla — return error object
function validateInput(data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) return { error: result.error.flatten() }
  return { data: result.data }
}

// Inesperado: DB down — throw, que lo capture el boundary
async function getStats() {
  return db.query.stats.findMany()
  // Si la DB esta caida, Sentry lo captura automaticamente
}
```

---

## 8. Imports

### Orden de imports
```ts
// 1. React / Next.js
import { Suspense } from 'react'
import Link from 'next/link'

// 2. Packages externos
import { eq } from 'drizzle-orm'

// 3. Packages internos (@nyxidiom/*)
import { Button } from '@nyxidiom/ui'
import { db } from '@nyxidiom/db'

// 4. Features / Components de la app
import { StatsCards } from '@/features/dashboard/components/stats-cards'

// 5. Tipos (si es import type)
import type { User } from '@nyxidiom/db'
```

### Siempre import type cuando solo se importa el tipo
```ts
// BIEN
import type { User } from '@nyxidiom/db'
import { type NextRequest } from 'next/server'
```

---

## 9. Lo que NO hacer

### No sobreingenieria
- No feature flags para cosas que puedes cambiar directamente
- No backwards-compatibility shims
- No repositorios abstractos si solo hay una implementacion
- No interfaces si solo hay una clase que la implementa
- No comments tipo `// removed` para codigo eliminado

### No comentarios obvios
```ts
// MAL
// Get the user by ID
const user = getUserById(id)

// BIEN — sin comentario, el codigo ya es claro
const user = getUserById(id)

// BIEN — comentario que explica el POR QUE, no el QUE
// Usamos soft delete porque regulaciones fintech requieren 7 anos de retencion
await softDeleteUser(id)
```

### No overhandling de errores
```ts
// MAL — catch de cosas que nunca fallan
try {
  const sum = a + b
} catch (error) {
  console.error('Error adding numbers')
}

// MAL — validacion innecesaria de datos internos
function calculateTotal(items: CartItem[]) {
  if (!Array.isArray(items)) throw new Error('Items must be array')
  // ^ TypeScript ya garantiza esto
}
```

---

## 10. Checklist Pre-PR

Antes de abrir un Pull Request:

```
[ ] El codigo compila sin errores (pnpm typecheck)
[ ] Lint pasa sin warnings (pnpm lint)
[ ] Tests relevantes pasan (pnpm test)
[ ] No hay console.log de debug
[ ] No hay any en TypeScript
[ ] No hay codigo comentado
[ ] No hay dependencias nuevas innecesarias
[ ] Los nombres son descriptivos y consistentes
[ ] Server Components donde sea posible (no "use client" innecesario)
[ ] Validacion Zod en boundaries (Server Actions, API Routes)
[ ] Datos sensibles no se exponen al cliente
```
