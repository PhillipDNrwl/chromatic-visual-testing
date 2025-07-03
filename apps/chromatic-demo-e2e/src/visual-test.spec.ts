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

  // Example: Target specific elements with locators
  test('Target specific container element', async ({ page }) => {
    await page.goto('/');
    
    // Target specific element by data-testid, class, or any locator
    const graphContainer = page.locator('[data-testid="dte-container"]');
    // Or by class: page.locator('.dte-container') 
    // Or by ID: page.locator('#dte-container')
    
    if (await graphContainer.count() > 0) {
      await graphContainer.waitFor({ state: 'visible' });
      await chromaticExpect(graphContainer).toHaveScreenshot('graph-container.png');
    }
  });

  test('Graph with masked dynamic data', async ({ page }) => {
    await page.goto('/');
    
    // Wait for any dynamic content to load
    await page.waitForLoadState('networkidle');
    
    const chartArea = page.locator('.chart-container, [data-testid="chart"], .graph-area').first();
    
    if (await chartArea.count() > 0) {
      await chartArea.waitFor({ state: 'visible' });
      
      // Take screenshot with masking options
      await chromaticExpect(chartArea).toHaveScreenshot('chart-masked.png', {
        // Mask dynamic elements that change frequently
        mask: [
          page.locator('[data-testid="timestamp"]'),
          page.locator('.dynamic-value'),
          page.locator('.live-counter'),
          page.locator('[aria-label*="Last updated"]')
        ],
        // Additional options for stable screenshots
        animations: 'disabled', // Disable CSS animations
        threshold: 0.1, // Allow small pixel differences (0-1 scale)
      });
    }
  });

  test('Multiple element targeting with complex masking', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Target your specific graph container
    const dteContainer = page.locator('[data-testid="dte-container"]');
    
    if (await dteContainer.count() > 0) {
      await dteContainer.waitFor({ state: 'visible' });
      
      await chromaticExpect(dteContainer).toHaveScreenshot('dte-container.png', {
        // Mask all dynamic data within the container
        mask: [
          // Timestamps - common patterns
          page.locator('[data-testid="dte-container"] .timestamp'),
          page.locator('[data-testid="dte-container"] [data-cy="time"]'),
          page.locator('[data-testid="dte-container"] .last-updated'),
          
          // Dynamic numbers/values
          page.locator('[data-testid="dte-container"] .live-value'),
          page.locator('[data-testid="dte-container"] .counter'),
          page.locator('[data-testid="dte-container"] [aria-live]'),
          
          // IDs and unique identifiers  
          page.locator('[data-testid="dte-container"] .run-id'),
          page.locator('[data-testid="dte-container"] .build-number'),
          
          // Specific text patterns (using regex)
          page.locator('[data-testid="dte-container"]').getByText(/^\d{4}-\d{2}-\d{2}/), // Dates
          page.locator('[data-testid="dte-container"]').getByText(/\d+\.\d+s$/), // Durations
        ],
        
                 // Fine-tune screenshot behavior
         animations: 'disabled',
         threshold: 0.05, // Very strict comparison (95% match required)
      });
    }
  });
});
