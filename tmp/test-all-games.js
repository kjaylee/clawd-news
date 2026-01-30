const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://eastsea.monster/games/';
const SCREENSHOT_DIR = '/home/spritz/game-qa/screenshots';
const RESULTS_FILE = '/home/spritz/game-qa/results.json';
const PROGRESS_FILE = '/home/spritz/game-qa/progress.txt';

const GAMES = [
  'ball-sort','block-bounce','brick-breaker','bubble-defense','chain-pop',
  'color-sort','conveyor-sort-factory','crystal-match','dice-master','dungeon-run',
  'fishing-tycoon','fruit-merge-drop','gravity-orbit','hex-drop','hole-swallow',
  'idle-slime-merge','infinite-stack-climb','jump-physics','laser-reflect','match-3d-zen',
  'merge-rush','merge-tower','micro-factory','neon-snake','number-drop',
  'orbit-striker','pet-simulator','pipe-connect','pixel-defense','polygon-dungeon',
  'rhythm-pulse','rhythm-runner','rope-untangle','screw-sort-factory','single-tap-golf',
  'slide-block-match','slime-survivor','slime-survivor-premium','spin-village','stack-kingdom',
  'stack-tower','zen-tile-match','zombie-survivor'
];

const FATAL_JS = ['TypeError','ReferenceError','SyntaxError','RangeError','URIError','EvalError'];

// ─────────── Screenshot pixel-diff helper ───────────
async function capturePixels(page) {
  // Returns a Buffer (PNG) and a quick hash of center-region pixels
  const buf = await page.screenshot({ fullPage: false });
  const hash = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (c) {
      try {
        const ctx = c.getContext('2d');
        if (ctx) {
          const w = Math.min(c.width, 100), h = Math.min(c.height, 100);
          const d = ctx.getImageData(c.width/2-w/2|0, c.height/2-h/2|0, w, h).data;
          let s = 0; for (let i = 0; i < d.length; i += 16) s += d[i]; return s;
        }
      } catch(e) {}
    }
    // fallback: hash the body text + element count
    return document.body.innerText.length * 1000 + document.querySelectorAll('*').length;
  });
  return { buf, hash };
}

function screenshotsAreDifferent(snap1, snap2) {
  // Quick: if pixel-hash changed → different
  if (snap1.hash !== snap2.hash) return true;
  // Byte-level: compare PNG buffers
  if (snap1.buf.length !== snap2.buf.length) return true;
  let diffs = 0;
  for (let i = 0; i < snap1.buf.length; i += 64) {
    if (snap1.buf[i] !== snap2.buf[i]) diffs++;
  }
  return diffs > 10; // more than 10 sample differences
}

// ─────────── Animation speed audit ───────────
async function auditAnimations(page) {
  return page.evaluate(() => {
    const warnings = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const cs = getComputedStyle(el);

      // Check CSS transition durations
      const td = cs.transitionDuration || '';
      if (td && td !== '0s') {
        const durations = td.split(',').map(s => parseFloat(s) * (s.includes('ms') ? 1 : 1000));
        for (const ms of durations) {
          if (ms > 0 && ms < 50) {
            const id = el.id || el.className?.toString().slice(0, 30) || el.tagName;
            warnings.push({ type: 'FAST_TRANSITION', ms, element: id, detail: `transition ${ms}ms < 50ms` });
          } else if (ms > 0 && ms < 200) {
            const id = el.id || el.className?.toString().slice(0, 30) || el.tagName;
            warnings.push({ type: 'SHORT_TRANSITION', ms, element: id, detail: `transition ${ms}ms < 200ms (guideline)` });
          }
        }
      }

      // Check CSS animation durations
      const ad = cs.animationDuration || '';
      if (ad && ad !== '0s') {
        const durations = ad.split(',').map(s => parseFloat(s) * (s.includes('ms') ? 1 : 1000));
        for (const ms of durations) {
          if (ms > 0 && ms < 50) {
            const id = el.id || el.className?.toString().slice(0, 30) || el.tagName;
            warnings.push({ type: 'FAST_ANIMATION', ms, element: id, detail: `animation ${ms}ms < 50ms (flash!)` });
          }
        }
      }
    }

    // Check for score/reward elements with too-short display
    const rewardEls = document.querySelectorAll(
      '[class*="score"], [class*="reward"], [class*="bonus"], [class*="point"], [class*="combo"], ' +
      '[id*="score"], [id*="reward"], [id*="bonus"], [id*="point"], [id*="combo"], ' +
      '.popup, .toast, .notification, .floating-text'
    );
    for (const el of rewardEls) {
      const cs2 = getComputedStyle(el);
      const ad2 = cs2.animationDuration || '';
      if (ad2 && ad2 !== '0s') {
        const ms = parseFloat(ad2) * (ad2.includes('ms') ? 1 : 1000);
        if (ms > 0 && ms < 500) {
          warnings.push({
            type: 'FAST_REWARD',
            ms,
            element: el.id || el.className?.toString().slice(0, 30) || el.tagName,
            detail: `reward/score animation ${ms}ms < 500ms`
          });
        }
      }
    }

    return warnings.slice(0, 20); // cap at 20
  });
}

// ─────────── Touch-area size audit ───────────
async function auditTouchTargets(page) {
  return page.evaluate(() => {
    const warnings = [];
    const interactiveEls = document.querySelectorAll(
      'button, a, [role="button"], [onclick], input, select, textarea, .btn, [tabindex]'
    );
    for (const el of interactiveEls) {
      if (el.offsetParent === null) continue; // hidden
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
        warnings.push({
          type: 'SMALL_TOUCH_TARGET',
          element: el.id || el.className?.toString().slice(0, 30) || el.tagName,
          text: (el.textContent || '').trim().slice(0, 20),
          size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
          detail: `Touch target ${Math.round(rect.width)}x${Math.round(rect.height)}px < 44x44px`
        });
      }
    }
    return warnings.slice(0, 15);
  });
}

// ─────────── Viewport / scroll audit ───────────
async function auditViewport(page) {
  return page.evaluate(() => {
    const warnings = [];
    const bw = document.body.scrollWidth;
    const vw = window.innerWidth;
    if (bw > vw + 5) {
      warnings.push({ type: 'HORIZONTAL_SCROLL', detail: `body ${bw}px > viewport ${vw}px` });
    }
    const bh = document.body.scrollHeight;
    const vh = window.innerHeight;
    if (bh > vh + 50) {
      warnings.push({ type: 'VERTICAL_OVERFLOW', detail: `body ${bh}px > viewport ${vh}px (by ${bh-vh}px)` });
    }
    return warnings;
  });
}

// ─────────── Find & click start (with before/after verification) ───────────
async function findAndClickStart(page, gameName, result) {
  // Capture BEFORE screenshot
  const beforeSnap = await capturePixels(page);
  fs.writeFileSync(path.join(SCREENSHOT_DIR, `${gameName}_before-start.png`), beforeSnap.buf);

  let clicked = false;
  let method = 'none';

  // Strategy 1: text-based buttons
  const textPatterns = [
    'Start', 'Play', '시작', 'START', 'PLAY', 'Begin', 'GO',
    '플레이', '게임시작', '시작하기', 'GAME START',
    'Tap to Start', 'Tap to Play', '터치하여 시작'
  ];
  for (const txt of textPatterns) {
    try {
      const btn = page.getByText(txt, { exact: false }).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click({ timeout: 2000 });
        clicked = true; method = `text:"${txt}"`;
        break;
      }
    } catch (_) {}
  }

  // Strategy 2: ID/class selectors
  if (!clicked) {
    const idSelectors = [
      '#startBtn','#playBtn','#start-btn','#play-btn',
      '#startButton','#playButton','#start-button','#play-button',
      '.start-btn','.play-btn','.start-button','.play-button',
      'button.start','button.play',
      '[data-action="start"]','[data-action="play"]',
      '#start','#play','.btn-start','.btn-play'
    ];
    for (const sel of idSelectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 300 })) {
          await btn.click({ timeout: 2000 });
          clicked = true; method = `selector:"${sel}"`;
          break;
        }
      } catch (_) {}
    }
  }

  // Strategy 3: DOM scan for matching text
  if (!clicked) {
    const found = await page.evaluate(() => {
      const startTexts = ['start','play','시작','플레이','begin','go','tap to start','tap to play','game start'];
      const els = [...document.querySelectorAll('button, a, .btn, [role="button"], div[onclick], span[onclick]')];
      for (const el of els) {
        const t = (el.textContent || '').trim().toLowerCase();
        if (startTexts.some(s => t.includes(s)) && el.offsetParent !== null) {
          el.click(); return el.id || el.className?.toString().slice(0,30) || 'dom-element';
        }
      }
      return null;
    });
    if (found) { clicked = true; method = `dom-scan:"${found}"`; }
  }

  // Strategy 4: Canvas center click (auto-start)
  if (!clicked) {
    try {
      const canvas = page.locator('canvas').first();
      if (await canvas.isVisible({ timeout: 500 })) {
        await canvas.click();
        method = 'canvas-center';
      }
    } catch (_) {}
    if (!method.includes('canvas')) {
      try { await page.mouse.click(195, 422); method = 'viewport-center'; } catch (_) {}
    }
  }

  // Wait for transition, then capture AFTER screenshot
  await page.waitForTimeout(1500);
  const afterSnap = await capturePixels(page);
  fs.writeFileSync(path.join(SCREENSHOT_DIR, `${gameName}_after-start.png`), afterSnap.buf);

  const screenChanged = screenshotsAreDifferent(beforeSnap, afterSnap);
  result.touchTest = {
    startClicked: clicked,
    method,
    screenChangedAfterClick: screenChanged
  };

  if (clicked && !screenChanged) {
    result.warnings.push(`TOUCH_NO_EFFECT: Start button clicked via ${method} but screen did not change`);
  }

  return clicked;
}

// ─────────── In-game touch interaction test ───────────
async function testGameInteraction(page, gameName, result) {
  // Capture before interaction
  const beforeSnap = await capturePixels(page);

  // Try 3 taps at different positions (center, left-center, right-center)
  const taps = [
    { x: 195, y: 422, label: 'center' },
    { x: 100, y: 422, label: 'left' },
    { x: 290, y: 300, label: 'right-upper' }
  ];

  let anyChange = false;
  const tapResults = [];

  for (const tap of taps) {
    const before = await capturePixels(page);
    await page.mouse.click(tap.x, tap.y);
    await page.waitForTimeout(500);
    const after = await capturePixels(page);
    const changed = screenshotsAreDifferent(before, after);
    tapResults.push({ ...tap, changed });
    if (changed) anyChange = true;
  }

  result.interactionTest = {
    taps: tapResults,
    anyResponseDetected: anyChange
  };

  if (!anyChange) {
    result.warnings.push('TOUCH_NO_RESPONSE: 3 taps at different positions produced no visible change');
  }

  // Capture final state
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, `${gameName}_after-interaction.png`),
    (await capturePixels(page)).buf
  );
}

// ─────────── Detect game over (5-second survival check) ───────────
async function detectGameOver(page) {
  try {
    const text = await page.evaluate(() => document.body.innerText || '');
    for (const pattern of [
      /game\s*over/i, /게임\s*오버/i, /사망/i, /dead/i, /you\s*died/i,
      /you\s*lose/i, /패배/i, /실패/i, /failed/i, /defeat/i
    ]) {
      const m = text.match(pattern);
      if (m) return m[0];
    }
    const elVisible = await page.evaluate(() => {
      for (const sel of ['#gameOver','#game-over','.game-over','.gameover','#deathScreen','.death-screen','#resultScreen','.result-screen']) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null &&
            getComputedStyle(el).display !== 'none' &&
            getComputedStyle(el).visibility !== 'hidden') return sel;
      }
      return null;
    });
    if (elVisible) return `Element visible: ${elVisible}`;
  } catch (_) {}
  return null;
}

// ─────────── Blank canvas check ───────────
async function checkBlankCanvas(page) {
  try {
    return await page.evaluate(() => {
      const c = document.querySelector('canvas');
      if (!c) return { isBlank: false, detail: 'no canvas' };
      try {
        const ctx = c.getContext('2d');
        if (!ctx) return { isBlank: false, detail: 'webgl canvas (skip pixel check)' };
        const w = Math.min(c.width, 200), h = Math.min(c.height, 200);
        if (!w || !h) return { isBlank: true, detail: 'zero-dimension canvas' };
        const d = ctx.getImageData(0, 0, w, h).data;
        const total = w * h;
        const r0 = d[0], g0 = d[1], b0 = d[2];
        let same = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (Math.abs(d[i]-r0)<5 && Math.abs(d[i+1]-g0)<5 && Math.abs(d[i+2]-b0)<5) same++;
        }
        const ratio = same / total;
        return { isBlank: ratio > 0.95, detail: `${(ratio*100).toFixed(1)}% single color (rgb(${r0},${g0},${b0}))` };
      } catch (e) { return { isBlank: false, detail: `canvas check error: ${e.message}` }; }
    });
  } catch (_) { return { isBlank: false, detail: 'evaluation failed' }; }
}

// ─────────── Main test per game ───────────
async function testGame(browser, gameName) {
  const url = `${BASE_URL}${gameName}/`;
  const result = {
    game: gameName, url,
    status: 'PASS',
    errors: [], warnings: [],
    touchTest: null, interactionTest: null,
    animationWarnings: [], touchTargetWarnings: [], viewportWarnings: [],
    screenshot: null,
    timestamp: new Date().toISOString()
  };

  let page, context;
  try {
    context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 3, isMobile: true, hasTouch: true
    });
    page = await context.newPage();

    const jsErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') jsErrors.push(msg.text()); });
    page.on('pageerror', err => { jsErrors.push(err.message || String(err)); });

    // ── STEP 1: Load ──
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      result.status = 'FAIL_LOAD';
      result.errors.push(`Load failed: ${e.message}`);
      try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${gameName}.png`) }); } catch(_){}
      await context.close(); return result;
    }

    // ── STEP 2: Fatal JS errors ──
    const fatal = jsErrors.filter(e => FATAL_JS.some(f => e.includes(f)));
    if (fatal.length > 0) {
      result.status = 'FAIL_JS_ERROR';
      result.errors.push(...fatal.slice(0, 5));
      try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${gameName}.png`) }); } catch(_){}
      await context.close(); return result;
    }

    // ── STEP 3: Viewport / scroll audit ──
    result.viewportWarnings = await auditViewport(page);

    // ── STEP 4: Touch target size audit ──
    result.touchTargetWarnings = await auditTouchTargets(page);

    // ── STEP 5: Animation speed audit (pre-start) ──
    const animWarnsPre = await auditAnimations(page);

    // ── STEP 6: Find & click start (with before/after screenshot diff) ──
    const startClicked = await findAndClickStart(page, gameName, result);

    if (!startClicked) {
      const hasContent = await page.evaluate(() => {
        return !!(document.querySelector('canvas') ||
          document.querySelector('#game,#gameContainer,.game-container,#app,#root,[id*="game"],[class*="game"]'));
      });
      if (!hasContent) {
        result.status = 'FAIL_NO_START';
        result.errors.push('No start button or game content found');
        try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${gameName}.png`) }); } catch(_){}
        await context.close(); return result;
      }
      result.warnings.push('No explicit start button found; game may auto-start');
    }

    // ── STEP 7: Wait 5 seconds (survival check) ──
    await page.waitForTimeout(5000);

    // ── STEP 8: Instant death check ──
    const gameOver = await detectGameOver(page);
    if (gameOver) {
      result.status = 'FAIL_INSTANT_DEATH';
      result.errors.push(`Game over within 5s: ${gameOver}`);
      try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${gameName}.png`) }); } catch(_){}
      await context.close(); return result;
    }

    // ── STEP 9: Blank canvas check ──
    const blank = await checkBlankCanvas(page);
    if (blank.isBlank) {
      result.status = 'FAIL_BLANK';
      result.errors.push(`Blank canvas: ${blank.detail}`);
      try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${gameName}.png`) }); } catch(_){}
      await context.close(); return result;
    }

    // ── STEP 10: In-game touch interaction test ──
    await testGameInteraction(page, gameName, result);

    // ── STEP 11: Animation speed audit (post-start) ──
    const animWarnsPost = await auditAnimations(page);
    // Merge and dedupe
    const allAnimWarns = [...animWarnsPre, ...animWarnsPost];
    const seen = new Set();
    result.animationWarnings = allAnimWarns.filter(w => {
      const key = `${w.type}:${w.element}:${w.ms}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });

    // ── STEP 12: Post-play JS error check ──
    const postFatal = jsErrors.filter(e => FATAL_JS.some(f => e.includes(f)));
    if (postFatal.length > fatal.length) {
      result.status = 'FAIL_JS_ERROR';
      result.errors.push(...postFatal.slice(fatal.length, fatal.length + 5));
      try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${gameName}.png`) }); } catch(_){}
      await context.close(); return result;
    }

    // ── Determine final status ──
    if (!startClicked && !result.interactionTest?.anyResponseDetected) {
      result.status = 'FAIL_NO_INTERACTION';
      result.errors.push('No start button found AND no touch response detected');
    } else if (!startClicked) {
      result.status = 'WARN_NO_INTERACTION';
    } else if (result.touchTest && !result.touchTest.screenChangedAfterClick) {
      result.status = 'WARN_TOUCH_NO_EFFECT';
    }

    // Promote animation issues
    const flashWarns = result.animationWarnings.filter(w => w.type === 'FAST_TRANSITION' || w.type === 'FAST_ANIMATION');
    if (flashWarns.length > 0) {
      result.warnings.push(`ANIMATION_FLASH: ${flashWarns.length} element(s) have <50ms animation (flash effect)`);
    }
    const fastRewards = result.animationWarnings.filter(w => w.type === 'FAST_REWARD');
    if (fastRewards.length > 0) {
      result.warnings.push(`FAST_REWARD: ${fastRewards.length} score/reward element(s) display < 500ms`);
    }

    if (jsErrors.length > 0 && result.status === 'PASS') {
      result.warnings.push(`${jsErrors.length} console error(s)`);
    }

    // Final screenshot
    try {
      const ssPath = path.join(SCREENSHOT_DIR, `${gameName}.png`);
      await page.screenshot({ path: ssPath });
      result.screenshot = ssPath;
    } catch (_) {}

    await context.close();
    return result;

  } catch (e) {
    result.status = 'FAIL_LOAD';
    result.errors.push(`Unexpected error: ${e.message}`);
    if (page) try { await page.screenshot({ path: path.join(SCREENSHOT_DIR,`${gameName}.png`) }); } catch(_){}
    if (context) try { await context.close(); } catch(_){}
    return result;
  }
}

// ─────────── Main runner ───────────
async function main() {
  const log = (s) => { console.log(s); fs.appendFileSync(PROGRESS_FILE, s + '\n'); };

  log(`\n🎮 Game QA Bot v2 — Testing ${GAMES.length} games`);
  log(`📅 ${new Date().toISOString()}`);
  log(`📋 Checks: load · JS errors · start button · touch verification · animation speed · touch targets · viewport\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const results = [];
  let pass = 0, fail = 0, warn = 0;

  for (let i = 0; i < GAMES.length; i++) {
    const game = GAMES[i];
    const prefix = `[${i+1}/${GAMES.length}]`;

    const r = await testGame(browser, game);
    results.push(r);

    if (r.status === 'PASS') { pass++; log(`${prefix} ✅ ${game} — PASS`); }
    else if (r.status.startsWith('WARN')) { warn++; log(`${prefix} ⚠️  ${game} — ${r.status} | ${r.warnings[0]||''}`); }
    else { fail++; log(`${prefix} ❌ ${game} — ${r.status} | ${r.errors[0]||''}`); }

    // Write interim results every 5 games
    if ((i+1) % 5 === 0 || i === GAMES.length - 1) {
      fs.writeFileSync(RESULTS_FILE, JSON.stringify({
        timestamp: new Date().toISOString(),
        total: GAMES.length, tested: i+1, pass, warn, fail, results
      }, null, 2));
    }
  }

  await browser.close();

  // Final summary
  const summary = {
    timestamp: new Date().toISOString(),
    total: GAMES.length, pass, warn, fail,
    results
  };
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(summary, null, 2));

  log(`\n${'═'.repeat(50)}`);
  log(`📊 FINAL: ${pass} PASS / ${warn} WARN / ${fail} FAIL  (total ${GAMES.length})`);
  log(`📁 ${RESULTS_FILE}`);
  log(`📸 ${SCREENSHOT_DIR}/`);

  const fails = results.filter(r => r.status.startsWith('FAIL'));
  if (fails.length) {
    log('\n❌ FAILED:');
    fails.forEach(f => log(`  ${f.game}: ${f.status} — ${f.errors[0]||'?'}`));
  }
  const warns = results.filter(r => r.status.startsWith('WARN'));
  if (warns.length) {
    log('\n⚠️  WARNINGS:');
    warns.forEach(w => log(`  ${w.game}: ${w.status} — ${w.warnings[0]||'?'}`));
  }

  // Animation summary
  const animIssues = results.filter(r => r.animationWarnings?.length > 0);
  if (animIssues.length) {
    log('\n🎬 ANIMATION ISSUES:');
    animIssues.forEach(r => {
      const flashes = r.animationWarnings.filter(w => w.type === 'FAST_TRANSITION' || w.type === 'FAST_ANIMATION');
      const fastRewards = r.animationWarnings.filter(w => w.type === 'FAST_REWARD');
      const shorts = r.animationWarnings.filter(w => w.type === 'SHORT_TRANSITION');
      const parts = [];
      if (flashes.length) parts.push(`${flashes.length} flash(<50ms)`);
      if (fastRewards.length) parts.push(`${fastRewards.length} fast-reward(<500ms)`);
      if (shorts.length) parts.push(`${shorts.length} short(<200ms)`);
      log(`  ${r.game}: ${parts.join(', ')}`);
    });
  }

  // Touch target summary
  const touchIssues = results.filter(r => r.touchTargetWarnings?.length > 0);
  if (touchIssues.length) {
    log('\n👆 SMALL TOUCH TARGETS (<44x44px):');
    touchIssues.forEach(r => {
      log(`  ${r.game}: ${r.touchTargetWarnings.length} small target(s)`);
    });
  }

  log(`\n✅ QA Bot complete at ${new Date().toISOString()}`);

  // Machine-readable JSON on last line
  console.log('\n--- RESULTS_JSON_START ---');
  console.log(JSON.stringify(summary));
  console.log('--- RESULTS_JSON_END ---');
}

main().catch(e => {
  console.error('Fatal error:', e);
  fs.appendFileSync(PROGRESS_FILE, `\n❌ FATAL: ${e.message}\n`);
  process.exit(1);
});
