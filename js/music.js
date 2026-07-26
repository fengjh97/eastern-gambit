// 时代红歌 BGM —— WebAudio 芯片音乐合成（旋律主题引用，非原始录音）
(function () {
  'use strict';
  let ctx = null, enabled = true, current = null, timer = null;
  let master = null, filt = null;

  function ac() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0.055;
        filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 2600;
        master.connect(filt); filt.connect(ctx.destination);
      } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // 音符: [半音偏移(相对根音C4=0), 拍数]；r=null 为休止
  // 各时代主题（旋律主题引用，芯片风编曲）
  const TRACKS = {
    title: { // 东方红 · 慢板庄严（陕北民歌曲调）
      bpm: 63, wave: 'triangle', root: 261.63, march: false,
      mel: [[7,1],[7,1],[9,1],[14,2],[12,1],[12,1],[9,1],[7,2],[7,.5],[7,.5],[9,1],[12,1],[9,.5],[7,.5],[4,1],[2,1],[0,3],[null,1],
            [0,1],[0,1],[2,1],[4,2],[7,1],[9,1],[4,1],[2,3],[null,1]] },
    1: { // 东方红 · 行进版
      bpm: 92, wave: 'square', root: 261.63, march: true,
      mel: [[7,1],[7,1],[9,1],[14,2],[12,1],[12,1],[9,1],[7,2],[7,.5],[7,.5],[9,1],[12,1],[9,.5],[7,.5],[4,1],[2,1],[0,3],[null,1]] },
    2: { // 社会主义好 · 欢快进行曲
      bpm: 126, wave: 'square', root: 293.66, march: true,
      mel: [[12,.5],[7,.5],[12,.5],[9,.5],[7,1],[null,.5],[12,.5],[7,.5],[12,.5],[9,.5],[7,1],[null,.5],
            [4,.5],[7,.5],[9,.5],[12,.5],[9,1],[7,1],[2,.5],[4,.5],[7,.5],[9,.5],[7,1.5],[null,.5]] },
    3: { // 国际歌 · 沉郁庄严
      bpm: 76, wave: 'triangle', root: 246.94, march: false,
      mel: [[-5,1],[0,1.5],[-1,.5],[0,1],[4,1.5],[2,.5],[7,1],[4,1],[0,1],[5,2],[4,1],[2,2],[null,1],
            [-5,1],[2,1.5],[0,.5],[-1,1],[4,1],[2,1],[-1,1],[0,3],[null,1]] },
    4: { // 在希望的田野上 · 明亮抒情
      bpm: 108, wave: 'triangle', root: 293.66, march: true,
      mel: [[4,.5],[7,.5],[9,1],[12,1.5],[9,.5],[7,1],[4,.5],[7,1.5],[null,.5],
            [9,.5],[12,.5],[14,1],[12,.5],[9,.5],[7,1],[9,.5],[7,.5],[4,2],[null,.5],
            [0,.5],[4,.5],[7,1],[9,1],[7,.5],[4,.5],[2,1],[0,2],[null,1]] },
    5: { // 春天的故事 · 温暖开阔
      bpm: 96, wave: 'triangle', root: 261.63, march: false,
      mel: [[7,.5],[7,.5],[9,1],[7,1],[4,1.5],[7,.5],[7,.5],[9,1],[12,1],[9,2],[null,.5],
            [12,.5],[12,.5],[14,1],[12,1],[9,1.5],[7,.5],[9,.5],[12,1],[7,1],[4,2],[null,.5],
            [4,.5],[7,.5],[9,1],[12,1],[14,1],[12,.5],[9,.5],[7,2],[null,1]] },
  };

  function tone(freq, t0, dur, wave, vel) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = wave; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vel, t0 + 0.02);
    g.gain.setValueAtTime(vel * 0.8, t0 + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function hat(t0) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const g = ctx.createGain(); g.gain.value = 0.25;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000;
    s.connect(f); f.connect(g); g.connect(master); s.start(t0);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    current = null;
  }

  function play(key) {
    if (!enabled) { current = { key }; return; } // 记住待播曲目
    if (!ac()) return;
    if (current && current.key === key && timer) return;
    stop();
    const tr = TRACKS[key]; if (!tr) return;
    const beat = 60 / tr.bpm;
    const total = tr.mel.reduce((a, n) => a + n[1], 0);
    const st = { key, next: ctx.currentTime + 0.1, idx: 0, beatIdx: 0 };
    current = st;
    timer = setInterval(() => {
      if (!ctx || !enabled) return;
      while (st.next < ctx.currentTime + 0.5) {
        const [semi, beats] = tr.mel[st.idx];
        const dur = beats * beat;
        if (semi != null) tone(tr.root * Math.pow(2, semi / 12), st.next, dur * 0.92, tr.wave, 0.9);
        // 低音与节奏
        if (tr.march) {
          const bcount = Math.round(beats * 2);
          for (let i = 0; i < bcount; i++) {
            const t = st.next + i * beat / 2;
            if (i % 2 === 0) tone(tr.root / 2 * (i % 4 === 0 ? 1 : 1.5), t, beat * 0.4, 'triangle', 0.5);
            else hat(t);
          }
        } else if (semi != null) {
          tone(tr.root / 2, st.next, dur * 0.9, 'sine', 0.35);
        }
        st.next += dur;
        st.idx = (st.idx + 1) % tr.mel.length;
        if (st.idx === 0) st.next += beat * 2; // 循环间隙
      }
    }, 120);
  }

  window.Music = {
    playTitle: () => play('title'),
    playAct: n => play(n),
    stop,
    setEnabled: on => {
      enabled = on;
      if (!on) { const k = current && current.key; stop(); current = { key: k }; }
      else if (current && current.key != null) { const k = current.key; current = null; play(k); }
    },
    get enabled() { return enabled; },
  };
})();
