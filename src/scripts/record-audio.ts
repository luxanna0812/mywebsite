import { records, type RecordEntry } from '../data/records';

// This single Audio object survives ClientRouter DOM swaps, keeping the playhead intact.
const audio = new Audio();
audio.preload = 'none';
audio.volume = .55;
audio.loop = false;
let selected: RecordEntry | undefined;
let message = '';
let installed = false;
let request = 0;
const listeners = new AbortController();
try { audio.muted = localStorage.getItem('library-muted') === 'true'; } catch { /* Storage may be unavailable. */ }

function recordFor(href: string) {
  const path = new URL(href, location.href).pathname.replace(/\/$/, '');
  return records.find(record => record.href.replace(/\/$/, '') === path);
}
function update() {
  document.querySelectorAll<HTMLElement>('[data-audio-controls]').forEach(panel => {
    panel.hidden = !selected;
    panel.querySelector('[data-audio-title]')!.textContent = selected ? `${selected.number} / ${selected.title}` : '';
    panel.querySelector('[data-audio-status]')!.textContent = message;
    panel.querySelector('[data-audio-toggle]')!.textContent = audio.ended ? '重新播放' : audio.paused ? '播放音乐' : '暂停音乐';
    const mute = panel.querySelector('[data-audio-mute]')!;
    mute.textContent = audio.muted ? '取消静音' : '静音'; mute.setAttribute('aria-pressed', String(audio.muted));
  });
}
function select(record: RecordEntry) {
  request++;
  audio.pause(); selected = record; message = '';
  audio.src = record.audio;
}
function play() {
  const version = ++request;
  message = '正在加载'; update();
  // Called synchronously from a click to retain mobile browser user activation.
  void audio.play().then(() => { if (version === request) { message = ''; update(); } }).catch(() => {
    if (version === request) { message = '未能播放，请点击重试'; update(); }
  });
}
export function playRecord(href: string) {
  const record = recordFor(href);
  if (!record) return;
  select(record); play();
}
function syncPage() {
  const record = recordFor(location.href);
  if (record && record.slug !== selected?.slug) select(record);
  if (!record) { request++; audio.pause(); selected = undefined; message = ''; }
  update();
}
export function installAudio() {
  if (installed) return;
  installed = true;
  const options = { signal: listeners.signal };
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-audio-toggle]')) {
      if (audio.paused) play(); else { request++; audio.pause(); message = ''; update(); }
    }
    if (target.closest('[data-audio-mute]')) {
      audio.muted = !audio.muted;
      try { localStorage.setItem('library-muted', String(audio.muted)); } catch { /* Optional persistence. */ }
      update();
    }
  }, options);
  for (const event of ['play', 'pause', 'volumechange']) audio.addEventListener(event, update, options);
  audio.addEventListener('ended', () => { message = '播放结束'; update(); }, options);
  audio.addEventListener('error', () => { message = '音频暂不可用，可继续浏览'; update(); }, options);
  document.addEventListener('astro:page-load', syncPage, options);
  window.addEventListener('pagehide', () => { request++; audio.pause(); }, options);
  syncPage();
}
if (import.meta.hot) import.meta.hot.dispose(() => { listeners.abort(); audio.pause(); audio.removeAttribute('src'); audio.load(); });
