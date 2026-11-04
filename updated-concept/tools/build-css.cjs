/* Conservative CSS build: preserve cascade order, selectors and property values. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
let postcss;
try { postcss = require('postcss'); }
catch { postcss = require('../../../sites/catalyst-copy-review/node_modules/postcss'); }
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(__dirname, 'css-sources.json');
const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const sources = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath)) :
  [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map(m => m[1].split('?')[0]);
fs.writeFileSync(manifestPath, JSON.stringify(sources, null, 2) + '\n');
const mappingFile = path.join(__dirname, 'image-manifest.json');
const images = fs.existsSync(mappingFile) ? JSON.parse(fs.readFileSync(mappingFile)) : {};
const tree = postcss.root();
let beforeBytes = 0;
for (const file of sources) {
  const source = fs.readFileSync(path.join(rootDir, file), 'utf8');
  beforeBytes += Buffer.byteLength(source);
  const parsed = postcss.parse(source, {from: file});
  parsed.walkDecls(d => {
    d.value = d.value.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (whole, quote, url) => {
      if (/^(data:|https?:|#|\/)/.test(url)) return whole;
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), url));
      return `url(${quote}${images[resolved]?.fallback || resolved}${quote})`;
    });
  });
  tree.append(parsed.nodes);
}
let duplicateRules = 0, duplicateDeclarations = 0;
tree.walkComments(n => n.remove());
function signature(n) {
  if (n.type === 'decl') return ['decl', n.prop, n.value, !!n.important];
  return [n.type, n.selector || '', n.name || '', n.params || '', (n.nodes || []).map(signature)];
}
function deduplicate(parent) {
  const seenRules = new Set(), seenDeclarations = new Set(), laterDeclarations = new Set();
  for (const n of [...(parent.nodes || [])].reverse()) {
    // Only byte-equivalent semantic rules in the SAME enclosing scope.
    // Do not infer unused selectors from the initial DOM: menus and dialogs add nodes.
    if (n.type === 'rule') {
      const key = JSON.stringify(signature(n));
      if (seenRules.has(key)) { n.remove(); duplicateRules++; continue; }
      seenRules.add(key);
      if (n.nodes.every(child => child.type === 'decl')) {
        for (const d of [...n.nodes].reverse()) {
          const declarationKey = JSON.stringify([n.selector, ...signature(d)]);
          if (laterDeclarations.has(declarationKey)) { d.remove(); duplicateDeclarations++; }
          else laterDeclarations.add(declarationKey);
        }
        if (!n.nodes.length) { n.remove(); duplicateRules++; continue; }
      }
    }
    if (n.type === 'decl') {
      const key = JSON.stringify(signature(n));
      if (seenDeclarations.has(key)) { n.remove(); duplicateDeclarations++; continue; }
      seenDeclarations.add(key);
    }
    if (n.nodes) deduplicate(n);
  }
}
deduplicate(tree);
const expected = signature(tree);
tree.walk(n => {
  n.raws.before = '';
  if (n.nodes) { n.raws.after = ''; n.raws.semicolon = false; }
  if (n.type === 'decl') { n.raws.between = ':'; if (n.important) n.raws.important = '!important'; }
  if (n.type === 'rule') n.raws.between = '';
  if (n.type === 'atrule') { n.raws.between = ''; n.raws.afterName = n.params ? ' ' : ''; }
});
tree.raws.after = '';
const result = tree.toString();
assert.deepEqual(signature(postcss.parse(result)), expected, 'Minification changed CSS semantics');
fs.writeFileSync(path.join(rootDir, 'site.min.css'), result);
const report = {sources: sources.length, beforeBytes, afterBytes: Buffer.byteLength(result), duplicateRules, duplicateDeclarations, hash: crypto.createHash('sha256').update(result).digest('hex').slice(0,12)};
fs.writeFileSync(path.join(__dirname, 'css-build-report.json'), JSON.stringify(report, null, 2) + '\n');
// Once the bundle is connected, rebuilds also refresh its cache key.
if (/href="site\.min\.css(?:\?[^"]*)?"/.test(html)) {
  fs.writeFileSync(path.join(rootDir,'index.html'),html.replace(/href="site\.min\.css(?:\?[^"]*)?"/,`href="site.min.css?v=${report.hash}"`));
}
console.log(JSON.stringify(report));
