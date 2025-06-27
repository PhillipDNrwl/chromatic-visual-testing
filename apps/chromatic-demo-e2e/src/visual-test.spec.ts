import { test } from '@playwright/test';
import { expect as chromaticExpect } from '@chromatic-com/playwright';

test.describe('Visual Regression Tests', () => {
  test('Homepage visual test', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take a visual snapshot
    await chromaticExpect(page).toHaveScreenshot('homepage.png');
  });

  test('Welcome section visual test', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Focus on the welcome section
    const welcomeSection = page.locator('h1').first();
    await welcomeSection.scrollIntoViewIfNeeded();
    
    // Take a visual snapshot of the welcome section
    await chromaticExpect(welcomeSection).toHaveScreenshot('welcome-section.png');
  });
});
