import { test } from '@playwright/test';
import { expect as chromaticExpect } from '@chromatic-com/playwright';
import { VisualTestHelpers, MASK_PATTERNS } from './visual-helpers';

test.describe('Advanced Visual Testing with Dynamic Content Masking', () => {
  
  test('Performance graph with masked dynamic data', async ({ page }) => {
    const helpers = new VisualTestHelpers(page);
    
    await page.goto('/');
    
    // Wait for the page and graph to stabilize
    await helpers.waitForStability('[data-testid="dte-container"]');
    
    // Take screenshot of the graph with all dynamic content masked
    await helpers.screenshotPerformanceGraph(
      '[data-testid="dte-container"]',
      'performance-graph-masked.png'
    );
  });

  test('Target specific graph container element', async ({ page }) => {
    await page.goto('/');
    
    const dteContainer = page.locator('[data-testid="dte-container"]');
    
    if (await dteContainer.count() > 0) {
      await dteContainer.waitFor({ state: 'visible' });
      
      // Screenshot just the graph area, masking dynamic data
      await chromaticExpect(dteContainer).toHaveScreenshot('dte-container-clean.png', {
        mask: [
          // Mask all timestamp variations
          dteContainer.locator('.timestamp'),
          dteContainer.locator('[data-testid="timestamp"]'),
          dteContainer.locator('.last-updated'),
          
          // Mask all dynamic values
          dteContainer.locator('.live-value'),
          dteContainer.locator('.dynamic-value'),
          dteContainer.locator('.run-id'),
          
          // Mask text patterns with regex
          dteContainer.getByText(/\d{4}-\d{2}-\d{2}/), // Dates
          dteContainer.getByText(/\d+\.\d+/), // Decimal numbers
          dteContainer.getByText(/run-\d+/), // Run IDs
        ],
        animations: 'disabled',
      });
    }
  });

  test('Graph area only - focus on visualization', async ({ page }) => {
    await page.goto('/');
    
    const graphArea = page.locator('[data-testid="dte-container"] .graph-area');
    
    if (await graphArea.count() > 0) {
      await graphArea.waitFor({ state: 'visible' });
      
      // Screenshot only the chart visualization, ignoring metadata
      await chromaticExpect(graphArea).toHaveScreenshot('graph-visualization-only.png', {
        animations: 'disabled',
      });
    }
  });

  test('Multi-element testing with selective masking', async ({ page }) => {
    await page.goto('/');
    
    // Test different sections with appropriate masking
    const sections = [
      {
        selector: '[data-testid="dte-container"]',
        name: 'performance-section',
        maskPatterns: MASK_PATTERNS.CHART
      },
      {
        selector: 'h1', 
        name: 'header-section',
        maskPatterns: ['.timestamp', '.user-specific']
      }
    ];

    for (const section of sections) {
      const element = page.locator(section.selector);
      
      if (await element.count() > 0) {
        await element.waitFor({ state: 'visible' });
        
        const masks = section.maskPatterns.map(pattern => 
          element.locator(pattern)
        );
        
        await chromaticExpect(element).toHaveScreenshot(`${section.name}.png`, {
          mask: masks,
          animations: 'disabled',
        });
      }
    }
  });

  test('Cross-browser consistency for graphs', async ({ page, browserName }) => {
    await page.goto('/');
    
    const graphContainer = page.locator('[data-testid="dte-container"]');
    
    if (await graphContainer.count() > 0) {
      await graphContainer.waitFor({ state: 'visible' });
      
      // Wait extra time for browser-specific rendering
      await page.waitForTimeout(1000);
      
      await chromaticExpect(graphContainer).toHaveScreenshot(`graph-${browserName}.png`, {
        mask: [
          graphContainer.locator('.timestamp'),
          graphContainer.locator('.live-value'),
          graphContainer.locator('.run-id'),
        ],
        animations: 'disabled',
      });
    }
  });
}); 