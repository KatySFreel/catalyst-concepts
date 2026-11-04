(() => {
 const root=document.querySelector('#s6'),track=root?.querySelector('.trust-cases');
 if(!track)return;
 const cards=[...track.querySelectorAll('article')],prev=root.querySelector('.portfolio-prev'),next=root.querySelector('.portfolio-next');
 function expandTrack(){const bounds=track.parentElement.getBoundingClientRect();track.style.setProperty('--case-gutter-left',Math.max(0,bounds.left)+'px');track.style.setProperty('--case-gutter-right',Math.max(0,document.documentElement.clientWidth-bounds.right)+'px');}
 expandTrack();window.addEventListener('resize',expandTrack);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width:700px)'),duration=5500;
 let activeIndex=0,elapsed=0,lastFrame=0,raf=0,visible=false,interacting=false,hovered=false,scrolling=false,settleTimer;
 function pageStep(){return (cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth)*(mobile.matches?1:2);}
 const loop=createLoopCarousel(track,cards);
 const pagination=document.createElement('nav');pagination.className='portfolio-pagination';pagination.setAttribute('aria-label','Выбрать проект');
 const dots=cards.map((card,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Проект '+(i+1)+': '+(card.querySelector('.case-client-name')?.textContent||card.querySelector('.case-client-logo')?.alt||''));button.setAttribute('aria-controls',track.id);button.innerHTML='<span aria-hidden="true"></span>';button.onclick=()=>{const step=pageStep();loop.move(i*step,reduced.matches?'instant':'smooth')};pagination.append(button);return button});
 track.after(pagination);
 function lastIndex(){const step=pageStep();return Math.ceil(cards.length/(mobile.matches?1:2))-1;}
 function update(){prev.disabled=next.disabled=track.scrollWidth<=track.clientWidth+2;const step=pageStep();const active=Math.min(cards.length-1,Math.round(loop.position()/step)%(lastIndex()+1));if(activeIndex!==active){activeIndex=active;elapsed=0;pagination.style.setProperty('--slide-progress','0')}dots.forEach((dot,i)=>{dot.hidden=i>lastIndex();const first=i*(mobile.matches?1:2)+1;dot.setAttribute('aria-label',mobile.matches?'Проект '+first:'Проекты '+first+'–'+Math.min(first+1,cards.length));if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});}

 function move(direction){const step=pageStep();const current=Math.round(loop.position()/step)%(lastIndex()+1);const last=Math.ceil(cards.length/(mobile.matches?1:2))-1;const target=(current+direction+last+1)%(last+1);loop.move(target*step,reduced.matches?'instant':'smooth')}
 prev.onclick=()=>move(-1);next.onclick=()=>move(1);
 track.addEventListener('scroll',()=>{scrolling=true;elapsed=0;update();clearTimeout(settleTimer);settleTimer=setTimeout(()=>{scrolling=false;syncPlayback()},180)},{passive:true});new ResizeObserver(update).observe(track);
 track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
 function canPlay(){return !reduced.matches&&visible&&!document.hidden&&!interacting&&!hovered&&!scrolling&&lastIndex()>0}
 function tick(now){
  raf=0;if(!canPlay()){lastFrame=0;return}
  if(lastFrame)elapsed+=Math.min(now-lastFrame,100);lastFrame=now;
  pagination.style.setProperty('--slide-progress',String(Math.min(elapsed/duration,1)));
  if(elapsed>=duration){elapsed=0;lastFrame=0;const target=(activeIndex+1)%(lastIndex()+1);const step=pageStep();scrolling=true;loop.move(target*step,'smooth');return}
  raf=requestAnimationFrame(tick);
 }
 function syncPlayback(){const bounds=track.getBoundingClientRect();visible=bounds.bottom>100&&bounds.top<innerHeight-100;if(!canPlay()){cancelAnimationFrame(raf);raf=0;lastFrame=0}else if(!raf){lastFrame=0;raf=requestAnimationFrame(tick)}}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncPlayback()},{threshold:.25}).observe(track);
 root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;syncPlayback()}});
 root.addEventListener('pointerleave',()=>{hovered=false;syncPlayback()});
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

// Play only the case teasers currently visible in the carousel.
(()=>{
 const videos=[...document.querySelectorAll('#s6 .case-video')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const visible=new Set();
 function sync(){videos.forEach(video=>{
  if(visible.has(video)&&!document.hidden&&!reduced.matches){
   const source=video.querySelector('source');
   if(!source.src){source.src=source.dataset.src;video.load();}
   video.play().catch(()=>{});
  }else video.pause();
 });}
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>entry.isIntersecting?visible.add(entry.target):visible.delete(entry.target));sync();},{threshold:.5});
 videos.forEach(video=>observer.observe(video));
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
})();
