/**
 * East Sea Games - Cross Promotion Module
 * 각 게임 하단에 추천 게임 배너 표시 → 유저 리텐션 + 페이지뷰 증가
 * 비침습적: 게임플레이 방해 없음, 하단 슬라이드업 바
 */
(function() {
  'use strict';

  const GAMES = [
    { slug: 'ball-sort', name: 'Ball Sort', icon: '🧪', cat: 'puzzle' },
    { slug: 'screw-sort', name: 'Screw Sort', icon: '🔩', cat: 'puzzle' },
    { slug: 'block-bounce', name: 'Block Bounce', icon: '🟦', cat: 'arcade' },
    { slug: 'brick-breaker', name: 'Brick Breaker', icon: '🧱', cat: 'arcade' },
    { slug: 'bubble-defense', name: 'Bubble Defense', icon: '🫧', cat: 'strategy' },
    { slug: 'chain-pop', name: 'Chain Pop', icon: '💥', cat: 'puzzle' },
    { slug: 'conveyor-sort', name: 'Conveyor Sort', icon: '🏭', cat: 'puzzle' },
    { slug: 'crystal-match', name: 'Crystal Match', icon: '💎', cat: 'puzzle' },
    { slug: 'dice-master', name: 'Dice Master', icon: '🎲', cat: 'casual' },
    { slug: 'dungeon-run', name: 'Dungeon Run', icon: '🏰', cat: 'rpg' },
    { slug: 'fishing-tycoon', name: 'Fishing Tycoon', icon: '🎣', cat: 'idle' },
    { slug: 'fruit-merge-drop', name: 'Fruit Merge', icon: '🍉', cat: 'puzzle' },
    { slug: 'gem-cascade', name: 'Gem Cascade', icon: '💠', cat: 'puzzle' },
    { slug: 'gravity-orbit', name: 'Gravity Orbit', icon: '🪐', cat: 'arcade' },
    { slug: 'hex-drop', name: 'Hex Drop', icon: '⬡', cat: 'puzzle' },
    { slug: 'hole-swallow', name: 'Hole Swallow', icon: '🕳️', cat: 'arcade' },
    { slug: 'idle-slime-merge', name: 'Idle Slime', icon: '🟢', cat: 'idle' },
    { slug: 'infinite-stack-climb', name: 'Stack Climb', icon: '📦', cat: 'arcade' },
    { slug: 'jump-physics', name: 'Jump Physics', icon: '🦘', cat: 'arcade' },
    { slug: 'laser-reflect', name: 'Laser Reflect', icon: '🔴', cat: 'puzzle' },
    { slug: 'mahjong-zen', name: 'Mahjong Zen', icon: '🀄', cat: 'puzzle' },
    { slug: 'micro-factory', name: 'Micro Factory', icon: '⚙️', cat: 'idle' },
    { slug: 'neon-snake', name: 'Neon Snake', icon: '🐍', cat: 'arcade' },
    { slug: 'number-drop', name: 'Number Drop', icon: '🔢', cat: 'puzzle' },
    { slug: 'orbit-striker', name: 'Orbit Striker', icon: '☄️', cat: 'arcade' },
    { slug: 'pet-simulator', name: 'Pet Simulator', icon: '🐾', cat: 'casual' },
    { slug: 'pipe-connect', name: 'Pipe Connect', icon: '🔧', cat: 'puzzle' },
    { slug: 'pixel-defense', name: 'Pixel Defense', icon: '🛡️', cat: 'strategy' },
    { slug: 'polygon-dungeon', name: 'Polygon Dungeon', icon: '🔺', cat: 'rpg' },
    { slug: 'power-2048', name: 'Power 2048', icon: '🔥', cat: 'puzzle' },
    { slug: 'rhythm-pulse', name: 'Rhythm Pulse', icon: '🎵', cat: 'arcade' },
    { slug: 'rope-untangle', name: 'Rope Untangle', icon: '🪢', cat: 'puzzle' },
    { slug: 'single-tap-golf', name: 'Tap Golf', icon: '⛳', cat: 'casual' },
    { slug: 'slime-survivor-premium', name: 'Slime Survivor', icon: '👾', cat: 'rpg' },
    { slug: 'sushi-sprint', name: 'Sushi Sprint', icon: '🍣', cat: 'casual' },
    { slug: 'three-kingdoms', name: '삼국지 패왕전', icon: '⚔️', cat: 'rpg' },
    { slug: 'traffic-escape', name: 'Traffic Escape', icon: '🚗', cat: 'puzzle' },
    { slug: 'word-chain-blast', name: 'Word Chain', icon: '📝', cat: 'puzzle' },
    { slug: 'zombie-survivor', name: 'Zombie Survivor', icon: '🧟', cat: 'arcade' }
  ];

  // 현재 게임 slug 감지
  var path = window.location.pathname;
  var m = path.match(/\/games\/([^\/]+)/);
  var currentSlug = m ? m[1] : '';

  // 현재 게임 제외 + 셔플
  var others = GAMES.filter(function(g) { return g.slug !== currentSlug; });
  for (var i = others.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = others[i]; others[i] = others[j]; others[j] = tmp;
  }

  // 같은 카테고리 우선 + 다른 카테고리 혼합
  var currentGame = GAMES.find(function(g) { return g.slug === currentSlug; });
  var currentCat = currentGame ? currentGame.cat : '';
  var sameCat = others.filter(function(g) { return g.cat === currentCat; });
  var diffCat = others.filter(function(g) { return g.cat !== currentCat; });
  
  // 추천: 같은 카테고리 1-2개 + 다른 카테고리 1-2개 = 3개
  var picks = [];
  if (sameCat.length >= 2) { picks.push(sameCat[0], sameCat[1]); picks.push(diffCat[0] || sameCat[2]); }
  else if (sameCat.length === 1) { picks.push(sameCat[0], diffCat[0], diffCat[1]); }
  else { picks.push(diffCat[0], diffCat[1], diffCat[2]); }
  picks = picks.filter(Boolean).slice(0, 3);

  if (picks.length === 0) return;

  // 스타일 주입
  var style = document.createElement('style');
  style.textContent = [
    '#esp-promo{position:fixed;bottom:0;left:0;right:0;z-index:99999;',
    'background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);',
    'border-top:2px solid #e94560;padding:8px 12px;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    'display:flex;align-items:center;gap:8px;',
    'transform:translateY(100%);transition:transform .4s ease;box-shadow:0 -4px 20px rgba(0,0,0,.5)}',
    '#esp-promo.show{transform:translateY(0)}',
    '#esp-promo .esp-label{color:#e94560;font-size:11px;font-weight:700;white-space:nowrap;letter-spacing:.5px}',
    '#esp-promo .esp-games{display:flex;gap:6px;flex:1;overflow-x:auto;-webkit-overflow-scrolling:touch}',
    '#esp-promo .esp-card{display:flex;align-items:center;gap:5px;',
    'background:rgba(255,255,255,.08);border-radius:8px;padding:6px 10px;',
    'text-decoration:none;color:#fff;font-size:12px;white-space:nowrap;',
    'transition:background .2s,transform .15s;flex-shrink:0;border:1px solid rgba(255,255,255,.06)}',
    '#esp-promo .esp-card:hover{background:rgba(233,69,96,.25);transform:scale(1.03)}',
    '#esp-promo .esp-icon{font-size:18px;line-height:1}',
    '#esp-promo .esp-name{font-weight:500}',
    '#esp-promo .esp-close{color:rgba(255,255,255,.4);font-size:18px;cursor:pointer;',
    'padding:4px 6px;line-height:1;border:none;background:none;flex-shrink:0}',
    '#esp-promo .esp-close:hover{color:#fff}',
    '#esp-promo .esp-all{color:#e94560;font-size:11px;text-decoration:none;',
    'white-space:nowrap;padding:4px 8px;border:1px solid rgba(233,69,96,.4);',
    'border-radius:12px;transition:all .2s}',
    '#esp-promo .esp-all:hover{background:rgba(233,69,96,.2)}'
  ].join('\n');
  document.head.appendChild(style);

  // DOM 생성
  var bar = document.createElement('div');
  bar.id = 'esp-promo';
  
  var label = document.createElement('span');
  label.className = 'esp-label';
  label.textContent = '🎮 TRY';
  bar.appendChild(label);

  var gamesDiv = document.createElement('div');
  gamesDiv.className = 'esp-games';
  
  picks.forEach(function(g) {
    var a = document.createElement('a');
    a.className = 'esp-card';
    a.href = '/games/' + g.slug + '/';
    a.innerHTML = '<span class="esp-icon">' + g.icon + '</span><span class="esp-name">' + g.name + '</span>';
    gamesDiv.appendChild(a);
  });
  bar.appendChild(gamesDiv);

  var allLink = document.createElement('a');
  allLink.className = 'esp-all';
  allLink.href = '/games/';
  allLink.textContent = 'ALL ' + GAMES.length;
  bar.appendChild(allLink);

  var closeBtn = document.createElement('button');
  closeBtn.className = 'esp-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = function() { bar.classList.remove('show'); };
  bar.appendChild(closeBtn);

  document.body.appendChild(bar);

  // 3초 후 슬라이드업 (게임플레이 시작 방해 방지)
  setTimeout(function() { bar.classList.add('show'); }, 3000);
})();
