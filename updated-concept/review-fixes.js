(()=>{
 const collage=document.querySelector('.collage-v2'),copy=document.querySelector('.hero-copy'),body=document.querySelector('.hero-body'),actions=document.querySelector('.hero-actions');
 const stage=document.createElement('div');stage.className='hero-slider-stage';collage.before(stage);stage.append(collage);
 const mobile=matchMedia('(max-width:1100px)');
 function layout(){
  if(collage.hasAttribute('data-slide')){
   // Mobile Figma frames use a shared 390 × 252 canvas, scaled as one composition.
   if(innerWidth<=700){
    body.append(actions);
    const scale=stage.clientWidth/390;
    stage.style.height=(252*scale)+'px';
    collage.style.setProperty('--mobile-scene-scale',scale);
    collage.style.setProperty('--mobile-scene-left','0px');
    collage.style.setProperty('--mobile-scene-top','0px');
    return;
   }

   // Measure the complete composition, including rotated stickers, in scene units.
   const origin=collage.getBoundingClientRect();
   const currentScale=parseFloat(getComputedStyle(collage).scale)||1;
   const pieces=[...collage.querySelectorAll('.team.hero-slide,.event-caption,.mini-folder,.figma-race-sticker')].filter(el=>getComputedStyle(el).display!=='none');
   const rects=pieces.map(el=>el.getBoundingClientRect());
   const left=(Math.min(...rects.map(r=>r.left))-origin.left)/currentScale;
   const right=(Math.max(...rects.map(r=>r.right))-origin.left)/currentScale;
   const top=(Math.min(...rects.map(r=>r.top))-origin.top)/currentScale;
   const bottom=(Math.max(...rects.map(r=>r.bottom))-origin.top)/currentScale;
   if(mobile.matches){
    body.append(actions);
    const scale=Math.min(.88,(stage.clientWidth-24)/657.187)*(innerWidth<=700?.9:1);
    const height=502.744*scale;
    stage.style.height=height+'px';
    collage.style.setProperty('--mobile-scene-scale',scale);
    collage.style.setProperty('--mobile-scene-left',(stage.clientWidth/2-(left+right)*scale/2)+'px');
    collage.style.setProperty('--mobile-scene-top',(height/2-(top+bottom)*scale/2)+'px');
   }else{
    copy.append(actions);stage.style.height='';
    const hero=document.querySelector('.hero');
    hero.style.setProperty('--hero-header-height',(document.querySelector('#header').offsetHeight-1)+'px');
    const scale=Math.min(1.2,body.clientWidth/1232,(hero.clientHeight-60)/502.744);
    const areaRight=body.getBoundingClientRect().right-hero.getBoundingClientRect().left;
    const areaWidth=627.151*scale;
    collage.style.setProperty('--scene-scale',scale);
    const shift=([24,24,36,24,0][Number(collage.dataset.slide)]||0)*scale;
    const centeredLeft=areaRight-areaWidth/2-(left+right)*scale/2;
    const sceneLeft=Math.min(centeredLeft+shift,areaRight-right*scale);
    collage.style.setProperty('--scene-left',sceneLeft+'px');
    collage.style.setProperty('--scene-top',(hero.clientHeight/2-(top+bottom)*scale/2)+'px');
   }
   return;
  }
  stage.style.height='';
  if(mobile.matches){
   body.append(actions);
   const pieces=[...collage.querySelectorAll('.team.hero-slide,.event-caption,.event-polaroid,.mini-folder,.seal')].filter(e=>getComputedStyle(e).display!=='none');
   const top=Math.min(...pieces.map(e=>e.offsetTop-8));
   const bottom=Math.max(...pieces.map(e=>e.offsetTop+e.offsetHeight+12));
   const scale=Math.min(.88,394/(bottom-top), (stage.clientWidth-24)/Math.max(collage.offsetWidth, 450));
   collage.style.setProperty('--mobile-scene-scale',scale);
   collage.style.setProperty('--mobile-scene-top',(8-top*scale)+'px');
   }else{
   copy.append(actions);
   const hero=document.querySelector('.hero');
   const pieces=[...collage.querySelectorAll('.team.hero-slide,.event-caption,.event-polaroid,.mini-folder,.seal')].filter(e=>getComputedStyle(e).display!=='none');
   const left=Math.min(...pieces.map(e=>e.offsetLeft))-18;
   const right=Math.max(...pieces.map(e=>e.offsetLeft+e.offsetWidth))+18;
   const top=Math.min(...pieces.map(e=>e.offsetTop))-24;
   const bottom=Math.max(...pieces.map(e=>e.offsetTop+e.offsetHeight))+24;
   const heroRect=hero.getBoundingClientRect();
   const headingRect=copy.querySelector('h1').getBoundingClientRect();
   const actionsRect=actions.getBoundingClientRect();
   const contentTop=headingRect.top-heroRect.top;
   const contentBottom=actionsRect.bottom-heroRect.top;
   // Balance the artwork against the heading, intro and actions, not the whole cover.
   const areaTop=Math.max(24,contentTop-24);
   const areaBottom=Math.min(hero.clientHeight-64,contentBottom+72);
   const areaLeft=Math.max(hero.clientWidth*.49,actionsRect.right-heroRect.left+32);
   const areaWidth=Math.max(1,hero.clientWidth-areaLeft-32);
   const areaHeight=Math.max(1,areaBottom-areaTop);
   const baseScale=Math.min(.96,areaWidth/(right-left),areaHeight/(bottom-top));
   const scale=Math.min(baseScale*1.08,(areaWidth+32)/(right-left),(hero.clientHeight-48)/(bottom-top));
   collage.style.setProperty('--scene-scale',scale);
   collage.style.setProperty('--scene-left',(areaLeft+(areaWidth-(right-left)*scale)/2-left*scale)+'px');
   // Centre the whole scene within the green cover, independently of copy length.
   const sceneHeight=(bottom-top)*scale;
   const sceneTop=Math.max(24,(hero.clientHeight-sceneHeight)/2);
   collage.style.setProperty('--scene-top',(sceneTop-top*scale)+'px');
  }
 }
 mobile.addEventListener('change',layout);
 const observer=new ResizeObserver(layout);observer.observe(collage);observer.observe(copy);
 new MutationObserver(layout).observe(collage,{attributes:true,attributeFilter:['data-slide']});
 collage.querySelector('.hero-slide').addEventListener('load',layout);
 addEventListener('resize',layout);layout();
 Promise.all([document.fonts.ready,collage.querySelector('.hero-slide').decode().catch(()=>{})]).then(()=>{
  layout();requestAnimationFrame(()=>{layout();collage.dataset.layoutReady='true';collage.dispatchEvent(new Event('hero-layout-ready'));});
 });
})();
