// Existing illustrated sticker pack, shared with the rest of the page.
function categoryIllustration(category){
 if(category==='Хиты')return '<span class="category-illustration category-idea-sticker" aria-hidden="true"><img src="assets/figma-20261102/catalog-stickers-original.png" alt="" loading="lazy" decoding="async"></span>';
 const newStickers={'Творческие':[730,390,350,350],'Спортивные':[365,746,350,330]};
 if(newStickers[category]){
  const [x,y,w,h]=newStickers[category];
  return `<span class="category-illustration category-updated-sticker${category==='Спортивные'?' category-sports-sticker':''}" aria-hidden="true"><span class="category-updated-crop" style="aspect-ratio:${w}/${h}"><img src="assets/figma-20261102/catalog-stickers-original.png" alt="" loading="lazy" decoding="async" style="--sheet-w:${1086/w*100}%;--sheet-h:${1448/h*100}%;--sheet-x:${-x/w*100}%;--sheet-y:${-y/h*100}%"></span></span>`;
 }
 if(category==='Новогодние')return '<span class="category-illustration category-tree" aria-hidden="true"><span class="category-tree-sprite"></span></span>';
 const art={
  'Хиты':'category-stickers-hd/spark.png','Бизнес-игры':'category-stickers-hd/together.png',
  'Творческие':'category-stickers-hd/roller.png','Спортивные':'category-stickers-hd/movement.png',
  'Кулинарные':'category-stickers-hd/toaster.png','С нейросетями':'category-stickers-hd/ideas.png',
  'Новогодние':'category-stickers-hd/tree.png','Необычные':'category-stickers-hd/people.png'
 };
 return '<span class="category-illustration" aria-hidden="true"><img src="assets/'+(art[category]||art['Хиты'])+'" alt="" loading="lazy" decoding="async"></span>';
}
