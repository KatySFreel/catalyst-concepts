// Keep the seasonal CTA after all packages on phones, including keyboard order.
(()=>{
 const section=document.querySelector('#new-year');
 const action=section?.querySelector('.ny-banner-side');
 const heading=section?.querySelector('.ny-heading');
 if(!action||!heading)return;
 const mobile=matchMedia('(max-width:700px)');
 const sync=()=>mobile.matches?section.append(action):heading.append(action);
 mobile.addEventListener('change',sync);sync();
})();

(()=>{
 const section=document.querySelector('#s5'),heading=section?.querySelector('.corporate-heading'),bottom=section?.querySelector('.corporate-bottom'),button=heading?.querySelector('button');
 if(!button||!bottom)return;
 const mobile=matchMedia('(max-width:700px)');
 const sync=()=>mobile.matches?bottom.append(button):heading.append(button);
 mobile.addEventListener('change',sync);sync();
})();
