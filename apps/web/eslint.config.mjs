import { next } from '@nyxidiom/config/eslint/next'

export default [
  ...next,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'debug', 'info'] }],
    },
  },
  {
    ignores: ['playwright-report/', 'test-results/'],
  },
]
