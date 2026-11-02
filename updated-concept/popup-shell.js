/* Keep modal close controls above the independently scrolling form surface. */
(() => {
  document.querySelectorAll('#contact-dialog,#telegram-invite,#brief,#offers-preview').forEach(dialog => {
    const close=dialog.querySelector('.cf-close,.ti-close,.close,#offers-close');
    if(!close)return;
    const surface=document.createElement('div');
    surface.className='popup-form-surface';
    close.remove();
    surface.append(...dialog.childNodes);
    dialog.append(close,surface);
    function refresh(){
      dialog.removeAttribute('data-external-close');
      const style=getComputedStyle(dialog);
      dialog.style.setProperty('--popup-surface-padding',style.padding);
      dialog.style.setProperty('--popup-surface-background',style.backgroundColor);
      dialog.style.setProperty('--popup-surface-radius',style.borderRadius);
      dialog.setAttribute('data-external-close','');
    }
    const mobile=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
    let motion,gesture=null,closing=false;
    function animateIn(){
      if(!mobile.matches||reduced.matches)return;
      motion?.cancel();
      motion=dialog.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    function dismiss(){
      if(closing)return;
      if(!mobile.matches||reduced.matches){dialog.close();return;}
      closing=true;motion?.cancel();
      const offset=gesture?.dy||0;gesture=null;
      motion=dialog.animate([{transform:`translateY(${offset}px)`},{transform:'translateY(100%)'}],{duration:220,easing:'ease-in',fill:'forwards'});
      motion.onfinish=()=>{dialog.close();motion.cancel();dialog.style.transform='';closing=false;};
    }
    close.addEventListener('click',event=>{
      if(!mobile.matches)return;
      event.preventDefault();event.stopImmediatePropagation();dismiss();
    },true);
    dialog.addEventListener('cancel',event=>{if(mobile.matches){event.preventDefault();dismiss();}});
    surface.addEventListener('touchstart',event=>{
      if(!mobile.matches||closing||surface.scrollTop>0||event.touches.length!==1||event.target.closest('input,textarea,select,button,a'))return;
      const touch=event.touches[0];gesture={x:touch.clientX,y:touch.clientY,dy:0,started:performance.now()};
    },{passive:true});
    surface.addEventListener('touchmove',event=>{
      if(!gesture)return;
      const touch=event.touches[0],dx=touch.clientX-gesture.x,dy=touch.clientY-gesture.y;
      if(!gesture.dy&&(dy<0||Math.abs(dx)>Math.abs(dy))){gesture=null;return;}
      if(dy>8&&dy>Math.abs(dx)&&surface.scrollTop<=0){
        event.preventDefault();motion?.cancel();gesture.dy=dy;dialog.style.transform=`translateY(${dy}px)`;
      }
    },{passive:false});
    function release(cancelled=false){
      if(!gesture)return;
      const dy=gesture.dy,velocity=dy/Math.max(1,performance.now()-gesture.started);
      if(!cancelled&&(dy>100||(dy>40&&velocity>.5))){dismiss();return;}
      gesture=null;dialog.style.transform='';
      if(dy&&!reduced.matches)motion=dialog.animate([{transform:`translateY(${dy}px)`},{transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
    }
    surface.addEventListener('touchend',()=>release(),{passive:true});
    surface.addEventListener('touchcancel',()=>release(true),{passive:true});
    dialog.addEventListener('close',()=>{gesture=null;closing=false;motion?.cancel();dialog.style.transform='';});
    new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='class'||record.attributeName==='open'))refresh();
      if(dialog.open&&records.some(record=>record.attributeName==='open'))animateIn();
    }).observe(dialog,{attributes:true,attributeFilter:['class','open']});
    window.addEventListener('resize',refresh);
    dialog.addEventListener('close',()=>{surface.scrollTop=0;});
    refresh();
  });
})();
