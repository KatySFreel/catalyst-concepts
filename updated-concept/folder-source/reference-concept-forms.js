(()=>{
 const host=document.querySelector('#prototype-content'),root=host?.shadowRoot;
 const tg=document.querySelector('.mv-ib-tg'),max=document.querySelector('.mv-ib-max');
 const iconFor=a=>{const svg=(a?.querySelector('svg')?.cloneNode(true));if(svg){svg.querySelector('defs')?.remove();svg.removeAttribute('fill');svg.style.fill=a===tg?'#2aa3e8':'#4b45f0';svg.style.color=a===tg?'#2aa3e8':'#4b45f0'}return svg};
 root?.querySelectorAll('.cta[href*="telegram"],.cta[href*="max.ru"]').forEach(a=>{const icon=iconFor(a.href.includes('telegram')?tg:max);if(icon)a.prepend(icon)});
 const dialog=document.createElement('dialog');dialog.id='concept-lead';dialog.setAttribute('aria-labelledby','concept-form-title');
 dialog.innerHTML='<button type="button" class="lead-close" aria-label="Закрыть форму">×</button><div class="lead-inner"></div>';document.body.append(dialog);
 const inner=dialog.querySelector('.lead-inner');let kind='proposal',step=0,answers=[],draft={},opener=null;
 const endpoint=window.CATALYST_LEAD_ENDPOINT||(location.hostname==='catalystrussia.ru'?'/api/lead/':null);
 const privacy='https://catalystrussia.ru/politika-confidencialnosti/';
 const catalog='https://maria177777773.github.io/catalyst-otchety/katalog/';
 const steps=[['Сколько человек будет на мероприятии?',['30–50','50–100','100–300','Больше 300']],['Что планируете?',['Тимбилдинг','Новогодний корпоратив','Корпоратив или выезд','Пока не решили']],['Когда мероприятие?',['В ближайший месяц','Через 1–3 месяца','Позже','Дата пока не известна']],['Какой бюджет на мероприятие?',['250–500 тыс. ₽','500 тыс. – 1 млн ₽','Больше 1 млн ₽','Пока не знаем']]];
 const titles={proposal:'Пришлём КП за 10 минут',catalog:'Каталог программ',quiz:'Куда прислать расчёт?'};
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function messengers(){return '<div class="lead-messengers"><a href="'+tg.href+'" target="_blank" rel="noopener">'+(iconFor(tg)?.outerHTML||'')+'Telegram</a><a href="'+max.href+'" target="_blank" rel="noopener">'+(iconFor(max)?.outerHTML||'')+'Max</a></div>'}
 function remember(){inner.querySelectorAll('input,textarea').forEach(e=>draft[e.name]=e.value)}
 function render(){
 const quiz=kind==='quiz';
 let markup='<div class="lead-eyebrow">Каталист · ваша команда, наше дело</div>';
 if(quiz)markup+='<div class="lead-progress-label">Шаг '+(step+1)+' из 5</div><div class="lead-progress" role="progressbar" aria-label="Прогресс расчёта" aria-valuemin="1" aria-valuemax="5" aria-valuenow="'+(step+1)+'"><span style="width:'+((step+1)*20)+'%"></span></div>';
 if(quiz&&step<4){markup+='<h2 id="concept-form-title">'+steps[step][0]+'</h2><div class="lead-options">'+steps[step][1].map((a,i)=>'<button class="lead-option'+(answers[step]===a?' is-selected':'')+'" type="button" data-answer="'+i+'">'+a+'<span aria-hidden="true">'+(answers[step]===a?'✓':'+')+'</span></button>').join('')+'</div><p class="lead-help">Четыре коротких вопроса — и мы сможем подобрать программу под вашу задачу.</p>';
 }else{
 markup+='<h2 id="concept-form-title">'+titles[kind]+'</h2>';
 if(kind==='proposal')markup+='<p class="lead-description">Напишите задачу, дату и число гостей — подготовим программу и смету. Отвечаем ежедневно с 8:00 до 22:00.</p>'+messengers()+'<div class="lead-divider">или оставьте заявку</div>';
 if(kind==='catalog')markup+='<p class="lead-description">Оставьте телефон, чтобы получить каталог. Менеджер поможет с выбором, если вы захотите обсудить программу.</p>';
 if(quiz)markup+='<div class="lead-summary">'+answers.map((a,i)=>'<button type="button" data-edit="'+i+'" title="Изменить ответ">'+escape(a)+'</button>').join('')+'</div>';
 markup+='<form class="lead-form">'+(kind!=='catalog'?'<label>Ваше имя <span>необязательно</span><input name="name" autocomplete="name" maxlength="100" placeholder="Как к вам обращаться" value="'+escape(draft.name)+'"></label>':'')+'<label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="30" placeholder="+7 (___) ___-__-__" value="'+escape(draft.phone)+'" aria-describedby="lead-status"></label>'+(kind==='proposal'?'<label>О мероприятии <span>необязательно</span><textarea name="comment" rows="3" maxlength="1000" placeholder="Дата, число гостей и что хотите организовать">'+escape(draft.comment)+'</textarea></label>':'')+'<div id="lead-status" class="lead-status" role="status" aria-live="polite"></div><button type="submit" class="lead-submit">'+(kind==='catalog'?'Получить каталог':quiz?'Получить расчёт':'Получить КП за 10 минут')+'</button><p class="lead-legal">Нажимая кнопку, вы соглашаетесь с <a href="'+privacy+'" target="_blank" rel="noopener">политикой конфиденциальности</a>.</p>'+(endpoint?'':'<p class="lead-demo-note">Демонстрационная форма: данные не отправляются.</p>')+'</form>';
 }
 if(quiz&&step>0)markup+='<button type="button" class="lead-back">Назад</button>';
 inner.innerHTML=markup;dialog.scrollTop=0;
 inner.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{answers[step]=steps[step][1][Number(b.dataset.answer)];step++;render();inner.querySelector('input,button')?.focus()});
 inner.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{remember();step=Number(b.dataset.edit);render()});
 inner.querySelector('.lead-back')?.addEventListener('click',()=>{remember();step--;render()});
 inner.querySelector('form')?.addEventListener('submit',submit);
 }
 async function submit(e){
 e.preventDefault();remember();const status=inner.querySelector('#lead-status'),phone=String(draft.phone||'');
 if(phone.replace(/\D/g,'').length<10||phone.replace(/\D/g,'').length>15){status.textContent='Проверьте номер телефона: нужно от 10 до 15 цифр.';inner.querySelector('[name="phone"]').setAttribute('aria-invalid','true');inner.querySelector('[name="phone"]').focus();return}
 inner.querySelector('[name="phone"]').removeAttribute('aria-invalid');
 if(!endpoint){status.textContent='Это демонстрация формы. Заявка не отправлена. Для связи используйте Telegram или Max.';if(!inner.querySelector('.lead-preview-actions')){const preview=document.createElement('div');preview.className='lead-preview-actions';preview.innerHTML=kind==='catalog'?'<a class="lead-submit" href="'+catalog+'" target="_blank" rel="noopener">Открыть каталог</a>':messengers();status.after(preview)}return}
 const button=inner.querySelector('[type="submit"]');button.disabled=true;status.textContent='Отправляем…';
 try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:draft.name||'',phone,comment:kind==='quiz'?answers.join(' · '):(draft.comment||''),program:kind==='catalog'?'Каталог программ':'Подбор программы',source:kind,page:location.pathname,referer:location.href,title:document.title})});const data=await res.json();if(!res.ok||data.ok!==true)throw Error('lead');inner.innerHTML='<div class="lead-eyebrow">Заявка принята</div><h2 id="concept-form-title">Спасибо! Мы свяжемся с вами.</h2><p>Отвечаем ежедневно с 8:00 до 22:00.</p>'+(kind==='catalog'?'<a class="lead-submit" href="'+catalog+'" target="_blank" rel="noopener">Открыть каталог</a>':'')}
 catch{status.textContent='Не удалось отправить заявку. Попробуйте ещё раз или позвоните +7 991 150-10-01.';button.disabled=false}
 }
 function open(type,trigger){kind=type;step=0;answers=[];draft={};opener=trigger;document.querySelectorAll('.mega-menu[open]').forEach(m=>m.open=false);if(typeof closeMobile==='function')closeMobile(false);if(typeof setSearch==='function')setSearch(false);render();dialog.showModal();document.body.classList.add('lead-is-open')}
 function close(){dialog.close()}
 dialog.querySelector('.lead-close').onclick=close;
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('lead-is-open');opener?.focus({preventScroll:true})});
 window.addEventListener('click',e=>{
 const trigger=e.composedPath().find(n=>n instanceof Element&&n.matches('a,button'));if(!trigger)return;
 const text=trigger.textContent.trim();let type=trigger.dataset.form;
 if(!type&&/Рассчитать стоимость|Рассчитать смету/.test(text))type='quiz';
 if(!type&&/Скачать каталог/.test(text))type='catalog';
 if(!type&&(/Получить КП|Подобрать за 10 минут|Помочь с выбором|Обсудить корпоратив|Обсудить мероприятие/.test(text)||text==='Связаться'))type='proposal';
 if(type){e.preventDefault();e.stopImmediatePropagation();open(type,trigger);return}
 const href=trigger.getAttribute('href');if(root&&href?.startsWith('#')&&href.length>1&&root.querySelector(href)){e.preventDefault();e.stopImmediatePropagation();const target=root.querySelector(href);if(target.closest('.st-body')){root.querySelector('.st-wrap').classList.add('open');root.querySelector('#stBtn').setAttribute('aria-expanded','true');root.querySelector('#stBtn').textContent='Свернуть'}target.scrollIntoView({behavior:'smooth'})}
 },true);
})();
