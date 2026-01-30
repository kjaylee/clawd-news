# 게임 브라우저 QA 결과 (2026-01-30)

## 테스트 환경
- **브라우저:** clawd 프로필 (Chrome, Mac Studio)
- **URL:** `https://eastsea.monster/games/{game}/`
- **방법:** navigate → console(error) → snapshot → 시작버튼 클릭 → 3초 대기 → snapshot/screenshot 확인
- **테스터:** AI (subagent browser-qa-clawd)

## 요약
- **PASS: 43**
- **FAIL: 0**

## 전체 결과

| # | 게임 | 결과 | 렌더링 | 비고 |
|---|------|------|--------|------|
| 1 | ball-sort | ✅ PASS | DOM | Level 1 직접 로드, 퍼즐 UI 정상 |
| 2 | block-bounce | ✅ PASS | Canvas | 시작 버튼 → 게임 플레이 (점수 UI 표시) |
| 3 | brick-breaker | ✅ PASS | Canvas | START 버튼 → 게임 시작, Score/Level/Lives 표시 |
| 4 | bubble-defense | ✅ PASS | Canvas | 게임 시작 버튼 → 캔버스 게임 실행 |
| 5 | chain-pop | ✅ PASS | DOM | 게임 시작 → Level 1 점수 0 목표 1000, 셔플/메뉴 버튼 |
| 6 | color-sort | ✅ PASS | DOM | 게임 시작 → Level 1, Undo/Restart/Hint 버튼 |
| 7 | conveyor-sort-factory | ✅ PASS | Canvas | PLAY 버튼, HIGH SCORE 표시 (캔버스 렌더링) |
| 8 | crystal-match | ✅ PASS | Canvas | 레벨 모드 / 무한 모드 버튼 표시 |
| 9 | dice-master | ✅ PASS | Canvas | 직접 게임 시작 (주사위 5개, 점수판 표시) |
| 10 | dungeon-run | ✅ PASS | DOM | Start Adventure → 50m 달린 후 Defeated (입력 없이 정상) |
| 11 | fishing-tycoon | ✅ PASS | DOM | 직접 로드 (도감/상점 버튼, 캐스팅 안내) |
| 12 | fruit-merge-drop | ✅ PASS | Canvas | 타이틀 화면 + "탭하여 시작" 표시 |
| 13 | gravity-orbit | ✅ PASS | Canvas | 타이틀 + 행성 그래픽 + "탭하여 시작" |
| 14 | hex-drop | ✅ PASS | Canvas | 타이틀 + 헥사곤 + TAP TO START |
| 15 | hole-swallow | ✅ PASS | DOM→Canvas | Start 버튼 → 캔버스 게임 실행 |
| 16 | idle-slime-merge | ✅ PASS | DOM | 직접 로드 (소환/Prestige/부스트 버튼) |
| 17 | infinite-stack-climb | ✅ PASS | DOM | PLAY → 게임 실행 (파워업 버튼 3개 표시) |
| 18 | jump-physics | ✅ PASS | Canvas | Start Game → 캔버스 게임 실행 |
| 19 | laser-reflect | ✅ PASS | DOM | Level 1/15, FIRE/Reset 버튼 정상 |
| 20 | match-3d-zen | ✅ PASS | DOM | 플레이 → 동물 이모지 타일 18개 + 매칭 슬롯 |
| 21 | merge-rush | ✅ PASS | DOM | Classic/Rush 모드 선택 + 코인/베스트 표시 |
| 22 | merge-tower | ✅ PASS | Canvas | 게임 시작 → 캔버스 게임 실행 |
| 23 | micro-factory | ✅ PASS | Canvas | 게임 시작 → 캔버스 게임 실행 |
| 24 | neon-snake | ✅ PASS | DOM | Start → 3초 후 Game Over (입력 없이 벽 충돌, 정상) |
| 25 | number-drop | ✅ PASS | DOM+Canvas | PLAY → 게임 실행 (숫자공 2 대기, 빈 보드) |
| 26 | orbit-striker | ✅ PASS | Canvas | 게임 시작 → Wave 1, 적 궤도 표시 |
| 27 | pet-simulator | ✅ PASS | DOM | 직접 로드 (먹이/놀기/재우기/씻기기 버튼) |
| 28 | pipe-connect | ✅ PASS | DOM | Level 1, Play 버튼 정상 |
| 29 | pixel-defense | ✅ PASS | DOM | START 버튼 + 타워 구매 UI (6종 타워) |
| 30 | polygon-dungeon | ✅ PASS | Canvas | 게임 시작 → 캔버스 게임 실행 |
| 31 | rhythm-pulse | ✅ PASS | Canvas | PLAY → 캔버스 게임 실행 (BPM 120) |
| 32 | rhythm-runner | ✅ PASS | Canvas | 시작하기 → 3레인 노트 낙하 (Score: 0, Time: 51s) |
| 33 | rope-untangle | ✅ PASS | DOM+Canvas | 게임 시작 → Level 1 로프 퍼즐 표시 |
| 34 | screw-sort-factory | ✅ PASS | DOM+Canvas | Play → Level 1 나사 정렬 퍼즐 |
| 35 | single-tap-golf | ✅ PASS | DOM | Hole 1/9, Par 3, 게임 시작 버튼 |
| 36 | slide-block-match | ✅ PASS | DOM | 타임어택/무한 모드 선택 |
| 37 | slime-survivor | ✅ PASS | Canvas | 게임 시작 → 캔버스 게임 실행 |
| 38 | slime-survivor-premium | ✅ PASS | Canvas | 게임 시작 → 0:09초 플레이, 적 스폰 확인 |
| 39 | spin-village | ✅ PASS | DOM | 직접 로드 (스핀 버튼, 마을 건물 9개) |
| 40 | stack-kingdom | ✅ PASS | Canvas | 시작 → 캔버스 게임 실행 |
| 41 | stack-tower | ✅ PASS | DOM | PLAY 버튼 + Best 점수 표시 |
| 42 | zen-tile-match | ✅ PASS | DOM | 50레벨 선택 화면 + 시작하기 버튼 |
| 43 | zombie-survivor | ✅ PASS | Canvas | Start Game → 캔버스 게임 실행 |

## JS 에러
- 모든 게임에서 `favicon.ico` 404만 발견 (치명적 에러 없음)
- TypeError, ReferenceError, SyntaxError: **없음**

## 참고사항
- 약 절반의 게임이 Canvas 기반 렌더링 (DOM snapshot 비어있음, screenshot으로 확인)
- Canvas 게임: snapshot이 비어있어도 screenshot에서 정상 렌더링 확인
- 자동 실행 게임 (입력 없이): dungeon-run(50m 후 사망), neon-snake(벽 충돌) — 입력 없는 상태에서의 정상 동작
- number-drop, orbit-striker, rhythm-runner 등: DOM에 Game Over 텍스트가 hidden 상태로 존재하나 시각적으로는 정상
