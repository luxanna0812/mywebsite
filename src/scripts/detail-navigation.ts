let disconnectDetail: (() => void) | undefined;

function setupDetail() {
  disconnectDetail?.();
  const detail = document.querySelector<HTMLElement>('.record-detail');
  if (!detail) return;

  const links = [...detail.querySelectorAll<HTMLAnchorElement>('.track-index a')];
  const sections = [...detail.querySelectorAll<HTMLElement>('section[id]')];
  const visible = new Set<Element>();
  const indexObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    const current = sections.find(section => visible.has(section));
    if (!current) return;
    for (const link of links) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-5% 0px -45% 0px', threshold: 0 });
  sections.forEach(section => indexObserver.observe(section));

  const timeline = detail.querySelector<HTMLElement>('.timeline');
  let revealObserver: IntersectionObserver | undefined;
  if (timeline && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timeline.classList.add('timeline-motion');
    revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    timeline.querySelectorAll('.timeline-item').forEach(item => revealObserver!.observe(item));
  }
  disconnectDetail = () => {
    indexObserver.disconnect();
    revealObserver?.disconnect();
  };
}

setupDetail();
document.addEventListener('astro:page-load', setupDetail);
document.addEventListener('astro:before-swap', () => disconnectDetail?.());
