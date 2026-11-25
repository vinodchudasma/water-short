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
      background: radial-gradient(ellipse at 50% -10%, #2e1a64, #0e0926 55%, #050312 100%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 18% 22%, rgba(34, 211, 238, 0.09) 0%, transparent 40%),
                  radial-gradient(circle at 82% 78%, rgba(244, 114, 182, 0.08) 0%, transparent 45%);
      pointer-events: none;
      z-index: 0;
    }

    #bg-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    #app {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      max-width: 620px;
      margin: 0 auto;
      padding: 16px 16px 18px
    }

    header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 6px;
      margin-bottom: 4px;
    }

    .title {
      text-align: center;
      line-height: 1.1;
      cursor: pointer;
    }

    .title b {
      font-size: 26px;
      font-weight: 600
    }

    .title small {
      display: block;
      color: var(--mute);
      font-size: 13px;
      margin-top: 2px;
      min-height: 15px
    }

    .lvl-prog-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 8px;
    }

    .lvl-prog-bar {
      width: 200px;
      max-width: 58vw;
      height: 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.45);
    }

    #lvl-prog-fill {
      width: 0%;
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #22d3ee, #34d27b);
      box-shadow: 0 0 8px rgba(52, 210, 123, 0.55);
      transition: width .35s cubic-bezier(.4, 0, .2, 1);
    }

    #lvl-prog-txt {
      font-size: 16px;
      font-weight: 600;
      color: var(--ink);
      white-space: nowrap;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
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
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: min(38px, calc(var(--bh)*.32));
      margin-top: 24px;
    }

    #board::before {
      content: "";
      position: absolute;
      width: min(92vw, 440px);
      height: min(92vw, 440px);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(147, 51, 234, 0.16) 0%, rgba(34, 211, 238, 0.05) 50%, transparent 70%);
      z-index: -1;
      pointer-events: none;
      transform: translateZ(0);
    }

    .row {
      display: flex;
      gap: calc(var(--bw)*.46);
      justify-content: center
    }

    .bottle {
      position: relative;
      width: var(--bw);
      height: var(--bh);
      border-radius: 0 0 calc(var(--bw)*.5) calc(var(--bw)*.5);
      border: 2px solid var(--glass);
      will-change: transform;
      transform: translateZ(0);
      contain: layout;
      border-top-width: 0;
      background: linear-gradient(90deg, #ffffff1c, #ffffff05 40%, #0003);
      transition: transform .4s cubic-bezier(.3, .7, .3, 1);
      cursor: pointer;
      touch-action: manipulation
    }

    .bottle::before {
      content: "";
      position: absolute;
      left: -4px;
      right: -4px;
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
      left: 0;
      right: 0;
      top: -10px;
      height: 26px;
      z-index: 4;
      opacity: 0;
      transform: translateY(-24px);
      transition: transform .42s cubic-bezier(.34, 1.35, .64, 1), opacity .2s ease-out;
      filter: drop-shadow(0 3px 5px rgba(0, 0, 0, .45));
      pointer-events: none;
    }

    .cork::before {
      content: "";
      position: absolute;
      left: -2px;
      right: -2px;
      top: 0;
      height: 9px;
      border-radius: 5px 5px 2px 2px;
      background:
        repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(100, 55, 20, 0.1) 4px, rgba(100, 55, 20, 0.1) 5px),
        linear-gradient(180deg, #eed2af 0%, #caa06d 40%, #a8733a 100%);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.75), inset -2px 0 2px rgba(0, 0, 0, 0.2), 0 2px 3px rgba(0, 0, 0, 0.35);
    }

    .cork::after {
      content: "";
      position: absolute;
      left: 3px;
      right: 3px;
      top: 8px;
      height: 15px;
      border-radius: 0 0 4px 4px;
      background:
        repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(90, 45, 15, 0.12) 3px, rgba(90, 45, 15, 0.12) 4px),
        linear-gradient(90deg, #945d27 0%, #caa06d 22%, #e5c396 42%, #ba884e 72%, #7a4616 100%);
      box-shadow: inset 0 3px 4px rgba(0, 0, 0, 0.4), inset 0 -2px 2px rgba(0, 0, 0, 0.25), 0 3px 5px rgba(0, 0, 0, 0.3);
    }

    .done .cork {
      transform: translateY(4px);
      opacity: 1;
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
      padding: 24px;
      background: radial-gradient(circle at 50% 42%, rgba(91, 33, 182, 0.42), rgba(5, 2, 16, 0.88));
      backdrop-filter: blur(8px);
      z-index: 50
    }

    #win.on {
      display: grid
    }

    .card {
      background: linear-gradient(135deg, #34206b, #1f1245);
      border: 2px solid #b794ff55;
      border-radius: 26px;
      padding: 28px 32px;
      text-align: center;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
      animation: pop .5s cubic-bezier(.3, 1.5, .5, 1)
    }

    #win .card.win-card {
      position: relative;
      width: min(88vw, 348px);
      padding: 46px 24px 24px;
      border-radius: 30px;
      background: linear-gradient(165deg, #43268c 0%, #261458 55%, #160b36 100%);
      border: 2px solid rgba(255, 215, 100, 0.45);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.72), 0 0 42px rgba(168, 85, 247, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.28);
      animation: pop .48s cubic-bezier(.34, 1.48, .64, 1);
    }

    .win-glow-bg {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .win-glow-bg::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 18%;
      width: 340px;
      height: 340px;
      margin-left: -170px;
      margin-top: -170px;
      background: repeating-conic-gradient(from 0deg, rgba(255, 210, 63, 0.11) 0deg 14deg, transparent 14deg 30deg);
      -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 66%);
      mask-image: radial-gradient(circle, #000 0%, transparent 66%);
      animation: winRays 18s linear infinite;
    }

    .win-glow-bg::after {
      content: "";
      position: absolute;
      left: 50%;
      top: -30px;
      transform: translateX(-50%);
      width: 240px;
      height: 140px;
      background: radial-gradient(ellipse, rgba(255, 210, 63, 0.22) 0%, transparent 72%);
    }

    @keyframes winRays {
      to { transform: rotate(360deg); }
    }

    .win-card > *:not(.win-glow-bg):not(.win-ribbon) {
      position: relative;
      z-index: 1;
    }

    @keyframes pop {
      from {
        transform: scale(.68) translateY(16px);
        opacity: 0
      }
    }

    .win-ribbon {
      position: absolute;
      top: -19px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      z-index: 2;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #421902;
      background: linear-gradient(180deg, #fff08a 0%, #ffd23f 48%, #f59e0b 100%);
      border: 2px solid #fffbeb;
      padding: 7px 24px;
      border-radius: 999px;
      box-shadow: 0 4px 0 #b45309, 0 8px 22px rgba(245, 158, 11, 0.5);
    }

    .stars-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin: 4px 0 12px;
      min-height: 64px;
    }

    .star {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 10px rgba(255, 210, 63, 0.55));
    }

    .star svg {
      width: 44px;
      height: 44px;
      display: block;
    }

    .star.s2 svg {
      width: 58px;
      height: 58px;
    }

    #win.on .s1 { animation: starPopL .5s .12s cubic-bezier(.34, 1.56, .64, 1) both; }
    #win.on .s2 { animation: starPopC .52s .26s cubic-bezier(.34, 1.56, .64, 1) both; }
    #win.on .s3 { animation: starPopR .5s .4s cubic-bezier(.34, 1.56, .64, 1) both; }

    @keyframes starPopL {
      0% { transform: scale(0) rotate(-45deg) translateY(18px); opacity: 0; }
      70% { transform: scale(1.2) rotate(-18deg) translateY(2px); opacity: 1; }
      100% { transform: scale(1) rotate(-12deg) translateY(5px); opacity: 1; }
    }

    @keyframes starPopC {
      0% { transform: scale(0) rotate(-25deg) translateY(16px); opacity: 0; }
      70% { transform: scale(1.24) rotate(6deg) translateY(-12px); opacity: 1; }
      100% { transform: scale(1) rotate(0deg) translateY(-8px); opacity: 1; }
    }

    @keyframes starPopR {
      0% { transform: scale(0) rotate(45deg) translateY(18px); opacity: 0; }
      70% { transform: scale(1.2) rotate(18deg) translateY(2px); opacity: 1; }
      100% { transform: scale(1) rotate(12deg) translateY(5px); opacity: 1; }
    }

    .win-card h2 {
      margin: 0 0 6px;
      font-size: 27px;
      color: #fff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
    }

    .win-card p {
      margin: 0 0 18px;
      color: #d4c8ff;
      font-size: 14px;
    }

    .win-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 0 0 20px;
    }

    .win-stat {
      background: rgba(12, 6, 34, 0.48);
      border: 1px solid rgba(196, 181, 253, 0.22);
      border-radius: 16px;
      padding: 10px 8px;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.28);
    }

    .win-stat span {
      display: block;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #a78bfa;
      margin-bottom: 2px;
    }

    .win-stat b {
      display: block;
      font-size: 19px;
      font-weight: 600;
      color: #fff;
    }

    .win-actions {
      display: flex;
      gap: 10px;
      align-items: stretch;
    }

    .win-replay-btn {
      width: 54px;
      flex: none;
      border-radius: 18px;
      border: 2px solid rgba(196, 181, 253, 0.28);
      background: rgba(255, 255, 255, 0.09);
      color: #fff;
      font: 600 22px 'Fredoka', sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 0 rgba(10, 4, 30, 0.72);
      transition: transform .12s;
    }

    .win-replay-btn:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 rgba(10, 4, 30, 0.72);
    }

    .win-next-btn {
      flex: 1;
      position: relative;
      overflow: hidden;
      border: 0;
      border-radius: 18px;
      padding: 14px 20px;
      font: 600 18px 'Fredoka', sans-serif;
      color: #fff;
      background: linear-gradient(180deg, #4ade80 0%, #22c55e 48%, #16a34a 100%);
      box-shadow: 0 5px 0 #14532d, 0 8px 22px rgba(34, 197, 94, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.5);
      cursor: pointer;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform .12s;
    }

    .win-next-btn::after {
      content: "";
      position: absolute;
      top: 0;
      left: -60%;
      width: 45%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
      transform: skewX(-22deg);
      animation: btnShine 2.6s ease-in-out infinite;
    }

    @keyframes btnShine {
      0%, 55% { left: -60%; }
      100% { left: 130%; }
    }

    .win-next-btn:active {
      transform: translateY(3px);
      box-shadow: 0 2px 0 #14532d;
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
  <canvas id="bg-canvas"></canvas>
  <div id="app">
    <header>
      <div class="title">
        <b id="lv">Level 1</b>
        <small id="df"></small>
        <div class="lvl-prog-wrap" aria-label="Level progress">
          <div class="lvl-prog-bar"><div id="lvl-prog-fill"></div></div>
          <span id="lvl-prog-txt">0%</span>
        </div>
      </div>
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
    <div class="card win-card">
      <div class="win-glow-bg"></div>
      <div class="win-ribbon">Congratulations!</div>
      <div class="stars-container" aria-hidden="true">
        <span class="star s1"><svg viewBox="0 0 48 48"><path d="M24 3.5l6.1 12.6 13.9 2-10 9.8 2.4 13.8L24 35.1l-12.4 6.6 2.4-13.8-10-9.8 13.9-2z" fill="#ffd23f" stroke="#fff3b0" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 6.5l4.4 9.5-4.4 8-4.4-8z" fill="#fff7c2" opacity="0.55"/></svg></span>
        <span class="star s2"><svg viewBox="0 0 48 48"><path d="M24 3.5l6.1 12.6 13.9 2-10 9.8 2.4 13.8L24 35.1l-12.4 6.6 2.4-13.8-10-9.8 13.9-2z" fill="#ffd23f" stroke="#fff3b0" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 6.5l4.4 9.5-4.4 8-4.4-8z" fill="#fff7c2" opacity="0.6"/></svg></span>
        <span class="star s3"><svg viewBox="0 0 48 48"><path d="M24 3.5l6.1 12.6 13.9 2-10 9.8 2.4 13.8L24 35.1l-12.4 6.6 2.4-13.8-10-9.8 13.9-2z" fill="#ffd23f" stroke="#fff3b0" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 6.5l4.4 9.5-4.4 8-4.4-8z" fill="#fff7c2" opacity="0.55"/></svg></span>
      </div>
      <h2 id="win-lvl-text">Level Complete!</h2>
      <p id="wm"></p>
      <div class="win-stats">
        <div class="win-stat"><span>Moves</span><b id="win-moves">0</b></div>
        <div class="win-stat"><span>Bottles</span><b id="win-bottles">0</b></div>
      </div>
      <div class="win-actions">
        <button class="win-replay-btn" id="win-replay" aria-label="Replay level">↻</button>
        <button class="win-next-btn" id="nx">Next Level ▶</button>
      </div>
    </div>
  </div>
  <script>
    const COL = [
      '#ff4d8d', '#ff8a1f', '#ffd23f', '#7ddc1f', '#19c37d', '#22d3ee',
      '#4f7cff', '#9b5cff', '#ef3b3b', '#9a6240', '#14b8a6', '#f472b6',
      '#06b6d4', '#e2e8f0', '#8b5cf6', '#f59e0b', '#10b981', '#6366f1',
      '#ec4899', '#84cc16', '#3b82f6', '#a855f7', '#d97706', '#14532d'
    ];
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

    let cachedNoiseBuf = null;
    function getNoiseBuf(ctx) {
      if (cachedNoiseBuf && cachedNoiseBuf.sampleRate === ctx.sampleRate) return cachedNoiseBuf;
      const dur = 2.0;
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
      cachedNoiseBuf = buf;
      return buf;
    }

    function sfxPour(durationSec = 0.8, waterLevel = 1) {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const dur = Math.max(0.3, durationSec);
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuf(ctx);
      noise.loop = true;
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
      let colors;
      if (l <= 2) colors = 3;           // Level 1-2: 3 colors (5 bottles) - Tutorial
      else if (l <= 4) colors = 4;      // Level 3-4: 4 colors (6 bottles) - Easy
      else if (l <= 9) colors = 5;      // Level 5-9: 5 colors (7 bottles) - Milestone 5
      else if (l <= 14) colors = 6;     // Level 10-14: 6 colors (8 bottles) - Milestone 10
      else if (l <= 24) colors = 7;     // Level 15-24: 7 colors (9 bottles)
      else if (l <= 49) colors = 8;     // Level 25-49: 8 colors (10 bottles) - Milestone 25
      else if (l <= 99) colors = 9;     // Level 50-99: 9 colors (11 bottles)
      else if (l <= 199) colors = 10;   // Level 100-199: 10 colors (12 bottles)
      else if (l <= 399) colors = 11;   // Level 200-399: 11 colors (13 bottles)
      else if (l < 415) colors = 12;    // Level 400-414: 12 colors (14 bottles)
      else {
        // 400 ke baad har level me nahi badhega!
        // 400 ke baad har 15 levels ke interval (415, 430, 445...) par 1 color badhega
        // Aur MAX limit 25 bottles hai (23 colors + 2 empty = 25 bottles max), uske baad kabhi nahi badhega!
        const extra = Math.floor((l - 400) / 15);
        colors = Math.min(12 + extra, 23); // 23 colors + 2 empty = 25 bottles maximum
      }
      const empty = 2; // Hamesha 2 empty bottles taaki game solve ho sake
      const hide = l < 6 ? 0 : Math.min(0.25 + (Math.min(l, 400) / 400) * 0.55, 0.85);
      const moves = Math.min(25 + l * 3, 500);
      return { colors, empty, hide, covers: 0, moves };
    }
    function label(l) {
      if (l <= 4) return 'Beginner';
      if (l <= 9) return 'Easy';
      if (l <= 24) return 'Tricky';
      if (l <= 49) return 'Medium';
      if (l <= 99) return 'Advanced';
      if (l <= 199) return 'Hard';
      if (l <= 399) return 'Expert';
      if (l < 565) return 'Grandmaster (400+)';
      return 'Max Challenge (25 Bottles)';
    }

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
      const n = B.length;
      const rows = n <= 5 ? 1 : (n <= 14 ? 2 : (n <= 21 ? 3 : 4));
      const perRow = n <= 5 ? n : Math.ceil(n / rows);
      const bd = $('board');
      bd.innerHTML = ''; els = [];
      { const s = $('stream'); s.getAnimations().forEach(x => x.cancel()); s.style.display = 'none'; }
      const aw = Math.max(300, bd.clientWidth - 16);
      const ah = Math.max(300, bd.clientHeight - 90);
      const gapRatio = 0.46;
      const bwMax = Math.min(52, aw / (perRow + gapRatio * (perRow - 1)));
      const bhMax = ah / (rows + .32 * (rows - 1));
      let bw = Math.min(bwMax, bhMax / 2.65);
      let bh = Math.min(bhMax, bw * 2.65);
      if (bh < 48) {
        bh = Math.max(44, bhMax);
        bw = Math.min(bwMax, bh / 2.5);
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
      $('ab').parentNode.classList.toggle('off', !adds || B.length >= 25);
      const totalColors = Math.max(1, params(L).colors);
      const doneColors = B.filter(full).length;
      const pct = Math.min(100, Math.round((doneColors / totalColors) * 100));
      if ($('lvl-prog-fill')) $('lvl-prog-fill').style.width = pct + '%';
      if ($('lvl-prog-txt')) $('lvl-prog-txt').textContent = pct + '%';
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
      if (busy || !adds || B.length >= 25) return false; adds--; B.push([]); cov.push(false); sel = null; render(); sfxDrop(620, 0.08);
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
      if ($('win-lvl-text')) $('win-lvl-text').textContent = 'Level ' + L + ' Cleared!';
      if ($('win-moves')) $('win-moves').textContent = hist.length;
      if ($('win-bottles')) $('win-bottles').textContent = params(L).colors;
      $('wm').textContent = label(L + 1) == label(L) ? 'Level ' + (L + 1) + ' is waiting for you' : 'Unlocking ' + label(L + 1).toLowerCase() + ' mode on Level ' + (L + 1);
      await sleep(400);
      $('win').classList.add('on');
      if (auto) {
        await sleep(2200);
        if (auto && $('win').classList.contains('on')) {
          $('win').classList.remove('on');
          L++; build();
        }
      }
    }
    $('nx').onclick = () => { $('win').classList.remove('on'); L++; build() };
    $('win-replay').onclick = () => { $('win').classList.remove('on'); build() };
    $('un').onclick = undo; $('ab').onclick = addBottle;
    window.addEventListener('resize', () => { if (!busy) render() });
    let SP = 1.42, auto = false, running = false;
    function solve(b0, cv0) {
      const st0 = b0.map(x => x.map(u => u.c + (u.h ? 64 : 0))), anyC = cv0.some(Boolean), cs = v => v.map(q => q ? 1 : 0).join('');
      const k = (s, v) => (anyC ? s.map(x => x.join(',')) : s.map(x => x.join(',')).sort()).join('|') + '#' + cs(v);
      const fullS = x => x.length === CAP && x.every(c => c < 64 && c === x[0]);
      const unl = (s, v) => { v.forEach((q, i) => { if (q) { const kb = i > 0 ? i - 1 : i + 1; if (kb < s.length && fullS(s[kb])) v[i] = false } }) };
      const H = s => { let h = 0; for (const x of s) { let i = 1; while (i < x.length && (x[i] & 63) === (x[0] & 63)) i++; h += x.length - i; for (const v of x) if (v >= 64) h += .5 } return h };
      const done = s => s.every(x => !x.length || (x.length === CAP && x.every(c => c < 64 && c === x[0])));
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
            if (ns[a].length) ns[a][ns[a].length - 1] &= 63;
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
      auto = !auto; this.classList.toggle('on', auto); SP = auto ? 1.15 : 1.42;
      if (auto) { sel = null; busy = false; sync(); run() }
    };
    function openStart() {
      auto = false; $('au').classList.remove('on'); SP = 1.42;
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
    // Animated Background: Rising 3D Liquid Bubbles (Optimized Sprite Blitting for Mobile 60 FPS)
    (function initBgAnimation() {
      const cv = document.getElementById('bg-canvas');
      if (!cv) return;
      const ctx = cv.getContext('2d', { alpha: true });
      let W = 0, H = 0, dpr = 1;

      // Pre-render bubble sprite textures once to avoid per-frame dynamic gradient allocation
      const spriteSize = 64;
      function createBubbleSprite(hue) {
        const sc = document.createElement('canvas');
        sc.width = spriteSize;
        sc.height = spriteSize;
        const sctx = sc.getContext('2d');
        const c = spriteSize / 2;
        const r = spriteSize * 0.44;

        const grad = sctx.createRadialGradient(c - r * 0.3, c - r * 0.3, r * 0.08, c, c, r);
        grad.addColorStop(0, 'hsla(' + hue + ', 90%, 95%, 0.85)');
        grad.addColorStop(0.5, 'hsla(' + hue + ', 80%, 65%, 0.35)');
        grad.addColorStop(1, 'hsla(' + hue + ', 90%, 50%, 0.05)');
        sctx.fillStyle = grad;
        sctx.beginPath();
        sctx.arc(c, c, r, 0, Math.PI * 2);
        sctx.fill();

        sctx.strokeStyle = 'hsla(' + hue + ', 85%, 75%, 0.7)';
        sctx.lineWidth = 1.8;
        sctx.stroke();

        sctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        sctx.beginPath();
        sctx.arc(c - r * 0.38, c - r * 0.38, Math.max(1.5, r * 0.22), 0, Math.PI * 2);
        sctx.fill();

        return sc;
      }

      const spriteCyan = createBubbleSprite(190);
      const spriteViolet = createBubbleSprite(275);

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        W = window.innerWidth;
        H = window.innerHeight;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      const isMobile = ('ontouchstart' in window) || (window.innerWidth < 600);
      const BUBBLE_COUNT = isMobile ? 18 : 28;
      const bubbles = [];
      const ripples = [];

      for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubbles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 4 + Math.random() * 12,
          speed: 0.35 + Math.random() * 0.75,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.025,
          wobbleAmp: 0.35 + Math.random() * 0.55,
          alpha: 0.25 + Math.random() * 0.45,
          sprite: Math.random() < 0.65 ? spriteCyan : spriteViolet
        });
      }

      window.addEventListener('pointerdown', (e) => {
        if (bubbles.length < BUBBLE_COUNT + 5) {
          bubbles.push({
            x: e.clientX,
            y: e.clientY,
            r: 3 + Math.random() * 4,
            speed: 1.0 + Math.random() * 1.2,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05,
            wobbleAmp: 0.8,
            alpha: 0.6,
            sprite: Math.random() < 0.5 ? spriteCyan : spriteViolet,
            burst: true
          });
        }
        if (ripples.length < 3) {
          ripples.push({
            x: e.clientX,
            y: e.clientY,
            r: 6,
            maxR: 42,
            alpha: 0.32
          });
        }
      }, { passive: true });

      function loop() {
        ctx.clearRect(0, 0, W, H);

        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.r += 1.8;
          rp.alpha *= 0.93;
          if (rp.alpha < 0.02 || rp.r > rp.maxR) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(180, 230, 255, ' + rp.alpha.toFixed(3) + ')';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        for (let i = 0; i < bubbles.length; i++) {
          const b = bubbles[i];
          b.wobble += b.wobbleSpeed;
          b.x += Math.sin(b.wobble) * b.wobbleAmp;
          b.y -= b.speed;

          if (b.y < -b.r * 2) {
            if (b.burst) {
              bubbles.splice(i, 1);
              i--;
              continue;
            }
            b.y = H + b.r * 2;
            b.x = Math.random() * W;
          }

          ctx.globalAlpha = b.alpha;
          const diam = b.r * 2.2;
          ctx.drawImage(b.sprite, b.x - b.r * 1.1, b.y - b.r * 1.1, diam, diam);
        }
        ctx.globalAlpha = 1.0;

        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    })();
    build();
    openStart();
  </script>
</body>
</html>`;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_HTML };
}


