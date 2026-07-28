#!/usr/bin/env node
// 从 Wikimedia Commons 批量检索并下载自由许可的历史照片（含严格质检）
// 用法: node tools/fetch_photos.js [起始序号] [数量]
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'photos');
const CREDITS = path.join(OUT, 'CREDITS.json');
fs.mkdirSync(OUT, { recursive: true });

const queries = JSON.parse(fs.readFileSync(path.join(__dirname, 'photo_queries.json'), 'utf8'));
const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : {};
const years = JSON.parse(execSync(`node -e '
global.window={};["act1","act2","act3","act4","act5"].forEach(f=>require("${ROOT}/js/data/"+f+".js"));
const D=global.window.ACT_DATA;const o={};
for(let i=1;i<=5;i++)D[i].cards.forEach(c=>o[c.id]=c.year);
console.log(JSON.stringify(o));'`).toString());

const UA = 'EasternGambitBot/1.0 (https://github.com/fengjh97/eastern-gambit; educational card game)';
const FREE = /(public\s*domain|^pd|cc0|cc[- ]?by|attribution|gfdl|free\s*art)/i;
const BAD_LIC = /(fair\s*use|non-?free|by-nc|by-nd|nc-|-nc|noncommercial|no\s*deriv)/i;
const BAD_TYPE = /\.(pdf|djvu|svg|webm|ogv|ogg|gif|tif|tiff|xcf|mid|wav)$/i;
const BAD_TITLE = /(logo|flag of|coat of arms|map of|location map|emblem|seal of|stamp of|banknote|\bicon\b|screenshot|diagram|chart)/i;

function get(url, depth) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA, 'Accept': '*/*' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && (depth || 0) < 5)
        return get(res.headers.location, (depth || 0) + 1).then(resolve, reject);
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => resolve({ status: res.statusCode, buf: Buffer.concat(c) }));
    }).on('error', reject);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJson = async url => {
  for (let i = 0; i < 4; i++) {
    const r = await get(url); const t = r.buf.toString('utf8');
    if (t.startsWith('{')) return JSON.parse(t);
    await sleep(4000 * (i + 1));
  }
  throw new Error('rate limited');
};

function photoYear(m) {
  const raw = ((m.DateTimeOriginal && m.DateTimeOriginal.value) || (m.DateTime && m.DateTime.value) || '').replace(/<[^>]*>/g, '');
  const mm = raw.match(/(1[89]\d\d|20\d\d)/);
  return mm ? parseInt(mm[1], 10) : null;
}

async function search(q, cardYear) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search' +
    '&gsrsearch=' + encodeURIComponent(q) + '&gsrnamespace=6&gsrlimit=12' +
    '&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1000';
  const j = await getJson(url);
  const pages = (j.query && j.query.pages) ? Object.values(j.query.pages) : [];
  return pages.map(p => {
    const ii = p.imageinfo && p.imageinfo[0]; if (!ii) return null;
    const m = ii.extmetadata || {};
    const lic = (m.LicenseShortName && m.LicenseShortName.value) || '';
    const py = photoYear(m);
    const title = p.title || '';
    return {
      title, lic, py,
      artist: ((m.Artist && m.Artist.value) || '').replace(/<[^>]*>/g, '').trim().slice(0, 90),
      w: ii.thumbwidth || ii.width, h: ii.thumbheight || ii.height,
      thumb: ii.thumburl, page: ii.descriptionurl,
      free: FREE.test(lic.replace(/[- ]/g, '')) && !BAD_LIC.test(lic),
      isPhoto: /^image\/(jpeg|png)$/.test(ii.mime || '') && !BAD_TYPE.test(title) && !BAD_TITLE.test(title),
      eraOk: py == null ? true : (py >= cardYear - 3 && (cardYear >= 1986 || py <= 1999)),
    };
  }).filter(Boolean);
}

async function main() {
  const ids = Object.keys(queries);
  const start = parseInt(process.argv[2] || '0', 10);
  const count = parseInt(process.argv[3] || String(ids.length), 10);
  const slice = ids.slice(start, start + count);
  let hit = 0, miss = 0;

  for (const id of slice) {
    const dest = path.join(OUT, id + '.jpg');
    if (fs.existsSync(dest)) { continue; }
    const entry = queries[id]; const cy = years[id] || 1960;
    let picked = null;
    for (const q of entry.queries) {
      try {
        const results = await search(q, cy);
        const ok = results.filter(r => r.free && r.isPhoto && r.eraOk && r.thumb && r.w >= 400);
        ok.sort((a, b) => ((b.py ? 1 : 0) - (a.py ? 1 : 0)) ||
          ((b.w / Math.max(b.h, 1) > 1 ? 1 : 0) - (a.w / Math.max(a.h, 1) > 1 ? 1 : 0)));
        if (ok.length) { picked = Object.assign({ query: q }, ok[0]); break; }
      } catch (e) { }
      await sleep(1100);
    }
    if (!picked) { miss++; console.log('MISS', id, entry.name); continue; }
    try {
      const img = await get(picked.thumb);
      if (img.status !== 200 || img.buf.length < 3000) { miss++; console.log('DLFAIL', id); continue; }
      const tmp = path.join(OUT, id + '.tmp');
      fs.writeFileSync(tmp, img.buf);
      try {
        execSync(`sips -s format jpeg -s formatOptions 78 --resampleWidth 640 "${tmp}" --out "${dest}"`, { stdio: 'ignore' });
        fs.unlinkSync(tmp);
      } catch (e) { fs.renameSync(tmp, dest); }
      credits[id] = { name: entry.name, title: picked.title, license: picked.lic, artist: picked.artist, source: picked.page, query: picked.query, photoYear: picked.py };
      fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1));
      hit++;
      console.log('OK  ', id, entry.name, '|', picked.lic, '|', picked.py || '?');
    } catch (e) { miss++; console.log('ERR ', id, e.message); }
    await sleep(1300);
  }
  console.log(`\n完成：命中 ${hit} / 未命中 ${miss} / 本批 ${slice.length}`);
  fs.writeFileSync('/tmp/eg_fallback_ids.txt',
    ids.filter(id => !fs.existsSync(path.join(OUT, id + '.jpg'))).join('\n') + '\n');
  console.log('累计已下载：', fs.readdirSync(OUT).filter(f => f.endsWith('.jpg')).length);
}
main();
