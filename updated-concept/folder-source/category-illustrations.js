// Existing illustrated sticker pack, shared with the rest of the page.
function categoryIllustration(category){
 if(category==='Новогодние')return '<span class="category-illustration category-tree" aria-hidden="true"><span class="category-tree-sprite"></span></span>';
 const art={
  'Хиты':'category-stickers-hd/spark.png','Бизнес-игры':'category-stickers-hd/together.png',
  'Творческие':'category-stickers-hd/roller.png','Спортивные':'category-stickers-hd/movement.png',
  'Кулинарные':'category-stickers-hd/toaster.png','С нейросетями':'category-stickers-hd/ideas.png',
  'Новогодние':'category-stickers-hd/tree.png','Необычные':'category-stickers-hd/people.png'
 };
 return '<span class="category-illustration" aria-hidden="true"><img src="assets/'+(art[category]||art['Хиты'])+'" alt="" loading="lazy" decoding="async"></span>';
}
