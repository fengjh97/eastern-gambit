// 东方棋局 · UI 层（渲染 + 动画调度）
(function () {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  const TAG_NAMES = { ussr: '苏联', us: '美国', uk: '英国', eu: '欧洲', jp: '日本', sea: '东南亚', tw: '台湾', nk: '朝鲜', sk: '韩国', home: '内政', world: '世界' };
  const TYPE_NAMES = { event: '事件', crisis: '危机', boon: '机遇' };
  const IMG_BASE = 'assets/img/';
  const CARD_IMGS = ['diplomacy', 'economy', 'military', 'home', 'crisis', 'boon', 'world'];

  // ---------- 屏幕与转场 ----------
  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'fade-in'));
    const s = $(id); s.classList.add('active', 'fade-in');
  }
  function curtain(fn) {
    const c = $('#curtain');
    c.classList.add('closed');
    Audio2.play('curtain');
    setTimeout(() => { fn(); setTimeout(() => c.classList.remove('closed'), 120); }, 620);
  }
  // 纪录片字幕卡转场
  const ACT_SLOGANS = {
    1: '中国人民从此站起来了', 2: '鼓足干劲 力争上游', 3: '备战备荒为人民',
    4: '实践是检验真理的唯一标准', 5: '发展才是硬道理',
  };
  const ACT_FILMTEXT = {
    1: '百 废 待 兴', 2: '风 雨 如 磐', 3: '严 冬 与 破 冰', 4: '春 潮 涌 动', 5: '走 向 世 界',
  };
  function filmCard(act, fn) {
    const fc = $('#filmcard');
    const meta = window.ACT_DATA[act] && window.ACT_DATA[act].meta;
    fc.querySelector('.fc-year').textContent = meta ? meta.years.replace('–', ' — ') : '';
    fc.querySelector('.fc-text').textContent = ACT_FILMTEXT[act] || '';
    fc.classList.add('on');
    Audio2.play('curtain');
    setTimeout(() => { fn(); }, 900);
    setTimeout(() => { fc.classList.remove('on'); }, 2100);
  }

  function toast(msg, ms) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('on'), ms || 2200);
  }
  function shake() { document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake'); }
  function alertFlash() { const a = $('#alert-flash'); a.classList.remove('on'); void a.offsetWidth; a.classList.add('on'); }
  function bgOrGradient(node, key) {
    const url = IMG_BASE + key + '.jpg';
    const probe = new Image();
    probe.onload = () => { node.style.backgroundImage = 'url(' + url + ')'; };
    probe.onerror = () => { node.style.backgroundImage = 'linear-gradient(150deg,#5a1a14,#2b1208 60%,#1a0d06)'; };
    probe.src = url;
  }

  // 卡面配图：优先该卡专属历史照片，缺失则回落到类别配图
  function setCardImg(node, c) {
    const photo = 'assets/photos/' + c.id + '.jpg';
    const probe = new Image();
    probe.onload = () => { node.style.backgroundImage = 'url(' + photo + ')'; node.classList.add('has-photo'); };
    probe.onerror = () => bgOrGradient(node, 'card_' + (CARD_IMGS.includes(c.img) ? c.img : 'home'));
    probe.src = photo;
  }

  // 打字机
  function typewriter(node, text, speed, done) {
    node.textContent = '';
    let i = 0; clearInterval(node._tw);
    node._tw = setInterval(() => {
      node.textContent = text.slice(0, ++i);
      if (i % 3 === 0) Audio2.play('type');
      if (i >= text.length) { clearInterval(node._tw); done && done(); }
    }, speed || 38);
    node.onclick = () => { clearInterval(node._tw); node.textContent = text; done && done(); node.onclick = null; };
  }

  // ---------- 标题屏 ----------
  function renderTitle() {
    show('#scr-title');
    Music.playTitle();
    bgOrGradient($('#title-bg'), 'title');
    const h1 = $('#title-main h1');
    h1.innerHTML = '东方棋局'.split('').map((ch, i) => `<span style="animation-delay:${.35 + i * .16}s">${ch}</span>`).join('');
    const hasSave = !!localStorage.getItem('eastern_gambit_save_v1');
    $('#btn-continue').style.display = hasSave ? '' : 'none';
  }

  // ---------- 幕间屏（含 Turn Zero） ----------
  function renderActIntro() {
    const meta = window.ACT_DATA[Engine.state.act].meta;
    show('#scr-act');
    Music.playAct(meta.act);
    bgOrGradient($('#act-poster'), meta.img);
    $('#act-num').textContent = '第 ' + '一二三四五'[meta.act - 1] + ' 幕';
    $('#act-title').textContent = meta.title;
    $('#act-years').textContent = meta.years;
    $('#act-slogan').innerHTML = ACT_SLOGANS[meta.act] ? '<div class="act-banner">' + ACT_SLOGANS[meta.act] + '</div>' : '';
    const tz = $('#tz-area'); tz.innerHTML = '';
    Audio2.play('gong');
    typewriter($('#act-intro'), meta.intro, 34, () => renderTurnZeroStep());
  }

  function renderTurnZeroStep() {
    const st = Engine.state;
    const data = window.ACT_DATA[st.act];
    const tz = $('#tz-area');
    if (st.phase !== 'turnzero') { enterBoard(); return; }
    const entry = data.turnZero[st.tzIndex];
    if (!entry) { enterBoard(); return; }
    tz.innerHTML = '';
    tz.append(el('div', 'tz-name', '时局骰 · ' + entry.name));
    tz.append(el('div', 'tz-desc', entry.desc));
    const btn = el('button', 'btn gold', '掷 骰');
    btn.onclick = () => {
      btn.remove();
      const r = Engine.rollTurnZero();
      Audio2.play('dice');
      const wrap = el('div', 'dice-wrap');
      const die = el('div', 'die');
      die.append(el('div', 'face', String(r.roll)));
      wrap.append(die); tz.append(wrap);
      setTimeout(() => {
        const out = el('div', 'tz-outcome');
        out.innerHTML = '<b>' + r.final + ' 点</b> — ' + r.outcome.desc +
          (r.mod ? '<div class="tz-mod">历史惯性修正：' + (r.mod > 0 ? '+' : '') + r.mod + '（旗标影响）</div>' : '') +
          deltaChips(r.deltas).outerHTML;
        tz.append(out);
        Audio2.play('stamp');
        const next = el('button', 'btn', r.done ? '进入棋局' : '下一骰');
        next.style.marginTop = '16px';
        next.onclick = () => { if (r.done) curtain(enterBoard); else renderTurnZeroStep(); };
        tz.append(next);
        setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
      }, 1150);
    };
    tz.append(btn);
    setTimeout(() => btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
  }

  // ---------- 主板面 ----------
  function enterBoard() {
    show('#scr-board');
    renderBoard();
    renderHand(true);
  }

  function renderBoard() {
    const st = Engine.state;
    $('#turn-label').textContent = Engine.turnLabel();
    // 行动星
    const stars = $('#plays-stars'); stars.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const s = el('div', 'play-star' + (i < 3 - st.playsLeft ? ' used' : ''), '★');
      stars.append(s);
    }
    $('#ap-chip').innerHTML = '行动点 <b>' + st.ap + '</b>';
    const tb = $('#btn-trump');
    if (tb) {
      const ready = Engine.trumpInfo().filter(t => t.state === 'ready').length;
      tb.innerHTML = st.trumpHot ? '王 牌 <span class="trump-hot">余波' + st.trumpHot.turns + '</span>'
        : '王 牌' + (ready ? ' <span class="trump-n">' + ready + '</span>' : '');
      tb.classList.toggle('has-ready', ready > 0 && !st.trumpHot);
    }
    renderAgendaChip();
    renderRes(); renderRel(); renderLog();
    $('#btn-ap').disabled = st.ap <= 0;
  }

  // 顶栏议程徽标：未识破=问号，已识破=名称+破解状态
  function renderAgendaChip() {
    const chip = $('#agenda-chip');
    if (!chip) return;
    const parts = [];
    for (const p of ['ussr', 'us']) {
      const info = Engine.agendaInfo(p);
      if (!info) continue;
      const who = p === 'ussr' ? (Engine.state.act >= 5 ? '俄' : '苏') : '美';
      if (!info.revealed) parts.push('<span class="ag-tag unknown" title="未识破：可用国策行动『情报刺探』">' + who + '：？？？</span>');
      else parts.push('<span class="ag-tag ' + (info.countered ? 'ok' : 'bad') + '" title="' + info.counterDesc + '">' +
        who + '：' + info.name + (info.countered ? ' ✔' : ' ✖') + '</span>');
    }
    chip.innerHTML = parts.join('');
    chip.onclick = () => { if (Engine.state.phase === 'play') openApPanel(); };
  }

  function renderRes() {
    const st = Engine.state;
    const panel = $('#res-panel');
    if (!panel._built) {
      panel.innerHTML = '<div class="panel-title">国力</div>';
      for (const k of Engine.RES_KEYS) {
        const box = el('div', 'res-box'); box.id = 'res-' + k;
        box.innerHTML = `<div class="res-top"><span class="res-name">${Engine.RES_NAMES[k]}</span><span class="res-num">0</span></div><div class="res-bar"><div class="res-fill" style="width:0%"></div></div>`;
        panel.append(box);
      }
      panel._built = true;
    }
    for (const k of Engine.RES_KEYS) {
      const box = $('#res-' + k);
      const num = box.querySelector('.res-num');
      num.textContent = st.res[k];
      num.classList.toggle('danger', st.res[k] <= 15);
      box.querySelector('.res-fill').style.width = st.res[k] + '%';
    }
  }

  // 亚太作战地图上的九国位置（百分比坐标，随底图校准）
  const MAP_POS = {
    ussr: [55, 15], us: [91, 53], uk: [8, 11], eu: [7, 25],
    jp: [81, 55], sk: [73, 47], nk: [66, 36], tw: [63.5, 63], sea: [56, 76],
  };
  function renderRel() {
    const st = Engine.state;
    const panel = $('#rel-panel');
    if (!panel._built) {
      panel.innerHTML = '<div class="panel-title">邦交态势</div><div id="rel-map"><div class="map-china">★</div><div class="map-hint">点击放大</div></div>';
      const map = panel.querySelector('#rel-map');
      map.addEventListener('click', e => { if (e.target === map || e.target.classList.contains('map-china')) openMapModal(); });
      for (const k of Engine.REL_KEYS) {
        const b = el('div', 'map-badge'); b.id = 'rel-' + k;
        b.style.left = MAP_POS[k][0] + '%';
        b.style.top = MAP_POS[k][1] + '%';
        b.innerHTML = '<div class="mb-name"></div><div class="rel-val mb-val"></div>';
        b.onclick = () => {
          if (Engine.state.phase !== 'play') return;
          if (Engine.state.ap < 2) { toast('行动点不足（外交攻势需2点）'); return; }
          const r = Engine.spendAP('diplo', k);
          if (r && r.capped) { toast('🔒 中美关系已到时代上限 ' + (r.cap > 0 ? '+' : '') + r.cap + '，需乒乓外交/尼克松访华等破冰'); return; }
          Audio2.play('stamp'); renderBoard();
          toast(Engine.relNames()[k] + ' 关系 +1（外交攻势 -2AP）');
        };
        map.append(b);
      }
      bgOrGradient(map, 'map_asia');
      panel._built = true;
    }
    const names = Engine.relNames();
    for (const k of Engine.REL_KEYS) {
      const b = $('#rel-' + k);
      const v = st.rel[k];
      b.querySelector('.mb-name').textContent = names[k];
      const vs = b.querySelector('.mb-val');
      vs.textContent = v > 0 ? '+' + v : v;
      // 颜色：-10 深红 → 0 灰褐 → +10 金
      const t = (v + 10) / 20;
      const hue = t < 0.5 ? 0 : 45;
      const col = v >= 5 ? '#e8c34a' : v <= -6 ? '#ff5b4d' : v > 0 ? '#d9b872' : v < 0 ? '#c96a5a' : '#b8a888';
      b.style.borderColor = col;
      b.style.boxShadow = '0 0 ' + (6 + Math.abs(v)) + 'px ' + col + (Math.abs(v) >= 6 ? 'cc' : '66');
      vs.style.color = col;
      b.classList.toggle('ally', v >= 5);
      b.classList.toggle('enemy', v <= -6);
    }
  }

  function renderLog() {
    const st = Engine.state;
    const box = $('#event-log');
    box.innerHTML = '';
    st.log.slice(-60).forEach(e => {
      const cls = e.msg.startsWith('——') ? 'entry head' : 'entry';
      box.append(el('div', cls, e.msg));
    });
    box.scrollTop = box.scrollHeight;
  }

  // 手牌
  function renderHand(withDraw) {
    const st = Engine.state;
    const zone = $('#hand-zone'); zone.innerHTML = '';
    const n = st.hand.length;
    const flat = window.matchMedia('(max-width: 900px)').matches;
    zone.classList.toggle('flat', flat);
    st.hand.forEach((id, i) => {
      const c = Engine.cardById(id);
      const node = cardNode(c);
      if (flat) {
        node.classList.add('flat');
      } else {
        const spread = Math.min(58, 640 / Math.max(n, 1));
        const off = (i - (n - 1) / 2);
        node.style.left = 'calc(50% - 75px + ' + (off * spread * 2) + 'px)';
        node.style.transform = 'rotate(' + off * 3.2 + 'deg) translateY(' + Math.abs(off) * 7 + 'px)';
        node.style.zIndex = i;
        node.onmouseenter = () => { node.style.transform = 'rotate(0deg) translateY(-36px) scale(1.18)'; };
        node.onmouseleave = () => { node.style.transform = 'rotate(' + off * 3.2 + 'deg) translateY(' + Math.abs(off) * 7 + 'px)'; };
      }
      if (withDraw) { node.classList.add('drawn'); node.style.animationDelay = (i * .09) + 's'; Audio2.play('flip'); }
      node.onclick = () => openCardModal(c);
      zone.append(node);
    });
  }

  function cardNode(c) {
    const node = el('div', 'card type-' + c.type);
    const playable = Engine.eventPlayable(c);
    if (!playable.ok) node.classList.add('locked-event');
    const inner = el('div', 'card-inner');
    inner.innerHTML = `
      <div class="card-head"><span class="cname">${c.name}</span><span class="card-ap">${c.ap}</span></div>
      <div class="card-img"><span class="cyear">${c.year}</span><span class="ctag">${TAG_NAMES[c.tag] || c.tag}</span></div>
      <div class="card-body">${c.flavor}</div>
      ${c.type === 'crisis' ? '<div class="card-secret">绝密</div>' : ''}`;
    node.append(inner);
    setCardImg(inner.querySelector('.card-img'), c);
    return node;
  }

  // ---------- 打牌弹层 ----------
  let modalRoot;
  function openModal(content) {
    closeModal();
    modalRoot = el('div', 'overlay');
    const d = el('div', 'dossier');
    d.append(content);
    modalRoot.append(d);
    modalRoot.onclick = e => { if (e.target === modalRoot && modalRoot._dismissable) closeModal(); };
    $('#modal-root').append(modalRoot);
    return d;
  }
  function closeModal() { if (modalRoot) { modalRoot.remove(); modalRoot = null; } }

  function openCardModal(c) {
    const st = Engine.state;
    if (st.phase !== 'play' || st.playsLeft <= 0) { toast('本回合行动次数已用尽，请结束回合'); return; }
    const wrap = el('div');
    const playable = Engine.eventPlayable(c);
    wrap.append(el('div', 'd-kicker', TYPE_NAMES[c.type] + '卡 · ' + (TAG_NAMES[c.tag] || '') + ' · 行动点 ' + c.ap));
    wrap.append(el('h2', null, c.name + '<span class="d-year">' + c.year + '</span>'));
    const img = el('div', 'd-img'); setCardImg(img, c); wrap.append(img);
    wrap.append(el('div', 'd-flavor', c.flavor));
    if (c.event && c.event.desc && !c.event.choices) wrap.append(el('div', 'd-desc', c.event.desc));
    if (c.event && c.event.choices) wrap.append(el('div', 'd-desc', c.event.desc || '需要作出抉择。'));
    if (c.type === 'crisis') wrap.append(el('div', 'd-desc', '<b style="color:var(--red)">危机卡：</b>弃作行动仍将触发削弱效果；若幕末仍未处理，将全面引爆。'));

    const actions = el('div', 'd-actions');
    const evBtn = el('button', 'btn', '处置事件');
    if (!playable.ok) { evBtn.disabled = true; evBtn.title = playable.why; }
    evBtn.onclick = () => {
      if (c.event.choices) renderChoices(wrap, actions, c);
      else resolveAndShow(() => Engine.playEvent(c.id, null), c);
    };
    const apBtn = el('button', 'btn gold', '弃牌行动 +' + c.ap);
    apBtn.onclick = () => {
      const r = Engine.discardForAP(c.id);
      Audio2.play('flip');
      bumpAp();
      if (r.texts.length) {
        showResult({ card: c, texts: ['【危机泄压】' + r.texts.join(' ')], deltas: r.deltas, roll: null }, true);
        alertFlash();
      } else closeModal();
      afterAction();
    };
    const cancel = el('button', 'btn ghost', '收回');
    cancel.onclick = closeModal;
    actions.append(evBtn, apBtn, cancel);
    if (!st.mulliganUsed && c.type !== 'crisis') {
      const mb = el('button', 'btn ghost', '换一张');
      mb.title = '弃掉此牌抽一张新牌，每回合一次，不占行动次数';
      mb.onclick = () => {
        const r = Engine.mulligan(c.id);
        Audio2.play('flip');
        closeModal(); renderBoard(); renderHand(false);
        if (r && r.drawn) toast('换到：「' + r.drawn.name + '」');
      };
      actions.append(mb);
    }
    wrap.append(actions);
    if (!playable.ok) wrap.append(el('div', 'd-desc', '<span style="color:var(--bad);font-size:13px">事件不可用：' + playable.why + '</span>'));
    openModal(wrap);
  }

  function renderChoices(wrap, actions, c) {
    actions.innerHTML = '';
    const box = el('div');
    c.event.choices.forEach((ch, idx) => {
      const m = Engine.meets(ch);
      const b = el('button', 'choice-btn');
      b.innerHTML = '<div class="ch-label">' + ch.label + '</div><div class="ch-desc">' + (ch.desc || '') + '</div>' +
        (m.ok ? '' : '<div class="ch-lock">✕ ' + m.why + '</div>');
      b.disabled = !m.ok;
      b.onclick = () => resolveAndShow(() => Engine.playEvent(c.id, idx), c);
      box.append(b);
    });
    wrap.insertBefore(box, actions);
    const cancel = el('button', 'btn ghost', '收回');
    cancel.onclick = closeModal;
    actions.append(cancel);
  }

  function resolveAndShow(fn, c) {
    const r = fn();
    Audio2.play('stamp');
    if (r.card.type === 'crisis') { shake(); alertFlash(); Audio2.play('alarm'); }
    showResult(r, false);
    afterAction();
  }

  // 结算展示（含骰子动画）
  function showResult(r, isWeak) {
    closeModal();
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', isWeak ? '危机泄压' : '事件结算'));
    wrap.append(el('h2', null, r.card.name + (r.choiceLabel ? '<span class="d-year">' + r.choiceLabel + '</span>' : '')));
    const body = el('div');
    wrap.append(body);
    const finish = () => {
      body.append(el('div', 'result-texts', r.texts.join('<br>')));
      body.append(deltaChips(r.deltas));
      const ok = el('button', 'btn', '继 续'); ok.style.marginTop = '18px';
      ok.onclick = () => { closeModal(); checkGameOverOrContinue(); };
      body.append(ok);
    };
    if (r.roll) {
      Audio2.play('dice');
      const rp = el('div', 'roll-panel');
      rp.append(el('div', 'need', '需 ' + r.roll.ge + ' 点或以上'));
      const wrapD = el('div', 'dice-wrap'); const die = el('div', 'die');
      die.append(el('div', 'face', String(r.roll.value)));
      wrapD.append(die); rp.append(wrapD);
      body.append(rp);
      setTimeout(() => {
        const seal = el('div', 'seal' + (r.roll.ok ? '' : ' fail'), r.roll.ok ? '成' : '挫');
        rp.append(el('div'), seal);
        Audio2.play(r.roll.ok ? 'success' : 'fail');
        finish();
      }, 1200);
    } else finish();
    openModal(wrap);
  }

  function deltaChips(deltas) {
    const row = el('div', 'delta-row');
    (deltas || []).forEach((d, i) => {
      let chip;
      if (d.type === 'res') chip = el('span', 'delta-chip ' + (d.delta >= 0 ? 'up' : 'down'), d.name + ' ' + (d.delta > 0 ? '+' : '') + d.delta);
      else if (d.type === 'rel') chip = el('span', 'delta-chip ' + (d.delta >= 0 ? 'up' : 'down'), d.name + ' ' + (d.delta > 0 ? '+' : '') + d.delta);
      else if (d.type === 'flag') chip = el('span', 'delta-chip flag', '☭ ' + Engine.flagName(d.name));
      else if (d.type === 'ap') chip = el('span', 'delta-chip flag', '行动点 +' + d.delta);
      if (chip) { chip.style.animationDelay = (i * .1) + 's'; row.append(chip); }
      if (d.type === 'res' || d.type === 'rel') flashPanel(d);
    });
    return row;
  }

  function flashPanel(d) {
    setTimeout(() => {
      const node = d.type === 'res' ? $('#res-' + d.key) : $('#rel-' + d.key);
      if (!node) return;
      node.classList.remove('flash-up', 'flash-down'); void node.offsetWidth;
      node.classList.add(d.delta >= 0 ? 'flash-up' : 'flash-down');
      floatNum(node, d.delta);
    }, 250);
  }

  function floatNum(node, delta) {
    const rect = node.getBoundingClientRect();
    const f = el('div', 'float-num ' + (delta >= 0 ? 'up' : 'down'), (delta > 0 ? '+' : '') + delta);
    f.style.left = (rect.left + rect.width / 2) + 'px';
    f.style.top = (rect.top) + 'px';
    $('#fx-root').append(f);
    setTimeout(() => f.remove(), 1500);
  }

  function bumpAp() {
    const chip = $('#ap-chip');
    chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump');
    Audio2.play('coin');
  }

  function afterAction() { renderBoard(); renderHand(false); }

  function checkGameOverOrContinue() {
    const st = Engine.state;
    if (st.gameOver) { curtain(renderEnding); return; }
    renderBoard(); renderHand(false);
    if (st.playsLeft <= 0 && st.phase === 'play') toast('行动已用尽 —— 可花行动点，或结束回合', 2600);
  }

  // ---------- 行动点面板 ----------
  function openApPanel() {
    const st = Engine.state;
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '国策行动 · 现有行动点 ' + st.ap));
    wrap.append(el('h2', null, '调配行动点'));
    const grid = el('div', 'ap-grid');
    for (const key of Object.keys(Engine.AP_ACTIONS)) {
      const a = Engine.AP_ACTIONS[key];
      const b = el('button', 'ap-item' + (key === 'spy' ? ' spy' : ''));
      const spyOff = key === 'spy' && !Engine.spyAvailable();
      b.innerHTML = '<b>' + (key === 'spy' ? '☭ ' : '') + a.name + '</b><span class="cost">' + a.cost + 'AP</span><p>' +
        (spyOff ? '本幕情报渠道已用尽' : a.desc) + '</p>';
      b.disabled = st.ap < a.cost || spyOff;
      b.onclick = () => {
        if (key === 'diplo') return openCountryPick();
        if (key === 'spy') return openSpyPick();
        const r = Engine.spendAP(key);
        Audio2.play('stamp');
        renderBoard();
        openApPanel();
      };
      grid.append(b);
    }
    wrap.append(grid);
    const done = el('button', 'btn ghost', '完 成'); done.style.marginTop = '16px';
    done.onclick = () => { closeModal(); renderBoard(); };
    wrap.append(done);
    openModal(wrap);
  }

  function openSpyPick() {
    const st = Engine.state;
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '情报刺探 · 消耗 2 行动点 · 每幕一次'));
    wrap.append(el('h2', null, '截获谁的密电？'));
    wrap.append(el('div', 'd-desc', '两个超级大国在本幕各有一项针对中国的战略议程，正在暗中推进。刺探成功即可看到议程内容与破解条件——幕末结算时，破解与否天差地别。'));
    const grid = el('div', 'ap-grid');
    [['ussr', st.act >= 5 ? '莫斯科（俄罗斯）' : '莫斯科（苏联）'], ['us', '华盛顿（美国）']].forEach(([p, label]) => {
      const info = Engine.agendaInfo(p);
      const b = el('button', 'ap-item');
      b.innerHTML = '<b>' + label + '</b><p>' + (!info ? '本幕无议程' : info.revealed ? '已识破：' + info.name : '密级：绝密') + '</p>';
      b.disabled = !info || info.revealed;
      b.onclick = () => {
        const r = Engine.spendAP('spy', p);
        Audio2.play('stamp'); alertFlash();
        renderBoard();
        if (r && r.spy) showSpyResult(r.spy);
        else openApPanel();
      };
      grid.append(b);
    });
    wrap.append(grid);
    const back = el('button', 'btn ghost', '返 回'); back.style.marginTop = '16px';
    back.onclick = openApPanel;
    wrap.append(back);
    openModal(wrap);
  }

  function showSpyResult(spy) {
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '绝密 · 截获密电译文'));
    wrap.append(el('h2', null, spy.name));
    wrap.append(el('div', 'd-desc', '<b style="color:var(--red)">' + (spy.power === 'ussr' ? '莫斯科' : '华盛顿') + '</b> 本幕的战略议程已被识破。'));
    const cond = el('div', 'agenda-result ' + (spy.countered ? 'foiled' : 'succeeded'));
    cond.innerHTML = '<div class="ag-cond">破解条件：' + spy.counterDesc + '</div>' +
      '<div class="ag-verdict-big">' + (spy.countered ? '✔ 当前已达成' : '✖ 当前尚未达成') + '</div>';
    wrap.append(cond);
    wrap.append(el('div', 'd-desc', '<span style="font-size:13px;color:var(--ink-soft)">幕末将按当时的状态判定。破解则对方偷鸡不成蚀把米，未破解则议程得逞。</span>'));
    const ok = el('button', 'btn', '收 起'); ok.style.marginTop = '14px';
    ok.onclick = openApPanel;
    wrap.append(ok);
    openModal(wrap);
  }

  // ---------- 标签图鉴 ----------
  function openFlagsPanel() {
    const list = Engine.flagList();
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '历史印记 · 已持有 ' + list.length + ' 枚标签'));
    wrap.append(el('h2', null, '国运档案'));
    wrap.append(el('div', 'd-desc', '打出事件获得的标签会解锁后续卡牌、幕末选项、王牌，并影响时局骰与两强议程——这里能查到每枚标签的全部效用。'));
    if (!list.length) wrap.append(el('div', 'd-desc', '尚无标签。打出带 ☭ 标记效果的事件卡即可获得。'));
    list.forEach(f => {
      const box = el('div', 'flag-item');
      box.innerHTML = '<div class="fi-name">☭ ' + f.name + '</div>' +
        '<div class="fi-uses">' + f.uses.map(u => '· ' + u).join('<br>') + '</div>';
      wrap.append(box);
    });
    const ok = el('button', 'btn ghost', '收 起'); ok.style.marginTop = '14px';
    ok.onclick = closeModal;
    wrap.append(ok);
    openModal(wrap);
  }

  // ---------- 全屏地图 ----------
  function openMapModal() {
    const st = Engine.state;
    const names = Engine.relNames();
    const modal = el('div'); modal.id = 'map-modal';
    modal.innerHTML = '<div class="mm-title">邦 交 态 势</div>';
    const map = el('div', 'mm-map');
    bgOrGradient(map, 'map_asia');
    map.append(el('div', 'map-china', '★'));
    for (const k of Engine.REL_KEYS) {
      const v = st.rel[k];
      const b = el('div', 'map-badge');
      b.style.left = MAP_POS[k][0] + '%';
      b.style.top = MAP_POS[k][1] + '%';
      const col = v >= 5 ? '#e8c34a' : v <= -6 ? '#ff5b4d' : v > 0 ? '#d9b872' : v < 0 ? '#c96a5a' : '#b8a888';
      b.style.borderColor = col;
      b.style.boxShadow = '0 0 ' + (6 + Math.abs(v)) + 'px ' + col + (Math.abs(v) >= 6 ? 'cc' : '66');
      b.innerHTML = '<div class="mb-name">' + names[k] + '</div><div class="rel-val mb-val" style="color:' + col + '">' + (v > 0 ? '+' + v : v) + '</div>';
      b.onclick = () => {
        if (Engine.state.phase === 'play' && Engine.state.ap >= 2) {
          Engine.spendAP('diplo', k); Audio2.play('stamp');
          modal.remove(); renderBoard(); openMapModal();
        } else toast(Engine.state.ap < 2 ? '行动点不足（外交攻势需2点）' : '');
      };
      map.append(b);
    }
    modal.append(map);
    const list = el('div', 'mm-list');
    for (const k of Engine.REL_KEYS) {
      const v = st.rel[k];
      const col = v >= 5 ? '#e8c34a' : v <= -6 ? '#ff5b4d' : v > 0 ? '#d9b872' : v < 0 ? '#c96a5a' : '#b8a888';
      list.append(el('div', 'mm-item', '<span>' + names[k] + '</span><b style="color:' + col + '">' + (v > 0 ? '+' + v : v) + '</b>'));
    }
    modal.append(list);
    const close = el('button', 'btn mm-close', '收 起');
    close.onclick = () => modal.remove();
    modal.append(close);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.append(modal);
  }

  // ---------- 历史王牌 ----------
  function openTrumpPanel() {
    const st = Engine.state;
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '历史王牌 · 每幕限打一张 · 打出必付代价'));
    wrap.append(el('h2', null, '手中的大国牌'));
    if (st.trumpHot) wrap.append(el('div', 'd-desc', '<b style="color:var(--red)">⚠ 王牌余波未平：' +
      (st.trumpHot.foe === 'both' ? '苏美双方' : (st.trumpHot.foe === 'ussr' ? '莫斯科' : '华盛顿')) +
      '仍在报复，还剩 ' + st.trumpHot.turns + ' 回合。</b>'));
    const row = el('div', 'trump-row');
    Engine.trumpInfo().forEach(t => {
      const c = el('div', 'trump-card st-' + t.state);
      c.innerHTML = `<div class="tc-img"></div>
        <div class="tc-name">${t.name}</div><div class="tc-sub">${t.sub}</div>
        <div class="tc-era">${t.era}</div>
        <div class="tc-gain">✚ ${t.gain.desc}</div>
        <div class="tc-cost">✖ ${t.cost.desc}</div>
        <div class="tc-state">${t.state === 'locked' ? '🔒 ' + (t.unlockDesc || '未解锁') :
          t.state === 'dead' ? t.deadText : t.state === 'usedAct' ? '本幕王牌名额已用' : ''}</div>`;
      bgOrGradient(c.querySelector('.tc-img'), t.img);
      if (t.state === 'ready') {
        const b = el('button', 'btn', '打 出');
        b.onclick = () => confirmTrump(t.id);
        c.append(b);
      }
      row.append(c);
    });
    wrap.append(row);
    const back = el('button', 'btn ghost', '收 起'); back.style.marginTop = '14px';
    back.onclick = closeModal;
    wrap.append(back);
    openModal(wrap);
  }

  function confirmTrump(id) {
    const t = window.TRUMPS[id];
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '王牌 · 落子无悔'));
    wrap.append(el('h2', null, t.name + '<span class="d-year">' + t.sub + '</span>'));
    wrap.append(el('div', 'd-flavor', t.era));
    wrap.append(el('div', 'd-desc', '<b style="color:var(--good)">收益：</b>' + t.gain.desc));
    wrap.append(el('div', 'd-desc', '<b style="color:var(--red)">代价：</b>' + t.cost.desc));
    wrap.append(el('div', 'd-desc', '<b style="color:var(--red)">余波：</b>打出后两回合内，' +
      (t.foe === 'both' ? '苏美双方' : (t.foe === 'ussr' ? '莫斯科' : '华盛顿')) + '必然报复、议程加速。'));
    const acts = el('div', 'd-actions');
    const go = el('button', 'btn', '落 子');
    go.onclick = () => {
      const r = Engine.playTrump(id);
      if (!r) { closeModal(); return; }
      Audio2.play('gong'); shake(); alertFlash();
      const res = el('div');
      res.append(el('div', 'd-kicker', '王牌落定'));
      res.append(el('h2', null, r.def.name + '·' + r.def.sub));
      res.append(el('div', 'result-texts', r.def.aftermath));
      res.append(deltaChips(r.gainDeltas.concat(r.costDeltas)));
      const ok = el('button', 'btn', '继 续'); ok.style.marginTop = '16px';
      ok.onclick = () => { closeModal(); checkGameOverOrContinue(); };
      res.append(ok);
      openModal(res);
      renderBoard();
    };
    const cancel = el('button', 'btn ghost', '再想想');
    cancel.onclick = openTrumpPanel;
    acts.append(go, cancel);
    wrap.append(acts);
    openModal(wrap);
  }

  function openCountryPick() {
    const st = Engine.state;
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '外交攻势 · 消耗 2 行动点'));
    wrap.append(el('h2', null, '选择对象国'));
    const grid = el('div', 'country-grid');
    const names = Engine.relNames();
    for (const k of Engine.REL_KEYS) {
      const b = el('button', 'ap-item');
      b.innerHTML = '<b>' + names[k] + '</b><p>' + (st.rel[k] > 0 ? '+' + st.rel[k] : st.rel[k]) + ' → ' + (Math.min(10, st.rel[k] + 1) > 0 ? '+' + Math.min(10, st.rel[k] + 1) : Math.min(10, st.rel[k] + 1)) + '</p>';
      const usCapped = k === 'us' && st.rel.us >= Engine.usCap();
      b.disabled = st.rel[k] >= 10 || usCapped;
      if (usCapped) b.innerHTML += '<p style="color:var(--bad)">🔒 时代上限 ' + (Engine.usCap() > 0 ? '+' : '') + Engine.usCap() + '，需破冰事件（乒乓外交/尼克松访华/建交）</p>';
      b.onclick = () => {
        const r = Engine.spendAP('diplo', k);
        if (r && r.capped) { toast('中美关系已到时代上限，需要历史性破冰事件'); return; }
        Audio2.play('stamp'); renderBoard(); openApPanel();
      };
      grid.append(b);
    }
    wrap.append(grid);
    const back = el('button', 'btn ghost', '返 回'); back.style.marginTop = '16px';
    back.onclick = openApPanel;
    wrap.append(back);
    openModal(wrap);
  }

  // ---------- 回合结束 ----------
  function endTurn() {
    const st = Engine.state;
    if (st.phase !== 'play') return;
    const r = Engine.endTurn();
    renderBoard();

    // 组装电报队列：阵营张力 + 各国反应 + 危机引爆
    const queue = [];
    if (r.tension) queue.push({ kind: 'tension', src: '本报综合', title: '两强夹缝', text: r.tension.desc, deltas: r.tension.deltas });
    (r.wires || []).forEach(w => queue.push(w));
    (r.crisisBurst || []).forEach(b => queue.push({
      kind: 'burst', src: '紧急军情', title: '危机引爆 · ' + b.card.name,
      text: '悬而未决的危机彻底失控，后果成倍降临。', deltas: b.deltas,
    }));

    const proceed = () => {
      if (Engine.state.gameOver) { curtain(renderEnding); return; }
      if (r.finale) {
        if (r.agendaResults && r.agendaResults.length) showAgendaResults(r.agendaResults, () => curtain(renderFinale));
        else curtain(renderFinale);
      } else {
        renderBoard(); renderHand(true);
        toast(Engine.turnLabel(), 1800);
      }
    };
    if (queue.length) showWires(queue, proceed); else proceed();
  }

  // ---------- 回合末电报 ----------
  function showWires(queue, done) {
    const overlay = el('div', 'overlay wire-overlay');
    const sheet = el('div', 'wire-sheet');
    sheet.innerHTML = '<div class="wire-head"><span class="wire-machine">▓▒░</span> 内 部 参 考 · 各 方 动 向 <span class="wire-machine">░▒▓</span></div>';
    const body = el('div', 'wire-body');
    sheet.append(body);
    const foot = el('div', 'wire-foot');
    const btn = el('button', 'btn gold', '阅 毕');
    btn.disabled = true;
    foot.append(btn); sheet.append(foot);
    overlay.append(sheet);
    $('#modal-root').append(overlay);

    let i = 0;
    const next = () => {
      if (i >= queue.length) {
        btn.disabled = false;
        btn.onclick = () => { overlay.remove(); done(); };
        return;
      }
      const w = queue[i++];
      const item = el('div', 'wire-item kind-' + w.kind);
      item.innerHTML = `<div class="wire-src">${w.src} <span class="wire-time">${wireStamp()}</span></div>
        <div class="wire-title">${w.title}</div><div class="wire-text"></div>`;
      body.append(item);
      body.scrollTop = body.scrollHeight;
      if (w.kind === 'threshold' || w.kind === 'burst') { shake(); alertFlash(); Audio2.play('alarm'); }
      else Audio2.play('flip');
      const txt = item.querySelector('.wire-text');
      typewriter(txt, w.text, 22, () => {
        if (w.deltas && w.deltas.length) {
          item.append(deltaChips(w.deltas));
          renderBoard();
        }
        body.scrollTop = body.scrollHeight;
        setTimeout(next, 450);
      });
    };
    setTimeout(next, 260);
  }

  function wireStamp() {
    const st = Engine.state;
    const meta = window.ACT_DATA[st.act].meta;
    const [y0, y1] = meta.years.split('–').map(Number);
    const y = Math.min(y1, y0 + Math.round((y1 - y0) * (st.turn - 1) / (meta.turns - 1 || 1)));
    return y + '年';
  }

  // 幕末议程结算
  function showAgendaResults(results, done) {
    const wrap = el('div');
    wrap.append(el('div', 'd-kicker', '幕末 · 两强战略议程揭晓'));
    wrap.append(el('h2', null, '棋盘的另一面'));
    results.forEach(r => {
      const box = el('div', 'agenda-result ' + (r.foiled ? 'foiled' : 'succeeded'));
      box.innerHTML = `<div class="ag-power">${r.power === 'ussr' ? (Engine.state.act >= 5 ? '俄罗斯' : '苏联') : '美国'}的议程</div>
        <div class="ag-name">${r.name} <span class="ag-verdict">${r.foiled ? '已破解' : '得逞'}</span></div>
        <div class="ag-cond">破解条件：${r.counterDesc}</div>
        <div class="ag-text">${r.text}</div>`;
      box.append(deltaChips(r.deltas));
      wrap.append(box);
    });
    const ok = el('button', 'btn', '继 续'); ok.style.marginTop = '16px';
    ok.onclick = () => { closeModal(); renderBoard(); done(); };
    wrap.append(ok);
    Audio2.play('gong');
    openModal(wrap);
  }

  // ---------- 幕末 ----------
  function renderFinale() {
    const f = window.ACT_DATA[Engine.state.act].finale;
    show('#scr-finale');
    bgOrGradient($('#finale-bg'), f.img);
    $('#finale-content .f-kicker').textContent = '幕末大事 · ' + f.year;
    $('#finale-content h2').textContent = f.title;
    $('#finale-choices').innerHTML = '';
    Audio2.play('gong');
    typewriter($('#finale-desc'), f.desc, 42, () => {
      const box = $('#finale-choices');
      Engine.finaleChoices().forEach((ch, idx) => {
        const b = el('button', 'choice-btn');
        b.innerHTML = '<div class="ch-label">' + ch.label + '</div><div class="ch-desc">' + (ch.desc || '') + '</div>' +
          (ch.available ? '' : '<div class="ch-lock">✕ ' + (ch.lockReason || '条件未达成') + '</div>');
        b.disabled = !ch.available;
        b.style.animation = 'riseIn .6s ' + (idx * .15) + 's ease both';
        b.onclick = () => resolveFinaleChoice(idx);
        box.append(b);
      });
      setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
    });
  }

  function resolveFinaleChoice(idx) {
    const r = Engine.resolveFinale(idx);
    const box = $('#finale-choices'); box.innerHTML = '';
    const panel = el('div');
    if (r.roll) {
      Audio2.play('dice');
      const rp = el('div', 'roll-panel');
      rp.append(el('div', 'need', '命运骰 · 需 ' + r.roll.ge + ' 点或以上'));
      const wrapD = el('div', 'dice-wrap'); const die = el('div', 'die');
      die.append(el('div', 'face', String(r.roll.value)));
      wrapD.append(die); rp.append(wrapD);
      panel.append(rp);
      setTimeout(() => {
        rp.append(el('div', 'seal' + (r.roll.ok ? '' : ' fail'), r.roll.ok ? '成' : '挫'));
        Audio2.play(r.roll.ok ? 'success' : 'fail');
        finishFinale(panel, r);
      }, 1200);
    } else finishFinale(panel, r);
    box.append(panel);
  }

  function finishFinale(panel, r) {
    if (r.texts.length) panel.append(el('div', 'result-texts', '<div style="color:#d5c5a0">' + r.texts.join('<br>') + '</div>'));
    panel.append(deltaChips(r.deltas));
    const btn = el('button', 'btn gold', r.ending ? '见证结局' : '进入下一幕');
    btn.style.marginTop = '22px';
    btn.onclick = () => {
      if (Engine.state.gameOver) { curtain(renderEnding); }
      else if (r.ending) { Engine.state._finalEnding = r.ending; curtain(renderEnding); }
      else filmCard(Engine.state.act, renderActIntro);
    };
    panel.append(btn);
    setTimeout(() => btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
  }

  // ---------- 结局 ----------
  function renderEnding() {
    const st = Engine.state;
    const e = st.gameOver || st._finalEnding || Engine.finalEnding();
    show('#scr-ending');
    Music.playTitle();
    bgOrGradient($('#ending-img'), e.img);
    $('#ending-kind').textContent = e.kind === 'collapse' ? '中 途 崩 局' : '终 局';
    $('#ending-title').textContent = e.title;
    $('#ending-poem').textContent = e.poem;
    $('#ending-text').textContent = e.text;
    Audio2.play(e.kind === 'collapse' ? 'fail' : 'gong');
    // 成就卡墙
    const achBox = $('#ending-ach'); achBox.innerHTML = '';
    const earned = Engine.evalAchievements();
    if (earned.length) {
      achBox.append(el('div', 'ach-head', '国 史 勋 卡 · ' + earned.length + ' 枚'));
      const grid = el('div', 'ach-grid');
      earned.forEach((a, i) => {
        const c = el('div', 'ach-card');
        c.style.animationDelay = (0.9 + i * 0.13) + 's';
        c.innerHTML = '<div class="ac-img"></div><div class="ac-name">' + a.name + '</div><div class="ac-cat">' + (window.ACH_CATS[a.cat] || '') + '</div>';
        bgOrGradient(c.querySelector('.ac-img'), a.img);
        c.onclick = () => toast(a.name + '：' + a.t, 3600);
        grid.append(c);
      });
      achBox.append(grid);
    }
    // 建国小作文
    const essayBox = $('#ending-essay'); essayBox.innerHTML = '';
    if (window.buildEssay) {
      const paras = window.buildEssay(earned, st, e);
      const eb = el('div', 'essay');
      eb.append(el('div', 'essay-head', '—— 国 之 定 论 ——'));
      paras.forEach(t => eb.append(el('p', null, t)));
      essayBox.append(eb);
    }
    const addBox = $('#ending-addenda'); addBox.innerHTML = '';
    (e.gaps || []).forEach(g => addBox.append(el('div', 'addendum gap',
      '<b>【憾失 · ' + g.title + '】</b> 差一步：' + g.misses.join('；') + '。')));
    (e.addenda || []).forEach(a => addBox.append(el('div', 'addendum', '<b>【' + a.title + '】</b> ' + a.text)));
    // 统计
    const stats = $('#ending-stats'); stats.innerHTML = '';
    for (const k of Engine.RES_KEYS) {
      stats.append(el('div', 'stat-tile', '<div class="v">' + st.res[k] + '</div><div class="k">' + Engine.RES_NAMES[k] + '</div>'));
    }
    const yr = el('div', 'stat-tile', '<div class="v">' + (st.gameOver && !st._finalEnding ? '中途' : '2001') + '</div><div class="k">终局之年</div>');
    stats.append(yr);
    const sc = $('#ending-score');
    const score = e.score != null ? e.score : Engine.score();
    sc.innerHTML = (e.grade ? '<div class="ending-grade"><div class="eg-stamp" id="eg-stamp"></div>史册定评 · <b>' + e.grade.title + '</b><div class="eg-desc">' + e.grade.desc + '</div></div>' : '') + '史册评分 <b>0</b>';
    if (e.grade && e.grade.img) bgOrGradient($('#eg-stamp'), e.grade.img);
    let cur = 0; const step = Math.max(1, Math.round(score / 60));
    const tm = setInterval(() => { cur = Math.min(score, cur + step); sc.querySelector('b').textContent = cur; if (cur >= score) clearInterval(tm); }, 24);
    Engine.clearSave();
  }

  // ---------- 绑定 ----------
  function bind() {
    $('#btn-new').onclick = () => curtain(() => { Engine.newGame(); renderActIntro(); });
    $('#btn-continue').onclick = () => curtain(() => {
      const s = Engine.load();
      if (!s) { Engine.newGame(); renderActIntro(); return; }
      if (s.phase === 'turnzero') renderActIntro();
      else if (s.phase === 'finale') renderFinale();
      else if (s.phase === 'ending' || s.gameOver) renderEnding();
      else enterBoard();
    });
    $('#btn-end-turn').onclick = endTurn;
    $('#btn-ap').onclick = openApPanel;
    $('#btn-trump').onclick = openTrumpPanel;
    $('#btn-flags').onclick = openFlagsPanel;
    $('#btn-restart-ending').onclick = () => curtain(() => { Engine.newGame(); renderActIntro(); });
    $('#btn-menu-ending').onclick = () => curtain(renderTitle);
    $('#mute-btn').onclick = () => { const on = Audio2.toggle(); Music.setEnabled(on); $('#mute-btn').textContent = on ? '♪' : '✕'; };
    // iOS/浏览器自动播放限制：首次触摸后启动音乐
    document.addEventListener('pointerdown', () => { Music.setEnabled(Music.enabled); }, { once: true });
  }

  window.UI = { renderTitle, bind, _debugEnterBoard: enterBoard, _debugFinale: renderFinale, _debugEnding: renderEnding, _debugActIntro: renderActIntro };
})();
