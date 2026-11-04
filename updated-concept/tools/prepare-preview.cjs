const fs = require('node:fs');
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); } catch { sharp = require('../../../sites/catalyst-copy-review/node_modules/sharp'); }
const dir = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,'image-manifest.json')));
const css = JSON.parse(fs.readFileSync(path.join(__dirname,'css-build-report.json')));
function sizes(src) {
  if (src.includes('corporate-stickers')) return '180px';
  if (src.includes('newyear-bauble')) return '80px';
  if (src.includes('newyear-stickers')) return '(max-width:700px) 100px, 180px';
  if (src.includes('director-portrait')) return '(max-width:700px) 80px, 96px';
  if (src.includes('telegram-channel-preview')) return '160px';
  if (src.includes('catalog-figma')) return '(max-width:700px) 80vw, 40vw';
  if (src.includes('contact-rustore')) return '(max-width:700px) calc(100vw - 24px), calc(100vw - 48px)';
  if (src.includes('case-abg') || src.includes('case-rustore') || src.includes('summer-event') || src.includes('hero-food-photo')) return '240px';
  if (src.includes('portfolio/case-')) return '(max-width:700px) calc(100vw - 44px), calc((100vw - 68px) / 2)';
  if (src.includes('ny-') || src.includes('ng-salym')) return '(max-width:700px) calc(100vw - 56px), calc((100vw - 96px) / 3)';
  return '100vw';
}
async function main() {
  let html = fs.readFileSync(path.join(dir,'index.html'),'utf8');
  let first = true;
  html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, () => {
    if (!first) return ''; first = false;
    return `<link rel="stylesheet" href="site.min.css?v=${css.hash}">`;
  });
  for (const tag of [...new Set(html.match(/<img\b[^>]*>/g))]) {
    const src = /\bsrc="([^"]+)"/.exec(tag)?.[1];
    if (!src) continue;
    const original = path.join(dir,src.split('?')[0]);
    let metadata;
    try { metadata = await sharp(original).metadata(); } catch { continue; }
    let next = tag;
    if (!/\bwidth=/.test(next) && metadata.width) next = next.replace(/>$/,` width="${metadata.width}" height="${metadata.height}">`);
    const record = manifest[src];
    if (record) {
      next = next.replace(`src="${src}"`,`src="${record.fallback}"`);
      next = next.replace(/>$/,` srcset="${record.variants.map(v=>`${v.width === record.width ? record.fallback : v.path} ${v.width}w`).join(', ')}" sizes="${sizes(src)}">`);
    }
    if (!/\bdecoding=/.test(next)) next = next.replace(/>$/,' decoding="async">');
    if (src.includes('telegram-channel-preview')) next = next.replace('loading="eager"','loading="lazy"');
    html = html.replaceAll(tag,next);
  }
  html = html.replaceAll('от 10 до 3 000 человек','от 30 до 3 000 человек');
  const social = await sharp(path.join(dir,'assets/performance/social-formula-1.jpg')).metadata();
  const meta = '<link rel="canonical" href="https://catalystrussia.ru/">' +
    '<meta property="og:url" content="https://catalystrussia.ru/">' +
    '<meta property="og:image" content="https://catalystrussia.ru/assets/performance/social-formula-1.jpg">' +
    '<meta property="og:image:type" content="image/jpeg">' +
    `<meta property="og:image:width" content="${social.width}">` +
    `<meta property="og:image:height" content="${social.height}">` +
    '<meta property="og:image:alt" content="Участники тимбилдинга «Формула-1» агентства Каталист">';
  html = html.replace('</head>',meta+'</head>');
  fs.writeFileSync(path.join(dir,'optimization-preview.html'),html);
  fs.writeFileSync(path.join(__dirname,'preview-source.sha256'),require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(dir,'index.html'))).digest('hex'));
  console.log('Prepared optimization-preview.html; index.html unchanged');
}
main().catch(e=>{console.error(e);process.exitCode=1});
