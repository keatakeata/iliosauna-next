import { test, expect } from '@playwright/test';

test.describe('Our Story Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/our-story');
    
    // Wait for the page to load and check for main heading
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Check that the hero section is visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Verify subtitle is present
    await expect(page.locator('text=Expertly crafted in Vancouver Island, BC')).toBeVisible();
  });

  test('should have all main sections', async ({ page }) => {
    await page.goto('/our-story');
    
    // Wait for content to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Check for main sections
    await expect(page.locator('text=A Passion for Wellness, Made Accessible')).toBeVisible();
    await expect(page.locator('text=Built in Canada')).toBeVisible();
    await expect(page.locator('text=BC Craftsmanship Meets Scandinavian Tradition')).toBeVisible();
    await expect(page.locator('text=What We Stand For')).toBeVisible();
    await expect(page.locator('text=Ready to Transform Your Wellness Journey?')).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/our-story');
    
    // Wait for content to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Check CTA buttons exist and have correct links
    const exploreSaunasBtn = page.locator('a[href="/saunas"]').first();
    const getInTouchBtn = page.locator('a[href="/contact"]').first();
    
    await expect(exploreSaunasBtn).toBeVisible();
    await expect(getInTouchBtn).toBeVisible();
    
    await expect(exploreSaunasBtn).toContainText('Explore Our Saunas');
    await expect(getInTouchBtn).toContainText('Get in Touch');
  });

  test('should display slideshow in Built in Canada section', async ({ page }) => {
    await page.goto('/our-story');
    
    // Wait for content to load
    await expect(page.locator('h1')).toContainText('Our Story');
    
    // Check for slideshow indicators
    const slideIndicators = page.locator('.built-in-canada-section button');
    await expect(slideIndicators).toHaveCount(5); // Should have 5 slide indicators
    
    // Check that images are present
    const slideshowSection = page.locator('.built-in-canada-section');
    await expect(slideshowSection).toBeVisible();
  });
});