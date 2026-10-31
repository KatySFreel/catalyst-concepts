(() => {
 const cards = document.querySelectorAll('#trust-numbers .trust-route, #trust-numbers .number-own');
 if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-drawing'); observer.unobserve(entry.target); } });
 }, {threshold: .35});
 cards.forEach(card => observer.observe(card));
})();
