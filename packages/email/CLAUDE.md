# @nyxidiom/email

Transactional email templates using React Email + Resend.

## Structure

```
src/
  components/
    base-layout.tsx  — Shared layout (header, footer, unsubscribe)
  templates/
    welcome.tsx
    magic-link.tsx
    invoice.tsx
    subscription-confirmation.tsx
    password-reset.tsx
    team-invitation.tsx
  service.ts         — createEmailService() factory
  index.ts
```

## Usage

```ts
import { createEmailService } from '@nyxidiom/email'

const email = createEmailService('re_xxx', {
  from: 'App <noreply@example.com>',
  appName: 'MyApp',
  logoUrl: 'https://example.com/logo.png',
})

await email.sendWelcome({
  to: 'user@example.com',
  name: 'John',
  dashboardUrl: 'https://app.example.com/dashboard',
})
```

## Conventions

- All templates extend `BaseLayout` (consistent header/footer)
- Style with inline CSS objects (email client compatibility)
- No Tailwind — email clients don't support it
- All props are required (no optional magic)
- `appName` and `logoUrl` default from service config

## Adding a template

1. Create `src/templates/my-template.tsx` extending `BaseLayout`
2. Add send method to `service.ts`
3. Export from `index.ts`
4. Add render test in `templates.test.tsx`
