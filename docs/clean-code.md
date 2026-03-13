# Clean Code Guidelines

> Style guide and best practices for the entire development team. These rules apply to all projects that use the template.

---

## 1. General Principles

### Simplicity over abstraction

- Don't create helpers, utilities, or abstractions for operations used only once
- Three lines of similar code are better than a premature abstraction
- Don't design for hypothetical future requirements
- The right amount of complexity is the minimum necessary for the current task

### Explicit over implicit

- Prefer code that reads like prose
- Avoid hidden side effects
- Functions should do what their name says, nothing more
- If a function needs a comment to explain WHAT it does, rename it

### Colocation

- What goes together, lives together
- Tests next to the file: `user-service.test.ts`
- Types where they are used, not in a global `types.ts` file
- Only extract to `packages/shared` if reused in 2+ projects

---

## 2. TypeScript

### Always strict

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

### Never `any`

```ts
// BAD
function processData(data: any) { ... }

// GOOD
function processData(data: unknown) { ... }

// BETTER — specific type
function processData(data: TransactionInput) { ... }
```

### Inference over explicit annotation

```ts
// UNNECESSARY — TypeScript already infers it
const name: string = 'John'
const items: number[] = [1, 2, 3]

// CORRECT — let TS infer
const name = 'John'
const items = [1, 2, 3]

// DO annotate: return types of public functions
export function getUser(id: string): Promise<User | null> { ... }
```

### `as const` and satisfies

```ts
// GOOD — preserves literal types
const PLANS = {
  free: { price: 0, features: ['basic'] },
  pro: { price: 29, features: ['basic', 'advanced'] },
} as const

// GOOD — validates without losing type
const config = {
  retries: 3,
  timeout: 5000,
} satisfies RetryConfig
```

### Discriminated unions over boolean flags

```ts
// BAD
type Result = {
  success: boolean
  data?: User
  error?: string
}

// GOOD
type Result = { success: true; data: User } | { success: false; error: string }
```

---

## 3. Naming Conventions

### Files

```
kebab-case for everything:
  user-profile.tsx
  create-transaction.ts
  use-auth.ts
  auth-service.test.ts
```

### Code

```ts
// Components: PascalCase
export function UserProfile() { ... }

// Functions and variables: camelCase
const userName = 'John'
function getUserById(id: string) { ... }

// Types and interfaces: PascalCase, no I prefix
type User = { ... }
interface AuthConfig { ... }

// Global constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = '/api'

// DB schemas: camelCase in TS, snake_case in SQL
export const users = pgTable('users', {
  firstName: text('first_name'),  // TS: firstName, SQL: first_name
})

// Enums: PascalCase with snake_case or lowercase values
type PlanType = 'free' | 'pro' | 'enterprise'
type UserRole = 'admin' | 'member' | 'viewer'

// Event handlers: handle + Event
function handleSubmit() { ... }
function handleClick() { ... }

// Booleans: is/has/should/can prefix
const isLoading = true
const hasPermission = false
const shouldRedirect = true
```

### Descriptive names

```ts
// BAD — cryptic abbreviations
const usr = getUsr(id)
const txn = createTxn(data)
const btn = <Btn />

// GOOD — clear names
const user = getUser(id)
const transaction = createTransaction(data)
const button = <Button />

// BAD — generic names
const data = await fetch(...)
const result = process(input)
const items = getAll()

// GOOD — specific names
const transactions = await fetchTransactions(userId)
const validatedInput = validateTransactionInput(rawInput)
const activeSubscriptions = getActiveSubscriptions()
```

---

## 4. Functions

### Small and single-purpose

```ts
// BAD — does too many things
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

// GOOD — each function does one thing
async function processPayment(userId: string, planId: string) {
  const user = await requireUser(userId)
  const plan = await requirePlan(planId)
  const subscription = await createStripeSubscription(user, plan)
  await saveSubscription(subscription, userId)
  await notifySubscriptionStarted(user, plan)
  return subscription
}
```

### Maximum 3 parameters, use an object if there are more

```ts
// BAD
function createUser(name: string, email: string, role: string, orgId: string) { ... }

// GOOD
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
// BAD — deep nesting
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

// GOOD — early returns
function getDiscount(user: User | null) {
  if (!user) return 0
  if (!user.subscription) return 0
  if (user.subscription.plan === 'enterprise') return 0.2
  return 0.1
}
```

### No classes. Functions and composition.

```ts
// BAD — unnecessary class
class UserService {
  constructor(private db: DrizzleDB) {}
  async getById(id: string) { ... }
  async create(input: CreateUserInput) { ... }
}

// GOOD — factory function
function createUserService(db: DrizzleDB) {
  return {
    getById: (id: string) => db.select().from(users).where(eq(users.id, id)),
    create: (input: CreateUserInput) => db.insert(users).values(input),
  }
}
```

---

## 5. React / Next.js

### Server Components by default

```tsx
// DON'T add "use client" until it's necessary
// Server Component: 0 JS to the browser

export default async function DashboardPage() {
  const data = await getStats() // Server-side fetch
  return <StatsCards data={data} />
}
```

### "use client" only when strictly necessary

```tsx
// NEEDS "use client":
// - useState, useEffect, useRef
// - onClick, onChange, onSubmit
// - Browser libraries (charts, maps)

'use client'

export function SearchInput() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

### Small and focused components

```tsx
// BAD — component that does everything
export function DashboardPage() {
  // 200 lines of JSX with inline logic
}

// GOOD — composition of small components
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

### Destructured props

```tsx
// BAD
function UserCard(props: UserCardProps) {
  return <div>{props.user.name}</div>
}

// GOOD
function UserCard({ user, onEdit }: UserCardProps) {
  return <div>{user.name}</div>
}
```

### No prop drilling — composition

```tsx
// BAD — passing props through 4 levels
<Layout user={user}>
  <Sidebar user={user}>
    <UserMenu user={user}>
      <Avatar user={user} />

// GOOD — composition with children or Server Components
<Layout>
  <Sidebar>
    <UserMenu /> {/* Server Component: reads session directly */}
  </Sidebar>
</Layout>
```

---

## 6. Data Fetching

### Server Actions for mutations

```tsx
// GOOD — typed and validated Server Action
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

### Parallel fetch, never waterfall

```tsx
// BAD — waterfall
const user = await getUser(id)
const stats = await getStats(id)
const activity = await getActivity(id)

// GOOD — parallel
const [user, stats, activity] = await Promise.all([getUser(id), getStats(id), getActivity(id)])
```

### Zod validation at boundaries

```ts
// Validate at: Server Actions, API Routes, form submissions
// DON'T validate: internal functions between trusted modules

export const createTransactionSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  description: z.string().min(1).max(500),
  categoryId: z.string().uuid(),
})
```

---

## 7. Error Handling

### Errors at boundaries, not on every line

```ts
// BAD — try/catch in every function
async function getUser(id: string) {
  try {
    return await db.query.users.findFirst({ where: eq(users.id, id) })
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// GOOD — let the error bubble up, handle at the boundary
async function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

// React's ErrorBoundary or Next.js error.tsx catches it
```

### Expected vs unexpected errors

```ts
// Expected: the user may not exist — return null
async function findUserByEmail(email: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.email, email) })
}

// Expected: validation fails — return error object
function validateInput(data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) return { error: result.error.flatten() }
  return { data: result.data }
}

// Unexpected: DB down — throw, let the boundary catch it
async function getStats() {
  return db.query.stats.findMany()
  // If the DB is down, Sentry catches it automatically
}
```

---

## 8. Imports

### Import order

```ts
// 1. React / Next.js
import { Suspense } from 'react'
import Link from 'next/link'

// 2. External packages
import { eq } from 'drizzle-orm'

// 3. Internal packages (@nyxidiom/*)
import { Button } from '@nyxidiom/ui'
import { db } from '@nyxidiom/db'

// 4. App features / components
import { StatsCards } from '@/features/dashboard/components/stats-cards'

// 5. Types (if import type)
import type { User } from '@nyxidiom/db'
```

### Always import type when only importing the type

```ts
// GOOD
import type { User } from '@nyxidiom/db'
import { type NextRequest } from 'next/server'
```

---

## 9. What NOT to do

### No over-engineering

- No feature flags for things you can change directly
- No backwards-compatibility shims
- No abstract repositories if there's only one implementation
- No interfaces if there's only one class implementing it
- No comments like `// removed` for deleted code

### No obvious comments

```ts
// BAD
// Get the user by ID
const user = getUserById(id)

// GOOD — no comment, the code is already clear
const user = getUserById(id)

// GOOD — comment that explains the WHY, not the WHAT
// We use soft delete because fintech regulations require 7 years of retention
await softDeleteUser(id)
```

### No over-handling of errors

```ts
// BAD — catching things that never fail
try {
  const sum = a + b
} catch (error) {
  console.error('Error adding numbers')
}

// BAD — unnecessary validation of internal data
function calculateTotal(items: CartItem[]) {
  if (!Array.isArray(items)) throw new Error('Items must be array')
  // ^ TypeScript already guarantees this
}
```

---

## 10. Pre-PR Checklist

Before opening a Pull Request:

```
[ ] Code compiles without errors (pnpm typecheck)
[ ] Lint passes without warnings (pnpm lint)
[ ] Relevant tests pass (pnpm test)
[ ] No debug console.log statements
[ ] No any in TypeScript
[ ] No commented-out code
[ ] No unnecessary new dependencies
[ ] Names are descriptive and consistent
[ ] Server Components where possible (no unnecessary "use client")
[ ] Zod validation at boundaries (Server Actions, API Routes)
[ ] Sensitive data is not exposed to the client
```
