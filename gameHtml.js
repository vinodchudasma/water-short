// Embedded Water Sort Game HTML for React Native Expo WebView & Web
const GAME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
  <title>Water Sort</title>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg1: #1b0f3d;
      --bg2: #08051a;
      --ink: #f3eeff;
      --mute: #9d8fd0;
      --glass: rgba(200, 185, 255, .55);
      --btn: #7c3aed;
      --btn2: #a855f7;
      --gold: #ffd23f;
      box-sizing: border-box;
      padding-top: env(safe-area-inset-top, 0px);
      padding-bottom: env(safe-area-inset-bottom, 0px)
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }

    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    body {
      font-family: 'Fredoka', system-ui, sans-serif;
      color: var(--ink);
      background: radial-gradient(ellipse at 50% 0%, var(--bg1), var(--bg2) 70%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image: radial-gradient(1.5px 1.5px at 20% 30%, #fff8, transparent), radial-gradient(1px 1px at 70% 20%, #fff6, transparent), radial-gradient(1.5px 1.5px at 40% 80%, #fff5, transparent), radial-gradient(1px 1px at 85% 65%, #fff7, transparent), radial-gradient(1px 1px at 10% 70%, #fff5, transparent);
      pointer-events: none
    }

    #app {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      max-width: 520px;
      margin: 0 auto;
      padding: 16px 16px 20px
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between
    }

    .title {
      text-align: center;
      line-height: 1.1;
      cursor: pointer;
    }

    .title b {
      font-size: 24px;
      font-weight: 600
    }

    .title small {
      display: block;
      color: var(--mute);
      font-size: 13px;
      margin-top: 2px;
      min-height: 15px
    }

    .ib {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 0;
      background: linear-gradient(#8b4df0, #6a2bd6);
      color: #fff;
      font: inherit;
      font-size: 20px;
      box-shadow: 0 3px 0 #3c1590, inset 0 1px 0 #fff4;
      cursor: pointer;
      transition: transform .12s
    }

    .ib:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 #3c1590
    }

    #board {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: min(24px, calc(var(--bh)*.22));
      margin-top: 36px;
    }

    .row {
      display: flex;
      gap: calc(var(--bw)*.22);
      justify-content: center
    }

    .bottle {
      position: relative;
      width: var(--bw);
      height: var(--bh);
      border-radius: 0 0 calc(var(--bw)*.5) calc(var(--bw)*.5);
      border: 2px solid var(--glass);
      border-top-width: 0;
      background: linear-gradient(90deg, #ffffff1c, #ffffff05 40%, #0003);
      transition: transform .4s cubic-bezier(.3, .7, .3, 1);
      cursor: pointer;
      touch-action: manipulation
    }

    .bottle::before {
      content: "";
      position: absolute;
      left: -7px;
      right: -7px;
      top: -8px;
      height: 10px;
      border-radius: 6px 6px 4px 4px;
      border: 2px solid var(--glass);
      background: linear-gradient(#ffffff40, #ffffff12);
      z-index: 3
    }

    .bottle::after {
      content: "";
      position: absolute;
      left: 14%;
      top: 12%;
      width: 10%;
      height: 55%;
      border-radius: 8px;
      background: linear-gradient(#fff8, #fff0);
      z-index: 3;
      pointer-events: none
    }

    .bottle.sel {
      transform: translateY(-16px);
      box-shadow: 0 0 18px #c4a6ff88
    }

    .liq {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden;
      display: flex;
      flex-direction: column-reverse
    }

    .s {
      height: 0;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #fff7;
      font-size: calc(var(--bw)*.4);
      transition: height var(--d, .45s) cubic-bezier(.45, 0, .3, 1);
      box-shadow: inset 0 3px 0 #fff3, inset 0 -2px 0 #0002
    }

    .cork {
      position: absolute;
      left: -7px;
      right: -7px;
      top: -18px;
      height: 24px;
      z-index: 4;
      opacity: 0;
      transform: translateY(-28px);
      transition: transform .45s cubic-bezier(.34, 1.4, .64, 1), opacity .2s ease-out;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, .5));
      pointer-events: none
    }

    .cork::before {
      content: "";
      position: absolute;
      left: -2px;
      right: -2px;
      top: 0;
      height: 11px;
      border-radius: 7px;
      background: linear-gradient(180deg, #eed8b8 0%, #d4a572 60%, #b2804b 100%);
      box-shadow: inset 0 1px 1px #fff9, 0 2px 3px rgba(0, 0, 0, .35)
    }

    .cork::after {
      content: "";
      position: absolute;
      left: 7px;
      right: 7px;
      top: 10px;
      height: 12px;
      border-radius: 0 0 4px 4px;
      background: linear-gradient(90deg, #8d5828 0%, #c18b52 25%, #e4b584 55%, #a8723c 85%, #76441b 100%);
      box-shadow: inset 0 2px 3px rgba(0, 0, 0, .35)
    }

    .done .cork {
      transform: translateY(10px);
      opacity: 1
    }

    .done {
      box-shadow: 0 0 14px #fff4
    }

    .cloth {
      position: absolute;
      inset: -6px -4px -4px;
      border-radius: 12px 12px 24px 24px;
      background: linear-gradient(#fafafa, #cfc9e0);
      z-index: 5;
      display: grid;
      place-items: center;
      color: #7c3aed;
      font-weight: 600;
      font-size: calc(var(--bw)*.5);
      box-shadow: 0 4px 10px #0006;
      transition: opacity .3s, transform .3s
    }

    .cloth.off {
      opacity: 0;
      transform: translateY(-30px) scale(.9);
      pointer-events: none
    }

    .shake {
      animation: sh .3s
    }

    @keyframes sh {
      25% { transform: translateX(-5px) }
      75% { transform: translateX(5px) }
    }

    #stream {
      position: fixed;
      width: 7px;
      border-radius: 3px;
      z-index: 30;
      height: 0;
      pointer-events: none;
      display: none;
      clip-path: inset(0 0 100% 0)
    }

    footer {
      display: flex;
      justify-content: center;
      gap: 22px
    }

    .pw {
      position: relative
    }

    .pw .ib {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      font-size: 24px
    }

    .pw i {
      position: absolute;
      right: -6px;
      bottom: -6px;
      min-width: 24px;
      height: 24px;
      border-radius: 12px;
      background: var(--gold);
      color: #3b2a00;
      font: 600 13px/24px 'Fredoka', sans-serif;
      text-align: center;
      font-style: normal;
      box-shadow: 0 2px 0 #b8901c
    }

    .pw.off .ib {
      opacity: .4
    }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 110px;
      transform: translate(-50%, 20px);
      background: #000a;
      padding: 10px 16px;
      border-radius: 14px;
      opacity: 0;
      transition: .3s;
      pointer-events: none;
      font-size: 15px;
      z-index: 40;
      text-align: center;
      max-width: 86%
    }

    #toast.on {
      opacity: 1;
      transform: translate(-50%, 0)
    }

    #win {
      position: fixed;
      inset: 0;
      display: none;
      place-items: center;
      background: #05021090;
      backdrop-filter: blur(4px);
      z-index: 50
    }

    #win.on {
      display: grid
    }

    .card {
      background: linear-gradient(#34206b, #1f1245);
      border: 2px solid #b794ff55;
      border-radius: 26px;
      padding: 28px 34px;
      text-align: center;
      animation: pop .5s cubic-bezier(.3, 1.5, .5, 1)
    }

    @keyframes pop {
      from {
        transform: scale(.6);
        opacity: 0
      }
    }

    .card h2 {
      margin: 0 0 6px;
      font-size: 28px
    }

    .card p {
      margin: 0 0 18px;
      color: var(--mute)
    }

    .go {
      border: 0;
      border-radius: 16px;
      padding: 12px 30px;
      font: 600 18px 'Fredoka', sans-serif;
      color: #fff;
      background: linear-gradient(#a855f7, #7c3aed);
      box-shadow: 0 4px 0 #43189a;
      cursor: pointer
    }

    .go:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 #43189a
    }

    #au.on {
      background: linear-gradient(#34d27b, #15803d);
      box-shadow: 0 3px 0 #0b4a22, 0 0 16px #34d27b88
    }

    #st {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      background: #050210d9;
      backdrop-filter: blur(4px);
      z-index: 60
    }

    #st.off {
      display: none
    }

    #lvin {
      width: 150px;
      margin: 0 0 20px;
      padding: 10px 14px;
      border-radius: 14px;
      border: 2px solid #b794ff66;
      background: #150b33;
      color: var(--ink);
      font: 600 28px 'Fredoka', sans-serif;
      text-align: center
    }

    .key {
      box-shadow: 0 0 16px 3px #ffd23fbb;
      border-color: #ffd23f
    }
  </style>
</head>
<body>
  <div id="app">
    <header>
      <button class="ib" id="rs" aria-label="Restart level">↻</button>
      <div class="title"><b id="lv">Level 1</b><small id="df"></small></div>
      <button class="ib" id="snd" aria-label="Sound on or off">♪</button>
    </header>
    <div id="board"></div>
    <footer>
      <div class="pw"><button class="ib" id="un" aria-label="Undo">↶</button><i id="unc">5</i></div>
      <div class="pw"><button class="ib" id="ab" aria-label="Add a bottle">+</button><i id="abc">2</i></div>
      <div class="pw"><button class="ib" id="au" aria-label="Auto play">▶</button></div>
    </footer>
  </div>
  <div id="stream"></div>
  <div id="st">
    <div class="card">
      <h2>Water Sort</h2>
      <p>Enter the level you want to start from</p><input id="lvin" type="number" inputmode="numeric" min="1"
        max="99999" value="1" aria-label="Start level"><br><button class="go" id="play">Play</button>
    </div>
  </div>
  <div id="toast"></div>
  <div id="win">
    <div class="card">
      <h2>Level complete</h2>
      <p id="wm"></p><button class="go" id="nx">Next level</button>
    </div>
  </div>
  <script>
    const COL = ['#ff4d8d', '#ff8a1f', '#ffd23f', '#7ddc1f', '#19c37d', '#22d3ee', '#4f7cff', '#9b5cff', '#ef3b3b', '#9a6240', '#14b8a6', '#e8e4f5'];
    const CAP = 4, $ = s => document.getElementById(s), sleep = ms => new Promise(r => setTimeout(r, ms));
    let L = 1, B = [], cov = [], els = [], sel = null, busy = false, hist = [], undos = 5, adds = 2, sound = true, ac = null;
    try { L = Math.max(1, parseInt(localStorage.getItem('ws_level')) || 1) } catch (e) { }

    function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
    function getAudioCtx() {
      if (!sound) return null;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === 'suspended') ac.resume();
        return ac;
      } catch (e) { return null; }
    }

    function sfxDrop(freq = 550, vol = 0.08) {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.12);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.15);
    }

    function sfxPour(durationSec = 0.8, waterLevel = 1) {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const dur = Math.max(0.3, durationSec);
      const bufSize = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.18;
      }
      const noise = ctx.createBufferSource(); noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const startF = 500 + waterLevel * 160, endF = startF + 320;
      filter.frequency.setValueAtTime(startF, now);
      filter.frequency.linearRampToValueAtTime(endF, now + dur);
      filter.Q.value = 3.5;

      const gNoise = ctx.createGain();
      gNoise.gain.setValueAtTime(0.001, now);
      gNoise.gain.linearRampToValueAtTime(0.07, now + 0.08);
      gNoise.gain.setValueAtTime(0.065, now + dur - 0.08);
      gNoise.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      noise.connect(filter); filter.connect(gNoise); gNoise.connect(ctx.destination);
      noise.start(now); noise.stop(now + dur);

      const dropletCount = Math.min(8, Math.floor(dur * 7));
      for (let k = 0; k < dropletCount; k++) {
        const delay = 0.06 + k * (dur / dropletCount) * (0.85 + Math.random() * 0.3);
        if (delay < dur - 0.05) {
          setTimeout(() => {
            sfxDrop(480 + waterLevel * 120 + k * 55 + Math.random() * 40, 0.045);
          }, delay * 1000);
        }
      }
    }

    function sfxCork() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.11);
    }

    function sfxTap(freq = 720) {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.06);
      g.gain.setValueAtTime(0.07, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.09);
    }

    function sfxWin() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq, idx) => {
        setTimeout(() => {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator(), g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.06, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now); osc.stop(now + 0.5);
        }, idx * 90);
      });
    }

    function toast(t) { const e = $('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 2200) }

    function params(l) {
      const colors = Math.min(3 + Math.floor((l - 1) / 3), 12);
      return { colors, empty: l < 40 ? 2 : 1, hide: l >= 8 ? Math.min(.7 + (l - 8) * .02, .95) : 0, covers: 0, moves: Math.min(30 + l * 4, 420) };
    }
    function label(l) { return l <= 5 ? 'Easy' : l <= 15 ? 'Getting trickier' : l <= 30 ? 'Medium' : l <= 50 ? 'Hard' : 'Very hard' }

    function gen(l) {
      const p = params(l);
      for (let attempt = 0; attempt < 50; attempt++) {
        const r = rng(l * 7919 + 13 + attempt * 101);
        let b = [];
        for (let c = 0; c < p.colors; c++)b.push(Array.from({ length: CAP }, () => ({ c, h: false })));
        for (let e = 0; e < p.empty; e++)b.push([]);

        for (let i = 0, mv = 0; (mv < p.moves || solved(b)) && i < 8000; i++) {
          const a = Math.floor(r() * b.length), d = Math.floor(r() * b.length);
          if (a === d || !b[a].length || b[d].length >= CAP) continue;
          const u = b[a][b[a].length - 1], rest = b[a][b[a].length - 2];
          if (rest && rest.c !== u.c) continue;
          if (b[d].length && b[d][b[d].length - 1].c === u.c && r() < .85) continue;
          b[d].push(b[a].pop()); mv++;
        }
        const mode = l % 3;
        b.forEach(x => x.forEach((u, k) => {
          const ok = k < x.length - 1 && x[k + 1].c !== u.c && (k === 0 || x[k - 1].c !== u.c);
          const pat = mode === 0 ? r() < p.hide : mode === 1 ? true : (x.length - 1 - k) % 2 === 1;
          u.h = p.hide > 0 && ok && pat;
        }));
        const cv = b.map(() => false);
        return { b, cv };
      }
    }
    const full = x => x.length === CAP && x.every(u => u.c === x[0].c && !u.h);
    function solved(b) { return b.every(x => !x.length || full(x)) }

    function build() {
      const g = gen(L); B = g.b; cov = g.cv; hist = []; undos = 5; adds = 2; sel = null; busy = false;
      $('lv').textContent = 'Level ' + L; $('df').textContent = label(L);
      render();
    }
    function render() {
      const n = B.length, perRow = n <= 5 ? n : Math.ceil(n / 2), rows = n <= 5 ? 1 : 2, bd = $('board');
      bd.innerHTML = ''; els = [];
      { const s = $('stream'); s.getAnimations().forEach(x => x.cancel()); s.style.display = 'none'; }
      const aw = bd.clientWidth, ah = bd.clientHeight - 120;
      const bwMax = Math.min(42, aw / (perRow + .24 * (perRow - 1))), bhMax = ah / (rows + .24 * (rows - 1));
      let bw = Math.min(bwMax, bhMax / 2.7);
      let bh = Math.min(bhMax, bw * 2.7);
      if (bh < 44) {
        bh = Math.max(38, bhMax);
        bw = Math.min(bwMax, bh / 2.6);
      }
      const root = document.documentElement.style; root.setProperty('--bw', bw + 'px'); root.setProperty('--bh', bh + 'px');
      let row;
      B.forEach((_, i) => {
        if (i % perRow === 0) { row = document.createElement('div'); row.className = 'row'; bd.appendChild(row) }
        const e = document.createElement('div'); e.className = 'bottle'; e.tabIndex = 0; e.setAttribute('role', 'button');
        e.innerHTML = '<div class="liq">' + '<div class="s"></div>'.repeat(CAP) + '</div><div class="cork"></div><div class="cloth">🔒</div>';
        e.onclick = () => tap(i); e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tap(i) } };
        row.appendChild(e); els.push(e);
      });
      sync();
    }
    function sync(skipBottleIdx = -1) {
      B.forEach(b => { if (b.length) b[b.length - 1].h = false });
      B.forEach((b, i) => {
        const e = els[i]; if (!e) return;
        e.querySelectorAll('.s').forEach((s, k) => {
          const u = b[k];
          if (u) { const h = u.h && k < b.length - 1; s.style.height = '25%'; s.style.backgroundColor = h ? '#2a1d52' : COL[u.c]; s.textContent = h ? '?' : '' }
          else s.style.height = '0';
        });
        if (i !== skipBottleIdx) {
          e.classList.toggle('done', full(b));
        }
        e.classList.toggle('sel', sel === i);
        e.querySelector('.cloth').classList.toggle('off', !cov[i]);
        e.classList.toggle('key', cov.some((q, j) => q && (j > 0 ? j - 1 : j + 1) === i));
      });
      $('unc').textContent = undos; $('abc').textContent = adds;
      $('un').parentNode.classList.toggle('off', !hist.length || !undos);
      $('ab').parentNode.classList.toggle('off', !adds);
    }
    const canPour = (a, b) => a !== b && B[a].length && B[b].length < CAP && !cov[a] && !cov[b] && (!B[b].length || B[b][B[b].length - 1].c === B[a][B[a].length - 1].c);
    function unlockCheck() {
      let o = false;
      cov.forEach((q, i) => {
        if (q) {
          const kb = i > 0 ? i - 1 : i + 1;
          if (B[kb] && (full(B[kb]) || (B[kb].length === 0 && B.some(x => full(x))))) {
            cov[i] = false;
            o = true;
          }
        }
      });
      return o;
    }
    function hasMove() {
      for (let a = 0; a < B.length; a++)for (let b = 0; b < B.length; b++)
        if (canPour(a, b) && !(B[b].length === 0 && B[a].every(u => u.c === B[a][0].c))) return true;
      return false;
    }

    function tap(i) {
      if (busy) return;
      if (cov[i]) { els[i].classList.remove('shake'); void els[i].offsetWidth; els[i].classList.add('shake'); sfxTap(240); toast('Locked. Complete the glowing bottle next to it to open.'); return }
      if (sel === null) { if (B[i].length) { sel = i; sfxTap(640); sync() } return }
      if (sel === i) { sel = null; sfxTap(480); sync(); return }
      if (canPour(sel, i)) { pour(sel, i); return }
      els[i].classList.remove('shake'); void els[i].offsetWidth; els[i].classList.add('shake'); sfxTap(240);
      if (B[i].length && !cov[i]) { sel = i; sync() }
    }

    async function pour(a, b) {
      busy = true;
      hist.push({ B: JSON.parse(JSON.stringify(B)), cov: cov.slice() });
      const ea = els[a], eb = els[b], ra = ea.getBoundingClientRect(), rb = eb.getBoundingClientRect();
      const h = rb.height, bcx = rb.left + rb.width / 2, side = bcx - .5 * h > 8 ? -1 : 1;
      const c = B[a][B[a].length - 1].c, color = COL[c];
      const capB = CAP;
      let n = 0; while (n < B[a].length && B[a][B[a].length - 1 - n].c === c && !B[a][B[a].length - 1 - n].h && B[b].length + n < capB) n++;
      const acx = ra.left + ra.width / 2, acy = ra.top + ra.height / 2 + 16, wd = rb.width, R = t => t * Math.PI / 180;
      const myf = t => rb.top - 24 - h * Math.cos(R(t)) - (wd / 2) * Math.sin(R(t)), py = t => myf(t) + .5 * h * Math.cos(R(t)) - acy;
      const pose = t => \`translate(\${bcx + side * .5 * h * Math.sin(R(t)) - acx}px,\${py(t)}px) rotate(\${-side * t}deg)\`;
      const mv = 750 * SP, pd = (950 + n * 300) * SP, rt = 650 * SP, T = mv + pd + rt, E = 'cubic-bezier(.45,0,.2,1)';
      sel = null; ea.classList.remove('sel'); ea.style.transition = 'none'; ea.style.zIndex = 20;
      const st = $('stream'); st.getAnimations().forEach(x => x.cancel());
      const surf = rb.bottom - 4 - ((B[b].length + n / 2) / capB) * (h - 8), m0 = myf(52), m1 = myf(88);
      st.style.cssText = \`background:\${color};left:\${bcx - 3.5}px;top:\${m0}px;height:\${Math.max(8, surf - m0)}px\`;
      document.documentElement.style.setProperty('--d', (pd * .8) + 'ms');
      const wy = Math.min(py(52), -(h * .9 + 14));
      ea.animate([{ transform: 'translateY(-16px)', easing: E }, { transform: \`translate(0px,\${wy}px)\`, offset: .45 * mv / T, easing: E }, { transform: pose(52), offset: mv / T, easing: 'linear' }, { transform: pose(70), offset: (mv + pd * .45) / T, easing: 'linear' }, { transform: pose(88), offset: (mv + pd) / T, easing: E }, { transform: \`translate(0px,\${wy}px)\`, offset: (mv + pd + rt * .5) / T, easing: E }, { transform: 'none' }], { duration: T });
      await sleep(mv - 60);
      st.style.display = 'block';
      st.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], { duration: 180, easing: 'ease-in', fill: 'forwards' });
      st.animate([{ top: m0 + 'px', height: Math.max(8, surf - m0) + 'px' }, { top: m1 + 'px', height: Math.max(8, surf - m1) + 'px' }], { duration: pd * .8, delay: 60, easing: 'linear', fill: 'both' });

      sfxPour((pd * .8) / 1000, B[b].length);
      await sleep(120);
      for (let k = 0; k < n; k++)B[b].push(B[a].pop());
      sync(b);
      await sleep(pd * .8 - 100);
      st.animate([{ clipPath: 'inset(0)' }, { clipPath: 'inset(100% 0 0 0)' }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
      await sleep(T - (mv + 60 + pd * .8 - 100) + 30);
      ea.style.transition = ''; ea.style.zIndex = '';
      st.getAnimations().forEach(x => x.cancel()); st.style.display = 'none';

      if (full(B[b])) sfxCork();
      busy = false;
      const opened = unlockCheck();
      let added = false;
      if (!hasMove() && adds > 0) {
        addBottle();
        added = true;
      }
      sync();
      if (solved(B)) return win();
      if (added) { toast('No moves left, added an extra bottle!'); sfxDrop(420, 0.06) }
      else if (opened) { toast('Bottle unlocked'); sfxDrop(680, 0.06) }
      if (!hasMove()) toast('No moves left. Undo or restart level.');
    }

    function undo() {
      if (busy || !hist.length || !undos) return;
      const h = hist.pop(); B = h.B; cov = h.cov; undos--; sel = null;
      sfxTap(520);
      render();
    }
    function addBottle() {
      if (busy || !adds) return false; adds--; B.push([]); cov.push(false); sel = null; render(); sfxDrop(620, 0.08);
      return true;
    }
    function confetti() {
      const cv = document.createElement('canvas'); cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:55';
      const dpr = Math.min(window.devicePixelRatio || 1, 2), W = window.innerWidth, H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
      const c = cv.getContext('2d'); c.scale(dpr, dpr);
      const P = [];
      const burst = (x, y, n) => { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.7, v = 7 + Math.random() * 9; P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 5 + Math.random() * 6, h: 3 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: COL[Math.floor(Math.random() * COL.length)], life: 0 }) } };
      burst(W * .15, H * .85, 60); burst(W * .85, H * .85, 60);
      setTimeout(() => burst(W * .5, H * .62, 70), 380);
      let last = performance.now();
      (function f(t) {
        const dt = Math.min(2, (t - last) / 16.7); last = t; c.clearRect(0, 0, W, H);
        for (const p of P) {
          p.vy += .28 * dt; p.vx *= .992; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.life += dt;
          c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.globalAlpha = Math.max(0, 1 - p.life / 150); c.fillStyle = p.c; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore()
        }
        if (performance.now() - t0 < 450 || P.some(p => p.life < 150 && p.y < H + 40)) requestAnimationFrame(f); else cv.remove();
      })(last);
      var t0 = performance.now();
    }
    async function win() {
      confetti();
      busy = true; sfxWin();
      try { localStorage.setItem('ws_level', L + 1) } catch (e) { }
      $('wm').textContent = label(L + 1) == label(L) ? 'Level ' + (L + 1) + ' is next.' : 'Level ' + (L + 1) + ' gets ' + label(L + 1).toLowerCase() + '.';
      await sleep(400);
      $('win').classList.add('on');
      if (auto) {
        await sleep(2200);
        if (auto) {
          $('win').classList.remove('on');
          L++; build();
        }
      }
    }
    $('nx').onclick = () => { $('win').classList.remove('on'); L++; build() };
    $('rs').onclick = () => { if (!busy || $('win').classList.contains('on')) build() };
    $('un').onclick = undo; $('ab').onclick = addBottle;
    $('snd').onclick = function () { sound = !sound; this.style.opacity = sound ? 1 : .45; toast(sound ? 'Sound on' : 'Sound off') };
    window.addEventListener('resize', () => { if (!busy) render() });
    let SP = 1.15, auto = false, running = false;
    function solve(b0, cv0) {
      const st0 = b0.map(x => x.map(u => u.c + (u.h ? 16 : 0))), anyC = cv0.some(Boolean), cs = v => v.map(q => q ? 1 : 0).join('');
      const k = (s, v) => (anyC ? s.map(x => x.join(',')) : s.map(x => x.join(',')).sort()).join('|') + '#' + cs(v);
      const fullS = x => x.length === CAP && x.every(c => c < 16 && c === x[0]);
      const unl = (s, v) => { v.forEach((q, i) => { if (q) { const kb = i > 0 ? i - 1 : i + 1; if (kb < s.length && fullS(s[kb])) v[i] = false } }) };
      const H = s => { let h = 0; for (const x of s) { let i = 1; while (i < x.length && (x[i] & 15) === (x[0] & 15)) i++; h += x.length - i; for (const v of x) if (v > 15) h += .5 } return h };
      const done = s => s.every(x => !x.length || (x.length === CAP && x.every(c => c < 16 && c === x[0])));
      const N = [{ s: st0, cv: cv0.slice(), p: -1, m: null, g: 0 }], seen = new Set([k(st0, cv0)]), hp = [[H(st0) * 3, 0]];
      const push = e => { hp.push(e); let i = hp.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (hp[p][0] <= hp[i][0]) break;[hp[p], hp[i]] = [hp[i], hp[p]]; i = p } };
      const pop = () => { const t = hp[0], l = hp.pop(); if (hp.length) { hp[0] = l; let i = 0; for (; ;) { const a = 2 * i + 1, c = a + 1; let m = i; if (a < hp.length && hp[a][0] < hp[m][0]) m = a; if (c < hp.length && hp[c][0] < hp[m][0]) m = c; if (m === i) break;[hp[m], hp[i]] = [hp[i], hp[m]]; i = m } } return t };
      const t0 = performance.now(); let it = 0;
      while (hp.length) {
        const id = pop()[1], nd = N[id], s = nd.s, cv = nd.cv; let any = false;
        if (done(s)) { const path = []; for (let j = id; N[j].p >= 0; j = N[j].p)if (N[j].m) path.push(N[j].m); return path.reverse() }
        if (++it > 300000 || (it % 2000 === 0 && performance.now() - t0 > 3000)) return null;
        for (let a = 0; a < s.length; a++) {
          const x = s[a]; if (!x.length || cv[a]) continue;
          const top = x[x.length - 1], uni = x.every(c => c === x[0]);
          if (uni && x.length === CAP) continue;
          for (let d = 0; d < s.length; d++) {
            const y = s[d];
            if (cv[d] || a === d || y.length >= CAP || (y.length && y[y.length - 1] !== top) || (!y.length && uni)) continue;
            let n = 0; while (n < x.length && x[x.length - 1 - n] === top && y.length + n < CAP) n++;
            const ns = s.map(z => z.slice()); for (let q = 0; q < n; q++)ns[d].push(ns[a].pop());
            if (ns[a].length) ns[a][ns[a].length - 1] &= 15;
            any = true;
            const nc = cv.slice(); unl(ns, nc);
            const kk = k(ns, nc); if (seen.has(kk)) continue; seen.add(kk);
            N.push({ s: ns, cv: nc, p: id, m: [a, d], g: nd.g + 1 }); push([H(ns) * 3 + nd.g + 1, N.length - 1]);
          }
        }
        if (!any && cv.some(Boolean)) { const nc = cv.slice(); nc[nc.indexOf(true)] = false; unl(s, nc); const kk = k(s, nc); if (!seen.has(kk)) { seen.add(kk); N.push({ s, cv: nc, p: id, m: null, g: nd.g }); push([H(s) * 3 + nd.g, N.length - 1]) } }
      }
      return null;
    }
    async function run() {
      if (running) return; running = true;
      try {
        while (auto) {
          const on = $('win').classList.contains('on');
          if (on) { $('nx').click(); await sleep(400); continue }
          if (solved(B) || busy) { await sleep(100); continue }
          const path = solve(B, cov);
          if (!path) {
            if (adds) { addBottle(); await sleep(500); continue }
            toast('Auto could not solve this one, skipping'); L++; build(); await sleep(700); continue;
          }
          for (const [a, b] of path) {
            if (!auto) break;
            while (busy && !solved(B)) await sleep(40);
            if (solved(B)) break;
            sel = null;
            pour(a, b);
            while (busy) await sleep(40);
            await sleep(80);
          }
        }
      } finally { running = false }
    }
    $('au').onclick = function () {
      auto = !auto; this.classList.toggle('on', auto); SP = auto ? .95 : 1.15;
      toast(auto ? 'Auto play on' : 'Auto play off');
      if (auto) { sel = null; busy = false; sync(); run() }
    };
    function openStart() {
      auto = false; $('au').classList.remove('on'); SP = 1.15;
      $('lvin').value = L; $('st').classList.remove('off');
      setTimeout(() => { $('lvin').focus(); $('lvin').select() }, 50);
    }
    function startGame() {
      const v = Math.floor(Number($('lvin').value));
      L = v >= 1 ? Math.min(v, 99999) : 1;
      try { localStorage.setItem('ws_level', L) } catch (e) { }
      $('st').classList.add('off'); $('win').classList.remove('on');
      build();
    }
    $('play').onclick = startGame;
    $('lvin').onkeydown = e => { if (e.key === 'Enter') startGame() };
    $('lv').parentNode.onclick = openStart;
    build();
    openStart();
  </script>
</body>
</html>`;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_HTML };
}


