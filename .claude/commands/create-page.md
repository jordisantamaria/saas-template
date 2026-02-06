Create a new page at the specified route path.

1. Determine the route group: (marketing), (auth), (dashboard), (admin)
2. Create the page.tsx in `apps/web/src/app/(group)/path/page.tsx`
3. Create any feature components needed in `apps/web/src/features/[feature]/components/`
4. Add metadata export with title
5. For dashboard pages: use auth check, page header, proper layout
6. For marketing pages: static by default, use marketing components
7. Run `pnpm typecheck` to verify

Route: $ARGUMENTS
