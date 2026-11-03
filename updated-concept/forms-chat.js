(() => {
  const $ = s => document.querySelector(s);
  const escape = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const telegram = $('.mv-ib-tg')?.href || 'https://telegram.me/irek_stn';
  const max = $('.mv-ib-max')?.href;
  const privacy = 'https://catalystrussia.ru/politika-confidencialnosti/';
  const endpoint = window.CATALYST_LEAD_ENDPOINT || (['catalystrussia.ru','www.catalystrussia.ru'].includes(location.hostname) ? '/api/lead/' : null);
  const contactIcon = name => {
    const brand = name === 'Telegram' ? 'tg' : name === 'Max' ? 'max' : name === 'Email' ? 'email' : 'phone';
    if(brand==='phone')return '<span class="cf-icon cf-icon--phone" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg></span>';
    const source = name === 'Telegram' ? document.querySelector('#s10 .contact-folder-actions a[href*="telegram"] svg') : name === 'Max' ? document.querySelector('#s10 .contact-folder-actions a[href*="max.ru"] svg') : null;
    const paths = name === 'Email' ? '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>' : '<path d="m8 3 3 5-3 3c1.5 2.5 3.5 4.5 6 6l3-3 4 3c0 3-2 4-4 4C10 20 4 14 3 7c0-2 2-4 5-4Z"/>';
    return `<span class="cf-icon cf-icon--${brand}" aria-hidden="true">${source ? source.outerHTML : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`}</span>`;
  };
  const messengerLinks = () => `<div class="cf-messengers"><a data-messenger="Telegram" href="${telegram}" target="_blank" rel="noopener">${contactIcon('Telegram')}Telegram</a>${max ? `<a data-messenger="Max" href="${max}" target="_blank" rel="noopener">${contactIcon('Max')}Max</a>` : ''}</div>`;
  const modal = document.createElement('dialog');
  modal.id = 'contact-dialog'; modal.setAttribute('aria-labelledby', 'cf-title');
  modal.innerHTML = '<button type="button" class="cf-close" aria-label="Закрыть форму"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><div class="cf-content"></div>';
  document.body.append(modal);
  const content = modal.querySelector('.cf-content');
  // Keep phone formatting independent of the current form or selected channel.
  function formatPhone(value) {
    let digits = value.replace(/\D/g, '');
    if (/^[78]/.test(digits)) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    if (!digits) return '';
    let result = '+7 (' + digits.slice(0, 3);
    if (digits.length >= 3) result += ') ';
    if (digits.length > 3) result += digits.slice(3, 6);
    if (digits.length > 6) result += '-' + digits.slice(6, 8);
    if (digits.length > 8) result += '-' + digits.slice(8, 10);
    return result;
  }
  content.addEventListener('keydown', e => {
    const input = e.target;
    if (!input.matches('input[type="tel"]') || !['Backspace','Delete'].includes(e.key)) return;
    const start = input.selectionStart, end = input.selectionEnd;
    if (start !== end) return;
    // Delete the adjacent digit, even when the caret is beside a mask separator.
    if (e.key === 'Backspace' && start > 0 && /\D/.test(input.value[start-1])) {
      let from = start-1;
      while (from > 0 && /\D/.test(input.value[from])) from--;
      input.setSelectionRange(from, end);
    } else if (e.key === 'Delete' && /\D/.test(input.value[start] || '')) {
      let to = start;
      while (to < input.value.length && /\D/.test(input.value[to])) to++;
      input.setSelectionRange(start, to+1);
    }
  });
  content.addEventListener('input', e => {
    const input = e.target;
    if (!input.matches('input[type="tel"]')) return;
    const raw = input.value, position = input.selectionStart;
    const digitsBefore = raw.slice(0, position).replace(/\D/g, '').length;
    const hadPrefix = /^[78]/.test(raw.replace(/\D/g, ''));
    const formatted = formatPhone(raw);
    input.value = formatted;
    let caret = formatted.length;
    if (position < raw.length && formatted) {
      const target = digitsBefore + (hadPrefix ? 0 : 1);
      let seen = 0;
      for (let i=0;i<formatted.length;i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen >= target) { caret=i+1; break; }
      }
    }
    input.setSelectionRange(caret, caret);
  });
  document.addEventListener('keydown', e => { if(e.key==='Tab'){modal.classList.add('cf-keyboard-focus');document.body.classList.add('using-keyboard');} });
  document.addEventListener('pointerdown',()=>document.body.classList.remove('using-keyboard'),true);
  modal.addEventListener('pointerdown', () => modal.classList.remove('cf-keyboard-focus'));
  let opener, mode = 'proposal', context = '', step = 0;
  const drafts = {};
  const mobileOffers = matchMedia('(max-width:1100px)');
  function syncOfferStep(focus = false) {
    if(mode !== 'offers') return;
    const choosing = mobileOffers.matches && modal.dataset.offerStep !== 'contact';
    modal.setAttribute('aria-labelledby', choosing ? 'cf-offer-title' : 'cf-title');
    if(focus){
      const target = choosing ? content.querySelector(`[data-offer="${draft().offerIndex||0}"]`) : content.querySelector('#cf-title');
      target?.focus({preventScroll:true});
      (matchMedia('(max-width:700px)').matches ? modal : (modal.querySelector('.popup-form-surface') || modal)).scrollTop = 0;
    }
  }
  mobileOffers.addEventListener('change',()=>{if(modal.open)syncOfferStep();});

  const offers = [
    {label:'−10% в будний день',art:'foodtruck',tab:'Будний день',title:'Команда собирается — цена приятнее',benefit:'−10%',copy:'На тимбилдинг с понедельника по четверг для команды от 30 человек.',detail:'Пример предложения: скидка на программу, без аренды площадки и дополнительных услуг.'},
    {label:'Фото в подарок',art:'pizza',tab:'Фото в подарок',title:'Общие моменты останутся с вами',benefit:'Фотоотчёт',copy:'Два часа работы фотографа в подарок к командной программе от 50 участников.',detail:'Пример предложения: готовые фотографии после мероприятия для вашей команды.'},
    {label:'−15% на вторую программу',art:'tower',tab:'Две программы',title:'Больше впечатлений за один день',benefit:'−15%',copy:'На вторую программу, если проводите обе на одном мероприятии.',detail:'Пример предложения: объедините активный тимбилдинг и творческий мастер-класс.'}
  ];
  // Use the same offer content and selection IDs in menus and the dialog.
  function mountMenuOffers(){
    document.querySelectorAll('.monthly-offers,.mobile-nav-offers').forEach(trigger=>{
      if(trigger.nextElementSibling?.classList.contains('menu-offer-slider'))return;
      const slider=document.createElement('section');
      slider.className='menu-offer-slider';slider.setAttribute('aria-label','Акции');
      slider.innerHTML=`<div class="menu-offer-track">${offers.map((o,i)=>`<button type="button" class="menu-offer-card" data-form="offers" data-offer-index="${i}" aria-haspopup="dialog"><img src="assets/figma-hero-slides/${o.art}.png" alt=""><strong>${o.label}</strong><span class="menu-offer-description">${o.copy}</span></button>`).join('')}</div><nav class="menu-offer-pagination" aria-label="Выбрать акцию">${offers.map((o,i)=>`<button type="button" aria-label="Акция ${i+1}: ${o.label}"><span aria-hidden="true"></span></button>`).join('')}</nav>`;
      trigger.after(slider);
      const track=slider.querySelector('.menu-offer-track'),cards=[...track.children];
      const pagination=slider.querySelector('.menu-offer-pagination'),dots=[...pagination.children];
      const reduced=matchMedia('(prefers-reduced-motion: reduce)');
      let current=0,elapsed=0,touch=false,scrolling=false,settle;
      function update(){
        const active=track.clientWidth?Math.min(cards.length-1,Math.max(0,Math.round(track.scrollLeft/track.clientWidth))):0;
        if(active!==current){current=active;elapsed=0;}
        dots.forEach((dot,i)=>{if(i===current)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
        pagination.style.setProperty('--slide-progress',String(elapsed/5500));
      }
      function move(index){elapsed=0;track.scrollTo({left:index*track.clientWidth,behavior:reduced.matches||index===0?'instant':'smooth'});update();}
      dots.forEach((dot,i)=>dot.onclick=()=>move(i));
      track.addEventListener('scroll',()=>{scrolling=true;elapsed=0;update();clearTimeout(settle);settle=setTimeout(()=>{scrolling=false},180);},{passive:true});
      let drag=null,suppressClick=false;
      track.addEventListener('pointerdown',event=>{
        if(!event.isPrimary||event.button!==0)return;
        suppressClick=false;touch=true;
        drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:track.scrollLeft,horizontal:false};
      });
      track.addEventListener('pointermove',event=>{
        if(!drag||drag.id!==event.pointerId)return;
        const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
        if(!drag.horizontal){
          if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
          if(Math.abs(dy)>Math.abs(dx)){drag=null;return;}
          drag.horizontal=true;suppressClick=true;
          track.setPointerCapture(event.pointerId);
          track.style.scrollSnapType='none';
        }
        track.scrollLeft=drag.left-dx;
      });
      function endDrag(event){
        if(!drag||drag.id!==event.pointerId)return;
        const moved=drag.horizontal,dx=event.clientX-drag.x,start=drag.left;
        drag=null;touch=false;elapsed=0;track.style.scrollSnapType='';
        if(track.hasPointerCapture(event.pointerId))track.releasePointerCapture(event.pointerId);
        if(moved){
          const index=Math.round(start/track.clientWidth)+(Math.abs(dx)>35?(dx<0?1:-1):0);
          move(Math.max(0,Math.min(cards.length-1,index)));
          setTimeout(()=>{suppressClick=false},0);
        }
      }
      track.addEventListener('pointerup',endDrag);
      track.addEventListener('pointercancel',endDrag);
      track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();}},true);
      track.addEventListener('dragstart',event=>event.preventDefault());
      slider.addEventListener('pointerdown',()=>{touch=true});
      slider.addEventListener('pointerup',()=>{touch=false;elapsed=0});
      slider.addEventListener('pointercancel',()=>{touch=false});
      slider.addEventListener('pointerleave',()=>{touch=false});
      const timer=setInterval(()=>{
        if(!slider.isConnected){clearInterval(timer);return;}
        const rect=track.getBoundingClientRect();
        const visible=rect.width>0&&rect.top<innerHeight&&rect.bottom>0&&getComputedStyle(track).visibility!=='hidden';
        if(!visible||document.hidden||reduced.matches||touch||scrolling||slider.matches(':hover')||slider.querySelector(':focus-visible')||document.querySelector('dialog[open]:not(.mobile-sheet)'))return;
        elapsed+=100;pagination.style.setProperty('--slide-progress',String(Math.min(elapsed/5500,1)));
        if(elapsed>=5500)move((current+1)%cards.length);
      },100);
      update();
    });
  }
  mountMenuOffers();
  new MutationObserver(mountMenuOffers).observe(document.body,{childList:true,subtree:true});
  // Questions and order from catalystrussia.ru's cost calculator.
  const questions = [
    ['Сколько человек будет на мероприятии?', ['30–50', '50–100', '100–300', 'Больше 300']],
    ['Что планируете?', ['Тимбилдинг', 'Новогодний корпоратив', 'Корпоратив или выезд', 'Пока не решили']],
    ['Когда мероприятие?', ['В ближайший месяц', 'Через 1–3 месяца', 'Позже', 'Дата пока не известна']],
    ['Какой бюджет на мероприятие?', ['250–500 тыс. ₽', '500 тыс. – 1 млн ₽', 'Больше 1 млн ₽', 'Пока не знаем']]
  ];
  const answerLabels = ['Участников', 'Формат', 'Когда', 'Бюджет'];
  const draft = () => drafts[mode] ||= {answers: [], channel: 'Телефон'};
  function remember() { content.querySelectorAll('[name]').forEach(el => { if (el.type !== 'checkbox' && (el.type !== 'radio' || el.checked)) draft()[el.name] = el.value; }); }
  function buildMessage() {
    remember();
    const d = draft();
    return [mode === 'catalog' ? 'Здравствуйте! Хочу получить каталог программ.' : mode === 'offers' ? 'Здравствуйте! Хочу обсудить предложение для команды.' : 'Здравствуйте! Помогите подобрать программу и рассчитать стоимость.',
      (context || d.answers[1]) && 'Формат: ' + (context || d.answers[1]),
      (d.people || d.answers[0]) && 'Участников: ' + (d.people || d.answers[0]),
      d.answers[2] && 'Когда: ' + d.answers[2],
      d.answers[3] && 'Бюджет: ' + d.answers[3],
      d.name?.trim() && 'Меня зовут ' + d.name.trim() + '.',
      d.comment?.trim() && 'Пожелания: ' + d.comment.trim(),
      d.contact?.trim() && d.channel + ': ' + d.contact.trim()
    ].filter(Boolean).join('\n');
  }
  function telegramDraft(message) {
    const url = new URL(telegram);
    url.hostname = 't.me';
    url.searchParams.set('text', message);
    return url.href;
  }
  content.addEventListener('click', e => {
    const link = e.target.closest('[data-messenger]');
    if (!link) return;
    if (link.dataset.messenger === 'Telegram') {
      link.href = telegramDraft(buildMessage());
      return;
    }
    e.preventDefault();
    showMax(buildMessage());
  });
  async function showMax(message) {
    modal.classList.remove('cf-offers');
    content.innerHTML = `<h2 id="cf-title">Продолжим в Max</h2><p class="cf-intro" role="status">Копируем ваши ответы…</p><a class="cf-primary" href="${max}" target="_blank" rel="noopener">Открыть Max</a><button type="button" class="cf-text" id="cf-edit">Назад</button>`;
    content.querySelector('#cf-edit').onclick=render;
    const status=content.querySelector('.cf-intro');
    try {
      await navigator.clipboard.writeText(message);
      status.textContent='Ваши ответы скопированы. Вставьте их в чат и отправьте сообщение.';
    } catch {
      status.textContent='Скопируйте текст и вставьте его в чат.';
      status.insertAdjacentHTML('afterend',`<label class="cf-field">Ваше сообщение<textarea rows="5">${escape(message)}</textarea></label>`);
      const area=content.querySelector('textarea');area.focus();area.select();
    }
  }
  function close() { modal.close(); }
  modal.querySelector('.cf-close').onclick = close;
  modal.addEventListener('click', e => { if (e.target === modal) { const r = modal.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
  modal.addEventListener('close', () => { document.body.classList.remove('cf-modal-open'); remember(); opener?.focus({preventScroll:true}); });
  function open(kind, trigger, selected = '') {
    mode = kind; opener = trigger; context = kind === 'quiz' ? '' : selected; step = 0;
    if(kind==='offers' && trigger?.hasAttribute('data-offer-index')){
      const index=Number(trigger.dataset.offerIndex);
      if(Number.isInteger(index)&&index>=0&&index<offers.length){draft().offerIndex=index;draft().offerChosen=true;}
    }
    modal.dataset.offerStep = kind==='offers' && trigger?.hasAttribute('data-offer-index') ? 'contact' : 'select';
    modal.setAttribute('aria-labelledby','cf-title');
    modal.classList.remove('cf-catalog-banner');
    modal.classList.toggle('cf-cost-quiz', kind === 'quiz');
    modal.classList.toggle('cf-offers', kind === 'offers');
    document.querySelectorAll('.mega-menu[open]').forEach(el => el.open = false);
    if(typeof closeMobile === 'function') closeMobile(false);
    if(typeof setSearch === 'function') setSearch(false);
    chat.hidden = true; launcher.setAttribute('aria-expanded','false');
    render(); modal.showModal(); document.body.classList.add('cf-modal-open');
  }
  function field(name, label, placeholder, type = 'text', extra = '') { return `<label class="cf-field cf-floating-field"><input name="${name}" type="${type}" aria-label="${label}" placeholder=" " value="${escape(draft()[name])}" ${extra}><span class="cf-floating-label">${label}</span></label>`; }
  let quizResize;
  function renderQuiz() {
    quizResize?.disconnect();
    const d = draft();
    d.channel = 'Телефон';
    const firstUnanswered = questions.findIndex((_, i) => !d.answers[i]);
    const availableStep = firstUnanswered < 0 ? questions.length : firstUnanswered;
    const heading = step < questions.length ? questions[step][0] : 'Куда прислать расчёт?';
    let html = `<div class="cf-quiz-promise"><h2>Заполните короткий бриф — пришлём КП за 10 минут</h2><p>Ответьте на несколько вопросов о мероприятии — подберём программы и рассчитаем стоимость.</p></div><div class="cf-quiz-body"><h2 id="cf-title" tabindex="-1" ${step===questions.length?'hidden':''}>${heading}</h2><ol class="cf-progress-steps" aria-label="Шаги расчёта стоимости">${['Участники','Формат','Дата','Бюджет','Контакты'].map((label,i)=>`<li><button type="button" data-step="${i}" ${i>availableStep?'disabled':''} class="${i<=step?'is-filled':''}" ${i===step?'aria-current="step"':''}><span class="cf-progress-segment" aria-hidden="true"></span>${label}</button></li>`).join('')}</ol><p class="cf-step">Шаг ${step + 1} из 5</p>`;
    if (step < questions.length) {
      html += `<div class="cf-options">${questions[step][1].map(a=>`<button type="button" aria-pressed="${d.answers[step]===a}" data-answer="${a}">${a}</button>`).join('')}</div>`;
    } else {
      html += `<section class="cf-selection" aria-label="Ваш выбор"><dl>${['Участники','Формат','Когда','Бюджет'].map((label,i)=>`<div><dt>${label}</dt><dd>${d.answers[i] ? `<span class="cf-context-accent">${escape(d.answers[i])}</span>` : 'Пока не выбрано'}</dd></div>`).join('')}</dl></section><form class="cf-form" novalidate><input type="radio" name="channel" value="Телефон" checked hidden>${field('contact','Телефон','+7 (___) ___-__-__','tel','required autocomplete="tel" inputmode="tel" maxlength="25" aria-describedby="cf-error"')}<p id="cf-error" class="cf-error" role="alert"></p><label class="cf-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><button class="cf-primary" type="submit">Получить расчёт</button></form>`;
    }
    if (step === questions.length) html += `<div class="cf-divider">Или напишите нам напрямую</div>${messengerLinks()}`;
    content.innerHTML = html + '</div>';
    const move = next => { const missing = questions.findIndex((_, i) => !d.answers[i]); if(next > (missing < 0 ? questions.length : missing)) return; remember(); step = next; renderQuiz(); content.querySelector(step===questions.length?'[name="contact"]':'#cf-title').focus({preventScroll:true}); (matchMedia('(max-width:700px)').matches ? modal : (modal.querySelector('.popup-form-surface') || modal)).scrollTop = 0; };
    const options=content.querySelector('.cf-options');
    if(options){
      const measure=document.createElement('canvas').getContext('2d');
      const fit=()=>{
        if(!options.clientWidth)return;
        const gap=parseFloat(getComputedStyle(options).columnGap)||0;
        const available=(options.clientWidth-gap)/2;
        const stack=[...options.children].some(button=>{const style=getComputedStyle(button);measure.font=style.font;return measure.measureText(button.textContent).width+parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)>available;});
        options.classList.toggle('cf-options-stacked',stack);
      };
      quizResize=new ResizeObserver(fit);quizResize.observe(options);
      document.fonts.ready.then(()=>{if(options.isConnected)fit();});
    }
    content.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>move(Number(b.dataset.step)));
    const telegramLink = content.querySelector('[data-messenger="Telegram"]');
    if (telegramLink) telegramLink.href=telegramDraft(buildMessage());
    content.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{d.answers[step]=b.dataset.answer;move(step+1);});
    const form = content.querySelector('form');
    if (form) {
      form.onsubmit=submit;
      form.querySelector('[name="contact"]').oninput=e=>{e.target.removeAttribute('aria-invalid');content.querySelector('#cf-error').textContent='';};
    }
  }
  function render() {
    quizResize?.disconnect();
    const d = draft();
    modal.classList.toggle('cf-offers',mode==='offers');
    if(mode==='offers'){
      context='Пример акции: '+offers[d.offerIndex||0].tab;
      if(d.channel!=='Телефон')d.contact='';
      d.channel='Телефон';
    }
    let html = '';
    if (mode === 'catalog') {
      if(!['Telegram','Max'].includes(d.channel)){d.channel='Telegram';d.contact='';}
      content.innerHTML = `<div class="cf-quiz-promise"><h2 id="cf-title">Пришлём каталог программ</h2><p class="cf-catalog-description">Выберите Telegram или Max и оставьте контакт — отправим каталог, чтобы вы могли удобно посмотреть все программы и обсудить их с коллегами.</p></div><div class="cf-quiz-body cf-catalog-body"><form class="cf-form" novalidate><fieldset class="cf-channels"><legend>Куда прислать каталог?</legend><div class="cf-channel-options">${['Telegram','Max'].map(c=>`<label><input type="radio" name="channel" value="${c}" ${d.channel===c?'checked':''}><span>${contactIcon(c)}${c}</span></label>`).join('')}</div></fieldset>${field('contact',d.channel==='Telegram'?'Ваш Telegram — @username':'Номер телефона в Max',d.channel==='Telegram'?'@username':'+7 (999) 123-45-67',d.channel==='Telegram'?'text':'tel','required maxlength="40" aria-describedby="cf-error"')}<p id="cf-error" class="cf-error" role="alert"></p><label class="cf-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><button class="cf-primary" type="submit">Получить каталог</button></form></div>`;
      content.querySelector('form').onsubmit=submit;
      content.querySelectorAll('[name="channel"]').forEach(r=>r.onchange=()=>{d.channel=r.value;d.contact='';render();addCatalogArtwork();});
      content.querySelector('[name="contact"]').oninput=e=>{e.target.removeAttribute('aria-invalid');content.querySelector('#cf-error').textContent='';};
      return;
    }
    if (mode === 'quiz') { renderQuiz(); return; }
    if (mode !== 'quiz') html += `<h2 id="cf-title" tabindex="-1">${mode==='offers'?'Обсудим предложение':context ? 'Обсудим ваше событие' : 'Подберём программу'}</h2>`;
    if(context && mode!=='offers') {
      const card=opener?.closest('.ny-folder');
      const photo=card?.querySelector('.ny-photo img');
      html += photo ? `<div class="cf-program-selection"><img src="${escape(photo.getAttribute('src'))}" alt=""><div><h3><span class="cf-context-accent">${escape(card.querySelector('h3').textContent)}</span></h3><p>${escape(card.querySelector('.ny-tab').textContent)}</p></div></div>` : `<div class="cf-context"><span class="cf-context-accent">${escape(context)}</span></div>`;
    }
    html += `<form class="cf-form" novalidate>${mode==='offers' ? '<input type="radio" name="channel" value="Телефон" checked hidden>' : `<fieldset class="cf-channels"><legend>Способ связи</legend><div class="cf-channel-options">${['Телефон','Telegram','Max'].map(c=>`<label><input type="radio" name="channel" value="${c}" ${d.channel===c?'checked':''}><span>${contactIcon(c)}${c}</span></label>`).join('')}</div></fieldset>`}<label class="cf-field cf-floating-field"><input name="contact" required maxlength="150" placeholder=" " aria-labelledby="cf-contact-label" aria-describedby="cf-error" value="${escape(d.contact)}"><span id="cf-contact-label" class="cf-floating-label">${d.channel==='Telegram'?'Ваш Telegram — @username':d.channel==='Max'?'Номер телефона в Max':'Номер телефона'}</span></label><p id="cf-error" class="cf-error" role="alert"></p><label class="cf-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><button class="cf-primary" type="submit">Отправить заявку </button></form><div class="cf-divider">Или напишите нам напрямую</div>${messengerLinks()}`;
    content.innerHTML = html;
    if(mode==='offers') {
      const contact=document.createElement('div');contact.className='cf-offer-contact';
      contact.append(...content.childNodes);content.append(contact);
      content.insertAdjacentHTML('afterbegin',`<section class="cf-offer-showcase" aria-label="Специальные предложения"><div class="cf-offer-heading"><h3 id="cf-offer-title">Выберите свой бонус</h3></div><div id="cf-offer-track" class="cf-offer-cards" role="group" aria-label="Выберите акцию">${offers.map((o,i)=>`<button type="button" class="cf-offer-card cf-offer-card-${i}" data-offer="${i}" aria-pressed="false"><img src="assets/figma-hero-slides/${o.art}.png" alt=""><strong>${o.label}</strong><span class="cf-offer-card-copy">${o.copy}</span><span class="cf-offer-card-select">Выбрать акцию</span></button>`).join('')}</div></section>`);
      contact.querySelector('h2').insertAdjacentHTML('afterend','<p class="cf-offer-selected" aria-live="polite"><span class="cf-context-accent"></span></p>');
      const selectOffer=i=>{
        d.offerIndex=i;const offer=offers[i];context='Пример акции: '+offer.tab+' — '+offer.benefit;
        content.querySelector('.cf-offer-selected .cf-context-accent').textContent=offer.tab+' · '+offer.benefit;
        content.querySelectorAll('[data-offer]').forEach((card,j)=>{card.setAttribute('aria-pressed',String(j===i));card.querySelector('.cf-offer-card-select').textContent=j===i?'Выбрано':'Выбрать акцию';});
        content.querySelectorAll('[data-messenger="Telegram"]').forEach(link=>link.href=telegramDraft(buildMessage()));
      };
      content.querySelectorAll('[data-offer]').forEach(card=>{card.onclick=()=>{d.offerChosen=true;selectOffer(Number(card.dataset.offer));if(mobileOffers.matches){modal.dataset.offerStep='contact';syncOfferStep(true);}};});
      const offerHeading=document.createElement('div');offerHeading.className='cf-offer-contact-heading';
      const back=document.createElement('button');back.type='button';back.className='mobile-back cf-offer-back';back.setAttribute('aria-label','Назад к акциям');
      back.innerHTML=document.querySelector('.mobile-sheet .mobile-back').innerHTML;
      const title=contact.querySelector('h2');title.before(offerHeading);offerHeading.append(back,title);
      contact.querySelector('.cf-offer-back').onclick=()=>{
        modal.dataset.offerStep='select';syncOfferStep(true);
      };
      selectOffer(d.offerIndex||0);
      if(mobileOffers.matches && !d.offerChosen){content.querySelectorAll('[data-offer]').forEach(card=>{card.setAttribute('aria-pressed','false');card.querySelector('.cf-offer-card-select').textContent='Выбрать акцию';});}
      syncOfferStep();

    }
    const input = content.querySelector('[name="contact"]');
    const submitButton = content.querySelector('[type="submit"]');
    const refreshLinks=()=>{
      const href=telegramDraft(buildMessage());
      content.querySelectorAll('[data-messenger="Telegram"]').forEach(link=>link.href=href);
    };
    content.querySelector('form').addEventListener('input',refreshLinks);
    function channel() {
      const c = content.querySelector('[name="channel"]:checked').value; d.channel=c;
      input.type=c==='Telegram'?'text':'tel'; input.inputMode=c==='Telegram'?'text':'tel'; input.autocomplete=c==='Telegram'?'off':'tel';
      input.placeholder=' ';
      content.querySelector('#cf-contact-label').textContent=c==='Telegram'?'Ваш Telegram — @username':c==='Max'?'Номер телефона в Max':'Номер телефона';
      input.removeAttribute('aria-invalid'); content.querySelector('#cf-error').textContent='';
      input.closest('.cf-field').hidden=false;
      input.required=true;
      content.querySelector('.cf-consent').hidden=false;
      submitButton.hidden=false;
      submitButton.textContent='Отправить заявку';
      content.querySelector('.cf-divider').hidden=false;
      content.querySelector('.cf-messengers').hidden=false;
      refreshLinks();
    }
    channel(); content.querySelectorAll('[name="channel"]').forEach(r=>r.onchange=()=>{input.value='';channel();});
    content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{remember();step=+b.dataset.edit;render();});
    content.querySelector('form').onsubmit=submit;
    input.oninput=()=>{input.removeAttribute('aria-invalid');content.querySelector('#cf-error').textContent='';};
  }
  function showCatalog() {
    content.innerHTML = `<h2 id="cf-title">Запрос отправлен</h2><p class="cf-intro">Пришлём каталог в ${escape(draft().channel)} по указанному контакту.</p>`;
  }
  async function submit(e) {
    e.preventDefault(); remember(); const d=draft(); d.channel=content.querySelector('[name="channel"]:checked').value;
    if(mode==='quiz'){const missing=questions.findIndex((_,i)=>!d.answers[i]);if(missing>=0){step=missing;renderQuiz();return;}}
    const input=content.querySelector('[name="contact"]'), value=input.value.trim(), digits=value.replace(/\D/g,'');
    const phone=/^7\d{10}$/.test(digits);
    const valid=(d.channel==='Телефон'||d.channel==='Max')?phone:d.channel==='Email'?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value):/^@?[a-zA-Z][\w]{4,31}$/.test(value);
    const error=content.querySelector('#cf-error');
    if(!valid) {error.textContent=d.channel==='Email'?'Укажите почту в формате name@company.ru.':d.channel==='Telegram'?'Укажите ник Telegram: от 5 до 32 латинских букв, цифр или знаков подчёркивания. Первый символ — буква.':'Введите номер полностью: +7 (999) 123-45-67.';input.setAttribute('aria-invalid','true');input.focus();return;}
    const people=content.querySelector('[name="people"]'); if(people && !people.checkValidity()){people.reportValidity();return;}
    if(!content.querySelector('[name="consent"]').checked){error.textContent='Подтвердите согласие на обработку данных.';content.querySelector('[name="consent"]').focus();return;}
    if(d.channel==='Telegram'){d.contact='@'+value.replace(/^@/,'');input.value=d.contact;}
    const message=buildMessage();
    if(endpoint) {
      const button=content.querySelector('[type="submit"]');button.disabled=true;button.textContent='Отправляем…';
      try {const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:d.name,phone:d.channel==='Телефон'?value:'',contact:value,channel:d.channel,comment:message,program:context||(mode==='catalog'?'Каталог программ':'Подбор программы'),source:mode,page:location.pathname}),signal:AbortSignal.timeout(15000)});const data=await res.json();if(!res.ok||data.ok!==true)throw Error();if(mode==='catalog'){showCatalog();delete drafts[mode];return;}content.innerHTML='<p class="cf-kicker">Запрос отправлен</p><h2 id="cf-title">Спасибо! Обсудим ваши планы.</h2><p class="cf-intro">Свяжемся с вами выбранным способом. Работаем ежедневно с 8:00 до 22:00.</p>';delete drafts[mode];}
      catch {error.textContent=mode==='catalog'?'Не удалось отправить запрос. Контакт сохранён в форме — попробуйте ещё раз.':'Не удалось отправить запрос. Данные сохранены в форме. Попробуйте ещё раз или напишите нам в мессенджере.';button.disabled=false;button.textContent='Попробовать ещё раз';}return;
    }
    error.textContent='Отправка заявок пока не подключена. Вы можете написать нам в мессенджере.';
  }
  const chat=document.createElement('aside'); chat.id='catalyst-chat';chat.hidden=true;chat.setAttribute('aria-labelledby','chat-title');
  chat.innerHTML=`<div class="chat-paper"><div class="chat-header"><span class="chat-avatar"><img src="assets/chat-vlad.webp" alt="Влад"><i class="chat-status" aria-hidden="true"></i></span><div><strong>Влад · Каталист</strong><span>Ежедневно, 8:00–22:00 мск</span></div><button class="cf-close" aria-label="Закрыть чат" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="chat-message"><h2 id="chat-title">Помогу выбрать программу</h2></div></div><div class="chat-bottom"><p>Ответьте на несколько вопросов на сайте.</p><button class="action-black chat-request" type="button" data-form="quiz">Подобрать программу</button><p>Или напишите мне в Telegram или Max — отвечу в течение 2 минут.</p>${messengerLinks()}</div>`;
  const launcher=document.createElement('button');launcher.type='button';launcher.id='chat-launcher';launcher.setAttribute('aria-label','Открыть чат с Каталист');launcher.setAttribute('aria-controls','catalyst-chat');launcher.setAttribute('aria-expanded','false');
  launcher.innerHTML='<span class="chat-avatar"><img src="assets/chat-vlad.webp" alt="Влад" width="40" height="40"><i class="chat-status" aria-hidden="true"></i></span><span>Задать вопрос</span>';
  document.body.append(chat,launcher);
  window.mountCatalystChatQuiz({questions,answerLabels,endpoint,privacy,messengerLinks,telegramDraft,escape,formatPhone,contactIcon});
  const scrollOffer=document.createElement('aside');
  scrollOffer.id='scroll-offer';scrollOffer.hidden=true;scrollOffer.setAttribute('aria-label','Специальное предложение');
  scrollOffer.innerHTML=`<button type="button" class="scroll-offer-open" data-form="offers" aria-haspopup="dialog"><strong>Посмотреть<br>акции</strong><svg class="offers-art" preserveAspectRatio="xMidYMin meet" viewBox="0 0 76 76" fill="none" aria-hidden="true"><path d="M24 0v20m-5 7v-7h10v7M57 0v32m-5 7v-7h10v7" stroke="#11743e" stroke-width="2"/><circle cx="24" cy="44" r="19" fill="#ffdf4a" stroke="#11743e" stroke-width="2"/><path d="M6 40q18 13 36 0M11 56q13-9 26 0" stroke="#11743e" stroke-width="2"/><circle cx="57" cy="56" r="16" fill="#e3f3e9" stroke="#11743e" stroke-width="2"/><path d="M57 44v24M45 56h24M49 48l16 16m0-16L49 64" stroke="#11743e" stroke-width="2"/></svg></button><button type="button" class="scroll-offer-close" aria-label="Скрыть карточку акции"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>`;
  document.body.append(scrollOffer);
  let offerDismissed=false,offerFrame=0;
  function updateScrollOffer(){offerFrame=0;scrollOffer.hidden=offerDismissed||scrollY<180;}
  scrollOffer.querySelector('.scroll-offer-close').onclick=()=>{offerDismissed=true;updateScrollOffer();launcher.focus({preventScroll:true});};
  addEventListener('scroll',()=>{if(!offerFrame)offerFrame=requestAnimationFrame(updateScrollOffer);},{passive:true});
  updateScrollOffer();

  function updateChatHours(){
    const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
    const working=hour>=8&&hour<22;
    [chat,launcher].forEach(el=>{el.classList.toggle('chat-working',working);el.querySelector('.chat-avatar').title=working?'Рабочее время: 8:00–22:00 по Москве':'Вне рабочего времени. Ответим с 8:00 по Москве';});
  }
  updateChatHours();setInterval(updateChatHours,60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateChatHours();});
  function toggleChat(show){chat.hidden=!show;launcher.setAttribute('aria-expanded',String(show));launcher.setAttribute('aria-label',show?'Закрыть чат с Каталист':'Открыть чат с Каталист');if(show)(chat.querySelector('#chat-title').setAttribute('tabindex','-1'),chat.querySelector('#chat-title').focus({preventScroll:true}));else launcher.focus({preventScroll:true});}
  launcher.onclick=()=>toggleChat(chat.hidden);chat.querySelector('.cf-close').onclick=()=>toggleChat(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!chat.hidden){toggleChat(false);}});
  document.addEventListener('click',e=>{if(!chat.hidden&&!chat.contains(e.target)&&!launcher.contains(e.target)) {chat.hidden=true;launcher.setAttribute('aria-expanded','false');}});
  document.addEventListener('catalyst:catalog-invite',()=>{
    open('catalog',document.activeElement);
    modal.classList.add('cf-catalog-banner');
    addCatalogArtwork();
  });
  function addCatalogArtwork(){
    if(!modal.classList.contains('cf-catalog-banner')||content.querySelector('.cf-catalog-art'))return;
    const art=document.querySelector('#catalog-download .cfb-design-art')?.cloneNode(true);
    if(art){art.className='cf-catalog-art';content.append(art);}
  }
  let exitCatalogShown=false;
  const exitReadyAt=Date.now()+12000;
  document.addEventListener('mouseleave',event=>{
    if(exitCatalogShown||Date.now()<exitReadyAt||event.clientY>0||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    if(document.querySelector('dialog[open],#catalyst-chat:not([hidden]),#chat-quiz:not([hidden])')||document.body.classList.contains('mobile-menu-open')||document.activeElement?.matches('input,textarea,select'))return;
    exitCatalogShown=true;open('catalog',document.activeElement);
  });
  window.addEventListener('click',e=>{
    const trigger=e.composedPath().find(n=>n instanceof Element&&n.matches('a,button'))
      || (e.target instanceof Element && e.target.closest('#catalog-download')?.querySelector('[data-form="catalog"]'));if(!trigger)return;
    const text=trigger.textContent.trim();let kind=trigger.dataset.form;
    if(trigger.hasAttribute('data-brief')) kind='proposal';
    if(/Рассчитать стоимость|Рассчитать смету|Подобрать программу|Получить КП/.test(text))kind='quiz';
    if(/Скачать каталог/.test(text))kind='catalog';
    if(/Помочь с выбором|Обсудить корпоратив|Обсудить мероприятие/.test(text))kind='proposal';
    if(trigger.id==='offers-trigger'||trigger.getAttribute('href')==='#offers-preview'||trigger.classList.contains('monthly-offers'))kind='offers';
    if(!['proposal','quiz','catalog','offers'].includes(kind))return;
    e.preventDefault();e.stopImmediatePropagation();
    const selected=trigger.dataset.brief|| (trigger.id==='offers-trigger'?'Интересуют специальные предложения':text==='Обсудить корпоратив'?'Корпоратив под ключ':'');
    open(kind,trigger,selected);
  },true);
  const newsletter=$('.footer-newsletter');
  if(newsletter){
    newsletter.querySelector('button').textContent='Подписаться';
    newsletter.querySelector('#newsletter-privacy').innerHTML = '<label class="cf-consent"><input type="checkbox" required><span>Хочу получать новости и идеи мероприятий. Согласен с <a href="'+privacy+'" target="_blank" rel="noopener">политикой конфиденциальности</a>.</span></label>';
    newsletter.insertAdjacentHTML('beforeend','<p class="newsletter-result" role="status"></p>');
    newsletter.onsubmit=e=>{e.preventDefault();const email=new FormData(newsletter).get('email');const result=newsletter.querySelector('.newsletter-result');result.innerHTML=`<span>Подтвердите подписку письмом:</span> <a href="mailto:info@catalystrussia.ru?subject=${encodeURIComponent('Подписка на новости Каталист')}&body=${encodeURIComponent('Хочу получать новости и идеи мероприятий Каталист на адрес '+email+'.')}" class="cf-text">Открыть письмо</a><small>Подписка начнётся после обработки запроса.</small>`;};
  }
})();
