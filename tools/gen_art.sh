#!/bin/bash
# 批量生成美术素材 → assets/img/<key>.jpg
set -u
GEN="$CCSKILL_NANOBANANA_DIR/venv/bin/python $CCSKILL_NANOBANANA_DIR/generate_image.py"
OUT="/Users/nianian/Documents/08_GitHub/eastern-gambit/assets/img"
TMP="/tmp/eg_art"
mkdir -p "$OUT" "$TMP"

POSTER="Chinese propaganda poster painting style of the 1950s-1970s, bold crimson red and gold palette, heroic socialist realism composition, woodcut brush texture, aged paper grain and slight fading, absolutely no text, no letters, no watermark"
PHOTO="aged historical documentary photograph, mid-20th century China, black and white with sepia toning, heavy film grain, scratches and dust, vignette edges, cinematic composition, no text, no watermark"

gen() { # name res aspect prompt
  local name="$1" res="$2" aspect="$3" prompt="$4"
  if [ -f "$OUT/$name.jpg" ]; then echo "skip $name"; return; fi
  rm -rf "$TMP/$name"; mkdir -p "$TMP/$name"
  echo "=== $name ==="
  $GEN "$prompt" --resolution "$res" --aspect "$aspect" --output "$TMP/$name" || { echo "FAIL $name"; return; }
  local f
  f=$(ls -t "$TMP/$name" | head -1)
  if [ -n "$f" ]; then
    if command -v sips >/dev/null && [[ "$f" != *.jpg ]]; then
      sips -s format jpeg "$TMP/$name/$f" --out "$OUT/$name.jpg" >/dev/null 2>&1 || cp "$TMP/$name/$f" "$OUT/$name.jpg"
    else
      cp "$TMP/$name/$f" "$OUT/$name.jpg"
    fi
    echo "OK $name"
  fi
  sleep 2
}

# 标题与五幕海报（宣传画风）
gen title 2K 16:9 "$POSTER. A majestic sunrise with radiating golden rays behind the silhouette of Tiananmen gate tower, sea of red flags held by silhouetted crowds of workers farmers and soldiers, doves flying across a deep red sky, grand epic composition for a game title screen"
gen act1 2K 16:9 "$POSTER. Dawn over a new nation: heroic workers, farmers and soldiers marching forward together holding red banners, factory chimneys and golden wheat fields behind them, rising sun, hopeful and determined mood, year 1949"
gen act2 2K 16:9 "$POSTER. A stormy sky over glowing backyard steel furnaces at night, crowds carrying red banners between fire light and dark storm clouds, uneasy heroic atmosphere, cracked earth in the foreground, late 1950s"
gen act3 2K 16:9 "$POSTER. A dark crimson sea of red flags and big-character posters covering high walls, endless silhouetted crowd raising small books in the air, stormy sky with a single beam of light breaking through, oppressive yet grand, late 1960s"
gen act4 2K 16:9 "$POSTER. Bright optimistic scene: construction cranes and rising modern skyscraper skeletons over a southern Chinese coastal city, golden morning light, doves flying, farmers and engineers looking toward the horizon, early 1980s optimism"
gen act5 2K 16:9 "$POSTER. A giant container port at golden dawn with cargo cranes and a jet airliner ascending over a globe motif, red and gold palette, confident forward-looking composition, 1990s modernization"

# 幕末场景（做旧照片风）
gen finale1 2K 16:9 "$PHOTO. A rural crossroad between vast commune wheat fields, propaganda banners on wooden poles flapping in the wind, dramatic storm light on the horizon, 1957"
gen finale2 2K 16:9 "$PHOTO. Two steam trains departing in opposite directions from a snowy border railway station, a faded red star on the station wall, cold winter light, symbolic separation, 1960s"
gen finale3 2K 16:9 "$PHOTO. A Boeing 707 airliner taxiing on a frozen Beijing airport tarmac in February 1972, a line of officials in winter coats waiting at a distance, historic diplomatic arrival, winter haze"
gen finale4 2K 16:9 "$PHOTO. An empty broad city avenue at dawn, rows of street lamps still lit, scattered papers drifting in the wind, somber and quiet after a long night, 1989"
gen finale5 2K 16:9 "$PHOTO. A grand international conference hall with rows of delegates seen from behind, a wooden gavel about to fall on the podium under spotlights, flags of many nations blurred in the background, 2001"

# 结局图
gen ending_collapse 2K 16:9 "$POSTER. A torn faded red flag flapping over dark ruins and rubble under an ash-grey sky, crows circling, tragic monumental composition, muted colors with one deep red accent"
gen ending_golden 2K 16:9 "$POSTER. Triumphant golden sunrise over a gleaming modern city skyline by a river, high-speed train and ascending rocket trails, jubilant crowds with red and gold flags in the foreground, radiant optimism"
gen ending_hideshine 2K 16:9 "$PHOTO. An immense quiet container port at first light, thousands of stacked containers and towering cranes in morning mist, a single worker with a lunchbox walking along the dock, understated power"
gen ending_burden 2K 16:9 "$PHOTO. A lone worker carrying a heavy load across a long bridge at dawn, bent forward but steadily walking, vast river and industrial skyline in haze behind him, perseverance"
gen ending_iron 2K 16:9 "$POSTER. Dark red military might: silhouetted ballistic missile trucks and marching ranks in a night parade under searchlight beams, storm clouds, imposing and cold, steel grey and crimson palette"
gen ending_fortress 2K 16:9 "$POSTER. A single bright red flag flying on a snow-covered fortress wall in a blizzard, one sentry silhouette standing guard, vast white emptiness around, lonely defiance"
gen ending_drift 2K 16:9 "$PHOTO. A small wooden boat adrift in the middle of a wide misty river at dusk, warm lights of two different city shores glowing far away on both sides, the boatman resting his oar, melancholy ambiguity"

# 卡牌类别图（做旧照片风，小尺寸）
gen card_diplomacy 1K 16:9 "$PHOTO. Close-up of a formal handshake across a dark wooden negotiation table with porcelain teacups and documents, two delegations blurred, 1950s diplomatic meeting"
gen card_economy 1K 16:9 "$PHOTO. Steel mill interior with molten iron pouring bright sparks, silhouetted workers with shovels, heroic industrial labor, 1950s"
gen card_military 1K 16:9 "$PHOTO. Silhouetted artillery pieces and helmeted soldiers on a ridge at dusk, red signal flare light on the horizon, tense frontline atmosphere"
gen card_home 1K 16:9 "$PHOTO. A village square mass meeting: farmers seated on benches listening, banners strung between trees, a speaker gesturing on a wooden stage, 1950s rural China"
gen card_crisis 1K 16:9 "$PHOTO. A dim telegraph office at midnight, urgent telegrams scattered under a desk lamp, a hand reaching for a red-sealed envelope, dramatic noir shadows"
gen card_boon 1K 16:9 "$PHOTO. A jubilant celebration parade with drums, cymbals and paper flowers, crowds smiling and waving small flags, confetti in the air, 1950s China festival"
gen card_world 1K 16:9 "$PHOTO. An old world map spread on a table under a green banker's lamp, brass compass and marked pins connected by strings, cigarette smoke drifting through the light"

echo "ALL DONE"; ls "$OUT"
