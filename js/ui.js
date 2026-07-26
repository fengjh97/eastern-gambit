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
    bgOrGradient($('#act-poster'), meta.img);
    $('#act-num').textContent = '第 ' + '一二三四五'[meta.act - 1] + ' 幕';
    $('#act-title').textContent = meta.title;
    $('#act-years').textContent = meta.years;
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
      }, 1150);
    };
    tz.append(btn);
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
    renderRes(); renderRel(); renderLog();
    $('#btn-ap').disabled = st.ap <= 0;
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

  function renderRel() {
    const st = Engine.state;
    const panel = $('#rel-panel');
    if (!panel._built) {
      panel.innerHTML = '<div class="panel-title">邦交</div>';
      for (const k of Engine.REL_KEYS) {
        const row = el('div', 'rel-row'); row.id = 'rel-' + k;
        row.innerHTML = `<span class="rel-name"></span><div class="rel-track"><div class="rel-marker"></div></div><span class="rel-val"></span>`;
        panel.append(row);
      }
      panel._built = true;
    }
    const names = Engine.relNames();
    for (const k of Engine.REL_KEYS) {
      const row = $('#rel-' + k);
      row.querySelector('.rel-name').textContent = names[k];
      const v = st.rel[k];
      row.querySelector('.rel-marker').style.left = ((v + 10) / 20 * 100) + '%';
      const vs = row.querySelector('.rel-val');
      vs.textContent = v > 0 ? '+' + v : v;
      vs.className = 'rel-val ' + (v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero');
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
    st.hand.forEach((id, i) => {
      const c = Engine.cardById(id);
      const node = cardNode(c);
      const spread = Math.min(58, 640 / Math.max(n, 1));
      const off = (i - (n - 1) / 2);
      node.style.left = 'calc(50% - 75px + ' + (off * spread * 2) + 'px)';
      node.style.transform = 'rotate(' + off * 3.2 + 'deg) translateY(' + Math.abs(off) * 7 + 'px)';
      node.style.zIndex = i;
      if (withDraw) { node.classList.add('drawn'); node.style.animationDelay = (i * .09) + 's'; Audio2.play('flip'); }
      node.onmouseenter = () => { node.style.transform = 'rotate(0deg) translateY(-36px) scale(1.18)'; };
      node.onmouseleave = () => { node.style.transform = 'rotate(' + off * 3.2 + 'deg) translateY(' + Math.abs(off) * 7 + 'px)'; };
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
    const imgKey = CARD_IMGS.includes(c.img) ? c.img : 'home';
    bgOrGradient(inner.querySelector('.card-img'), 'card_' + imgKey);
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
    const img = el('div', 'd-img'); bgOrGradient(img, 'card_' + (CARD_IMGS.includes(c.img) ? c.img : 'home')); wrap.append(img);
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
      else if (d.type === 'flag') chip = el('span', 'delta-chip flag', '☭ ' + d.name);
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
      const b = el('button', 'ap-item');
      b.innerHTML = '<b>' + a.name + '</b><span class="cost">' + a.cost + 'AP</span><p>' + a.desc + '</p>';
      b.disabled = st.ap < a.cost;
      b.onclick = () => {
        if (key === 'diplo') return openCountryPick();
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
      b.disabled = st.rel[k] >= 10;
      b.onclick = () => { Engine.spendAP('diplo', k); Audio2.play('stamp'); renderBoard(); openApPanel(); };
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
    if (r.tension) { toast('⚠ ' + r.tension.desc, 3200); shake(); r.tension.deltas.forEach(flashPanel); Audio2.play('alarm'); }
    if (st.gameOver) { curtain(renderEnding); return; }
    if (r.finale) {
      let delay = 400;
      if (r.crisisBurst && r.crisisBurst.length) {
        alertFlash(); shake(); Audio2.play('alarm');
        toast('☠ 悬而未决的危机全面引爆：' + r.crisisBurst.map(x => x.card.name).join('、'), 3600);
        delay = 2400;
      }
      setTimeout(() => { if (Engine.state.gameOver) curtain(renderEnding); else curtain(renderFinale); }, delay);
    } else {
      renderBoard(); renderHand(true);
      toast(Engine.turnLabel(), 1800);
    }
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
      else curtain(renderActIntro);
    };
    panel.append(btn);
  }

  // ---------- 结局 ----------
  function renderEnding() {
    const st = Engine.state;
    const e = st.gameOver || st._finalEnding || Engine.finalEnding();
    show('#scr-ending');
    bgOrGradient($('#ending-img'), e.img);
    $('#ending-kind').textContent = e.kind === 'collapse' ? '中 途 崩 局' : '终 局';
    $('#ending-title').textContent = e.title;
    $('#ending-poem').textContent = e.poem;
    $('#ending-text').textContent = e.text;
    Audio2.play(e.kind === 'collapse' ? 'fail' : 'gong');
    const addBox = $('#ending-addenda'); addBox.innerHTML = '';
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
    sc.innerHTML = '史册评分 <b>0</b>';
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
    $('#btn-restart-ending').onclick = () => curtain(() => { Engine.newGame(); renderActIntro(); });
    $('#btn-menu-ending').onclick = () => curtain(renderTitle);
    $('#mute-btn').onclick = () => { const on = Audio2.toggle(); $('#mute-btn').textContent = on ? '♪' : '✕'; };
  }

  window.UI = { renderTitle, bind, _debugEnterBoard: enterBoard, _debugFinale: renderFinale, _debugEnding: renderEnding };
})();
