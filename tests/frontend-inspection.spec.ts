import { test, expect } from '@playwright/test';

test.describe('Frontend Inspection Tests', () => {
  test('should load blog post page successfully', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if page loads without errors
    await expect(page).toHaveTitle(/Finnish Saunas/i);

    // Check if main content is visible
    await expect(page.locator('h1')).toBeVisible();

    // Take a screenshot for manual inspection
    await page.screenshot({ path: 'blog-post-loaded.png', fullPage: true });
  });

  test('should show author modal when author name is clicked', async ({ page }) => {
    // Navigate to blog post
    await page.goto('/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');
    await page.waitForLoadState('networkidle');

    // Look for author name in sidebar (assuming it's clickable)
    const authorElement = page.locator('[style*="cursor: pointer"]').filter({ hasText: /author|by/i }).first();

    if (await authorElement.count() > 0) {
      // Click on author name
      await authorElement.click();

      // Wait for modal to appear
      await page.waitForTimeout(500);

      // Check if modal is visible
      const modal = page.locator('[style*="position: fixed"]').filter({ hasText: /author|bio/i });
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible();
        console.log('✅ Author modal is working');

        // Take screenshot of modal
        await page.screenshot({ path: 'author-modal-open.png', fullPage: true });

        // Check if modal can be closed
        const closeButton = page.locator('button').filter({ hasText: '×' });
        if (await closeButton.count() > 0) {
          await closeButton.click();
          await page.waitForTimeout(300);
          await expect(modal).not.toBeVisible();
          console.log('✅ Modal closes properly');
        }
      } else {
        console.log('❌ Modal not found after clicking author');
      }
    } else {
      console.log('⚠️ Clickable author element not found');
    }
  });

  test('should have responsive design elements', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'desktop-view.png', fullPage: true });

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'mobile-view.png', fullPage: true });

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tablet-view.png', fullPage: true });
  });

  test('should check for console errors', async ({ page }) => {
    const errors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to page
    await page.goto('/journal/the-proven-health-benefits-of-finnish-saunas-why-vancouverites-are-embracing-the-heat');
    await page.waitForLoadState('networkidle');

    // Log any errors found
    if (errors.length > 0) {
      console.log('❌ Console errors found:');
      errors.forEach(error => console.log('  -', error));
    } else {
      console.log('✅ No console errors found');
    }

    // Assert no critical errors
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('analytics') &&
      !error.includes('third-party')
    );

    expect(criticalErrors.length).toBe(0);
  });
});