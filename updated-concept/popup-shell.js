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
    const mobile=matchMedia('(max-width:700px)');
    function placeClose(){
      if(!dialog.open||!mobile.matches){
        if(close.hasAttribute('popover')){
          if(close.matches(':popover-open'))close.hidePopover();
          close.removeAttribute('popover');
        }
        return;
      }
      const supportsPopover=typeof close.showPopover==='function';
      const top=dialog.getBoundingClientRect().top+(supportsPopover?-48:8);
      dialog.style.setProperty('--popup-close-top',Math.max(0,top)+'px');
      // Promote the existing button, preserving its handler and accessible name.
      // iOS clips fixed descendants of a scrolling dialog unless they have their own top layer.
      if(supportsPopover){
        close.setAttribute('popover','manual');
        if(!close.matches(':popover-open'))close.showPopover();
      }
    }
    new ResizeObserver(placeClose).observe(dialog);
    window.visualViewport?.addEventListener('resize',placeClose);
    window.visualViewport?.addEventListener('scroll',placeClose);
    window.addEventListener('resize',placeClose);
    new MutationObserver(records=>{
      if(records.some(record=>record.attributeName==='class'||record.attributeName==='open'))refresh();
      placeClose();
    }).observe(dialog,{attributes:true,attributeFilter:['class','open']});
    window.addEventListener('resize',refresh);
    dialog.addEventListener('close',()=>{placeClose();surface.scrollTop=0;dialog.scrollTop=0;});
    refresh();
  });
})();
