# @nyxidiom/ui

Shared design system for Nyxidiom SaaS projects.

## Stack

- Tailwind CSS v4 (CSS-first config with `@theme`)
- shadcn/ui (new-york style)
- Zinc palette + OKLCH colors
- Lucide React icons

## Structure

```
src/
  components/
    ui/              — shadcn/ui base components (auto-generated)
    data-table.tsx   — TanStack Table wrapper
    empty-state.tsx  — Empty state with Lucide icon
    gradient-background.tsx
    page-header.tsx
    skeleton.tsx     — All skeleton variants
    stats-card.tsx
  styles/
    globals.css      — Main theme (import in consuming apps)
    themes/          — Client-specific color overrides
  lib/
    utils.ts         — cn() helper
  hooks/             — Shared hooks
  index.ts           — All exports
```

## Adding shadcn components

Run from this package directory:
```bash
cd packages/ui
npx shadcn@latest add [component] --yes
```
Then add the export to `src/index.ts`.

## Conventions

- One component per file
- Use `cn()` for conditional classes
- Props as types (not interfaces), destructured
- `"use client"` only when needed (useState, onClick, etc.)
- No `<img>` — consumers use next/image
- Icons: always from `lucide-react`
- No custom illustrations — use EmptyState with icon + text

## Theming

- Base theme: Zinc (neutral, professional)
- Dark mode: already included in globals.css (toggle with `.dark` class)
- Client themes: CSS files in `src/styles/themes/` that override `--color-primary`
- See `src/styles/themes/README.md` for how to create new themes

## Build

```bash
pnpm build     # tsup → dist/
pnpm dev       # tsup --watch
```

Consumers import:
```ts
import { Button, Card } from '@nyxidiom/ui'
```
```css
@import "@nyxidiom/ui/globals.css";
```
