/* Photo-only parallax: contact text and controls never move within the section. */
(() => {
  const scene = document.querySelector('#s10 .contact-scene');
  const photo = scene?.querySelector('.contact-scene-photo');
  if (!photo) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  let frame = 0;
  function render() {
    frame = 0;
    if (reduced.matches) {
      photo.style.removeProperty('--contact-photo-offset');
      return;
    }
    const rect = scene.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
    const travel = mobile.matches ? 24 : 48;
    photo.style.setProperty('--contact-photo-offset', `${((progress * 2 - 1) * travel).toFixed(2)}px`);
  }
  function request() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  reduced.addEventListener('change', request);
  photo.addEventListener('load', request, { once: true });
  request();
})();
