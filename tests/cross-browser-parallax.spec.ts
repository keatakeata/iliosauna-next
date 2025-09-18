import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Parallax Behavior', () => {
  test('should display hero section consistently across all browsers', async ({ page, browserName }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Take screenshot for visual comparison across browsers
    await expect(heroSection).toHaveScreenshot(`hero-section-${browserName}.png`);
  });

  test('should handle background image loading in all browsers', async ({ page, browserName }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroSection = page.locator('section').first();
    
    // Wait for background image to load by checking computed styles
    await page.waitForFunction(() => {
      const section = document.querySelector('section');
      const backgroundImage = window.getComputedStyle(section!).backgroundImage;
      return backgroundImage && backgroundImage !== 'none';
    });
    
    // Verify background properties are set correctly
    const backgroundImage = await heroSection.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundImage: styles.backgroundImage,
        backgroundSize: styles.backgroundSize,
        backgroundRepeat: styles.backgroundRepeat,
        backgroundAttachment: styles.backgroundAttachment
      };
    });
    
    expect(backgroundImage.backgroundImage).toContain('url');
    expect(backgroundImage.backgroundSize).toBe('cover');
    expect(backgroundImage.backgroundRepeat).toBe('no-repeat');
    
    // Background attachment should be 'scroll' for webkit (iOS Safari) and 'fixed' for others
    if (browserName === 'webkit') {
      expect(backgroundImage.backgroundAttachment).toBe('scroll');
    } else {
      expect(backgroundImage.backgroundAttachment).toBe('fixed');
    }
  });

  test('should maintain text readability over background image', async ({ page, browserName }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    const heroTitle = page.locator('h1');
    const heroSubtitle = page.locator('section p').first();
    
    await expect(heroTitle).toBeVisible();
    await expect(heroSubtitle).toBeVisible();
    
    // Check text color for readability (should be white)
    const titleColor = await heroTitle.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    const subtitleColor = await heroSubtitle.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // Colors should be white for readability over dark background
    expect(titleColor).toBe('rgb(255, 255, 255)');
    expect(subtitleColor).toBe('rgb(255, 255, 255)');
  });

  test('should handle scroll behavior properly on different browsers', async ({ page, browserName }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Get initial hero section position
    const heroSection = page.locator('section').first();
    const initialPosition = await heroSection.boundingBox();
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500); // Wait for scroll to complete
    
    // Get position after scroll
    const afterScrollPosition = await heroSection.boundingBox();
    
    // Hero section should move with scroll (different behavior based on parallax)
    if (browserName === 'webkit') {
      // On webkit (iOS Safari), hero should scroll normally
      expect(afterScrollPosition!.y).toBeLessThan(initialPosition!.y);
    } else {
      // On other browsers with fixed attachment, hero background stays fixed
      // but the section itself still moves
      expect(afterScrollPosition!.y).toBeLessThan(initialPosition!.y);
    }
  });

  test('should load and display all content sections after hero', async ({ page }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Scroll to ensure all content loads
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Check that all major sections are present and visible
    const sections = [
      'A Passion for Wellness, Made Accessible',
      'Built in Canada', 
      'BC Craftsmanship Meets Scandinavian Tradition',
      'What We Stand For',
      'Ready to Transform Your Wellness Journey?'
    ];
    
    for (const sectionTitle of sections) {
      await expect(page.locator(`text=${sectionTitle}`)).toBeVisible();
    }
  });
});