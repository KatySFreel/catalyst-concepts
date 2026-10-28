/* Automatic hero photos with touch swiping; no visible slider controls. */
(()=>{
 const hero=document.querySelector('.hero'),img=hero?.querySelector('.hero-slide');if(!img)return;
 const surface=hero.querySelector('.collage-v2');
 const editingFirstSlide=false; // Automatic rotation and swiping enabled after composition review.
 const slides=[['hero-race.svg','Болид программы Формула-1'],['hero-city.svg','Город, построенный участниками программы Мегаполис'],['hero-tower.svg','Конструкция программы WOW Башня'],['hero-foodtruck.svg','Оформленный участниками фудтрак']];
 const programSlugs=['formula-1','gorodskaya-strojka','wow-bashnya','festival-fudtrakov'];
 const events=[
  {title:'Формула-1',copy:'Строим свой болид и выходим на командный заезд.',photo:'formula-1.webp',caption:'Формула-1 / командный заезд'},
  {title:'Мегаполис',copy:'Строим город: от отдельных кварталов до общего проекта.',photo:'megapolis-action.webp',caption:'Мегаполис / строим вместе'},
  {title:'WOW Башня',copy:'Собираем масштабную башню с вращающимися мельницами.',photo:'wow-bashnya.webp',caption:'WOW Башня / большая общая цель'},
  {title:'Фестиваль Фудтраков',copy:'Создаём свой фудтрак и готовим угощения всей командой.',photo:'festival-fudtrakov.webp',caption:'Фудтраки / готовим вместе'}
 ];
 const eventCard=surface.querySelector('.event-caption'),polaroid=surface.querySelector('.event-polaroid');
 const contextImages=events.map(e=>{const image=new Image();image.src='official-brand/assets/'+e.photo;return image});
 function syncEvent(i){const e=events[i];surface.querySelectorAll('.event-project-link').forEach(link=>{link.href="https://catalystrussia.ru/teambuilding/vse-programmy/"+programSlugs[i]+"/";link.setAttribute("aria-label","Подробнее о программе "+e.title)});eventCard.querySelector('h3').textContent=e.title;eventCard.querySelector('p').textContent=e.copy;polaroid.querySelector('img').src=contextImages[i].src;polaroid.querySelector('img').alt=e.caption;polaroid.querySelector('figcaption').textContent=e.caption;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer,visible=true,request=0,touch=null,suppressClick=false;
 let transitions=[];
 const pieces=[img,polaroid,eventCard,surface.querySelector('.mini-folder'),...surface.querySelectorAll('.seal,.hero-sticker')].filter(Boolean);
 function cancelTransition(){transitions.forEach(a=>a.cancel());transitions=[];}
 const images=slides.map(s=>{const image=new Image();image.src='official-brand/assets/'+s[0];return image});
 surface.dataset.slide='0';
 function stop(){clearInterval(timer);request++;cancelTransition();img.classList.remove('slide-changing')}
 async function show(next){
  if(editingFirstSlide||next===index)return;
  const token=++request;cancelTransition();
  try{await Promise.all([images[next].decode(),contextImages[next].decode()])}catch{return}
  if(token!==request)return;
  const apply=()=>{index=next;img.src=images[index].src;img.alt=slides[index][1];surface.dataset.slide=String(index);syncEvent(index)};
  if(reduced.matches||!img.animate){apply();return}
  const leaving=pieces.filter(el=>getComputedStyle(el).display!=='none');
  transitions=leaving.map((el,i)=>el.animate([
   {opacity:1,translate:'0 0',scale:'1'},
   {opacity:0,translate:`${i%2?-12:12}px 24px`,scale:'.975'}
  ],{duration:210,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}));
  try{await Promise.all(transitions.map(a=>a.finished))}catch{return}
  if(token!==request)return;
  cancelTransition();apply();
  transitions=pieces.filter(el=>getComputedStyle(el).display!=='none').map((el,i)=>{
   const photo=el===img,sticker=el.matches('.seal,.hero-sticker');
   return el.animate([
    {opacity:0,translate:`${i%2?-18:18}px ${photo?48:30}px`,scale:sticker?'.82':'.97',offset:0},
    {opacity:1,translate:`0 ${sticker?-5:-3}px`,scale:sticker?'1.06':'1.008',offset:.76},
    {opacity:1,translate:'0 0',scale:'1',offset:1}
   ],{duration:photo?620:480,delay:photo?0:70+i*35,easing:'cubic-bezier(.22,.75,.25,1)',fill:'both'});
  });
  try{await Promise.all(transitions.map(a=>a.finished))}catch{return}
  if(token===request)cancelTransition();
 }
 function start(){stop();if(editingFirstSlide||reduced.matches||document.hidden||!visible||touch||surface.matches(':focus-within'))return;timer=setInterval(()=>show((index+1)%slides.length),5500)}
 surface.addEventListener('pointerdown',e=>{if(editingFirstSlide||e.pointerType==='mouse')return;suppressClick=false;touch={x:e.clientX,y:e.clientY,id:e.pointerId};(e.target.closest('.event-project-link')||surface).setPointerCapture(e.pointerId);stop()});
 surface.addEventListener('pointerup',e=>{if(!touch||touch.id!==e.pointerId)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;start();suppressClick=Math.abs(dx)>10||Math.abs(dy)>10;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)show((index+(dx<0?1:-1)+slides.length)%slides.length)});
 surface.addEventListener('click',e=>{if(suppressClick){e.preventDefault();suppressClick=false}});
 surface.addEventListener('dragstart',e=>e.preventDefault());
 surface.addEventListener('pointercancel',()=>{touch=null;start()});
 surface.addEventListener('focusin',stop);surface.addEventListener('focusout',()=>setTimeout(start,0));
 document.addEventListener('visibilitychange',start);reduced.addEventListener('change',()=>{reset();start()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.05}).observe(hero);
 // Different depth and direction for each sticker; keep the approved anchor positions.
 const items=[...surface.querySelectorAll('.seal,.hero-sticker')].map(el=>({
  el,...(el.matches('.seal')?{depthX:1.35,depthY:1.1}:
   el.matches('.sticker-popper')?{depthX:-1,depthY:-1.4}:{depthX:.65,depthY:-.8})
 }));let frame=0,x=0,y=0;
 function draw(){frame=0;items.forEach(({el,depthX,depthY})=>{el.style.setProperty('--motion-x',(x*depthX).toFixed(2)+'px');el.style.setProperty('--motion-y',(y*depthY).toFixed(2)+'px')})}
 function reset(){x=y=0;draw()}
 hero.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*8;y=((e.clientY-r.top)/r.height-.5)*6;if(!frame)frame=requestAnimationFrame(draw)});
 hero.addEventListener('pointerleave',reset);
 window.addEventListener('scroll',()=>{if(reduced.matches||!visible)return;x=0;y=Math.max(-3,Math.min(3,-hero.getBoundingClientRect().top/120));if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
})();
