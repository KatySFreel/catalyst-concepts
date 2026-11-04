(() => {
 const section=document.querySelector('#new-year'),track=section?.querySelector('.ny-grid');
 if(!track)return;
 const cards=[...track.querySelectorAll('.ny-folder')];
 const mobile=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const loop=createLoopCarousel(track,cards,()=>mobile.matches);
 track.id='newyear-packages';
 const pagination=document.createElement('nav');pagination.className='portfolio-pagination';pagination.setAttribute('aria-label','Выбрать новогодний пакет');
 const step=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;
 const move=index=>loop.move(((index%cards.length)+cards.length)%cards.length*step(),reduced.matches?'instant':'smooth');
 const dots=cards.map((card,i)=>{
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',card.querySelector('h3').textContent);button.setAttribute('aria-controls',track.id);button.innerHTML='<span aria-hidden="true"></span>';button.onclick=()=>move(i);pagination.append(button);return button;
 });
 track.after(pagination);
 function update(){const active=Math.max(0,Math.min(cards.length-1,Math.round(loop.position()/step())));dots.forEach((dot,i)=>i===active?dot.setAttribute('aria-current','true'):dot.removeAttribute('aria-current'));}
 function resize(){
  loop.refresh();
  section.style.setProperty('--ny-gutter',Math.max(0,section.getBoundingClientRect().left)+'px');
  if(mobile.matches){track.tabIndex=0;track.setAttribute('aria-label','Новогодние пакеты');}
  else{track.removeAttribute('tabindex');track.removeAttribute('aria-label');track.scrollLeft=0;}
  update();
 }
 track.addEventListener('scroll',update,{passive:true});
 track.addEventListener('keydown',event=>{if(!mobile.matches||event.target!==track||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();move(Math.round(loop.position()/step())+(event.key==='ArrowRight'?1:-1));});
 new ResizeObserver(resize).observe(section);mobile.addEventListener('change',resize);resize();
})();
