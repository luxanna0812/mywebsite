const INTERVAL = 5500;
const instances = new Map<HTMLElement, () => void>();
let installed = false;
const lifecycle = new AbortController();

function mount(root: HTMLElement) {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-photo-slide]')];
  const thumbnails = [...root.querySelectorAll<HTMLButtonElement>('[data-photo-thumbnail]')];
  const stage = root.querySelector<HTMLElement>('[data-photo-stage]')!;
  const strip = root.querySelector<HTMLElement>('.photo-filmstrip')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-photo-toggle]')!;
  const toggleLabel = root.querySelector<HTMLElement>('[data-photo-toggle-label]')!;
  const title = root.querySelector<HTMLElement>('[data-photo-title]')!;
  const note = root.querySelector<HTMLElement>('[data-photo-note]')!;
  const numbers = root.querySelectorAll<HTMLElement>('[data-photo-number]');
  const status = root.querySelector<HTMLElement>('[data-photo-status]')!;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const options = { signal: events.signal };
  let current = 0;
  let userPaused = motion.matches;
  let hovered = false;
  let visible = !('IntersectionObserver' in window);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pointer: { x: number; y: number; id: number } | undefined;

  function stopTimer() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    stopTimer();
    root.dataset.paused = String(userPaused);
    toggleLabel.textContent = userPaused ? '播放轮播' : '暂停轮播';
    toggle.setAttribute('aria-label', userPaused ? '开始自动轮播照片' : '暂停照片轮播');
    const running = !userPaused && !hovered && visible && !document.hidden;
    root.dataset.playing = String(running);
    if (running) timer = setTimeout(() => show(current + 1), INTERVAL);
  }

  function show(index: number, manual = false) {
    current = (index + slides.length) % slides.length;
    if (manual) userPaused = true;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.querySelector('img')?.setAttribute('loading', 'eager');
      if (active) thumbnails[slideIndex].setAttribute('aria-current', 'true');
      else thumbnails[slideIndex].removeAttribute('aria-current');
    });
    const activeSlide = slides[current];
    slides[(current + 1) % slides.length].querySelector('img')?.setAttribute('loading', 'eager');
    title.textContent = activeSlide.dataset.title ?? '';
    note.textContent = activeSlide.dataset.note ?? '';
    numbers.forEach(number => { number.textContent = String(current + 1).padStart(2, '0'); });
    if (manual) status.textContent = `第 ${current + 1} 张，共 ${slides.length} 张：${activeSlide.dataset.title}。${activeSlide.dataset.note}`;
    // Move only the contact sheet; never scroll the reader's page during autoplay.
    const thumbBounds = thumbnails[current].getBoundingClientRect();
    const stripBounds = strip.getBoundingClientRect();
    if (thumbBounds.left < stripBounds.left || thumbBounds.right > stripBounds.right) {
      strip.scrollTo({ left: strip.scrollLeft + thumbBounds.left - stripBounds.left - (strip.clientWidth - thumbBounds.width) / 2, behavior: motion.matches ? 'instant' : 'smooth' });
    }
    schedule();
  }

  root.querySelector('[data-photo-prev]')!.addEventListener('click', () => show(current - 1, true), options);
  root.querySelector('[data-photo-next]')!.addEventListener('click', () => show(current + 1, true), options);
  thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener('click', () => show(index, true), options));
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    schedule();
    status.textContent = userPaused ? '照片轮播已暂停。' : '已开启照片轮播；移开指针后将自动切换。';
  }, options);
  root.addEventListener('keydown', event => {
    let next: number;
    if (event.key === 'ArrowLeft') next = current - 1;
    else if (event.key === 'ArrowRight') next = current + 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = slides.length - 1;
    else return;
    event.preventDefault();
    show(next, true);
    if (event.target instanceof HTMLElement && event.target.matches('[data-photo-thumbnail]')) thumbnails[current].focus({ preventScroll: true });
  }, options);
  // A reader entering the gallery with the keyboard controls when playback resumes.
  root.addEventListener('focusin', event => {
    if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
    if (!(event.target instanceof HTMLElement) || !event.target.matches(':focus-visible')) return;
    userPaused = true;
    schedule();
  }, options);
  root.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    schedule();
  }, options);
  root.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = false;
    schedule();
  }, options);
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.pointerType === 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, options);
  stage.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = undefined;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.4) show(current + (dx < 0 ? 1 : -1), true);
  }, options);
  stage.addEventListener('pointercancel', () => { pointer = undefined; }, options);
  document.addEventListener('visibilitychange', schedule, options);
  motion.addEventListener('change', () => {
    if (motion.matches) userPaused = true;
    schedule();
  }, options);
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, { threshold: .12 }) : undefined;
  observer?.observe(stage);
  schedule();

  return () => { stopTimer(); observer?.disconnect(); events.abort(); };
}

function cleanup() {
  instances.forEach(dispose => dispose());
  instances.clear();
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-photo-carousel]').forEach(root => {
    if (!instances.has(root)) instances.set(root, mount(root));
  });
}

export function installPhotoCarousels() {
  if (installed) return;
  installed = true;
  document.addEventListener('astro:page-load', init, { signal: lifecycle.signal });
  document.addEventListener('astro:before-swap', cleanup, { signal: lifecycle.signal });
  init();
}

if (import.meta.hot) import.meta.hot.dispose(() => { cleanup(); lifecycle.abort(); });
