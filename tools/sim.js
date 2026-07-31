// 全流程蒙特卡洛模拟：node tools/sim.js [局数] [策略]
// 策略: random | greedy(缺啥补啥+优先打事件)
global.window = {};
global.localStorage = { getItem: () => null, setItem: () => { }, removeItem: () => { } };
['act1','act2','act3','act4','act5','endings','reactions'].forEach(f => require('../js/data/' + f + '.js'));
require('../js/engine.js');
const E = global.window.Engine;
const ENDINGS = global.window.ENDINGS;

const N = parseInt(process.argv[2] || '300', 10);
const STRAT = process.argv[3] || 'greedy';

function usDelta(o) {
  // 粗估选项对美国关系的影响（含roll分支平均）
  let d = 0;
  if (o.fx && o.fx.rel && o.fx.rel.us) d += o.fx.rel.us;
  if (o.roll) {
    for (const b of ['ok', 'bad']) {
      const fx = o.roll[b] && o.roll[b].fx;
      if (fx && fx.rel && fx.rel.us) d += fx.rel.us / 2;
    }
  }
  return d;
}

function pickChoice(card) {
  const choices = card.event.choices;
  const avail = choices.map((c, i) => ({ c, i })).filter(x => E.meets(x.c).ok);
  if (!avail.length) return null;
  if (STRAT === 'wto') {
    avail.sort((a, b) => usDelta(b.c) - usDelta(a.c));
    return avail[0].i;
  }
  return avail[Math.floor(Math.random() * avail.length)].i;
}

function playTurn() {
  const st = E.state;
  while (st.playsLeft > 0 && st.hand.length && !st.gameOver) {
    let id;
    const hand = st.hand.map(h => E.cardById(h));
    // 危机优先处理
    const crisis = hand.find(c => c.type === 'crisis');
    const playableEvents = hand.filter(c => E.eventPlayable(c).ok);
    if (STRAT === 'wto') {
      // 优先打对美友好/正面事件，坏美事件弃掉换AP
      if (crisis && E.eventPlayable(crisis).ok) id = crisis.id;
      else {
        const scored = playableEvents.map(c => {
          let s = 0;
          if (c.event.choices) s = Math.max(...c.event.choices.map(usDelta));
          else s = usDelta(c.event);
          return { c, s };
        }).sort((a, b) => b.s - a.s);
        id = scored.length && scored[0].s >= 0 ? scored[0].c.id : hand[0].id;
      }
    } else if (STRAT === 'greedy') {
      if (crisis && E.eventPlayable(crisis).ok) id = crisis.id;
      else if (playableEvents.length) id = playableEvents[Math.floor(Math.random() * playableEvents.length)].id;
      else id = hand[0].id;
    } else {
      id = st.hand[Math.floor(Math.random() * st.hand.length)];
    }
    const card = E.cardById(id);
    const asEvent = E.eventPlayable(card).ok && (STRAT === 'greedy' ? Math.random() < .8 : Math.random() < .5);
    if (asEvent) {
      const ci = card.event.choices ? pickChoice(card) : null;
      if (card.event.choices && ci == null) { E.discardForAP(id); }
      else E.playEvent(id, ci);
    } else {
      E.discardForAP(id);
    }
    // 花AP：greedy 补最低资源
    while (st.ap >= 2 && !st.gameOver) {
      if (STRAT === 'wto') {
        const r = (st.act >= 3 && st.rel.us < 4 && st.rel.us < E.usCap()) ? E.spendAP('diplo', 'us') : null;
        if (r && !r.capped) { /* 外交成功 */ }
        else if (st.res.ECO < 65) E.spendAP('eco');
        else {
          const min = E.RES_KEYS.reduce((a, k) => st.res[k] < st.res[a] ? k : a);
          E.spendAP({ STB: 'stb', ECO: 'eco', MIL: 'mil', DIP: 'prop' }[min]);
        }
      } else if (STRAT === 'greedy') {
        const min = E.RES_KEYS.reduce((a, k) => st.res[k] < st.res[a] ? k : a);
        const map = { STB: 'stb', ECO: 'eco', MIL: 'mil', DIP: 'prop' };
        E.spendAP(map[min] === 'prop' && st.ap < 2 ? 'eco' : map[min]);
      } else {
        const acts = ['eco', 'mil', 'stb'];
        E.spendAP(acts[Math.floor(Math.random() * acts.length)]);
      }
    }
  }
}

const tally = {}, collapseAt = {}, resSum = { STB: 0, ECO: 0, MIL: 0, DIP: 0 };
let errors = 0;
for (let g = 0; g < N; g++) {
  try {
    E.newGame();
    let guard = 0;
    while (!E.state.gameOver && E.state.phase !== 'ending' && guard++ < 500) {
      const st = E.state;
      if (st.phase === 'turnzero') { E.rollTurnZero(); continue; }
      if (st.phase === 'play') { playTurn(); if (!st.gameOver) E.endTurn(); continue; }
      if (st.phase === 'finale') {
        const fc = E.finaleChoices();
        const avail = fc.map((c, i) => ({ c, i })).filter(x => x.c.available);
        const pick = !avail.length ? fc.length - 1 : (STRAT === 'wto' ? avail[0].i : avail[Math.floor(Math.random() * avail.length)].i);
        const r = E.resolveFinale(pick);
        if (r.ending) { tally[r.ending.id] = (tally[r.ending.id] || 0) + 1; break; }
        continue;
      }
      break;
    }
    if (E.state.gameOver) {
      const id = E.state.gameOver.id;
      tally[id] = (tally[id] || 0) + 1;
      collapseAt[E.state.act] = (collapseAt[E.state.act] || 0) + 1;
    }
    for (const k of Object.keys(resSum)) resSum[k] += E.state.res[k];
  } catch (e) {
    errors++;
    if (errors <= 3) console.error('ERROR game', g, e.message, e.stack.split('\n')[1]);
  }
}
console.log('策略:', STRAT, '| 局数:', N, '| 运行时错误:', errors);
console.log('结局分布:');
Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([id, n]) => {
  const e = ENDINGS[id] || {};
  console.log('  ', (e.title || id).padEnd(8, '　'), n, '(' + (n / N * 100).toFixed(1) + '%)');
});
console.log('崩盘所在幕:', JSON.stringify(collapseAt));
console.log('平均终局资源:', Object.fromEntries(Object.entries(resSum).map(([k, v]) => [k, Math.round(v / N)])));
