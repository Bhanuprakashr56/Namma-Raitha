import { ProjectData, ProjectFile } from '../types';
import { buildFileTree, computeLanguages, detectFileTypeAndLang } from './fileHelpers';

function createProjectFromFiles(name: string, rawFiles: Record<string, string>): ProjectData {
  const files: Record<string, ProjectFile> = {};
  const htmlEntryPoints: string[] = [];
  let totalLines = 0;
  let totalSize = 0;

  for (const [path, content] of Object.entries(rawFiles)) {
    const { type, language, isBinary, mimeType } = detectFileTypeAndLang(path);
    const lineCount = content.length > 0 ? content.split('\n').length : 0;
    const size = new Blob([content]).size;
    totalLines += lineCount;
    totalSize += size;

    const fileName = path.split('/').pop() || path;
    const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';

    if (type === 'html') {
      htmlEntryPoints.push(path);
    }

    files[path] = {
      path,
      name: fileName,
      extension: ext,
      content,
      isBinary,
      mimeType,
      size,
      type,
      language,
      lineCount,
    };
  }

  htmlEntryPoints.sort((a, b) => {
    if (a.toLowerCase().endsWith('index.html')) return -1;
    if (b.toLowerCase().endsWith('index.html')) return 1;
    return a.localeCompare(b);
  });

  return {
    id: `sample-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name,
    files,
    tree: buildFileTree(files),
    totalFiles: Object.keys(files).length,
    totalLines,
    totalSize,
    languages: computeLanguages(files),
    htmlEntryPoints,
    uploadedAt: Date.now(),
  };
}

export const SAMPLE_PROJECTS = {
  arcadeGame: () =>
    createProjectFromFiles('Neon Starship Arcade', {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neon Starship</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="arcade-container">
    <div class="hud">
      <div class="brand">
        <span class="icon">🚀</span>
        <h2>NEON STARSHIP</h2>
      </div>
      <div class="stats">
        <div class="stat-box">SCORE <span id="scoreVal">0</span></div>
        <div class="stat-box">SHIELDS <span id="shieldVal">100%</span></div>
        <div class="stat-box">WAVE <span id="waveVal">1</span></div>
      </div>
    </div>
    
    <div class="canvas-wrapper">
      <canvas id="gameCanvas" width="700" height="420"></canvas>
      <div id="startOverlay" class="overlay">
        <h3>CLICK OR PRESS SPACE TO LAUNCH</h3>
        <p>Controls: [A][D] or [Left][Right] to Move &bull; [Space] to Fire</p>
        <button id="startBtn">START MISSION</button>
      </div>
    </div>

    <div class="footer-info">
      <span>Interactive Live Preview &bull; Web Audio API Synthesizer &bull; 60fps Canvas</span>
    </div>
  </div>
  <script src="game.js"></script>
</body>
</html>`,

      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%);
  color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}
.arcade-container {
  width: 100%;
  max-width: 740px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 35px rgba(56, 189, 248, 0.2);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
}
.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand h2 {
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stats {
  display: flex;
  gap: 0.75rem;
}
.stat-box {
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
}
.stat-box span {
  color: #38bdf8;
  margin-left: 0.35rem;
  font-family: monospace;
  font-size: 0.9rem;
}
.canvas-wrapper {
  position: relative;
  background: #020617;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
canvas {
  display: block;
  width: 100%;
  height: auto;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  padding: 1rem;
}
.overlay h3 {
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  color: #e0f2fe;
}
.overlay p {
  color: #94a3b8;
  font-size: 0.85rem;
}
#startBtn {
  background: linear-gradient(135deg, #0284c7, #6366f1);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}
#startBtn:hover {
  transform: scale(1.04);
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
}
.footer-info {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.7rem;
  color: #64748b;
}`,

      'game.js': `// Neon Starship Game Engine
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreVal');
const shieldEl = document.getElementById('shieldVal');
const waveEl = document.getElementById('waveVal');
const overlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');

let audioCtx = null;
function playSound(freq, type = 'square', dur = 0.08) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}

const state = {
  running: false,
  score: 0,
  shields: 100,
  wave: 1,
  player: { x: 350, y: 380, width: 34, height: 26, speed: 7 },
  lasers: [],
  enemies: [],
  particles: [],
  stars: Array.from({ length: 65 }, () => ({
    x: Math.random() * 700,
    y: Math.random() * 420,
    speed: 0.5 + Math.random() * 1.5,
    size: Math.random() * 2
  })),
  keys: {}
};

window.addEventListener('keydown', (e) => {
  state.keys[e.code] = true;
  if (e.code === 'Space') {
    if (!state.running) startGame();
    else shootLaser();
  }
});
window.addEventListener('keyup', (e) => { state.keys[e.code] = false; });

startBtn.addEventListener('click', startGame);

function startGame() {
  state.running = true;
  state.score = 0;
  state.shields = 100;
  state.wave = 1;
  state.enemies = [];
  state.lasers = [];
  overlay.style.display = 'none';
  spawnWave();
  playSound(440, 'triangle', 0.2);
}

function spawnWave() {
  for (let i = 0; i < 5 + state.wave * 2; i++) {
    state.enemies.push({
      x: 40 + Math.random() * 620,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: 1.2 + Math.random() * 1.4,
      size: 16 + Math.random() * 8,
      hp: 1
    });
  }
}

function shootLaser() {
  state.lasers.push({
    x: state.player.x,
    y: state.player.y - 12,
    vy: -10
  });
  playSound(880, 'sawtooth', 0.05);
}

function addExplosion(x, y, color = '#38bdf8') {
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color
    });
  }
}

function update() {
  if (!state.running) return;

  if (state.keys['ArrowLeft'] || state.keys['KeyA']) state.player.x -= state.player.speed;
  if (state.keys['ArrowRight'] || state.keys['KeyD']) state.player.x += state.player.speed;
  state.player.x = Math.max(20, Math.min(680, state.player.x));

  // Lasers
  for (let i = state.lasers.length - 1; i >= 0; i--) {
    const l = state.lasers[i];
    l.y += l.vy;
    if (l.y < -10) state.lasers.splice(i, 1);
  }

  // Enemies
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    e.x += e.vx;
    e.y += e.vy;
    if (e.x < 20 || e.x > 680) e.vx *= -1;

    // Laser hit
    for (let j = state.lasers.length - 1; j >= 0; j--) {
      const l = state.lasers[j];
      const dist = Math.hypot(e.x - l.x, e.y - l.y);
      if (dist < e.size) {
        addExplosion(e.x, e.y, '#f43f5e');
        playSound(220, 'square', 0.1);
        state.score += 100;
        state.enemies.splice(i, 1);
        state.lasers.splice(j, 1);
        break;
      }
    }

    // Player collision
    if (Math.hypot(e.x - state.player.x, e.y - state.player.y) < e.size + 15) {
      addExplosion(e.x, e.y, '#f59e0b');
      playSound(120, 'sawtooth', 0.25);
      state.shields -= 20;
      state.enemies.splice(i, 1);
      if (state.shields <= 0) {
        gameOver();
      }
    }

    if (e.y > 440) state.enemies.splice(i, 1);
  }

  if (state.enemies.length === 0) {
    state.wave++;
    waveEl.innerText = state.wave;
    spawnWave();
  }

  // Particles
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.04;
    if (p.life <= 0) state.particles.splice(i, 1);
  }

  scoreEl.innerText = state.score;
  shieldEl.innerText = Math.max(0, state.shields) + '%';
}

function gameOver() {
  state.running = false;
  overlay.style.display = 'flex';
  overlay.querySelector('h3').innerText = 'MISSION FAILED - SCORE: ' + state.score;
}

function render() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 700, 420);

  // Background stars
  ctx.fillStyle = '#64748b';
  for (const s of state.stars) {
    s.y += s.speed;
    if (s.y > 420) s.y = 0;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }

  // Draw player starship
  ctx.save();
  ctx.translate(state.player.x, state.player.y);
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(15, 12);
  ctx.lineTo(0, 7);
  ctx.lineTo(-15, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Lasers
  ctx.fillStyle = '#38bdf8';
  for (const l of state.lasers) {
    ctx.fillRect(l.x - 2, l.y, 4, 12);
  }

  // Enemies
  ctx.fillStyle = '#f43f5e';
  for (const e of state.enemies) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Particles
  for (const p of state.particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x, p.y, 3, 3);
  }
  ctx.globalAlpha = 1.0;

  update();
  requestAnimationFrame(render);
}

render();
`,

      'README.md': `# 🚀 Neon Starship Arcade

A fast-paced retro space arcade experience built with Vanilla HTML5 Canvas and the Web Audio API.

## 🎮 How to Play
- **A / D** or **Arrow Left / Right**: Steer starship
- **Spacebar**: Fire photon blast
- **Objective**: Neutralize incoming neon probes, protect shields, and survive high-intensity waves!

## ⚡ Technical Highlights
- 60 FPS zero-dependency Canvas rendering loop
- Procedural audio synthesis without external MP3 files
- Real-time particle physics and collision detection
- Fully responsive responsive viewport layout
`,

      'package.json': `{
  "name": "neon-starship",
  "version": "1.0.0",
  "description": "Retro space arcade game built with HTML5 Canvas",
  "main": "game.js",
  "scripts": {
    "start": "serve ."
  },
  "keywords": ["arcade", "canvas", "game", "audio-synthesis"],
  "author": "Code Studio",
  "license": "MIT"
}`
    }),

  saasDashboard: () =>
    createProjectFromFiles('SaaS Analytics Hub', {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pulse Metrics - Analytics Studio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">
    <nav class="sidebar">
      <div class="logo">⚡ PulseMetrics</div>
      <ul class="nav-links">
        <li class="active">Overview</li>
        <li>Customers</li>
        <li>Conversions</li>
        <li>Settings</li>
      </ul>
      <div class="user-pill">
        <div class="avatar">BP</div>
        <div>
          <strong>Bhanu Prakash</strong>
          <small>Pro Admin</small>
        </div>
      </div>
    </nav>
    <main class="content">
      <header class="topbar">
        <h1>Executive Dashboard</h1>
        <button id="refreshBtn" class="primary-btn">Live Sync</button>
      </header>
      <div class="grid">
        <div class="card stat">
          <span>Monthly Recurring Revenue</span>
          <h2 id="mrrVal">$48,250</h2>
          <span class="positive">+18.4% from last month</span>
        </div>
        <div class="card stat">
          <span>Active Subscriptions</span>
          <h2>1,842</h2>
          <span class="positive">+12% retention</span>
        </div>
        <div class="card stat">
          <span>Avg. Response Time</span>
          <h2>24ms</h2>
          <span class="positive">99.98% SLA</span>
        </div>
      </div>
      <div class="card chart-card">
        <h3>Live Traffic Volume (Last 12 Hours)</h3>
        <div id="chartContainer" class="chart-bars"></div>
      </div>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>`,

      'style.css': `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  min-height: 100vh;
}
.app {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  background: #0f172a;
  color: #f8fafc;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.logo {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #38bdf8;
}
.nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.nav-links li {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.9rem;
}
.nav-links li.active, .nav-links li:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.user-pill {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #334155;
  font-size: 0.85rem;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #38bdf8;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.content {
  flex: 1;
  padding: 2rem;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.primary-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}
.stat span {
  font-size: 0.85rem;
  color: #64748b;
}
.stat h2 {
  font-size: 1.8rem;
  margin: 0.4rem 0;
  color: #0f172a;
}
.positive {
  color: #10b981 !important;
  font-weight: 600;
}
.chart-card h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  height: 180px;
  gap: 12px;
  padding-top: 1rem;
  border-bottom: 1px solid #e2e8f0;
}
.bar {
  flex: 1;
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
  position: relative;
}
.bar:hover {
  filter: brightness(1.1);
}`,

      'app.js': `const chartContainer = document.getElementById('chartContainer');
const refreshBtn = document.getElementById('refreshBtn');

function generateBars() {
  chartContainer.innerHTML = '';
  const hours = ['1AM', '3AM', '5AM', '7AM', '9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM', '11PM'];
  
  hours.forEach(hour => {
    const height = Math.floor(30 + Math.random() * 120);
    const col = document.createElement('div');
    col.className = 'bar';
    col.style.height = height + 'px';
    col.title = hour + ': ' + height * 14 + ' visitors';
    chartContainer.appendChild(col);
  });
}

refreshBtn.addEventListener('click', () => {
  generateBars();
  const mrr = 45000 + Math.floor(Math.random() * 8000);
  document.getElementById('mrrVal').innerText = '$' + mrr.toLocaleString();
});

generateBars();
`,

      'data/metrics.json': `{
  "updated": "2026-09-30T12:00:00Z",
  "currency": "USD",
  "mrr": 48250,
  "churnRate": 0.012,
  "topRegions": [
    { "region": "North America", "share": 0.52 },
    { "region": "Europe", "share": 0.28 },
    { "region": "Asia-Pacific", "share": 0.20 }
  ]
}`,

      'scripts/aggregate.py': `"""
Data pipeline script for aggregating SaaS telemetry and reporting metrics.
"""
import json

def calculate_growth(previous: float, current: float) -> float:
    if previous == 0:
        return 0.0
    return round(((current - previous) / previous) * 100, 2)

def main():
    print("Executing analytics aggregation engine...")
    prev_mrr = 40750
    curr_mrr = 48250
    growth = calculate_growth(prev_mrr, curr_mrr)
    print(f"MRR Growth Rate: +{growth}%")

if __name__ == '__main__':
    main()
`
    }),

  reactComponents: () =>
    createProjectFromFiles('Design System Components', {
      'src/components/Button.tsx': `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} \${className}\`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-2">⏳</span>
      ) : null}
      {children}
    </button>
  );
};
`,
      'src/hooks/useLocalStorage.ts': `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
`,
      'README.md': `# 🎨 Modern UI Component Kit

A clean, strongly-typed React component collection written in TypeScript with Tailwind CSS tokens.

### Key Features
- Zero runtime overhead with modular imports
- Full accessibility (ARIA labels, keyboard focus rings)
- Comprehensive test coverage with Vitest and Testing Library
`,
      'package.json': `{
  "name": "@acme/design-system",
  "version": "1.4.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}`
    })
};
