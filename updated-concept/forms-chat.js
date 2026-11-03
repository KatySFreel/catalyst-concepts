(() => {
  const $ = s => document.querySelector(s);
  const escape = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const telegram = $('.mv-ib-tg')?.href || 'https://telegram.me/irek_stn';
  const max = $('.mv-ib-max')?.href;
  const privacy = 'https://catalystrussia.ru/politika-confidencialnosti/';
  const endpoint = window.CATALYST_LEAD_ENDPOINT || (['catalystrussia.ru','www.catalystrussia.ru'].includes(location.hostname) ? '/api/lead/' : null);
  const catalogUrl = 'https://maria177777773.github.io/catalyst-otchety/katalog/';
  const contactIcon = name => {
    const brand = name === 'Telegram' ? 'tg' : name === 'Max' ? 'max' : name === 'Email' ? 'email' : 'phone';
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
  document.addEventListener('keydown', e => { if(e.key==='Tab') modal.classList.add('cf-keyboard-focus'); });
  modal.addEventListener('pointerdown', () => modal.classList.remove('cf-keyboard-focus'));
  let opener, mode = 'proposal', context = '', step = 0;
  const drafts = {};
  const offers = [
    {tab:'Будний день',title:'Команда собирается — цена приятнее',benefit:'−10%',copy:'На тимбилдинг с понедельника по четверг для команды от 30 человек.',detail:'Пример предложения: скидка на программу, без аренды площадки и дополнительных услуг.'},
    {tab:'Фото в подарок',title:'Общие моменты останутся с вами',benefit:'Фотоотчёт',copy:'Два часа работы фотографа в подарок к командной программе от 50 участников.',detail:'Пример предложения: готовые фотографии после мероприятия для вашей команды.'},
    {tab:'Две программы',title:'Больше впечатлений за один день',benefit:'−15%',copy:'На вторую программу, если проводите обе на одном мероприятии.',detail:'Пример предложения: объедините активный тимбилдинг и творческий мастер-класс.'}
  ];
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
    let html = `<h2 id="cf-title" tabindex="-1" ${step===questions.length?'hidden':''}>${heading}</h2><ol class="cf-progress-steps" aria-label="Шаги расчёта стоимости">${['Участники','Формат','Дата','Бюджет','Контакты'].map((label,i)=>`<li><button type="button" data-step="${i}" ${i>availableStep?'disabled':''} class="${i<=step?'is-filled':''}" ${i===step?'aria-current="step"':''}><span class="cf-progress-segment" aria-hidden="true"></span>${label}</button></li>`).join('')}</ol><p class="cf-step">Шаг ${step + 1} из 5 · смета за 10 минут</p>`;
    if (step < questions.length) {
      html += `<div class="cf-options">${questions[step][1].map(a=>`<button type="button" aria-pressed="${d.answers[step]===a}" data-answer="${a}">${a}</button>`).join('')}</div>`;
    } else {
      html += `<section class="cf-selection" aria-label="Ваш выбор"><dl>${['Участники','Формат','Когда','Бюджет'].map((label,i)=>`<div><dt>${label}</dt><dd>${d.answers[i] ? `<span class="cf-context-accent">${escape(d.answers[i])}</span>` : 'Пока не выбрано'}</dd></div>`).join('')}</dl></section><form class="cf-form" novalidate><input type="radio" name="channel" value="Телефон" checked hidden>${field('contact','Телефон','+7 (___) ___-__-__','tel','required autocomplete="tel" inputmode="tel" maxlength="25" aria-describedby="cf-error"')}<p id="cf-error" class="cf-error" role="alert"></p><label class="cf-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><button class="cf-primary" type="submit">Получить расчёт</button></form>`;
    }
    if (step === questions.length) html += `<div class="cf-divider">Или напишите нам напрямую</div>${messengerLinks()}`;
    content.innerHTML = html;
    const move = next => { const missing = questions.findIndex((_, i) => !d.answers[i]); if(next > (missing < 0 ? questions.length : missing)) return; remember(); step = next; renderQuiz(); content.querySelector(step===questions.length?'[name="contact"]':'#cf-title').focus({preventScroll:true}); (modal.querySelector('.popup-form-surface') || modal).scrollTop = 0; };
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
  let offerResize, offerCleanup;
  modal.addEventListener('close',()=>offerCleanup?.());
  function render() {
    quizResize?.disconnect();
    offerResize?.disconnect();
    offerCleanup?.();
    const d = draft();
    modal.classList.toggle('cf-offers',mode==='offers');
    if(mode==='offers'){
      context='Пример акции: '+offers[d.offerIndex||0].tab;
      if(d.channel!=='Телефон')d.contact='';
      d.channel='Телефон';
    }
    let html = '';
    if (mode === 'catalog') {
      d.channel = 'Телефон';
      content.innerHTML = `<h2 id="cf-title">Выберите то, что понравится вашей команде</h2><p class="cf-intro">Посмотрите программы в удобном темпе. Оставьте номер — и каталог откроется сразу.</p><form class="cf-form" novalidate><input type="radio" name="channel" value="Телефон" checked hidden>${field('contact','Номер телефона','+7 (999) 123-45-67','tel','required autocomplete="tel" inputmode="tel" maxlength="25" aria-describedby="cf-error"')}<p id="cf-error" class="cf-error" role="alert"></p><label class="cf-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><button class="cf-primary" type="submit">Открыть каталог</button></form>`;
      content.querySelector('form').onsubmit=submit;
      content.querySelector('[name="contact"]').oninput=()=>{content.querySelector('[name="contact"]').removeAttribute('aria-invalid');content.querySelector('#cf-error').textContent='';};
      return;
    }
    if (mode === 'quiz') { renderQuiz(); return; }
    if (mode !== 'quiz') html += `<h2 id="cf-title" tabindex="-1">${mode==='offers'?'Обсудим предложение':context ? 'Обсудим ваше событие' : 'Подберём программу'}</h2>`;
    if(context && mode!=='offers') {
      const card=opener?.closest('.ny-folder');
      const photo=card?.querySelector('.ny-photo img');
      html += photo ? `<div class="cf-program-selection"><img src="${escape(photo.getAttribute('src'))}" alt=""><div><h3><span class="cf-context-accent">${escape(card.querySelector('h3').textContent)}</span></h3><p>${escape(card.querySelector('.ny-tab').textContent)}</p></div></div>` : `<div class="cf-context"><span class="cf-context-accent">${escape(context)}</span></div>`;
    }
    html += `<form class="cf-form" novalidate>${mode==='offers' ? '<input type="radio" name="channel" value="Телефон" checked hidden>' : `<fieldset class="cf-channels"><legend>Способ связи</legend><div class="cf-channel-options">${['Телефон','Telegram','Email'].map(c=>`<label><input type="radio" name="channel" value="${c}" ${d.channel===c?'checked':''}><span>${contactIcon(c)}${c}</span></label>`).join('')}</div></fieldset>`}<label class="cf-field cf-floating-field"><input name="contact" required maxlength="150" placeholder=" " aria-labelledby="cf-contact-label" aria-describedby="cf-error" value="${escape(d.contact)}"><span id="cf-contact-label" class="cf-floating-label">${d.channel==='Email'?'Ваша почта':d.channel==='Telegram'?'Ваш Telegram':'Номер телефона'}</span></label><p id="cf-error" class="cf-error" role="alert"></p><label class="cf-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><button class="cf-primary" type="submit">Отправить заявку </button></form><div class="cf-divider">Или напишите нам напрямую</div>${messengerLinks()}`;
    content.innerHTML = html;
    if(mode==='offers') {
      const contact=document.createElement('div');contact.className='cf-offer-contact';
      contact.append(...content.childNodes);content.append(contact);
      const art=['foodtruck','pizza','tower'];
      content.insertAdjacentHTML('afterbegin',`<section class="cf-offer-showcase" aria-label="Специальные предложения"><div class="cf-offer-heading"><h3>Выберите свой бонус</h3><div class="cf-offer-controls">${[[-1,"Предыдущие акции","M19 12H5m7-7-7 7 7 7"],[1,"Следующие акции","M5 12h14m-7-7 7 7-7 7"]].map(([direction,label,path])=>`<button type="button" data-offer-direction="${direction}" aria-label="${label}" aria-controls="cf-offer-track"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="${path}"/></svg></button>`).join("")}</div></div><div id="cf-offer-track" class="cf-offer-cards" role="group" aria-label="Выберите акцию">${offers.map((o,i)=>`<button type="button" class="cf-offer-card cf-offer-card-${i}" data-offer="${i}" aria-pressed="false"><img src="assets/figma-hero-slides/${art[i % art.length]}.png" alt=""><span class="cf-offer-card-benefit">${o.benefit}</span><strong>${o.tab}</strong><span class="cf-offer-card-copy">${o.copy}</span><span class="cf-offer-card-select">Выбрать акцию</span></button>`).join('')}</div></section>`);
      contact.querySelector('h2').insertAdjacentHTML('afterend','<p class="cf-offer-selected" aria-live="polite"><span class="cf-context-accent"></span></p>');
      const selectOffer=i=>{
        d.offerIndex=i;const offer=offers[i];context='Пример акции: '+offer.tab+' — '+offer.benefit;
        content.querySelector('.cf-offer-selected .cf-context-accent').textContent=offer.tab+' · '+offer.benefit;
        content.querySelectorAll('[data-offer]').forEach((card,j)=>{card.setAttribute('aria-pressed',String(j===i));card.querySelector('.cf-offer-card-select').textContent=j===i?'Выбрано':'Выбрать акцию';});
        content.querySelectorAll('[data-messenger="Telegram"]').forEach(link=>link.href=telegramDraft(buildMessage()));
      };
      content.querySelectorAll('[data-offer]').forEach(card=>{card.onclick=()=>selectOffer(Number(card.dataset.offer));});
      selectOffer(d.offerIndex||0);
      const track=content.querySelector('.cf-offer-cards');
      const cards=[...track.querySelectorAll('[data-offer]')];
      const controls=[...content.querySelectorAll('[data-offer-direction]')];
      const pagination=document.createElement('nav');
      pagination.className='cf-offer-pagination';pagination.setAttribute('aria-label','Страницы акций');track.after(pagination);
      const reduced=matchMedia('(prefers-reduced-motion: reduce)'),duration=5500;
      let positions=[],active=0,elapsed=0,lastFrame=0,raf=0,interacting=false,scrolling=false,settleTimer;
      const listeners=new AbortController(),options={signal:listeners.signal};
      function visible(){const r=track.getBoundingClientRect(),m=modal.getBoundingClientRect();return r.bottom>Math.max(0,m.top)+100&&r.top<Math.min(innerHeight,m.bottom)-100;}
      function canPlay(){return modal.open&&track.isConnected&&!document.hidden&&!reduced.matches&&positions.length>1&&!interacting&&!scrolling&&visible()&&!modal.querySelector('input:focus,textarea:focus');}
      function syncPlayback(){if(!canPlay()){cancelAnimationFrame(raf);raf=0;lastFrame=0;}else if(!raf)raf=requestAnimationFrame(tick);}
      function reset(){elapsed=0;lastFrame=0;pagination.style.setProperty('--slide-progress','0');}
      function moveTo(index,wrap=false){
        reset();scrolling=true;syncPlayback();
        track.scrollTo({left:positions[Math.max(0,Math.min(positions.length-1,index))]||0,behavior:reduced.matches||wrap?'instant':'smooth'});
        clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);
      }
      function update(){
        const next=positions.reduce((best,value,i)=>Math.abs(value-track.scrollLeft)<Math.abs(positions[best]-track.scrollLeft)?i:best,0);
        if(next!==active){active=next;reset();}
        controls[0].disabled=track.scrollLeft<2;controls[1].disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;
        [...pagination.children].forEach((dot,i)=>{if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
      }
      function settle(){
        if(interacting)return;
        update();
        if(Math.abs(track.scrollLeft-(positions[active]||0))>1)track.scrollTo({left:positions[active]||0,behavior:'instant'});
        scrolling=false;syncPlayback();
      }
      function measure(){
        if(!modal.open)return;
        const max=Math.max(0,track.scrollWidth-track.clientWidth);
        content.querySelector('.cf-offer-controls').hidden=max<=2;pagination.hidden=max<=2;
        const first=cards[0].getBoundingClientRect().left;
        positions=[...new Set(cards.map(card=>Math.min(max,Math.max(0,card.getBoundingClientRect().left-first))))];
        pagination.replaceChildren(...positions.map((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label','Страница акций '+(i+1));dot.setAttribute('aria-controls','cf-offer-track');dot.innerHTML='<span aria-hidden="true"></span>';dot.onclick=()=>moveTo(i);return dot;}));
        active=Math.min(active,positions.length-1);
        track.scrollTo({left:positions[active]||0,behavior:'instant'});update();syncPlayback();
      }
      function tick(now){
        raf=0;if(!canPlay()){lastFrame=0;return;}
        if(lastFrame)elapsed+=Math.min(now-lastFrame,100);lastFrame=now;
        pagination.style.setProperty('--slide-progress',String(Math.min(elapsed/duration,1)));
        if(elapsed>=duration){const next=(active+1)%positions.length;moveTo(next,next===0);return;}
        raf=requestAnimationFrame(tick);
      }
      const showcase=content.querySelector('.cf-offer-showcase');
      controls.forEach(button=>button.onclick=()=>moveTo(active+Number(button.dataset.offerDirection)));
      track.addEventListener('scroll',()=>{scrolling=true;reset();update();syncPlayback();clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);},{passive:true,...options});
      showcase.addEventListener('pointerdown',()=>{interacting=true;syncPlayback();},options);
      const release=()=>{if(interacting){interacting=false;reset();clearTimeout(settleTimer);settleTimer=setTimeout(settle,240);}};
      window.addEventListener('pointerup',release,options);window.addEventListener('pointercancel',release,options);
      showcase.addEventListener('focusin',event=>{if(event.target.matches(':focus-visible')){interacting=true;syncPlayback();}},options);
      showcase.addEventListener('focusout',()=>{interacting=false;syncPlayback();},options);
      modal.addEventListener('focusin',syncPlayback,options);modal.addEventListener('focusout',syncPlayback,options);
      modal.addEventListener('scroll',syncPlayback,{passive:true,capture:true,...options});
      document.addEventListener('visibilitychange',syncPlayback,options);reduced.addEventListener('change',syncPlayback,options);
      offerResize=new ResizeObserver(measure);offerResize.observe(track);
      const initialFrame=requestAnimationFrame(measure);
      offerCleanup=()=>{listeners.abort();offerResize?.disconnect();cancelAnimationFrame(initialFrame);cancelAnimationFrame(raf);clearTimeout(settleTimer);};

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
      input.type=c==='Email'?'email':c==='Телефон'?'tel':'text'; input.inputMode=c==='Телефон'?'tel':c==='Email'?'email':'text'; input.autocomplete=c==='Email'?'email':c==='Телефон'?'tel':'off';
      input.placeholder=' ';
      content.querySelector('#cf-contact-label').textContent=c==='Email'?'Ваша почта':c==='Telegram'?'Ваш Telegram':'Номер телефона';
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
  function showCatalog(preview = false) {
    content.innerHTML = `<h2 id="cf-title">Каталог для вашей команды</h2><p class="cf-intro">Выбирайте, сравнивайте и делитесь с коллегами. Если каталог не открылся автоматически, нажмите кнопку ниже.</p><a class="cf-primary" href="${catalogUrl}" target="_blank" rel="noopener">Открыть каталог</a>${preview?'<p class="cf-hint" role="status">В локальной версии номер не отправляется.</p>':''}`;
    window.open(catalogUrl, '_blank', 'noopener');
  }
  async function submit(e) {
    e.preventDefault(); remember(); const d=draft(); d.channel=content.querySelector('[name="channel"]:checked').value;
    if(mode==='quiz'){const missing=questions.findIndex((_,i)=>!d.answers[i]);if(missing>=0){step=missing;renderQuiz();return;}}
    const input=content.querySelector('[name="contact"]'), value=input.value.trim(), digits=value.replace(/\D/g,'');
    const phone=/^7\d{10}$/.test(digits);
    const valid=d.channel==='Телефон'?phone:d.channel==='Email'?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value):/^@?[a-zA-Z][\w]{4,31}$/.test(value);
    const error=content.querySelector('#cf-error');
    if(!valid) {error.textContent=d.channel==='Email'?'Укажите почту в формате name@company.ru.':d.channel==='Telegram'?'Укажите ник Telegram: от 5 до 32 латинских букв, цифр или знаков подчёркивания. Первый символ — буква.':'Введите номер полностью: +7 (999) 123-45-67.';input.setAttribute('aria-invalid','true');input.focus();return;}
    const people=content.querySelector('[name="people"]'); if(people && !people.checkValidity()){people.reportValidity();return;}
    if(!content.querySelector('[name="consent"]').checked){error.textContent='Подтвердите согласие на обработку данных.';content.querySelector('[name="consent"]').focus();return;}
    if(d.channel==='Telegram'){d.contact='@'+value.replace(/^@/,'');input.value=d.contact;}
    const message=buildMessage();
    if(endpoint) {
      const button=content.querySelector('[type="submit"]');button.disabled=true;button.textContent='Отправляем…';
      try {const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:d.name,phone:d.channel==='Телефон'?value:'',contact:value,channel:d.channel,comment:message,program:context||(mode==='catalog'?'Каталог программ':'Подбор программы'),source:mode,page:location.pathname}),signal:AbortSignal.timeout(15000)});const data=await res.json();if(!res.ok||data.ok!==true)throw Error();if(mode==='catalog'){showCatalog();delete drafts[mode];return;}content.innerHTML='<p class="cf-kicker">Запрос отправлен</p><h2 id="cf-title">Спасибо! Обсудим ваши планы.</h2><p class="cf-intro">Свяжемся с вами выбранным способом. Работаем ежедневно с 8:00 до 22:00.</p>';delete drafts[mode];}
      catch {error.textContent=mode==='catalog'?'Не удалось открыть каталог. Номер сохранён в форме — попробуйте ещё раз.':'Не удалось отправить запрос. Данные сохранены в форме. Попробуйте ещё раз или напишите нам в мессенджере.';button.disabled=false;button.textContent='Попробовать ещё раз';}return;
    }
    if(mode==='catalog'){
      if(location.protocol==='file:' || ['localhost','127.0.0.1','[::1]'].includes(location.hostname)) showCatalog(true);
      else error.textContent='Не удалось открыть каталог. Попробуйте позже.';
      return;
    }
    error.textContent='Отправка заявок пока не подключена. Вы можете написать нам в мессенджере.';
  }
  const chat=document.createElement('aside'); chat.id='catalyst-chat';chat.hidden=true;chat.setAttribute('aria-labelledby','chat-title');
  chat.innerHTML=`<div class="chat-paper"><div class="chat-header"><span class="chat-avatar"><img src="assets/chat-vlad.webp" alt="Влад"><i class="chat-status" aria-hidden="true"></i></span><div><strong>Влад · Каталист</strong><span>Ежедневно, 8:00–22:00 мск</span></div><button class="cf-close" aria-label="Закрыть чат" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="chat-message"><h2 id="chat-title">Что подойдёт вашей команде?</h2><p>Ответьте на 4 вопроса — подберём варианты под ваш формат и бюджет.</p></div></div><div class="chat-bottom"><button class="action-black chat-request" type="button" data-form="quiz">Подобрать программу</button><p>Или расскажите мне о событии в мессенджере</p>${messengerLinks()}</div>`;
  const launcher=document.createElement('button');launcher.type='button';launcher.id='chat-launcher';launcher.setAttribute('aria-label','Открыть чат с Каталист');launcher.setAttribute('aria-controls','catalyst-chat');launcher.setAttribute('aria-expanded','false');
  launcher.innerHTML='<span class="chat-avatar"><img src="assets/chat-vlad.webp" alt="Влад" width="40" height="40"><i class="chat-status" aria-hidden="true"></i></span><span>Задать вопрос</span>';
  document.body.append(chat,launcher);
  function updateChatHours(){
    const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
    const working=hour>=8&&hour<22;
    [chat,launcher].forEach(el=>{el.classList.toggle('chat-working',working);el.querySelector('.chat-avatar').title=working?'Рабочее время: 8:00–22:00 по Москве':'Вне рабочего времени. Ответим с 8:00 по Москве';});
  }
  updateChatHours();setInterval(updateChatHours,60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateChatHours();});
  function toggleChat(show){chat.hidden=!show;launcher.setAttribute('aria-expanded',String(show));launcher.setAttribute('aria-label',show?'Закрыть чат с Каталист':'Открыть чат с Каталист');if(show)chat.querySelector('button').focus();else launcher.focus({preventScroll:true});}
  launcher.onclick=()=>toggleChat(chat.hidden);chat.querySelector('.cf-close').onclick=()=>toggleChat(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!chat.hidden){toggleChat(false);}});
  document.addEventListener('click',e=>{if(!chat.hidden&&!chat.contains(e.target)&&!launcher.contains(e.target)) {chat.hidden=true;launcher.setAttribute('aria-expanded','false');}});
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
