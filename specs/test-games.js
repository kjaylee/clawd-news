// test-games.js — Playwright로 각 게임 자동 브라우저 테스트
const { chromium } = require('playwright');

const BASE_URL = 'https://eastsea.monster/games';
const GAMES = [
  'ball-sort', 'block-bounce', 'brick-breaker', 'bubble-defense', 'chain-pop',
  'color-sort', 'conveyor-sort-factory', 'crystal-match', 'dice-master', 'dungeon-run',
  'fishing-tycoon', 'fruit-merge-drop', 'gravity-orbit', 'hex-drop', 'hole-swallow',
  'idle-slime-merge', 'infinite-stack-climb', 'jump-physics', 'laser-reflect', 'match-3d-zen',
  'merge-rush', 'merge-tower', 'micro-factory', 'neon-snake', 'number-drop',
  'orbit-striker', 'pet-simulator', 'pipe-connect', 'pixel-defense', 'polygon-dungeon',
  'rhythm-pulse', 'rhythm-runner', 'rope-untangle', 'screw-sort-factory', 'single-tap-golf',
  'slide-block-match', 'slime-survivor', 'slime-survivor-premium', 'spin-village',
  'stack-kingdom', 'stack-tower', 'zen-tile-match', 'zombie-survivor'
];

const SCREENSHOT_DIR = '/tmp/game-screenshots';
const START_SELECTORS = [
  'button:has-text("Start")', 'button:has-text("Play")', 'button:has-text("시작")',
  'button:has-text("게임 시작")', 'button:has-text("PLAY")', 'button:has-text("START")',
  'button:has-text("Go")', 'button:has-text("Begin")', 'button:has-text("Tap to Start")',
  '#startBtn', '#playBtn', '#start-btn', '#play-btn',
  '.start-btn', '.play-btn', '.btn-start', '.btn-play',
  '[data-action="start"]', '[data-action="play"]',
  '.start-button', '.play-button',
  'button.start', 'button.play',
  'canvas'
];

async function testGame(browser, gameName) {
  const result = {
    game: gameName,
    url: `${BASE_URL}/${gameName}/`,
    loadOk: false,
    httpStatus: null,
    jsErrors: [],
    consoleWarnings: [],
    startButtonFound: false,
    startButtonClicked: false,
    startButtonSelector: null,
    gameScreenVisible: false,
    screenshotPath: null,
    gameScreenshotPath: null,
    loadTimeMs: 0,
    verdict: 'ERROR'
  };

  let context;
  try {
    context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3
    });
    const page = await context.newPage();
    
    page.on('pageerror', err => {
      result.jsErrors.push(err.message.substring(0, 200));
    });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        result.jsErrors.push(`[console.error] ${msg.text().substring(0, 200)}`);
      }
    });

    const startTime = Date.now();
    let response;
    try {
      response = await page.goto(result.url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 8000 
      });
      result.httpStatus = response ? response.status() : null;
      result.loadOk = response ? response.ok() : false;
    } catch (e) {
      result.jsErrors.push(`[LOAD] ${e.message.substring(0, 200)}`);
      result.verdict = 'LOAD_FAIL';
      await context.close().catch(() => {});
      return result;
    }
    result.loadTimeMs = Date.now() - startTime;

    await page.waitForTimeout(1500);

    result.screenshotPath = `${SCREENSHOT_DIR}/${gameName}-load.png`;
    await page.screenshot({ path: result.screenshotPath, fullPage: false });

    for (const selector of START_SELECTORS) {
      try {
        const el = await page.$(selector);
        if (el) {
          const isVisible = await el.isVisible();
          if (isVisible) {
            result.startButtonFound = true;
            result.startButtonSelector = selector;
            try {
              await el.click({ timeout: 2000 });
              result.startButtonClicked = true;
            } catch (clickErr) {}
            break;
          }
        }
      } catch (e) {}
    }

    await page.waitForTimeout(2000);

    result.gameScreenshotPath = `${SCREENSHOT_DIR}/${gameName}-game.png`;
    await page.screenshot({ path: result.gameScreenshotPath, fullPage: false });

    const hasCanvas = await page.$('canvas');
    const hasGameContainer = await page.$('#game, #gameContainer, .game-container, #game-area, .game-area, #gameCanvas, .game-canvas');
    result.gameScreenVisible = !!(hasCanvas || hasGameContainer);

    if (!result.loadOk) {
      result.verdict = 'LOAD_FAIL';
    } else if (result.jsErrors.length > 0) {
      const realErrors = result.jsErrors.filter(e => 
        !e.startsWith('[console.error]') && 
        (e.includes('Uncaught') || e.includes('TypeError') || e.includes('ReferenceError') || e.includes('SyntaxError'))
      );
      if (realErrors.length > 0) {
        result.verdict = result.gameScreenVisible ? 'WARN' : 'FAIL';
      } else {
        result.verdict = result.gameScreenVisible ? 'PASS' : 'FAIL';
      }
    } else if (!result.gameScreenVisible) {
      result.verdict = 'FAIL';
    } else {
      result.verdict = 'PASS';
    }

  } catch (e) {
    result.jsErrors.push(`[TEST] ${e.message.substring(0, 200)}`);
    result.verdict = 'ERROR';
  } finally {
    if (context) await context.close().catch(() => {});
  }

  return result;
}

async function main() {
  const fs = require('fs');
  
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  process.stderr.write(`\nTesting ${GAMES.length} games...\n`);
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  const results = [];
  const summary = { PASS: 0, WARN: 0, FAIL: 0, ERROR: 0, LOAD_FAIL: 0 };
  
  for (let i = 0; i < GAMES.length; i++) {
    const game = GAMES[i];
    process.stderr.write(`[${i + 1}/${GAMES.length}] ${game}...`);
    
    const result = await testGame(browser, game);
    results.push(result);
    summary[result.verdict] = (summary[result.verdict] || 0) + 1;
    
    process.stderr.write(` ${result.verdict} (${result.loadTimeMs}ms)\n`);
  }

  await browser.close();

  const output = { 
    timestamp: new Date().toISOString(),
    totalGames: GAMES.length,
    summary,
    results 
  };
  
  // Write JSON to file and stdout
  fs.writeFileSync('/tmp/game-test-results.json', JSON.stringify(output, null, 2));
  process.stdout.write(JSON.stringify(output));
  process.stderr.write(`\nDone! PASS:${summary.PASS} WARN:${summary.WARN} FAIL:${summary.FAIL} ERROR:${summary.ERROR} LOAD_FAIL:${summary.LOAD_FAIL}\n`);
}

main().catch(e => {
  process.stderr.write('Fatal: ' + e.message + '\n');
  process.exit(1);
});
