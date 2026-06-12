import { test, expect } from '@playwright/test';

test.describe('EARTHPULSE User Flow', () => {
  test('completes quiz and reaches results', async ({ page }) => {
    // Navigate to local dev server (assuming 5173 for Vite)
    await page.goto('http://localhost:5173/');

    // Act 1: Hero
    await expect(page.locator('.hero-headline')).toBeVisible();
    await expect(page.locator('.hero-subheadline')).toHaveText("Find out how you're affecting it.");
    
    // Use the progress dots to scroll to Act 2
    await page.locator('.progress-dot').nth(1).click();

    // Act 2: Quiz
    // Answer all 7 questions
    for (let i = 0; i < 7; i++) {
      // Find the first available answer button and click it
      await page.locator('.quiz-answer').first().click();
      // Wait for the transition to next question (or finish)
      await page.waitForTimeout(700);
    }

    // Act 3: Weight
    // After quiz completes, it auto-scrolls to Act 3
    await expect(page.locator('.big-number')).toBeVisible();
    
    // Scroll to Act 4
    await page.locator('.progress-dot').nth(3).click();

    // Act 4: Actions
    // Pledge the first action
    await page.locator('.pledge-btn').first().click();

    // Scroll to Act 5
    await page.locator('.progress-dot').nth(4).click();

    // Act 5: Ripple
    await expect(page.locator('.footprint-summary')).toBeVisible();
    await expect(page.locator('.pledged-summary')).toBeVisible();
    
    // Verify Share Button exists
    await expect(page.locator('.share-btn')).toBeVisible();
  });
});
