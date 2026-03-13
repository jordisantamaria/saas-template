# @nyxidiom/shared

Shared validations, types, constants, and utilities.

## Structure

```
src/
  validations.ts   — Zod schemas (email, password, pagination, id)
  types.ts         — Shared types (UserRole, PlanType, PaginatedResponse)
  constants.ts     — Roles, plans, limits
  utils.ts         — formatCurrency, formatDate, formatRelative, slugify
  index.ts
```

## Conventions

- All validations use Zod
- All formatting uses `Intl` APIs (zero library dependencies)
- Types use discriminated unions over boolean flags
- Constants use `as const satisfies` for type safety
- Only export what's used in 2+ projects

## Validation usage

```ts
import { emailSchema, paginationSchema } from '@nyxidiom/shared'

const email = emailSchema.parse(input)  // throws on invalid
const { page, limit } = paginationSchema.parse(req.query)
```

## Formatting (locale-aware, zero dependencies)

```ts
import { formatCurrency, formatDate, formatRelative } from '@nyxidiom/shared'

formatCurrency(29.99, 'EUR')  // "29,99 €" (ES) / "€29.99" (US)
formatDate(new Date())         // "6 feb 2026" (ES) / "Feb 6, 2026" (US)
formatRelative(someDate)       // "hace 5 minutos" (ES) / "5 minutes ago" (US)
```
