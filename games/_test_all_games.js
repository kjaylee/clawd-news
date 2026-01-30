// Game QA Test Script - Playwright
// Tests all games for: JS errors, load success, basic interaction
const { chromium, devices } = require('playwright');

const GAMES = [
  'ball-sort', 'block-bounce', 'brick-breaker', 'bubble-defense', 'chain-pop',
  'color-sort', 'crystal-match', 'dice-master', 'dungeon-run', 'fishing-tycoon',
  'fruit-merge-drop', 'gravity-orbit', 'hex-drop', 'hole-swallow', 'idle-slime-merge',
  'infinite-stack-climb', 'jump-physics', 'laser-reflect', 'mahjong-zen', 'match-3d-zen',
  'merge-rush', 'merge-tower', 'micro-factory', 'neon-snake', 'number-drop',
  'orbit-striker', 'pet-simulator', 'pipe-connect', 'pixel-defense', 'polygon-dungeon',
  'power-2048', 'rhythm-pulse', 'rhythm-runner', 'rope-untangle', 'screw-sort-factory',
  'single-tap-golf', 'slide-block-match', 'slime-survivor-premium', 'stack-kingdom',
  'zen-tile-match', 'zombie-survivor'
];

const BASE_URL = 'https://eastsea.monster/games';
const iPhone = devices['iPhone 13 Pro'];

async function testGame(browser, gameId) {
  const result = { id: gameId, errors: [], warnings: [], status: 'unknown', loadTime: 0 };
  let context, page;
  
  try {
    context = await browser.newContext({
      ...iPhone,
      // Mock Telegram WebApp
      javaScriptEnabled: true,
    });
    page = await context.newPage();
    
    // Collect JS errors
    page.on('pageerror', err => {
      result.errors.push(err.message.substring(0, 200));
    });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        result.warnings.push(msg.text().substring(0, 200));
      }
    });

    const start = Date.now();
    
    // Navigate with timeout
    const response = await page.goto(`${BASE_URL}/${gameId}/`, { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    result.loadTime = Date.now() - start;
    result.httpStatus = response ? response.status() : 'no-response';
    
    if (!response || response.status() >= 400) {
      result.status = 'HTTP_ERROR';
      return result;
    }
    
    // Wait a bit for game init
    await page.waitForTimeout(2000);
    
    // Check if canvas or game container exists
    const hasCanvas = await page.evaluate(() => {
      return !!(document.querySelector('canvas') || 
                document.querySelector('#game') || 
                document.querySelector('#app') ||
                document.querySelector('.game-container') ||
                document.querySelector('[class*="game"]'));
    });
    
    // Check for visible content
    const bodyText = await page.evaluate(() => document.body.innerText.length);
    const hasVisualContent = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) return true;
      // Check if there are visible elements
      const els = document.querySelectorAll('div, button, span, h1, h2, p');
      let visible = 0;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) visible++;
      });
      return visible > 5;
    });
    
    // Check page title
    const title = await page.title();
    
    // Try basic interaction (tap center of viewport)
    try {
      await page.tap('body', { position: { x: 195, y: 422 } }); // center of iPhone 13 Pro
      await page.waitForTimeout(500);
      
      // Try tapping a start button if visible
      const startBtn = await page.$('button, [class*="start"], [class*="play"], [id*="start"], [id*="play"]');
      if (startBtn) {
        await startBtn.tap().catch(() => {});
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      // Interaction failure is not critical
    }
    
    // Check for blank screen
    const isBlank = await page.evaluate(() => {
      const body = document.body;
      if (!body) return true;
      const canvas = document.querySelector('canvas');
      if (canvas) return false; // Has canvas = not blank
      return body.children.length < 2 && body.innerText.trim().length < 10;
    });
    
    // Get file size info
    const scriptCount = await page.evaluate(() => document.querySelectorAll('script').length);
    
    result.hasCanvas = hasCanvas;
    result.hasVisualContent = hasVisualContent;
    result.isBlank = isBlank;
    result.title = title;
    result.scriptCount = scriptCount;
    result.bodyTextLen = bodyText;
    
    if (isBlank) {
      result.status = 'BLANK';
    } else if (result.errors.length > 0) {
      result.status = 'JS_ERRORS';
    } else {
      result.status = 'OK';
    }
    
  } catch (e) {
    result.status = 'CRASH';
    result.errors.push(e.message.substring(0, 200));
  } finally {
    if (context) await context.close().catch(() => {});
  }
  
  return result;
}

async function runBatch(browser, games) {
  return Promise.all(games.map(g => testGame(browser, g)));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const allResults = [];
  
  // Batch 5 at a time
  for (let i = 0; i < GAMES.length; i += 5) {
    const batch = GAMES.slice(i, i + 5);
    console.error(`Testing batch ${Math.floor(i/5)+1}/${Math.ceil(GAMES.length/5)}: ${batch.join(', ')}`);
    const results = await runBatch(browser, batch);
    allResults.push(...results);
  }
  
  await browser.close();
  
  // Output JSON
  console.log(JSON.stringify(allResults, null, 2));
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
