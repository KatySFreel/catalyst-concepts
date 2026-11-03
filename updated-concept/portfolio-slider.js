(() => {
 const root=document.querySelector('#s6'),track=root?.querySelector('.trust-cases');
 if(!track)return;
 const cards=[...track.querySelectorAll('article')],prev=root.querySelector('.portfolio-prev'),next=root.querySelector('.portfolio-next');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width:700px)'),duration=5500;
 let activeIndex=0,elapsed=0,lastFrame=0,raf=0,visible=false,interacting=false,scrolling=false,settleTimer;
 const pagination=document.createElement('nav');pagination.className='portfolio-pagination';pagination.setAttribute('aria-label','Выбрать проект');
 const dots=cards.map((card,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Проект '+(i+1)+': '+card.querySelector('.case-client-logo').alt);button.setAttribute('aria-controls',track.id);button.innerHTML='<span aria-hidden="true"></span>';button.onclick=()=>{const step=cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;track.scrollTo({left:i*step,behavior:reduced.matches?'instant':'smooth'})};pagination.append(button);return button});
 track.after(pagination);
 function update(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;const step=cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;const active=Math.min(cards.length-1,Math.round(track.scrollLeft/step));if(activeIndex!==active){activeIndex=active;elapsed=0;pagination.style.setProperty('--slide-progress','0')}dots.forEach((dot,i)=>{if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});}

 function move(direction){const step=cards[1] ? cards[1].offsetLeft-cards[0].offsetLeft : track.clientWidth;const current=Math.round(track.scrollLeft/step);const target=Math.max(0,Math.min(cards.length-1,current+direction));track.scrollTo({left:target*step,behavior:reduced.matches?'instant':'smooth'})}
 prev.onclick=()=>move(-1);next.onclick=()=>move(1);
 track.addEventListener('scroll',()=>{scrolling=true;elapsed=0;update();clearTimeout(settleTimer);settleTimer=setTimeout(()=>{scrolling=false;syncPlayback()},180)},{passive:true});new ResizeObserver(update).observe(track);
 track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
 function canPlay(){return mobile.matches&&!reduced.matches&&visible&&!document.hidden&&!interacting&&!scrolling}
 function tick(now){
  raf=0;if(!canPlay()){lastFrame=0;return}
  if(lastFrame)elapsed+=Math.min(now-lastFrame,100);lastFrame=now;
  pagination.style.setProperty('--slide-progress',String(Math.min(elapsed/duration,1)));
  if(elapsed>=duration){elapsed=0;lastFrame=0;const target=(activeIndex+1)%cards.length;const step=cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;scrolling=true;track.scrollTo({left:target*step,behavior:target===0?'instant':'smooth'});return}
  raf=requestAnimationFrame(tick);
 }
 function syncPlayback(){const bounds=track.getBoundingClientRect();visible=bounds.bottom>100&&bounds.top<innerHeight-100;if(!canPlay()){cancelAnimationFrame(raf);raf=0;lastFrame=0}else if(!raf){lastFrame=0;raf=requestAnimationFrame(tick)}}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncPlayback()},{threshold:.25}).observe(track);
 root.addEventListener('pointerdown',()=>{interacting=true;syncPlayback()});
 window.addEventListener('pointerup',()=>{if(interacting){interacting=false;elapsed=0;syncPlayback()}});
 window.addEventListener('pointercancel',()=>{interacting=false;syncPlayback()});
 root.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible')){interacting=true;syncPlayback()}});
 root.addEventListener('focusout',()=>{interacting=false;syncPlayback()});
 window.addEventListener('scroll',syncPlayback,{passive:true});window.addEventListener('resize',syncPlayback);
 document.addEventListener('visibilitychange',syncPlayback);
 mobile.addEventListener('change',syncPlayback);reduced.addEventListener('change',syncPlayback);
 update();syncPlayback();
})();
