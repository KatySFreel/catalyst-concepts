(()=>{
 const body=document.querySelector('.hero-body');
 const copy=body?.querySelector('.hero-copy');
 const actions=copy?.querySelector('.hero-actions');
 const folder=body?.querySelector('.folder-area');
 if(!actions||!folder)return;
 const mobile=matchMedia('(max-width:600px)');
 function arrange(){if(mobile.matches)folder.after(actions);else copy.append(actions)}
 mobile.addEventListener('change',arrange);arrange();
})();
