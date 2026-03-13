import tseslint from 'typescript-eslint'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export const base = tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.next/**', '**/.turbo/**'],
  },
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      // No any — use unknown or specific type
      '@typescript-eslint/no-explicit-any': 'error',

      // Enforce import type for type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Prohibit heavy imports (moment is 300KB+, lodash is unnecessary with modern JS)
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'moment',
              message: 'Use Intl.DateTimeFormat instead. moment is 300KB and deprecated.',
            },
            {
              name: 'lodash',
              message: 'Use native JS methods. lodash adds unnecessary bundle size.',
            },
          ],
          patterns: [
            {
              group: ['moment/*'],
              message: 'Use Intl.DateTimeFormat instead.',
            },
            {
              group: ['lodash/*'],
              message: 'Use native JS array/object methods.',
            },
          ],
        },
      ],
    },
  },
)
