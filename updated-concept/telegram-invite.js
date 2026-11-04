(() => {
 const modal=document.getElementById('telegram-invite');
 if(!modal || typeof modal.showModal!=='function')return;

 const form=modal.querySelector('#ti-lead-form');
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const phone=form.elements.phone;
  const value=phone.value.trim(), digits=value.replace(/\D/g,'');
  const status=form.querySelector('#ti-form-status');
  status.classList.add('is-error');
  if(!/^7\d{10}$/.test(digits)){status.textContent='Введите российский номер полностью: +7 (999) 123-45-67.';phone.setAttribute('aria-invalid','true');phone.focus();return;}
  phone.removeAttribute('aria-invalid');
  const endpoint=window.CATALYST_LEAD_ENDPOINT || (['catalystrussia.ru','www.catalystrussia.ru'].includes(location.hostname)?'/api/lead/':null);
  if(!endpoint){status.textContent='Отправка заявок пока не подключена. Напишите менеджеру в Telegram по ссылке ниже.';return;}
  const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Отправляем…';
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.elements.name.value.trim(),phone:value,contact:value,channel:'Телефон',program:'Подбор программы',comment:'Вопрос и подбор программы',source:'scroll-invite',page:location.pathname}),signal:AbortSignal.timeout(15000)});
   const data=await response.json();if(!response.ok||data.ok!==true)throw new Error();
   status.classList.remove('is-error');status.textContent='Спасибо! Свяжемся с вами, чтобы обсудить событие.';button.textContent='Заявка отправлена';form.reset();
  }catch{status.textContent='Не удалось отправить заявку. Попробуйте ещё раз или напишите менеджеру.';button.disabled=false;button.textContent='Попробовать ещё раз';}
 });
 const phoneInput=form.elements.phone;
 function formatRussianPhone(value){
  let digits=value.replace(/\D/g,'');
  if(digits[0]==='7'||digits[0]==='8')digits=digits.slice(1);
  digits=digits.slice(0,10);
  if(!digits)return '';
  let result='+7 ('+digits.slice(0,3);
  if(digits.length>=3)result+=') ';
  if(digits.length>3)result+=digits.slice(3,6);
  if(digits.length>6)result+='-'+digits.slice(6,8);
  if(digits.length>8)result+='-'+digits.slice(8,10);
  return result;
 }
 function applyPhoneMask(){
  const raw=phoneInput.value, caret=phoneInput.selectionStart??raw.length;
  const digitsBefore=raw.slice(0,caret).replace(/\D/g,'').length;
  const countryAdded=raw.replace(/\D/g,'').length>0&&!/^[78]/.test(raw.replace(/\D/g,''));
  phoneInput.value=formatRussianPhone(raw);
  let remaining=digitsBefore+(countryAdded?1:0),position=0;
  while(position<phoneInput.value.length&&remaining>0){if(/\d/.test(phoneInput.value[position]))remaining--;position++;}
  if(caret===raw.length)position=phoneInput.value.length;
  phoneInput.setSelectionRange(position,position);
  phoneInput.removeAttribute('aria-invalid');
  form.querySelector('#ti-form-status').textContent='';
 }
 phoneInput.addEventListener('input',applyPhoneMask);
 phoneInput.addEventListener('focus',()=>{if(!phoneInput.value)phoneInput.value='+7 ('});
 phoneInput.addEventListener('blur',()=>{if(phoneInput.value.replace(/\D/g,'').length<=1)phoneInput.value=''});
 phoneInput.addEventListener('beforeinput',event=>{
  if(event.inputType!=='deleteContentBackward'||phoneInput.selectionStart!==phoneInput.selectionEnd)return;
  const caret=phoneInput.selectionStart;
  if(caret>0&&!/\d/.test(phoneInput.value[caret-1])){
   event.preventDefault();let start=caret-1;
   while(start>0&&!/\d/.test(phoneInput.value[start]))start--;
   phoneInput.value=phoneInput.value.slice(0,start)+phoneInput.value.slice(caret);
   phoneInput.setSelectionRange(start,start);applyPhoneMask();
  }
 });
 let shown=false,frame=0,previousFocus=null;
 function openInvite(){
  shown=true;removeEventListener('scroll',onScroll);
  document.dispatchEvent(new CustomEvent('catalyst:catalog-invite'));
 }
 document.querySelectorAll('[data-telegram-invite]').forEach(button=>button.addEventListener('click',openInvite));
 function check(){
  frame=0;
  if(shown || document.visibilityState!=='visible')return;
  const aboutHeading=document.querySelector('#s8 h2');
  if(!aboutHeading || scrollY<=0 || aboutHeading.getBoundingClientRect().bottom>innerHeight)return;
  if(document.activeElement?.matches('input,textarea,select'))return;
  if(document.querySelector('dialog[open], #catalyst-chat:not([hidden]), #chat-quiz:not([hidden])') || document.body.classList.contains('mobile-menu-open'))return;
  openInvite();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(check)}
 function onScroll(){schedule()}
 modal.querySelector('.ti-close').addEventListener('click',()=>modal.close());
 modal.querySelector('.ti-channel').addEventListener('click',()=>modal.close());
 modal.addEventListener('click',event=>{if(event.target!==modal)return;const r=modal.getBoundingClientRect();if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)modal.close()});
 modal.addEventListener('close',()=>{if(previousFocus instanceof HTMLElement && previousFocus.isConnected)previousFocus.focus({preventScroll:true})});
 document.addEventListener('close',schedule,true);
 document.addEventListener('focusout',schedule);
 document.addEventListener('visibilitychange',schedule);
 addEventListener('scroll',onScroll,{passive:true});
})();
