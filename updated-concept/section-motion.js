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

// Hold the quotation while its event photographs pass over it.
(()=>{
 const section=document.querySelector('#s7');
 const panel=section?.querySelector('.continuation-inner');
 const photos=[...(section?.querySelectorAll('.director-edge-photo')||[])];
 if(!panel||!photos.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width:701px)');
 // Release the scene when the last pair settles; keep that pair beside the quote.
 const timings=[
  {start:.02,duration:.24,end:.40},
  {start:.04,duration:.26,end:.46},
  {start:.08,duration:.22,end:.02},
  {start:.16,duration:.18,end:.58}
 ];
 const sceneEnd=Math.max(...timings.map(t=>t.start+t.duration));
 let frame=0, distance=0, enabled=false;
 function render(){
  frame=0;if(!enabled)return;
  const progress=Math.max(0,Math.min(1,(100-section.getBoundingClientRect().top)/distance))*sceneEnd;
  const height=panel.offsetHeight;
  // The first pair is already beside the quotation on entry.
  photos.forEach((photo,i)=>{
   const timing=timings[i%timings.length];
   const p=Math.max(0,Math.min(1,(progress-timing.start)/timing.duration));
   const eased=i<2?p:1-Math.pow(1-p,2);
   const startY=i<2 ? height*timing.end : height+photo.offsetHeight*.25;
   const endY=i<2 ? -photo.offsetHeight*1.5-100 : Math.min(height-photo.offsetHeight,height*timing.end);
   photo.style.translate=`0 ${(startY+(endY-startY)*eased).toFixed(2)}px`;
   photo.style.opacity=(i<2||p>0)&&(i>=2||p<1)?'1':'0';
  });
 }
 function request(){if(!frame)frame=requestAnimationFrame(render);}
 function setup(){
  section.classList.remove('director-scroll-scene');
  section.style.removeProperty('--director-scene-height');
  photos.forEach(photo=>{photo.style.removeProperty('translate');photo.style.removeProperty('opacity')});
  enabled=desktop.matches&&!reduced.matches&&panel.offsetHeight<innerHeight-124;
  if(enabled){
   section.classList.add('director-scroll-scene');
   distance=Math.round(innerHeight*3*sceneEnd);
   section.style.setProperty('--director-scene-height',(panel.offsetHeight+distance)+'px');
  }
  request();
 }
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',setup);
 reduced.addEventListener('change',setup);desktop.addEventListener('change',setup);
 document.fonts.ready.then(setup);setup();
})();
