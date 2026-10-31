(()=>{
const chevron=iconSVG('<path d="m9 5 7 7-7 7"/>');
mobileSheet.classList.add('mobile-navigation');
mobileSheet.setAttribute('aria-label','Навигация по сайту');
const bar=document.createElement('div');bar.className='mobile-nav-bar';
bar.append(document.querySelector('.brand').cloneNode(true));
const close=document.createElement('button');close.type='button';close.setAttribute('aria-label','Закрыть меню');close.innerHTML=iconSVG('<path d="m6 6 12 12M18 6 6 18"/>');close.onclick=()=>closeMobile();bar.append(close);mobileSheet.prepend(bar);
const footer=document.createElement('div');footer.className='mobile-nav-footer';footer.innerHTML='<button type="button">Подобрать программу</button>';footer.firstChild.onclick=()=>{closeMobile(false);document.querySelector('.hero-actions [data-brief]').click()};mobileSheet.append(footer);
function level(name,title){mobileSheet.dataset.level=name;mobileSheet.querySelector('.mobile-sheet-head strong').textContent=title;mobileSheet.querySelector('.mobile-back').hidden=name==='root';mobileBody.scrollTop=0;}
mobileRoot=function(){
 mobileLevel='root';level('root','Меню');
 mobileBody.innerHTML='<button class="mobile-search-entry">Найти программу '+iconSVG('<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>')+'</button><nav class="mobile-main-links" aria-label="Основные разделы">'+Object.entries(mobileNames).map(([key,label])=>'<button class="mobile-row" data-kind="'+key+'"><span>'+label+'</span>'+chevron+'</button>').join('')+'<a class="mobile-row" href="https://catalystrussia.ru/cases/"><span>Портфолио</span></a></nav><nav class="mobile-secondary-links" aria-label="Дополнительные разделы"></nav><div class="mobile-nav-contact"><a href="tel:+79911501001">+7 991 150-10-01</a><p>Ежедневно 8:00–22:00<br>Москва и МО · выезды по России</p><div class="mobile-nav-messengers"></div></div>';
 document.querySelectorAll('.utility-nav a').forEach(a=>{const copy=a.cloneNode(true);copy.removeAttribute('id');if(a.id==='offers-trigger'){copy.classList.add('mobile-nav-offers');copy.textContent='Акции и предложения';}if(a.id==='offers-trigger')copy.onclick=e=>{e.preventDefault();closeMobile(false);document.getElementById('offers-preview').showModal()};(a.id==='offers-trigger'?mobileBody.querySelector('.mobile-main-links'):mobileBody.querySelector('.mobile-secondary-links')).append(copy)});
 document.querySelectorAll('.primary-line>.messenger').forEach(a=>{const copy=a.cloneNode(true);copy.className='mobile-nav-messenger '+(a.classList.contains('mv-ib-tg')?'mobile-nav-telegram':'mobile-nav-max');copy.append(document.createTextNode(a.classList.contains('mv-ib-tg')?'Telegram':'Max'));mobileBody.querySelector('.mobile-nav-messengers').append(copy)});
};
mobileCategories=function(kind){mobileKind=kind;mobileLevel='categories';level('categories',mobileNames[kind]);if(kind==='about'){mobileBody.innerHTML='<a class="mobile-row" href="https://catalystrussia.ru/about/">О нас</a><a class="mobile-row" href="https://catalystrussia.ru/#contacts">Контакты</a>';return}mobileBody.innerHTML=menuData[kind].map((cat,i)=>'<button class="mobile-row" data-category="'+i+'">'+(kind==='programs'?'<span class="category-icon">'+iconSVG(categoryPaths[i])+'</span>':'')+'<span>'+cat.title+'</span>'+chevron+'</button>').join('');};
mobilePrograms=function(index){savedMobilePrograms(index);mobileBody.querySelectorAll('.program-name').forEach(name=>{const text=name.textContent.trim();if(!text.includes(' · '))return;const [title,...details]=text.split(' · ');name.replaceChildren();const label=document.createElement('span');label.textContent=title;const meta=document.createElement('small');meta.className='mobile-program-meta';meta.textContent=details.join(' · ');name.append(label,meta)});level('programs',menuData[mobileKind][index].title);const all=document.createElement('a');all.className='mobile-category-all';all.href=menuData[mobileKind][index].all;all.textContent='Все программы категории';mobileBody.append(all)};

const desktopSearch=setSearch;
positionMobilePanel=function(){const top=Math.max(12,primary.getBoundingClientRect().bottom+10);mobileSheet.style.setProperty('--mobile-panel-top',top+'px')};
const previousClose=closeMobile;let savedOverflow='';
closeMobile=function(restore=true){const wasOpen=mobileSheet.open;previousClose(restore);if(wasOpen)document.documentElement.style.overflow=savedOverflow};
openMobile=function(){if(mobileSheet.open)return;menus.forEach(m=>m.open=false);desktopSearch(false);mobileRoot();savedOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';mobileSheet.show();positionMobilePanel();document.body.classList.add('mobile-menu-open');mobileTrigger.setAttribute('aria-expanded','true');mobileTrigger.setAttribute('aria-label','Закрыть меню');mobileTrigger.innerHTML=iconSVG('<path d="m6 6 12 12M18 6 6 18"/>')};
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
mobileSheet.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[mobileTrigger,...mobileSheet.querySelectorAll('a[href],button:not([hidden]),input')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
})();
