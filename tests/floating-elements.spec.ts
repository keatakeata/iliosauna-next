import { test, expect } from '@playwright/test';

test.describe('Floating Elements Test', () => {
  test('should check for floating elements within viewport', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('http://localhost:4448/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');

    // Wait for content to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Check for any floating elements that might be cut off
    const floatingElementsInfo = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, div[style*="position: fixed"], div[style*="position: absolute"], *[class*="share"]');
      const overflowing = [];
      const within = [];

      for (let element of elements) {
        const rect = element.getBoundingClientRect();
        const isOverflowing = rect.right > window.innerWidth || rect.left < 0;

        const info = {
          tag: element.tagName,
          class: element.className || 'no-class',
          width: rect.width,
          right: rect.right,
          left: rect.left,
          windowWidth: window.innerWidth,
          isVisible: rect.width > 0 && rect.height > 0,
          content: element.textContent?.slice(0, 50) || 'no-text'
        };

        if (isOverflowing && info.isVisible) {
          overflowing.push(info);
        } else if (info.isVisible) {
          within.push(info);
        }
      }

      return {
        overflowing: overflowing.slice(0, 10), // First 10 overflowing
        within: within.slice(0, 5), // First 5 within viewport
        totalButtons: elements.length
      };
    });

    console.log('Floating elements analysis:', floatingElementsInfo);

    // Take a screenshot
    await page.screenshot({ path: 'floating-elements-mobile.png', fullPage: true });
  });
});