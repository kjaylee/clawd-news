#!/usr/bin/env node
/**
 * i18n Batch Conversion Script
 * Processes all 37 games to add internationalization support
 */

const fs = require('fs');
const path = require('path');

const GAMES_DIR = __dirname;

// Common translation patterns used across many games
const COMMON_TRANSLATIONS = {
  // Buttons
  '시작하기': 'Start',
  '시작': 'Start',
  '게임 시작': 'Start Game',
  '다시 하기': 'Retry',
  '다시하기': 'Retry',
  '다시 시작': 'Restart',
  '다시 시도': 'Try Again',
  '다시 플레이': 'Play Again',
  '메뉴로': 'Menu',
  '홈으로': 'Home',
  '플레이': 'Play',
  
  // UI Labels
  '점수': 'Score',
  '최고': 'Best',
  '최고 점수': 'High Score',
  '최고 기록': 'High Score',
  '레벨': 'Level',
  '목표': 'Goal',
  '힌트': 'Hint',
  '리셋': 'Reset',
  '섞기': 'Shuffle',
  '되돌리기': 'Undo',
  '메뉴': 'Menu',
  
  // Game states
  '게임 오버': 'Game Over',
  '게임 종료': 'Game Over',
  '클리어': 'Clear',
  '레벨 클리어': 'Level Clear',
  '스테이지 클리어': 'Stage Clear',
  '콤보': 'Combo',
};

// Game-specific translation configurations
const GAME_CONFIGS = {
  'block-bounce': {
    title: { en: 'Block Bounce', ko: 'Block Bounce - 블록 바운스' },
    translations: {
      best: { en: 'Best: ', ko: '최고: ' },
      instruction: { en: 'Place blocks to<br>complete lines!', ko: '블록을 배치해서<br>라인을 완성하세요!' },
      highScore: { en: 'High Score', ko: '최고 점수' },
      score: { en: 'Score', ko: '점수' },
      start: { en: 'Start', ko: '시작하기' },
      retry: { en: 'Retry', ko: '다시 하기' },
      combo: { en: 'Combo!', ko: '콤보!' },
    },
    htmlReplacements: [
      ['<title>Block Bounce - 블록 바운스</title>', '<title>Block Bounce</title>'],
      ['>최고: <span', ' id="bestLabel"><!-- i18n --><span', false], // skip, do inline
      ['<div class="high-score">최고: <span id="highScore">0</span></div>',
       '<div class="high-score"><span id="bestLabel"></span><span id="highScore">0</span></div>'],
      ['<p>블록을 배치해서<br>라인을 완성하세요!</p>',
       '<p id="instruction"></p>'],
      ['<p style="color:#888;margin-bottom:20px;">최고 점수</p>',
       '<p style="color:#888;margin-bottom:20px;" id="highScoreLabel"></p>'],
      ['<button onclick="startGame()">시작하기</button>',
       '<button onclick="startGame()" id="startBtn"></button>'],
      ['<p style="color:#888;margin-bottom:20px;">점수</p>',
       '<p style="color:#888;margin-bottom:20px;" id="scoreLabel"></p>'],
      ['<button onclick="startGame()">다시 하기</button>',
       '<button onclick="startGame()" id="retryBtn"></button>'],
    ],
    jsReplacements: [
      ["combo > 1 ? `${combo}x 콤보!` : ''",
       "combo > 1 ? `${combo}x ${T('combo')}` : ''"],
    ],
    initCode: `
    const T = GameI18n({
      best: { en: 'Best: ', ko: '최고: ' },
      instruction: { en: 'Place blocks to<br>complete lines!', ko: '블록을 배치해서<br>라인을 완성하세요!' },
      highScore: { en: 'High Score', ko: '최고 점수' },
      score: { en: 'Score', ko: '점수' },
      start: { en: 'Start', ko: '시작하기' },
      retry: { en: 'Retry', ko: '다시 하기' },
      combo: { en: 'Combo!', ko: '콤보!' },
    });
    document.getElementById('bestLabel').textContent = T('best');
    document.getElementById('instruction').innerHTML = T('instruction');
    document.getElementById('highScoreLabel').textContent = T('highScore');
    document.getElementById('scoreLabel').textContent = T('score');
    document.getElementById('startBtn').textContent = T('start');
    document.getElementById('retryBtn').textContent = T('retry');`,
  },
};

// Process a single game
function processGame(gameName) {
  const filePath = path.join(GAMES_DIR, gameName, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ File not found: ${filePath}`);
    return false;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already processed
  if (html.includes('i18n.js')) {
    console.log(`  ⏭️ Already processed: ${gameName}`);
    return true;
  }

  // 1. Change lang attribute
  html = html.replace('<html lang="ko">', '<html lang="en">');

  // 2. Add i18n.js import before </head>
  html = html.replace('</head>', '<script src="../i18n.js"></script>\n</head>');

  fs.writeFileSync(filePath, html, 'utf-8');
  return true;
}

// List all games with Korean text
const games = [
  'block-bounce', 'brick-breaker', 'bubble-defense', 'chain-pop', 'color-sort',
  'crystal-match', 'dice-master', 'dungeon-run', 'fishing-tycoon', 'fruit-merge-drop',
  'gravity-orbit', 'hole-swallow', 'idle-slime-merge', 'infinite-stack-climb', 'jump-physics',
  'match-3d-zen', 'merge-rush', 'merge-tower', 'micro-factory', 'neon-snake',
  'number-drop', 'orbit-striker', 'pet-simulator', 'pipe-connect', 'pixel-defense',
  'polygon-dungeon', 'rhythm-pulse', 'rhythm-runner', 'rope-untangle', 'screw-sort-factory',
  'single-tap-golf', 'slide-block-match', 'slime-survivor', 'slime-survivor-premium',
  'spin-village', 'zen-tile-match', 'zombie-survivor'
];

console.log(`\n🌐 Processing ${games.length} games for i18n...\n`);

// Step 1: Add lang="en" and i18n.js import to all games
for (const game of games) {
  console.log(`Processing: ${game}`);
  processGame(game);
}

console.log('\n✅ Phase 1 complete: lang attribute and i18n.js import added to all games');
console.log('📝 Phase 2: Manual translation injection needed per game');
