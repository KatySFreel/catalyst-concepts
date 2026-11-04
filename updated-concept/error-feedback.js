(() => {
 const selector='#cf-error, #cq-error, #ti-form-status';
 const seen=new WeakSet();
 function position(error){
  const form=error.closest('form');
  const input=form?.querySelector('[name="contact"], [name="phone"]');
  if(!input)return;
  const value=(input.getBoundingClientRect().bottom-form.getBoundingClientRect().top+form.scrollTop+4)+'px';
  if(error.style.getPropertyValue('--feedback-top')!==value)error.style.setProperty('--feedback-top',value);
 }
 const resize=new ResizeObserver(entries=>entries.forEach(({target})=>target.querySelectorAll(selector).forEach(position)));
 function mount(){document.querySelectorAll(selector).forEach(error=>{
  if(seen.has(error))return;
  const form=error.closest('form');if(!form)return;
  seen.add(error);form.append(error);resize.observe(form);position(error);
 });}
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
 document.fonts.ready.then(()=>document.querySelectorAll(selector).forEach(position));
 mount();
})();
