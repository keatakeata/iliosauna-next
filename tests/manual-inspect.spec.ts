import { test, expect } from '@playwright/test';

test.describe('Manual Frontend Inspection', () => {
  test('should inspect actual DOM and CSS', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('http://localhost:4448/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');

    // Wait for content to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Test desktop viewport first
    await page.setViewportSize({ width: 1200, height: 1024 });
    await page.waitForTimeout(2000);

    // Get comprehensive information about the layout
    const layoutInfo = await page.evaluate(() => {
      const body = document.body;
      const article = document.querySelector('article');
      const grid = document.querySelector('.blog-content-grid');

      // Find all elements that might be causing issues
      const allElements = document.querySelectorAll('*');
      const problematic = [];

      for (let el of allElements) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        if (rect.right > window.innerWidth + 5) { // 5px tolerance
          problematic.push({
            tag: el.tagName,
            class: el.className || 'no-class',
            id: el.id || 'no-id',
            width: rect.width,
            right: rect.right,
            maxWidth: style.maxWidth,
            position: style.position,
            overflow: style.overflow,
            overflowX: style.overflowX,
            textContent: el.textContent?.slice(0, 30) || 'no-text'
          });
        }
      }

      // Specifically look for table elements
      const tables = document.querySelectorAll('table');
      const tableInfo = Array.from(tables).map(table => {
        const rect = table.getBoundingClientRect();
        const style = window.getComputedStyle(table);
        return {
          width: rect.width,
          right: rect.right,
          left: rect.left,
          overflowX: style.overflowX,
          maxWidth: style.maxWidth,
          parent: table.parentElement?.tagName || 'none',
          parentClass: table.parentElement?.className || 'no-class',
          rows: table.querySelectorAll('tr').length,
          visible: rect.width > 0 && rect.height > 0
        };
      });

      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        body: {
          scrollWidth: body.scrollWidth,
          clientWidth: body.clientWidth,
          offsetWidth: body.offsetWidth,
          overflowX: window.getComputedStyle(body).overflowX
        },
        article: article ? {
          width: article.getBoundingClientRect().width,
          maxWidth: window.getComputedStyle(article).maxWidth,
          position: window.getComputedStyle(article).position
        } : 'not found',
        grid: grid ? {
          width: grid.getBoundingClientRect().width,
          maxWidth: window.getComputedStyle(grid).maxWidth,
          gridTemplateColumns: window.getComputedStyle(grid).gridTemplateColumns,
          padding: window.getComputedStyle(grid).padding
        } : 'not found',
        problematicElements: problematic.slice(0, 15), // First 15 problematic elements
        totalProblematic: problematic.length,
        tablesFound: tableInfo.length,
        tables: tableInfo
      };
    });

    console.log('=== LAYOUT INSPECTION ===');
    console.log('Viewport:', layoutInfo.viewport);
    console.log('Body:', layoutInfo.body);
    console.log('Article:', layoutInfo.article);
    console.log('Grid:', layoutInfo.grid);
    console.log('Problematic elements count:', layoutInfo.totalProblematic);
    console.log('Problematic elements:', layoutInfo.problematicElements);
    console.log('Tables found:', layoutInfo.tablesFound);
    console.log('Table details:', layoutInfo.tables);

    // Check what CSS media queries are active
    const mediaQueryInfo = await page.evaluate(() => {
      const queries = [
        '(max-width: 768px)',
        '(max-width: 1200px)',
        '(min-width: 769px)',
        '(min-width: 1200px)',
        '(max-width: 375px)'
      ];

      return queries.map(query => ({
        query,
        matches: window.matchMedia(query).matches
      }));
    });

    console.log('=== MEDIA QUERIES ===');
    console.log('Active media queries:', mediaQueryInfo);

    // Take a screenshot
    await page.screenshot({ path: 'manual-inspect-desktop.png', fullPage: true });
  });
});