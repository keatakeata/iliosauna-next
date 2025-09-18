import { test, expect } from '@playwright/test';

test.describe('Blog Page Inspection', () => {
  test('should inspect blog page responsiveness', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('http://localhost:4448/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');

    // Wait for content to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Take desktop screenshot
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.screenshot({ path: 'blog-desktop.png', fullPage: true });

    // Take tablet screenshot
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'blog-tablet.png', fullPage: true });

    // Take mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'blog-mobile.png', fullPage: true });

    // Check for overflow issues on mobile
    const bodyOverflow = await page.evaluate(() => {
      return {
        overflowX: window.getComputedStyle(document.body).overflowX,
        scrollWidth: document.body.scrollWidth,
        clientWidth: document.body.clientWidth,
        hasHorizontalScroll: document.body.scrollWidth > document.body.clientWidth
      };
    });

    console.log('Body overflow info:', bodyOverflow);

    // Check for table issues
    const tableInfo = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      return Array.from(tables).map(table => {
        const rect = table.getBoundingClientRect();
        const parentRect = table.parentElement?.getBoundingClientRect();
        return {
          width: rect.width,
          parentWidth: parentRect?.width,
          overflowing: parentRect ? rect.width > parentRect.width : false
        };
      });
    });

    console.log('Table info:', tableInfo);

    // Check for any elements with horizontal overflow
    const overflowingElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const overflowing = [];

      for (let element of elements) {
        const rect = element.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          overflowing.push({
            tag: element.tagName,
            class: element.className,
            width: rect.width,
            right: rect.right,
            windowWidth: window.innerWidth
          });
        }
      }

      return overflowing.slice(0, 10); // First 10 overflowing elements
    });

    console.log('Overflowing elements:', overflowingElements);
  });
});