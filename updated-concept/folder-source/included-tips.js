(()=>{
const pairs=[...document.querySelectorAll('.included-tip-trigger')].map(button=>({button,popup:document.getElementById(button.getAttribute('popovertarget'))}));
function place({button,popup}){if(!popup.matches(':popover-open'))return;const r=button.getBoundingClientRect();const h=popup.offsetHeight;popup.style.left=Math.max(16,Math.min(r.left,innerWidth-popup.offsetWidth-16))+'px';popup.style.top=Math.max(16,r.bottom+10+h<=innerHeight-16?r.bottom+10:r.top-h-10)+'px'}
pairs.forEach(pair=>{
 const {button,popup}=pair;let timer;
 const cancel=()=>clearTimeout(timer);
 const show=()=>{cancel();if(!popup.matches(':popover-open'))popup.showPopover();place(pair)};
 const hide=()=>{cancel();timer=setTimeout(()=>{if(!button.matches(':hover')&&!popup.matches(':hover')&&!popup.contains(document.activeElement))popup.hidePopover()},180)};
 button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show()});
 button.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hide()});
 popup.addEventListener('pointerenter',cancel);popup.addEventListener('pointerleave',hide);
 button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))show()});
 button.addEventListener('blur',hide);
 popup.addEventListener('toggle',()=>place(pair));
});
addEventListener('resize',()=>pairs.forEach(place));addEventListener('scroll',()=>pairs.forEach(place),{passive:true});
})();