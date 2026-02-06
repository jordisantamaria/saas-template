import { test, expect } from '@playwright/test'

test.describe('Error pages', () => {
  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/this-does-not-exist')

    await expect(page.getByText('Page not found')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()
  })
})
