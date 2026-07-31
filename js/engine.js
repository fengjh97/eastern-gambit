// 东方棋局 · 游戏引擎（纯逻辑，无 DOM）
(function () {
  'use strict';

  const RES_KEYS = ['STB', 'ECO', 'MIL', 'DIP'];
  const REL_KEYS = ['ussr', 'us', 'uk', 'eu', 'jp', 'sea', 'tw', 'nk', 'sk'];
  const RES_NAMES = { STB: '稳定', ECO: '经济', MIL: '军事', DIP: '国际地位' };
  const REL_NAMES = { ussr: '苏联', us: '美国', uk: '英国', eu: '欧洲', jp: '日本', sea: '东南亚', tw: '台湾', nk: '朝鲜', sk: '韩国' };
  const REL_NAMES_ACT5 = Object.assign({}, REL_NAMES, { ussr: '俄罗斯' });

  const AP_ACTIONS = {
    diplo: { name: '外交攻势', cost: 2, desc: '指定国家关系 +1' },
    eco: { name: '经济建设', cost: 1, desc: '经济 +2' },
    mil: { name: '军备整训', cost: 1, desc: '军事 +2' },
    stb: { name: '安定民心', cost: 1, desc: '稳定 +2' },
    prop: { name: '宣传攻势', cost: 2, desc: '国际地位 +2' },
    spy: { name: '情报刺探', cost: 2, desc: '窥破苏/美本幕战略议程' },
  };

  // 前置旗标的中文名（锁定卡提示用）
  const FLAG_NAMES = {
    korea_war: '抗美援朝', no_korea: '半岛按兵不动', qian: '钱学森归国', bomb: '第一颗原子弹',
    bandung: '万隆会议', daqing: '大庆油田', self_reliance: '自力更生', vietnam_aid: '援越抗美',
    sov_threat: '苏联核威胁', pingpong: '乒乓外交', kissinger: '基辛格密访', nixon_ok: '尼克松访华',
    un_seat: '恢复联合国席位', jp_normal: '中日建交', satellite: '东方红一号', hbomb_ready: '氢弹预研',
    reform: '十一届三中全会', sez: '经济特区', us_normal: '中美建交', hk_deal: '中英联合声明',
    hk_force: '强行收回香港', hk_window: '香港窗口', demob: '百万大裁军', viet_war: '对越自卫还击',
    price_reform_ok: '价格闯关成功', south_tour: '南方谈话', russia_ties: '中俄建交',
    soe_reform: '国企改革', sg_model: '新加坡经验', hk_return: '香港回归', baochan: '包产到户',
    famine: '三年困难', wto: '加入世贸', four_mod: '四个现代化', gang_smashed: '粉碎四人帮',
    deng_back: '邓小平复出', sino_sov_normal: '中苏关系正常化', sk_ties: '中韩建交',
  };
  const flagName = f => FLAG_NAMES[f] || f;

  const SAVE_KEY = 'eastern_gambit_save_v1';

  let state = null;

  // ---------- 工具 ----------
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function hasFlag(f) { return state.flags.includes(f); }
  function addFlag(f) { if (!hasFlag(f)) state.flags.push(f); }

  function cardById(id) {
    const act = id ? parseInt(id.slice(1, 2), 10) : 0;
    const data = window.ACT_DATA[act];
    return data ? data.cards.find(c => c.id === id) : null;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---------- 效果应用 ----------
  // 返回 delta 列表供 UI 播放动画
  function applyFx(fx) {
    const deltas = [];
    if (!fx) return deltas;
    if (fx.res) for (const k of Object.keys(fx.res)) {
      const d = fx.res[k]; if (!d) continue;
      const before = state.res[k];
      state.res[k] = clamp(before + d, 0, 100);
      deltas.push({ type: 'res', key: k, name: RES_NAMES[k], delta: state.res[k] - before, now: state.res[k] });
    }
    if (fx.rel) for (const k of Object.keys(fx.rel)) {
      const d = fx.rel[k]; if (!d) continue;
      const before = state.rel[k];
      state.rel[k] = clamp(before + d, -10, 10);
      // 中美关系上行受时代天花板约束（已在天花板之上的不强降）
      if (k === 'us' && d > 0) state.rel.us = Math.min(state.rel.us, Math.max(before, usCap()));
      if (state.touched) state.touched[k] = (state.touched[k] || 0) + (state.rel[k] - before);
      deltas.push({ type: 'rel', key: k, name: relNames()[k], delta: state.rel[k] - before, now: state.rel[k] });
    }
    if (fx.flags) for (const f of fx.flags) { addFlag(f); deltas.push({ type: 'flag', name: f }); }
    if (fx.ap) { state.ap += fx.ap; deltas.push({ type: 'ap', delta: fx.ap, now: state.ap }); }
    checkCollapse();
    return deltas;
  }

  function relNames() { return state && state.act >= 5 ? REL_NAMES_ACT5 : REL_NAMES; }

  // 中美关系的历史天花板：没有破冰事件，关系怼不上去
  function usCap() {
    if (hasFlag('us_normal')) return 10;
    if (hasFlag('nixon_ok')) return 5;
    if (hasFlag('pingpong') || hasFlag('kissinger')) return 2;
    if (state.act >= 4) return 2;   // 即便错过尼克松，八十年代也有有限缓和空间
    return -2;
  }

  // ---------- 条件 ----------
  function meets(obj) {
    if (!obj) return { ok: true };
    if (obj.any) return obj.any.some(o => meets(o).ok) ? { ok: true } : { ok: false, why: '条件未达成' };
    if (obj.all) return obj.all.every(o => meets(o).ok) ? { ok: true } : { ok: false, why: '条件未达成' };
    if (obj.requires) for (const f of obj.requires) if (!hasFlag(f)) return { ok: false, why: '需先达成「' + flagName(f) + '」' };
    if (obj.reqRel) for (const k of Object.keys(obj.reqRel)) {
      if (state.rel[k] < obj.reqRel[k]) return { ok: false, why: relNames()[k] + '关系不足（需≥' + obj.reqRel[k] + '）' };
    }
    if (obj.reqRes) for (const k of Object.keys(obj.reqRes)) {
      if (state.res[k] < obj.reqRes[k]) return { ok: false, why: RES_NAMES[k] + '不足（需≥' + obj.reqRes[k] + '）' };
    }
    return { ok: true };
  }

  // ---------- 崩盘与结局 ----------
  function checkCollapse() {
    if (state.gameOver) return;
    const E = window.ENDINGS;
    if (state.res.STB <= 0) state.gameOver = E.collapse_stb;
    else if (state.res.ECO <= 0) state.gameOver = E.collapse_eco;
    else if (state.res.MIL <= 0) state.gameOver = E.collapse_mil;
    else if (state.res.DIP <= 0) state.gameOver = E.collapse_dip;
  }

  function finalEnding() {
    const E = window.ENDINGS;
    const r = state.res, l = state.rel;
    const wto = hasFlag('wto');
    let e, lineBonus = 0;
    if (l.tw >= 8 && (r.MIL >= 60 || r.DIP >= 70 || wto)) { e = E.reunion; lineBonus = 90; }
    else if (wto && RES_KEYS.every(k => r[k] >= 60) && ['us', 'uk', 'eu', 'jp'].every(k => l[k] >= 3)) { e = E.golden; lineBonus = 80; }
    else if (wto && r.ECO >= 60) { e = E.hide_shine; lineBonus = 40; }
    else if (wto) { e = E.burden; lineBonus = 15; }
    else if (r.DIP >= 70 && l.sea >= 5 && hasFlag('un_seat')) { e = E.nonaligned; lineBonus = 55; }
    else if (r.MIL >= 70 && l.us <= -5) { e = E.iron_east; lineBonus = r.ECO >= 50 ? 50 : 25; }
    else if (l.nk >= 5 && hasFlag('red_brother')) { e = E.red_fortress; lineBonus = 40; }
    else e = E.drift;

    const addenda = [];
    if (l.tw >= 8 && e !== E.reunion) addenda.push(E.addenda.strait);
    if (hasFlag('bomb')) addenda.push(E.addenda.bomb);
    if (hasFlag('hk_return')) addenda.push(E.addenda.hk);
    const total = score() + lineBonus;
    const grade = (E.grades || []).find(g => total >= g.min);
    return Object.assign({}, e, { addenda, score: total, grade });
  }

  // 终局成就判定
  function evalAchievements() {
    const list = window.ACHIEVEMENTS || [];
    return list.filter(a => {
      const c = a.cond || {};
      if (c.flags && !c.flags.every(f => hasFlag(f))) return false;
      if (c.res) for (const k of Object.keys(c.res)) if (state.res[k] < c.res[k]) return false;
      if (c.rel) for (const k of Object.keys(c.rel)) if (state.rel[k] < c.rel[k]) return false;
      if (c.counter) {
        const v = c.counter === 'trumpsPlayed' ? (state.trumpsPlayed || []).length : (state[c.counter] || 0);
        if (v < c.n) return false;
      }
      if (c.survived && state.gameOver) return false;
      return true;
    });
  }

  // 标签图鉴：当前持有的旗标 + 它们在何处生效（动态扫描全部数据）
  let flagUsesCache = null;
  function flagUses() {
    if (flagUsesCache) return flagUsesCache;
    const uses = {};
    const add = (f, txt) => { const arr = uses[f] = uses[f] || []; if (!arr.includes(txt)) arr.push(txt); };
    for (let i = 1; i <= 5; i++) {
      const d = window.ACT_DATA[i]; if (!d) continue;
      d.cards.forEach(c => (c.requires || []).forEach(f => add(f, '解锁卡牌「' + c.name + '」')));
      (d.turnZero || []).forEach(t => (t.mod || []).forEach(m => add(m.flag, '影响第' + i + '幕时局骰「' + t.name + '」' + (m.delta > 0 ? '（有利）' : '（不利）'))));
      const walkReq = (o, label) => { if (!o) return;
        (o.requires || []).forEach(f => add(f, label));
        (o.any || []).forEach(x => walkReq(x, label));
        (o.all || []).forEach(x => walkReq(x, label));
      };
      (d.finale && d.finale.choices || []).forEach(ch => walkReq(ch, '开启第' + i + '幕幕末选项「' + ch.label + '」'));
    }
    if (window.TRUMPS) Object.values(window.TRUMPS).forEach(t => {
      const walk = o => { if (!o) return; (o.requires || []).forEach(f => add(f, '解锁王牌「' + t.name + '」')); (o.any || []).forEach(walk); (o.all || []).forEach(walk); };
      walk(t.unlock);
      (t.deadFlag || []).forEach(f => add(f, '使王牌「' + t.name + '」作废'));
    });
    if (window.REACTIONS) Object.values(window.REACTIONS.agendas || {}).forEach(actPool =>
      Object.values(actPool).forEach(arr => arr.forEach(a => {
        const walk = o => { if (!o) return; (o.requires || []).forEach(f => add(f, '破解议程「' + a.name + '」的条件之一')); (o.any || []).forEach(walk); (o.all || []).forEach(walk); };
        walk(a.counter);
      })));
    // 引擎内部效果
    add('yibiandao', '中苏决裂结算时创伤加重（一边倒的代价）');
    add('korea_war', '影响苏联议程「火中取栗」结算');
    add('wto', '决定入世系结局');
    add('red_brother', '「最后的红色堡垒」结局条件');
    add('bandung', '解锁王牌「第三世界牌」');
    flagUsesCache = uses;
    return uses;
  }
  function flagList() {
    const uses = flagUses();
    return state.flags.map(f => ({ flag: f, name: flagName(f), uses: uses[f] || ['历史印记（供结局与成就判定）'] }));
  }

  function score() {
    let s = RES_KEYS.reduce((a, k) => a + state.res[k], 0);
    s += REL_KEYS.reduce((a, k) => a + Math.max(0, state.rel[k]) * 2, 0);
    s += state.flags.length * 3;
    // 均衡治国加成：四资源全部≥50再奖，短板惩罚
    const minRes = Math.min(...RES_KEYS.map(k => state.res[k]));
    if (minRes >= 60) s += 80; else if (minRes >= 50) s += 40; else if (minRes < 25) s -= 40;
    return s;
  }

  // ---------- 游戏流程 ----------
  function newGame() {
    state = {
      act: 1, turn: 0, phase: 'turnzero', tzIndex: 0,
      res: { STB: 40, ECO: 20, MIL: 35, DIP: 15 },
      rel: { ussr: 6, us: -6, uk: -2, eu: -3, jp: -4, sea: -2, tw: -8, nk: 5, sk: -5 },
      flags: [], deck: [], discard: [], removed: [], hand: [],
      playsLeft: 0, ap: 0, log: [], gameOver: null, endingShown: false,
      touched: {}, thresholdUsed: {}, agendas: null, spyUsed: false,
      trumpActUsed: 0, trumpHot: null, agendaFoiled: 0, trumpsPlayed: [],
    };
    buildDeck();
    drawAgendas();
    save();
    return state;
  }

  // ---------- 苏美议程暗棋 ----------
  function drawAgendas() {
    const pool = window.REACTIONS && window.REACTIONS.agendas[state.act];
    state.agendas = {};
    state.spyUsed = false;
    if (!pool) return;
    for (const power of ['ussr', 'us']) {
      const opts = pool[power];
      if (opts && opts.length) {
        const def = opts[Math.floor(Math.random() * opts.length)];
        state.agendas[power] = { id: def.id, revealed: false, hintIdx: 0 };
      }
    }
  }

  function agendaDef(power) {
    const pool = window.REACTIONS && window.REACTIONS.agendas[state.act];
    const a = state.agendas && state.agendas[power];
    if (!pool || !a) return null;
    return (pool[power] || []).find(d => d.id === a.id) || null;
  }

  // UI 用：已揭破的议程显示名称与破解条件达成情况
  function agendaInfo(power) {
    const a = state.agendas && state.agendas[power];
    const def = agendaDef(power);
    if (!a || !def) return null;
    return {
      power, revealed: a.revealed,
      name: a.revealed ? def.name : null,
      counterDesc: a.revealed ? def.counterDesc : null,
      countered: a.revealed ? meets(def.counter).ok : null,
    };
  }

  // ---------- 历史王牌 ----------
  function trumpState(id) {
    const def = window.TRUMPS && window.TRUMPS[id];
    if (!def) return null;
    if (def.deadFlag && def.deadFlag.some(f => hasFlag(f))) return 'dead';
    if (def.unlock && !meets(def.unlock).ok) return 'locked';
    if (state.trumpActUsed === state.act) return 'usedAct';
    return 'ready';
  }

  function trumpInfo() {
    if (!window.TRUMPS) return [];
    return Object.keys(window.TRUMPS).map(id => {
      const def = window.TRUMPS[id];
      return Object.assign({ state: trumpState(id) }, def);
    });
  }

  function playTrump(id) {
    const def = window.TRUMPS[id];
    if (!def || trumpState(id) !== 'ready' || state.phase !== 'play') return null;
    const gainDeltas = applyFx(def.gain.fx);
    const costDeltas = applyFx(def.cost.fx);
    state.trumpActUsed = state.act;
    if (!state.trumpsPlayed.includes(id)) state.trumpsPlayed.push(id);
    state.trumpHot = { foe: def.foe, turns: 2, name: def.name };
    log('【王牌】打出「' + def.name + '·' + def.sub + '」！' + def.aftermath);
    save();
    return { def, gainDeltas, costDeltas };
  }

  function buildDeck() {
    const data = window.ACT_DATA[state.act];
    const all = data.cards.filter(c => !state.removed.includes(c.id));
    const prio = shuffle(all.filter(c => c.priority).map(c => c.id));
    const rest = shuffle(all.filter(c => !c.priority).map(c => c.id));
    // 关键历史卡保证在前四个回合内被抽到：随机插入牌堆顶部15张（pop 从数组尾抽）
    state.deck = rest;
    const top = Math.min(15, state.deck.length);
    for (const id of prio) {
      const pos = state.deck.length - Math.floor(Math.random() * top);
      state.deck.splice(pos, 0, id);
    }
    state.discard = [];
    state.hand = [];
  }

  // Turn Zero：逐条掷骰。返回 {entry, roll, mod, final, outcome, deltas}
  function rollTurnZero() {
    const data = window.ACT_DATA[state.act];
    const entry = data.turnZero[state.tzIndex];
    if (!entry) return null;
    const roll = d6();
    let mod = 0;
    if (entry.mod) for (const m of entry.mod) if (hasFlag(m.flag)) mod += m.delta;
    const final = clamp(roll + mod, 1, 6);
    const outcome = entry.outcomes.find(o => final >= o.range[0] && final <= o.range[1]);
    const deltas = applyFx(outcome.fx);
    log('【时局骰】' + entry.name + '：' + outcome.desc);
    state.tzIndex++;
    const done = state.tzIndex >= data.turnZero.length;
    if (done) { state.phase = 'play'; startTurn(); }
    save();
    return { entry, roll, mod, final, outcome, deltas, done };
  }

  function startTurn() {
    state.turn++;
    state.playsLeft = 3;
    state.touched = {};
    state.mulliganUsed = false;
    if (state.res.STB >= 60) {
      state.ap += 1;
      log('【政通人和】稳定≥60，民力可用，行动点+1。');
    }
    const drawn = [];
    while (state.hand.length < 6) {
      if (!state.deck.length) {
        if (!state.discard.length) break;
        state.deck = shuffle(state.discard.splice(0));
      }
      const id = state.deck.pop();
      state.hand.push(id); drawn.push(id);
    }
    log('—— ' + turnLabel() + ' ——');
    save();
    return drawn;
  }

  function turnLabel() {
    const meta = window.ACT_DATA[state.act].meta;
    const [y0, y1] = meta.years.split('–').map(Number);
    const y = Math.min(y1, y0 + Math.round((y1 - y0) * (state.turn - 1) / (meta.turns - 1 || 1)));
    return '第' + state.act + '幕 · 第' + state.turn + '回合 · ' + y + '年前后';
  }

  // 事件可打性
  function eventPlayable(card) { return meets(card); }

  // 打出事件。choiceIdx: 有 choices 时必传。返回结算包
  function playEvent(cardId, choiceIdx) {
    const card = cardById(cardId);
    const result = { card, texts: [], deltas: [], roll: null };
    let ev = card.event;
    let branch = null;

    if (ev.choices != null) {
      branch = ev.choices[choiceIdx];
      result.choiceLabel = branch.label;
    } else {
      branch = ev;
    }

    if (branch.fx) { result.deltas.push(...applyFx(branch.fx)); if (branch.desc && branch !== ev) result.texts.push(branch.desc); }
    if (branch.roll) {
      const r = d6();
      const ok = r >= branch.roll.ge;
      const out = ok ? branch.roll.ok : branch.roll.bad;
      result.roll = { value: r, ge: branch.roll.ge, ok };
      result.texts.push(out.desc);
      result.deltas.push(...applyFx(out.fx));
    } else if (branch === ev && ev.desc) {
      result.texts.push(ev.desc);
    }

    finishCard(card, true);
    log('【事件】' + card.name + (result.choiceLabel ? '（' + result.choiceLabel + '）' : '') + ' ' + result.texts.join(' '));
    save();
    return result;
  }

  // 弃牌换AP（危机卡触发削弱效果）
  function discardForAP(cardId) {
    const card = cardById(cardId);
    state.ap += card.ap;
    const result = { card, ap: card.ap, deltas: [], texts: [] };
    if (card.type === 'crisis' && card.weakened) {
      result.deltas = applyFx(card.weakened.fx);
      result.texts.push(card.weakened.desc);
      log('【危机泄压】' + card.name + '：' + card.weakened.desc);
    } else {
      log('【行动】弃出「' + card.name + '」，行动点+' + card.ap);
    }
    finishCard(card, card.type === 'crisis'); // 危机弃掉也算已结算，移除
    save();
    return result;
  }

  function finishCard(card, resolved) {
    state.hand = state.hand.filter(id => id !== card.id);
    if ((card.once !== false && resolved) || card.type === 'boon') state.removed.push(card.id);
    else state.discard.push(card.id);
    state.playsLeft--;
  }

  // 换牌：每回合一次，弃一张非危机手牌抽一张新牌，不占行动次数
  function mulligan(cardId) {
    const card = cardById(cardId);
    if (!card || state.mulliganUsed || state.phase !== 'play' || card.type === 'crisis') return null;
    state.mulliganUsed = true;
    state.hand = state.hand.filter(id => id !== cardId);
    state.discard.push(cardId);
    let drawn = null;
    if (!state.deck.length && state.discard.length) state.deck = shuffle(state.discard.splice(0));
    if (state.deck.length) { drawn = state.deck.pop(); state.hand.push(drawn); }
    log('【换牌】弃出「' + card.name + '」' + (drawn ? '，抽入新牌' : ''));
    save();
    return { discarded: card, drawn: drawn ? cardById(drawn) : null };
  }

  function spendAP(action, target) {
    const a = AP_ACTIONS[action];
    if (!a || state.ap < a.cost) return null;
    // 中美关系天花板：不扣点直接拒绝
    if (action === 'diplo' && target === 'us' && state.rel.us >= usCap()) {
      return { capped: true, cap: usCap(), deltas: [], ap: state.ap };
    }
    state.ap -= a.cost;
    let fx;
    if (action === 'spy') {
      // 情报刺探：揭破一方议程（优先未揭破者），每幕限一次
      const cand = ['ussr', 'us'].filter(p => state.agendas && state.agendas[p] && !state.agendas[p].revealed);
      if (!cand.length) { state.ap += a.cost; return null; }
      const pick = target && cand.includes(target) ? target : cand[0];
      state.agendas[pick].revealed = true;
      state.spyUsed = true;
      const def = agendaDef(pick);
      log('【情报】截获密电，识破' + (pick === 'ussr' ? '莫斯科' : '华盛顿') + '的战略议程：' + def.name);
      save();
      return { deltas: [], ap: state.ap, spy: { power: pick, name: def.name, counterDesc: def.counterDesc, countered: meets(def.counter).ok } };
    }
    if (action === 'diplo') fx = { rel: { [target]: 1 } };
    else if (action === 'eco') fx = { res: { ECO: 2 } };
    else if (action === 'mil') fx = { res: { MIL: 2 } };
    else if (action === 'stb') fx = { res: { STB: 2 } };
    else fx = { res: { DIP: 2 } };
    const deltas = applyFx(fx);
    log('【国策】' + a.name + (action === 'diplo' ? '→' + relNames()[target] : ''));
    save();
    return { deltas, ap: state.ap };
  }

  function spyAvailable() {
    return !state.spyUsed && ['ussr', 'us'].some(p => state.agendas && state.agendas[p] && !state.agendas[p].revealed);
  }

  // ---------- 回合末博弈反应阶段 ----------
  // 返回电报数组：{ kind, src, title, text, deltas }
  function reactionPhase() {
    const R = window.REACTIONS;
    const wires = [];
    if (!R) return wires;
    const names = relNames();
    const srcOf = k => (state.act >= 5 && R.sourcesAct5[k]) || R.sources[k];
    const pushWire = (kind, key, title, text, fx) => {
      const deltas = fx ? applyFx(fx) : [];
      wires.push({ kind, src: key ? srcOf(key) : '本报综合', title, text, deltas });
    };

    // ① 阈值爆发（每幕每国每方向一次，最高优先级）
    for (const k of REL_KEYS) {
      const v = state.rel[k];
      const dir = v <= -6 ? 'down' : v >= 5 ? 'up' : null;
      if (!dir) continue;
      const usedKey = k + '_' + dir;
      if (state.thresholdUsed[usedKey]) continue;
      const th = R.thresholds[k] && R.thresholds[k][dir];
      if (!th) continue;
      state.thresholdUsed[usedKey] = true;
      pushWire('threshold', k, '【' + th.name + '】' + names[k], th.t, th.fx);
      log('【' + th.name + '】' + th.t);
      break; // 一回合最多爆发一次，避免数值雪崩
    }

    // ② 阵营连锁：本回合对领袖净变动 ≥3 带动盟友
    const blocs = R.blocs[state.act] || {};
    for (const leader of Object.keys(blocs)) {
      const net = state.touched[leader] || 0;
      if (Math.abs(net) < 3) continue;
      const allies = (blocs[leader] || []).filter(a => state.touched[a] == null);
      if (!allies.length) continue;
      const step = net > 0 ? 1 : -1;
      const fx = { rel: {} };
      allies.forEach(a => { fx.rel[a] = step; });
      pushWire('bloc', leader, '阵营连锁 · ' + names[leader] + '集团',
        R.blocText[leader][net > 0 ? 'up' : 'down'], fx);
    }

    // ③ 关系区间行为表（最多2条，本回合被动过的国家优先且概率翻倍）
    const cands = [];
    for (const k of REL_KEYS) {
      const v = state.rel[k];
      const moved = state.touched[k] != null;
      let band = null, base = 0;
      if (v <= -6) { band = 'hostile'; base = 0.20; }
      else if (v >= 5) { band = 'friendly'; base = 0.30; }
      if (!band) continue;
      // 关系越极端概率越高
      const extra = (Math.abs(v) - 5) * 0.035;
      const p = Math.min(0.8, (base + extra) * (moved ? 1.8 : 1));
      if (Math.random() < p) cands.push({ k, band, moved, p });
    }
    cands.sort((a, b) => (b.moved - a.moved) || (b.p - a.p));
    // 每回合最多1条行为反应，避免数值雪崩
    for (const c of cands.slice(0, 1)) {
      const pool = R[c.band][c.k];
      if (!pool || !pool.length) continue;
      const item = pool[Math.floor(Math.random() * pool.length)];
      pushWire(c.band, c.k, names[c.k] + (c.band === 'hostile' ? ' · 反制行动' : ' · 友好举措'), item.t, item.fx);
    }

    // 全无电报时偶尔来一条中立观望氛围电报
    if (!wires.length && Math.random() < 0.35) {
      const n = R.neutral[Math.floor(Math.random() * R.neutral.length)];
      pushWire('neutral', null, '国际观察', n.t, null);
    }

    // ③.5 王牌余波：牌落在对方手中，两回合内必然报复
    if (state.trumpHot && state.trumpHot.turns > 0) {
      const foes = state.trumpHot.foe === 'both' ? ['ussr', 'us'] : [state.trumpHot.foe];
      for (const f of foes) {
        const pool = R.hostile[f];
        if (!pool) continue;
        const item = pool[Math.floor(Math.random() * pool.length)];
        pushWire('revenge', f, '王牌余波 · ' + names[f] + '的报复', item.t, item.fx);
      }
    }

    // ④ 议程暗示（未揭破的议程每回合漏一条线索；王牌热期必然泄露）
    const hotFoes = state.trumpHot && state.trumpHot.turns > 0
      ? (state.trumpHot.foe === 'both' ? ['ussr', 'us'] : [state.trumpHot.foe]) : [];
    for (const power of ['ussr', 'us']) {
      const a = state.agendas && state.agendas[power];
      const def = agendaDef(power);
      if (!a || !def) continue;
      if (a.revealed) {
        const ok = meets(def.counter).ok;
        wires.push({ kind: 'agenda', src: srcOf(power), title: '战略议程 · ' + def.name + (ok ? '（已破解）' : '（未破解）'),
          text: (ok ? '✔ 破解条件已达成：' : '✖ 破解条件尚未达成：') + def.counterDesc, deltas: [] });
      } else if (a.hintIdx < def.hints.length && (hotFoes.includes(power) || Math.random() < 0.55)) {
        wires.push({ kind: 'hint', src: srcOf(power), title: '情报简报 · 疑云', text: def.hints[a.hintIdx], deltas: [] });
        a.hintIdx++;
      }
    }
    return wires;
  }

  // 幕末议程结算
  function resolveAgendas() {
    const out = [];
    for (const power of ['ussr', 'us']) {
      const def = agendaDef(power);
      if (!def) continue;
      const ok = meets(def.counter).ok;
      if (ok) state.agendaFoiled = (state.agendaFoiled || 0) + 1;
      const branch = ok ? def.foil : def.fail;
      const deltas = applyFx(branch.fx);
      out.push({ power, name: def.name, foiled: ok, text: branch.t, deltas, counterDesc: def.counterDesc });
      log('【战略议程】' + def.name + (ok ? '（破解）' : '（得逞）') + '：' + branch.t);
    }
    return out;
  }

  // 回合结束：阵营张力 → 下一回合或幕末
  function endTurn() {
    const out = { tension: null, finale: false };
    if (state.act <= 3) {
      if (state.rel.us > -2 && state.rel.ussr > 0) {
        out.tension = { desc: '两头下注引来两强猜忌：华盛顿与莫斯科同时降温。', deltas: applyFx({ rel: { us: -1, ussr: -1 } }) };
      }
    } else {
      if (state.rel.tw <= -8 && state.rel.us >= 2) {
        out.tension = { desc: '台海对峙的火药味损耗着中美互信。', deltas: applyFx({ rel: { us: -1 } }) };
      }
    }
    // 博弈反应阶段：各国电报（阈值/连锁/行为表/议程线索）
    out.wires = reactionPhase();
    if (state.trumpHot && --state.trumpHot.turns <= 0) state.trumpHot = null;
    if (state.gameOver) { save(); return out; }

    const meta = window.ACT_DATA[state.act].meta;
    if (state.turn >= meta.turns) {
      // 手中未结算危机引爆
      out.crisisBurst = [];
      for (const id of [...state.hand]) {
        const c = cardById(id);
        if (c && c.type === 'crisis' && c.weakened) {
          const deltas = applyFx(c.weakened.fx).concat(applyFx(c.weakened.fx));
          out.crisisBurst.push({ card: c, deltas });
          state.hand = state.hand.filter(x => x !== id);
          state.removed.push(id);
          log('【危机引爆】悬而未决的「' + c.name + '」全面发作！');
        }
      }
      // 幕末：苏美战略议程结算
      out.agendaResults = resolveAgendas();
      state.phase = 'finale';
      out.finale = true;
    } else {
      startTurn();
    }
    save();
    return out;
  }

  function finaleChoices() {
    const f = window.ACT_DATA[state.act].finale;
    return f.choices.map(c => Object.assign({}, c, { available: meets(c).ok, lockReason: meets(c).why }));
  }

  function resolveFinale(choiceIdx) {
    const f = window.ACT_DATA[state.act].finale;
    const choice = f.choices[choiceIdx];
    const result = { choice, texts: [], deltas: [], roll: null };
    if (choice.fx) result.deltas.push(...applyFx(choice.fx));
    if (choice.roll) {
      const r = d6();
      const ok = r >= choice.roll.ge;
      const out = ok ? choice.roll.ok : choice.roll.bad;
      result.roll = { value: r, ge: choice.roll.ge, ok };
      result.texts.push(out.desc);
      result.deltas.push(...applyFx(out.fx));
    }
    log('【幕末】' + f.title + '：' + choice.label);

    // 「一边倒」的延迟代价：决裂时绑得越深，摔得越重
    if (state.act === 2 && hasFlag('yibiandao') && (hasFlag('split_total') || hasFlag('split_managed'))) {
      result.texts.push('当年"一边倒"绑定的产业链此刻成了绞索：苏式设备停摆、图纸断供，决裂的创伤成倍加深。');
      result.deltas.push(...applyFx({ res: { STB: -3, ECO: -3 } }));
      log('【王牌反噬】一边倒的旧债在决裂时刻连本带利讨还。');
    }

    if (state.gameOver) { save(); return result; }

    if (state.act >= 5) {
      state.phase = 'ending';
      result.ending = finalEnding();
    } else {
      state.act++;
      state.turn = 0; state.tzIndex = 0; state.ap = 0;
      state.phase = 'turnzero';
      state.thresholdUsed = {};
      // 手牌清空进入新时代
      state.hand = [];
      buildDeck();
      drawAgendas();
      if (state.act === 5 && state.rel.ussr >= 5) addFlag('red_brother');
      result.nextAct = window.ACT_DATA[state.act].meta;
    }
    save();
    return result;
  }

  function log(msg) {
    state.log.push({ t: turnStamp(), msg });
    if (state.log.length > 400) state.log.shift();
  }
  function turnStamp() { return state.act + '-' + state.turn; }

  // ---------- 存档 ----------
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { } }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      state = JSON.parse(raw);
      return state;
    } catch (e) { return null; }
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } }

  window.Engine = {
    newGame, load, clearSave, save,
    get state() { return state; },
    RES_KEYS, REL_KEYS, RES_NAMES,
    relNames, AP_ACTIONS,
    cardById, rollTurnZero, startTurn, turnLabel,
    eventPlayable, playEvent, discardForAP, spendAP, endTurn,
    finaleChoices, resolveFinale, finalEnding,
    hasFlag, score, meets,
    agendaInfo, spyAvailable, reactionPhase,
    trumpInfo, playTrump, mulligan, usCap,
    evalAchievements, flagList, flagName,
  };
})();
