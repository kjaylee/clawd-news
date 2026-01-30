---
title: "How I Built 40 HTML5 Games with Zero Frameworks"
published: false
description: "A deep dive into building 40 browser games using nothing but vanilla HTML, CSS, and JavaScript — no React, no Phaser, no game engine."
tags: javascript, gamedev, html5, webdev
cover_image: https://eastsea.monster/games/icons/og-cover.png
---

# How I Built 40 HTML5 Games with Zero Frameworks

I just shipped my 40th HTML5 browser game. Every single one is built with vanilla JavaScript, CSS, and the Canvas API. No React. No Phaser. No Unity WebGL export. No build tools.

Each game is a single `.html` file you can open in any browser.

Here's how I did it and what I learned.

## The Architecture: One File to Rule Them All

Every game follows the same structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
    <title>Game Name</title>
    <style>
        /* All CSS inline */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        // All game logic here — 500 to 2000 lines of vanilla JS
    </script>
</body>
</html>
```

That's it. No `node_modules/`. No `webpack.config.js`. No `package.json`. A single file you can email to someone and they can play it.

### Why single-file?

1. **Zero deployment friction.** Drop an HTML file on any static host. Done.
2. **Instant loading.** One HTTP request. 15-65KB total. Games load in under a second on 3G.
3. **View Source works.** Anyone can learn from the code. Right-click → View Source.
4. **No build step.** Edit, save, refresh. The dev loop is as fast as it gets.

## The Game Loop

Every game uses the same core loop pattern:

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;

    if (deltaTime >= FRAME_TIME) {
        update(deltaTime);
        render();
        lastTime = timestamp - (deltaTime % FRAME_TIME);
    }

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    // Game state updates
    // Physics, collision detection, AI, etc.
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw everything
}

requestAnimationFrame(gameLoop);
```

Delta-time based updates keep the game running at consistent speed regardless of frame rate. The modulo correction on `lastTime` prevents time drift.

## Responsive Canvas Scaling

One of the trickier problems: making Canvas games look good on everything from a 320px-wide phone to a 4K monitor.

```javascript
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const maxWidth = 480;  // Design width
    const maxHeight = 800; // Design height

    let width = Math.min(window.innerWidth, maxWidth);
    let height = Math.min(window.innerHeight, maxHeight);

    // Maintain aspect ratio
    const aspect = maxWidth / maxHeight;
    if (width / height > aspect) {
        width = height * aspect;
    } else {
        height = width / aspect;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

Key insight: Set the canvas CSS size to the logical size, but the actual canvas dimensions to `logicalSize * devicePixelRatio`. Then scale the context. This gives you crisp rendering on high-DPI displays.

## Unified Input Handling

Supporting mouse, touch, and keyboard in one system:

```javascript
const input = {
    x: 0, y: 0,
    isDown: false,
    justPressed: false,
    justReleased: false
};

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1)),
        y: (clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1))
    };
}

canvas.addEventListener('mousedown', (e) => {
    const pos = getPos(e);
    input.x = pos.x;
    input.y = pos.y;
    input.isDown = true;
    input.justPressed = true;
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const pos = getPos(e);
    input.x = pos.x;
    input.y = pos.y;
    input.isDown = true;
    input.justPressed = true;
}, { passive: false });

// Similar for move and end events...
```

The `passive: false` on touch events is crucial — without it, you can't `preventDefault()` to stop the browser from scrolling when the player swipes.

## Sound Without Files: Web Audio API

Most of my games generate sounds programmatically instead of loading audio files:

```javascript
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'square', volume = 0.3) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Usage:
playSound(440, 0.1, 'square');     // Click sound
playSound(880, 0.2, 'sine');       // Success chime
playSound(220, 0.3, 'sawtooth');   // Explosion
```

This keeps the file size tiny. A full set of game sounds adds maybe 2KB of code instead of 500KB of audio files.

## Collision Detection

For most 2D games, you need two types:

```javascript
// Circle-Circle (enemies, projectiles)
function circlesCollide(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = dx * dx + dy * dy;
    const radii = a.radius + b.radius;
    return dist < radii * radii;  // Avoid sqrt — compare squared distances
}

// AABB (rectangles, tiles)
function rectsCollide(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}
```

The squared-distance trick in circle collision avoids an expensive `Math.sqrt()` call every frame. Small optimization, but it matters when you're checking hundreds of collisions per frame in action games.

## Particle Systems

Particles add "juice" — the visual feedback that makes a game feel satisfying:

```javascript
const particles = [];

function spawnParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1,
            decay: 0.02 + Math.random() * 0.03,
            size: 2 + Math.random() * 4,
            color
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;  // Gravity
        p.life -= p.decay;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function renderParticles() {
    for (const p of particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}
```

Reverse iteration when removing elements avoids index-shifting bugs. The `globalAlpha = p.life` creates a natural fade-out effect.

## State Management

No Redux here. A simple state machine handles menus, gameplay, and game over:

```javascript
const State = { MENU: 0, PLAYING: 1, PAUSED: 2, GAME_OVER: 3 };
let gameState = State.MENU;

function update(dt) {
    switch (gameState) {
        case State.MENU:
            updateMenu();
            break;
        case State.PLAYING:
            updateGame(dt);
            break;
        case State.GAME_OVER:
            updateGameOver();
            break;
    }
}
```

Simple, readable, no overhead. State transitions happen on user input or game events.

## Save Data with LocalStorage

```javascript
function saveGame() {
    const data = { highScore, level, unlockedSkins };
    localStorage.setItem('crystal-match-save', JSON.stringify(data));
}

function loadGame() {
    try {
        const data = JSON.parse(localStorage.getItem('crystal-match-save'));
        if (data) {
            highScore = data.highScore || 0;
            level = data.level || 1;
            unlockedSkins = data.unlockedSkins || [];
        }
    } catch (e) {
        // Corrupted save data — start fresh
    }
}
```

The `try/catch` is important. LocalStorage can throw in private browsing mode on some browsers, and corrupted JSON shouldn't crash the game.

## Telegram Mini App Integration

Each game includes the Telegram Web App SDK for when it's played inside the Telegram client:

```javascript
// Load SDK
const tgScript = document.createElement('script');
tgScript.src = 'https://telegram.org/js/telegram-web-app.js';
document.head.appendChild(tgScript);

tgScript.onload = () => {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Use safe area insets
        document.documentElement.style.setProperty(
            '--safe-top',
            `${tg.safeAreaInset?.top || 0}px`
        );
    }
};
```

This gives access to Telegram's viewport, safe areas, and eventually Telegram Stars for monetization — all while the same HTML file works perfectly as a standalone web game.

## The Role of AI

I want to be honest about this. AI (Claude, specifically) helped significantly with:

- **Scaffolding:** Generating the boilerplate game loop, input handling, and responsive setup
- **Math functions:** Collision detection, easing functions, procedural generation algorithms
- **Boilerplate:** Touch event handling, audio context setup, viewport scaling
- **Debugging:** Identifying edge cases in game logic

AI did NOT handle:
- **Game design decisions** — what makes a game fun, the core mechanic, the difficulty curve
- **Game feel** — the "juice" (screen shake, particle timing, sound frequency choices)
- **Creative direction** — art style, color palettes, what emotions the game should evoke
- **Playtesting iteration** — adjusting based on how it actually feels to play

AI is a multiplier, not a replacement. It made me 5-10x faster at the tedious parts so I could spend more time on the creative parts.

## Performance Considerations

Some things I learned the hard way:

1. **Object pooling for particles/projectiles.** Creating and garbage-collecting hundreds of objects per frame kills performance on mobile.
2. **Avoid `ctx.save()` / `ctx.restore()` in tight loops.** Set properties directly.
3. **Use integer coordinates** when possible. Sub-pixel rendering is expensive.
4. **`requestAnimationFrame` > `setInterval`.** Always. For everything.
5. **Test on actual phones.** Chrome DevTools mobile simulation lies about real-world performance.

## Results

- **40 games** shipped and playable
- **15-65KB** per game (total file size)
- **< 1 second** load time on 3G
- **0 dependencies** across all games
- Works on **any modern browser** (Chrome, Firefox, Safari, Edge — mobile and desktop)

Play them all: **[eastsea.monster/games](https://eastsea.monster/games/)**

The source is readable — just View Source on any game. No minification, no obfuscation.

If you have questions about any specific technique or game, drop a comment. Happy to go deeper on anything.

---

*Built by a solo dev who believes the web is still the best game platform. 🎮*
