import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page renders with OAuth buttons', async ({ page }) => {
    await page.goto('/login')

    // Page title visible
    await expect(page.getByText('Welcome back')).toBeVisible()

    // OAuth buttons present
    await expect(page.getByText('Continue with GitHub')).toBeVisible()
    await expect(page.getByText('Continue with Google')).toBeVisible()
  })

  test('login page has proper structure', async ({ page }) => {
    await page.goto('/login')

    // Card with sign-in form exists
    await expect(page.getByText('Sign in to your account')).toBeVisible()

    // Terms text present
    await expect(page.getByText('By signing in')).toBeVisible()
  })

  test('register page redirects to login', async ({ page }) => {
    await page.goto('/register')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
