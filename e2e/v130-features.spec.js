import { test, expect } from '@playwright/test';

test.describe('Project Tandem v1.3.0 Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('V130-01: Verifies 5-Year Wealth Trajectory card in Financial Copilot', async ({ page }) => {
    // Locate the 5-Yr Wealth copilot tab button
    const wealthTab = page.locator('.copilot-tab-btn:has-text("5-Yr Wealth")');
    await expect(wealthTab).toBeVisible();
    await wealthTab.click();

    // Verify 5-Year Net Worth narrative is rendered
    await expect(page.locator('text=5-Year Household Net Worth Trajectory')).toBeVisible();
    await expect(page.locator('text=Est. 5-Yr Accumulated Wealth')).toBeVisible();
  });

  test('V130-02: Verifies HECS/HELP toggle pill interaction in Income Section', async ({ page }) => {
    // Navigate to Income tab first
    const incomeNavBtn = page.locator('.sidebar-nav-item:has-text("Income"), .nav-tab-item:has-text("Income")').first();
    await expect(incomeNavBtn).toBeVisible();
    await incomeNavBtn.click();

    // Locate the first HECS toggle button in Income section
    const hecsToggleBtn = page.locator('button:has-text("NO HECS")').first();
    await expect(hecsToggleBtn).toBeVisible();
    await hecsToggleBtn.click();

    // Verify button switches state to HECS ACTIVE
    await expect(page.locator('button:has-text("HECS ACTIVE")').first()).toBeVisible();
  });

  test('V130-03: Verifies CashflowDonutChart renders in Expenses and filters on category click', async ({ page }) => {
    // Navigate to Expenses tab
    const expensesNavBtn = page.locator('.sidebar-nav-item:has-text("Expenses"), .nav-tab-item:has-text("Expenses")').first();
    await expect(expensesNavBtn).toBeVisible();
    await expensesNavBtn.click();

    // Verify donut chart wrapper and center metric exist
    const donutWrapper = page.locator('.donut-chart-wrapper');
    await expect(donutWrapper).toBeVisible();
    await expect(page.locator('.donut-center-metric')).toBeVisible();

    // Click on a category legend item (e.g., Housing)
    const housingLegendBtn = page.locator('.legend-item:has-text("Housing")').first();
    if (await housingLegendBtn.isVisible()) {
      await housingLegendBtn.click();
      // Verify active category pill is visible in filter row
      await expect(page.locator('.cat-filter-btn.active:has-text("Housing")')).toBeVisible();
    }
  });

  test('V130-04: Verifies PartnerTaxBarChart renders in Income section', async ({ page }) => {
    // Navigate to Income tab
    const incomeNavBtn = page.locator('.sidebar-nav-item:has-text("Income"), .nav-tab-item:has-text("Income")').first();
    await expect(incomeNavBtn).toBeVisible();
    await incomeNavBtn.click();

    // Verify partner bar chart card is visible
    const barChartCard = page.locator('.partner-bar-chart-card');
    await expect(barChartCard).toBeVisible();
    await expect(page.locator('text=Partner Income & Tax Distribution Comparison')).toBeVisible();
  });
});
