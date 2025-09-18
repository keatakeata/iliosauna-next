import { test, expect } from '@playwright/test';

test.describe('iOS Parallax Fix', () => {
  test('should apply iOS-specific styles on Mobile Safari', async ({ page, browserName }) => {
    // Mock iOS user agent for Mobile Safari tests
    if (browserName === 'webkit') {
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    }
    
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Check that hero section loads properly
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // For iOS devices (webkit browser), verify no fixed background attachment
    if (browserName === 'webkit') {
      // Check that iOS-specific class is applied
      await expect(heroSection).toHaveClass(/ios-hero-section/);
      
      // Verify background attachment is not fixed (should be scroll for iOS)
      const backgroundAttachment = await heroSection.evaluate((el) => {
        return window.getComputedStyle(el).backgroundAttachment;
      });
      
      expect(backgroundAttachment).not.toBe('fixed');
    }
  });

  test('should maintain parallax effect on desktop browsers', async ({ page, browserName }) => {
    // Skip iOS-specific tests for desktop browsers
    test.skip(browserName === 'webkit', 'This test is for desktop browsers only');
    
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // For desktop browsers, verify fixed background attachment is maintained
    const backgroundAttachment = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundAttachment;
    });
    
    expect(backgroundAttachment).toBe('fixed');
  });

  test('should have proper image positioning on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Check background position for mobile (should be 70% 30%)
    const backgroundPosition = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundPosition;
    });
    
    expect(backgroundPosition).toContain('70%');
    expect(backgroundPosition).toContain('30%');
  });

  test('should have proper image positioning on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Check background position for desktop (should be center center)
    const backgroundPosition = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundPosition;
    });
    
    expect(backgroundPosition).toContain('center');
  });

  test('should load hero background image', async ({ page }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Check that background image is set
    const backgroundImage = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    
    expect(backgroundImage).toContain('url');
    expect(backgroundImage).not.toBe('none');
  });
});