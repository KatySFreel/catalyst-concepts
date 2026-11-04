/* Repeated neighbours keep native touch scrolling continuous in both directions. */
window.createLoopCarousel = function(track, cards, enabled = () => true) {
 const count=cards.length;
 let copies=[],span=0,base=0,active=false,timer;
 const mod=(value,size)=>(value%size+size)%size;
 function clone(card){
  const copy=card.cloneNode(true);
  copy.dataset.loopCopy='';copy.setAttribute('aria-hidden','true');
  [copy,...copy.querySelectorAll('[id]')].forEach(el=>el.removeAttribute('id'));
  [copy,...copy.querySelectorAll('a,button,input,select,textarea,[tabindex]')].forEach(el=>el.setAttribute('tabindex','-1'));
  copy.addEventListener('click',event=>{
   event.preventDefault();event.stopPropagation();
   const nodes=[copy,...copy.querySelectorAll('*')],original=[card,...card.querySelectorAll('*')];
   original[nodes.indexOf(event.target)]?.click();
  });
  return copy;
 }
 function jump(left){track.scrollTo({left,behavior:'instant'});}
 function refresh(){
  const should=enabled()&&count>1&&track.clientWidth>0;
  const index=active&&span?mod(track.scrollLeft-base,span)/span:0;
  if(!should){if(active){copies.forEach(el=>el.remove());copies=[];active=false;span=base=0;jump(0);}return;}
  if(!active){
   const before=cards.map(clone),after=cards.map(clone);
   track.prepend(...before);track.append(...after);copies=[...before,...after];active=true;
  }
  const nextSpan=cards[0].offsetLeft-copies[0].offsetLeft;
  if(nextSpan>0&&nextSpan!==span){span=nextSpan;base=span;jump(base+index*span);}
 }
 function position(){return active&&span?mod(track.scrollLeft-base,span):track.scrollLeft;}
 function normalize(){
  if(!active||!span)return;
  if(track.scrollLeft<base-1||track.scrollLeft>=base+span-1)jump(base+position());
 }
 function move(left,behavior='smooth'){
  if(!active||!span){track.scrollTo({left,behavior});return;}
  // Choose the nearest equivalent slide, including the adjoining copy.
  const target=base+mod(left,span);
  const candidates=[target-span,target,target+span];
  const nearest=candidates.reduce((a,b)=>Math.abs(b-track.scrollLeft)<Math.abs(a-track.scrollLeft)?b:a);
  track.scrollTo({left:nearest,behavior});
 }
 track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(normalize,160)},{passive:true});
 track.addEventListener('scrollend',normalize);
 const observer=new ResizeObserver(refresh);observer.observe(track);refresh();
 return {position,move,refresh,destroy(){observer.disconnect();clearTimeout(timer);copies.forEach(el=>el.remove());}};
};
