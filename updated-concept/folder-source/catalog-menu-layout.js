(()=>{
let locked=false,previousOverflow='';
function lockPage(){
 const open=!!document.querySelector('.mega-menu[open]');
 if(open===locked)return;
 locked=open;
 // Keep the document in its normal flow: closing on hover must not restore
 // its scroll position with an animated scroll (or move the docked header).
 const root=document.documentElement;
 if(open){previousOverflow=root.style.overflow;root.style.overflow='hidden';}
 else{root.style.overflow=previousOverflow;}
}
document.querySelectorAll('.mega-menu').forEach(menu=>menu.addEventListener('toggle',lockPage));

document.querySelectorAll('.mega-menu').forEach(menu=>{
if(!menu.querySelector('.mega-results'))return;
menu.classList.add('catalog-layout-refined');
const panel=menu.querySelector('.mega-panel'),promo=menu.querySelector('.promo-stack');
if(promo)panel.append(promo);
const content=menu.querySelector('.menu-content');
const assistance=menu.querySelector('.menu-assistance');
if(assistance){
 assistance.className='catalog-menu-assistance';panel.append(assistance);
 const old=assistance.querySelector('a');const button=document.createElement('button');
 button.type='button';button.textContent='Подобрать программу';old.replaceWith(button);
 button.addEventListener('click',()=>{menu.open=false;document.querySelector('.hero-actions [data-brief]').click()});
}
});
document.querySelectorAll('.mega-menu .experiment-offers').forEach(button=>{
 button.innerHTML='<span>Посмотреть<br>акции</span><svg class="offers-art" preserveAspectRatio="xMidYMin meet" viewBox="0 0 76 76" fill="none" aria-hidden="true"><path d="M24 0v20m-5 7v-7h10v7M57 0v32m-5 7v-7h10v7" stroke="#11743e" stroke-width="2"/><circle cx="24" cy="44" r="19" fill="#ffdf4a" stroke="#11743e" stroke-width="2"/><path d="M6 40q18 13 36 0M11 56q13-9 26 0" stroke="#11743e" stroke-width="2"/><circle cx="57" cy="56" r="16" fill="#e3f3e9" stroke="#11743e" stroke-width="2"/><path d="M57 44v24M45 56h24M49 48l16 16m0-16L49 64" stroke="#11743e" stroke-width="2"/></svg>';
});
})();
