(()=>{
 const collage=document.querySelector('.collage-v2'),copy=document.querySelector('.hero-copy'),body=document.querySelector('.hero-body'),actions=document.querySelector('.hero-actions');
 const stage=document.createElement('div');stage.className='hero-slider-stage';collage.before(stage);stage.append(collage);
 const mobile=matchMedia('(max-width:1100px)');
 function layout(){
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
 addEventListener('resize',layout);document.fonts.ready.then(layout);layout();
})();
