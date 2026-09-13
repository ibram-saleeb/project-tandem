import { chromium } from '@playwright/test';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';

async function runLocalPreview() {
  const storeAssetsDir = path.resolve(process.cwd(), 'public/store-assets');
  const artifactDir = 'C:\\Users\\ibram\\.gemini\\antigravity-ide\\brain\\f06132b2-61da-4463-afdc-b64191224d88';

  if (!fs.existsSync(storeAssetsDir)) {
    fs.mkdirSync(storeAssetsDir, { recursive: true });
  }

  // 1. Start local Vite preview server on dist
  console.log('[iPhone 16 Preview] Starting Vite preview server...');
  const server = await preview({
    preview: { port: 4173 }
  });
  const targetUrl = 'http://localhost:4173';
  console.log(`[iPhone 16 Preview] Serving on ${targetUrl}`);

  // 2. Launch Chromium with iPhone 16 specifications
  const browser = await chromium.launch({ headless: true });
  const iPhone16Context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  });

  const page = await iPhone16Context.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const saveToBoth = async (filename) => {
    const storePath = path.join(storeAssetsDir, filename);
    const artifactPath = path.join(artifactDir, filename);
    await page.screenshot({ path: storePath, fullPage: false });
    fs.copyFileSync(storePath, artifactPath);
    console.log(`[iPhone 16 Preview] Saved: ${filename}`);
  };

  // 1. Month / Overview Screen
  await saveToBoth('iphone16-month.png');

  // 2. Spending / Expenses Screen (with CashflowDonutChart)
  const navButtons = page.locator('.mobile-nav-item');
  const count = await navButtons.count();
  console.log(`[iPhone 16 Preview] Found ${count} mobile nav items:`, await navButtons.allTextContents());

  // Click Spending (index 1)
  if (count > 1) {
    await navButtons.nth(1).click();
    await page.waitForTimeout(800);
    await saveToBoth('iphone16-spending.png');
  }

  // Click What-if (index 2)
  if (count > 2) {
    await navButtons.nth(2).click();
    await page.waitForTimeout(800);
    await saveToBoth('iphone16-whatif.png');
  }

  // Clean shutdown
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
  console.log('[iPhone 16 Preview] All screenshots captured successfully!');
}

runLocalPreview().catch((err) => {
  console.error('[iPhone 16 Preview Error]', err);
  process.exit(1);
});
