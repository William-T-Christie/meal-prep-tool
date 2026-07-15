import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  // Note: These tests verify pages load without errors.
  // Full auth flow requires mock auth setup which is deferred.

  test('login page loads without errors', async ({ page }) => {
    const response = await page.goto('/login')
    expect(response?.status()).toBeLessThan(500)
  })

  test('root redirects to dashboard or login', async ({ page }) => {
    await page.goto('/')

    // Should redirect somewhere (dashboard if authed, login if not)
    const url = page.url()
    expect(url.includes('/dashboard') || url.includes('/login')).toBeTruthy()
  })

  test('unauthenticated access to recipes redirects to login', async ({ page }) => {
    await page.goto('/recipes')

    // Middleware should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated access to meal-plan redirects to login', async ({ page }) => {
    await page.goto('/meal-plan')

    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated access to shopping redirects to login', async ({ page }) => {
    await page.goto('/shopping')

    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated access to cook redirects to login', async ({ page }) => {
    await page.goto('/cook')

    await expect(page).toHaveURL(/\/login/)
  })
})
