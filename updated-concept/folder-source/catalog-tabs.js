(()=>{
 const catalog=document.querySelector('#catalog'),tabs=catalog?.querySelector('.catalog-filters'),nav=document.querySelector('.header-proto .primary-line');
 if(!catalog||!tabs||!nav)return;
 function measure(){const header=nav.closest('.header-proto');const top=parseFloat(getComputedStyle(header).getPropertyValue('--nav-top'))||10;catalog.style.setProperty('--catalog-tabs-top',(top+nav.getBoundingClientRect().height+8)+'px')}
 new ResizeObserver(measure).observe(nav);addEventListener('resize',measure);document.fonts.ready.then(measure);measure();
 tabs.addEventListener('click',e=>{
  const tab=e.target.closest('[data-catalog-filter]');if(!tab||!matchMedia('(max-width:600px)').matches)return;
  tabs.scrollTo({left:tab.offsetLeft-(tabs.clientWidth-tab.offsetWidth)/2,behavior:'instant'});
  // Wait for the category render and browser scroll anchoring to settle.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   measure();const grid=catalog.querySelector('#catalog-grid');
   const top=parseFloat(getComputedStyle(catalog).getPropertyValue('--catalog-tabs-top'))||86;
   const target=window.scrollY+grid.getBoundingClientRect().top-top-tabs.offsetHeight-18;
   window.scrollTo({top:Math.max(0,target),behavior:'instant'});
  }));
 });
})();
