#!/usr/bin/env node
/**
 * Master i18n conversion for all 37 games
 * Strategy: Default language = English in HTML
 * Korean loaded dynamically via GameI18n when detected
 */

const fs = require('fs');
const path = require('path');
const DIR = __dirname;

let totalProcessed = 0;
let totalSkipped = 0;

function process(name, fn) {
  const fp = path.join(DIR, name, 'index.html');
  let h = fs.readFileSync(fp, 'utf-8');
  if (h.includes('GameI18n(')) { console.log(`  ⏭️  ${name}`); totalSkipped++; return; }
  h = fn(h);
  fs.writeFileSync(fp, h, 'utf-8');
  // Count remaining Korean (excluding comments, i18n defs, lang checks)
  const remaining = h.split('\n').filter(l => 
    /[가-힣]/.test(l) && 
    !l.trim().startsWith('//') && !l.trim().startsWith('*') &&
    !l.includes("ko:") && !l.includes("ko'") && !l.includes('ko"') && !l.includes("==='ko'") && !l.includes('==="ko"') &&
    !l.includes('_i18nLang')
  ).length;
  console.log(`  ✅ ${name}${remaining > 0 ? ` (${remaining} Korean refs remain)` : ''}`);
  totalProcessed++;
}

// Helpers
function r(h, from, to) {
  if (!h.includes(from)) {
    console.warn(`    ⚠️  miss: "${from.substring(0,70)}..."`);
    return h;
  }
  return h.replace(from, to);
}

function rAll(h, from, to) {
  return h.split(from).join(to);
}

function inject(h, code) {
  const marker = /<script>\s*\n/;
  const m = h.match(marker);
  if (m) {
    const idx = h.indexOf(m[0]) + m[0].length;
    return h.substring(0, idx) + '    ' + code.trim() + '\n\n' + h.substring(idx);
  }
  return h.replace('</script>', code + '\n</script>');
}

// Actually, simpler injection: find the <script> that contains game code
function injectAfterScriptTag(h, code) {
  // Find last <script> tag (game script, not i18n import)
  const parts = h.split('<script>');
  if (parts.length < 2) return h;
  // The game script is the last <script> block
  const lastIdx = parts.length - 1;
  parts[lastIdx] = '\n    ' + code.trim() + '\n\n' + parts[lastIdx];
  return parts.join('<script>');
}

console.log('🌐 Full i18n conversion for all 37 games\n');

// ═══════════════════════════════════════════════════════════════
// 1. block-bounce
// ═══════════════════════════════════════════════════════════════
process('block-bounce', h => {
  h = r(h, '<title>Block Bounce - 블록 바운스</title>', '<title>Block Bounce</title>');
  h = r(h, '>최고: <span id="highScore">', ' id="i18nBest">Best: <span id="highScore">');
  h = r(h, '<p>블록을 배치해서<br>라인을 완성하세요!</p>', '<p id="i18nDesc">Place blocks to<br>complete lines!</p>');
  h = r(h, '>최고 점수</p>', ' id="i18nHS">High Score</p>');
  h = r(h, '>시작하기</button>', ' id="i18nStart">Start</button>');
  h = r(h, '>점수</p>', ' id="i18nSc">Score</p>');
  h = r(h, '>다시 하기</button>', ' id="i18nRetry">Retry</button>');
  h = r(h, "combo > 1 ? `${combo}x 콤보!` : ''", "combo > 1 ? `${combo}x ${T('combo')}` : ''");
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      best:{en:'Best: ',ko:'최고: '}, desc:{en:'Place blocks to<br>complete lines!',ko:'블록을 배치해서<br>라인을 완성하세요!'},
      hs:{en:'High Score',ko:'최고 점수'}, start:{en:'Start',ko:'시작하기'},
      sc:{en:'Score',ko:'점수'}, retry:{en:'Retry',ko:'다시 하기'}, combo:{en:'Combo!',ko:'콤보!'}
    });
    (function(){var s=function(){
      document.getElementById('i18nBest').childNodes[0].textContent=T('best');
      document.getElementById('i18nDesc').innerHTML=T('desc');
      document.getElementById('i18nHS').textContent=T('hs');
      document.getElementById('i18nStart').textContent=T('start');
      document.getElementById('i18nSc').textContent=T('sc');
      document.getElementById('i18nRetry').textContent=T('retry');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 2. chain-pop
// ═══════════════════════════════════════════════════════════════
process('chain-pop', h => {
  h = r(h, '>연결된 블록을 터치해서 터뜨리세요!</p>', ' id="i18nDesc">Pop connected blocks by tapping!</p>');
  h = r(h, '>▶ 게임 시작</button>', ' id="i18nStart">▶ Start Game</button>');
  h = r(h, '>2개 이상 연결된 같은 색 블록을 탭!</p>', ' id="i18nHint">Tap 2+ connected same-color blocks!</p>');
  h = r(h, '<h2>🎉 게임 오버</h2>', '<h2 id="i18nGO">🎉 Game Over</h2>');
  h = r(h, '>최고 기록: <span', ' id="i18nHS">High Score: <span');
  h = r(h, '>다시 하기</button>', ' id="i18nRetry">Retry</button>');
  h = r(h, '>메뉴로</button>', ' id="i18nMenu1">Menu</button>');
  h = r(h, '>레벨 <span id="level">', ' id="i18nLv">Lv <span id="level">');
  h = r(h, '>점수 <span id="score">', ' id="i18nSc">Score <span id="score">');
  h = r(h, '>목표 <span id="goal">', ' id="i18nGl">Goal <span id="goal">');
  h = r(h, '>🔀 섞기</button>', ' id="i18nShuf">🔀 Shuffle</button>');
  h = r(h, '>🏠 메뉴</button>', ' id="i18nMenu2">🏠 Menu</button>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      desc:{en:'Pop connected blocks by tapping!',ko:'연결된 블록을 터치해서 터뜨리세요!'},
      start:{en:'▶ Start Game',ko:'▶ 게임 시작'}, hint:{en:'Tap 2+ connected same-color blocks!',ko:'2개 이상 연결된 같은 색 블록을 탭!'},
      go:{en:'🎉 Game Over',ko:'🎉 게임 오버'}, hs:{en:'High Score: ',ko:'최고 기록: '},
      retry:{en:'Retry',ko:'다시 하기'}, menu:{en:'Menu',ko:'메뉴로'},
      lv:{en:'Lv ',ko:'레벨 '}, sc:{en:'Score ',ko:'점수 '}, gl:{en:'Goal ',ko:'목표 '},
      shuf:{en:'🔀 Shuffle',ko:'🔀 섞기'}, home:{en:'🏠 Menu',ko:'🏠 메뉴'}
    });
    (function(){var s=function(){
      var ids={i18nDesc:'desc',i18nStart:'start',i18nHint:'hint',i18nGO:'go',i18nRetry:'retry',i18nMenu1:'menu',i18nShuf:'shuf',i18nMenu2:'home'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      var x=document.getElementById('i18nHS');if(x)x.childNodes[0].textContent=T('hs');
      x=document.getElementById('i18nLv');if(x)x.childNodes[0].textContent=T('lv');
      x=document.getElementById('i18nSc');if(x)x.childNodes[0].textContent=T('sc');
      x=document.getElementById('i18nGl');if(x)x.childNodes[0].textContent=T('gl');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 3. rope-untangle
// ═══════════════════════════════════════════════════════════════
process('rope-untangle', h => {
  h = r(h, '<title>Rope Untangle - 로프 풀기 퍼즐</title>', '<title>Rope Untangle</title>');
  h = r(h, '>얽힌 로프를 풀어보세요!</div>', ' id="i18nSub">Untangle the ropes!</div>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, '>저장된 레벨: 1</div>', '>Saved Level: 1</div>');
  h = r(h, '>💡 힌트</button>', '>💡 Hint</button>');
  h = r(h, '>🔄 리셋</button>', '>🔄 Reset</button>');
  h = r(h, '🎉 클리어!', '<span id="i18nClear">🎉 Clear!</span>');
  h = r(h, '<small>탭하여 다음 레벨</small>', '<small id="i18nNext">Tap for next level</small>');
  h = r(h, "`저장된 레벨: ${level}`", "T('saved') + level");
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Untangle the ropes!',ko:'얽힌 로프를 풀어보세요!'}, start:{en:'Start Game',ko:'게임 시작'},
      saved:{en:'Saved Level: ',ko:'저장된 레벨: '}, clear:{en:'🎉 Clear!',ko:'🎉 클리어!'},
      next:{en:'Tap for next level',ko:'탭하여 다음 레벨'}
    });
    (function(){var s=function(){
      document.getElementById('i18nSub').textContent=T('sub');
      document.getElementById('i18nStart').textContent=T('start');
      document.getElementById('savedLevel').textContent=T('saved')+'1';
      var c=document.getElementById('i18nClear');if(c)c.textContent=T('clear');
      var n=document.getElementById('i18nNext');if(n)n.textContent=T('next');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 4. color-sort
// ═══════════════════════════════════════════════════════════════
process('color-sort', h => {
  h = r(h, '>색상을 정렬하는 힐링 퍼즐</p>', ' id="i18nSub">A relaxing color sorting puzzle</p>');
  h = r(h, '>▶ 게임 시작</button>', ' id="i18nStart">▶ Start Game</button>');
  h = r(h, '>▶ 다음 레벨</button>', ' id="i18nNext">▶ Next Level</button>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'A relaxing color sorting puzzle',ko:'색상을 정렬하는 힐링 퍼즐'},
      start:{en:'▶ Start Game',ko:'▶ 게임 시작'}, next:{en:'▶ Next Level',ko:'▶ 다음 레벨'}
    });
    (function(){var s=function(){
      document.getElementById('i18nSub').textContent=T('sub');
      document.getElementById('i18nStart').textContent=T('start');
      document.getElementById('i18nNext').textContent=T('next');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 5. pipe-connect
// ═══════════════════════════════════════════════════════════════
process('pipe-connect', h => {
  h = r(h, '>파이프를 회전시켜 물길을 연결하세요!</p>', ' id="i18nSub">Rotate pipes to connect the water flow!</p>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Rotate pipes to connect the water flow!',ko:'파이프를 회전시켜 물길을 연결하세요!'}
    });
    (function(){var e=document.getElementById('i18nSub');if(e)e.textContent=T('sub');})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 6. slide-block-match
// ═══════════════════════════════════════════════════════════════
process('slide-block-match', h => {
  h = r(h, '>블록을 밀어 3개 이상 매치하세요!</p>', ' id="i18nDesc">Slide blocks to match 3 or more!</p>');
  h = r(h, '>⏱️ 타임 어택 (60초)</button>', ' id="i18nTimed">⏱️ Time Attack (60s)</button>');
  h = r(h, '>♾️ 무한 모드</button>', ' id="i18nEndless">♾️ Endless Mode</button>');
  h = r(h, '>🏆 최고 점수: <span', ' id="i18nHSWrap">🏆 <span id="i18nHSL">High Score: </span><span');
  h = r(h, `💡 블록을 터치하고 상하좌우로 스와이프!<br>
                🔥 연쇄 매치로 고득점 노려보세요!`,
    `<span id="i18nHint">💡 Touch a block and swipe!<br>
                🔥 Chain matches for high scores!</span>`);
  h = r(h, '>🎮 게임 종료!</h2>', ' id="i18nGO">🎮 Game Over!</h2>');
  h = r(h, '>🏆 새로운 최고 점수!</p>', '>🏆 New High Score!</p>');
  h = r(h, '>🏠 메뉴로</button>', ' id="i18nMenu">🏠 Menu</button>');
  h = r(h, '>🔄 다시 하기</button>', ' id="i18nRetry">🔄 Retry</button>');
  h = rAll(h, '연쇄', "Chain");
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      desc:{en:'Slide blocks to match 3 or more!',ko:'블록을 밀어 3개 이상 매치하세요!'},
      timed:{en:'⏱️ Time Attack (60s)',ko:'⏱️ 타임 어택 (60초)'},
      endless:{en:'♾️ Endless Mode',ko:'♾️ 무한 모드'},
      hs:{en:'High Score: ',ko:'최고 점수: '}, go:{en:'🎮 Game Over!',ko:'🎮 게임 종료!'},
      menu:{en:'🏠 Menu',ko:'🏠 메뉴로'}, retry:{en:'🔄 Retry',ko:'🔄 다시 하기'},
      chain:{en:'Chain',ko:'연쇄'}
    });
    (function(){var s=function(){
      var ids={i18nDesc:'desc',i18nTimed:'timed',i18nEndless:'endless',i18nGO:'go',i18nMenu:'menu',i18nRetry:'retry'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      var h=document.getElementById('i18nHSL');if(h)h.textContent=T('hs');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 7. orbit-striker
// ═══════════════════════════════════════════════════════════════
process('orbit-striker', h => {
  h = r(h, '<title>Orbit Striker - 궤도 슈터</title>', '<title>Orbit Striker</title>');
  h = r(h, '>중력을 무기로, 우주를 지켜라</div>', ' id="i18nSub">Harness gravity to defend the cosmos</div>');
  h = r(h, '>▶ 게임 시작</button>', ' id="i18nStart">▶ Start Game</button>');
  h = r(h, `드래그하여 조준 → 놓아서 발사<br>
        궤도를 도는 적들을 모두 처치하세요!`,
    `<span id="i18nHow">Drag to aim → Release to fire<br>
        Destroy all orbiting enemies!</span>`);
  h = r(h, '>다시 시작</button>', ' id="i18nRestart">Restart</button>');
  h = r(h, '>메뉴로</button>', ' id="i18nMenu">Menu</button>');
  h = r(h, '>⚡ 파워업 선택</div>', ' id="i18nPU">⚡ Choose Power-up</div>');
  // Power-up names - use ternary for language
  h = rAll(h, "name: '멀티샷'", "name: _i18nLang==='ko'?'멀티샷':'Multishot'");
  h = rAll(h, "desc: '3방향 발사'", "desc: _i18nLang==='ko'?'3방향 발사':'3-way shot'");
  h = rAll(h, "name: '관통탄'", "name: _i18nLang==='ko'?'관통탄':'Piercing'");
  h = rAll(h, "desc: '적 관통'", "desc: _i18nLang==='ko'?'적 관통':'Pierce enemies'");
  h = rAll(h, "name: '유도탄'", "name: _i18nLang==='ko'?'유도탄':'Homing'");
  h = rAll(h, "desc: '적 추적'", "desc: _i18nLang==='ko'?'적 추적':'Track enemies'");
  h = rAll(h, "name: '대형탄'", "name: _i18nLang==='ko'?'대형탄':'Big Shot'");
  h = rAll(h, "desc: '탄환 2배'", "desc: _i18nLang==='ko'?'탄환 2배':'2x bullet size'");
  h = rAll(h, "name: '속사'", "name: _i18nLang==='ko'?'속사':'Rapid Fire'");
  h = rAll(h, "desc: '발사속도↑'", "desc: _i18nLang==='ko'?'발사속도↑':'Fire rate up'");
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Harness gravity to defend the cosmos',ko:'중력을 무기로, 우주를 지켜라'},
      start:{en:'▶ Start Game',ko:'▶ 게임 시작'}, restart:{en:'Restart',ko:'다시 시작'},
      menu:{en:'Menu',ko:'메뉴로'}, pu:{en:'⚡ Choose Power-up',ko:'⚡ 파워업 선택'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nRestart:'restart',i18nMenu:'menu',i18nPU:'pu'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 8. rhythm-runner
// ═══════════════════════════════════════════════════════════════
process('rhythm-runner', h => {
  h = r(h, '>비트에 맞춰 달려라!</p>', ' id="i18nSub">Run to the beat!</p>');
  h = r(h, '>🎮 시작하기</button>', ' id="i18nStart">🎮 Start</button>');
  h = r(h, `노트가 판정선에 도달하면<br>
                해당 레인을 터치하세요!<br>
                타이밍이 완벽할수록 높은 점수!`,
    `<span id="i18nHow">Tap the lane when notes reach<br>
                the judge line!<br>
                Better timing = higher score!</span>`);
  h = r(h, '최대 콤보: <span id="maxCombo">0</span><br>',
    '<span id="i18nMC">Max Combo: </span><span id="maxCombo">0</span><br>');
  h = r(h, '>🔄 다시하기</button>', ' id="i18nRetry">🔄 Retry</button>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Run to the beat!',ko:'비트에 맞춰 달려라!'},
      start:{en:'🎮 Start',ko:'🎮 시작하기'}, retry:{en:'🔄 Retry',ko:'🔄 다시하기'},
      mc:{en:'Max Combo: ',ko:'최대 콤보: '}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nRetry:'retry'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      var m=document.getElementById('i18nMC');if(m)m.textContent=T('mc');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 9. rhythm-pulse
// ═══════════════════════════════════════════════════════════════
process('rhythm-pulse', h => {
  h = r(h, '>비트에 맞춰 탭하세요!</p>', ' id="i18nSub">Tap to the beat!</p>');
  h = r(h, '키보드: D F J / 터치: 3레인 탭', '<span id="i18nCtrl">Keyboard: D F J / Touch: 3-lane tap</span>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Tap to the beat!',ko:'비트에 맞춰 탭하세요!'},
      ctrl:{en:'Keyboard: D F J / Touch: 3-lane tap',ko:'키보드: D F J / 터치: 3레인 탭'}
    });
    (function(){var s=function(){
      document.getElementById('i18nSub').textContent=T('sub');
      var c=document.getElementById('i18nCtrl');if(c)c.textContent=T('ctrl');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 10. gravity-orbit
// ═══════════════════════════════════════════════════════════════
process('gravity-orbit', h => {
  h = r(h, '<title>Gravity Orbit - 중력 궤도</title>', '<title>Gravity Orbit</title>');
  // All canvas-rendered text - need to replace in JS
  h = rAll(h, "'점수: '", "_i18nLang==='ko'?'점수: ':'Score: '");
  h = rAll(h, "' 체인!'", "_i18nLang==='ko'?' 체인!':' Chain!'");
  h = rAll(h, "'최고: '", "_i18nLang==='ko'?'최고: ':'Best: '");
  h = rAll(h, "'행성 궤도를 타고 우주를 여행하세요'", "_i18nLang==='ko'?'행성 궤도를 타고 우주를 여행하세요':'Ride planet orbits through space'");
  h = rAll(h, "'탭하여 시작'", "_i18nLang==='ko'?'탭하여 시작':'Tap to Start'");
  h = rAll(h, "'궤도에서 탭 → 이탈 → 다음 행성 궤도로!'", "_i18nLang==='ko'?'궤도에서 탭 → 이탈 → 다음 행성 궤도로!':'Tap in orbit → Escape → Next planet!'");
  h = rAll(h, "'별을 모으고, 소행성을 피하세요'", "_i18nLang==='ko'?'별을 모으고, 소행성을 피하세요':'Collect stars, dodge asteroids'");
  h = r(h, "`🏆 최고 점수: ${bestScore}`", "`🏆 ${_i18nLang==='ko'?'최고 점수':'High Score'}: ${bestScore}`");
  h = rAll(h, "'← 게임 목록으로'", "_i18nLang==='ko'?'← 게임 목록으로':'← Back to Games'");
  h = rAll(h, "'게임 오버'", "_i18nLang==='ko'?'게임 오버':'Game Over'");
  h = r(h, "`점수: ${score}`", "`${_i18nLang==='ko'?'점수':'Score'}: ${score}`");
  h = r(h, "`⭐ ${starsCollected}개 수집 | x${chainMultiplier} 최대 체인`", 
    "`⭐ ${starsCollected} ${_i18nLang==='ko'?'개 수집':'collected'} | x${chainMultiplier} ${_i18nLang==='ko'?'최대 체인':'max chain'}`");
  h = rAll(h, "'🎉 새 최고 점수!'", "_i18nLang==='ko'?'🎉 새 최고 점수!':'🎉 New High Score!'");
  h = r(h, "`최고 점수: ${bestScore}`", "`${_i18nLang==='ko'?'최고 점수':'High Score'}: ${bestScore}`");
  h = rAll(h, "'탭하여 다시 시작'", "_i18nLang==='ko'?'탭하여 다시 시작':'Tap to Restart'");
  
  // Inject minimal T for consistency
  h = injectAfterScriptTag(h, `const T = GameI18n({});`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 11. jump-physics
// ═══════════════════════════════════════════════════════════════
process('jump-physics', h => {
  h = r(h, '<title>🦘 점프 피직스</title>', '<title>🦘 Jump Physics</title>');
  h = r(h, '>에셋 로딩 중...</div>', ' id="i18nLoad">Loading assets...</div>');
  h = r(h, '>🏆 점수: <span', ' id="i18nScL">🏆 Score: <span');
  h = r(h, '>📏 높이: <span', ' id="i18nHtL">📏 Height: <span');
  h = r(h, '>🎯 최고: <span', ' id="i18nBsL">🎯 Best: <span');
  h = r(h, '>🦘 점프 피직스</h1>', '>🦘 Jump Physics</h1>');
  h = r(h, '>하늘 끝까지 점프!</p>', ' id="i18nSub">Jump to the sky!</p>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, `📱 터치/클릭 홀드 → 파워 충전<br>
                놓으면 점프!<br>
                플랫폼을 밟고 올라가세요`,
    `<span id="i18nHow">📱 Hold touch/click → Charge power<br>
                Release to jump!<br>
                Land on platforms and climb!</span>`);
  h = r(h, '>🎮 게임 오버</h1>', ' id="i18nGO">🎮 Game Over</h1>');
  h = r(h, '>도달 높이: <span', ' id="i18nFH">Height reached: <span');
  h = r(h, '>획득 점수: <span', ' id="i18nFS">Score: <span');
  h = r(h, '>다시 하기</button>', ' id="i18nRetry">Retry</button>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      load:{en:'Loading assets...',ko:'에셋 로딩 중...'},sub:{en:'Jump to the sky!',ko:'하늘 끝까지 점프!'},
      start:{en:'Start Game',ko:'게임 시작'},go:{en:'🎮 Game Over',ko:'🎮 게임 오버'},
      retry:{en:'Retry',ko:'다시 하기'}
    });
    (function(){var s=function(){
      var ids={i18nLoad:'load',i18nSub:'sub',i18nStart:'start',i18nGO:'go',i18nRetry:'retry'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 12. pixel-defense
// ═══════════════════════════════════════════════════════════════
process('pixel-defense', h => {
  h = r(h, '<title>픽셀 디펜스 타이쿤 | Pixel Defense Tycoon</title>', '<title>Pixel Defense Tycoon</title>');
  h = r(h, '<meta name="description" content="귀여운 픽셀 기사단으로 성을 지키는 타워 디펜스 게임">', 
    '<meta name="description" content="Defend your castle with cute pixel knights in this tower defense game">');
  h = injectAfterScriptTag(h, `const T = GameI18n({});`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 13. merge-rush
// ═══════════════════════════════════════════════════════════════
process('merge-rush', h => {
  h = r(h, '<title>Merge Rush - 머지 러시</title>', '<title>Merge Rush</title>');
  h = r(h, '>스와이프로 블록을 합쳐라!</p>', ' id="i18nSub">Swipe to merge blocks!</p>');
  h = rAll(h, '♾️ 클래식 모드', '♾️ Classic Mode');
  h = rAll(h, '⏱️ 러시 모드 (60초)', '⏱️ Rush Mode (60s)');
  h = r(h, '>💰 코인</div>', ' id="i18nCoin">💰 Coins</div>');
  h = r(h, '>🏆 클래식 베스트</div>', ' id="i18nCB">🏆 Classic Best</div>');
  h = r(h, '>⏱️ 러시 베스트</div>', ' id="i18nRB">⏱️ Rush Best</div>');
  h = r(h, '>🚀 <span id="mode-label">클래식</span></h1>',
    '>🚀 <span id="mode-label">Classic</span></h1>');
  h = r(h, '>🎉 게임 종료!</h2>', ' id="i18nGO">🎉 Game Over!</h2>');
  h = r(h, '>점수</div>', ' id="i18nScL">Score</div>');
  h = r(h, '>베스트</div>', ' id="i18nBsL">Best</div>');
  h = r(h, "textContent = `💰 +${coinsEarned} 코인 획득!`",
    "textContent = `💰 +${coinsEarned} ${_i18nLang==='ko'?'코인 획득!':'coins earned!'}`");
  h = r(h, ">▶ 다시하기</button>", ' id="i18nRestart">▶ Retry</button>');
  h = r(h, ">🏠 홈으로</button>", ' id="i18nHome">🏠 Home</button>');
  h = r(h, "isNewBest ? '🎉 새 기록!' : '⏱️ 게임 종료!'",
    "isNewBest ? (_i18nLang==='ko'?'🎉 새 기록!':'🎉 New Record!') : (_i18nLang==='ko'?'⏱️ 게임 종료!':'⏱️ Game Over!')");
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Swipe to merge blocks!',ko:'스와이프로 블록을 합쳐라!'},
      go:{en:'🎉 Game Over!',ko:'🎉 게임 종료!'}, sc:{en:'Score',ko:'점수'}, bs:{en:'Best',ko:'베스트'},
      restart:{en:'▶ Retry',ko:'▶ 다시하기'}, home:{en:'🏠 Home',ko:'🏠 홈으로'},
      coin:{en:'💰 Coins',ko:'💰 코인'}, cb:{en:'🏆 Classic Best',ko:'🏆 클래식 베스트'},
      rb:{en:'⏱️ Rush Best',ko:'⏱️ 러시 베스트'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nGO:'go',i18nScL:'sc',i18nBsL:'bs',i18nRestart:'restart',i18nHome:'home',i18nCoin:'coin',i18nCB:'cb',i18nRB:'rb'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      if(_i18nLang==='ko')document.getElementById('mode-label').textContent='클래식';
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 14. number-drop
// ═══════════════════════════════════════════════════════════════
process('number-drop', h => {
  h = r(h, '<title>Number Drop - 숫자 드롭 퍼즐</title>', '<title>Number Drop</title>');
  h = r(h, '>숫자를 떨어뜨려 합쳐라!</p>', ' id="i18nSub">Drop and merge numbers!</p>');
  h = r(h, `좌우로 드래그해서 위치 조정<br>
                터치/클릭하면 숫자가 떨어짐<br>
                같은 숫자끼리 합쳐서 2048 도전!`,
    `<span id="i18nHow">Drag left/right to position<br>
                Tap/click to drop<br>
                Merge same numbers to reach 2048!</span>`);
  h = r(h, '>↻ 다시하기</button>', ' id="i18nRetry">↻ Retry</button>');
  h = r(h, '>🏠 홈</button>', ' id="i18nHome">🏠 Home</button>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Drop and merge numbers!',ko:'숫자를 떨어뜨려 합쳐라!'},
      retry:{en:'↻ Retry',ko:'↻ 다시하기'}, home:{en:'🏠 Home',ko:'🏠 홈'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nRetry:'retry',i18nHome:'home'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═══════════════════════════════════════════════════════════════
// 15. hole-swallow
// ═══════════════════════════════════════════════════════════════
process('hole-swallow', h => {
  h = r(h, '<title>Hole Swallow - 블랙홀 아케이드</title>', '<title>Hole Swallow</title>');
  h = r(h, '>블랙홀을 움직여 모든 것을 삼켜라!</p>', ' id="i18nSub">Move the black hole and swallow everything!</p>');
  h = r(h, '>▶️ 시작</button>', ' id="i18nStart">▶️ Start</button>');
  h = r(h, "textContent = `🕳️ 크기: ${Math.floor(gameState.hole.radius)}`",
    "textContent = `🕳️ ${_i18nLang==='ko'?'크기':'Size'}: ${Math.floor(gameState.hole.radius)}`");
  h = r(h, ">🕳️ 크기: 20</div>", ' id="i18nSize">🕳️ Size: 20</div>');
  h = r(h, "'🎮 게임 종료!'", "_i18nLang==='ko'?'🎮 게임 종료!':'🎮 Game Over!'");
  h = r(h, "삼킨 물체: ${gameState.swallowed}개<br>\n                    최종 홀 크기: ${Math.floor(gameState.hole.radius)}",
    "${_i18nLang==='ko'?'삼킨 물체':'Swallowed'}: ${gameState.swallowed}<br>\n                    ${_i18nLang==='ko'?'최종 홀 크기':'Final hole size'}: ${Math.floor(gameState.hole.radius)}");
  h = r(h, '>🔄 다시하기</button>', ' id="i18nRetry">🔄 Retry</button>');
  
  h = injectAfterScriptTag(h, `const T = GameI18n({
      sub:{en:'Move the black hole and swallow everything!',ko:'블랙홀을 움직여 모든 것을 삼켜라!'},
      start:{en:'▶️ Start',ko:'▶️ 시작'}, retry:{en:'🔄 Retry',ko:'🔄 다시하기'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nRetry:'retry'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      if(_i18nLang==='ko')document.getElementById('i18nSize').textContent='🕳️ 크기: 20';
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

console.log(`\n📊 Batch complete: ${totalProcessed} processed, ${totalSkipped} skipped\n`);
