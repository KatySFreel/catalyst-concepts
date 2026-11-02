(() => {
 const fan=document.querySelector('[data-team-fan]');
 if(!fan) return;
 const cards=[...fan.querySelectorAll('.team-fan-card')];
 const enabled=matchMedia('(min-width:901px) and (prefers-reduced-motion:no-preference)');
 let frame=0,visible=true;
 function render(){
  frame=0;
  if(!enabled.matches || !visible)return;
  const rect=fan.getBoundingClientRect();
  const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)));
  const width=cards[0].offsetWidth;
  const radius=width*2.5;
  // Each photograph passes through the centre; reverse scrolling retraces the arc.
  const sweep=30-progress*60;
  cards.forEach((card,i)=>{
   const angle=(i-1.5)*20+sweep;
   const rad=angle*Math.PI/180;
   const x=Math.sin(rad)*radius;
   const y=(1-Math.cos(rad))*radius;
   card.style.transform=`translateX(-50%) translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${angle}deg)`;
  });
 }
 function request(){if(!frame && enabled.matches)frame=requestAnimationFrame(render)}
 function sync(){
  fan.classList.toggle('is-animated',enabled.matches);
  if(!enabled.matches)cards.forEach(card=>card.style.removeProperty('transform'));
  request();
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request()},{rootMargin:'200px'});
 observer.observe(fan);
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);
 enabled.addEventListener('change',sync);sync();
})();
