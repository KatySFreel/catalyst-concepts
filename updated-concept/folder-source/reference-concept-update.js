
(()=>{const popup=document.getElementById('offers-preview'),trigger=document.getElementById('offers-trigger');trigger.addEventListener('click',e=>{e.preventDefault();popup.showModal()});document.getElementById('offers-close').onclick=()=>popup.close();popup.addEventListener('close',()=>trigger.focus());popup.addEventListener('click',e=>{if(e.target!==popup)return;const r=popup.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)popup.close()});})();

document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(a.getAttribute('href')==='#s10'){e.preventDefault();document.querySelector('[data-brief]').click();}});
const mobileOffers=document.createElement('button');mobileOffers.type='button';mobileOffers.className='mobile-offers-trigger';mobileOffers.textContent='Акции';mobileOffers.onclick=()=>document.getElementById('offers-trigger').click();document.querySelector('.primary-line').insertBefore(mobileOffers,document.querySelector('.search-toggle'));function addMonthlyOffers(){
 document.querySelectorAll('.mega-promo').forEach(promo=>{
  if(promo.parentElement.classList.contains('promo-stack'))return;
  const stack=document.createElement('div');stack.className='promo-stack';promo.before(stack);stack.append(promo);
  const button=document.createElement('button');button.type='button';button.className='monthly-offers';button.setAttribute('aria-haspopup','dialog');button.innerHTML='<strong>Спецпредложения октября</strong><span>Для тимбилдинга и корпоратива</span>';
  button.addEventListener('click',()=>{document.querySelectorAll('.mega-menu[open]').forEach(m=>m.open=false);document.getElementById('offers-preview').showModal()});stack.append(button);
 });
}
addMonthlyOffers();
new MutationObserver(addMonthlyOffers).observe(document.body,{childList:true,subtree:true});
function styleContactPhone(){document.querySelectorAll('.company-detail .company-phone').forEach(a=>{if(a.querySelector('svg'))return;a.insertAdjacentHTML('afterbegin','<svg class="phone-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02Z" stroke-linejoin="round"/></svg>');a.closest('.company-detail').querySelector('.company-contact-actions')?.prepend(a)})}
styleContactPhone();new MutationObserver(styleContactPhone).observe(document.body,{childList:true,subtree:true});

// Keep the compact mobile header focused; secondary navigation lives in the burger.
document.querySelector('.mobile-offers-trigger')?.remove();
const contactMobileRoot=mobileRoot;
mobileRoot=function(){
 contactMobileRoot();
 const contact=mobileBody.querySelector('.mobile-contact');
 if(!contact)return;
 const extra=document.createElement('nav');extra.className='mobile-utility-links';extra.setAttribute('aria-label','Дополнительные разделы');
 document.querySelectorAll('.utility-nav a').forEach(a=>{const copy=a.cloneNode(true);copy.className='mobile-row';copy.removeAttribute('id');if(a.id==='offers-trigger')copy.addEventListener('click',e=>{e.preventDefault();closeMobile(false);document.getElementById('offers-preview').showModal()});extra.append(copy)});
 const offersLink=document.createElement('a');offersLink.className='mobile-row';offersLink.href='#offers-preview';offersLink.textContent='Акции';offersLink.addEventListener('click',e=>{e.preventDefault();closeMobile(false);document.getElementById('offers-preview').showModal()});if(!extra.querySelector('[href="#offers-preview"]'))extra.append(offersLink);contact.before(extra);
 contact.querySelector('p').innerHTML='Москва, Московская область<br>Выезды по России<br>Ежедневно с 8:00 до 22:00';
 const messengers=document.createElement('div');messengers.className='mobile-contact-messengers';
 document.querySelectorAll('.primary-line>.messenger').forEach(a=>{const copy=a.cloneNode(true);copy.className='mobile-messenger '+(a.classList.contains('mv-ib-tg')?'mobile-telegram':'mobile-max');copy.append(document.createTextNode(a.classList.contains('mv-ib-tg')?'Telegram':'Max'));messengers.append(copy)});
 contact.querySelector('p').after(messengers);
};

// Hover only switches desktop tabs; navigation links always require a click.
document.addEventListener('pointerover',event=>{
 if(!matchMedia('(min-width:1101px) and (hover:hover) and (pointer:fine)').matches)return;
 const tab=event.target.closest('button.mega-category[data-index],button.mega-category[data-company]');
 if(!tab||tab.contains(event.relatedTarget)||tab.classList.contains('selected'))return;
 tab.click();
});
document.querySelector('.mobile-quote-action')?.remove();
const compactContactRoot=mobileRoot;
mobileRoot=function(){
 compactContactRoot();
 const contact=mobileBody.querySelector('.mobile-contact');
 if(!contact)return;
 contact.insertAdjacentHTML('afterbegin','<h3 class="mobile-contact-title">Обсудим ваше мероприятие</h3>');
 contact.querySelector('p').innerHTML='<span>Ежедневно с 8:00 до 22:00</span><span>Москва и Московская область<br>Выезды по России</span>';
};
function decorateMobileOffer(){
 document.querySelectorAll('.mobile-season h4').forEach(title=>{if(!title.querySelector('.season-snowflake'))title.insertAdjacentHTML('beforeend','<span class="season-snowflake" aria-hidden="true">❄</span>')});
 const rootBody=document.querySelector('.mobile-sheet[data-level="root"] .mobile-sheet-body');
 if(!rootBody)return;
 const offer=rootBody.querySelector('.monthly-offers'),utility=rootBody.querySelector('.mobile-utility-links');
 if(offer&&utility&&!offer.classList.contains('mobile-monthly-divider')){offer.classList.add('mobile-monthly-divider');utility.before(offer)}
}
new MutationObserver(decorateMobileOffer).observe(mobileBody,{childList:true,subtree:true});
