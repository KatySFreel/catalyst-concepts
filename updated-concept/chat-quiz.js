/* Chat quiz prototype. Live operator transport is not connected. */
window.mountCatalystChatQuiz = ({questions, answerLabels, endpoint, privacy, messengerLinks, telegramDraft, escape, formatPhone, contactIcon}) => {
 const original=document.querySelector('#chat-launcher'), originalChat=document.querySelector('#catalyst-chat');
 const group=document.createElement('div');group.id='chat-launchers';original.before(group);group.append(original);
 const launch=document.createElement('button');launch.type='button';launch.id='chat-quiz-launcher';launch.textContent='Чатик 2';launch.setAttribute('aria-controls','chat-quiz');launch.setAttribute('aria-expanded','false');group.prepend(launch);
 const chat=document.createElement('aside');chat.id='chat-quiz';chat.hidden=true;chat.setAttribute('aria-labelledby','chat-quiz-title');
 chat.innerHTML='<header class="cq-header"><img class="cq-header-logo" src="folder-source/assets/logo.png" alt="Каталист"><div><strong id="chat-quiz-title">Чат-помощник Каталиста</strong><span class="cq-hours">Отвечаем ежедневно с 8:00 до 22:00 мск</span></div><button class="cq-close" type="button" aria-label="Закрыть чат"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="cq-scroll"><div class="cq-messages" role="log" aria-live="polite" aria-relevant="additions text"></div><div class="cq-compose"></div></div><form class="cq-input-bar" hidden><input name="message" aria-label="Ваш ответ" placeholder="Напишите сообщение…" maxlength="500" autocomplete="off"><button type="submit" aria-label="Отправить ответ"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m9 5 7 7-7 7"/></svg></button></form><footer class="cq-footer" hidden></footer>';
 document.body.append(chat);
 const log=chat.querySelector('.cq-messages'),compose=chat.querySelector('.cq-compose'),scroll=chat.querySelector('.cq-scroll');
 const inputBar=chat.querySelector('.cq-input-bar');
 inputBar.onsubmit=async e=>{
  e.preventDefault();const value=inputBar.elements.message.value.trim();if(!value||!state.operator||!state.send||state.sending)return;
  state.sending=true;inputBar.querySelector('button').disabled=true;
  try{await state.send(value);state.messages.push({text:value,user:true});inputBar.reset();render();}
  catch{chat.querySelector('.cq-send-status').textContent='Не удалось отправить. Попробуйте ещё раз.';}
  finally{state.sending=false;inputBar.querySelector('button').disabled=false;}
 };
 const status=document.createElement('p');status.className='cq-send-status';status.setAttribute('role','status');inputBar.after(status);
 const footer=chat.querySelector('.cq-footer');
 const preview=['localhost','127.0.0.1'].includes(location.hostname)?new URLSearchParams(location.search).get('chat-demo'):null;
 const demo=window.CATALYST_CHAT_DEMO === true || preview==='1';
 const workingHours=()=>preview==='night'?false:demo?true:Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',hourCycle:'h23'}).format(new Date()))>=8&&Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',hourCycle:'h23'}).format(new Date()))<22;
 const state={answers:[],ready:false,operator:null,send:null,messages:[],sending:false,demoScheduled:false,replying:false,handoff:null,contactChannel:"Telegram",contacts:{},consent:false,contactSent:false,contactSending:false};
 footer.after(inputBar,status);
 let timer;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const brief=()=>['Здравствуйте! Помогите подобрать программу.',...state.answers.map((a,i)=>answerLabels[i]+': '+a)].filter(Boolean).join('\n');
 function syncScroll(){chat.classList.toggle('cq-overflow',scroll.scrollHeight-scroll.clientHeight-scroll.scrollTop>(chat.classList.contains('cq-overflow')?2:32));chat.classList.toggle('cq-scrolled',scroll.scrollTop>1);}
 scroll.addEventListener('scroll',syncScroll,{passive:true});
 new ResizeObserver(syncScroll).observe(scroll);
 function bottom(){requestAnimationFrame(()=>{scroll.scrollTo({top:scroll.scrollHeight,behavior:reduced.matches?'instant':'smooth'});syncScroll();});}
 function message(text,user=false,operator=null){
  if(user)return `<div class="cq-message cq-user ${text.length<=45?'cq-user-short':''}"><p>${escape(text)}</p></div>`;
  const src=operator?.avatar||'folder-source/assets/logo.png';
  return `<div class="cq-incoming"><img class="cq-avatar ${operator?'cq-avatar-person':''}" src="${escape(src)}" alt="${escape(operator?.name||'Каталист')}"><div class="cq-message cq-bot">${operator?`<span class="cq-author">${escape(operator.name)}</span>`:''}<p>${escape(text)}</p></div></div>`;
 }
 function links(){return '<div class="cf-divider">Или напишите нам напрямую</div>'+messengerLinks();}
 function updateLinks(){chat.querySelectorAll('[data-messenger="Telegram"]').forEach(a=>a.href=telegramDraft(brief()));}
 function render(){
  log.innerHTML=message('Здравствуйте! Помогу с выбором. Задам четыре вопроса о вашем мероприятии.');
  state.answers.forEach((answer,i)=>log.insertAdjacentHTML('beforeend',message(questions[i][0])+message(answer,true)));
  inputBar.hidden=!state.operator;
  status.textContent='';
  inputBar.querySelectorAll('input,button').forEach(el=>el.disabled=!state.ready);
  compose.replaceChildren();
  footer.hidden=true;
  if(!state.ready){log.insertAdjacentHTML('beforeend','<p class="cq-typing" role="status">Помощник готовит вопрос…</p>');bottom();return;}
  const i=state.answers.length;
  if(i<questions.length){
   log.insertAdjacentHTML('beforeend',message(questions[i][0]));
   compose.innerHTML=`<div class="cq-options">${questions[i][1].map((a,n)=>`<button type="button" data-choice="${n}">${escape(a)}</button>`).join('')}</div>`;
   compose.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{state.answers.push(questions[i][1][Number(button.dataset.choice)]);next()});
  }else{
   if(!state.handoff)state.handoff=workingHours()?'Спасибо за ответы! В ближайшие 2 минуты вам ответит менеджер. Дождитесь его сообщения в этом чате или напишите нам в Telegram или Max.':'Спасибо за ответы! Сейчас мы вне рабочего времени. Оставьте контакты — менеджер свяжется с вами в рабочее время: ежедневно с 8:00 до 22:00 мск. Или напишите нам напрямую в Telegram или Max.';
   log.insertAdjacentHTML('beforeend',message(state.handoff));
   if(state.contactSent)log.insertAdjacentHTML('beforeend',message(state.contactChannel+': '+state.contacts[state.contactChannel],true)+message('Спасибо! Менеджер свяжется с вами в рабочее время — с 8:00 до 22:00 мск.'));
   else if(!workingHours()&&!state.operator)renderContacts();
   let author='';
   state.messages.forEach(m=>{if(m.operator&&author!==m.operator.name){author=m.operator.name;log.insertAdjacentHTML('beforeend',`<p class="cq-handoff">Отвечает менеджер ${escape(author)}</p>`);}log.insertAdjacentHTML('beforeend',message(m.text,m.user,m.operator));});
   if(state.replying)log.insertAdjacentHTML('beforeend','<p class="cq-typing" role="status">Влад печатает…</p>');
   footer.innerHTML=links();footer.hidden=false;updateLinks();
   if(demo&&!state.demoScheduled&&!state.operator){state.demoScheduled=true;setTimeout(startDemo,1800);}
  }
  bottom();
 }
 function renderContacts(){
  const channel=state.contactChannel;
  compose.innerHTML=`<form class="cq-form" novalidate><fieldset aria-label="Способ связи"><div class="cq-channels">${['Telegram','Телефон','Max'].map(c=>`<label><input type="radio" name="channel" value="${c}" ${c===channel?'checked':''}><span>${contactIcon(c)}${c}</span></label>`).join('')}</div></fieldset><label class="cq-contact-label"><input name="contact" type="${channel==='Telegram'?'text':'tel'}" placeholder=" " value="${escape(state.contacts[channel]||'')}" maxlength="40" required aria-describedby="cq-error"><span class="cq-floating-label">${channel==='Telegram'?'Ваш Telegram — @username':channel==='Max'?'Номер телефона в Max':'Ваш телефон'}</span></label><label class="cq-consent"><input name="consent" type="checkbox" ${state.consent?'checked':''} required><span>Согласен на обработку персональных данных по <a href="${privacy}" target="_blank" rel="noopener">политике конфиденциальности</a></span></label><p id="cq-error" role="alert"></p><button type="submit" class="cq-send">Оставить контакт</button></form>`;
  const form=compose.querySelector('form'),error=form.querySelector('#cq-error'),input=form.elements.contact;
  form.querySelectorAll('[name=channel]').forEach(r=>r.onchange=()=>{state.contactChannel=r.value;renderContacts();syncScroll();});
  input.onkeydown=e=>{
   if(channel==='Telegram'||!['Backspace','Delete'].includes(e.key))return;
   const start=input.selectionStart,end=input.selectionEnd;if(start!==end)return;
   if(e.key==='Backspace'&&start>0&&/\D/.test(input.value[start-1])){let from=start-1;while(from>0&&/\D/.test(input.value[from]))from--;input.setSelectionRange(from,end);}
   else if(e.key==='Delete'&&/\D/.test(input.value[start]||'')){let to=start;while(to<input.value.length&&/\D/.test(input.value[to]))to++;input.setSelectionRange(start,to+1);}
  };
  input.oninput=()=>{
   const raw=input.value,pos=input.selectionStart;
   if(channel==='Telegram'){
    const clean=raw.replace(/[^a-zA-Z0-9_]/g,'').slice(0,32);
    input.value=clean?'@'+clean:'';
    const caret=Math.min(input.value.length,1+raw.slice(0,pos).replace(/[^a-zA-Z0-9_]/g,'').length);input.setSelectionRange(caret,caret);
   }else{
    const digitsBefore=raw.slice(0,pos).replace(/\D/g,'').length,hadPrefix=/^[78]/.test(raw.replace(/\D/g,''));
    const formatted=formatPhone(raw);input.value=formatted;let caret=formatted.length;
    if(pos<raw.length&&formatted){let seen=0;const target=digitsBefore+(hadPrefix?0:1);for(let i=0;i<formatted.length;i++){if(/\d/.test(formatted[i]))seen++;if(seen>=target){caret=i+1;break;}}}input.setSelectionRange(caret,caret);
   }
   state.contacts[channel]=input.value;input.removeAttribute('aria-invalid');error.textContent='';
  };
  form.elements.consent.onchange=()=>state.consent=form.elements.consent.checked;
  form.onsubmit=async e=>{
   e.preventDefault();if(state.contactSending)return;
   const value=input.value.trim(),digits=value.replace(/\D/g,'');
   const valid=channel==='Telegram'?/^@?[a-zA-Z][\w]{4,31}$/.test(value):/^[78]\d{10}$/.test(digits);
   if(!valid){error.textContent=channel==='Telegram'?'Укажите ник Telegram, например @username.':'Введите номер полностью: +7 (999) 123-45-67.';input.setAttribute('aria-invalid','true');input.focus();return;}
   if(!state.consent){error.textContent='Подтвердите согласие на обработку данных.';form.elements.consent.focus();return;}
   if(!endpoint){error.textContent='Отправка пока не подключена. Напишите нам в Telegram или Max.';return;}
   state.contacts[channel]=channel==='Telegram'?'@'+value.replace(/^@/,''):value;
   state.contactSending=true;form.querySelectorAll('input,button').forEach(el=>el.disabled=true);
   try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contact:state.contacts[channel],phone:channel==='Телефон'?value:'',channel,comment:brief(),program:'Подбор программы',source:'chat-quiz',page:location.pathname}),signal:AbortSignal.timeout(15000)});const data=await response.json();if(!response.ok||data.ok!==true)throw Error();state.contactSent=true;render();}
   catch{error.textContent='Не удалось отправить. Попробуйте ещё раз или напишите нам напрямую.';form.querySelectorAll('input,button').forEach(el=>el.disabled=false);}
   finally{state.contactSending=false;}
  };
 }
 // The integration must call connect only after an operator accepts the conversation.
 window.catalystChatOperator={
  connect({name,avatar,send}){if(state.answers.length!==questions.length||typeof send!=='function')return false;
   let photo='';try{const url=new URL(avatar,location.href);if(['http:','https:'].includes(url.protocol))photo=url.href;}catch{}
   state.operator={name:String(name||'Менеджер'),avatar:photo};state.send=send;
   chat.querySelector('#chat-quiz-title').textContent=state.operator.name+' · менеджер Каталиста';render();return true;},
  receive(text){if(!state.operator||!text)return;state.messages.push({text:String(text),operator:{...state.operator}});render();},
  disconnect(){state.operator=null;state.send=null;chat.querySelector('#chat-quiz-title').textContent='Чат-помощник Каталиста';render();},
  getBrief(){return brief();}
 };
 function startDemo(){
  if(state.operator)return;
  const api=window.catalystChatOperator;
  api.connect({name:'Влад',avatar:'assets/chat-vlad.webp',send:async()=>{
   state.replying=true;
   setTimeout(()=>{state.replying=false;api.receive('Спасибо! Учту это при подборе. В реальном чате здесь будет ответ вашего менеджера.');},1400);
  }});
  chat.querySelector('#chat-quiz-title').textContent='Влад · демо переписки';
  api.receive('Здравствуйте! Я Влад, менеджер Каталиста. Вижу ваши ответы. Подскажите, площадка для мероприятия уже выбрана или помочь с поиском?');
 }
 function next(){clearTimeout(timer);state.ready=false;render();timer=setTimeout(()=>{state.ready=true;render();if(!chat.hidden)compose.querySelector('button,input')?.focus({preventScroll:true});},reduced.matches?0:650);}
 function toggle(show,focus=true){chat.hidden=!show;launch.setAttribute('aria-expanded',String(show));if(show){originalChat.hidden=true;original.setAttribute('aria-expanded','false');if(!log.children.length)next();else bottom();}else if(focus)launch.focus({preventScroll:true});}
 if(demo||preview==='night'){state.answers=questions.map(q=>q[1][0]);state.ready=true;render();toggle(true);}
 launch.onclick=()=>toggle(chat.hidden);chat.querySelector('.cq-close').onclick=()=>toggle(false);
 original.addEventListener('click',()=>toggle(false,false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!chat.hidden){e.stopPropagation();toggle(false)}});
 document.addEventListener('click',e=>{if(!chat.hidden&&!e.composedPath().includes(chat)&&!e.composedPath().includes(launch))toggle(false,false)});
};
