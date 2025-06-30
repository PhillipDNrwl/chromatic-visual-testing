import { test } from '@playwright/test';
import { expect as chromaticExpect } from '@chromatic-com/playwright';

test.describe('Visual Regression Tests', () => {
  test('Homepage visual test', async ({ page }) => {
    await page.goto('/');
    await page.locator('h1').first().waitFor({ state: 'visible' });
    await chromaticExpect(page).toHaveScreenshot('homepage.png');
  });

  test('Welcome section visual test', async ({ page }) => {
    await page.goto('/');
    const welcomeSection = page.locator('h1').first();
    await welcomeSection.waitFor({ state: 'visible' });
    await welcomeSection.scrollIntoViewIfNeeded();
    await chromaticExpect(welcomeSection).toHaveScreenshot('welcome-section.png');
  });
});
