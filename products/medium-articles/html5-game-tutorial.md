# I Built a Browser Game in 30 Minutes — Here's Exactly How (No Frameworks Required)

> **Reading Time:** 6 min | **Tags:** JavaScript, HTML5, Game Development, Beginner

---

*Forget Unity. Forget Unreal. The most accessible game engine is already installed on every device — your web browser.*

---

![Hero Image: Browser window showing a simple game with colorful circles]
`[IMAGE PLACEHOLDER: Screenshot of the finished "Dodge Ball" game with glowing player and falling enemies]`

Last weekend, my 12-year-old nephew asked me to teach him game development. I could have pointed him to Unity tutorials. Instead, we opened a text editor, wrote 150 lines of JavaScript, and had a playable game running in his browser.

No downloads. No setup nightmares. Just code that works everywhere.

**Here's exactly what we built — and how you can do it too.**

---

## What You'll Build

A fast-paced "Dodge Ball" game where:
- You control a glowing player with arrow keys
- Red balls fall from the sky
- Survive as long as possible
- High scores save automatically

**[🎮 Play the finished game here →](https://eastsea.monster/games/)**

![Gameplay GIF showing player dodging falling balls]
`[IMAGE PLACEHOLDER: Animated GIF of actual gameplay]`

---

## The Only 3 Things You Need

1. A text editor (VS Code is free)
2. A web browser (you already have one)
3. Basic JavaScript knowledge (if you can write `console.log()`, you're ready)

That's it. No installations, no accounts, no BS.

---

## Step 1: The Canvas — Your Game's Screen

Every HTML5 game starts with a canvas element. Think of it as a blank piece of paper that JavaScript can draw on.

**Create `index.html`:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Game</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a2e;
            margin: 0;
        }
        canvas {
            border: 3px solid #4a4a6a;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script src="game.js"></script>
</body>
</html>
```

**Create `game.js`:**

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Draw a red square
ctx.fillStyle = '#ff6b6b';
ctx.fillRect(100, 100, 50, 50);

// Draw a blue circle
ctx.beginPath();
ctx.arc(200, 200, 30, 0, Math.PI * 2);
ctx.fillStyle = '#4ecdc4';
ctx.fill();
```

Open `index.html` in your browser. You should see a red square and a blue circle.

**You just drew graphics with code. That's game development.**

---

## Step 2: The Game Loop — Making Things Move

Static images aren't games. We need animation.

The secret? A function that runs 60 times per second, clearing and redrawing the screen each time.

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ballX = 100;
let ballY = 100;

function gameLoop() {
    // Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update position
    ballX += 2;
    if (ballX > canvas.width) ballX = 0; // Wrap around
    
    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#4ecdc4';
    ctx.fill();
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the loop
```

**Now you have animation.** The ball moves across the screen endlessly.

---

## Step 3: Player Controls — Keyboard Input

Games need input. Here's how to track which keys are pressed:

```javascript
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// In your game loop, check keys:
if (keys['ArrowLeft']) player.x -= 5;
if (keys['ArrowRight']) player.x += 5;
if (keys['ArrowUp']) player.y -= 5;
if (keys['ArrowDown']) player.y += 5;
```

**Pro tip:** Use WASD alongside arrow keys. Left-handed players will thank you.

---

## Step 4: Collision Detection — When Things Touch

The simplest collision detection checks if two circles overlap:

```javascript
function circleCollision(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < c1.radius + c2.radius;
}
```

If the distance between centers is less than the sum of radii, they're colliding.

**This is all you need for most 2D games.**

---

## Step 5: The Complete Game

Here's the full "Dodge Ball" game in ~100 lines:

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let score = 0;
let gameOver = false;

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    radius: 20,
    speed: 400,
    color: '#4ecdc4'
};

// Enemies
const enemies = [];

// Input
const keys = {};
document.addEventListener('keydown', e => { keys[e.code] = true; e.preventDefault(); });
document.addEventListener('keyup', e => keys[e.code] = false);
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && gameOver) restartGame();
});

function spawnEnemy() {
    enemies.push({
        x: Math.random() * canvas.width,
        y: -20,
        radius: Math.random() * 15 + 10,
        speed: Math.random() * 200 + 150,
        color: `hsl(${Math.random() * 60 + 330}, 70%, 60%)`
    });
}

function circleCollision(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    return Math.sqrt(dx*dx + dy*dy) < c1.radius + c2.radius;
}

let lastTime = 0;
function gameLoop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    
    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!gameOver) {
        score += dt * 10;
        
        // Player movement
        if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed * dt;
        if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed * dt;
        if (keys['ArrowUp'] || keys['KeyW']) player.y -= player.speed * dt;
        if (keys['ArrowDown'] || keys['KeyS']) player.y += player.speed * dt;
        
        // Boundaries
        player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
        
        // Spawn enemies
        if (Math.random() < 0.02) spawnEnemy();
        
        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed * dt;
            if (enemies[i].y > canvas.height + 50) enemies.splice(i, 1);
            else if (circleCollision(player, enemies[i])) gameOver = true;
        }
    }
    
    // Draw enemies
    enemies.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // UI
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);
    
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#ff6b6b';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        ctx.font = '24px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(`Score: ${Math.floor(score)} — Press SPACE`, canvas.width/2, canvas.height/2 + 50);
        ctx.textAlign = 'left';
    }
    
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    score = 0;
    gameOver = false;
    enemies.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
}

requestAnimationFrame(gameLoop);
```

**Copy this code. Open in browser. You have a game.**

---

## What's Next?

Once you've got this working, try adding:

- **Power-ups** — Shields, slow motion, score multipliers
- **Sound effects** — Use Web Audio API (5 lines of code)
- **Mobile support** — Add touch controls
- **Particles** — Explosions when you die

![Diagram showing the game architecture]
`[IMAGE PLACEHOLDER: Simple flowchart showing Game Loop → Update → Render → Repeat]`

---

## The Real Lesson

You don't need fancy engines to make games. HTML5 Canvas + JavaScript runs on:
- Every computer
- Every phone
- Every tablet

No app store approval. No downloads. Just share a URL.

**My nephew's game is now on his school website. His friends play it at lunch.**

That's the power of web games.

---

## 🎮 Resources

- **[30+ HTML5 Games with Source Code](https://eastsea.monster/games/)** — Study how others built theirs
- **[MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)** — The official docs
- **[Phaser.js](https://phaser.io/)** — When you're ready for a framework

---

## Your Turn

Build something this weekend. It doesn't have to be complex.

A ball that bounces. A paddle game. A simple shooter.

**The best way to learn game dev is to ship games.**

---

*If this helped you, give it some 👏 — it helps others find it too.*

*Follow me for more web development tutorials that actually work.*

**[🔗 My Website](https://eastsea.monster) | [💻 More Tutorials](https://eastsea.monster/categories/)**

---

*Originally published at [eastsea.monster](https://eastsea.monster)*
