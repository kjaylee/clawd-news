# Hacker News — Show HN Post

---

**Title:** Show HN: 40 Free HTML5 Games – Vanilla JS, No Frameworks, Single-File Architecture

**URL:** https://eastsea.monster/games/

**Comment (post as OP):**

Hi HN. I built 40 browser games using vanilla HTML5/CSS/JS — no frameworks, no game engines, no build tools.

Each game is a single self-contained HTML file (15-65KB). They use the Canvas API for rendering and work on any modern browser, mobile or desktop. PWA-ready so they can be installed and played offline.

Some technical details:

- **Architecture:** One HTML file per game. All JS, CSS, and game logic inline. No external dependencies.
- **Rendering:** HTML5 Canvas 2D context. requestAnimationFrame game loop. No WebGL.
- **Input:** Unified touch + mouse + keyboard handling. Touch events with gesture detection for mobile.
- **Audio:** Web Audio API with dynamic sound generation (no audio files needed in most games).
- **State:** LocalStorage for save data and high scores.
- **Responsive:** Dynamic canvas scaling based on viewport. CSS viewport-fit=cover for notched devices.
- **Distribution:** Static files on GitHub Pages. Also integrated with the Telegram Mini App SDK for in-app play.

AI helped with scaffolding, boilerplate, and math-heavy functions (collision detection, pathfinding). Game design and feel-tuning was manual.

The games span multiple genres: puzzle (Crystal Match, Mahjong Zen, Pipe Connect), action (Neon Snake, Zombie Survivor, Dungeon Run), idle (Fishing Tycoon, Idle Slime Merge), rhythm (Rhythm Pulse), strategy (Merge Tower, Stack Kingdom), and more.

Source is viewable (View Source works — it's just HTML). Feedback on code, performance, or game design welcome.
