/* Automatic hero photos with touch swiping; no visible slider controls. */
(()=>{
 const hero=document.querySelector('.hero'),img=hero?.querySelector('.hero-slide');if(!img)return;
 const surface=hero.querySelector('.collage-v2');
 const editingFirstSlide=false; // Automatic rotation and swiping enabled after composition review.
 const slides=[['figma-20261102/hero-race-lossless.webp','Болид программы Формула-1'],['figma-hero-slides/city-lossless.webp','Город, построенный участниками программы Мегаполис'],['figma-hero-slides/tower-lossless.webp','Конструкция программы WOW Башня'],['optimized/foodtruck.webp','Оформленный участниками фудтрак'],['optimized/pizza.webp','Команда с огромной пиццей программы WOW Пицца'],['figma-startup-20261104/startup-screen.png','Ведущий бизнес-игры Стартап показывает экран Midjourney']];
 const programSlugs=['formula-1','gorodskaya-strojka','wow-bashnya','festival-fudtrakov','wow-pizza',null];
 const events=[
  {title:'Формула-1',copy:'Строим свой болид и выходим на командный заезд.',photo:'formula-1.webp',caption:'Формула-1 / командный заезд'},
  {title:'Мегаполис',copy:'Строим город: от отдельных кварталов до общего проекта.',photo:'megapolis-action.webp',caption:'Мегаполис / строим вместе'},
  {title:'WOW Башня',copy:'Собираем масштабную башню с вращающимися мельницами.',photo:'wow-bashnya.webp',caption:'WOW Башня / большая общая цель'},
  {title:'Фестиваль фудтраков',copy:'Создаём свой фудтрак и готовим угощения всей командой.',photo:'foodtruck-selected-lossless.webp',caption:'Фудтраки / готовим вместе'},
  {title:'WOW Пицца',copy:'Готовим большую пиццу всей командой под руководством шеф-повара.',photo:'wow-pizza.webp',caption:'WOW Пицца / готовим вместе'},
  {title:'Стартап',copy:'Создаём бренд с нейросетями и представляем его инвесторам.',photo:'startap_business_game.webp',caption:'Стартап / создаём свой бренд'}
 ];
 const eventCard=surface.querySelector('.event-caption'),polaroid=surface.querySelector('.event-polaroid');
 const folderTitles=[['Лучшие','тимбилдинги','в России'],['Корпоратив','на 100+'],['События','по всей','России'],['Фестиваль','для команды'],['Тимбилдинг','со вкусом'],['Новые идеи','для вашей','команды']];
 const folderTitle=surface.querySelector('.mini-folder strong');
 function syncFolder(i){if(!folderTitle)return;folderTitle.replaceChildren(...folderTitles[i].flatMap((line,n)=>n?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]));}
 syncFolder(0);
 const phrases=['болид Формулы-1','город из картона','башню 10 метров','свой фудтрак','огромную пиццу','свой стартап'];
 const phrase=document.getElementById('hero-changing-title');let typingTimer;
 function typeHeadline(text){
  if(!phrase)return;clearTimeout(typingTimer);
  phrase.setAttribute('aria-label',text);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){phrase.textContent=text;return}
  const current=phrase.textContent;let count=current.length;
  function erase(){
   if(count>0){phrase.textContent=current.slice(0,--count);typingTimer=setTimeout(erase,22)}
   else{count=0;typingTimer=setTimeout(type,120)}
  }
  function type(){phrase.textContent=text.slice(0,++count);if(count<text.length)typingTimer=setTimeout(type,55)}
  erase();
 }
 const stickerFiles=Array(slides.length).fill('optimized/hero-stickers.webp');
 function syncEvent(i){syncFolder(i);surface.querySelectorAll('.figma-race-sticker img').forEach(el=>el.src='assets/'+(i===3&&el.closest('.figma-race-flag')?'hero-foodtruck-megaphone.png':stickerFiles[i]));typeHeadline(phrases[i]);const e=events[i];surface.querySelectorAll('.event-project-link').forEach(link=>{link.href=programSlugs[i]?"https://catalystrussia.ru/teambuilding/vse-programmy/"+programSlugs[i]+"/":"https://catalystrussia.ru/startap_business_game/";link.setAttribute("aria-label","Подробнее о программе "+e.title)});eventCard.querySelector('h3').textContent=e.title;eventCard.querySelector('p').textContent=e.copy;polaroid.querySelector('img').alt=e.caption;polaroid.querySelector('figcaption').textContent=e.caption;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer,visible=true,request=0,touch=null,suppressClick=false;
 let transitions=[];
 const pieces=[img,polaroid,eventCard,surface.querySelector('.mini-folder'),...surface.querySelectorAll('.seal,.hero-sticker,.figma-race-sticker')].filter(Boolean);
 function cancelTransition(){transitions.forEach(a=>a.cancel());transitions=[];}
 const images=[];
 function loadSlide(i){if(!images[i]){const image=new Image();image.decoding='async';image.src='assets/'+slides[i][0];images[i]=image}return images[i]}
 surface.dataset.slide='0';
 function stop(){clearInterval(timer);clearTimeout(typingTimer);if(phrase)phrase.textContent=phrases[index];request++;cancelTransition();img.classList.remove('slide-changing')}
 async function show(next){
  if(editingFirstSlide||next===index)return;
  const token=++request;cancelTransition();
  try{await loadSlide(next).decode()}catch{return}
  if(token!==request)return;
  const apply=()=>{index=next;img.src=images[index].src;img.alt=slides[index][1];surface.dataset.slide=String(index);syncEvent(index)};
  if(reduced.matches||!img.animate){apply();return}
  const leaving=pieces.filter(el=>getComputedStyle(el).display!=='none');
  transitions=leaving.map(el=>el.animate([{opacity:1},{opacity:0}],{duration:210,easing:'ease-out',fill:'forwards'}));
  try{await Promise.all(transitions.map(a=>a.finished))}catch{return}
  if(token!==request)return;
  cancelTransition();apply();
  transitions=pieces.filter(el=>getComputedStyle(el).display!=='none').map(el=>
   el.animate([{opacity:0},{opacity:1}],{duration:480,easing:'ease-out',fill:'both'})
  );
  try{await Promise.all(transitions.map(a=>a.finished))}catch{return}
  if(token===request)cancelTransition();
 }
 function start(){stop();if(!surface.hasAttribute('data-layout-ready')||editingFirstSlide||reduced.matches||document.hidden||!visible||touch||surface.matches(':focus-within'))return;timer=setInterval(()=>show((index+1)%slides.length),5500)}
 surface.addEventListener('pointerdown',e=>{if(editingFirstSlide||!e.isPrimary||e.button!==0)return;suppressClick=false;touch={x:e.clientX,y:e.clientY,id:e.pointerId};(e.target.closest('.event-project-link')||surface).setPointerCapture(e.pointerId);stop()});
 surface.addEventListener('pointerup',e=>{if(!touch||touch.id!==e.pointerId)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;start();suppressClick=Math.abs(dx)>10||Math.abs(dy)>10;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)show((index+(dx<0?1:-1)+slides.length)%slides.length)});
 surface.addEventListener('click',e=>{if(suppressClick){e.preventDefault();suppressClick=false}});
 surface.addEventListener('dragstart',e=>e.preventDefault());
 surface.tabIndex=0;surface.setAttribute('role','region');surface.setAttribute('aria-roledescription','карусель');
 surface.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();stop();show((index+(e.key==='ArrowRight'?1:-1)+slides.length)%slides.length)});
 surface.addEventListener('pointercancel',()=>{touch=null;suppressClick=false;start()});
 surface.addEventListener('focusin',stop);surface.addEventListener('focusout',()=>setTimeout(start,0));
 surface.addEventListener('hero-layout-ready',start);
 document.addEventListener('visibilitychange',start);reduced.addEventListener('change',()=>{reset();start()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.05}).observe(hero);
 // Different depth and direction for each sticker; keep the approved anchor positions.
 const items=[...surface.querySelectorAll('.seal,.hero-sticker,.figma-race-sticker')].map(el=>({
  el,...(el.matches('.seal')?{depthX:1.35,depthY:1.1}:
   el.matches('.sticker-popper,.figma-race-star')?{depthX:-1,depthY:-.7}:{depthX:.65,depthY:1})
 }));let frame=0,x=0,y=0,scrollY=0;
 function draw(){frame=0;items.forEach(({el,depthX,depthY})=>{el.style.setProperty('--motion-x',(x*depthX).toFixed(2)+'px');el.style.setProperty('--motion-y',((y+scrollY)*depthY).toFixed(2)+'px')})}
 function reset(){x=y=0;if(reduced.matches)scrollY=0;draw()}
 hero.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*8;y=((e.clientY-r.top)/r.height-.5)*6;if(!frame)frame=requestAnimationFrame(draw)});
 hero.addEventListener('pointerleave',reset);
 window.addEventListener('scroll',()=>{if(reduced.matches||!visible)return;scrollY=Math.max(-24,Math.min(24,-hero.getBoundingClientRect().top*.065));if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
})();
