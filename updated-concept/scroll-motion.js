/* One entrance per element. Keep layout, paper rotations and hover transforms intact. */
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const active = new Map();
  const selector = [
    '.clients > *', '.ny-heading', '.ny-grid > article',
    '.catalog-heading', '.catalog-filters', '.catalog-grid > *', '.catalog-help',
    '.download-copy', '.download-preview',
    '.team-included > h2', '.team-included-columns > *',
    '.corporate-heading', '.corporate-bottom',
    '.continuation-inner > h2', '.numbers-composition > *',
    '.director-identity', '.director-letter > p', '.director-contact',
    '.director-event', '.trust-cases > *',
    '#s6 .buttons', '.rating-grid > *', '#recommend .buttons', '.trust-awards',
    '.seo-layout > *', '.faq-columns > div > details', '#s9 .chips',
    '.contact-proto-grid > *', '.contact-proto-social',
    '.footer-proto-cta', '.footer-proto-nav > *', '.footer-proto-bottom'
  ].join(',');

  function finish(el) {
    active.get(el)?.cancel();
    active.delete(el);
  }

  function play(el, frames, duration, delay = 0) {
    const animation = el.animate(frames, {
      duration, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards'
    });
    active.set(el, animation);
    animation.finished.then(() => finish(el), () => active.delete(el));
  }

  function entrance(el, index) {
    const style = getComputedStyle(el);
    const mobile = innerWidth <= 700;
    const distance = mobile ? 24 : 48;
    const delay = Math.min(index, 3) * (mobile ? 65 : 105);
    const siblings = [...el.parentElement.children];
    const direction = siblings.indexOf(el) % 2 ? 1 : -1;
    const end = { opacity: style.opacity, translate: style.translate,
      rotate: style.rotate, scale: style.scale };
    const canMove = style.translate === 'none' || style.translate === '0px';
    const paper = el.matches('.ny-folder, .catalog-grid > *, .trust-cases > *, .numbers-composition > *, .download-preview');
    const photo = el.matches('.director-event');
    const heading = el.matches('h2, .catalog-heading, .corporate-heading, .ny-heading');

    if (paper && canMove) {
      // Lay down paper with a small counter-turn, preserving its authored transform.
      const turn = direction * (mobile ? 2.5 : 5);
      play(el, [
        { opacity: 0, translate: `${direction * (mobile ? 5 : 14)}px ${distance}px`,
          rotate: `${turn}deg`, scale: '.94' },
        { opacity: style.opacity, translate: '0 -3px', rotate: `${-turn * .12}deg`,
          scale: '1.006', offset: .76 },
        end
      ], mobile ? 800 : 1050, delay);
    } else if (photo) {
      // The photo opens like a print; its image settles inside the fixed frame.
      play(el, [
        { opacity: 0, clipPath: 'inset(12% 0 88% 0 round 12px)' },
        { opacity: style.opacity, clipPath: 'inset(0% 0 0% 0 round 12px)' }
      ], mobile ? 900 : 1200, delay);
      const img = el.querySelector('img');
      if (img) play(img, [{ scale: '1.12' }, { scale: getComputedStyle(img).scale }], 1400, delay);
    } else if (heading && canMove) {
      play(el, [
        { opacity: 0, translate: `0 ${distance * .7}px`, clipPath: 'inset(0 0 100% 0)' },
        { ...end, clipPath: 'inset(-10% -5% -10% -5%)' }
      ], mobile ? 700 : 900, delay);
    } else {
      // Keep long copy quiet; the director's letter unfolds paragraph by paragraph.
      const letter = el.matches('.director-letter > p');
      const from = { opacity: 0 };
      if (canMove) from.translate = `${letter && !mobile ? -18 : 0}px ${letter ? 12 : distance * .6}px`;
      play(el, [from, end], mobile ? 650 : 850, delay);
    }

    // A second, slower layer makes the case folders feel like physical objects.
    if (paper) {
      const img = el.querySelector('.case-photo img, .ny-photo img, .number-origin-photo img');
      if (img) play(img, [{ scale: '1.09' }, { scale: getComputedStyle(img).scale }], 1300, delay + 80);
    }
  }

  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
        a.boundingClientRect.left - b.boundingClientRect.left);
    entering.forEach((entry, index) => {
      const el = entry.target;
      observer.unobserve(el);
      // Anchor jumps and keyboard navigation must expose content immediately.
      if (reduced.matches || el.contains(document.activeElement) ||
          entry.boundingClientRect.bottom <= 0) return;
      entrance(el, index);
    });
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

  function register() {
    document.querySelectorAll(selector).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      // Never animate nested groups twice or replay content above a deep link.
      if (el.parentElement?.closest(selector) || el.getBoundingClientRect().bottom < 0) return;
      if (!reduced.matches) observer.observe(el);
    });
  }

  register();
  // Program filtering replaces cards; new results get the same entrance.
  const catalog = document.querySelector('.catalog-grid');
  if (catalog) new MutationObserver(register).observe(catalog, { childList: true });
  document.addEventListener('focusin', event => {
    for (const el of active.keys()) if (el.contains(event.target)) finish(el);
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    for (const el of active.keys()) finish(el);
  });
  // Printing should never capture an intermediate transparent frame.
  addEventListener('beforeprint', () => {
    observer.disconnect();
    for (const el of active.keys()) finish(el);
  });
})();
