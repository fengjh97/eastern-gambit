// 入口
window.addEventListener('DOMContentLoaded', () => {
  UI.bind();
  const h = location.hash;
  if (h === '#autoboard' || h === '#autoplay') {
    Engine.newGame();
    while (Engine.state.phase === 'turnzero') Engine.rollTurnZero();
    UI._debugEnterBoard();
    if (h === '#autoplay') {
      // 自动演示：点开第一张手牌 → 打出事件/首个选项
      setTimeout(() => { const c = document.querySelector('#hand-zone .card'); c && c.click(); }, 900);
      setTimeout(() => {
        const btn = [...document.querySelectorAll('.dossier .btn')].find(b => b.textContent.includes('处置事件'));
        btn && !btn.disabled && btn.click();
      }, 1800);
      setTimeout(() => { const ch = document.querySelector('.dossier .choice-btn:not(:disabled)'); ch && ch.click(); }, 2600);
    }
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
