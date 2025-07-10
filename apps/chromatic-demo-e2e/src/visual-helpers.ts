import { Page, Locator } from '@playwright/test';

/**
 * Visual Testing Helpers for Dynamic Content
 * 
 * This demonstrates how to handle common patterns in apps like Nx Cloud:
 * - Performance graphs with changing data
 * - Build timelines with timestamps
 * - Dynamic counters and metrics
 * - User-specific content (names, IDs, etc.)
 */

export class VisualTestHelpers {
  constructor(private page: Page) {}

  /**
   * Common dynamic data patterns to mask
   */
  private getDynamicDataSelectors() {
    return [
      // Timestamps and dates
      '[data-testid*="timestamp"]',
      '[data-testid*="time"]', 
      '[data-testid*="date"]',
      '.timestamp',
      '.last-updated',
      '.created-at',
      
      // Dynamic values and counters
      '[data-testid*="count"]',
      '[data-testid*="value"]',
      '[data-testid*="duration"]',
      '.live-value',
      '.counter',
      '.metric-value',
      
      // IDs and unique identifiers
      '[data-testid*="id"]',
      '.run-id',
      '.build-id',
      '.user-id',
      '.session-id',
      
      // Live updating content
      '[aria-live]',
      '[data-testid*="live"]',
      '.real-time',
      '.streaming',
    ];
  }

  /**
   * Mask dynamic content within a specific container
   */
  async maskDynamicContent(container: string | Locator) {
    const containerLocator = typeof container === 'string' 
      ? this.page.locator(container) 
      : container;

    const selectors = this.getDynamicDataSelectors();
    const maskLocators: Locator[] = [];

    for (const selector of selectors) {
      const elements = containerLocator.locator(selector);
      if (await elements.count() > 0) {
        maskLocators.push(elements);
      }
    }

    return maskLocators;
  }

  /**
   * Take screenshot of performance graph with masked dynamic data
   */
  async screenshotPerformanceGraph(
    graphSelector: string = '[data-testid="dte-container"]',
    screenshotName: string = 'performance-graph.png'
  ) {
    const graphContainer = this.page.locator(graphSelector);
    
    if (await graphContainer.count() === 0) {
      console.log(`Graph container ${graphSelector} not found, skipping...`);
      return;
    }

    // Wait for graph to be visible and stable
    await graphContainer.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
    
    // Get dynamic content to mask
    const maskLocators = await this.maskDynamicContent(graphContainer);
    
    // Additional graph-specific masking
    const graphSpecificMasks = [
      graphContainer.locator('.axis-label[data-dynamic]'),
      graphContainer.locator('.tooltip'),
      graphContainer.locator('.data-point-label'),
      graphContainer.locator('.legend-value'),
    ];

    const allMasks = [...maskLocators, ...graphSpecificMasks];
    
    return graphContainer.screenshot({
      path: screenshotName,
      mask: allMasks,
      animations: 'disabled',
    });
  }

  /**
   * Take screenshot of dashboard with comprehensive masking
   */
  async screenshotDashboard(
    dashboardSelector: string = '[data-testid="dashboard"]',
    screenshotName: string = 'dashboard.png'
  ) {
    const dashboard = this.page.locator(dashboardSelector);
    
    await dashboard.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
    
    const maskLocators = await this.maskDynamicContent(dashboard);
    
    // Dashboard-specific masks
    const dashboardMasks = [
      dashboard.locator('.user-avatar'),
      dashboard.locator('.notification-badge'),
      dashboard.locator('.status-indicator[data-live]'),
      dashboard.locator('.progress-bar[data-dynamic]'),
    ];

    return dashboard.screenshot({
      path: screenshotName,
      mask: [...maskLocators, ...dashboardMasks],
      animations: 'disabled',
    });
  }

  /**
   * Take screenshot with regex-based masking for text patterns
   */
  async screenshotWithTextMasking(
    elementSelector: string,
    screenshotName: string,
    textPatterns: RegExp[] = [
      /\d{4}-\d{2}-\d{2}/, // Dates
      /\d+\.\d+s/, // Durations  
      /run-\d+/, // Run IDs
      /\d+:\d+:\d+/, // Times
    ]
  ) {
    const element = this.page.locator(elementSelector);
    await element.waitFor({ state: 'visible' });
    
    const textMasks: Locator[] = [];
    for (const pattern of textPatterns) {
      const textElements = element.getByText(pattern);
      if (await textElements.count() > 0) {
        textMasks.push(textElements);
      }
    }
    
    return element.screenshot({
      path: screenshotName,
      mask: textMasks,
      animations: 'disabled',
    });
  }

  /**
   * Wait for dynamic content to stabilize before screenshot
   */
  async waitForStability(selector: string, timeoutMs: number = 3000) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    
    // Wait for any loading states to complete
    await this.page.waitForLoadState('networkidle');
    
    // Wait for animations to complete
    await this.page.waitForTimeout(500);
    
    // Wait for any loading indicators to disappear
    try {
      const loadingIndicator = this.page.locator('[data-loading="true"]');
      if (await loadingIndicator.count() > 0) {
        await loadingIndicator.waitFor({ state: 'detached', timeout: timeoutMs });
      }
    } catch (e) {
      // Continue if no loading indicators found
    }
  }
}

/**
 * Common masking patterns for different types of components
 */
export const MASK_PATTERNS = {
  // Chart/Graph components
  CHART: [
    '[data-testid*="chart"] .axis-label',
    '[data-testid*="chart"] .tooltip',
    '[data-testid*="chart"] .data-label',
    '.recharts-tooltip',
    '.chart-tooltip',
    '.d3-tooltip',
  ],
  
  // Table components with dynamic data
  TABLE: [
    'table [data-testid*="timestamp"]',
    'table .duration',
    'table .status-badge[data-live]',
    'table .id-column',
  ],
  
  // Navigation with user-specific content
  NAVIGATION: [
    '.user-menu .username',
    '.user-menu .avatar',
    '.notification-count',
    '.workspace-selector .current-workspace',
  ],
  
  // Forms with dynamic validation
  FORM: [
    '.form-error[data-dynamic]',
    '.validation-message',
    '.field-hint[data-live]',
  ],
} as const; 