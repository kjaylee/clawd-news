#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
let cnt = 0;

function process(name, fn) {
  const fp = path.join(DIR, name, 'index.html');
  let h = fs.readFileSync(fp, 'utf-8');
  if (h.includes('GameI18n(')) { console.log(`  ⏭️  ${name}`); return; }
  h = fn(h);
  fs.writeFileSync(fp, h, 'utf-8');
  cnt++;
  console.log(`  ✅ ${name}`);
}

function r(h, f, t) {
  if (!h.includes(f)) { console.warn(`    ⚠️ miss: "${f.substring(0,60)}"`); return h; }
  return h.replace(f, t);
}
function ra(h, f, t) { return h.split(f).join(t); }

function inj(h, code) {
  const parts = h.split('<script>');
  if (parts.length < 2) return h;
  const last = parts.length - 1;
  parts[last] = '\n    ' + code.trim() + '\n\n' + parts[last];
  return parts.join('<script>');
}

console.log('🌐 i18n Batch 2 - Remaining 22 games\n');

// ═════════════════════════════════════════════════════════════
// BRICK-BREAKER (mostly English already, Korean in comments)
// ═════════════════════════════════════════════════════════════
process('brick-breaker', h => {
  // This game is already mostly English! Korean is only in comments
  h = inj(h, `const T = GameI18n({});`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// BUBBLE-DEFENSE 
// ═════════════════════════════════════════════════════════════
process('bubble-defense', h => {
  h = r(h, '<title>Bubble Defense - 버블 디펜스</title>', '<title>Bubble Defense</title>');
  h = r(h, '>버블을 쏴서 매치하고<br>타워를 세워 적을 막아라!</p>',
    ' id="i18nDesc">Shoot bubbles to match them<br>and build towers to stop enemies!</p>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, '🎯 드래그로 조준, 떼면 발사<br>', '<span id="i18nH1">🎯 Drag to aim, release to shoot</span><br>');
  h = r(h, '🏰 에너지로 타워 건설<br>', '<span id="i18nH2">🏰 Build towers with energy</span><br>');
  h = r(h, '👾 적이 기지에 도달하면 체력 감소', '<span id="i18nH3">👾 Enemies reaching base drain HP</span>');
  h = r(h, '>웨이브: <span', ' id="i18nWv">Wave: <span');
  h = r(h, '>점수: <span id="finalScore">', ' id="i18nFS">Score: <span id="finalScore">');
  h = r(h, '>처치한 적: <span id="finalKills">', ' id="i18nFK">Kills: <span id="finalKills">');
  h = r(h, '>다시 시작</button>', ' id="i18nRestart">Restart</button>');
  h = r(h, '>스테이지 클리어!</h2>', ' id="i18nSC">Stage Clear!</h2>');
  h = r(h, '>점수: <span id="winScore">', ' id="i18nWS">Score: <span id="winScore">');
  h = r(h, '>처치한 적: <span id="winKills">', ' id="i18nWK">Kills: <span id="winKills">');
  h = r(h, '>다시 플레이</button>', ' id="i18nRP">Play Again</button>');
  // Tower types
  h = ra(h, "name: '아처'", "name: _i18nLang==='ko'?'아처':'Archer'");
  h = ra(h, "name: '화염'", "name: _i18nLang==='ko'?'화염':'Fire'");
  h = ra(h, "name: '얼음'", "name: _i18nLang==='ko'?'얼음':'Ice'");
  h = ra(h, "name: '번개'", "name: _i18nLang==='ko'?'번개':'Lightning'");
  // Enemy types
  h = ra(h, "name: '슬라임'", "name: _i18nLang==='ko'?'슬라임':'Slime'");
  h = ra(h, "name: '고블린'", "name: _i18nLang==='ko'?'고블린':'Goblin'");
  h = ra(h, "name: '오크'", "name: _i18nLang==='ko'?'오크':'Orc'");
  h = ra(h, "name: '보스'", "name: _i18nLang==='ko'?'보스':'Boss'");
  
  h = inj(h, `const T = GameI18n({
      desc:{en:'Shoot bubbles to match them<br>and build towers to stop enemies!',ko:'버블을 쏴서 매치하고<br>타워를 세워 적을 막아라!'},
      start:{en:'Start Game',ko:'게임 시작'}, restart:{en:'Restart',ko:'다시 시작'},
      sc:{en:'Stage Clear!',ko:'스테이지 클리어!'}, rp:{en:'Play Again',ko:'다시 플레이'}
    });
    (function(){var s=function(){
      var ids={i18nDesc:'desc',i18nStart:'start',i18nRestart:'restart',i18nSC:'sc',i18nRP:'rp'};
      for(var id in ids){var e=document.getElementById(id);if(e){if(id==='i18nDesc')e.innerHTML=T(ids[id]);else e.textContent=T(ids[id]);}}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// CRYSTAL-MATCH (Canvas-heavy game)
// ═════════════════════════════════════════════════════════════
process('crystal-match', h => {
  // Canvas-rendered text - replace Korean with conditional
  h = ra(h, "desc:`${300+num*100}점 달성`", "desc:_i18nLang==='ko'?`${300+num*100}점 달성`:`Score ${300+num*100}`");
  h = ra(h, "desc:`${GEM_NAMES[color]} ${count}개 제거`", "desc:_i18nLang==='ko'?`${GEM_NAMES[color]} ${count}개 제거`:`Clear ${count} ${GEM_NAMES[color]}`");
  h = ra(h, "desc:`크리스탈 ${2+Math.floor(num/10)}개 생성`", "desc:_i18nLang==='ko'?`크리스탈 ${2+Math.floor(num/10)}개 생성`:`Create ${2+Math.floor(num/10)} crystals`");
  h = ra(h, "desc:`${500+num*80}점 달성`", "desc:_i18nLang==='ko'?`${500+num*80}점 달성`:`Score ${500+num*80}`");
  h = ra(h, "desc:`크리스탈 ${3+Math.floor(num/15)}개 생성`", "desc:_i18nLang==='ko'?`크리스탈 ${3+Math.floor(num/15)}개 생성`:`Create ${3+Math.floor(num/15)} crystals`");
  h = ra(h, "desc:`${800+num*100}점 달성`", "desc:_i18nLang==='ko'?`${800+num*100}점 달성`:`Score ${800+num*100}`");
  h = r(h, "'💥 행/열 클리어!'", "_i18nLang==='ko'?'💥 행/열 클리어!':'💥 Row/Col Clear!'");
  h = r(h, "'💥 범위 폭발!'", "_i18nLang==='ko'?'💥 범위 폭발!':'💥 Area Blast!'");
  h = r(h, "'💥 전체 제거!'", "_i18nLang==='ko'?'💥 전체 제거!':'💥 Clear All!'");
  h = r(h, "desc:'최고 점수 도전!'", "desc:_i18nLang==='ko'?'최고 점수 도전!':'Beat your high score!'");
  h = r(h, "'✓ 달성!'", "_i18nLang==='ko'?'✓ 달성!':'✓ Done!'");
  h = r(h, "'남은 이동'", "_i18nLang==='ko'?'남은 이동':'Moves Left'");
  h = r(h, "'♾ 무한 모드'", "_i18nLang==='ko'?'♾ 무한 모드':'♾ Endless Mode'");
  h = r(h, "'최고: '", "_i18nLang==='ko'?'최고: ':'Best: '");
  h = r(h, "'← 나가기'", "_i18nLang==='ko'?'← 나가기':'← Exit'");
  h = r(h, "'Match-3 + Merge 하이브리드 퍼즐'", "_i18nLang==='ko'?'Match-3 + Merge 하이브리드 퍼즐':'Match-3 + Merge Hybrid Puzzle'");
  h = r(h, "'🗺  레벨 모드'", "_i18nLang==='ko'?'🗺  레벨 모드':'🗺  Level Mode'");
  h = r(h, "'♾  무한 모드'", "_i18nLang==='ko'?'♾  무한 모드':'♾  Endless Mode'");
  
  h = inj(h, `const T = GameI18n({});`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// DICE-MASTER (Canvas-heavy)
// ═════════════════════════════════════════════════════════════
process('dice-master', h => {
  h = r(h, '<title>🎲 럭키 다이스 마스터</title>', '<title>🎲 Lucky Dice Master</title>');
  // Category names and descriptions
  h = ra(h, "name: '1️⃣ 원스'", "name: _i18nLang==='ko'?'1️⃣ 원스':'1️⃣ Ones'");
  h = ra(h, "desc: '1의 합계'", "desc: _i18nLang==='ko'?'1의 합계':'Sum of 1s'");
  h = ra(h, "name: '2️⃣ 투스'", "name: _i18nLang==='ko'?'2️⃣ 투스':'2️⃣ Twos'");
  h = ra(h, "desc: '2의 합계'", "desc: _i18nLang==='ko'?'2의 합계':'Sum of 2s'");
  h = ra(h, "name: '3️⃣ 쓰리스'", "name: _i18nLang==='ko'?'3️⃣ 쓰리스':'3️⃣ Threes'");
  h = ra(h, "desc: '3의 합계'", "desc: _i18nLang==='ko'?'3의 합계':'Sum of 3s'");
  h = ra(h, "name: '4️⃣ 포스'", "name: _i18nLang==='ko'?'4️⃣ 포스':'4️⃣ Fours'");
  h = ra(h, "desc: '4의 합계'", "desc: _i18nLang==='ko'?'4의 합계':'Sum of 4s'");
  h = ra(h, "name: '5️⃣ 파이브스'", "name: _i18nLang==='ko'?'5️⃣ 파이브스':'5️⃣ Fives'");
  h = ra(h, "desc: '5의 합계'", "desc: _i18nLang==='ko'?'5의 합계':'Sum of 5s'");
  h = ra(h, "name: '6️⃣ 식스'", "name: _i18nLang==='ko'?'6️⃣ 식스':'6️⃣ Sixes'");
  h = ra(h, "desc: '6의 합계'", "desc: _i18nLang==='ko'?'6의 합계':'Sum of 6s'");
  h = ra(h, "name: '🎯 트리플'", "name: _i18nLang==='ko'?'🎯 트리플':'🎯 Three of a Kind'");
  h = ra(h, "desc: '같은 눈 3개+'", "desc: _i18nLang==='ko'?'같은 눈 3개+':'3+ of same'");
  h = ra(h, "name: '🎯 포카드'", "name: _i18nLang==='ko'?'🎯 포카드':'🎯 Four of a Kind'");
  h = ra(h, "desc: '같은 눈 4개+'", "desc: _i18nLang==='ko'?'같은 눈 4개+':'4+ of same'");
  h = ra(h, "name: '🏠 풀하우스'", "name: _i18nLang==='ko'?'🏠 풀하우스':'🏠 Full House'");
  h = ra(h, "desc: '3+2 조합'", "desc: _i18nLang==='ko'?'3+2 조합':'3+2 combo'");
  h = ra(h, "name: '📈 스몰 스트레이트'", "name: _i18nLang==='ko'?'📈 스몰 스트레이트':'📈 Small Straight'");
  h = ra(h, "desc: '연속 4개'", "desc: _i18nLang==='ko'?'연속 4개':'4 in a row'");
  h = ra(h, "name: '📈 라지 스트레이트'", "name: _i18nLang==='ko'?'📈 라지 스트레이트':'📈 Large Straight'");
  h = ra(h, "desc: '연속 5개'", "desc: _i18nLang==='ko'?'연속 5개':'5 in a row'");
  h = ra(h, "name: '🌟 야찌!'", "name: _i18nLang==='ko'?'🌟 야찌!':'🌟 Yahtzee!'");
  h = ra(h, "desc: '모두 같은 눈'", "desc: _i18nLang==='ko'?'모두 같은 눈':'All same'");
  h = ra(h, "name: '🎰 찬스'", "name: _i18nLang==='ko'?'🎰 찬스':'🎰 Chance'");
  h = ra(h, "desc: '모든 눈 합계'", "desc: _i18nLang==='ko'?'모든 눈 합계':'Sum of all'");
  // Canvas text
  h = r(h, "'🎲 럭키 다이스 마스터'", "'🎲 Lucky Dice Master'");
  h = r(h, "`라운드: ${game.round}/${game.maxRounds}`", "`${_i18nLang==='ko'?'라운드':'Round'}: ${game.round}/${game.maxRounds}`");
  h = r(h, "`점수: ${game.totalScore}`", "`${_i18nLang==='ko'?'점수':'Score'}: ${game.totalScore}`");
  h = r(h, "`🏆 최고: ${game.highScore}`", "`🏆 ${_i18nLang==='ko'?'최고':'Best'}: ${game.highScore}`");
  h = r(h, "`남은 굴림: ${'🎲'.repeat(game.rollsLeft)}${'⬜'.repeat(3-game.rollsLeft)}`",
    "`${_i18nLang==='ko'?'남은 굴림':'Rolls left'}: ${'🎲'.repeat(game.rollsLeft)}${'⬜'.repeat(3-game.rollsLeft)}`");
  h = r(h, "game.rollsLeft === 3 ? '🎲 굴리기!' : `🎲 다시 굴리기 (${game.rollsLeft})`",
    "game.rollsLeft === 3 ? (_i18nLang==='ko'?'🎲 굴리기!':'🎲 Roll!') : (_i18nLang==='ko'?`🎲 다시 굴리기 (${game.rollsLeft})`:`🎲 Re-roll (${game.rollsLeft})`)");
  
  h = inj(h, `const T = GameI18n({});`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// FRUIT-MERGE-DROP (Canvas-heavy)
// ═════════════════════════════════════════════════════════════
process('fruit-merge-drop', h => {
  h = r(h, '<title>Fruit Merge Drop - 과일 합체 드롭</title>', '<title>Fruit Merge Drop</title>');
  // Fruit names (used in display)
  h = ra(h, "name:'체리'", "name:_i18nLang==='ko'?'체리':'Cherry'");
  h = ra(h, "name:'포도'", "name:_i18nLang==='ko'?'포도':'Grape'");
  h = ra(h, "name:'귤'", "name:_i18nLang==='ko'?'귤':'Orange'");
  h = ra(h, "name:'레몬'", "name:_i18nLang==='ko'?'레몬':'Lemon'");
  h = ra(h, "name:'사과'", "name:_i18nLang==='ko'?'사과':'Apple'");
  h = ra(h, "name:'배'", "name:_i18nLang==='ko'?'배':'Pear'");
  h = ra(h, "name:'복숭아'", "name:_i18nLang==='ko'?'복숭아':'Peach'");
  h = ra(h, "name:'파인애플'", "name:_i18nLang==='ko'?'파인애플':'Pineapple'");
  h = ra(h, "name:'멜론'", "name:_i18nLang==='ko'?'멜론':'Melon'");
  h = ra(h, "name:'수박'", "name:_i18nLang==='ko'?'수박':'Watermelon'");
  h = ra(h, "name:'골든'", "name:_i18nLang==='ko'?'골든':'Golden'");
  // Canvas text
  h = r(h, "'같은 과일을 합쳐 더 큰 과일을 만드세요!'", "_i18nLang==='ko'?'같은 과일을 합쳐 더 큰 과일을 만드세요!':'Merge same fruits to make bigger ones!'");
  h = r(h, "'탭하여 시작'", "_i18nLang==='ko'?'탭하여 시작':'Tap to Start'");
  h = r(h, "`🏆 최고 점수: ${highScore}`", "`🏆 ${_i18nLang==='ko'?'최고 점수':'High Score'}: ${highScore}`");
  h = r(h, "'점수'", "_i18nLang==='ko'?'점수':'Score'");
  h = r(h, "`최고 점수: ${highScore}`", "`${_i18nLang==='ko'?'최고 점수':'High Score'}: ${highScore}`");
  
  h = inj(h, `const T = GameI18n({});`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// NEON-SNAKE
// ═════════════════════════════════════════════════════════════
process('neon-snake', h => {
  h = r(h, '<meta name="description" content="네온 스네이크 - 클래식 스네이크의 모던 리메이크! 파워업, 콤보, 네온 비주얼로 즐기는 중독 아케이드">',
    '<meta name="description" content="Neon Snake - A modern remake of classic Snake! Power-ups, combos, and neon visuals">');
  h = r(h, '<meta property="og:title" content="🐍 Neon Snake — 네온 스네이크">',
    '<meta property="og:title" content="🐍 Neon Snake">');
  h = r(h, '<meta property="og:description" content="클래식 스네이크의 네온 리메이크! 파워업과 콤보로 최고점에 도전!">',
    '<meta property="og:description" content="A neon remake of classic Snake! Power-ups and combos for the highest score!">');
  h = r(h, '>클래식 스네이크의 네온 리메이크</p>', ' id="i18nSub">A neon remake of classic Snake</p>');
  h = r(h, '>⚡ 스피드</span>', ' id="i18nSp">⚡ Speed</span>');
  h = r(h, '>👻 고스트</span>', ' id="i18nGh">👻 Ghost</span>');
  h = r(h, '>▶ 시작</button>', ' id="i18nStart">▶ Start</button>');
  h = r(h, '📱 스와이프 또는 ⌨️ 방향키/WASD', '<span id="i18nCtrl">📱 Swipe or ⌨️ Arrow keys/WASD</span>');
  h = r(h, `"먹이"`, `_i18nLang==='ko'?"먹이":"Food"`);
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'A neon remake of classic Snake',ko:'클래식 스네이크의 네온 리메이크'},
      start:{en:'▶ Start',ko:'▶ 시작'}, sp:{en:'⚡ Speed',ko:'⚡ 스피드'},
      gh:{en:'👻 Ghost',ko:'👻 고스트'}, ctrl:{en:'📱 Swipe or ⌨️ Arrow keys/WASD',ko:'📱 스와이프 또는 ⌨️ 방향키/WASD'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nSp:'sp',i18nGh:'gh',i18nCtrl:'ctrl'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// MATCH-3D-ZEN
// ═════════════════════════════════════════════════════════════
process('match-3d-zen', h => {
  h = r(h, '>릴렉싱 매치 퍼즐</h2>', ' id="i18nSub">Relaxing Match Puzzle</h2>');
  h = r(h, '>레벨: <span', ' id="i18nLvW">Level: <span');
  h = r(h, '>▶ 플레이</button>', ' id="i18nPlay">▶ Play</button>');
  h = r(h, '" title="셔플"', '" title="Shuffle"');
  h = r(h, '" title="힌트"', '" title="Hint"');
  h = r(h, '" title="되돌리기"', '" title="Undo"');
  h = r(h, '>매칭 슬롯 (7칸)</div>', ' id="i18nSlot">Match Slot (7)</div>');
  h = r(h, '>🎉 클리어!</h1>', ' id="i18nClear">🎉 Clear!</h1>');
  h = r(h, '>레벨 <span id="winLevel">1</span> 완료<br>', ' id="i18nWinLv">Level <span id="winLevel">1</span> Complete<br>');
  h = r(h, '+20 코인!', '<span id="i18nCoins">+20 coins!</span>');
  h = r(h, '>다음 레벨 ▶</button>', ' id="i18nNext">Next Level ▶</button>');
  h = r(h, '>레벨 선택</button>', ' id="i18nLvSel">Level Select</button>');
  h = r(h, '>😵 게임 오버</h1>', ' id="i18nGO">😵 Game Over</h1>');
  h = r(h, '>슬롯이 가득 찼어요</h2>', ' id="i18nFull">Slot is full!</h2>');
  h = r(h, '>🔄 다시 하기</button>', ' id="i18nRetry">🔄 Retry</button>');
  h = ra(h, '>레벨 선택</button>', ' id="i18nLvSel2">Level Select</button>');
  h = r(h, '>📺 광고 보고 계속</button>', ' id="i18nAd">📺 Watch Ad to Continue</button>');
  h = r(h, '>💫 게임 오버</h2>', ' id="i18nGO2">💫 Game Over</h2>');
  h = r(h, '>선택 바가 가득 찼어요!</p>', ' id="i18nFull2">Selection bar is full!</p>');
  h = r(h, '>시간 초과!</h2>', ' id="i18nTO">Time\'s Up!</h2>');
  h = r(h, '>다시 도전해보세요</p>', ' id="i18nTryAgain">Try again!</p>');
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Relaxing Match Puzzle',ko:'릴렉싱 매치 퍼즐'}, play:{en:'▶ Play',ko:'▶ 플레이'},
      slot:{en:'Match Slot (7)',ko:'매칭 슬롯 (7칸)'}, clear:{en:'🎉 Clear!',ko:'🎉 클리어!'},
      next:{en:'Next Level ▶',ko:'다음 레벨 ▶'}, lvsel:{en:'Level Select',ko:'레벨 선택'},
      go:{en:'😵 Game Over',ko:'😵 게임 오버'}, full:{en:'Slot is full!',ko:'슬롯이 가득 찼어요'},
      retry:{en:'🔄 Retry',ko:'🔄 다시 하기'}, ad:{en:'📺 Watch Ad to Continue',ko:'📺 광고 보고 계속'},
      to:{en:"Time's Up!",ko:'시간 초과!'}, tryAgain:{en:'Try again!',ko:'다시 도전해보세요'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nPlay:'play',i18nSlot:'slot',i18nClear:'clear',i18nNext:'next',
        i18nGO:'go',i18nFull:'full',i18nRetry:'retry',i18nAd:'ad',i18nTO:'to',i18nTryAgain:'tryAgain'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      var ls=document.querySelectorAll('[id^="i18nLvSel"]');ls.forEach(function(e){e.textContent=T('lvsel');});
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// ZEN-TILE-MATCH
// ═════════════════════════════════════════════════════════════
process('zen-tile-match', h => {
  h = r(h, '<title>Zen Tile Match - 젠 타일 매치</title>', '<title>Zen Tile Match</title>');
  h = r(h, '>같은 타일 3개를 찾아 매칭하세요</p>', ' id="i18nSub">Find and match 3 identical tiles</p>');
  h = r(h, `            ▶️ 시작하기`, `            <span id="i18nStart">▶️ Start</span>`);
  h = r(h, '>레벨 <span id="levelNum">1</span></div>', ' id="i18nLv">Level <span id="levelNum">1</span></div>');
  h = r(h, '>점수: <span id="score">0</span></div>', ' id="i18nSc">Score: <span id="score">0</span></div>');
  h = r(h, '>↩️ 되돌리기</button>', '>↩️ Undo</button>');
  h = r(h, '>💡 힌트</button>', '>💡 Hint</button>');
  h = r(h, '>🔀 섞기</button>', '>🔀 Shuffle</button>');
  h = r(h, '>🎉 레벨 클리어!</h2>', ' id="i18nClear">🎉 Level Clear!</h2>');
  h = r(h, '>점수: <span id="winScore">0</span></p>', ' id="i18nWS">Score: <span id="winScore">0</span></p>');
  h = r(h, '>다음 레벨 ➡️</button>', ' id="i18nNext">Next Level ➡️</button>');
  h = ra(h, '>레벨 선택</button>', ' id="i18nLS">Level Select</button>');
  h = r(h, '>😢 시간 초과!</h2>', ' id="i18nTO">😢 Time\'s Up!</h2>');
  h = r(h, '>다시 도전해보세요</p>', ' id="i18nTry">Try again!</p>');
  h = ra(h, '>🔄 다시 시도</button>', ' id="i18nRetry">🔄 Try Again</button>');
  h = r(h, '>💫 게임 오버</h2>', ' id="i18nGO">💫 Game Over</h2>');
  h = r(h, '>선택 바가 가득 찼어요!</p>', ' id="i18nFull">Selection bar is full!</p>');
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Find and match 3 identical tiles',ko:'같은 타일 3개를 찾아 매칭하세요'},
      start:{en:'▶️ Start',ko:'▶️ 시작하기'}, clear:{en:'🎉 Level Clear!',ko:'🎉 레벨 클리어!'},
      next:{en:'Next Level ➡️',ko:'다음 레벨 ➡️'}, ls:{en:'Level Select',ko:'레벨 선택'},
      to:{en:"😢 Time's Up!",ko:'😢 시간 초과!'}, tryAgain:{en:'Try again!',ko:'다시 도전해보세요'},
      retry:{en:'🔄 Try Again',ko:'🔄 다시 시도'}, go:{en:'💫 Game Over',ko:'💫 게임 오버'},
      full:{en:'Selection bar is full!',ko:'선택 바가 가득 찼어요!'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nClear:'clear',i18nNext:'next',i18nTO:'to',i18nTry:'tryAgain',i18nGO:'go',i18nFull:'full'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      document.querySelectorAll('[id^="i18nLS"]').forEach(function(e){e.textContent=T('ls');});
      document.querySelectorAll('[id^="i18nRetry"]').forEach(function(e){e.textContent=T('retry');});
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// POLYGON-DUNGEON
// ═════════════════════════════════════════════════════════════
process('polygon-dungeon', h => {
  h = r(h, '<title>폴리곤 던전 서바이버 | Polygon Dungeon Survivor</title>', '<title>Polygon Dungeon Survivor</title>');
  h = r(h, '<meta name="description" content="POLYGON 스타일 로우폴리 던전에서 살아남는 뱀서라이크 로그라이크">',
    '<meta name="description" content="Survive in a low-poly dungeon - vampire survivors style roguelike">');
  h = r(h, '>처치: 0</div>', ' id="i18nKill">Kills: 0</div>');
  h = r(h, '>⚔️ 레벨 업!</h2>', ' id="i18nLvUp">⚔️ Level Up!</h2>');
  h = r(h, '>🏰 폴리곤 던전 서바이버</h1>', '>🏰 Polygon Dungeon Survivor</h1>');
  h = r(h, '>무한히 밀려오는 적들을 처치하고 생존하라!</p>', ' id="i18nSub">Slay endless enemies and survive!</p>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, '>이동: WASD / 방향키 / 터치</p>', ' id="i18nCtrl">Move: WASD / Arrow keys / Touch</p>');
  h = r(h, '>💀 게임 오버</h1>', '>💀 Game Over</h1>');
  h = r(h, '>생존 시간: 00:00</p>', ' id="i18nTime">Survival: 00:00</p>');
  h = r(h, '>처치 수: 0</p>', ' id="i18nKills">Kills: 0</p>');
  h = r(h, '>도달 레벨: 1</p>', ' id="i18nFLv">Level: 1</p>');
  h = r(h, '>다시 시작</button>', ' id="i18nRestart">Restart</button>');
  // Weapon names
  h = ra(h, "name: '검'", "name: _i18nLang==='ko'?'검':'Sword'");
  h = ra(h, "name: '활'", "name: _i18nLang==='ko'?'활':'Bow'");
  h = ra(h, "name: '마법'", "name: _i18nLang==='ko'?'마법':'Magic'");
  h = ra(h, "name: '오브'", "name: _i18nLang==='ko'?'오브':'Orb'");
  h = ra(h, "name: '번개'", "name: _i18nLang==='ko'?'번개':'Lightning'");
  // Upgrade names
  h = ra(h, "name: '검 강화'", "name: _i18nLang==='ko'?'검 강화':'Sword Upgrade'");
  h = ra(h, "desc: '근접 검 획득/강화'", "desc: _i18nLang==='ko'?'근접 검 획득/강화':'Get/upgrade melee sword'");
  h = ra(h, "name: '활 강화'", "name: _i18nLang==='ko'?'활 강화':'Bow Upgrade'");
  h = ra(h, "desc: '원거리 화살 획득/강화'", "desc: _i18nLang==='ko'?'원거리 화살 획득/강화':'Get/upgrade ranged arrows'");
  h = ra(h, "name: '마법 강화'", "name: _i18nLang==='ko'?'마법 강화':'Magic Upgrade'");
  h = ra(h, "desc: '범위 마법 획득/강화'", "desc: _i18nLang==='ko'?'범위 마법 획득/강화':'Get/upgrade AoE magic'");
  h = ra(h, "name: '오브 강화'", "name: _i18nLang==='ko'?'오브 강화':'Orb Upgrade'");
  h = ra(h, "desc: '회전 오브 획득/강화'", "desc: _i18nLang==='ko'?'회전 오브 획득/강화':'Get/upgrade orbiting orb'");
  h = ra(h, "name: '번개 강화'", "name: _i18nLang==='ko'?'번개 강화':'Lightning Upgrade'");
  h = ra(h, "desc: '연쇄 번개 획득/강화'", "desc: _i18nLang==='ko'?'연쇄 번개 획득/강화':'Get/upgrade chain lightning'");
  h = ra(h, "name: '이동 속도'", "name: _i18nLang==='ko'?'이동 속도':'Move Speed'");
  h = ra(h, "desc: '이동 속도 +15%'", "desc: _i18nLang==='ko'?'이동 속도 +15%':'Move speed +15%'");
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Slay endless enemies and survive!',ko:'무한히 밀려오는 적들을 처치하고 생존하라!'},
      start:{en:'Start Game',ko:'게임 시작'}, ctrl:{en:'Move: WASD / Arrow keys / Touch',ko:'이동: WASD / 방향키 / 터치'},
      restart:{en:'Restart',ko:'다시 시작'}, lvUp:{en:'⚔️ Level Up!',ko:'⚔️ 레벨 업!'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nCtrl:'ctrl',i18nRestart:'restart',i18nLvUp:'lvUp'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// IDLE-SLIME-MERGE
// ═════════════════════════════════════════════════════════════
process('idle-slime-merge', h => {
  h = r(h, '>🆕 소환: 50G</button>', ' id="i18nSummon">🆕 Summon: 50G</button>');
  h = r(h, '>⭐ 프레스티지</button>', ' id="i18nPrestige">⭐ Prestige</button>');
  h = r(h, '>🚀 2x 30s</button>', ' id="i18nBoost">🚀 2x 30s</button>');
  h = r(h, '>💤 오프라인 수익</h3>', ' id="i18nOff">💤 Offline Earnings</h3>');
  h = r(h, '>방치하는 동안 슬라임들이 열심히 일했어요!</p>', ' id="i18nOffDesc">Your slimes worked hard while you were away!</p>');
  h = r(h, '>받기!</button>', ' id="i18nClaim">Claim!</button>');
  // Slime names
  h = ra(h, "name: '물방울'", "name: _i18nLang==='ko'?'물방울':'Droplet'");
  h = ra(h, "name: '젤리'", "name: _i18nLang==='ko'?'젤리':'Jelly'");
  h = ra(h, "name: '슬라임'", "name: _i18nLang==='ko'?'슬라임':'Slime'");
  h = ra(h, "name: '젤라틴'", "name: _i18nLang==='ko'?'젤라틴':'Gelatin'");
  h = ra(h, "name: '블롭'", "name: _i18nLang==='ko'?'블롭':'Blob'");
  h = ra(h, "name: '우즈'", "name: _i18nLang==='ko'?'우즈':'Ooze'");
  h = ra(h, "name: '겔'", "name: _i18nLang==='ko'?'겔':'Gel'");
  h = ra(h, "name: '플라즈마'", "name: _i18nLang==='ko'?'플라즈마':'Plasma'");
  h = ra(h, "name: '코스믹'", "name: _i18nLang==='ko'?'코스믹':'Cosmic'");
  h = ra(h, "name: '킹슬라임'", "name: _i18nLang==='ko'?'킹슬라임':'King Slime'");
  // Dynamic text
  h = r(h, "`⭐ 프레스티지 ${state.prestigeCount}회 (보너스 +${Math.round(state.prestigeBonus * 100)}%)`",
    "`⭐ ${_i18nLang==='ko'?'프레스티지':'Prestige'} ${state.prestigeCount}${_i18nLang==='ko'?'회':''} (+${Math.round(state.prestigeBonus * 100)}%)`");
  h = r(h, "`최고 Lv.${state.highestLevel}`", "`${_i18nLang==='ko'?'최고':'Best'} Lv.${state.highestLevel}`");
  h = r(h, "`🆕 소환: ${fmt(SUMMON_COST)}G`", "`🆕 ${_i18nLang==='ko'?'소환':'Summon'}: ${fmt(SUMMON_COST)}G`");
  h = r(h, "`🚀 ${secs}s`", "`🚀 ${secs}s`");  // already English
  
  h = inj(h, `const T = GameI18n({
      summon:{en:'🆕 Summon: 50G',ko:'🆕 소환: 50G'}, prestige:{en:'⭐ Prestige',ko:'⭐ 프레스티지'},
      boost:{en:'🚀 2x 30s',ko:'🚀 2x 30s'}, off:{en:'💤 Offline Earnings',ko:'💤 오프라인 수익'},
      offDesc:{en:'Your slimes worked hard while you were away!',ko:'방치하는 동안 슬라임들이 열심히 일했어요!'},
      claim:{en:'Claim!',ko:'받기!'}
    });
    (function(){var s=function(){
      var ids={i18nSummon:'summon',i18nPrestige:'prestige',i18nBoost:'boost',i18nOff:'off',i18nOffDesc:'offDesc',i18nClaim:'claim'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// MICRO-FACTORY
// ═════════════════════════════════════════════════════════════
process('micro-factory', h => {
  h = r(h, '<title>마이크로 팩토리 | Micro Factory</title>', '<title>Micro Factory</title>');
  h = r(h, '>🏭 마이크로 팩토리</h2>', '>🏭 Micro Factory</h2>');
  h = r(h, '>미니멀 공장 자동화 시뮬레이터!</p>', ' id="i18nSub">Minimal factory automation simulator!</p>');
  h = r(h, '>⛏️ <strong>채굴기</strong>를 광석 위에 배치<br>', ' id="i18nH1">⛏️ Place <strong>Miners</strong> on ore<br>');
  h = r(h, '       ➡️ <strong>컨베이어</strong>로 자원 이동<br>', '       ➡️ Move resources with <strong>Conveyors</strong><br>');
  h = r(h, '       🔥 <strong>제련소</strong>로 광석을 주괴로<br>', '       🔥 <strong>Smelters</strong> turn ore into ingots<br>');
  h = r(h, '       💰 <strong>판매소</strong>에서 골드 획득!</p>', '       💰 <strong>Sellers</strong> earn you gold!</p>');
  h = r(h, '>자동화 라인을 최적화하세요!</p>', ' id="i18nTip">Optimize your automation line!</p>');
  h = r(h, '>▶ 게임 시작</button>', ' id="i18nStart">▶ Start Game</button>');
  // Resource names
  h = ra(h, "name: '철광석'", "name: _i18nLang==='ko'?'철광석':'Iron Ore'");
  h = ra(h, "name: '구리광석'", "name: _i18nLang==='ko'?'구리광석':'Copper Ore'");
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Minimal factory automation simulator!',ko:'미니멀 공장 자동화 시뮬레이터!'},
      tip:{en:'Optimize your automation line!',ko:'자동화 라인을 최적화하세요!'},
      start:{en:'▶ Start Game',ko:'▶ 게임 시작'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nTip:'tip',i18nStart:'start'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// SCREW-SORT-FACTORY
// ═════════════════════════════════════════════════════════════
process('screw-sort-factory', h => {
  h = r(h, '>← 게임 목록</a>', '>← Games</a>');
  h = r(h, '" title="되돌리기">', '" title="Undo">');
  h = r(h, '" title="힌트">', '" title="Hint">');
  h = r(h, '" title="팩토리">', '" title="Factory">');
  h = r(h, '" title="설정">', '" title="Settings">');
  h = r(h, '>나사를 색상별로 정리하세요!</p>', ' id="i18nSub">Sort screws by color!</p>');
  h = r(h, '>▶️ 플레이</button>', ' id="i18nPlay">▶️ Play</button>');
  h = r(h, '>🏭 팩토리</button>', ' id="i18nFact">🏭 Factory</button>');
  h = r(h, '>🎉 클리어!</h1>', ' id="i18nClear">🎉 Clear!</h1>');
  h = r(h, '>레벨 <span id="winLevel">1</span> 완료</h2>', ' id="i18nWinLv">Level <span id="winLevel">1</span> Complete</h2>');
  h = r(h, '>볼트 획득</div>', ' id="i18nBolts">Bolts Earned</div>');
  h = r(h, '>이동 횟수</div>', ' id="i18nMoves">Moves</div>');
  h = r(h, '⭐ 퍼펙트 클리어! 보너스 x2', '<span id="i18nPerf">⭐ Perfect Clear! Bonus x2</span>');
  h = r(h, '>다음 레벨 →</button>', ' id="i18nNext">Next Level →</button>');
  h = r(h, '>🏭 팩토리</button>', ' id="i18nFact2">🏭 Factory</button>');
  h = r(h, '>🏭 나의 팩토리</h1>', ' id="i18nMyFact">🏭 My Factory</h1>');
  h = r(h, '>자동 수입: <span', ' id="i18nIncome">Auto Income: <span');
  h = r(h, '볼트/분', 'bolts/min');
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Sort screws by color!',ko:'나사를 색상별로 정리하세요!'},
      play:{en:'▶️ Play',ko:'▶️ 플레이'}, fact:{en:'🏭 Factory',ko:'🏭 팩토리'},
      clear:{en:'🎉 Clear!',ko:'🎉 클리어!'}, bolts:{en:'Bolts Earned',ko:'볼트 획득'},
      moves:{en:'Moves',ko:'이동 횟수'}, perf:{en:'⭐ Perfect Clear! Bonus x2',ko:'⭐ 퍼펙트 클리어! 보너스 x2'},
      next:{en:'Next Level →',ko:'다음 레벨 →'}, myFact:{en:'🏭 My Factory',ko:'🏭 나의 팩토리'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nPlay:'play',i18nFact:'fact',i18nClear:'clear',i18nBolts:'bolts',
        i18nMoves:'moves',i18nPerf:'perf',i18nNext:'next',i18nFact2:'fact',i18nMyFact:'myFact'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

console.log(`\n📊 Batch 2: ${cnt} games processed`);
