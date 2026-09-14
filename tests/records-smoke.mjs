import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const base = process.env.TEST_BASE_URL ?? 'http://localhost:4321/mywebsite/';
const slugs = ['profile', 'education', 'research', 'strategy', 'campaign', 'content', 'visual-work', 'ai-experiments', 'personal-notes'];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const slug of slugs) {
      const response = await page.goto(`${base}library/${slug}/`);
      assert.equal(response.status(), 200, slug);
      await expect(page.locator('.liner-header h1')).toBeVisible();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${slug} overflows at ${width}px`);
      assert.equal(await page.locator('.track-index a').evaluateAll(links => links.every(link => document.getElementById(link.hash.slice(1)))), true, `${slug} has a broken chapter anchor`);
    }
  }
  assert.doesNotMatch(await page.locator('.detail-main').innerText(), /目前在伦敦|正在.*论文|每周统筹|Pret A Manger/);
  await expect(page.locator('.detail-main')).toContainText('毕业论文已经完成');

  await page.setViewportSize({ width: 1200, height: 1000 });
  await page.goto(`${base}library/content/`);
  const gallery = page.locator('[data-photo-carousel]');
  await gallery.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const frame = gallery.locator('[data-photo-number]').first();
  await expect(frame).toHaveText('02', { timeout: 9000 });
  await gallery.locator('[data-photo-toggle]').click();
  await expect(gallery).toHaveAttribute('data-paused', 'true');
  for (let index = 0; index < 10; index++) {
    await gallery.locator(`[data-photo-thumbnail="${index}"]`).click();
    await expect(frame).toHaveText(String(index + 1).padStart(2, '0'));
    await expect(gallery.locator('[data-photo-slide][aria-hidden="false"]')).toHaveCount(1);
    await expect.poll(() => gallery.locator('.photo-slide.is-active img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    assert.equal(await gallery.locator('.photo-slide.is-active img').evaluate(img => getComputedStyle(img).objectFit), 'contain');
  }
  await gallery.locator('[data-photo-next]').click();
  await expect(frame).toHaveText('01');
  await gallery.locator('[data-photo-prev]').click();
  await expect(frame).toHaveText('10');
  await gallery.focus();
  await page.keyboard.press('Home');
  await expect(frame).toHaveText('01');
  await page.keyboard.press('ArrowRight');
  await expect(frame).toHaveText('02');
  await page.locator('.record-pagination a').last().click();
  await page.waitForURL('**/library/visual-work/');
  await page.locator('.record-pagination a').first().click();
  await page.waitForURL('**/library/content/');
  await page.locator('[data-photo-next]').click();
  await expect(page.locator('[data-photo-number]').first()).toHaveText('02');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(gallery).toHaveAttribute('data-paused', 'true');
  await expect(gallery).toHaveAttribute('data-playing', 'false');
  await gallery.locator('[data-photo-next]').click();
  await expect(frame).toHaveText('02');
  await page.setViewportSize({ width: 390, height: 844 });
  const stage = gallery.locator('[data-photo-stage]');
  await stage.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 290, clientY: 250 });
  await stage.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: 80, clientY: 260 });
  await expect(frame).toHaveText('03');
  assert.deepEqual(errors, []);
  console.log('PASS: nine routes at desktop/390/320px, chapter anchors, current status, ten photos, autoplay/pause, wraparound, keyboard, touch handler, reduced motion and ClientRouter return.');
} finally {
  await browser.close();
}
