#!/usr/bin/env node
/**
 * i18n Full Conversion Script - Phase 2
 * Applies per-game translations to all 37 games
 */

const fs = require('fs');
const path = require('path');

const GAMES_DIR = __dirname;

function applyReplacements(html, replacements) {
  for (const [from, to] of replacements) {
    if (!html.includes(from)) {
      console.warn(`    ⚠️ Pattern not found: "${from.substring(0, 60)}..."`);
      continue;
    }
    html = html.replace(from, to);
  }
  return html;
}

function processGame(gameName, config) {
  const filePath = path.join(GAMES_DIR, gameName, 'index.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Apply all replacements
  html = applyReplacements(html, config);
  
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`  ✅ ${gameName}`);
  return true;
}

// ============================================================
// GAME DEFINITIONS - Each game's specific replacements
// ============================================================

const GAMES = {

// ──────────────────────────────────────────────────────────────
// 1. block-bounce (14 Korean lines)
// ──────────────────────────────────────────────────────────────
'block-bounce': [
  ['<title>Block Bounce - 블록 바운스</title>', '<title>Block Bounce</title>'],
  ['<div class="high-score">최고: <span id="highScore">0</span></div>',
   '<div class="high-score" id="bestLabel">Best: <span id="highScore">0</span></div>'],
  ['<p>블록을 배치해서<br>라인을 완성하세요!</p>',
   '<p id="instructionText">Place blocks to<br>complete lines!</p>'],
  ['<p style="color:#888;margin-bottom:20px;">최고 점수</p>',
   '<p style="color:#888;margin-bottom:20px;" id="highScoreLabel">High Score</p>'],
  ['<button onclick="startGame()">시작하기</button>',
   '<button onclick="startGame()" id="startBtn">Start</button>'],
  ['<p style="color:#888;margin-bottom:20px;">점수</p>',
   '<p style="color:#888;margin-bottom:20px;" id="scoreLabelGO">Score</p>'],
  ['<button onclick="startGame()">다시 하기</button>',
   '<button onclick="startGame()" id="retryBtn">Retry</button>'],
  // JS combo text
  ["combo > 1 ? `${combo}x 콤보!` : ''",
   "combo > 1 ? `${combo}x Combo!` : ''"],
  // Add i18n init after script tag (before GRID_SIZE const)
  ['const GRID_SIZE = 8;',
   `const T = GameI18n({
      best: { en: 'Best: ', ko: '최고: ' },
      instruction: { en: 'Place blocks to<br>complete lines!', ko: '블록을 배치해서<br>라인을 완성하세요!' },
      highScore: { en: 'High Score', ko: '최고 점수' },
      score: { en: 'Score', ko: '점수' },
      start: { en: 'Start', ko: '시작하기' },
      retry: { en: 'Retry', ko: '다시 하기' },
      combo: { en: 'Combo!', ko: '콤보!' },
    });
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('bestLabel').childNodes[0].textContent = T('best');
      document.getElementById('instructionText').innerHTML = T('instruction');
      document.getElementById('highScoreLabel').textContent = T('highScore');
      document.getElementById('startBtn').textContent = T('start');
      document.getElementById('scoreLabelGO').textContent = T('score');
      document.getElementById('retryBtn').textContent = T('retry');
    });
    const GRID_SIZE = 8;`],
],

// ──────────────────────────────────────────────────────────────
// 2. chain-pop (14 Korean lines)
// ──────────────────────────────────────────────────────────────
'chain-pop': [
  ['<p style="margin-bottom: 20px; opacity: 0.8;">연결된 블록을 터치해서 터뜨리세요!</p>',
   '<p style="margin-bottom: 20px; opacity: 0.8;" id="menuDesc">Pop connected blocks by tapping!</p>'],
  ['<button class="btn" onclick="startGame()">▶ 게임 시작</button>',
   '<button class="btn" onclick="startGame()" id="menuStartBtn">▶ Start Game</button>'],
  ['<p style="margin-top: 30px; font-size: 0.9rem; opacity: 0.6;">2개 이상 연결된 같은 색 블록을 탭!</p>',
   '<p style="margin-top: 30px; font-size: 0.9rem; opacity: 0.6;" id="menuHint">Tap 2+ connected same-color blocks!</p>'],
  ['<h2>🎉 게임 오버</h2>',
   '<h2 id="goTitle">🎉 Game Over</h2>'],
  ['<p>최고 기록: <span id="high-score">0</span></p>',
   '<p><span id="goHighLabel">High Score: </span><span id="high-score">0</span></p>'],
  ['<button class="btn" onclick="startGame()">다시 하기</button>',
   '<button class="btn" onclick="startGame()" id="goRetry">Retry</button>'],
  ['<button class="btn" onclick="showMenu()">메뉴로</button>',
   '<button class="btn" onclick="showMenu()" id="goMenu">Menu</button>'],
  ['<div class="stat">레벨 <span id="level">1</span></div>',
   '<div class="stat"><span id="levelLabel">Lv </span><span id="level">1</span></div>'],
  ['<div class="stat">점수 <span id="score">0</span></div>',
   '<div class="stat"><span id="scoreLabel">Score </span><span id="score">0</span></div>'],
  ['<div class="stat">목표 <span id="goal">1000</span></div>',
   '<div class="stat"><span id="goalLabel">Goal </span><span id="goal">1000</span></div>'],
  ['<button class="btn" onclick="shuffle()">🔀 섞기</button>',
   '<button class="btn" onclick="shuffle()" id="shuffleBtn">🔀 Shuffle</button>'],
  ['<button class="btn" onclick="showMenu()">🏠 메뉴</button>',
   '<button class="btn" onclick="showMenu()" id="homeBtn">🏠 Menu</button>'],
  // i18n init
  ['const GRID_SIZE = 8;',
   `const T = GameI18n({
      menuDesc: { en: 'Pop connected blocks by tapping!', ko: '연결된 블록을 터치해서 터뜨리세요!' },
      startGame: { en: '▶ Start Game', ko: '▶ 게임 시작' },
      menuHint: { en: 'Tap 2+ connected same-color blocks!', ko: '2개 이상 연결된 같은 색 블록을 탭!' },
      gameOver: { en: '🎉 Game Over', ko: '🎉 게임 오버' },
      highScore: { en: 'High Score: ', ko: '최고 기록: ' },
      retry: { en: 'Retry', ko: '다시 하기' },
      menu: { en: 'Menu', ko: '메뉴로' },
      level: { en: 'Lv ', ko: '레벨 ' },
      score: { en: 'Score ', ko: '점수 ' },
      goal: { en: 'Goal ', ko: '목표 ' },
      shuffle: { en: '🔀 Shuffle', ko: '🔀 섞기' },
      home: { en: '🏠 Menu', ko: '🏠 메뉴' },
    });
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('menuDesc').textContent = T('menuDesc');
      document.getElementById('menuStartBtn').textContent = T('startGame');
      document.getElementById('menuHint').textContent = T('menuHint');
      document.getElementById('goTitle').textContent = T('gameOver');
      document.getElementById('goHighLabel').textContent = T('highScore');
      document.getElementById('goRetry').textContent = T('retry');
      document.getElementById('goMenu').textContent = T('menu');
      document.getElementById('levelLabel').textContent = T('level');
      document.getElementById('scoreLabel').textContent = T('score');
      document.getElementById('goalLabel').textContent = T('goal');
      document.getElementById('shuffleBtn').textContent = T('shuffle');
      document.getElementById('homeBtn').textContent = T('home');
    });
    const GRID_SIZE = 8;`],
],

// ──────────────────────────────────────────────────────────────
// 3. rope-untangle (12 Korean lines)
// ──────────────────────────────────────────────────────────────
'rope-untangle': [
  ['<title>Rope Untangle - 로프 풀기 퍼즐</title>', '<title>Rope Untangle</title>'],
  ['<div class="subtitle">얽힌 로프를 풀어보세요!</div>',
   '<div class="subtitle" id="subtitle">Untangle the ropes!</div>'],
  ['<button class="btn btn-start" onclick="startGame()">게임 시작</button>',
   '<button class="btn btn-start" onclick="startGame()" id="startBtn">Start Game</button>'],
  ['<div class="level-display" id="savedLevel">저장된 레벨: 1</div>',
   '<div class="level-display" id="savedLevel">Saved Level: 1</div>'],
  ['<button class="btn btn-hint" onclick="showHint()">💡 힌트</button>',
   '<button class="btn btn-hint" onclick="showHint()" id="hintBtn">💡 Hint</button>'],
  ['<button class="btn btn-reset" onclick="resetLevel()">🔄 리셋</button>',
   '<button class="btn btn-reset" onclick="resetLevel()" id="resetBtn">🔄 Reset</button>'],
  ['🎉 클리어!\n        <small>탭하여 다음 레벨</small>',
   '<span id="clearMsg">🎉 Clear!</span>\n        <small id="clearSub">Tap for next level</small>'],
  // JS replacement
  ['document.getElementById(\'savedLevel\').textContent = `저장된 레벨: ${level}`;',
   'document.getElementById(\'savedLevel\').textContent = T(\'savedLevel\') + level;'],
  // i18n init
  ['const canvas = document.getElementById(\'gameCanvas\');',
   `const T = GameI18n({
      subtitle: { en: 'Untangle the ropes!', ko: '얽힌 로프를 풀어보세요!' },
      startGame: { en: 'Start Game', ko: '게임 시작' },
      savedLevel: { en: 'Saved Level: ', ko: '저장된 레벨: ' },
      hint: { en: '💡 Hint', ko: '💡 힌트' },
      reset: { en: '🔄 Reset', ko: '🔄 리셋' },
      clear: { en: '🎉 Clear!', ko: '🎉 클리어!' },
      clearSub: { en: 'Tap for next level', ko: '탭하여 다음 레벨' },
    });
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('subtitle').textContent = T('subtitle');
      document.getElementById('startBtn').textContent = T('startGame');
      document.getElementById('hintBtn').textContent = T('hint');
      document.getElementById('resetBtn').textContent = T('reset');
      var cm = document.getElementById('clearMsg');
      if (cm) cm.textContent = T('clear');
      var cs = document.getElementById('clearSub');
      if (cs) cs.textContent = T('clearSub');
    });
    const canvas = document.getElementById('gameCanvas');`],
],

// ──────────────────────────────────────────────────────────────
// 4. rhythm-runner (13 Korean lines)
// ──────────────────────────────────────────────────────────────
'rhythm-runner': [
  ['<title>🎵 Rhythm Runner</title>', '<title>🎵 Rhythm Runner</title>'], // already English title
  ['<p class="subtitle">비트에 맞춰 달려라!</p>',
   '<p class="subtitle" id="subtitle">Run to the beat!</p>'],
  ['<button class="btn" onclick="startGame()">🎮 시작하기</button>',
   '<button class="btn" onclick="startGame()" id="startBtn">🎮 Start</button>'],
  ['노트가 판정선에 도달하면<br>\n                해당 레인을 터치하세요!<br>\n                타이밍이 완벽할수록 높은 점수!',
   '<span id="howToPlay">Tap the lane when notes<br>reach the judge line!<br>Better timing = higher score!</span>'],
  ['최대 콤보: <span id="maxCombo">0</span><br>',
   '<span id="maxComboLabel">Max Combo: </span><span id="maxCombo">0</span><br>'],
  ['<button class="btn" onclick="startGame()">🔄 다시하기</button>',
   '<button class="btn" onclick="startGame()" id="retryBtn">🔄 Retry</button>'],
],

// ──────────────────────────────────────────────────────────────
// 5. color-sort (10 Korean lines)
// ──────────────────────────────────────────────────────────────
'color-sort': [
  ['<p class="subtitle">색상을 정렬하는 힐링 퍼즐</p>',
   '<p class="subtitle" id="subtitle">A relaxing color sorting puzzle</p>'],
  ['<button class="btn btn-primary" onclick="startGame()">▶ 게임 시작</button>',
   '<button class="btn btn-primary" onclick="startGame()" id="startBtn">▶ Start Game</button>'],
  ['<button class="btn btn-primary" onclick="nextLevel()">▶ 다음 레벨</button>',
   '<button class="btn btn-primary" onclick="nextLevel()" id="nextLevelBtn">▶ Next Level</button>'],
],

// ──────────────────────────────────────────────────────────────
// 6. orbit-striker (15 Korean lines)
// ──────────────────────────────────────────────────────────────
'orbit-striker': [
  ['<title>Orbit Striker - 궤도 슈터</title>', '<title>Orbit Striker</title>'],
  ['<div class="subtitle">중력을 무기로, 우주를 지켜라</div>',
   '<div class="subtitle" id="subtitle">Harness gravity. Defend the cosmos.</div>'],
  ['<button class="btn btn-primary" onclick="startGame()">▶ 게임 시작</button>',
   '<button class="btn btn-primary" onclick="startGame()" id="startBtn">▶ Start Game</button>'],
  ['드래그하여 조준 → 놓아서 발사<br>\n        궤도를 도는 적들을 모두 처치하세요!',
   '<span id="howToPlay">Drag to aim → Release to fire<br>Destroy all orbiting enemies!</span>'],
  ['<button class="btn btn-primary" onclick="startGame()">다시 시작</button>',
   '<button class="btn btn-primary" onclick="startGame()" id="restartBtn">Restart</button>'],
  ['<button class="btn" style="background:#334;color:#fff" onclick="showMenu()">메뉴로</button>',
   '<button class="btn" style="background:#334;color:#fff" onclick="showMenu()" id="menuBtn">Menu</button>'],
  ['<div class="title" style="font-size:1.5em">⚡ 파워업 선택</div>',
   '<div class="title" style="font-size:1.5em" id="powerupTitle">⚡ Choose Power-up</div>'],
  // JS power-up data
  ["{ id: 'multishot', name: '멀티샷', icon: '🔱', desc: '3방향 발사', apply: () => playerStats.multishot = 3 }",
   "{ id: 'multishot', name: _i18nLang==='ko'?'멀티샷':'Multishot', icon: '🔱', desc: _i18nLang==='ko'?'3방향 발사':'3-way shot', apply: () => playerStats.multishot = 3 }"],
  ["{ id: 'piercing', name: '관통탄', icon: '🗡️', desc: '적 관통', apply: () => playerStats.piercing = true }",
   "{ id: 'piercing', name: _i18nLang==='ko'?'관통탄':'Piercing', icon: '🗡️', desc: _i18nLang==='ko'?'적 관통':'Pierce enemies', apply: () => playerStats.piercing = true }"],
  ["{ id: 'homing', name: '유도탄', icon: '🎯', desc: '적 추적', apply: () => playerStats.homing = 0.5 }",
   "{ id: 'homing', name: _i18nLang==='ko'?'유도탄':'Homing', icon: '🎯', desc: _i18nLang==='ko'?'적 추적':'Track enemies', apply: () => playerStats.homing = 0.5 }"],
  ["{ id: 'bigshot', name: '대형탄', icon: '💣', desc: '탄환 2배', apply: () => playerStats.bulletSize *= 1.5 }",
   "{ id: 'bigshot', name: _i18nLang==='ko'?'대형탄':'Big Shot', icon: '💣', desc: _i18nLang==='ko'?'탄환 2배':'Double bullet size', apply: () => playerStats.bulletSize *= 1.5 }"],
  ["{ id: 'rapidfire', name: '속사', icon: '⚡', desc: '발사속도↑', apply: () => playerStats.fireRate *= 0.7 }",
   "{ id: 'rapidfire', name: _i18nLang==='ko'?'속사':'Rapid Fire', icon: '⚡', desc: _i18nLang==='ko'?'발사속도↑':'Fire rate up', apply: () => playerStats.fireRate *= 0.7 }"],
],

// ──────────────────────────────────────────────────────────────
// 7. pipe-connect (15 Korean lines) 
// ──────────────────────────────────────────────────────────────
'pipe-connect': [
  ['<p>파이프를 회전시켜 물길을 연결하세요!</p>',
   '<p id="subtitle">Rotate pipes to connect the water flow!</p>'],
],

// ──────────────────────────────────────────────────────────────
// 8. slide-block-match (15 Korean lines)
// ──────────────────────────────────────────────────────────────
'slide-block-match': [
  ['<p>블록을 밀어 3개 이상 매치하세요!</p>',
   '<p id="sbmDesc">Slide blocks to match 3 or more!</p>'],
  ['<button class="btn btn-primary" onclick="startGame(\'timed\')">⏱️ 타임 어택 (60초)</button>',
   '<button class="btn btn-primary" onclick="startGame(\'timed\')" id="timedBtn">⏱️ Time Attack (60s)</button>'],
  ['<button class="btn btn-secondary" onclick="startGame(\'endless\')">♾️ 무한 모드</button>',
   '<button class="btn btn-secondary" onclick="startGame(\'endless\')" id="endlessBtn">♾️ Endless Mode</button>'],
  ['<div class="high-score">🏆 최고 점수: <span id="highScoreDisplay">0</span></div>',
   '<div class="high-score">🏆 <span id="hsLabel">High Score: </span><span id="highScoreDisplay">0</span></div>'],
  ['💡 블록을 터치하고 상하좌우로 스와이프!<br>\n                🔥 연쇄 매치로 고득점 노려보세요!',
   '<span id="sbmHint">💡 Touch a block and swipe to slide!<br>🔥 Chain matches for high scores!</span>'],
  ['<h2>🎮 게임 종료!</h2>',
   '<h2 id="goTitle">🎮 Game Over!</h2>'],
  ['<p id="newHighScore" class="hidden" style="color: #ffd93d; margin-bottom: 15px;">🏆 새로운 최고 점수!</p>',
   '<p id="newHighScore" class="hidden" style="color: #ffd93d; margin-bottom: 15px;">🏆 New High Score!</p>'],
  ['<button class="btn btn-primary" onclick="showMenu()">🏠 메뉴로</button>',
   '<button class="btn btn-primary" onclick="showMenu()" id="goMenuBtn">🏠 Menu</button>'],
  ['<button class="btn btn-secondary" onclick="restartGame()">🔄 다시 하기</button>',
   '<button class="btn btn-secondary" onclick="restartGame()" id="goRetryBtn">🔄 Retry</button>'],
  // JS chain text
  ['`🔥 ${chainCount}연쇄! x${multiplier.toFixed(1)}`',
   '`🔥 ${chainCount} ${_i18nLang==="ko"?"연쇄":"Chain"}! x${multiplier.toFixed(1)}`'],
],

};

// ============================================================
// MAIN EXECUTION
// ============================================================

const targetGames = process.argv.slice(2);
const gamesToProcess = targetGames.length > 0 ? targetGames : Object.keys(GAMES);

console.log(`\n🌐 Applying i18n translations to ${gamesToProcess.length} games...\n`);

let processed = 0;
let skipped = 0;

for (const game of gamesToProcess) {
  if (!GAMES[game]) {
    console.log(`  ⏭️ No config for: ${game}`);
    skipped++;
    continue;
  }
  try {
    processGame(game, GAMES[game]);
    processed++;
  } catch (e) {
    console.error(`  ❌ Error processing ${game}: ${e.message}`);
  }
}

console.log(`\n📊 Results: ${processed} processed, ${skipped} skipped`);
