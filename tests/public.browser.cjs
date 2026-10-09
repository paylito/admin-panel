const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.PUBLIC_TEST_BASE_URL || 'http://127.0.0.1:5173';
const apiOrigin = process.env.PUBLIC_TEST_API_BASE_URL || 'http://127.0.0.1:3030';
const shots = process.env.PUBLIC_TEST_SCREENSHOT_DIR || '/tmp/korre-public-review';
fs.mkdirSync(shots, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (req) => { const url = new URL(req.url()); if (url.pathname.startsWith('/public/') || url.pathname.startsWith('/admin/')) requests.push(url.pathname); });
  try {
    await page.goto(origin);
    await page.getByText('gross transfer volume', { exact: true }).waitFor();
    assert.ok(!requests.some((path) => path.startsWith('/admin/')), 'Anonymous view made a private API request');
    assert.equal(await page.getByRole('link', { name: 'merchants', exact: true }).count(), 0);
    assert.equal(await page.getByRole('link', { name: 'donatees', exact: true }).count(), 0);
    assert.equal(await page.getByText('registered users', { exact: true }).count(), 1);
    await page.locator('summary').first().click();
    await page.getByRole('heading', { name: 'payer funding' }).waitFor();
    assert.equal(await page.getByText('deposit observed; hash unavailable', { exact: true }).count(), 0, 'Real payer deposit hash was not recovered');
    assert.equal(await page.getByRole('link', { name: 'View transaction on block explorer' }).count(), 3);
    await page.screenshot({ path: `${shots}/desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile overview overflows');
    await page.screenshot({ path: `${shots}/mobile.png`, fullPage: true });
    await page.getByRole('link', { name: 'transactions', exact: true }).click();
    await page.locator('summary').first().waitFor();
    await page.getByLabel('ASSET', { exact: true }).selectOption('BTC');
    await page.getByText('no payments match these filters.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'clear', exact: true }).click();
    await page.locator('summary').first().waitFor();
    await page.locator('summary').first().click();
    await page.screenshot({ path: `${shots}/mobile-transactions.png`, fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile transactions overflow');
    // Test hundreds of pages without adding synthetic data to the real database.
    const real = await (await fetch(`${apiOrigin}/public/payments`)).json();
    await page.route('**/public/payments?**', async (route) => {
      const query = new URL(route.request().url()).searchParams;
      const current = Number(query.get('page') || 1);
      await route.fulfill({ json: { success: true, data: Array.from({ length: 10 }, (_, i) => ({ ...real.data[0], id: `fixture-${current}-${i}` })), pagination: { page: current, limit: 10, total: 5000, totalPages: 500, hasPrev: current > 1, hasNext: current < 500, from: (current - 1) * 10 + 1, to: current * 10 } } });
    });
    await page.reload();
    await page.getByText('showing 1–10 of 5000', { exact: true }).waitFor();
    assert.equal(await page.locator('button[aria-current="page"]').count(), 1);
    await page.getByRole('button', { name: 'Next page' }).click();
    await page.getByText('showing 11–20 of 5000', { exact: true }).waitFor();
    // Page four has both ellipses, just like a middle page.
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByText('showing 21–30 of 5000', { exact: true }).waitFor();
    await page.getByRole('button', { name: '4', exact: true }).click();
    await page.getByText('showing 31–40 of 5000', { exact: true }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Middle-page pagination overflows mobile');
    await page.getByRole('button', { name: '500', exact: true }).click();
    await page.getByText('showing 4991–5000 of 5000', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Next page' }).isDisabled(), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Large pagination overflows mobile');
    await page.unroute('**/public/payments?**');
    // Error recovery and refresh should not call authenticated routes.
    await page.route('**/public/payments?**', (route) => route.fulfill({ status: 503, json: { success: false, message: 'Temporary public test failure' } }));
    await page.reload(); await page.getByRole('alert').waitFor();
    await page.unroute('**/public/payments?**');
    await page.getByRole('button', { name: 'try again' }).click();
    await page.locator('summary').first().waitFor();
    await page.goto(`${origin}/merchants`);
    await page.getByText('gross transfer volume', { exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/');
    // Admin checks are optional and credentials must be supplied explicitly.
    if (process.env.PUBLIC_TEST_ADMIN_ID && process.env.PUBLIC_TEST_ADMIN_SECRET) {
    await page.getByRole('link', { name: 'Admin login' }).click();
    await page.getByLabel('ID', { exact: true }).fill(process.env.PUBLIC_TEST_ADMIN_ID);
    await page.getByLabel('SECRET', { exact: true }).fill(process.env.PUBLIC_TEST_ADMIN_SECRET);
    await page.getByRole('button', { name: 'log in', exact: true }).click();
    await page.getByRole('link', { name: 'merchants', exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/');
    await page.getByRole('link', { name: 'merchants', exact: true }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.getByText('gross transfer volume', { exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await page.getByRole('link', { name: 'merchants', exact: true }).count(), 0);
    }
    // Expired sessions fall back to public mode, not an auth loop.
    await page.evaluate(() => localStorage.setItem('payli.admin.token', 'expired-test-token'));
    await page.reload(); await page.getByText('gross transfer volume', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('payli.admin.token')), null);
    assert.deepEqual(errors, [], 'Browser runtime errors');
    console.log('PASS: public entry, live payer hash, three trace links, desktop/mobile layout, filters, 500-page pagination, errors/retry, private-route guard, optional admin login/logout, expired sessions, no runtime errors.');
    console.log(`Screenshots: ${shots}`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
