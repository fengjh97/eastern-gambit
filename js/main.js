// 入口
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
    Engine.state.flags.push('wto', 'bomb', 'hk_return');
    Engine.state._finalEnding = Engine.finalEnding();
    UI._debugEnding();
    return;
  }
  UI.renderTitle();
});
