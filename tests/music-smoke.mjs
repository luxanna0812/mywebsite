import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(...args) { super(...args); window.testAudio = this; }
    };
  });
  await page.goto('http://localhost:4321/');
  await page.locator('.record-link').first().click();
  await page.locator('.listening[open]').waitFor();
  await page.waitForFunction(() => window.testAudio && !window.testAudio.paused);
  await page.locator('.listening-skip').click();
  await page.waitForURL('**/library/profile/');
  assert.equal(await page.evaluate(() => window.testAudio.src.endsWith('/audio/1.m4a')), true);
  assert.equal(await page.evaluate(() => window.testAudio.paused), false);
  await page.locator('[data-audio-toggle]').click();
  assert.equal(await page.evaluate(() => window.testAudio.paused), true);
  await page.locator('[data-audio-toggle]').click();
  await page.waitForFunction(() => !window.testAudio.paused);
  await page.locator('[data-audio-mute]').click();
  assert.equal(await page.evaluate(() => window.testAudio.muted), true);
  await page.locator('.back-link').first().click();
  await page.waitForURL('http://localhost:4321/');
  assert.equal(await page.evaluate(() => window.testAudio.paused), true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.record-link').nth(3).click();
  await page.waitForURL('**/library/strategy/');
  await page.waitForFunction(() => !window.testAudio.paused);
  assert.equal(await page.evaluate(() => window.testAudio.src.endsWith('/audio/4.m4a')), true);
  await page.waitForFunction(() => window.testAudio.ended, undefined, { timeout: 20000 });
  assert.equal(await page.evaluate(() => window.testAudio.loop), false);
  assert.deepEqual(errors, []);
  console.log('PASS: home, transition skip, continuous audio, pause/resume, mute, return, reduced motion, mobile, track 4, natural end.');
} finally { await browser.close(); }
