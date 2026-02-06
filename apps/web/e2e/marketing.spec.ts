import { test, expect } from '@playwright/test'

test.describe('Marketing pages', () => {
  test('landing page loads and has CTA', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toContainText('Build your SaaS')
    await expect(page.getByRole('link', { name: 'Get Started' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Pricing' })).toBeVisible()
  })

  test('pricing page shows 3 plans', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Enterprise')).toBeVisible()
    await expect(page.getByText('$0')).toBeVisible()
    await expect(page.getByText('$29')).toBeVisible()
    await expect(page.getByText('$99')).toBeVisible()
  })

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog')

    await expect(page.locator('h1')).toContainText('Blog')
  })

  test('changelog page loads', async ({ page }) => {
    await page.goto('/changelog')

    await expect(page.locator('h1')).toContainText('Changelog')
  })
})
