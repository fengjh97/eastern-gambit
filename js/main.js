// 入口
const APP_VERSION = '10';
// 自动更新：检测到新版本时用带参地址绕过HTML缓存强制刷新
(function checkUpdate() {
  fetch('version.txt?_=' + Date.now(), { cache: 'no-store' })
    .then(r => r.ok ? r.text() : null)
    .then(v => {
      if (!v) return;
      v = v.trim();
      const cur = new URLSearchParams(location.search).get('u');
      if (v !== APP_VERSION && cur !== v) {
        location.replace(location.pathname + '?u=' + v + location.hash);
      }
    }).catch(() => { });
})();

window.addEventListener('DOMContentLoaded', () => {
  UI.bind();
  const h = location.hash;
  if (h === '#autoboard' || h === '#autoplay') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    UI._debugEnterBoard();
    if (h === '#autoplay') {
      setTimeout(() => { const c = document.querySelector('#hand-zone .card'); c && c.click(); }, 900);
      setTimeout(() => {
        const btn = [...document.querySelectorAll('.dossier .btn')].find(b => b.textContent.includes('处置事件'));
        btn && !btn.disabled && btn.click();
      }, 1800);
      setTimeout(() => { const ch = document.querySelector('.dossier .choice-btn:not(:disabled)'); ch && ch.click(); }, 2600);
    }
    return;
  }
  if (h === '#autoact') {
    Engine.newGame();
    UI._debugActIntro();
    setTimeout(() => { const b = [...document.querySelectorAll('#tz-area .btn')].find(x => x.textContent.includes('掷')); b && b.click(); }, 2500);
    return;
  }
  if (h === '#autoflags') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    Engine.state.flags.push('korea_war', 'qian', 'bandung', 'hk_window');
    UI._debugEnterBoard();
    setTimeout(() => document.querySelector('#btn-flags').click(), 600);
    return;
  }
  if (h === '#automap') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    UI._debugEnterBoard();
    setTimeout(() => { const m = document.querySelector('#rel-map'); m && m.click(); }, 800);
    return;
  }
  if (h === '#autotrump') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    Engine.state.flags.push('bandung', 'nixon_ok');
    UI._debugEnterBoard();
    setTimeout(() => document.querySelector('#btn-trump').click(), 600);
    return;
  }
  if (h === '#autowire') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    const st = Engine.state;
    st.rel.us = -8; st.rel.tw = -9; st.rel.ussr = 7; st.rel.nk = 6;
    st.touched = { us: -3, ussr: 2 };
    UI._debugEnterBoard();
    setTimeout(() => document.querySelector('#btn-end-turn').click(), 600);
    return;
  }
  if (h === '#autospy') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    Engine.state.ap = 6;
    UI._debugEnterBoard();
    setTimeout(() => document.querySelector('#btn-ap').click(), 500);
    setTimeout(() => { const b = [...document.querySelectorAll('.ap-item')].find(x => x.textContent.includes('情报刺探')); b && b.click(); }, 1100);
    setTimeout(() => { const b = document.querySelector('.ap-grid .ap-item:not(:disabled)'); b && b.click(); }, 1700);
    return;
  }
  if (h === '#autoagenda') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    const st = Engine.state;
    st.turn = window.ACT_DATA[1].meta.turns;
    st.playsLeft = 0; st.hand = [];
    UI._debugEnterBoard();
    setTimeout(() => document.querySelector('#btn-end-turn').click(), 500);
    const tryRead = () => {
      const b = [...document.querySelectorAll('.wire-foot .btn')].find(x => !x.disabled);
      if (b) b.click(); else setTimeout(tryRead, 400);
    };
    setTimeout(tryRead, 3000);
    return;
  }
  if (h === '#autofinale') {
    Engine.newGame();
    Engine.state.phase = 'finale';
    UI._debugFinale();
    return;
  }
  if (h === '#autoending') {
    Engine.newGame();
    Engine.state.phase = 'ending';
    Engine.state.res = { STB: 66, ECO: 78, MIL: 62, DIP: 70 };
    Engine.state.flags.push('wto', 'bomb', 'hk_return', 'korea_war', 'satellite', 'un_seat', 'pingpong', 'nixon_ok', 'reform', 'sez', 'south_tour', 'us_normal', 'jp_normal', 'bandung');
    Engine.state.agendaFoiled = 5; Engine.state.trumpsPlayed = ['sov', 'us'];
    Engine.state._finalEnding = Engine.finalEnding();
    UI._debugEnding();
    return;
  }
  UI.renderTitle();
});
