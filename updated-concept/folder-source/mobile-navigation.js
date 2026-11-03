(()=>{
const chevron=iconSVG('<path d="m9 5 7 7-7 7"/>');
mobileSheet.classList.add('mobile-navigation');
mobileSheet.id='mobile-site-navigation';
mobileSheet.setAttribute('aria-label','Навигация по сайту');
const bar=document.createElement('div');bar.className='mobile-nav-bar';
bar.append(document.querySelector('.brand').cloneNode(true));
const actions=document.createElement('div');actions.className='mobile-nav-actions';
document.querySelectorAll('.primary-line>.messenger').forEach(a=>actions.append(a.cloneNode(true)));bar.append(actions);
const close=document.createElement('button');close.type='button';close.setAttribute('aria-label','Закрыть меню');close.innerHTML=iconSVG('<path d="m6 6 12 12M18 6 6 18"/>');close.onclick=()=>closeMobile();actions.append(close);mobileSheet.prepend(bar);
const footer=document.createElement('div');footer.className='mobile-nav-footer';footer.innerHTML='<button type="button">Подобрать программу</button>';footer.firstChild.onclick=()=>{closeMobile(false);document.querySelector('.hero-actions [data-brief]').click()};mobileSheet.append(footer);
// The footer separates content only while more of the list remains below it.
function syncFooterScroll(){
 mobileSheet.classList.toggle('has-content-below',mobileBody.scrollHeight-mobileBody.clientHeight-mobileBody.scrollTop>2);
}
mobileBody.addEventListener('scroll',syncFooterScroll,{passive:true});
new ResizeObserver(syncFooterScroll).observe(mobileBody);
new MutationObserver(()=>requestAnimationFrame(syncFooterScroll)).observe(mobileBody,{childList:true,subtree:true});
new MutationObserver(()=>requestAnimationFrame(syncFooterScroll)).observe(mobileSheet,{attributes:true,attributeFilter:['open']});
function level(name,title){mobileSheet.dataset.level=name;mobileSheet.querySelector('.mobile-sheet-head strong').textContent=title;mobileSheet.querySelector('.mobile-back').hidden=name==='root';mobileBody.scrollTop=0;}
mobileRoot=function(){
 mobileLevel='root';level('root','Меню');
 mobileBody.innerHTML='<button class="mobile-search-entry">Найти программу '+iconSVG('<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>')+'</button><nav class="mobile-main-links" aria-label="Основные разделы">'+Object.entries(mobileNames).map(([key,label])=>'<button class="mobile-row" data-kind="'+key+'"><span>'+label+'</span>'+chevron+'</button>').join('')+'<a class="mobile-row" href="https://catalystrussia.ru/cases/"><span>Портфолио</span></a></nav><nav class="mobile-secondary-links" aria-label="Дополнительные разделы"></nav><div class="mobile-nav-contact"><a href="tel:+79911501001">+7 991 150-10-01</a><p>Ежедневно 8:00–22:00<br>Москва и МО · выезды по России</p><div class="mobile-nav-messengers"></div></div>';
 document.querySelectorAll('.utility-nav a').forEach(a=>{const copy=a.cloneNode(true);copy.removeAttribute('id');if(a.id!=='offers-trigger')copy.classList.add('mobile-row');if(a.id==='offers-trigger'){copy.classList.add('mobile-nav-offers');copy.innerHTML='<span>Посмотреть<br>акции</span><svg class="offers-art" preserveAspectRatio="xMidYMin meet" viewBox="0 0 76 76" fill="none" aria-hidden="true"><path d="M24 0v20m-5 7v-7h10v7M57 0v32m-5 7v-7h10v7" stroke="#11743e" stroke-width="2"/><circle cx="24" cy="44" r="19" fill="#ffdf4a" stroke="#11743e" stroke-width="2"/><path d="M6 40q18 13 36 0M11 56q13-9 26 0" stroke="#11743e" stroke-width="2"/><circle cx="57" cy="56" r="16" fill="#e3f3e9" stroke="#11743e" stroke-width="2"/><path d="M57 44v24M45 56h24M49 48l16 16m0-16L49 64" stroke="#11743e" stroke-width="2"/></svg>';}if(a.id==='offers-trigger')copy.onclick=e=>{e.preventDefault();closeMobile(false);document.getElementById('offers-preview').showModal()};(a.id==='offers-trigger'?mobileBody.querySelector('.mobile-main-links'):mobileBody.querySelector('.mobile-secondary-links')).append(copy)});
 // Keep all navigation together, followed by the seasonal card and offers.
 const secondary=mobileBody.querySelector('.mobile-secondary-links');
 const offers=mobileBody.querySelector('.mobile-nav-offers');
 secondary.after(offers);
 const seasonalSource=document.querySelector('#header .promo-calendar');
 if(seasonalSource){
  const stack=document.createElement('div');stack.className='promo-stack mobile-root-season';
  const card=document.createElement('a');card.className=seasonalSource.className;
  card.href='https://catalystrussia.ru/novogodnij-korporativ/';
  card.innerHTML=seasonalSource.innerHTML;
  const link=card.querySelector('.experiment-button');
  if(link){const label=document.createElement('span');label.className=link.className;label.innerHTML=link.innerHTML;link.replaceWith(label)}
  stack.append(card);offers.before(stack);
 }
 document.querySelectorAll('.primary-line>.messenger').forEach(a=>{const copy=a.cloneNode(true);copy.className='mobile-nav-messenger '+(a.classList.contains('mv-ib-tg')?'mobile-nav-telegram':'mobile-nav-max');copy.append(document.createTextNode(a.classList.contains('mv-ib-tg')?'Telegram':'Max'));mobileBody.querySelector('.mobile-nav-messengers').append(copy)});
};
mobileCategories=function(kind){mobileKind=kind;mobileLevel='categories';level('categories',mobileNames[kind]);if(kind==='about'){mobileBody.innerHTML='<a class="mobile-row" href="https://catalystrussia.ru/about/">О нас</a><a class="mobile-row" href="https://catalystrussia.ru/#contacts">Контакты</a>';return}mobileBody.innerHTML=menuData[kind].map((cat,i)=>'<button class="mobile-row" data-category="'+i+'">'+(kind==='programs'?'<span class="category-icon">'+iconSVG(categoryPaths[i])+'</span>':'')+'<span>'+cat.title+'</span>'+chevron+'</button>').join('');};
mobilePrograms=function(index){savedMobilePrograms(index);mobileBody.querySelectorAll('.program-name').forEach(name=>{const text=name.textContent.trim();if(!text.includes(' · '))return;const [title,...details]=text.split(' · ');name.replaceChildren();const label=document.createElement('span');label.textContent=title;const meta=document.createElement('small');meta.className='mobile-program-meta';meta.textContent=details.join(' · ');name.append(label,meta)});level('programs',menuData[mobileKind][index].title);const all=document.createElement('a');all.className='mobile-category-all';all.href=menuData[mobileKind][index].all;all.textContent='Все программы категории';mobileBody.append(all)};

const desktopSearch=setSearch;
positionMobilePanel=function(){
 const rect=primary.getBoundingClientRect(),style=getComputedStyle(primary);
 // Keep the header contents at their closed-state viewport coordinates.
 bar.style.setProperty('height',Math.max(0,rect.bottom)+'px');
 bar.style.setProperty('padding-top',(Math.max(0,rect.top)+parseFloat(style.paddingTop))+'px');
 bar.style.setProperty('padding-bottom',style.paddingBottom);
 bar.style.setProperty('padding-left',(rect.left+parseFloat(style.paddingLeft))+'px');
 bar.style.setProperty('padding-right',(innerWidth-rect.right+parseFloat(style.paddingRight))+'px');
};
const previousClose=closeMobile;let menuMotion=null,menuClosing=false;
const reducedMenuMotion=matchMedia('(prefers-reduced-motion:reduce)');
function menuFrames(){
 const header=primary.getBoundingClientRect(),sheet=mobileSheet.getBoundingClientRect();
 const left=Math.max(0,header.left-sheet.left),top=Math.max(0,header.top-sheet.top);
 return [
  {clipPath:`inset(${top}px ${Math.max(0,sheet.right-header.right)}px ${Math.max(0,sheet.bottom-header.bottom)}px ${left}px)`},
  {clipPath:'inset(0px 0px 0px 0px)'}
 ];
}
function cancelMenuMotion(){menuMotion?.cancel();menuMotion=null;}
function animateMenu(open){
 if(open){
  cancelMenuMotion();
  menuMotion=mobileSheet.animate(menuFrames(),{duration:360,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
 }else{
  // Decelerate towards the header instead of reversing the opening easing.
  const current=getComputedStyle(mobileSheet).clipPath;
  const radius=getComputedStyle(primary).borderTopLeftRadius;
  const destination=menuFrames()[0].clipPath.replace(/\)$/,` round ${radius})`);
  cancelMenuMotion();
  menuMotion=mobileSheet.animate([
   {clipPath:current==='none'?'inset(0px 0px 0px 0px round 0px)':current},
   {clipPath:destination}
  ],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
 }
}
function finishClose(restore){
 previousClose(false);cancelMenuMotion();menuClosing=false;

 document.documentElement.style.overflow=document.querySelector('dialog[open],.mega-menu[open]')?'hidden':'';
 if(restore===true)mobileTrigger.focus({preventScroll:true});
}
closeMobile=function(restore=true){
 if(!mobileSheet.open)return;
 if(restore===false||reducedMenuMotion.matches){finishClose(restore);return;}
 if(menuClosing)return;
 menuClosing=true;
 animateMenu(false);menuMotion.onfinish=()=>finishClose(restore);
};
mobileSheet.addEventListener('cancel',e=>{e.preventDefault();closeMobile()});
mobileSheet.addEventListener('click',e=>{if(e.target===mobileSheet&&e.clientY>mobileSheet.getBoundingClientRect().bottom)closeMobile()});
openMobile=function(){
 if(mobileSheet.open)return;
 menus.forEach(m=>m.open=false);desktopSearch(false);mobileRoot();
 positionMobilePanel();document.documentElement.style.overflow='hidden';
 close.autofocus=true;mobileSheet.showModal();close.focus({preventScroll:true});
 document.body.classList.add('mobile-menu-open');
 mobileTrigger.setAttribute('aria-expanded','true');mobileTrigger.setAttribute('aria-label','Закрыть меню');
 mobileTrigger.innerHTML=iconSVG('<path d="m6 6 12 12M18 6 6 18"/>');
 if(!reducedMenuMotion.matches)animateMenu(true);
};
function mobileSearch(){
 mobileLevel='search';level('search','Поиск');
 mobileBody.innerHTML='<label class="mobile-search-field"><span class="sr-only">Найти программу</span><input type="search" placeholder="Название или задача команды" autocomplete="off"></label><div class="mobile-search-results"></div>';
 const input=mobileBody.querySelector('input'),results=mobileBody.querySelector('.mobile-search-results');
 function render(){results.innerHTML=MVS.results('sheet',input.value);results.querySelectorAll('.mv-gbtn').forEach(a=>{a.removeAttribute('onclick');a.href='https://catalystrussia.ru/#contacts'})}
 input.oninput=render;render();input.focus();
 results.onclick=e=>{const chip=e.target.closest('[data-q]');if(chip){e.preventDefault();input.value=chip.dataset.q;render();input.focus()}};
}
setSearch=function(open,focusBack=false){if(innerWidth>1100)return desktopSearch(open,focusBack);if(open){openMobile();mobileSearch()}else desktopSearch(false,focusBack)};
st.onclick=e=>{e.stopPropagation();if(innerWidth>1100){setSearch(searchPanel.hidden,true);return}if(mobileSheet.open&&mobileLevel==='search')closeMobile();else setSearch(true)};
mobileBody.onclick=e=>{const cat=e.target.closest('[data-category]'),kind=e.target.closest('button[data-kind]');if(cat)mobilePrograms(Number(cat.dataset.category));else if(kind)mobileCategories(kind.dataset.kind);else if(e.target.closest('.mobile-search-entry'))mobileSearch()};
mobileSheet.querySelector('.mobile-back').innerHTML=iconSVG('<path d="m14 5-7 7 7 7"/>');
mobileSheet.querySelector('.mobile-back').onclick=()=>{mobileLevel==='programs'?mobileCategories(mobileKind):mobileRoot()};
mobileBody.addEventListener('click',e=>{const a=e.target.closest('a.mobile-row');if(a)closeMobile(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileSheet.open){e.preventDefault();closeMobile()}});
mobileSheet.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...mobileSheet.querySelectorAll('a[href],button:not([hidden]),input')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
})();
