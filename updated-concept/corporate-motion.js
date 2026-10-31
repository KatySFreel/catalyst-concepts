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
      const progress = reduced.matches ? 1 : clamp((innerHeight * .94 - cardTop) / (innerHeight * .56));
      const remaining = 1 - progress;
      const turn = (mobile ? [-1.4, 1.4, -1.2] : [-2.5, 2, -1.5])[i];
      card.style.setProperty('--card-x', `${mobile ? 0 : [52, 0, -52][i] * remaining}px`);
      card.style.setProperty('--card-y', `${(mobile ? 35 : 65 + i * 16) * remaining}px`);
      card.style.setProperty('--card-turn', `${turn + (mobile ? [-2, 2, 2] : [-8, 5, 8])[i] * remaining}deg`);
    });
  }
  const request = () => { if (!pending) { pending = true; requestAnimationFrame(render); } };
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', request);
  reduced.addEventListener('change', request);
  render();
})();
