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
      --sat: env(safe-area-inset-top, 0px);
      --sab: env(safe-area-inset-bottom, 0px);
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    body {
      font-family: 'Fredoka', system-ui, sans-serif;
      color: var(--ink);
      background: linear-gradient(135deg, #06091f, #111c4d, #1f175e, #2b1a6e, #0e2c5c, #070a24);
      background-size: 400% 400%;
      animation: bgGradientFlow 10s ease-in-out infinite;
    }

    @keyframes bgGradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    body::before,
    body::after {
      content: "";
      position: fixed;
      width: 92vmax;
      height: 92vmax;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      will-change: transform;
    }

    body::before {
      top: -32vmax;
      left: -26vmax;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(59, 130, 246, 0.14) 40%, transparent 68%);
      animation: orbDriftA 11s ease-in-out infinite alternate;
    }

    body::after {
      bottom: -32vmax;
      right: -26vmax;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.24) 0%, rgba(99, 102, 241, 0.14) 40%, transparent 68%);
      animation: orbDriftB 13s ease-in-out infinite alternate;
    }

    @keyframes orbDriftA {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(34vw, 24vh, 0) scale(1.18); }
      100% { transform: translate3d(12vw, 48vh, 0) scale(0.95); }
    }

    @keyframes orbDriftB {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(-34vw, -24vh, 0) scale(1.2); }
      100% { transform: translate3d(-12vw, -46vh, 0) scale(0.94); }
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
      padding: calc(16px + var(--sat)) 16px calc(18px + var(--sab))
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

    #board.board-dense {
      gap: min(20px, calc(var(--bh)*.22));
      margin-top: 6px;
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
      backdrop-filter: blur(6px);
      z-index: 60
    }

    #st.off {
      display: none
    }

    #st .card {
      width: min(90vw, 355px);
      padding: 26px 22px;
    }

    .mode-switch {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 6px 0 18px;
    }

    .mode-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 10px;
      border-radius: 18px;
      border: 2px solid rgba(183, 148, 255, 0.25);
      background: rgba(21, 11, 51, 0.72);
      color: var(--ink);
      font-family: inherit;
      cursor: pointer;
      transition: transform .15s, border-color .2s, background .2s, box-shadow .2s;
    }

    .mode-btn:active {
      transform: scale(0.97);
    }

    .mode-btn.on {
      border-color: #38bdf8;
      background: linear-gradient(160deg, rgba(56, 189, 248, 0.22), rgba(124, 58, 237, 0.34));
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.28);
    }

    .mode-ico {
      font-size: 26px;
      line-height: 1.1;
    }

    .mode-name {
      font-size: 15px;
      font-weight: 600;
    }

    .mode-sub {
      font-size: 11px;
      color: var(--mute);
    }

    .mode-btn.on .mode-sub {
      color: #bae6fd;
    }

    #board.board-shape {
      gap: min(16px, calc(var(--bh) * 0.16));
      margin-top: 8px;
    }

    .shape-mid-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(12px, 4vw, 24px);
      width: 100%;
    }

    .shape-wrap {
      position: relative;
      width: var(--sw, 148px);
      height: var(--sh, 156px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      touch-action: manipulation;
      transition: transform .28s cubic-bezier(.3, .7, .3, 1), filter .3s;
      filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45));
    }

    .shape-wrap:active {
      transform: scale(0.97);
    }

    .shape-wrap.ready {
      transform: scale(1.04);
      filter: drop-shadow(0 0 22px var(--scol, rgba(56, 189, 248, 0.75)));
    }

    .shape-wrap.done {
      filter: drop-shadow(0 0 24px var(--scol, rgba(255, 210, 63, 0.85)));
    }

    .shape-wrap svg {
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
    }

    #shape-liq-wrap {
      transition: transform var(--d, .45s) cubic-bezier(.45, 0, .3, 1);
      will-change: transform;
    }

    .shape-wave-a {
      animation: waveSlideA 2.8s linear infinite;
    }

    .shape-wave-b {
      animation: waveSlideB 4.1s linear infinite;
    }

    @keyframes waveSlideA {
      from { transform: translateX(0); }
      to { transform: translateX(-100px); }
    }

    @keyframes waveSlideB {
      from { transform: translateX(-200px); }
      to { transform: translateX(0); }
    }

    .shape-bub {
      animation: shapeBub 3.2s ease-in infinite;
    }

    @keyframes shapeBub {
      0% { transform: translateY(0) scale(0.8); opacity: 0; }
      20% { opacity: 0.55; }
      85% { opacity: 0.4; }
      100% { transform: translateY(-76px) scale(1.1); opacity: 0; }
    }

    .shape-cork {
      position: absolute;
      left: var(--smx, 50%);
      top: 1px;
      width: 21%;
      height: 13%;
      z-index: 4;
      opacity: 0;
      transform: translate(-50%, -20px);
      transition: transform .42s cubic-bezier(.34, 1.35, .64, 1), opacity .2s ease-out;
      filter: drop-shadow(0 3px 5px rgba(0, 0, 0, .45));
      pointer-events: none;
    }

    .shape-cork::before {
      content: "";
      position: absolute;
      left: -2px;
      right: -2px;
      top: 0;
      height: 42%;
      border-radius: 6px 6px 2px 2px;
      background: linear-gradient(180deg, #eed2af 0%, #caa06d 45%, #a8733a 100%);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.75);
    }

    .shape-cork::after {
      content: "";
      position: absolute;
      left: 3px;
      right: 3px;
      top: 40%;
      height: 60%;
      border-radius: 0 0 4px 4px;
      background: linear-gradient(90deg, #945d27 0%, #caa06d 25%, #e5c396 48%, #ba884e 75%, #7a4616 100%);
    }

    .shape-wrap.done .shape-cork {
      opacity: 1;
      transform: translate(-50%, 2px);
    }

    #shape-fish {
      transition: transform var(--d, .45s) cubic-bezier(.45, 0, .3, 1);
    }

    .fish-bob {
      animation: fishSwim 2.6s ease-in-out infinite;
      transform-origin: center;
    }

    @keyframes fishSwim {
      0%, 100% { transform: translate(-2px, 0px) rotate(-3deg); }
      50% { transform: translate(3px, -2.5px) rotate(3deg); }
    }

    #lvin {
      width: 150px;
      margin: 0 0 18px;
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
      <div class="mode-switch" role="group" aria-label="Game mode">
        <button type="button" class="mode-btn on" id="m-classic">
          <span class="mode-ico">🧪</span>
          <span class="mode-name">Classic</span>
          <span class="mode-sub">Sort bottles</span>
        </button>
        <button type="button" class="mode-btn" id="m-shape">
          <span class="mode-ico">💎</span>
          <span class="mode-name">Shape Fill</span>
          <span class="mode-sub">Fill the shape</span>
        </button>
      </div>
      <p id="st-sub">Enter the level you want to start from</p><input id="lvin" type="number" inputmode="numeric" min="1"
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
        <div class="win-stat"><span id="win-stat-2-lbl">Bottles</span><b id="win-bottles">0</b></div>
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
    let mode = 'classic', L = 1, SL = 1, B = [], cov = [], els = [], sel = null, busy = false, hist = [], undos = 5, adds = 2, sound = true, ac = null;
    let shapeState = null;
    try {
      L = Math.max(1, parseInt(localStorage.getItem('ws_level')) || 1);
      SL = Math.max(1, parseInt(localStorage.getItem('ws_shape_level')) || 1);
      if (localStorage.getItem('ws_mode') === 'shape') mode = 'shape';
    } catch (e) { }
    const curLv = () => mode === 'shape' ? SL : L;
    function setLv(v) {
      const n = v >= 1 ? Math.min(v, 99999) : 1;
      if (mode === 'shape') { SL = n; try { localStorage.setItem('ws_shape_level', SL) } catch (e) { } }
      else { L = n; try { localStorage.setItem('ws_level', L) } catch (e) { } }
    }
    function advanceLv() { setLv(curLv() + 1); }

    const SHAPES = [
      {
        id: 'pipe', name: 'Pipe Lab', yMin: 29, yMax: 190.5, mouthX: 0.22, mouthY: 0.08,
        d: 'M27,15 H61 Q66,15 66,20 Q66,25 60,26 L60,45 L90,45 Q108,45 108,63 L108,86 L138,86 Q156,86 156,104 L156,126 A35,35 0 1,1 132,126 L132,112 Q132,108 128,108 L108,108 L108,132 Q108,142 90,142 Q72,142 72,132 L72,71 Q72,67 68,67 L60,67 L60,80 Q60,89 44,89 Q28,89 28,80 L28,26 Q22,25 22,20 Q22,15 27,15 Z',
        clipD: 'M31.5,27 H56.5 V48.5 H90 Q104.5,48.5 104.5,63 V89.5 H138 Q152.5,89.5 152.5,104 V128.7 A31.5,31.5 0 1,1 135.5,128.7 V112 Q135.5,104.5 128,104.5 H104.5 V132 Q104.5,138.5 90,138.5 Q75.5,138.5 75.5,132 V71 Q75.5,63.5 68,63.5 H56.5 V80 Q56.5,85.5 44,85.5 Q31.5,85.5 31.5,80 Z',
        specD: 'M34,32 H40 V78 Q36,80 34,74 Z M78,68 H83 V130 Q79,132 78,125 Z M116,158 C116,142 125,131 136,128 C128,136 123,147 123,160 C123,170 127,179 133,184 C121,180 116,170 116,158 Z',
        specR: 'M160,134 C169,140 174,151 172,165 C170,175 163,182 154,186 C162,179 166,171 167,160 C168,149 165,140 160,134 Z M68,48 H91 Q101,48 103,56 Q98,52 90,52 H68 Z M114,89 H139 Q149,89 151,97 Q146,93 138,93 H114 Z',
        flowD: 'M44,22 V48 Q44,56 52,56 H82 Q90,56 90,64 V89 Q90,97 98,97 H136 Q144,97 144,105 V188',
        facetD: ''
      },
      {
        id: 'flask', name: 'Potion Flask', yMin: 36, yMax: 191,
        d: 'M76,16 H124 Q129,16 129,23 Q129,30 121,31 L117,33 L117,64 C149,78 168,107 168,140 C168,176 138,196 100,196 C62,196 32,176 32,140 C32,107 51,78 83,64 L83,33 L79,31 Q71,30 71,23 Q71,16 76,16 Z',
        clipD: 'M86,34 L114,34 L114,66 C145,80 163,108 163,140 C163,172 135,191 100,191 C65,191 37,172 37,140 C37,108 55,80 86,66 Z',
        specD: 'M48,136 C48,108 64,86 86,74 C72,94 60,114 60,140 C60,156 66,168 74,176 C57,168 48,153 48,136 Z',
        specR: 'M152,138 C152,158 140,174 124,182 C136,171 144,157 144,138 C144,116 132,96 119,82 C139,96 152,116 152,138 Z',
        flowD: 'M100,24 V188',
        facetD: ''
      },
      {
        id: 'heart', name: 'Crystal Heart', yMin: 32, yMax: 186,
        d: 'M82,16 H118 Q123,16 123,22 Q123,28 116,29 L113,34 C124,24 142,20 158,30 C180,44 186,74 174,104 C162,134 128,166 100,193 C72,166 38,134 26,104 C14,74 20,44 42,30 C58,20 76,24 87,34 L84,29 Q77,28 77,22 Q77,16 82,16 Z',
        clipD: 'M88,36 L112,36 C123,27 140,25 154,34 C174,47 179,74 168,102 C157,130 125,160 100,186 C75,160 43,130 32,102 C21,74 26,47 46,34 C60,25 77,27 88,36 Z',
        specD: 'M38,88 C30,66 36,46 52,38 C60,34 68,36 72,41 C54,48 44,68 49,92 C52,104 59,115 66,125 C52,115 43,103 38,88 Z',
        specR: 'M162,88 C166,70 163,54 152,44 C160,55 160,72 153,92 C145,115 129,138 112,158 C134,139 154,114 162,88 Z',
        facetD: ''
      },
      {
        id: 'diamond', name: 'Crystal Gem', yMin: 38, yMax: 189,
        d: 'M78,16 H122 Q127,16 127,22 Q127,28 120,29 L116,35 L154,52 Q166,58 172,72 L182,95 Q186,104 179,113 L110,191 Q100,200 90,191 L21,113 Q14,104 18,95 L28,72 Q34,58 46,52 L84,35 L80,29 Q73,28 73,22 Q73,16 78,16 Z',
        clipD: 'M86,36 L114,36 L151,56 Q162,62 167,74 L176,96 Q179,103 173,111 L107,185 Q100,192 93,185 L27,111 Q21,103 24,96 L33,74 Q38,62 49,56 Z',
        specD: 'M34,98 L44,72 Q48,64 58,60 L72,53 L56,101 L86,166 L36,108 Q32,103 34,98 Z',
        specR: 'M164,98 L155,74 L144,64 L152,99 L120,160 L162,110 Q166,104 164,98 Z',
        facetD: 'M27,103 H173 M62,56 L50,103 L100,185 M138,56 L150,103 L100,185'
      },
      {
        id: 'drop', name: 'Aqua Drop', yMin: 32, yMax: 191,
        d: 'M86,16 H114 Q118,16 118,21 Q118,26 112,27 C124,54 166,100 166,139 C166,174 137,196 100,196 C63,196 34,174 34,139 C34,100 76,54 88,27 Q82,26 82,21 Q82,16 86,16 Z',
        clipD: 'M91,29 L109,29 C121,57 161,102 161,139 C161,171 134,191 100,191 C66,191 39,171 39,139 C39,102 79,57 91,29 Z',
        specD: 'M47,138 C47,112 68,80 86,52 C74,84 58,112 58,138 C58,156 66,169 77,178 C58,170 47,156 47,138 Z',
        specR: 'M152,138 C152,158 140,174 123,182 C136,170 144,156 144,138 C144,116 130,90 118,70 C138,94 152,116 152,138 Z',
        facetD: ''
      },
      {
        id: 'star', name: 'Star Jar', yMin: 36, yMax: 180,
        d: 'M82,16 H118 Q123,16 123,22 Q123,28 116,29 L114,42 Q118,62 132,70 L174,80 Q186,83 177,94 L146,123 Q140,129 143,138 L154,177 Q157,189 145,183 L107,160 Q100,156 93,160 L55,183 Q43,189 46,177 L57,138 Q60,129 54,123 L23,94 Q14,83 26,80 L68,70 Q82,62 86,42 L84,29 Q77,28 77,22 Q77,16 82,16 Z',
        clipD: 'M89,34 L111,34 Q115,65 130,74 L170,84 Q179,86 172,94 L142,121 Q136,128 139,138 L149,174 Q151,182 143,177 L107,155 Q100,151 93,155 L57,177 Q49,182 51,174 L61,138 Q64,128 58,121 L28,94 Q21,86 30,84 L70,74 Q85,65 89,34 Z',
        specD: 'M34,90 L68,80 Q84,74 88,52 L84,78 Q74,88 38,94 Z',
        specR: 'M165,92 L138,118 Q131,126 135,140 L143,168 L131,141 Q126,125 134,116 Z',
        facetD: ''
      },
      {
        id: 'hex', name: 'Hex Prism', yMin: 38, yMax: 189,
        d: 'M80,16 H120 Q125,16 125,22 Q125,28 118,29 L115,36 L160,60 Q172,67 172,81 L172,143 Q172,157 160,164 L112,191 Q100,198 88,191 L40,164 Q28,157 28,143 L28,81 Q28,67 40,60 L85,36 L82,29 Q75,28 75,22 Q75,16 80,16 Z',
        clipD: 'M87,37 L113,37 L157,64 Q167,70 167,82 L167,142 Q167,154 157,160 L109,186 Q100,191 91,186 L43,160 Q33,154 33,142 L33,82 Q33,70 43,64 Z',
        specD: 'M40,84 Q40,74 49,68 L76,52 L52,78 L52,144 L72,166 L44,152 Q40,149 40,141 Z',
        specR: 'M160,84 L160,141 Q160,149 156,152 L134,164 L152,144 L152,78 L136,60 L153,70 Q160,74 160,84 Z',
        facetD: 'M52,70 L100,98 L148,70 M100,98 L100,185'
      }
    ];

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
    const isGameWon = () => mode === 'shape' ? Boolean(shapeState && shapeState.units >= shapeState.cap && solved(B)) : solved(B);

    function paramsShape(l) {
      const sh = SHAPES[(l - 1) % SHAPES.length];
      const targetColor = ((l - 1) * 3) % 8;
      let initUnits, needed, other;
      if (l <= 2) { initUnits = 1; needed = 4; other = 3; }         // 6 bottles (4 filled), cap 5 -> 1 T/bottle
      else if (l <= 5) { initUnits = 2; needed = 4; other = 4; }    // 7 bottles (5 filled), cap 6 -> 1 T/bottle
      else if (l <= 12) { initUnits = 1; needed = 8; other = 4; }   // 8 bottles (6 filled), cap 9 -> isolated single T
      else if (l <= 24) { initUnits = 2; needed = 8; other = 5; }   // 9 bottles (7 filled), cap 10 -> isolated single T
      else if (l <= 49) { initUnits = 2; needed = 8; other = 6; }   // 10 bottles (8 filled), cap 10 -> 1 T/bottle
      else if (l <= 99) { initUnits = 2; needed = 8; other = 7; }   // 11 bottles (9 filled), cap 10 -> 1 T/bottle
      else if (l <= 199) { initUnits = 2; needed = 12; other = 7; } // 12 bottles (10 filled), cap 14 -> isolated single T
      else if (l <= 299) { initUnits = 2; needed = 12; other = 8; } // 13 bottles (11 filled), cap 14 -> isolated single T
      else if (l <= 399) { initUnits = 2; needed = 12; other = 9; } // 14 bottles (12 filled), cap 14 -> 1 T/bottle
      else if (l < 475) {
        const extra = Math.floor((l - 400) / 15);
        initUnits = 3;
        needed = 16; // 4 target bottles, cap 19
        other = 9 + extra; // 15..19 bottles (13..17 filled -> mostly/all 1 T/bottle)
      } else {
        const extra = Math.floor((l - 475) / 15);
        initUnits = 3;
        needed = 20; // 5 target bottles, cap 23 -> strictly 1 T/bottle across 20 separate bottles!
        other = Math.min(13 + extra, 18); // 5 target + 18 other + 2 empty = 25 bottles max at Lv 550+
      }
      const cap = initUnits + needed;
      const hide = l < 6 ? 0 : Math.min(0.25 + (Math.min(l, 400) / 400) * 0.55, 0.80);
      return { sh, targetColor, initUnits, needed, cap, other, hide };
    }

    function solveShape(b0, sh0, maxIt = 200000, maxMs = 2000) {
      const T = sh0.color, cap = sh0.cap;
      const st0 = b0.map(x => x.map(u => u.c + (u.h ? 64 : 0)));
      const k = (s, su) => s.map(x => x.join(',')).sort().join('|') + '#' + su;
      const done = (s, su) => su >= cap && s.every(x => !x.length || (x.length === CAP && x.every(c => c < 64 && c === x[0])));
      const H = (s, su) => {
        let h = (cap - su) * 2.5;
        for (const x of s) {
          let i = 1;
          while (i < x.length && (x[i] & 63) === (x[0] & 63)) i++;
          h += x.length - i;
          for (const v of x) if (v >= 64) h += 0.5;
        }
        return h;
      };
      const N = [{ s: st0, su: sh0.units, p: -1, m: null, g: 0 }];
      const seen = new Set([k(st0, sh0.units)]);
      const hp = [[H(st0, sh0.units) * 3, 0]];
      const push = e => { hp.push(e); let i = hp.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (hp[p][0] <= hp[i][0]) break; [hp[p], hp[i]] = [hp[i], hp[p]]; i = p } };
      const pop = () => { const t = hp[0], l = hp.pop(); if (hp.length) { hp[0] = l; let i = 0; for (; ;) { const a = 2 * i + 1, c = a + 1; let m = i; if (a < hp.length && hp[a][0] < hp[m][0]) m = a; if (c < hp.length && hp[c][0] < hp[m][0]) m = c; if (m === i) break; [hp[m], hp[i]] = [hp[i], hp[m]]; i = m } } return t };
      const t0 = performance.now(); let it = 0;
      while (hp.length) {
        const id = pop()[1], nd = N[id], s = nd.s, su = nd.su;
        if (done(s, su)) {
          const path = [];
          for (let j = id; N[j].p >= 0; j = N[j].p) if (N[j].m) path.push(N[j].m);
          return path.reverse();
        }
        if (++it > maxIt || (it % 1000 === 0 && performance.now() - t0 > maxMs)) return null;
        let pouredT = false;
        for (let a = 0; a < s.length; a++) {
          const x = s[a]; if (!x.length) continue;
          if (x[x.length - 1] === T && su < cap) {
            let n = 0; while (n < x.length && x[x.length - 1 - n] === T && su + n < cap) n++;
            if (n > 0) {
              const ns = s.map(z => z.slice());
              for (let q = 0; q < n; q++) ns[a].pop();
              if (ns[a].length) ns[a][ns[a].length - 1] &= 63;
              const nsu = su + n;
              const kk = k(ns, nsu);
              if (!seen.has(kk)) {
                seen.add(kk);
                N.push({ s: ns, su: nsu, p: id, m: [a, 'shape'], g: nd.g + 1 });
                push([H(ns, nsu) * 3 + nd.g + 1, N.length - 1]);
              }
              pouredT = true;
              break;
            }
          }
        }
        if (pouredT) continue;
        for (let a = 0; a < s.length; a++) {
          const x = s[a]; if (!x.length) continue;
          const top = x[x.length - 1];
          const uni = x.every(c => c === x[0]);
          if (uni && x.length === CAP) continue;
          let usedEmpty = false;
          for (let d = 0; d < s.length; d++) {
            const y = s[d];
            if (a === d || y.length >= CAP) continue;
            if (!y.length) { if (uni || usedEmpty) continue; }
            else if (y[y.length - 1] !== top) continue;
            let n = 0; while (n < x.length && x[x.length - 1 - n] === top && y.length + n < CAP) n++;
            const ns = s.map(z => z.slice());
            for (let q = 0; q < n; q++) ns[d].push(ns[a].pop());
            if (ns[a].length) ns[a][ns[a].length - 1] &= 63;
            const kk = k(ns, su);
            if (seen.has(kk)) continue;
            if (!y.length) usedEmpty = true;
            seen.add(kk);
            N.push({ s: ns, su, p: id, m: [a, d], g: nd.g + 1 });
            push([H(ns, su) * 3 + nd.g + 1, N.length - 1]);
          }
        }
      }
      return null;
    }

    function genShape(l) {
      const p = paramsShape(l);
      const otherCols = [];
      for (let idx = 1; otherCols.length < p.other && idx <= COL.length; idx++) {
        const c = (p.targetColor + idx * 5) % COL.length;
        if (c !== p.targetColor && !otherCols.includes(c)) otherCols.push(c);
      }
      const filledCount = (p.needed / CAP) + p.other;
      const shInit = { id: p.sh.id, name: p.sh.name, cap: p.cap, color: p.targetColor, units: p.initUnits, initUnits: p.initUnits, other: p.other };
      const minMoves = Math.min(36, Math.max(5, Math.floor(filledCount * 1.4)));
      let best = null;
      for (let attempt = 0; attempt < 30; attempt++) {
        const r = rng(l * 8923 + 37 + attempt * 131);
        const b = Array.from({ length: filledCount }, () => []);
        // Place at most 1 T per bottle first (at k=0 or k=1) so T is NEVER stacked [T,T,T]
        const bottleOrder = Array.from({ length: filledCount }, (_, i) => i);
        for (let i = bottleOrder.length - 1; i > 0; i--) {
          const j = Math.floor(r() * (i + 1));
          const tmp = bottleOrder[i]; bottleOrder[i] = bottleOrder[j]; bottleOrder[j] = tmp;
        }
        const tCountPerBottle = new Array(filledCount).fill(0);
        let placedT = 0;
        for (const bi of bottleOrder) {
          if (placedT >= p.needed) break;
          tCountPerBottle[bi] = 1;
          placedT++;
        }
        // Only if needed > filledCount (small mid-tier levels), add a 2nd separated T
        for (const bi of bottleOrder) {
          if (placedT >= p.needed) break;
          tCountPerBottle[bi]++;
          placedT++;
        }
        const remPool = [];
        for (const oc of otherCols) for (let k = 0; k < CAP; k++) remPool.push(oc);
        for (let i = remPool.length - 1; i > 0; i--) {
          const j = Math.floor(r() * (i + 1));
          const tmp = remPool[i]; remPool[i] = remPool[j]; remPool[j] = tmp;
        }
        let pi = 0;
        for (let bi = 0; bi < filledCount; bi++) {
          const tc = tCountPerBottle[bi];
          if (tc === 1) {
            // Put single T deep at slot 0 or 1 (slot 0..2 on tutorial l <= 2)
            const tPos = l <= 2 ? Math.floor(r() * 3) : Math.floor(r() * 2);
            for (let k = 0; k < CAP; k++) {
              b[bi].push({ c: k === tPos ? p.targetColor : remPool[pi++], h: false });
            }
          } else if (tc === 2) {
            // Put 2 T units strictly separated: [T, X, T, Y]
            b[bi].push({ c: p.targetColor, h: false });
            b[bi].push({ c: remPool[pi++], h: false });
            b[bi].push({ c: p.targetColor, h: false });
            b[bi].push({ c: remPool[pi++], h: false });
          } else {
            for (let k = 0; k < CAP; k++) b[bi].push({ c: remPool[pi++], h: false });
          }
        }
        b.push([]); b.push([]);
        if (b.some(x => x.length === CAP && x.every(u => u.c === x[0].c))) continue;
        if (b.some(x => x.some((u, k) => k > 0 && u.c === p.targetColor && x[k - 1].c === p.targetColor))) continue;
        if (p.hide > 0) {
          const hMode = l % 3;
          b.forEach(x => x.forEach((u, k) => {
            const ok = k < x.length - 1 && x[k + 1].c !== u.c && (k === 0 || x[k - 1].c !== u.c);
            const pat = hMode === 0 ? r() < p.hide : hMode === 1 ? true : (x.length - 1 - k) % 2 === 1;
            u.h = ok && pat;
          }));
        }
        const path = solveShape(b, shInit, 80000, 180);
        if (path) {
          best = { b, cv: b.map(() => false), shape: Object.assign({}, shInit), len: path.length };
          if (path.length >= minMoves) return { b: best.b, cv: best.cv, shape: best.shape };
        }
      }
      if (best) return { b: best.b, cv: best.cv, shape: best.shape };
      // Guaranteed solvable reverse-pour fallback
      const r = rng(l * 9973 + 53);
      const b = [];
      for (let i = 0; i < p.needed / CAP; i++) b.push(Array.from({ length: CAP }, () => ({ c: p.targetColor, h: false })));
      for (const oc of otherCols) b.push(Array.from({ length: CAP }, () => ({ c: oc, h: false })));
      b.push([]); b.push([]);
      const mixMoves = Math.min(80 + l * 3, 500);
      for (let i = 0, mv = 0; (mv < mixMoves || solved(b)) && i < 8000; i++) {
        const a = Math.floor(r() * b.length), d = Math.floor(r() * b.length);
        if (a === d || !b[a].length || b[d].length >= CAP) continue;
        const u = b[a][b[a].length - 1], rest = b[a][b[a].length - 2];
        if (rest && rest.c !== u.c) continue;
        if (b[d].length && b[d][b[d].length - 1].c === u.c && r() < .85) continue;
        b[d].push(b[a].pop()); mv++;
      }
      if (p.hide > 0) {
        const hMode = l % 3;
        b.forEach(x => x.forEach((u, k) => {
          const ok = k < x.length - 1 && x[k + 1].c !== u.c && (k === 0 || x[k - 1].c !== u.c);
          const pat = hMode === 0 ? r() < p.hide : hMode === 1 ? true : (x.length - 1 - k) % 2 === 1;
          u.h = ok && pat;
        }));
      }
      return { b, cv: b.map(() => false), shape: Object.assign({}, shInit) };
    }

    function buildShapeHtml(sh, colorHex) {
      const span = sh.yMax - sh.yMin;
      const wY = sh.yMin;
      const waveA = 'M0,' + wY + ' Q25,' + (wY - 5) + ' 50,' + wY + ' T100,' + wY + ' T150,' + wY + ' T200,' + wY + ' T250,' + wY + ' T300,' + wY + ' T350,' + wY + ' T400,' + wY + ' V' + (wY + 24) + ' H0 Z';
      const waveLine = 'M0,' + wY + ' Q25,' + (wY - 5) + ' 50,' + wY + ' T100,' + wY + ' T150,' + wY + ' T200,' + wY + ' T250,' + wY + ' T300,' + wY + ' T350,' + wY + ' T400,' + wY;
      const waveB = 'M0,' + (wY - 1) + ' Q50,' + (wY + 5) + ' 100,' + (wY - 1) + ' T200,' + (wY - 1) + ' T300,' + (wY - 1) + ' T400,' + (wY - 1) + ' V' + (wY + 24) + ' H0 Z';
      const facets = sh.facetD ? '<path d="' + sh.facetD + '" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.3" stroke-linecap="round"/>' : '';
      const flowPath = sh.flowD || 'M100,24 V188';
      const flowWidth = sh.id === 'pipe' ? 9 : 7;
      const mouthCx = (sh.mouthX || 0.5) * 200;
      const fishMarkup = sh.id === 'pipe'
        ? '<g id="shape-fish" style="transform:translate(144px,172px)"><g class="fish-bob">'
          + '<path d="M-8,0 L-13,-4.5 L-11.5,0 L-13,4.5 Z" fill="#ff6b00"/>'
          + '<ellipse cx="0" cy="0" rx="8.5" ry="5.5" fill="#ff851b" stroke="#fff4e0" stroke-width="0.9"/>'
          + '<path d="M-2.5,-5.2 Q-0.5,0 -2.5,5.2" fill="none" stroke="#ffffff" stroke-width="2.1"/>'
          + '<path d="M3,-4.5 Q4.5,0 3,4.5" fill="none" stroke="#ffffff" stroke-width="1.6"/>'
          + '<circle cx="5.2" cy="-1.2" r="1.3" fill="#1a0f2e"/>'
          + '<circle cx="5.6" cy="-1.5" r="0.45" fill="#ffffff"/>'
          + '</g></g>'
        : '';
      return ''
        + '<div class="shape-cork"></div>'
        + '<svg id="shape-svg" viewBox="0 0 200 210" aria-hidden="true">'
        + '  <defs>'
        + '    <clipPath id="shape-clip"><path d="' + sh.clipD + '"/></clipPath>'
        + '    <linearGradient id="shape-glass-bg" x1="0" y1="0" x2="1" y2="0.2">'
        + '      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>'
        + '      <stop offset="35%" stop-color="rgba(255,255,255,0.04)"/>'
        + '      <stop offset="75%" stop-color="rgba(8,6,28,0.22)"/>'
        + '      <stop offset="100%" stop-color="rgba(255,255,255,0.12)"/>'
        + '    </linearGradient>'
        + '    <linearGradient id="shape-liq-3d" x1="0" y1="0" x2="1" y2="0">'
        + '      <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>'
        + '      <stop offset="22%" stop-color="rgba(255,255,255,0.05)"/>'
        + '      <stop offset="68%" stop-color="rgba(0,0,0,0.02)"/>'
        + '      <stop offset="100%" stop-color="rgba(0,0,0,0.28)"/>'
        + '    </linearGradient>'
        + '    <linearGradient id="shape-glass-sheen" x1="0" y1="0" x2="1" y2="1">'
        + '      <stop offset="0%" stop-color="rgba(255,255,255,0.20)"/>'
        + '      <stop offset="30%" stop-color="rgba(255,255,255,0.02)"/>'
        + '      <stop offset="70%" stop-color="rgba(255,255,255,0)"/>'
        + '      <stop offset="100%" stop-color="rgba(255,255,255,0.10)"/>'
        + '    </linearGradient>'
        + '    <linearGradient id="shape-spec-grad" x1="0" y1="0" x2="0" y2="1">'
        + '      <stop offset="0%" stop-color="rgba(255,255,255,0.68)"/>'
        + '      <stop offset="100%" stop-color="rgba(255,255,255,0.08)"/>'
        + '    </linearGradient>'
        + '  </defs>'
        + '  <path d="' + sh.d + '" fill="url(#shape-glass-bg)"/>'
        + '  <g clip-path="url(#shape-clip)">'
        + '    <path id="shape-pipe-flow" d="' + flowPath + '" fill="none" stroke="' + colorHex + '" stroke-width="' + flowWidth + '" stroke-linecap="round" stroke-linejoin="round" style="opacity:0"/>'
        + '    <path id="shape-pipe-flow-core" d="' + flowPath + '" fill="none" stroke="rgba(255,255,255,0.48)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:0"/>'
        + '    <g id="shape-liq-wrap">'
        + '      <path class="shape-wave-b" d="' + waveB + '" fill="' + colorHex + '" opacity="0.55"/>'
        + '      <path class="shape-wave-b" d="' + waveB + '" fill="rgba(255,255,255,0.22)"/>'
        + '      <rect x="0" y="' + (wY + 5) + '" width="200" height="' + (span + 34) + '" fill="' + colorHex + '"/>'
        + '      <path class="shape-wave-a" d="' + waveA + '" fill="' + colorHex + '"/>'
        + '      <path class="shape-wave-a" d="' + waveLine + '" fill="none" stroke="rgba(255,255,255,0.68)" stroke-width="2.2" stroke-linecap="round"/>'
        + '      <circle class="shape-bub" cx="76" cy="' + (wY + 95) + '" r="3.2" fill="rgba(255,255,255,0.45)" style="animation-delay:0s"/>'
        + '      <circle class="shape-bub" cx="118" cy="' + (wY + 115) + '" r="2.4" fill="rgba(255,255,255,0.4)" style="animation-delay:1.1s"/>'
        + '      <circle class="shape-bub" cx="95" cy="' + (wY + 130) + '" r="3.8" fill="rgba(255,255,255,0.35)" style="animation-delay:2.1s"/>'
        + '      <circle class="shape-bub" cx="144" cy="' + (wY + 150) + '" r="2.6" fill="rgba(255,255,255,0.48)" style="animation-delay:0.6s"/>'
        + '    </g>'
        + fishMarkup
        + '    <rect x="0" y="0" width="200" height="210" fill="url(#shape-liq-3d)" pointer-events="none"/>'
        + '  </g>'
        + facets
        + '  <path d="' + sh.clipD + '" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="1.4" pointer-events="none"/>'
        + '  <path d="' + sh.d + '" fill="url(#shape-glass-sheen)" stroke="rgba(225,220,255,0.84)" stroke-width="3.2" stroke-linejoin="round" pointer-events="none"/>'
        + '  <path d="' + sh.specD + '" fill="url(#shape-spec-grad)" pointer-events="none"/>'
        + '  <path d="' + sh.specR + '" fill="rgba(255,255,255,0.18)" pointer-events="none"/>'
        + '  <ellipse cx="' + mouthCx + '" cy="18" rx="18" ry="3.6" fill="rgba(255,255,255,0.20)" stroke="rgba(240,235,255,0.82)" stroke-width="1.6" pointer-events="none"/>'
        + '</svg>';
    }

    function build() {
      hist = []; undos = 5; adds = 2; sel = null; busy = false;
      const lv = curLv();
      if (mode === 'shape') {
        const g = genShape(lv);
        B = g.b; cov = g.cv; shapeState = g.shape;
        $('lv').textContent = 'Level ' + lv;
        $('df').textContent = shapeState.name + (B.length >= 25 ? ' (25 Bottles)' : '');
      } else {
        shapeState = null;
        const g = gen(lv);
        B = g.b; cov = g.cv;
        $('lv').textContent = 'Level ' + lv;
        $('df').textContent = label(lv);
      }
      render();
    }
    function makeBottleEl(i) {
      const e = document.createElement('div'); e.className = 'bottle'; e.tabIndex = 0; e.setAttribute('role', 'button');
      e.innerHTML = '<div class="liq">' + '<div class="s"></div>'.repeat(CAP) + '</div><div class="cork"></div><div class="cloth">🔒</div>';
      e.onclick = () => tap(i); e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tap(i) } };
      return e;
    }
    function render() {
      const n = B.length;
      const bd = $('board');
      bd.innerHTML = ''; els = [];
      { const s = $('stream'); s.getAnimations().forEach(x => x.cancel()); s.style.display = 'none'; }
      const aw = Math.max(240, bd.clientWidth - 16);
      const ah = Math.max(240, bd.clientHeight - (n >= 15 ? 32 : 70));
      const root = document.documentElement.style;
      if (mode === 'shape' && shapeState) {
        bd.classList.remove('board-dense');
        bd.classList.add('board-shape');
        const sideCount = n >= 4 ? 2 : 0;
        const rem = n - sideCount;
        const topN = Math.ceil(rem / 2);
        const botN = rem - topN;
        const topRows = topN === 0 ? 0 : (topN <= 5 ? 1 : Math.ceil(topN / 6));
        const botRows = botN === 0 ? 0 : (botN <= 5 ? 1 : Math.ceil(botN / 6));
        const perTop = topRows ? Math.ceil(topN / topRows) : 0;
        const perBot = botRows ? Math.ceil(botN / botRows) : 0;
        const totalBRows = Math.max(2, topRows + botRows);
        const maxPerRow = Math.max(perTop, perBot, 3);
        const bwByRow = (aw / (maxPerRow + 0.46 * (maxPerRow - 1))) * 0.88;
        const shapeSize = totalBRows >= 3
          ? Math.min(168, Math.max(114, Math.min(aw * 0.46, ah * 0.31)))
          : Math.min(200, Math.max(142, Math.min(aw * 0.54, ah * 0.44)));
        const bwByMid = sideCount ? (aw - shapeSize - 32) / 2.3 : bwByRow;
        let bw = Math.min(totalBRows >= 3 ? 33 : 36, bwByRow, bwByMid);
        const bhMax = (ah - shapeSize * 1.05 - (totalBRows + 1) * 12) / totalBRows;
        let bh = Math.min(bhMax, bw * 2.55, totalBRows >= 3 ? 80 : 94);
        if (bh < 42) {
          bh = Math.max(36, bhMax);
          bw = Math.min(bw, bh / 2.2);
        }
        root.setProperty('--bw', bw + 'px');
        root.setProperty('--bh', bh + 'px');
        root.setProperty('--sw', shapeSize + 'px');
        root.setProperty('--sh', (shapeSize * 1.05) + 'px');
        root.setProperty('--scol', COL[shapeState.color]);

        let row;
        for (let i = 0; i < topN; i++) {
          if (i % perTop === 0) { row = document.createElement('div'); row.className = 'row'; bd.appendChild(row); }
          const e = makeBottleEl(i); row.appendChild(e); els[i] = e;
        }

        const midRow = document.createElement('div'); midRow.className = 'shape-mid-row';
        if (sideCount) {
          const leftEl = makeBottleEl(topN); midRow.appendChild(leftEl); els[topN] = leftEl;
        }
        const shDef = SHAPES.find(s => s.id === shapeState.id) || SHAPES[0];
        root.setProperty('--smx', ((shDef.mouthX || 0.5) * 100) + '%');
        const shWrap = document.createElement('div');
        shWrap.id = 'shape-wrap';
        shWrap.className = 'shape-wrap';
        shWrap.tabIndex = 0;
        shWrap.setAttribute('role', 'button');
        shWrap.setAttribute('aria-label', shapeState.name + ' target container');
        shWrap.innerHTML = buildShapeHtml(shDef, COL[shapeState.color]);
        shWrap.onclick = tapShape;
        shWrap.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tapShape() } };
        midRow.appendChild(shWrap);
        if (sideCount) {
          const rightEl = makeBottleEl(topN + 1); midRow.appendChild(rightEl); els[topN + 1] = rightEl;
        }
        bd.appendChild(midRow);

        for (let j = 0; j < botN; j++) {
          const i = topN + sideCount + j;
          if (j % perBot === 0) { row = document.createElement('div'); row.className = 'row'; bd.appendChild(row); }
          const e = makeBottleEl(i); row.appendChild(e); els[i] = e;
        }
      } else {
        bd.classList.remove('board-shape');
        bd.classList.toggle('board-dense', n >= 15);
        const rows = n <= 5 ? 1 : (n <= 14 ? 2 : (n <= 21 ? 3 : 4));
        const perRow = n <= 5 ? n : Math.ceil(n / rows);
        const gapRatio = 0.46;
        const bwMax = Math.min(52, aw / (perRow + gapRatio * (perRow - 1)));
        const bhMax = ah / (rows + .32 * (rows - 1));
        let bw = Math.min(bwMax, bhMax / 2.65);
        let bh = Math.min(bhMax, bw * 2.65);
        if (bh < 48) {
          bh = Math.max(44, bhMax);
          bw = Math.min(bwMax, bh / 2.5);
        }
        root.setProperty('--bw', bw + 'px'); root.setProperty('--bh', bh + 'px');
        let row;
        B.forEach((_, i) => {
          if (i % perRow === 0) { row = document.createElement('div'); row.className = 'row'; bd.appendChild(row) }
          const e = makeBottleEl(i);
          row.appendChild(e); els.push(e);
        });
      }
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
      if (mode === 'shape' && shapeState) {
        const shDef = SHAPES.find(s => s.id === shapeState.id) || SHAPES[0];
        const frac = Math.min(1, shapeState.units / shapeState.cap);
        const offsetY = (1 - frac) * (shDef.yMax - shDef.yMin);
        const liqEl = $('shape-liq-wrap');
        if (liqEl) liqEl.style.transform = 'translateY(' + offsetY.toFixed(2) + 'px)';
        const fishEl = $('shape-fish');
        if (fishEl) {
          const liqTopY = shDef.yMin + offsetY;
          let fx = 144, fy = Math.min(176, liqTopY + 11);
          if (liqTopY <= 128) {
            fx = 90;
            fy = Math.max(76, Math.min(126, liqTopY + 12));
          }
          fishEl.style.transform = 'translate(' + fx + 'px,' + fy.toFixed(1) + 'px)';
        }
        const shWrap = $('shape-wrap');
        if (shWrap) {
          if (skipBottleIdx !== -2) {
            shWrap.classList.toggle('done', shapeState.units >= shapeState.cap);
          }
          shWrap.classList.toggle('ready', skipBottleIdx !== -2 && sel !== null && canPourToShape(sel));
        }
        const shapeDone = Math.max(0, shapeState.units - shapeState.initUnits);
        const shapeNeed = Math.max(1, shapeState.cap - shapeState.initUnits);
        const totalGoal = shapeNeed + shapeState.other * CAP;
        const doneOtherUnits = B.filter(b => full(b) && b[0].c !== shapeState.color).length * CAP;
        const pct = Math.min(100, Math.round(((shapeDone + doneOtherUnits) / totalGoal) * 100));
        if ($('lvl-prog-fill')) $('lvl-prog-fill').style.width = pct + '%';
        if ($('lvl-prog-txt')) $('lvl-prog-txt').textContent = pct + '%';
      } else {
        const totalColors = Math.max(1, params(L).colors);
        const doneColors = B.filter(full).length;
        const pct = Math.min(100, Math.round((doneColors / totalColors) * 100));
        if ($('lvl-prog-fill')) $('lvl-prog-fill').style.width = pct + '%';
        if ($('lvl-prog-txt')) $('lvl-prog-txt').textContent = pct + '%';
      }
    }
    const canPour = (a, b) => a !== b && B[a].length && B[b].length < CAP && !cov[a] && !cov[b] && (!B[b].length || B[b][B[b].length - 1].c === B[a][B[a].length - 1].c);
    const canPourToShape = a => mode === 'shape' && shapeState && a !== null && a >= 0 && B[a] && B[a].length && !cov[a] && B[a][B[a].length - 1].c === shapeState.color && shapeState.units < shapeState.cap;
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
      for (let a = 0; a < B.length; a++) {
        if (canPourToShape(a)) return true;
        for (let b = 0; b < B.length; b++)
          if (canPour(a, b) && !(B[b].length === 0 && B[a].every(u => u.c === B[a][0].c))) return true;
      }
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

    function tapShape() {
      if (busy || mode !== 'shape' || !shapeState) return;
      if (sel === null) {
        sfxTap(520);
        toast('Select a bottle with the matching color to fill the ' + shapeState.name + '!');
        return;
      }
      if (canPourToShape(sel)) {
        pourToShape(sel);
        return;
      }
      const shWrap = $('shape-wrap');
      if (shWrap) { shWrap.classList.remove('shake'); void shWrap.offsetWidth; shWrap.classList.add('shake'); }
      sfxTap(240);
      toast('Only the matching color can fill this ' + shapeState.name + '!');
    }

    async function pourToShape(a) {
      busy = true;
      hist.push({ B: JSON.parse(JSON.stringify(B)), cov: cov.slice(), shapeUnits: shapeState.units });
      const shDef = SHAPES.find(s => s.id === shapeState.id) || SHAPES[0];
      const ea = els[a], shEl = $('shape-wrap'), ra = ea.getBoundingClientRect(), rb = shEl.getBoundingClientRect();
      const ah = ra.height, aw = ra.width;
      const bcx = rb.left + rb.width * (shDef.mouthX || 0.5);
      const side = bcx - .5 * ah > 8 ? -1 : 1;
      const c = shapeState.color, color = COL[c];
      let n = 0; while (n < B[a].length && B[a][B[a].length - 1 - n].c === c && !B[a][B[a].length - 1 - n].h && shapeState.units + n < shapeState.cap) n++;
      const acx = ra.left + ra.width / 2, acy = ra.top + ra.height / 2 + 16, R = t => t * Math.PI / 180;
      const mouthY = rb.top + rb.height * (shDef.mouthY || 0.085);
      const myf = t => mouthY - 12 - ah * Math.cos(R(t)) - (aw / 2) * Math.sin(R(t)), py = t => myf(t) + .5 * ah * Math.cos(R(t)) - acy;
      const pose = t => 'translate(' + (bcx + side * .5 * ah * Math.sin(R(t)) - acx) + 'px,' + py(t) + 'px) rotate(' + (-side * t) + 'deg)';
      const mv = 750 * SP, pd = (950 + n * 300) * SP, rt = 650 * SP, T = mv + pd + rt, E = 'cubic-bezier(.45,0,.2,1)';
      sel = null; ea.classList.remove('sel'); ea.style.transition = 'none'; ea.style.zIndex = 20;
      shEl.classList.remove('ready');
      const st = $('stream'); st.getAnimations().forEach(x => x.cancel());
      const surf = shDef.id === 'pipe'
        ? (mouthY + Math.max(16, rb.height * 0.14))
        : (rb.top + rb.height * (0.89 - ((shapeState.units + n / 2) / shapeState.cap) * 0.70));
      const m0 = myf(52), m1 = myf(88);
      st.style.cssText = 'background:' + color + ';left:' + (bcx - 3.5) + 'px;top:' + m0 + 'px;height:' + Math.max(8, surf - m0) + 'px';
      const flowEl = $('shape-pipe-flow'), coreEl = $('shape-pipe-flow-core');
      const flowLen = (flowEl && flowEl.getTotalLength) ? flowEl.getTotalLength() : 240;
      if (flowEl) { flowEl.getAnimations().forEach(x => x.cancel()); flowEl.style.strokeDasharray = flowLen; flowEl.style.strokeDashoffset = flowLen; flowEl.style.opacity = '0'; }
      if (coreEl) { coreEl.getAnimations().forEach(x => x.cancel()); coreEl.style.strokeDasharray = flowLen; coreEl.style.strokeDashoffset = flowLen; coreEl.style.opacity = '0'; }
      document.documentElement.style.setProperty('--d', (pd * .8) + 'ms');
      const wy = Math.min(py(52), -28);
      ea.animate([{ transform: 'translateY(-16px)', easing: E }, { transform: 'translate(0px,' + wy + 'px)', offset: .45 * mv / T, easing: E }, { transform: pose(52), offset: mv / T, easing: 'linear' }, { transform: pose(70), offset: (mv + pd * .45) / T, easing: 'linear' }, { transform: pose(88), offset: (mv + pd) / T, easing: E }, { transform: 'translate(0px,' + wy + 'px)', offset: (mv + pd + rt * .5) / T, easing: E }, { transform: 'none' }], { duration: T });
      await sleep(mv - 60);
      st.style.display = 'block';
      st.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], { duration: 180, easing: 'ease-in', fill: 'forwards' });
      st.animate([{ top: m0 + 'px', height: Math.max(8, surf - m0) + 'px' }, { top: m1 + 'px', height: Math.max(8, surf - m1) + 'px' }], { duration: pd * .8, delay: 60, easing: 'linear', fill: 'both' });
      const flowInDur = Math.min(280, Math.max(160, pd * 0.42));
      if (flowEl) { flowEl.style.opacity = '0.96'; flowEl.animate([{ strokeDashoffset: flowLen }, { strokeDashoffset: 0 }], { duration: flowInDur, easing: 'ease-in', fill: 'forwards' }); }
      if (coreEl) { coreEl.style.opacity = '0.55'; coreEl.animate([{ strokeDashoffset: flowLen }, { strokeDashoffset: 0 }], { duration: flowInDur, easing: 'ease-in', fill: 'forwards' }); }

      sfxPour((pd * .8) / 1000, Math.min(4, shapeState.units));
      await sleep(120);
      for (let k = 0; k < n; k++) B[a].pop();
      shapeState.units += n;
      sync(-2);
      await sleep(pd * .8 - 100);
      st.animate([{ clipPath: 'inset(0)' }, { clipPath: 'inset(100% 0 0 0)' }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
      if (flowEl) flowEl.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -flowLen }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
      if (coreEl) coreEl.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -flowLen }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
      await sleep(T - (mv + 60 + pd * .8 - 100) + 30);
      ea.style.transition = ''; ea.style.zIndex = '';
      st.getAnimations().forEach(x => x.cancel()); st.style.display = 'none';
      if (flowEl) { flowEl.getAnimations().forEach(x => x.cancel()); flowEl.style.opacity = '0'; }
      if (coreEl) { coreEl.getAnimations().forEach(x => x.cancel()); coreEl.style.opacity = '0'; }

      const shapeJustFilled = shapeState.units >= shapeState.cap;
      if (shapeJustFilled) sfxCork();
      if (isGameWon()) {
        sync();
        return win();
      }
      busy = false;
      let added = false;
      if (!hasMove() && adds > 0) {
        addBottle();
        added = true;
      }
      sync();
      if (added) { toast('No moves left, added an extra bottle!'); sfxDrop(420, 0.06) }
      else if (shapeJustFilled) { toast(shapeState.name + ' filled! Now complete the bottles.'); }
      if (!hasMove()) toast('No moves left. Undo or restart level.');
    }

    async function pour(a, b) {
      busy = true;
      hist.push({ B: JSON.parse(JSON.stringify(B)), cov: cov.slice(), shapeUnits: shapeState ? shapeState.units : 0 });
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
      const opened = unlockCheck();
      if (isGameWon()) {
        sync();
        return win();
      }
      busy = false;
      let added = false;
      if (!hasMove() && adds > 0) {
        addBottle();
        added = true;
      }
      sync();
      if (added) { toast('No moves left, added an extra bottle!'); sfxDrop(420, 0.06) }
      else if (opened) { toast('Bottle unlocked'); sfxDrop(680, 0.06) }
      else if (mode === 'shape' && shapeState && solved(B) && shapeState.units < shapeState.cap) {
        toast('Now pour the matching color into the ' + shapeState.name + '!');
      }
      if (!hasMove()) toast('No moves left. Undo or restart level.');
    }

    function undo() {
      if (busy || !hist.length || !undos) return;
      const h = hist.pop(); B = h.B; cov = h.cov;
      if (mode === 'shape' && shapeState && h.shapeUnits !== undefined) shapeState.units = h.shapeUnits;
      undos--; sel = null;
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
      const burst = (x, y, n) => { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.6, v = 6.5 + Math.random() * 8.5; P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 5 + Math.random() * 5, h: 3 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .38, c: COL[Math.floor(Math.random() * COL.length)], life: 0 }) } };
      burst(W * .16, H * .84, 40); burst(W * .84, H * .84, 40);
      setTimeout(() => burst(W * .5, H * .64, 25), 300);
      let last = performance.now();
      (function f(t) {
        const dt = Math.min(2, (t - last) / 16.7); last = t; c.clearRect(0, 0, W, H);
        for (const p of P) {
          p.vy += .27 * dt; p.vx *= .992; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.life += dt;
          c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.globalAlpha = Math.max(0, 1 - p.life / 125); c.fillStyle = p.c; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore()
        }
        if (performance.now() - t0 < 360 || P.some(p => p.life < 125 && p.y < H + 40)) requestAnimationFrame(f); else cv.remove();
      })(last);
      var t0 = performance.now();
    }
    async function win() {
      const winLevel = curLv(), winMode = mode;
      confetti();
      busy = true; sfxWin();
      setLv(winLevel + 1);
      if ($('win-lvl-text')) $('win-lvl-text').textContent = 'Level ' + winLevel + ' Cleared!';
      if ($('win-moves')) $('win-moves').textContent = hist.length;
      if (winMode === 'shape' && shapeState) {
        if ($('win-stat-2-lbl')) $('win-stat-2-lbl').textContent = 'Shape';
        if ($('win-bottles')) $('win-bottles').textContent = shapeState.name;
        const nextShape = SHAPES[winLevel % SHAPES.length].name;
        $('wm').textContent = 'Next: Fill ' + nextShape + ' on Level ' + (winLevel + 1);
      } else {
        if ($('win-stat-2-lbl')) $('win-stat-2-lbl').textContent = 'Bottles';
        if ($('win-bottles')) $('win-bottles').textContent = params(winLevel).colors;
        $('wm').textContent = label(winLevel + 1) == label(winLevel) ? 'Level ' + (winLevel + 1) + ' is waiting for you' : 'Unlocking ' + label(winLevel + 1).toLowerCase() + ' mode on Level ' + (winLevel + 1);
      }
      await sleep(400);
      $('win').classList.add('on');
      if (auto) {
        await sleep(2200);
        if (auto && mode === winMode && $('win').classList.contains('on')) {
          $('win').classList.remove('on');
          build();
        }
      }
    }
    $('nx').onclick = () => { $('win').classList.remove('on'); build() };
    $('win-replay').onclick = () => { $('win').classList.remove('on'); setLv(Math.max(1, curLv() - 1)); build() };
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
          if (isGameWon() || busy) { await sleep(100); continue }
          const path = mode === 'shape' ? solveShape(B, shapeState) : solve(B, cov);
          if (!path) {
            if (adds) { addBottle(); await sleep(500); continue }
            toast('Auto could not solve this one, skipping'); advanceLv(); build(); await sleep(700); continue;
          }
          const curM = mode, curLVal = curLv();
          for (const [a, b] of path) {
            if (!auto || mode !== curM || curLv() !== curLVal) break;
            while (busy && !isGameWon()) await sleep(40);
            if (!auto || mode !== curM || curLv() !== curLVal || isGameWon()) break;
            sel = null;
            if (b === 'shape') pourToShape(a);
            else pour(a, b);
            while (busy) await sleep(40);
            await sleep(80);
          }
        }
      } finally { running = false }
    }
    $('au').onclick = function () {
      auto = !auto; this.classList.toggle('on', auto); SP = auto ? 1.15 : 1.42;
      if (auto) { sel = null; sync(); run() }
    };
    let lvinEdited = false;
    $('lvin').oninput = () => { lvinEdited = true; };
    function selectMode(nextMode) {
      mode = nextMode === 'shape' ? 'shape' : 'classic';
      try { localStorage.setItem('ws_mode', mode) } catch (e) { }
      $('m-classic').classList.toggle('on', mode === 'classic');
      $('m-shape').classList.toggle('on', mode === 'shape');
      if (!lvinEdited) $('lvin').value = curLv();
    }
    $('m-classic').onclick = () => selectMode('classic');
    $('m-shape').onclick = () => selectMode('shape');
    function openStart() {
      auto = false; $('au').classList.remove('on'); SP = 1.42;
      lvinEdited = false;
      selectMode(mode);
      $('st').classList.remove('off');
      setTimeout(() => { $('lvin').focus(); $('lvin').select() }, 50);
    }
    function startGame() {
      const v = Math.floor(Number($('lvin').value));
      setLv(v);
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

      function createAuroraSprite(hue, sat, light, alpha) {
        const sc = document.createElement('canvas');
        const sz = 128;
        sc.width = sz;
        sc.height = sz;
        const sctx = sc.getContext('2d');
        const c = sz / 2;
        const g = sctx.createRadialGradient(c, c, 0, c, c, c);
        g.addColorStop(0, 'hsla(' + hue + ',' + sat + '%,' + light + '%,' + alpha + ')');
        g.addColorStop(0.45, 'hsla(' + hue + ',' + sat + '%,' + light + '%,' + (alpha * 0.45) + ')');
        g.addColorStop(1, 'hsla(' + hue + ',' + sat + '%,' + light + '%,0)');
        sctx.fillStyle = g;
        sctx.fillRect(0, 0, sz, sz);
        return sc;
      }

      const auroraAqua = createAuroraSprite(196, 94, 56, 0.20);
      const auroraIndigo = createAuroraSprite(258, 88, 62, 0.28);
      const auroraBlue = createAuroraSprite(222, 92, 58, 0.26);

      let waveGradA = null, waveGradB = null;
      function updateWaveGrads() {
        waveGradA = ctx.createLinearGradient(0, H * 0.25, 0, H);
        waveGradA.addColorStop(0, 'rgba(56, 189, 248, 0.13)');
        waveGradA.addColorStop(0.55, 'rgba(99, 102, 241, 0.08)');
        waveGradA.addColorStop(1, 'rgba(8, 12, 36, 0.02)');

        waveGradB = ctx.createLinearGradient(0, H * 0.45, 0, H);
        waveGradB.addColorStop(0, 'rgba(139, 92, 246, 0.14)');
        waveGradB.addColorStop(0.6, 'rgba(59, 130, 246, 0.08)');
        waveGradB.addColorStop(1, 'rgba(6, 9, 30, 0.02)');
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        W = window.innerWidth;
        H = window.innerHeight;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        updateWaveGrads();
      }
      resize();
      window.addEventListener('resize', resize);

      const isMobile = ('ontouchstart' in window) || (window.innerWidth < 600);
      const BUBBLE_COUNT = isMobile ? 22 : 34;
      const MOTE_COUNT = isMobile ? 16 : 26;
      const bubbles = [];
      const motes = [];
      const ripples = [];

      for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubbles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 4 + Math.random() * 13,
          speed: 0.4 + Math.random() * 0.85,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.025,
          wobbleAmp: 0.35 + Math.random() * 0.6,
          alpha: 0.28 + Math.random() * 0.45,
          sprite: Math.random() < 0.6 ? spriteCyan : spriteViolet
        });
      }

      for (let i = 0; i < MOTE_COUNT; i++) {
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.15 - Math.random() * 0.3,
          r: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.025 + Math.random() * 0.03
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

      function drawWave(baseY, amp, freq, phase, grad) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        const step = Math.max(24, Math.ceil(W / 18));
        for (let x = 0; x <= W + step; x += step) {
          const cx = Math.min(x, W);
          const y = baseY + Math.sin(cx * freq + phase) * amp + Math.cos(cx * freq * 0.6 - phase * 0.7) * (amp * 0.45);
          ctx.lineTo(cx, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      function loop(now) {
        const t = (now || performance.now()) * 0.001;
        ctx.clearRect(0, 0, W, H);

        // Full-display drifting aurora gradient blobs
        const s1 = Math.max(W, H) * 0.9;
        const s2 = Math.max(W, H) * 0.85;
        const s3 = Math.max(W, H) * 0.8;
        ctx.drawImage(auroraIndigo, W * (0.5 + 0.34 * Math.sin(t * 0.42)) - s1 * 0.5, H * (0.35 + 0.28 * Math.cos(t * 0.31)) - s1 * 0.5, s1, s1);
        ctx.drawImage(auroraAqua, W * (0.48 + 0.36 * Math.cos(t * 0.36)) - s2 * 0.5, H * (0.62 + 0.28 * Math.sin(t * 0.47)) - s2 * 0.5, s2, s2);
        ctx.drawImage(auroraBlue, W * (0.52 + 0.32 * Math.sin(t * 0.29 + 2.1)) - s3 * 0.5, H * (0.5 + 0.32 * Math.cos(t * 0.38 + 1.2)) - s3 * 0.5, s3, s3);

        // Full-display flowing liquid gradient waves
        drawWave(H * 0.42, 28, 0.007, t * 0.9, waveGradA);
        drawWave(H * 0.68, 34, 0.0055, -t * 0.75 + 1.4, waveGradB);

        // Soft glowing motes across full screen
        for (let i = 0; i < motes.length; i++) {
          const m = motes[i];
          m.x += m.vx;
          m.y += m.vy;
          m.phase += m.speed;
          if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
          if (m.x < -10) m.x = W + 10;
          if (m.x > W + 10) m.x = -10;
          ctx.globalAlpha = 0.2 + 0.45 * (0.5 + 0.5 * Math.sin(m.phase));
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

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


