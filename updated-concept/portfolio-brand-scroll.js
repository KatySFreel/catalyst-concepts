(() => {
 const wall=document.querySelector('.portfolio-brand-wall');if(!wall)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let frame=0;
 function update(){frame=0;if(reduced.matches){wall.style.setProperty('--brand-scroll','0px');return;}const r=wall.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/(innerHeight/2+r.height/2)));wall.style.setProperty('--brand-scroll',(progress*60).toFixed(2)+'px');}
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);update();
})();
