/* Automatic hero photos with touch swiping; no visible slider controls. */
(()=>{
 const hero=document.querySelector('.hero'),img=hero?.querySelector('.hero-slide');if(!img)return;
 const surface=hero.querySelector('.collage-v2');
 const editingFirstSlide=false;
 const slides=[['hero-race.svg','Болид программы Формула-1'],['hero-city.svg','Город, построенный участниками программы Мегаполис'],['hero-tower.svg','Конструкция программы WOW Башня'],['hero-foodtruck.svg','Оформленный участниками фудтрак']];
 const events=[
  {title:'Формула-1',copy:'Строим свой болид и выходим на командный заезд.',photo:'formula-1.webp',caption:'Формула-1 / командный заезд'},
  {title:'Мегаполис',copy:'Строим город: от отдельных кварталов до общего проекта.',photo:'megapolis-action.webp',caption:'Мегаполис / строим вместе'},
  {title:'WOW Башня',copy:'Собираем масштабную башню с вращающимися мельницами.',photo:'wow-bashnya.webp',caption:'WOW Башня / большая общая цель'},
  {title:'Фестиваль Фудтраков',copy:'Создаём свой фудтрак и готовим угощения всей командой.',photo:'festival-fudtrakov.webp',caption:'Фудтраки / готовим вместе'}
 ];
 const eventCard=surface.querySelector('.event-caption'),polaroid=surface.querySelector('.event-polaroid');
 const slugs=['formula-1','gorodskaya-strojka','wow-bashnya','festival-fudtrakov'];
 const projectLinks=[eventCard,polaroid].map(card=>{const a=document.createElement('a');a.className='event-project-link';card.append(a);return a});
 function syncLinks(i){projectLinks.forEach(a=>{a.href='https://catalystrussia.ru/teambuilding/vse-programmy/'+slugs[i]+'/';a.setAttribute('aria-label','Подробнее о программе «'+events[i].title+'»')})}
 syncLinks(0);
 const contextImages=events.map(e=>{const image=new Image();image.src='business-assets--'+e.photo;return image});
 function syncEvent(i){syncLinks(i);const e=events[i];eventCard.querySelector('h3').textContent=e.title;eventCard.querySelector('p').textContent=e.copy;polaroid.querySelector('img').src=contextImages[i].src;polaroid.querySelector('img').alt=e.caption;polaroid.querySelector('figcaption').textContent=e.caption;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer,swap,visible=true,request=0,touch=null,paused=false,hovered=false,focused=false;
 const images=slides.map(s=>{const image=new Image();image.src='business-assets--'+s[0];return image});
 surface.dataset.slide='0';
 hero.classList.add('hero-motion-ready');
 surface.setAttribute('role','region');
 surface.setAttribute('aria-roledescription','карусель');
 surface.setAttribute('aria-label','Программы Каталиста');
 const controls=document.createElement('div');controls.className='hero-slider-controls';
 const dots=slides.map((slide,i)=>{
  const button=document.createElement('button');button.type='button';
  button.className='hero-slider-dot';button.setAttribute('aria-label',events[i].title);
  button.setAttribute('aria-pressed',String(i===0));
  button.addEventListener('click',()=>{start();show(i)});controls.append(button);return button;
 });
 const pause=document.createElement('button');pause.type='button';pause.className='hero-slider-pause';
 function syncPause(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Включить смену слайдов':'Приостановить смену слайдов')}
 pause.addEventListener('click',()=>{paused=!paused;syncPause();start()});syncPause();controls.append(pause);surface.append(controls);
 surface.addEventListener('mouseenter',()=>{hovered=true;start()});
 surface.addEventListener('mouseleave',()=>{hovered=false;start()});
 surface.addEventListener('focusin',()=>{focused=true;start()});
 surface.addEventListener('focusout',e=>{if(!surface.contains(e.relatedTarget)){focused=false;start()}});

 function stop(){clearInterval(timer);clearTimeout(swap);request++;surface.classList.remove('slide-changing')}
 async function show(next){
  if(editingFirstSlide)return;
  const token=++request;clearTimeout(swap);
  try{await Promise.all([images[next].decode(),contextImages[next].decode()])}catch{return}
  if(token!==request)return;
  const apply=()=>{if(token!==request)return;index=next;img.src=images[index].src;img.alt=slides[index][1];surface.dataset.slide=String(index);syncEvent(index);dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));surface.classList.remove('slide-changing')};
  if(reduced.matches){apply();return}surface.classList.add('slide-changing');swap=setTimeout(apply,240);
 }
 function start(){stop();if(editingFirstSlide||reduced.matches||document.hidden||!visible||touch||paused||hovered||focused)return;timer=setInterval(()=>show((index+1)%slides.length),5500)}
 surface.addEventListener('pointerdown',e=>{if(editingFirstSlide||e.pointerType==='mouse'||e.target.closest('button,a'))return;touch={x:e.clientX,y:e.clientY,id:e.pointerId};surface.setPointerCapture(e.pointerId);stop()});
 surface.addEventListener('pointerup',e=>{if(!touch||touch.id!==e.pointerId)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;start();if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)show((index+(dx<0?1:-1)+slides.length)%slides.length)});
 surface.addEventListener('pointercancel',()=>{touch=null;start()});
 document.addEventListener('visibilitychange',start);reduced.addEventListener('change',()=>{reset();start()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.05}).observe(hero);
 const items=[...hero.querySelectorAll('.seal,.hero-sticker,.hero-ink,.team-doodle,.spark,.mini-folder svg')];let frame=0,x=0,y=0;
 function draw(){frame=0;items.forEach((el,i)=>{const factor=i%2?-.65:1;el.style.setProperty('--motion-x',(x*factor).toFixed(2)+'px');el.style.setProperty('--motion-y',(y*factor).toFixed(2)+'px')})}
 function reset(){x=y=0;draw()}
 hero.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*8;y=((e.clientY-r.top)/r.height-.5)*6;if(!frame)frame=requestAnimationFrame(draw)});
 hero.addEventListener('pointerleave',reset);
 window.addEventListener('scroll',()=>{if(reduced.matches||!visible)return;x=0;y=Math.max(-3,Math.min(3,-hero.getBoundingClientRect().top/120));if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
})();
