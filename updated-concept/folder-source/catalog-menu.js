(()=>{
const menu=document.querySelector('.mega-menu[data-kind="programs"]');
const panel=menu.querySelector('.mega-panel'),layout=menu.querySelector('.mega-layout'),results=menu.querySelector('.mega-results');
menu.classList.add('catalog-menu');
const wrapper=layout.querySelector(':scope > .menu-content');if(wrapper){while(wrapper.firstChild)layout.insertBefore(wrapper.firstChild,wrapper);wrapper.remove()}
menu.querySelector('.mega-head p').textContent='Командные игры и активности';
menu.querySelector('.menu-help')?.remove();
const all=menu.querySelector('.catalog-all-button');
all.textContent='Все 50+ программ';menu.querySelector('.mega-categories').append(all);
menu.querySelector('.mega-footer')?.remove();
const arrow='<svg class="ui-icon link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const promo=menu.querySelector('.mega-promo');
promo.className='mega-promo promo-experiment catalog-promo';
promo.innerHTML='<h4>Новый год 2027</h4><svg class="catalog-ornament" viewBox="0 0 48 64" aria-hidden="true"><path d="M24 0v14m-6 8v-6h12v6" fill="none" stroke="#11743e" stroke-width="2"/><circle cx="24" cy="40" r="19" fill="#ffdf4a"/><path d="M6 38c9 7 27 7 36 0M11 51c8-5 18-5 26 0" fill="none" stroke="#11743e" stroke-width="2"/></svg><p>Ранняя бронь до 31 октября<br>Без предоплаты</p><a href="https://catalystrussia.ru/novogodnij-korporativ/">Посмотреть предложение</a>';
menu.querySelector('.monthly-offers')?.remove();
const help=document.createElement('div');help.className='catalog-menu-help';help.innerHTML='<strong>Не знаете, что выбрать?</strong><button type="button" data-brief="Подбор программы для команды">Подобрать программу</button>';layout.append(help);
help.querySelector('button').addEventListener('click',()=>{menu.open=false;document.querySelector('.hero-actions [data-brief]').click()});
const descriptions={
'Мегаполис':'Строим город и договариваемся в команде',
'Стартап с нейросетями':'Создаём проект с помощью ИИ',
'Фестиваль Фудтраков':'Создаём фудтраки и открываем фестиваль',
'Цепная реакция':'Соединяем идеи в общий механизм',
'WOW Башня':'Собираем вместе большой арт-объект',
'WOW Пицца':'Готовим большую пиццу всей командой',
'Гонки Формула-1':'Строим болид и выходим на заезд',
'Корпоративная картина':'Рисуем общую картину для команды',
'Озвучка 2.0':'Пробуем себя в озвучке',
'Камера! Мотор!':'Придумываем и снимаем командный фильм',
'Театр Марионеток':'Создаём совместную постановку',
'Оркестр':'Играем вместе в одном ритме',
'Город Мечты':'Строим город всей командой',
'Новогодняя Ярмарка':'Создаём праздничную ярмарку',
'Конвейер подарков':'Объединяемся для создания подарков',
'Квиз «Итоги года»':'Отвечаем на вопросы вместе с коллегами'
};
const original=fillMenu;
fillMenu=function(target,index=0,query=''){
 if(target!==menu)return original(target,index,query);
 const cat=menuData.programs[index];let items=cat.items;
 if(index===2){const names=['Мегаполис','Стартап с нейросетями','Фестиваль Фудтраков','Цепная реакция'];const pool=menuData.programs.flatMap(c=>c.items);items=names.map(n=>pool.find(i=>i[0]===n)||(n==='Цепная реакция'?['Цепная реакция','https://catalystrussia.ru/teambuilding/vse-programmy/cepnaya-reakciya/']:null)).filter(Boolean)}
 if(query)items=items.filter(i=>i[0].toLowerCase().includes(query.toLowerCase()));
 results.replaceChildren();const h=document.createElement('h4');h.textContent=cat.title;results.append(h);
 const grid=document.createElement('div');grid.className='mega-links';results.append(grid);
 items.slice(0,4).forEach(([name,url])=>{
 const a=document.createElement('a');a.href=url;a.className='photo-link';
 const key=byName[name]||new URL(url).pathname.split('/').filter(Boolean).pop();
 if(programPhotos[key]){const img=new Image();img.src=programPhotos[key];img.alt='';a.append(img)}
 const title=document.createElement('span');title.className='program-name';title.textContent=name;
 const desc=document.createElement('span');desc.className='program-summary';desc.textContent=descriptions[name]||cat.title+' для вашей команды';
 a.append(title,desc);grid.append(a);
 });
 const link=document.createElement('a');link.className='mega-all-category';link.href=cat.all;
 const labels=['Все популярные программы','Все новогодние программы','Все бизнес-игры','Все творческие программы','Все спортивные программы','Все кулинарные программы','Все программы с нейросетями','Все необычные программы'];
 link.innerHTML=labels[index]+' '+arrow;results.append(link);
};
fillMenu(menu,Number(menu.dataset.selected||0));
})();
