# packages/db

Database layer using Drizzle ORM with Neon PostgreSQL.

## Structure

```
src/
  client.ts          — Database connection (Neon serverless)
  schemas/
    base.ts          — Shared columns (id, createdAt, updatedAt)
    auth.ts          — users, accounts, sessions, verificationTokens
    billing.ts       — plans, subscriptions, invoices
    teams.ts         — organizations, members, invitations
    index.ts         — Re-exports all schemas
  seed.ts            — Seed script for plans
  index.ts           — Main exports
```

## Commands

```bash
pnpm db:generate     # Generate migrations from schema changes
pnpm db:migrate      # Apply migrations to database
pnpm db:studio       # Open Drizzle Studio (visual DB browser)
pnpm db:seed         # Seed initial data (plans)
```

## Conventions

- All tables use UUID primary keys with `defaultRandom()`
- All timestamps use `withTimezone: true` and stored in UTC
- Schema naming: camelCase in TS, snake_case in SQL
- Use `baseColumns` spread for id + createdAt + updatedAt
- Relations defined in the same file as the schema
- Export inferred types: `InferSelectModel<typeof users>`

## Adding a new table

1. Create or edit a schema file in `src/schemas/`
2. Use `baseColumns` for standard fields
3. Add relations if needed
4. Export from `src/schemas/index.ts`
5. Run `pnpm db:generate` then `pnpm db:migrate`
