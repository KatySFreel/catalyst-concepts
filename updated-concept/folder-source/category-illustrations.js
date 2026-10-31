// Topic-specific editorial object illustrations, separate from programme photography.
function categoryIllustration(category){
 const art={
  'Хиты':'hits','Бизнес-игры':'business','Творческие':'creative','Спортивные':'sports',
  'Кулинарные':'cooking','С нейросетями':'ai','Новогодние':'newyear','Необычные':'unusual'
 };
 return '<span class="category-illustration" aria-hidden="true"><img src="assets/category-art/'+(art[category]||art['Хиты'])+'.png" alt="" decoding="async"></span>';
}
