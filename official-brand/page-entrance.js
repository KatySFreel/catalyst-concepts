/* One entrance per page load; remove its class before slideshow transitions. */
(()=>{
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches)return;
 root.classList.add('page-enter');
 const finish=()=>root.classList.remove('page-enter');
 setTimeout(finish,1500);
 reduced.addEventListener('change',finish,{once:true});
 // A touch interaction can advance the slide before the entrance has finished.
 document.querySelector('.collage-v2')?.addEventListener('pointerdown',finish,{once:true});
})();
