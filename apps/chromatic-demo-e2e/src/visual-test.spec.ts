import { test } from '@playwright/test';
import { expect as chromaticExpect } from '@chromatic-com/playwright';

test.describe('Visual Regression Tests', () => {
  test('Homepage visual test', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the main content to be visible
    await page.locator('h1').first().waitFor({ state: 'visible' });
    
    // Take a visual snapshot
    await chromaticExpect(page).toHaveScreenshot('homepage.png');
  });

  test('Welcome section visual test', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Focus on the welcome section
    const welcomeSection = page.locator('h1').first();
    
    // Wait for the welcome section to be visible
    await welcomeSection.waitFor({ state: 'visible' });
    await welcomeSection.scrollIntoViewIfNeeded();
    
    // Take a visual snapshot of the welcome section
    await chromaticExpect(welcomeSection).toHaveScreenshot('welcome-section.png');
  });
});
