Add a new Drizzle schema table to the database.

1. Create or edit the schema file in `packages/db/src/schemas/`
2. Use `baseColumns` spread for id, createdAt, updatedAt
3. All timestamps must use `withTimezone: true`
4. Add relations if connecting to other tables
5. Export from `packages/db/src/schemas/index.ts`
6. Run `pnpm db:generate` to create migration
7. Run `pnpm typecheck` to verify

Schema name: $ARGUMENTS
