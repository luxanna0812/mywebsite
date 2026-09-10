import { gsap } from 'gsap';
import { navigate } from 'astro:transitions/client';
import { playRecord } from './record-audio';
import type { createStudio } from './headphone-scene';

export const TIMING = { duration: 3, timeout: 5500 };
let uninstall: (() => void) | undefined;
let lifecycle: AbortController | undefined;

function mount() {
  uninstall?.();
  const dialog = document.querySelector<HTMLDialogElement>('.listening');
  if (!dialog) return;
  const canvas = dialog.querySelector<HTMLCanvasElement>('canvas')!;
  const skip = dialog.querySelector<HTMLButtonElement>('button')!;
  const title = dialog.querySelector<HTMLElement>('h2')!;
  const progress = dialog.querySelector<HTMLElement>('.listening-progress span')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let studio: ReturnType<typeof createStudio> | undefined;
  let preparation: Promise<void> | undefined;
  let timeline: gsap.core.Timeline | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let target = '';
  let finished = false;
  let disposed = false;
  let failed = false;
  let previousFocus: HTMLElement | null = null;
  const previousOverflow = document.documentElement.style.overflow;

  function cleanup() {
    if (disposed) return; disposed = true;
    listeners.abort(); cancelAnimationFrame(frame); clearTimeout(timer); timeline?.kill();
    studio?.dispose(); studio = undefined;
    dialog!.close(); document.documentElement.style.overflow = previousOverflow;
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }
  // Every completion path uses this guard, including resource and GPU failures.
  function finish() {
    if (finished || !target) return;
    finished = true;
    const href = target;
    cleanup();
    void navigate(href).catch(() => window.location.assign(href));
  }
  function prepare() {
    if (reduced.matches || disposed || failed) return Promise.resolve();
    return preparation ??= import('./headphone-scene').then(({ createStudio }) => {
      if (!disposed) studio = createStudio(canvas);
    }).catch(() => { failed = true; finish(); });
  }
  function play() {
    if (disposed || finished) return;
    if (!studio || failed) { finish(); return; }
    const pose = studio.pose;
    gsap.set(canvas, { opacity: 0 }); gsap.set(progress, { scaleX: 0 });
    timeline = gsap.timeline({ onComplete: finish, onUpdate: () => {
      try { studio?.render(); } catch { finish(); }
    } });
    timeline.fromTo(dialog, { opacity: .65 }, { opacity: 1, duration: .25 }, 0)
      .to(canvas, { opacity: 1, duration: .30 }, 0)
      .to(pose, { lift: 0, duration: .35, ease: 'power2.out' }, 0)
      .to(pose, { pull: 1, duration: 1.10, ease: 'power2.inOut' }, 0)
      .to(pose, { turn: -.03, duration: 1.40, ease: 'sine.inOut' }, .10)
      .to(pose, { left: .16, duration: .49, ease: 'sine.inOut' }, 1.10)
      .to(pose, { right: .16, duration: .49, ease: 'sine.inOut' }, 1.16)
      .to(pose, { approach: .045, duration: .35, ease: 'sine.inOut' }, 1.65)
      .to(canvas, { opacity: 0, duration: .35 }, 1.65)
      .to(progress, { scaleX: 1, duration: 2, ease: 'none' }, 0);
    timeline.timeScale(2 / TIMING.duration);
  }
  document.querySelectorAll<HTMLAnchorElement>('.record-link').forEach(link => {
    link.addEventListener('pointerenter', () => { void prepare(); }, options);
    link.addEventListener('focus', () => { void prepare(); }, options);
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
      event.preventDefault();
      if (target) return;
      target = link.href;
      playRecord(target);
      if (reduced.matches || failed) { finish(); return; }
      timer = setTimeout(finish, TIMING.timeout);
      previousFocus = document.activeElement as HTMLElement;
      title.textContent = `${link.querySelector('.record-number')?.textContent} / ${link.querySelector('h2')?.textContent}`;
      try { dialog.showModal(); skip.focus({ preventScroll: true }); document.documentElement.style.overflow = 'hidden'; }
      catch { finish(); return; }
      // Paint the dialog and skip control before any first-use GPU work.
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { void prepare().then(play); }); });
    }, options);
  });
  skip.addEventListener('click', finish, options);
  dialog.addEventListener('cancel', event => { event.preventDefault(); finish(); }, options);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); failed = true; finish(); if (!target) cleanup(); }, options);
  reduced.addEventListener('change', () => { if (reduced.matches) { if (target) finish(); else { studio?.dispose(); studio = undefined; preparation = undefined; } } }, options);
  window.addEventListener('resize', () => { if (target) { try { studio?.render(); } catch { finish(); } } }, options);
  uninstall = cleanup;
  // Prepare after the initial page paint without starting an ongoing render loop.
  frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { void prepare(); }); });
}

export function installListeningTransition() {
  lifecycle?.abort();
  lifecycle = new AbortController();
  const options = { signal: lifecycle.signal };
  mount();
  document.addEventListener('astro:page-load', mount, options);
  document.addEventListener('astro:before-swap', () => uninstall?.(), options);
  window.addEventListener('pagehide', () => uninstall?.(), options);
  window.addEventListener('pageshow', event => { if (event.persisted) mount(); }, options);
}

if (import.meta.hot) import.meta.hot.dispose(() => { lifecycle?.abort(); uninstall?.(); });
