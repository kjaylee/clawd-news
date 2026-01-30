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
  if (!h.includes(f)) { console.warn(`    ⚠️ miss: "${f.substring(0,70)}"`); return h; }
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

console.log('🌐 i18n Batch 3 - Final 10 complex games\n');

// ═════════════════════════════════════════════════════════════
// DUNGEON-RUN
// ═════════════════════════════════════════════════════════════
process('dungeon-run', h => {
  h = r(h, '<title>🏃 포켓 던전 런</title>', '<title>🏃 Pocket Dungeon Run</title>');
  h = r(h, '>⚔️ 포켓 던전 런</h1>', '>⚔️ Pocket Dungeon Run</h1>');
  h = r(h, '>🎮 터치 또는 스페이스바로 점프!</p>', ' id="i18nH1">🎮 Touch or press Space to jump!</p>');
  h = r(h, '>💀 함정을 피하고 보석을 모아라!</p>', ' id="i18nH2">💀 Dodge traps and collect gems!</p>');
  h = r(h, '>모험 시작</button>', '>Start Adventure</button>');
  h = r(h, '>💀 사망</h1>', '>💀 Defeated</h1>');
  h = r(h, '>도달 거리</p>', ' id="i18nDist">Distance</p>');
  h = r(h, "`💎 ${coins}개 수집`", "`💎 ${coins} ${_i18nLang==='ko'?'개 수집':'collected'}`");
  h = r(h, '>재도전</button>', '>Retry</button>');
  
  h = inj(h, `const T = GameI18n({});`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// FISHING-TYCOON
// ═════════════════════════════════════════════════════════════
process('fishing-tycoon', h => {
  h = r(h, '<title>🎣 낚시 타이쿤</title>', '<title>🎣 Fishing Tycoon</title>');
  h = r(h, '>💰 <span id="money">0</span>원', ' id="i18nMoney">💰 <span id="money">0</span>G');
  h = r(h, '>📖 도감</button>', ' id="i18nCol">📖 Collection</button>');
  h = r(h, '>🛒 상점</button>', ' id="i18nShop">🛒 Shop</button>');
  h = r(h, '>📖 물고기 도감</h2>', ' id="i18nColTitle">📖 Fish Collection</h2>');
  h = r(h, '>🛒 낚싯대 상점</h2>', ' id="i18nShopTitle">🛒 Rod Shop</h2>');
  // Fish names
  h = ra(h, "name: '붕어'", "name: _i18nLang==='ko'?'붕어':'Crucian Carp'");
  h = ra(h, "name: '잉어'", "name: _i18nLang==='ko'?'잉어':'Carp'");
  h = ra(h, "name: '금붕어'", "name: _i18nLang==='ko'?'금붕어':'Goldfish'");
  h = ra(h, "name: '열대어'", "name: _i18nLang==='ko'?'열대어':'Tropical Fish'");
  h = ra(h, "name: '복어'", "name: _i18nLang==='ko'?'복어':'Pufferfish'");
  h = ra(h, "name: '해파리'", "name: _i18nLang==='ko'?'해파리':'Jellyfish'");
  h = ra(h, "name: '문어'", "name: _i18nLang==='ko'?'문어':'Octopus'");
  h = ra(h, "name: '오징어'", "name: _i18nLang==='ko'?'오징어':'Squid'");
  h = ra(h, "name: '돌고래'", "name: _i18nLang==='ko'?'돌고래':'Dolphin'");
  h = ra(h, "name: '고래'", "name: _i18nLang==='ko'?'고래':'Whale'");
  h = ra(h, "name: '상어'", "name: _i18nLang==='ko'?'상어':'Shark'");
  h = ra(h, "name: '범고래'", "name: _i18nLang==='ko'?'범고래':'Orca'");
  // Rod names
  h = ra(h, "name: '나무 낚싯대'", "name: _i18nLang==='ko'?'나무 낚싯대':'Wooden Rod'");
  h = ra(h, "desc: '기본 낚싯대'", "desc: _i18nLang==='ko'?'기본 낚싯대':'Basic rod'");
  h = ra(h, "name: '대나무 낚싯대'", "name: _i18nLang==='ko'?'대나무 낚싯대':'Bamboo Rod'");
  h = ra(h, "desc: '속도 10% 증가'", "desc: _i18nLang==='ko'?'속도 10% 증가':'Speed +10%'");
  h = ra(h, "name: '카본 낚싯대'", "name: _i18nLang==='ko'?'카본 낚싯대':'Carbon Rod'");
  h = ra(h, "desc: '희귀 확률 20% 증가'", "desc: _i18nLang==='ko'?'희귀 확률 20% 증가':'Rare chance +20%'");
  h = ra(h, "name: '티타늄 낚싯대'", "name: _i18nLang==='ko'?'티타늄 낚싯대':'Titanium Rod'");
  h = ra(h, "desc: '희귀 확률 50% 증가'", "desc: _i18nLang==='ko'?'희귀 확률 50% 증가':'Rare chance +50%'");
  h = ra(h, "name: '황금 낚싯대'", "name: _i18nLang==='ko'?'황금 낚싯대':'Golden Rod'");
  h = ra(h, "desc: '희귀 확률 100% 증가'", "desc: _i18nLang==='ko'?'희귀 확률 100% 증가':'Rare chance +100%'");
  h = ra(h, "name: '전설의 낚싯대'", "name: _i18nLang==='ko'?'전설의 낚싯대':'Legendary Rod'");
  h = ra(h, "desc: '전설 물고기 확률 UP!'", "desc: _i18nLang==='ko'?'전설 물고기 확률 UP!':'Legendary fish chance UP!'");
  // Rarity names
  h = ra(h, "common: '일반'", "common: _i18nLang==='ko'?'일반':'Common'");
  h = ra(h, "uncommon: '고급'", "uncommon: _i18nLang==='ko'?'고급':'Uncommon'");
  h = ra(h, "rare: '희귀'", "rare: _i18nLang==='ko'?'희귀':'Rare'");
  h = ra(h, "epic: '영웅'", "epic: _i18nLang==='ko'?'영웅':'Epic'");
  h = ra(h, "legendary: '전설'", "legendary: _i18nLang==='ko'?'전설':'Legendary'");
  
  h = inj(h, `const T = GameI18n({
      col:{en:'📖 Collection',ko:'📖 도감'}, shop:{en:'🛒 Shop',ko:'🛒 상점'},
      colTitle:{en:'📖 Fish Collection',ko:'📖 물고기 도감'}, shopTitle:{en:'🛒 Rod Shop',ko:'🛒 낚싯대 상점'}
    });
    (function(){var s=function(){
      var ids={i18nCol:'col',i18nShop:'shop',i18nColTitle:'colTitle',i18nShopTitle:'shopTitle'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// INFINITE-STACK-CLIMB
// ═════════════════════════════════════════════════════════════
process('infinite-stack-climb', h => {
  h = r(h, ">☀️ 낮</div>", ' id="i18nPhase">☀️ Day</div>');
  h = ra(h, 'title="자석 - 자동 정렬"', 'title="Magnet - Auto align"');
  h = ra(h, 'title="슬로우 - 속도 감소"', 'title="Slow - Speed down"');
  h = ra(h, 'title="2배 점수"', 'title="Double score"');
  h = r(h, '>하늘 끝까지 쌓아 올라가세요!<br>완벽한 타이밍에 탭하면 콤보 보너스!</p>',
    ' id="i18nDesc">Stack to the sky!<br>Tap with perfect timing for combo bonus!</p>');
  h = r(h, ">▶ PLAY</button>", ">▶ PLAY</button>"); // already english
  h = r(h, '>🏆 최고 기록: <span', ' id="i18nBest">🏆 Best: <span');
  h = r(h, '>🎮 조작법</h3>', ' id="i18nHow">🎮 Controls</h3>');
  h = r(h, '><strong>탭/클릭</strong> - 블록 배치</li>', '>Tap/Click - Place block</li>');
  h = r(h, '><strong>Perfect</strong> - 콤보 누적, 블록 확장</li>', '>Perfect - Combo, block expand</li>');
  h = r(h, '>높이 올라갈수록 속도 증가!</li>', '>Speed increases with height!</li>');
  h = r(h, '>배경이 낮→저녁→밤→우주로 변해요</li>', '>Background changes: Day→Sunset→Night→Space</li>');
  h = r(h, ">최고 높이: 0m</div>", ' id="i18nFH">Best Height: 0m</div>');
  h = r(h, '>최대 콤보</div>', ' id="i18nMC">Max Combo</div>');
  // Phase names in JS
  h = ra(h, "name: '☀️ 낮'", "name: _i18nLang==='ko'?'☀️ 낮':'☀️ Day'");
  h = ra(h, "name: '🌅 저녁'", "name: _i18nLang==='ko'?'🌅 저녁':'🌅 Sunset'");
  h = ra(h, "name: '🌙 밤'", "name: _i18nLang==='ko'?'🌙 밤':'🌙 Night'");
  h = ra(h, "name: '🚀 우주'", "name: _i18nLang==='ko'?'🚀 우주':'🚀 Space'");
  // Dynamic height text
  h = r(h, "`최고 높이: ${(tower.length - 1) * 3}m`", "`${_i18nLang==='ko'?'최고 높이':'Best Height'}: ${(tower.length - 1) * 3}m`");
  
  h = inj(h, `const T = GameI18n({
      desc:{en:'Stack to the sky!<br>Tap with perfect timing for combo bonus!',ko:'하늘 끝까지 쌓아 올라가세요!<br>완벽한 타이밍에 탭하면 콤보 보너스!'},
      mc:{en:'Max Combo',ko:'최대 콤보'}
    });
    (function(){var s=function(){
      document.getElementById('i18nDesc').innerHTML=T('desc');
      document.getElementById('i18nMC').textContent=T('mc');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// MERGE-TOWER
// ═════════════════════════════════════════════════════════════
process('merge-tower', h => {
  h = r(h, '<title>🗼 머지 몬스터 타워</title>', '<title>🗼 Merge Monster Tower</title>');
  h = r(h, '>🏆 점수: <span', ' id="i18nSc">🏆 Score: <span');
  h = r(h, '>⭐ 최고 Lv: <span', ' id="i18nLv">⭐ Best Lv: <span');
  h = r(h, `>다음<br>`, ' id="i18nNxt">Next<br>');
  h = r(h, '>🗼 머지 몬스터 타워</h1>', '>🗼 Merge Monster Tower</h1>');
  h = r(h, '>같은 몬스터를 합쳐서 진화시켜라!</p>', ' id="i18nSub">Merge same monsters to evolve them!</p>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, `터치/클릭으로 몬스터 드롭<br>
                같은 레벨끼리 합치면 진화!<br>
                화면 위로 넘치면 게임오버`,
    `<span id="i18nHow">Touch/click to drop monsters<br>
                Same level merges = Evolution!<br>
                Overflow = Game Over</span>`);
  h = r(h, '>💀 게임 오버</h1>', '>💀 Game Over</h1>');
  h = r(h, '>최종 점수: <span', ' id="i18nFS">Final Score: <span');
  h = r(h, '>최고 레벨: <span', ' id="i18nFL">Best Level: <span');
  h = r(h, '>다시 하기</button>', ' id="i18nRetry">Retry</button>');
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Merge same monsters to evolve them!',ko:'같은 몬스터를 합쳐서 진화시켜라!'},
      start:{en:'Start Game',ko:'게임 시작'}, retry:{en:'Retry',ko:'다시 하기'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nRetry:'retry'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// PET-SIMULATOR
// ═════════════════════════════════════════════════════════════
process('pet-simulator', h => {
  h = r(h, '<title>🐾 AI 펫 시뮬레이터</title>', '<title>🐾 AI Pet Simulator</title>');
  h = r(h, '>🐾 AI 펫 시뮬레이터</h1>', '>🐾 AI Pet Simulator</h1>');
  h = r(h, '>냥이</div>', ' id="i18nPetName">Kitty</div>');
  h = r(h, '>💤 Zzz...</span>', '>💤 Zzz...</span>');
  h = r(h, '>배고픔</div>', ' id="i18nStat1">Hunger</div>');
  h = r(h, '>행복도</div>', ' id="i18nStat2">Happiness</div>');
  h = r(h, '>에너지</div>', ' id="i18nStat3">Energy</div>');
  h = r(h, '>청결도</div>', ' id="i18nStat4">Cleanliness</div>');
  h = r(h, '>먹이주기</span>', ' id="i18nA1">Feed</span>');
  h = r(h, '>놀아주기</span>', ' id="i18nA2">Play</span>');
  h = r(h, '>재우기</span>', ' id="i18nA3">Sleep</span>');
  h = r(h, '>씻기기</span>', ' id="i18nA4">Bathe</span>');
  h = r(h, `냥이가 당신을 반갑게 맞이해요! 🐱`,
    `<span id="i18nWelcome">Kitty greets you warmly! 🐱</span>`);
  h = r(h, '>😢 펫이 떠났어요...</h2>', ' id="i18nLeft">😢 Your pet left...</h2>');
  h = r(h, '>펫의 상태를 잘 관리해주세요</p>', ' id="i18nCare">Take good care of your pet!</p>');
  h = r(h, '>다시 시작하기</button>', ' id="i18nRestart">Start Over</button>');
  // Default pet data
  h = r(h, "petName: '냥이'", "petName: _i18nLang==='ko'?'냥이':'Kitty'");
  h = r(h, "{ emoji: '🐱', name: '냥이' }", "{ emoji: '🐱', name: _i18nLang==='ko'?'냥이':'Kitty' }");
  h = r(h, "{ emoji: '🐈', name: '고양이' }", "{ emoji: '🐈', name: _i18nLang==='ko'?'고양이':'Cat' }");
  
  h = inj(h, `const T = GameI18n({
      petName:{en:'Kitty',ko:'냥이'}, stat1:{en:'Hunger',ko:'배고픔'}, stat2:{en:'Happiness',ko:'행복도'},
      stat3:{en:'Energy',ko:'에너지'}, stat4:{en:'Cleanliness',ko:'청결도'},
      a1:{en:'Feed',ko:'먹이주기'}, a2:{en:'Play',ko:'놀아주기'}, a3:{en:'Sleep',ko:'재우기'}, a4:{en:'Bathe',ko:'씻기기'},
      welcome:{en:'Kitty greets you warmly! 🐱',ko:'냥이가 당신을 반갑게 맞이해요! 🐱'},
      left:{en:'😢 Your pet left...',ko:'😢 펫이 떠났어요...'}, care:{en:'Take good care of your pet!',ko:'펫의 상태를 잘 관리해주세요'},
      restart:{en:'Start Over',ko:'다시 시작하기'}
    });
    (function(){var s=function(){
      var ids={i18nPetName:'petName',i18nStat1:'stat1',i18nStat2:'stat2',i18nStat3:'stat3',i18nStat4:'stat4',
        i18nA1:'a1',i18nA2:'a2',i18nA3:'a3',i18nA4:'a4',i18nLeft:'left',i18nCare:'care',i18nRestart:'restart'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
      var w=document.getElementById('i18nWelcome');if(w)w.textContent=T('welcome');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// SINGLE-TAP-GOLF
// ═════════════════════════════════════════════════════════════
process('single-tap-golf', h => {
  h = r(h, '<title>⛳ 싱글탭 골프</title>', '<title>⛳ Single Tap Golf</title>');
  h = r(h, '>🏌️ 스트로크: <span', ' id="i18nStr">🏌️ Strokes: <span');
  h = r(h, '>📊 총 타수: <span', ' id="i18nTotal">📊 Total: <span');
  h = r(h, '>홀 <span id="holeNum">1</span>/9</div>', ' id="i18nHole">Hole <span id="holeNum">1</span>/9</div>');
  h = r(h, '>⛳ 싱글탭 골프</h1>', '>⛳ Single Tap Golf</h1>');
  h = r(h, '>9홀 미니 골프</p>', ' id="i18nSub">9-Hole Mini Golf</p>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, `🎯 화면 터치 → 공 반대 방향으로 발사<br>
                ⏱️ 롱터치로 파워 게이지 조절<br>
                💪 원하는 파워에서 손 떼기!`,
    `<span id="i18nHow">🎯 Touch screen → Ball fires opposite direction<br>
                ⏱️ Long press to adjust power<br>
                💪 Release at desired power!</span>`);
  h = r(h, '>🏆 라운드 완료!</h1>', ' id="i18nDone">🏆 Round Complete!</h1>');
  h = r(h, '>총 타수: <span', ' id="i18nFT">Total Strokes: <span');
  h = r(h, '>다시 플레이</button>', ' id="i18nReplay">Play Again</button>');
  // Golf terms
  h = r(h, "'💦 워터!'", "_i18nLang==='ko'?'💦 워터!':'💦 Water!'");
  h = r(h, "'🎉 홀인원!!!'", "_i18nLang==='ko'?'🎉 홀인원!!!':'🎉 Hole-in-One!!!'");
  h = r(h, "'🦅 이글!'", "_i18nLang==='ko'?'🦅 이글!':'🦅 Eagle!'");
  h = r(h, "'🐦 버디!'", "_i18nLang==='ko'?'🐦 버디!':'🐦 Birdie!'");
  h = r(h, "'👍 파!'", "_i18nLang==='ko'?'👍 파!':'👍 Par!'");
  h = r(h, "'😅 보기'", "_i18nLang==='ko'?'😅 보기':'😅 Bogey'");
  h = r(h, "`🏆 ${Math.abs(diff)} 언더파!`", "`🏆 ${Math.abs(diff)} ${_i18nLang==='ko'?'언더파':'Under Par'}!`");
  h = r(h, "'👍 이븐파!'", "_i18nLang==='ko'?'👍 이븐파!':'👍 Even Par!'");
  h = r(h, "`📊 ${diff} 오버파`", "`📊 ${diff} ${_i18nLang==='ko'?'오버파':'Over Par'}`");
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'9-Hole Mini Golf',ko:'9홀 미니 골프'}, start:{en:'Start Game',ko:'게임 시작'},
      done:{en:'🏆 Round Complete!',ko:'🏆 라운드 완료!'}, replay:{en:'Play Again',ko:'다시 플레이'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nDone:'done',i18nReplay:'replay'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// SLIME-SURVIVOR
// ═════════════════════════════════════════════════════════════
process('slime-survivor', h => {
  h = r(h, '<title>🟢 슬라임 서바이버</title>', '<title>🟢 Slime Survivor</title>');
  h = r(h, '>🟢 슬라임 서바이버</h1>', '>🟢 Slime Survivor</h1>');
  h = r(h, '>픽셀 아트 에디션</p>', ' id="i18nSub">Pixel Art Edition</p>');
  h = r(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = r(h, `🖱️ 마우스/터치로 이동<br>
                ⚔️ 자동 공격!`,
    `<span id="i18nHow">🖱️ Move with mouse/touch<br>
                ⚔️ Auto attack!</span>`);
  h = r(h, '>💀 게임 오버</h1>', '>💀 Game Over</h1>');
  h = r(h, '>생존 시간: <span', ' id="i18nFT">Survival: <span');
  h = r(h, '>처치 수: <span', ' id="i18nFK">Kills: <span');
  h = r(h, '>도달 레벨: <span', ' id="i18nFL">Level: <span');
  h = r(h, '>🔄 다시 하기</button>', ' id="i18nRetry">🔄 Retry</button>');
  h = r(h, '>📢 점수 공유</button>', '>📢 Share Score</button>');
  h = r(h, '>🏠 게임 목록</button>', '>🏠 Game List</button>');
  h = r(h, '>⬆️ 레벨 업!</h2>', ' id="i18nLvUp">⬆️ Level Up!</h2>');
  h = r(h, '>💀 처치: <span', ' id="i18nKills">💀 Kills: <span');
  // Upgrade names
  h = ra(h, "name: '공격력'", "name: _i18nLang==='ko'?'공격력':'Attack'");
  h = ra(h, "desc: '+5 데미지'", "desc: _i18nLang==='ko'?'+5 데미지':'+5 damage'");
  h = ra(h, "name: '공속'", "name: _i18nLang==='ko'?'공속':'Attack Speed'");
  h = ra(h, "desc: '-50ms 쿨타임'", "desc: _i18nLang==='ko'?'-50ms 쿨타임':'-50ms cooldown'");
  h = ra(h, "name: '이동속도'", "name: _i18nLang==='ko'?'이동속도':'Move Speed'");
  h = ra(h, "desc: '+0.5 속도'", "desc: _i18nLang==='ko'?'+0.5 속도':'+0.5 speed'");
  h = ra(h, "name: '체력'", "name: _i18nLang==='ko'?'체력':'Health'");
  h = ra(h, "desc: '+25 최대체력'", "desc: _i18nLang==='ko'?'+25 최대체력':'+25 max HP'");
  h = ra(h, "name: '관통'", "name: _i18nLang==='ko'?'관통':'Piercing'");
  h = ra(h, "desc: '+1 관통'", "desc: _i18nLang==='ko'?'+1 관통':'+1 pierce'");
  h = ra(h, "name: '오비탈'", "name: _i18nLang==='ko'?'오비탈':'Orbital'");
  h = ra(h, "desc: '궤도 무기'", "desc: _i18nLang==='ko'?'궤도 무기':'Orbiting weapon'");
  h = ra(h, "name: '궤도 반경'", "name: _i18nLang==='ko'?'궤도 반경':'Orbit Radius'");
  h = ra(h, "desc: '+15 반경'", "desc: _i18nLang==='ko'?'+15 반경':'+15 radius'");
  h = ra(h, "name: '오비탈 속도'", "name: _i18nLang==='ko'?'오비탈 속도':'Orbital Speed'");
  h = ra(h, "desc: '+50% 회전속도'", "desc: _i18nLang==='ko'?'+50% 회전속도':'+50% spin speed'");
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Pixel Art Edition',ko:'픽셀 아트 에디션'}, start:{en:'Start Game',ko:'게임 시작'},
      retry:{en:'🔄 Retry',ko:'🔄 다시 하기'}, lvUp:{en:'⬆️ Level Up!',ko:'⬆️ 레벨 업!'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nStart:'start',i18nRetry:'retry',i18nLvUp:'lvUp'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// SLIME-SURVIVOR-PREMIUM (similar to slime-survivor)
// ═════════════════════════════════════════════════════════════
process('slime-survivor-premium', h => {
  h = r(h, '<title>🟢 슬라임 서바이버 PREMIUM</title>', '<title>🟢 Slime Survivor PREMIUM</title>');
  // Apply same patterns as slime-survivor (these are shared patterns)
  h = ra(h, "name: '공격력'", "name: _i18nLang==='ko'?'공격력':'Attack'");
  h = ra(h, "name: '공속'", "name: _i18nLang==='ko'?'공속':'Attack Speed'");
  h = ra(h, "name: '이동속도'", "name: _i18nLang==='ko'?'이동속도':'Move Speed'");
  h = ra(h, "name: '체력'", "name: _i18nLang==='ko'?'체력':'Health'");
  h = ra(h, "name: '관통'", "name: _i18nLang==='ko'?'관통':'Piercing'");
  h = ra(h, "name: '오비탈'", "name: _i18nLang==='ko'?'오비탈':'Orbital'");
  h = ra(h, "name: '궤도 반경'", "name: _i18nLang==='ko'?'궤도 반경':'Orbit Radius'");
  h = ra(h, "name: '오비탈 속도'", "name: _i18nLang==='ko'?'오비탈 속도':'Orbital Speed'");
  h = ra(h, "name: '넉백'", "name: _i18nLang==='ko'?'넉백':'Knockback'");
  h = ra(h, "name: '회복력'", "name: _i18nLang==='ko'?'회복력':'Recovery'");
  h = ra(h, "name: '자석'", "name: _i18nLang==='ko'?'자석':'Magnet'");
  h = ra(h, "name: '멀티샷'", "name: _i18nLang==='ko'?'멀티샷':'Multishot'");
  // desc patterns
  h = ra(h, "desc: '+5 데미지'", "desc: _i18nLang==='ko'?'+5 데미지':'+5 damage'");
  h = ra(h, "desc: '-50ms 쿨타임'", "desc: _i18nLang==='ko'?'-50ms 쿨타임':'-50ms cooldown'");
  h = ra(h, "desc: '+0.5 속도'", "desc: _i18nLang==='ko'?'+0.5 속도':'+0.5 speed'");
  h = ra(h, "desc: '+25 최대체력'", "desc: _i18nLang==='ko'?'+25 최대체력':'+25 max HP'");
  h = ra(h, "desc: '+1 관통'", "desc: _i18nLang==='ko'?'+1 관통':'+1 pierce'");
  h = ra(h, "desc: '궤도 무기'", "desc: _i18nLang==='ko'?'궤도 무기':'Orbiting weapon'");
  h = ra(h, "desc: '+15 반경'", "desc: _i18nLang==='ko'?'+15 반경':'+15 radius'");
  h = ra(h, "desc: '+50% 회전속도'", "desc: _i18nLang==='ko'?'+50% 회전속도':'+50% spin speed'");
  h = ra(h, "desc: '+50% 넉백'", "desc: _i18nLang==='ko'?'+50% 넉백':'+50% knockback'");
  h = ra(h, "desc: '초당 +1 체력'", "desc: _i18nLang==='ko'?'초당 +1 체력':'+1 HP/sec'");
  h = ra(h, "desc: '+50% 드롭 범위'", "desc: _i18nLang==='ko'?'+50% 드롭 범위':'+50% drop range'");
  h = ra(h, "desc: '+1 발사체'", "desc: _i18nLang==='ko'?'+1 발사체':'+1 projectile'");
  // HTML content
  h = ra(h, '>게임 시작</button>', ' id="i18nStart">Start Game</button>');
  h = ra(h, '>🔄 다시 하기</button>', ' id="i18nRetry">🔄 Retry</button>');
  h = ra(h, '>⬆️ 레벨 업!</h2>', ' id="i18nLvUp">⬆️ Level Up!</h2>');
  h = r(h, '>💀 게임 오버</h1>', '>💀 Game Over</h1>');
  
  h = inj(h, `const T = GameI18n({
      start:{en:'Start Game',ko:'게임 시작'}, retry:{en:'🔄 Retry',ko:'🔄 다시 하기'},
      lvUp:{en:'⬆️ Level Up!',ko:'⬆️ 레벨 업!'}
    });
    (function(){var s=function(){
      var ids={i18nStart:'start',i18nRetry:'retry',i18nLvUp:'lvUp'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// SPIN-VILLAGE
// ═════════════════════════════════════════════════════════════
process('spin-village', h => {
  h = r(h, '>🏘️ 평화로운 마을</div>', ' id="i18nVillage">🏘️ Peaceful Village</div>');
  h = r(h, '>마을 완성도: <span', ' id="i18nComp">Village Progress: <span');
  h = r(h, `🎰 스핀! (10 🪙)`, `<span id="i18nSpin">🎰 Spin! (10 🪙)</span>`);
  h = r(h, ">+500 코인!</div>", ' id="result-text">+500 coins!</div>');
  h = r(h, ">럭키!</div>", ' id="result-detail">Lucky!</div>');
  h = r(h, ">공격 중!</div>", ' id="attack-text">Attacking!</div>');
  // Building names
  h = ra(h, "name: '집'", "name: _i18nLang==='ko'?'집':'House'");
  h = ra(h, "name: '밭'", "name: _i18nLang==='ko'?'밭':'Farm'");
  h = ra(h, "name: '우물'", "name: _i18nLang==='ko'?'우물':'Well'");
  h = ra(h, "name: '대장간'", "name: _i18nLang==='ko'?'대장간':'Forge'");
  h = ra(h, "name: '창고'", "name: _i18nLang==='ko'?'창고':'Warehouse'");
  h = ra(h, "name: '탑'", "name: _i18nLang==='ko'?'탑':'Tower'");
  h = ra(h, "name: '성벽'", "name: _i18nLang==='ko'?'성벽':'Castle Wall'");
  h = ra(h, "name: '시장'", "name: _i18nLang==='ko'?'시장':'Market'");
  h = ra(h, "name: '신전'", "name: _i18nLang==='ko'?'신전':'Shrine'");
  // Village names
  h = ra(h, "'🏘️ 평화로운 마을'", "_i18nLang==='ko'?'🏘️ 평화로운 마을':'🏘️ Peaceful Village'");
  h = ra(h, "'🌲 숲속 마을'", "_i18nLang==='ko'?'🌲 숲속 마을':'🌲 Forest Village'");
  h = ra(h, "'🏔️ 산골 마을'", "_i18nLang==='ko'?'🏔️ 산골 마을':'🏔️ Mountain Village'");
  h = ra(h, "'🌊 해변 마을'", "_i18nLang==='ko'?'🌊 해변 마을':'🌊 Beach Village'");
  h = ra(h, "'🏜️ 사막 오아시스'", "_i18nLang==='ko'?'🏜️ 사막 오아시스':'🏜️ Desert Oasis'");
  h = ra(h, "'❄️ 눈꽃 마을'", "_i18nLang==='ko'?'❄️ 눈꽃 마을':'❄️ Snow Village'");
  h = ra(h, "'🌸 벚꽃 마을'", "_i18nLang==='ko'?'🌸 벚꽃 마을':'🌸 Cherry Village'");
  h = ra(h, "'🌙 달빛 마을'", "_i18nLang==='ko'?'🌙 달빛 마을':'🌙 Moonlight Village'");
  h = ra(h, "'☀️ 태양의 도시'", "_i18nLang==='ko'?'☀️ 태양의 도시':'☀️ Sun City'");
  h = ra(h, "'🌈 무지개 왕국'", "_i18nLang==='ko'?'🌈 무지개 왕국':'🌈 Rainbow Kingdom'");
  
  h = inj(h, `const T = GameI18n({
      spin:{en:'🎰 Spin! (10 🪙)',ko:'🎰 스핀! (10 🪙)'}
    });
    (function(){var s=function(){
      var sp=document.getElementById('i18nSpin');if(sp)sp.textContent=T('spin');
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

// ═════════════════════════════════════════════════════════════
// ZOMBIE-SURVIVOR
// ═════════════════════════════════════════════════════════════
process('zombie-survivor', h => {
  h = r(h, '<title>🧟 좀비 서바이버 타운</title>', '<title>🧟 Zombie Survivor Town</title>');
  h = r(h, '>에셋 로딩 중...</p>', ' id="i18nLoad">Loading assets...</p>');
  h = r(h, '>🧟 웨이브: <span', ' id="i18nWv">🧟 Wave: <span');
  h = r(h, '>💀 킬: <span', ' id="i18nKl">💀 Kills: <span');
  h = r(h, '>⭐ 레벨: <span', ' id="i18nLvl">⭐ Level: <span');
  h = r(h, '>❤️ 체력', ' id="i18nHP">❤️ HP');
  h = r(h, '>✨ 경험치', ' id="i18nXP">✨ EXP');
  h = r(h, '>🧟 좀비 서바이버 타운</h1>', '>🧟 Zombie Survivor Town</h1>');
  h = r(h, '>생존하고, 레벨업하고, 좀비를 처치하라!</p>', ' id="i18nSub">Survive, level up, and slay zombies!</p>');
  h = r(h, '>🎮 게임 시작</button>', '>🎮 Start Game</button>');
  h = r(h, '>WASD/방향키 또는 조이스틱으로 이동</p>', ' id="i18nCtrl">WASD/Arrow keys or joystick to move</p>');
  h = r(h, '>웨이브: <span', ' id="i18nFW">Wave: <span');
  h = r(h, '>킬: <span', ' id="i18nFKl">Kills: <span');
  h = r(h, '>레벨: <span', ' id="i18nFLv">Level: <span');
  h = r(h, '>🔄 다시 시작</button>', '>🔄 Restart</button>');
  h = r(h, '>⬆️ 레벨 업!</h1>', ' id="i18nLvUp">⬆️ Level Up!</h1>');
  h = r(h, '>업그레이드를 선택하세요</p>', ' id="i18nChoose">Choose an upgrade</p>');
  // Upgrade names
  h = ra(h, "name: '❤️ 체력 증가'", "name: _i18nLang==='ko'?'❤️ 체력 증가':'❤️ Max HP Up'");
  h = ra(h, "desc: '최대 체력 +30'", "desc: _i18nLang==='ko'?'최대 체력 +30':'Max HP +30'");
  h = ra(h, "name: '⚔️ 공격력 증가'", "name: _i18nLang==='ko'?'⚔️ 공격력 증가':'⚔️ Attack Up'");
  h = ra(h, "desc: '공격력 +10'", "desc: _i18nLang==='ko'?'공격력 +10':'Attack +10'");
  h = ra(h, "name: '🏃 이동 속도'", "name: _i18nLang==='ko'?'🏃 이동 속도':'🏃 Move Speed'");
  h = ra(h, "desc: '이동 속도 +1'", "desc: _i18nLang==='ko'?'이동 속도 +1':'Move speed +1'");
  h = ra(h, "name: '🎯 공격 범위'", "name: _i18nLang==='ko'?'🎯 공격 범위':'🎯 Attack Range'");
  h = ra(h, "desc: '공격 범위 +30'", "desc: _i18nLang==='ko'?'공격 범위 +30':'Attack range +30'");
  
  h = inj(h, `const T = GameI18n({
      sub:{en:'Survive, level up, and slay zombies!',ko:'생존하고, 레벨업하고, 좀비를 처치하라!'},
      ctrl:{en:'WASD/Arrow keys or joystick to move',ko:'WASD/방향키 또는 조이스틱으로 이동'},
      lvUp:{en:'⬆️ Level Up!',ko:'⬆️ 레벨 업!'}, choose:{en:'Choose an upgrade',ko:'업그레이드를 선택하세요'}
    });
    (function(){var s=function(){
      var ids={i18nSub:'sub',i18nCtrl:'ctrl',i18nLvUp:'lvUp',i18nChoose:'choose'};
      for(var id in ids){var e=document.getElementById(id);if(e)e.textContent=T(ids[id]);}
    };if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',s);else s();})();`);
  return h;
});

console.log(`\n📊 Batch 3: ${cnt} games processed`);
