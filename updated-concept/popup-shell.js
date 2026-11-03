/* Keep modal close controls above the independently scrolling form surface. */
(() => {
  // Lock the document, while each dialog surface remains independently scrollable.
  let savedScroll = null, savedBody = '';
  function syncDocumentLock(){
    const isOpen = !!document.querySelector('dialog[open]');
    if(isOpen && savedScroll === null){
      savedScroll = window.scrollY;
      savedBody = document.body.getAttribute('style') || '';
      document.documentElement.style.overflow = 'hidden';
      Object.assign(document.body.style,{position:'fixed',top:`-${savedScroll}px`,left:'0',right:'0',width:'100%',overflow:'hidden'});
    }else if(!isOpen && savedScroll !== null){
      const y = savedScroll; savedScroll = null;
      document.body.setAttribute('style',savedBody);
      // A menu may have locked the root before handing off to this dialog.
      // Never restore that stale lock once all overlays are closed.
      const menuOpen = !!document.querySelector('.mega-menu[open]') || document.body.classList.contains('mobile-menu-open');
      document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
      document.body.classList.remove('cf-modal-open');
      window.scrollTo({top:y,behavior:'instant'});
    }
  }
  new MutationObserver(syncDocumentLock).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open'],childList:true});
  function syncViewport(){
    const viewport=window.visualViewport;
    const height=viewport?.height||window.innerHeight;
    document.documentElement.style.setProperty('--popup-viewport-height',height+'px');
    document.documentElement.style.setProperty('--popup-viewport-bottom',Math.max(0,window.innerHeight-height-(viewport?.offsetTop||0))+'px');
  }
  window.visualViewport?.addEventListener('resize',syncViewport);
  window.visualViewport?.addEventListener('scroll',syncViewport);
  window.addEventListener('resize',syncViewport);
  syncViewport();
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
    function sizeSurface(){
      if(!dialog.open||!mobile.matches){surface.style.removeProperty('--popup-scroll-height');return;}
      const style=getComputedStyle(surface);
      const children=[...surface.children];
      const natural=children.reduce((height,child)=>Math.max(height,child.offsetTop-surface.offsetTop+child.offsetHeight),0)+parseFloat(style.paddingBottom||0);
      const available=(window.visualViewport?.height||innerHeight)*.92-48;
      surface.style.setProperty('--popup-scroll-height',Math.max(0,Math.min(natural,available))+'px');
    }
    const contentObserver=new ResizeObserver(sizeSurface);
    [...surface.children].forEach(child=>contentObserver.observe(child));
    window.visualViewport?.addEventListener('resize',sizeSurface);
    window.addEventListener('resize',sizeSurface);

    let motion,closing=false;
    function animateIn(){
      if(!mobile.matches||reduced.matches)return;
      motion?.cancel();
      motion=dialog.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    function dismiss(){
      if(closing)return;
      if(!mobile.matches||reduced.matches){dialog.close();return;}
      closing=true;motion?.cancel();
      const offset=0;
      motion=dialog.animate([{transform:`translateY(${offset}px)`},{transform:'translateY(100%)'}],{duration:220,easing:'ease-in',fill:'forwards'});
      motion.onfinish=()=>{dialog.close();motion.cancel();dialog.style.transform='';closing=false;};
    }
    close.addEventListener('click',event=>{
      if(!mobile.matches)return;
      event.preventDefault();event.stopImmediatePropagation();dismiss();
    },true);
    dialog.addEventListener('cancel',event=>{if(mobile.matches){event.preventDefault();dismiss();}});
    dialog.addEventListener('close',()=>{closing=false;motion?.cancel();dialog.style.transform='';});
    new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='class'||record.attributeName==='open'))refresh();
      if(dialog.open){sizeSurface();if(records.some(record=>record.attributeName==='open'))animateIn();}
    }).observe(dialog,{attributes:true,attributeFilter:['class','open']});
    window.addEventListener('resize',refresh);
    dialog.addEventListener('close',()=>{surface.scrollTop=0;dialog.scrollTop=0;});
    refresh();
  });
})();
