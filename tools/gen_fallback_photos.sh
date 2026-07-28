#!/bin/bash
# 对检索不到合格史料照片的卡，用 nanobanana 生成同风格做旧照片兜底
# 用法: tools/gen_fallback_photos.sh [id列表文件]
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GEN="$CCSKILL_NANOBANANA_DIR/venv/bin/python $CCSKILL_NANOBANANA_DIR/generate_image.py"
OUT="$ROOT/assets/photos"
TMP="/tmp/eg_fb"
LIST="${1:-/tmp/eg_fallback_ids.txt}"
mkdir -p "$TMP" "$OUT"

STYLE="authentic-looking aged documentary photograph from mid-20th century China, black and white with warm sepia toning, visible film grain, slight scratches and dust, archival press photo quality, natural candid composition, period-accurate clothing and equipment, absolutely no text, no captions, no watermark, no modern objects"

[ -s "$LIST" ] || { echo "无需兜底"; exit 0; }
echo "兜底生成 $(grep -c . "$LIST") 张"
while read -r id; do
  [ -z "$id" ] && continue
  [ -f "$OUT/$id.jpg" ] && continue
  info=$(node -e "
    const q=JSON.parse(require('fs').readFileSync('$ROOT/tools/photo_queries.json','utf8'));
    const e=q['$id']; if(e) console.log(e.name+'\t'+e.queries[0]);")
  name=$(echo "$info" | cut -f1); query=$(echo "$info" | cut -f2)
  [ -z "$name" ] && continue
  echo "=== $id $name ==="
  rm -rf "$TMP/$id"; mkdir -p "$TMP/$id"
  $GEN "$STYLE. Depicting: $query" --resolution 1K --aspect 16:9 --output "$TMP/$id" >/dev/null 2>&1
  f=$(ls -t "$TMP/$id" 2>/dev/null | head -1)
  if [ -n "$f" ]; then
    sips -s format jpeg -s formatOptions 78 --resampleWidth 640 "$TMP/$id/$f" --out "$OUT/$id.jpg" >/dev/null 2>&1 \
      || cp "$TMP/$id/$f" "$OUT/$id.jpg"
    node -e "
      const fs=require('fs');const p='$OUT/CREDITS.json';
      const c=fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):{};
      c['$id']={name:'$name',title:'AI 生成的时代风格示意图',license:'Generated',artist:'Nano Banana Pro (本项目生成)',source:'',query:'$query'};
      fs.writeFileSync(p,JSON.stringify(c,null,1));"
    echo "OK $id"
  else echo "FAIL $id"; fi
  sleep 2
done < "$LIST"
echo "完成。当前总数：$(ls "$OUT"/*.jpg 2>/dev/null | wc -l)"
