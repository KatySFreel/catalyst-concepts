(()=>{
 const header=document.querySelector('.header-proto'),utility=header?.querySelector('.topline'),nav=header?.querySelector('.primary-line'),hero=document.querySelector('.hero');if(!header||!nav||!hero)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,threshold=0,heroStart=0,heroHeight=1;
 function measure(){
  const c=getComputedStyle(header),left=parseFloat(c.paddingLeft),right=parseFloat(c.paddingRight),top=parseFloat(c.paddingTop),bottom=parseFloat(c.paddingBottom),navTop=parseFloat(c.getPropertyValue('--nav-top'))||12;
  // Resolve width before reading height, including when a viewport crosses a breakpoint.
  header.style.setProperty('--nav-left',(header.getBoundingClientRect().left+left)+'px');header.style.setProperty('--nav-width',(header.clientWidth-left-right)+'px');
  const utilityHeight=utility.getBoundingClientRect().height;
  header.style.setProperty('--header-flow-height',(top+utilityHeight+nav.getBoundingClientRect().height+bottom)+'px');
  threshold=Math.max(0,header.offsetTop+top+utilityHeight-navTop);
  heroStart=hero.offsetTop;heroHeight=hero.offsetHeight;draw();
 }
 function draw(){raf=0;const y=document.body.dataset.menuScroll!==undefined?Number(document.body.dataset.menuScroll):window.scrollY;header.classList.toggle('is-docked',y>threshold);const progress=reduced.matches?0:Math.max(0,Math.min(1,y/Math.max(1,heroStart+heroHeight-innerHeight*.22)));const eased=progress*progress*(3-2*progress);hero.style.setProperty('--hero-inset',(eased*(innerWidth<=760?12:16)).toFixed(2)+'px');hero.style.setProperty('--hero-corner',(eased*(innerWidth<=760?24:36)).toFixed(2)+'px')}
 function update(){if(!raf)raf=requestAnimationFrame(draw)}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',draw);new ResizeObserver(measure).observe(nav);new ResizeObserver(measure).observe(hero);document.fonts?.ready.then(measure);measure();
})();
