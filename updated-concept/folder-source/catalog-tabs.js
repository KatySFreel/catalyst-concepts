(()=>{
 const catalog=document.querySelector('#catalog'),tabs=catalog?.querySelector('.catalog-filters'),nav=document.querySelector('.header-proto .primary-line');
 if(!catalog||!tabs||!nav)return;
 const track=tabs.querySelector('.catalog-tab-track');
 if(track){
  const indicator=document.createElement('span');indicator.className='catalog-tab-indicator';indicator.setAttribute('aria-hidden','true');track.prepend(indicator);
  function placeIndicator(){const active=track.querySelector('[aria-pressed="true"]');if(!active)return;indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)';track.classList.add('has-indicator')}
  new MutationObserver(placeIndicator).observe(track,{subtree:true,attributes:true,attributeFilter:['aria-pressed']});
  new ResizeObserver(placeIndicator).observe(track);
  document.fonts.ready.then(()=>{placeIndicator();requestAnimationFrame(()=>track.classList.add('is-ready'))});
  placeIndicator();
 }
 function measure(){const header=nav.closest('.header-proto');const top=parseFloat(getComputedStyle(header).getPropertyValue('--nav-top'))||10;catalog.style.setProperty('--catalog-tabs-top',(top+nav.getBoundingClientRect().height+8)+'px')}
 new ResizeObserver(measure).observe(nav);addEventListener('resize',measure);document.fonts.ready.then(measure);measure();
 tabs.addEventListener('click',e=>{
  const tab=e.target.closest('[data-catalog-filter]');if(!tab||!matchMedia('(max-width:600px)').matches)return;
  tabs.scrollTo({left:tab.offsetLeft-(tabs.clientWidth-tab.offsetWidth)/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  // Wait for the category render and browser scroll anchoring to settle.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   measure();const grid=catalog.querySelector('#catalog-grid');
   const top=parseFloat(getComputedStyle(catalog).getPropertyValue('--catalog-tabs-top'))||86;
   const target=window.scrollY+grid.getBoundingClientRect().top-top-tabs.offsetHeight-18;
   window.scrollTo({top:Math.max(0,target),behavior:'instant'});
  }));
 });
})();
