/* Generate separate assets; never overwrite original artwork. */
const fs = require('node:fs');
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); }
catch { sharp = require('../../../sites/catalyst-copy-review/node_modules/sharp'); }
const dir = path.resolve(__dirname, '..');
const input = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const outputDir = path.join(dir, 'assets/performance');
fs.mkdirSync(outputDir, {recursive:true});
const imageTags = [...input.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
const paths = new Set(imageTags.map(t => /\bsrc="([^"]+)"/.exec(t)?.[1]).filter(s => s && /\.(webp|png|jpe?g)$/.test(s)));
const cssFiles = [...input.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1].split('?')[0]);
for (const file of cssFiles) {
  for (const m of fs.readFileSync(path.join(dir,file),'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (/\.(webp|png|jpe?g)$/.test(m[1]) && !/^(data:|http)/.test(m[1])) paths.add(path.posix.normalize(path.posix.join(path.posix.dirname(file),m[1])));
  }
}
const manifest = {};
async function main() {
  for (const source of paths) {
    const file = path.join(dir,source), meta = await sharp(file).metadata();
    if (!meta.width || !meta.height || meta.pages > 1) continue;
    // Hero images are switched by the existing slider. Keep its sources untouched;
    // adding static srcset there would pin the first slide after JS changes src.
    if (/hero-stickers|hero-race|formula-1\.webp/.test(source)) continue;
    if (fs.statSync(file).size < 30000) continue;
    const basename = source.replace(/\.(webp|png|jpe?g)$/,'').replaceAll('/','--');
    const widths = [...new Set([320,640,960,1280,meta.width].filter(w=>w<=meta.width))].sort((a,b)=>a-b);
    const variants = [];
    for (const width of widths) {
      const target = `assets/performance/${basename}-${width}.webp`;
      await sharp(file).resize({width,withoutEnlargement:true}).webp({quality:93,alphaQuality:100,effort:6}).toFile(path.join(dir,target));
      variants.push({width,path:target,bytes:fs.statSync(path.join(dir,target)).size});
    }
    const full = variants.find(v=>v.width===meta.width);
    manifest[source] = {width:meta.width,height:meta.height,originalBytes:fs.statSync(file).size,fallback:full.bytes<fs.statSync(file).size ? full.path : source,variants};
    console.log(source, fs.statSync(file).size, '=>', full.bytes);
  }
  fs.writeFileSync(path.join(__dirname,'image-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  // Use the existing event photo, without cropping or new artwork, for social previews.
  await sharp(path.join(dir,'assets/formula-1.webp')).resize({width:1200,withoutEnlargement:true}).jpeg({quality:92,mozjpeg:true}).toFile(path.join(outputDir,'social-formula-1.jpg'));
  console.log('Generated',Object.keys(manifest).length,'image families');
}
main().catch(e=>{console.error(e);process.exitCode=1});
