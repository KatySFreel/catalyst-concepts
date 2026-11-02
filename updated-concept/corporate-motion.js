(() => {
  const grid = document.querySelector('#s5 .corporate-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('article')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  const clamp = n => Math.max(0, Math.min(1, n));
  function render() {
    pending = false;
    const mobile = innerWidth <= 700;
    const top = grid.getBoundingClientRect().top;
    cards.forEach((card, i) => {
      // Layout offsets stay independent of the animated transforms.
      const cardTop = top + (mobile ? card.offsetTop - grid.offsetTop : 0);
      const progress = reduced.matches ? 1 : clamp((innerHeight * .85 - cardTop) / (innerHeight * .5));
      const remaining = 1 - progress * progress * (3 - 2 * progress);
      if (i === 0) grid.style.setProperty('--card-gap', `${20 * (1 - remaining)}px`);
      const turn = (mobile ? [-3.4, 3.4, 3] : [-10.5, 3.44, 7.5])[i] || 0;
      card.style.setProperty('--card-x', '0px');
      card.style.setProperty('--card-y', '0px');
      card.style.setProperty('--card-spread', String(remaining));
      card.style.setProperty('--card-turn', `${turn * remaining}deg`);
    });
  }
  const request = () => { if (!pending) { pending = true; requestAnimationFrame(render); } };
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', request);
  reduced.addEventListener('change', request);
  render();
})();
