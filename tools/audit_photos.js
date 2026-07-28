#!/usr/bin/env node
// 相关性审计：挑出非照片媒体与标题完全无关的配图
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const queries = JSON.parse(fs.readFileSync(path.join(__dirname, 'photo_queries.json'), 'utf8'));
const credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/photos/CREDITS.json'), 'utf8'));
const BAD = /\.(pdf|djvu|svg|webm|ogv|ogg|tif|tiff|xcf)$/i;
const bad = [];
for (const id of Object.keys(queries)) {
  const c = credits[id];
  if (!c || c.license === 'Generated') continue;
  const t = (c.title || '').replace(/^File:/, '');
  if (BAD.test(t)) bad.push(id);
}
console.log('非照片媒体误配:', bad.length, '/', Object.keys(queries).length);
fs.writeFileSync('/tmp/eg_fallback_ids.txt', bad.join('\n') + (bad.length ? '\n' : ''));
