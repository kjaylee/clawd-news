#!/usr/bin/env node
/**
 * Full i18n transformation for all 37 games.
 * Strategy: Replace Korean HTML text with English defaults,
 * inject T() i18n function, Korean available via i18n.js language detection.
 * 
 * For each game: 
 * - English becomes the default (hardcoded in HTML)
 * - Korean translations loaded via GameI18n + T() calls
 * - <script src="../i18n.js"></script> already added in phase 1
 */

const fs = require('fs');
const path = require('path');

const GAMES_DIR = __dirname;

// Simple string replacement helper
function R(html, pairs) {
  for (const [from, to] of pairs) {
    if (!html.includes(from)) {
      // Try trimmed version
      const trimFrom = from.trim();
      if (html.includes(trimFrom)) {
        html = html.replace(trimFrom, to.trim());
      } else {
        console.warn(`    ⚠️  Not found: "${from.substring(0, 80)}"`);
      }
    } else {
      html = html.replace(from, to);
    }
  }
  return html;
}

// Inject i18n block before the first meaningful JS variable/const/let/function/var declaration
// after <script> tag
function injectI18nBlock(html, i18nCode) {
  // Find the main script tag (the one with game logic, not i18n.js import)
  // Look for <script> followed by game code
  const scriptMatch = html.match(/<script>[\s\n]+(?:\/\/[^\n]*\n\s*)*(const |let |var |function |class )/);
  if (scriptMatch) {
    const idx = html.indexOf(scriptMatch[0]);
    const scriptTagEnd = idx + '<script>'.length;
    // Insert after <script> tag and any leading comments
    const beforeCode = html.substring(0, scriptTagEnd);
    const afterCode = html.substring(scriptTagEnd);
    return beforeCode + '\n    // i18n translations\n    ' + i18nCode.trim() + '\n' + afterCode;
  }
  console.warn('    ⚠️  Could not find script injection point');
  return html;
}

function processGame(name, transformFn) {
  const filePath = path.join(GAMES_DIR, name, 'index.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already fully processed (has GameI18n call)
  if (html.includes('GameI18n(')) {
    console.log(`  ⏭️  ${name} (already done)`);
    return;
  }
  
  html = transformFn(html);
  fs.writeFileSync(filePath, html, 'utf-8');
  
  // Verify no Korean in non-comment lines (except CSS/emoji/data that's ok)
  const lines = html.split('\n');
  let koreanCount = 0;
  lines.forEach((line, i) => {
    if (/[가-힣]/.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes("ko:") && !line.includes("ko'") && !line.includes('ko"') && !line.includes("==='ko'") && !line.includes('==="ko"')) {
      // This might be a missed Korean string
      koreanCount++;
    }
  });
  
  console.log(`  ✅ ${name}${koreanCount > 0 ? ` (${koreanCount} Korean lines remain - may be comments/data)` : ''}`);
}

// =============================================================
// GAME TRANSFORMATIONS
// =============================================================

// Helper: create the i18n init block
function makeI18n(translations) {
  const entries = Object.entries(translations)
    .map(([k, v]) => `      ${k}: { en: ${JSON.stringify(v.en)}, ko: ${JSON.stringify(v.ko)} }`)
    .join(',\n');
  return `const T = GameI18n({\n${entries}\n    });`;
}

function makeDomInit(assignments) {
  const lines = assignments.map(a => `      ${a}`).join('\n');
  return `\n    document.addEventListener('DOMContentLoaded', function() {\n${lines}\n    });`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

processGame('block-bounce', html => {
  html = R(html, [
    ['<title>Block Bounce - 블록 바운스</title>', '<title>Block Bounce</title>'],
    ['<div class="high-score">최고: <span id="highScore">0</span></div>',
     '<div class="high-score"><span id="i18n-best">Best: </span><span id="highScore">0</span></div>'],
    ['<p>블록을 배치해서<br>라인을 완성하세요!</p>',
     '<p id="i18n-desc">Place blocks to<br>complete lines!</p>'],
    ['<p style="color:#888;margin-bottom:20px;">최고 점수</p>',
     '<p style="color:#888;margin-bottom:20px;" id="i18n-hs">High Score</p>'],
    ['<button onclick="startGame()">시작하기</button>',
     '<button onclick="startGame()" id="i18n-start">Start</button>'],
    ['<p style="color:#888;margin-bottom:20px;">점수</p>',
     '<p style="color:#888;margin-bottom:20px;" id="i18n-sc">Score</p>'],
    ['<button onclick="startGame()">다시 하기</button>',
     '<button onclick="startGame()" id="i18n-retry">Retry</button>'],
    ["combo > 1 ? `${combo}x 콤보!` : ''",
     "combo > 1 ? `${combo}x ${T('combo')}` : ''"],
  ]);
  const i18n = makeI18n({
    best: { en: 'Best: ', ko: '최고: ' },
    desc: { en: 'Place blocks to<br>complete lines!', ko: '블록을 배치해서<br>라인을 완성하세요!' },
    hs: { en: 'High Score', ko: '최고 점수' },
    start: { en: 'Start', ko: '시작하기' },
    sc: { en: 'Score', ko: '점수' },
    retry: { en: 'Retry', ko: '다시 하기' },
    combo: { en: 'Combo!', ko: '콤보!' },
  });
  const domInit = makeDomInit([
    "document.getElementById('i18n-best').textContent = T('best');",
    "document.getElementById('i18n-desc').innerHTML = T('desc');",
    "document.getElementById('i18n-hs').textContent = T('hs');",
    "document.getElementById('i18n-start').textContent = T('start');",
    "document.getElementById('i18n-sc').textContent = T('sc');",
    "document.getElementById('i18n-retry').textContent = T('retry');",
  ]);
  return injectI18nBlock(html, i18n + domInit);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

processGame('chain-pop', html => {
  html = R(html, [
    ['<p style="margin-bottom: 20px; opacity: 0.8;">연결된 블록을 터치해서 터뜨리세요!</p>',
     '<p style="margin-bottom: 20px; opacity: 0.8;" id="i18n-desc">Pop connected blocks by tapping!</p>'],
    ['<button class="btn" onclick="startGame()">▶ 게임 시작</button>',
     '<button class="btn" onclick="startGame()" id="i18n-start">▶ Start Game</button>'],
    ['<p style="margin-top: 30px; font-size: 0.9rem; opacity: 0.6;">2개 이상 연결된 같은 색 블록을 탭!</p>',
     '<p style="margin-top: 30px; font-size: 0.9rem; opacity: 0.6;" id="i18n-hint">Tap 2+ connected same-color blocks!</p>'],
    ['<h2>🎉 게임 오버</h2>', '<h2 id="i18n-go">🎉 Game Over</h2>'],
    ['<p>최고 기록: <span id="high-score">0</span></p>',
     '<p><span id="i18n-hs">High Score: </span><span id="high-score">0</span></p>'],
    ['<button class="btn" onclick="startGame()">다시 하기</button>',
     '<button class="btn" onclick="startGame()" id="i18n-retry">Retry</button>'],
    ['<button class="btn" onclick="showMenu()">메뉴로</button>',
     '<button class="btn" onclick="showMenu()" id="i18n-menu1">Menu</button>'],
    ['<div class="stat">레벨 <span id="level">1</span></div>',
     '<div class="stat"><span id="i18n-lv">Lv </span><span id="level">1</span></div>'],
    ['<div class="stat">점수 <span id="score">0</span></div>',
     '<div class="stat"><span id="i18n-sc">Score </span><span id="score">0</span></div>'],
    ['<div class="stat">목표 <span id="goal">1000</span></div>',
     '<div class="stat"><span id="i18n-gl">Goal </span><span id="goal">1000</span></div>'],
    ['<button class="btn" onclick="shuffle()">🔀 섞기</button>',
     '<button class="btn" onclick="shuffle()" id="i18n-shuf">🔀 Shuffle</button>'],
    ['<button class="btn" onclick="showMenu()">🏠 메뉴</button>',
     '<button class="btn" onclick="showMenu()" id="i18n-menu2">🏠 Menu</button>'],
  ]);
  const i18n = makeI18n({
    desc: { en: 'Pop connected blocks by tapping!', ko: '연결된 블록을 터치해서 터뜨리세요!' },
    start: { en: '▶ Start Game', ko: '▶ 게임 시작' },
    hint: { en: 'Tap 2+ connected same-color blocks!', ko: '2개 이상 연결된 같은 색 블록을 탭!' },
    go: { en: '🎉 Game Over', ko: '🎉 게임 오버' },
    hs: { en: 'High Score: ', ko: '최고 기록: ' },
    retry: { en: 'Retry', ko: '다시 하기' },
    menu: { en: 'Menu', ko: '메뉴로' },
    lv: { en: 'Lv ', ko: '레벨 ' },
    sc: { en: 'Score ', ko: '점수 ' },
    gl: { en: 'Goal ', ko: '목표 ' },
    shuf: { en: '🔀 Shuffle', ko: '🔀 섞기' },
    home: { en: '🏠 Menu', ko: '🏠 메뉴' },
  });
  const domInit = makeDomInit([
    "document.getElementById('i18n-desc').textContent = T('desc');",
    "document.getElementById('i18n-start').textContent = T('start');",
    "document.getElementById('i18n-hint').textContent = T('hint');",
    "document.getElementById('i18n-go').textContent = T('go');",
    "document.getElementById('i18n-hs').textContent = T('hs');",
    "document.getElementById('i18n-retry').textContent = T('retry');",
    "document.getElementById('i18n-menu1').textContent = T('menu');",
    "document.getElementById('i18n-lv').textContent = T('lv');",
    "document.getElementById('i18n-sc').textContent = T('sc');",
    "document.getElementById('i18n-gl').textContent = T('gl');",
    "document.getElementById('i18n-shuf').textContent = T('shuf');",
    "document.getElementById('i18n-menu2').textContent = T('home');",
  ]);
  return injectI18nBlock(html, i18n + domInit);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

processGame('rope-untangle', html => {
  html = R(html, [
    ['<title>Rope Untangle - 로프 풀기 퍼즐</title>', '<title>Rope Untangle</title>'],
    ['<div class="subtitle">얽힌 로프를 풀어보세요!</div>',
     '<div class="subtitle" id="i18n-sub">Untangle the ropes!</div>'],
    ['<button class="btn btn-start" onclick="startGame()">게임 시작</button>',
     '<button class="btn btn-start" onclick="startGame()" id="i18n-start">Start Game</button>'],
    ['<div class="level-display" id="savedLevel">저장된 레벨: 1</div>',
     '<div class="level-display" id="savedLevel">Saved Level: 1</div>'],
    ['<button class="btn btn-hint" onclick="showHint()">💡 힌트</button>',
     '<button class="btn btn-hint" onclick="showHint()">💡 Hint</button>'],
    ['<button class="btn btn-reset" onclick="resetLevel()">🔄 리셋</button>',
     '<button class="btn btn-reset" onclick="resetLevel()">🔄 Reset</button>'],
    [`        🎉 클리어!
        <small>탭하여 다음 레벨</small>`,
     `        <span id="i18n-clear">🎉 Clear!</span>
        <small id="i18n-next">Tap for next level</small>`],
    ["document.getElementById('savedLevel').textContent = `저장된 레벨: ${level}`;",
     "document.getElementById('savedLevel').textContent = T('saved') + level;"],
  ]);
  const i18n = makeI18n({
    sub: { en: 'Untangle the ropes!', ko: '얽힌 로프를 풀어보세요!' },
    start: { en: 'Start Game', ko: '게임 시작' },
    saved: { en: 'Saved Level: ', ko: '저장된 레벨: ' },
    clear: { en: '🎉 Clear!', ko: '🎉 클리어!' },
    next: { en: 'Tap for next level', ko: '탭하여 다음 레벨' },
  });
  const domInit = makeDomInit([
    "document.getElementById('i18n-sub').textContent = T('sub');",
    "document.getElementById('i18n-start').textContent = T('start');",
    "document.getElementById('savedLevel').textContent = T('saved') + '1';",
    "var ce = document.getElementById('i18n-clear'); if(ce) ce.textContent = T('clear');",
    "var ne = document.getElementById('i18n-next'); if(ne) ne.textContent = T('next');",
  ]);
  return injectI18nBlock(html, i18n + domInit);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

processGame('color-sort', html => {
  html = R(html, [
    ['<p class="subtitle">색상을 정렬하는 힐링 퍼즐</p>',
     '<p class="subtitle" id="i18n-sub">A relaxing color sorting puzzle</p>'],
    ['<button class="btn btn-primary" onclick="startGame()">▶ 게임 시작</button>',
     '<button class="btn btn-primary" onclick="startGame()" id="i18n-start">▶ Start Game</button>'],
    ['<button class="btn btn-primary" onclick="nextLevel()">▶ 다음 레벨</button>',
     '<button class="btn btn-primary" onclick="nextLevel()" id="i18n-next">▶ Next Level</button>'],
  ]);
  const i18n = makeI18n({
    sub: { en: 'A relaxing color sorting puzzle', ko: '색상을 정렬하는 힐링 퍼즐' },
    start: { en: '▶ Start Game', ko: '▶ 게임 시작' },
    next: { en: '▶ Next Level', ko: '▶ 다음 레벨' },
  });
  const domInit = makeDomInit([
    "document.getElementById('i18n-sub').textContent = T('sub');",
    "document.getElementById('i18n-start').textContent = T('start');",
    "document.getElementById('i18n-next').textContent = T('next');",
  ]);
  return injectI18nBlock(html, i18n + domInit);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

processGame('pipe-connect', html => {
  html = R(html, [
    ['<p>파이프를 회전시켜 물길을 연결하세요!</p>',
     '<p id="i18n-sub">Rotate pipes to connect the water flow!</p>'],
  ]);
  const i18n = makeI18n({
    sub: { en: 'Rotate pipes to connect the water flow!', ko: '파이프를 회전시켜 물길을 연결하세요!' },
  });
  const domInit = makeDomInit([
    "document.getElementById('i18n-sub').textContent = T('sub');",
  ]);
  return injectI18nBlock(html, i18n + domInit);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

processGame('slide-block-match', html => {
  html = R(html, [
    ['<p>블록을 밀어 3개 이상 매치하세요!</p>',
     '<p id="i18n-desc">Slide blocks to match 3 or more!</p>'],
    ['<button class="btn btn-primary" onclick="startGame(\'timed\')">⏱️ 타임 어택 (60초)</button>',
     '<button class="btn btn-primary" onclick="startGame(\'timed\')" id="i18n-timed">⏱️ Time Attack (60s)</button>'],
    ['<button class="btn btn-secondary" onclick="startGame(\'endless\')">♾️ 무한 모드</button>',
     '<button class="btn btn-secondary" onclick="startGame(\'endless\')" id="i18n-endless">♾️ Endless Mode</button>'],
    ['<div class="high-score">🏆 최고 점수: <span id="highScoreDisplay">0</span></div>',
     '<div class="high-score">🏆 <span id="i18n-hs">High Score: </span><span id="highScoreDisplay">0</span></div>'],
    [`💡 블록을 터치하고 상하좌우로 스와이프!<br>
                🔥 연쇄 매치로 고득점 노려보세요!`,
     `<span id="i18n-hint">💡 Touch a block and swipe to slide!<br>
                🔥 Chain matches for high scores!</span>`],
    ['<h2>🎮 게임 종료!</h2>', '<h2 id="i18n-go">🎮 Game Over!</h2>'],
    ['🏆 새로운 최고 점수!', '🏆 New High Score!'],
    ['<button class="btn btn-primary" onclick="showMenu()">🏠 메뉴로</button>',
     '<button class="btn btn-primary" onclick="showMenu()" id="i18n-menu">🏠 Menu</button>'],
    ['<button class="btn btn-secondary" onclick="restartGame()">🔄 다시 하기</button>',
     '<button class="btn btn-secondary" onclick="restartGame()" id="i18n-retry">🔄 Retry</button>'],
    ['`🔥 ${chainCount}연쇄! x${multiplier.toFixed(1)}`',
     '`🔥 ${chainCount} ${_i18nLang==="ko"?"연쇄":"Chain"}! x${multiplier.toFixed(1)}`'],
  ]);
  const i18n = makeI18n({
    desc: { en: 'Slide blocks to match 3 or more!', ko: '블록을 밀어 3개 이상 매치하세요!' },
    timed: { en: '⏱️ Time Attack (60s)', ko: '⏱️ 타임 어택 (60초)' },
    endless: { en: '♾️ Endless Mode', ko: '♾️ 무한 모드' },
    hs: { en: 'High Score: ', ko: '최고 점수: ' },
    go: { en: '🎮 Game Over!', ko: '🎮 게임 종료!' },
    menu: { en: '🏠 Menu', ko: '🏠 메뉴로' },
    retry: { en: '🔄 Retry', ko: '🔄 다시 하기' },
  });
  const domInit = makeDomInit([
    "document.getElementById('i18n-desc').textContent = T('desc');",
    "document.getElementById('i18n-timed').textContent = T('timed');",
    "document.getElementById('i18n-endless').textContent = T('endless');",
    "document.getElementById('i18n-hs').textContent = T('hs');",
    "document.getElementById('i18n-go').textContent = T('go');",
    "document.getElementById('i18n-menu').textContent = T('menu');",
    "document.getElementById('i18n-retry').textContent = T('retry');",
  ]);
  return injectI18nBlock(html, i18n + domInit);
});

console.log('\n✅ Batch 1 complete (6 simpler games)');
console.log('Run again for more batches');
