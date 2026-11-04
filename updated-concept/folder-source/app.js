(()=>{
const programs=window.PROGRAMS;let current=0,busy=false,pendingDirection=0;const $=s=>document.querySelector(s);const dialog=$('#brief');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function openBrief(name=''){ $('#brief-form').reset();$('#brief-form').elements.program.value=name;$('#form-status').textContent='';dialog.showModal(); }
document.querySelectorAll('[data-brief]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openBrief(b.dataset.brief)}));
$('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const catalogPrograms=[{"name": "Фестиваль Фудтраков", "description": "Команды строят фудтраки, у каждого своя кухня мира. На фестивале каждый фудтрак зарабатывает игровую валюту.", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/festival-fudtrakov/", "image": "assets/menu-official/408b995a0d8d-foodtrucks-hover.webp", "tags": ["Кулинарная бизнес-игра"], "categories": ["Хиты", "Бизнес-игры", "Кулинарные"]}, {"name": "Мегаполис", "description": "Команды строят город из тысяч деталей и договариваются, как собрать его в единый Мегаполис.", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/gorodskaya-strojka/", "image": "folder-source/assets/gorodskaya-strojka.webp", "tags": ["Конструирование", "бизнес-игра"], "categories": ["Хиты", "Бизнес-игры"]}, {"name": "WOW Башня", "description": "Команда собирает гигантский 10-метровый арт-объект своими руками.", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/wow-bashnya/", "image": "assets/menu-official/d28ae89a5b54-wow-bashnya.webp", "tags": ["Конструирование"], "categories": ["Хиты"]}, {"name": "Гонки Формула-1", "description": "Гонки болидов, собранных командами.", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/formula-1/", "image": "assets/menu-official/367df5691b79-501386952ef9eebe.webp", "tags": ["Конструирование", "гонки"], "categories": ["Хиты", "Спортивные"]}, {"name": "Корпоративная картина", "description": "Рисуем вместе и забираем картину в офис.", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/teambuilding-obshaya-kartina/", "image": "assets/menu-official/74ba0a1c43ec-00.webp", "tags": ["Творческая программа"], "categories": ["Хиты", "Творческие"]}, {"name": "Стартап с нейросетями", "description": "Команды создают AI-стартапы и защищают идею для рынка.", "url": "https://catalystrussia.ru/startap_business_game/", "image": "folder-source/assets/startap_business_game.webp", "tags": ["Бизнес-игра", "нейросети"], "categories": ["Хиты", "Бизнес-игры", "С нейросетями"]}, {"name": "Фестиваль Мороженого", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/festival-morozhenogo/", "image": "assets/menu-official/a00a70771eae-festival-morozhenogo-telezhka.webp", "tags": ["Необычные"], "categories": ["Необычные"], "description": ""}, {"name": "Art&Fun&Sport", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/art-fun-sport/", "image": "folder-source/assets/art-fun-sport.webp", "tags": ["Необычные"], "categories": ["Необычные"], "description": ""}, {"name": "Ужин с уликами", "url": "https://catalystrussia.ru/teambuilding/vse-programmy/uzhin-s-ulikami/", "image": "folder-source/assets/uzhin-s-ulikami.webp", "tags": ["Необычные"], "categories": ["Необычные"], "description": ""}, {"name": "Город Мечты", "description": "Команды строят город и зажигают ёлку на площади.", "url": "https://catalystrussia.ru/new-year-teambuildings/", "image": "assets/menu-official/38a5ffdc8828-megapolis-w600.webp", "tags": ["Новогодняя командная игра"], "categories": ["Новогодние"]}, {"name": "Новогодняя Ярмарка", "description": "Команды создают праздничные фудтраки с пряниками и глинтвейном.", "url": "https://catalystrussia.ru/new-year-teambuildings/", "image": "assets/menu-official/467ab5a71114-festival-foodtrucks-w600.webp", "tags": ["Новогодняя командная игра"], "categories": ["Новогодние"]}, {"name": "Конвейер подарков", "description": "Общая цепная реакция доставляет новогодний подарок.", "url": "https://catalystrussia.ru/new-year-teambuildings/", "image": "assets/menu-official/1ea852cc66b3-goldberg-machine.webp", "tags": ["Новогодняя командная игра"], "categories": ["Новогодние"]}, {"name": "Квиз «Итоги года»", "description": "Командный квиз об итогах года.", "url": "https://catalystrussia.ru/new-year-teambuildings/", "image": "assets/menu-official/25832d4ed829-kviz-itogi-goda-w600.webp", "tags": ["Новогодняя командная игра"], "categories": ["Новогодние"]}, {"name": "Новогоднее ТВ-шоу", "description": "Команды участвуют в играх и музыкальных конкурсах на сцене.", "url": "https://catalystrussia.ru/new-year-teambuildings/", "image": "assets/menu-official/74e9ac945460-tv-shou-w600.webp", "tags": ["Новогодняя командная игра"], "categories": ["Новогодние"]}];
// Reuse the approved menu entries so no category is reduced to a single programme.
menuData.programs.forEach(category=>{
 const name=category.title==='Популярные'?'Хиты':category.title;
 category.items.forEach(([title,url])=>{
  const existing=catalogPrograms.find(program=>program.name===title);
  if(existing){if(!existing.categories.includes(name))existing.categories.push(name);return;}
  const image=officialMenuPhotos[title];
  if(image)catalogPrograms.push({name:title,url,image,description:'',categories:[name]});
 });
});
const catalogHelp=document.querySelector('#catalog .catalog-help');
let selectedCategory='Хиты';
function renderCatalog(query=''){
 const grid=$('#catalog-grid');grid.replaceChildren();
 const matches=catalogPrograms.filter(p=>p.categories.includes(selectedCategory)&&p.name.toLowerCase().includes(query.toLowerCase()));
 const visible=query?matches:matches.slice(0,matchMedia('(max-width:700px)').matches?4:5);
 grid.dataset.count=visible.length;
 visible.forEach(p=>{
 const card=document.createElement('article');card.className='catalog-card';
 const img=new Image();img.src=p.image;img.alt=p.name;img.loading='lazy';
 const copy=document.createElement('div');copy.className='catalog-card-copy';
 const h=document.createElement('h3');h.textContent=p.name;
 const desc=document.createElement('p');desc.textContent=p.description;
 const link=document.createElement('a');link.className='catalog-more';link.href=p.url;link.setAttribute('aria-label','Подробнее о программе «'+p.name+'»');link.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
 link.insertAdjacentHTML('beforeend','<img class="catalog-mobile-chevron" src="assets/figma-20261102/chevron.svg" alt="" aria-hidden="true">');
 copy.append(h);if(p.description)copy.append(desc);card.append(img,copy,link);grid.append(card);
 });
 if(!query){
 const category=menuData.programs.find(c=>c.title===(selectedCategory==='Хиты'?'Популярные':selectedCategory));
 const labels={'Хиты':'Все хиты','Бизнес-игры':'Все бизнес-игры','Творческие':'Все творческие программы','Спортивные':'Все спортивные программы','Кулинарные':'Все кулинарные программы','С нейросетями':'Все программы с нейросетями','Новогодние':'Все новогодние программы','Необычные':'Все необычные программы'};
 const card=document.createElement('article');card.className='catalog-card catalog-category-card';
 const label=labels[selectedCategory]||'Все программы категории';
 const heading=document.createElement('h3');heading.textContent=label;
 const copy=document.createElement('div');copy.className='catalog-card-copy';
 const kicker=document.createElement('span');kicker.className='category-banner-kicker';kicker.textContent='Подборка для вашей команды';
 const description=document.createElement('p');description.className='category-banner-description';description.textContent=selectedCategory==='Хиты'?'Игры, которые объединяют: строить, придумывать и создавать вместе.':'Сравните форматы и выберите программу под задачу вашей команды.';
 const action=document.createElement('span');action.className='category-banner-action';action.textContent='Смотреть подборку';
 copy.append(kicker,heading,description);
 const link=document.createElement('a');link.className='catalog-more';link.href=category?.all||'https://catalystrussia.ru/timbilding/';link.setAttribute('aria-label',label);link.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
 action.append(link.querySelector('svg'));
 card.insertAdjacentHTML('afterbegin',categoryIllustration(selectedCategory));card.append(copy,action,link);grid.append(card);
 }
 grid.dataset.count=grid.children.length;
 $('#no-results').hidden=grid.children.length>0;
 if(catalogHelp)grid.append(catalogHelp);
}
document.querySelectorAll('[data-catalog-filter]').forEach(button=>button.addEventListener('click',()=>{
 selectedCategory=button.dataset.catalogFilter;
 document.querySelectorAll('[data-catalog-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 renderCatalog($('#catalog-search').value);
}));renderCatalog();
matchMedia('(max-width:700px)').addEventListener('change',()=>renderCatalog($('#catalog-search').value));
const searchTrigger=$('.search');if(searchTrigger)searchTrigger.onclick=()=>{$('.search-field').hidden=false;$('#catalog').scrollIntoView();$('#catalog-search').focus({preventScroll:true})};$('#catalog-search').oninput=e=>renderCatalog(e.target.value);
document.querySelectorAll('.mainnav details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.mainnav details').forEach(other=>{if(other!==d)other.open=false})}));document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('details').forEach(d=>d.open=false)});document.addEventListener('click',e=>{if(!e.target.closest('details'))document.querySelectorAll('details').forEach(d=>d.open=false)});
$('#brief-form').elements.channel.onchange=e=>{const input=$('#brief-form').elements.contact;input.type=e.target.value==='Email'?'email':'text';input.placeholder=e.target.value==='Email'?'name@company.ru':e.target.value==='Telegram'?'@username':'Номер телефона'};
$('#brief-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const text=['Заявка — Каталист','Программа: '+(f.get('program')||'Помогите с выбором'),'Участников: '+f.get('people'),'Город / площадка: '+f.get('location'),'Дата: '+f.get('date'),'Способ связи: '+f.get('channel'),'Контакт: '+f.get('contact')].join('\n');const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Заявка — Каталист.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#form-status').textContent='Файл заявки подготовлен к скачиванию. Заявка не отправлена.'};

document.addEventListener('click',e=>{if(e.target.closest('#open-catalog')){e.preventDefault();e.stopImmediatePropagation();document.querySelector('#catalog').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}},true);


})();