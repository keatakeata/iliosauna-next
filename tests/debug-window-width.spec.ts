import { test, expect } from '@playwright/test';

test.describe('Debug Window Width', () => {
  test('should check windowWidth state', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('http://localhost:4448/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');

    // Wait for content to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Check what windowWidth React state is set to
    const windowWidthState = await page.evaluate(() => {
      // Try to access the React component's state
      const article = document.querySelector('article');
      const style = article ? window.getComputedStyle(article) : null;

      return {
        actualViewportWidth: window.innerWidth,
        articleMaxWidth: style?.maxWidth || 'not found',
        articleWidth: style?.width || 'not found',
        articleComputedWidth: article?.getBoundingClientRect().width || 'not found'
      };
    });

    console.log('Window width debug info:', windowWidthState);

    // Take a screenshot
    await page.screenshot({ path: 'debug-mobile.png', fullPage: true });
  });
});