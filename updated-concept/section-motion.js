/* Composition-specific scroll motion; content remains visible without JavaScript. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width:700px)');
  const groups = [];
  const add = (selector, anchorSelector, effect, index = 0) => {
    document.querySelectorAll(selector).forEach((element, i) => {
      const anchor = anchorSelector ? element.closest(anchorSelector) : element;
      if (anchor) groups.push({element, anchor, effect, index: i + index});
    });
  };
  // Portfolio has its own horizontal slider; keep card positions stable.
  add('#recommend .rating-grid > div', null, 'rating');
  add('#recommend .recommend-photo img', '.recommend-photo', 'photo');
  add('#recommend .awards-cup-sticker', '.trust-awards', 'sticker');
  add('#s7 .director-portrait-tile, #s7 .director-event-tile', '#s7', 'portrait');
  add('#s7 .director-quote-accent', null, 'accent');
  // Contact cards stay fixed within their section; only its photo has parallax.
  const visible = new Set();
  const offsets = new WeakMap();
  let frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  function render() {
    frame = 0;
    if (reduced.matches) return;
    const strength = mobile.matches ? .45 : 1;
    // Read layout first; write styles afterwards to avoid repeated layout work.
    const positions = new Map();
    visible.forEach(anchor => positions.set(anchor, anchor.getBoundingClientRect().top - (offsets.get(anchor) || 0)));
    groups.forEach(({element, anchor, effect, index}) => {
      if (!positions.has(anchor)) return;
      const delay = effect === 'card' && !mobile.matches ? (index % 2) * .07 : 0;
      const progress = clamp((innerHeight * (.94 - delay) - positions.get(anchor)) / (innerHeight * .55));
      const remaining = 1 - progress;
      let x = 0, y = 0;
      if (effect === 'card') y = 48 * remaining;
      if (effect === 'rating') y = 24 * remaining;
      if (effect === 'portrait') { x = (index ? 16 : -16) * remaining; y = (index ? 30 : 18) * remaining; }
      if (effect === 'sticker') { y = 28 * remaining; element.style.rotate = `${-10 * remaining * strength}deg`; }
      if (effect === 'photo') element.style.scale = String(1 + .055 * remaining * strength);
      if (effect === 'accent') element.style.setProperty('--accent-reveal', `${(1 - progress) * 100}%`);
      if (x || y || element.style.translate) element.style.translate = `${x * strength}px ${y * strength}px`;
      offsets.set(element, y * strength);
    });
  }
  function request() { if (!frame && !reduced.matches) frame = requestAnimationFrame(render); }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    request();
  }, {rootMargin:'120px 0px'});
  new Set(groups.map(item => item.anchor)).forEach(anchor => observer.observe(anchor));
  function preference() {
    groups.forEach(({element}) => {
      element.classList.toggle('section-motion-enabled', !reduced.matches);
      if (reduced.matches) { offsets.delete(element); ['translate', 'rotate', 'scale', '--accent-reveal'].forEach(prop => element.style.removeProperty(prop)); }
    });
    request();
  }
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', request);
  reduced.addEventListener('change', preference);
  preference();
})();

// Subtle scroll parallax for the two desktop event photographs.
(()=>{
 const section=document.querySelector('#s7');const photos=section?.querySelectorAll('.director-edge-photo');
 if(!photos?.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:701px)');let frame=0;
 function render(){frame=0;const enabled=desktop.matches&&!reduced.matches;const rect=section.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-rect.top-rect.height/2)/innerHeight));photos.forEach((photo,i)=>{photo.style.translate=enabled?'0 '+(progress*(i?-32:32)).toFixed(2)+'px':'none';});}
 function update(){if(!frame)frame=requestAnimationFrame(render);}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduced.addEventListener('change',update);desktop.addEventListener('change',update);update();
})();
