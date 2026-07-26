// 极简 WebAudio 合成音效（无外部素材）
(function () {
  'use strict';
  let ctx = null, enabled = true;
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, vol, delay, slide) {
    const c = ac(); if (!c || !enabled) return;
    const t0 = c.currentTime + (delay || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol || .12, t0 + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + .05);
  }
  function noise(dur, vol, delay) {
    const c = ac(); if (!c || !enabled) return;
    const t0 = c.currentTime + (delay || 0);
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain(); g.gain.value = vol || .1;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t0);
  }
  const fx = {
    flip: () => { noise(.07, .06); tone(1200, .05, 'triangle', .04); },
    type: () => tone(2400 + Math.random() * 800, .015, 'square', .012),
    stamp: () => { noise(.12, .18); tone(140, .12, 'sine', .2, 0, 60); },
    dice: () => { for (let i = 0; i < 5; i++) { tone(600 + Math.random() * 900, .04, 'square', .05, i * .12); noise(.03, .06, i * .12); } },
    coin: () => { tone(880, .09, 'triangle', .1); tone(1320, .16, 'triangle', .09, .07); },
    success: () => { tone(523, .12, 'triangle', .12); tone(659, .12, 'triangle', .12, .12); tone(784, .3, 'triangle', .14, .24); },
    fail: () => { tone(220, .3, 'sawtooth', .09); tone(185, .45, 'sawtooth', .09, .18); },
    alarm: () => { tone(520, .16, 'sawtooth', .07); tone(520, .16, 'sawtooth', .07, .24); },
    gong: () => { tone(196, 1.6, 'sine', .16, 0, 190); tone(392, 1.2, 'sine', .06, .02); noise(.4, .05); },
    curtain: () => noise(.5, .1),
  };
  window.Audio2 = {
    play: name => { try { fx[name] && fx[name](); } catch (e) { } },
    toggle: () => (enabled = !enabled),
  };
})();
