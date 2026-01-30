# 게임 QA 감사 결과 (2026-01-30)

## 요약
- 총 게임: 43
- PASS: 38
- FAIL: 0
- NEEDS_FIX: 5

---

## 상세

### ✅ PASS (38개)

| # | 게임 | 장르 | 비고 |
|---|------|------|------|
| 1 | ball-sort | 퍼즐 (볼 소팅) | 완성도 높음. 레벨 진행, undo, hint, 승리 판정, localStorage 저장. 터치 OK |
| 2 | block-bounce | 퍼즐 (블록 배치) | 8x8 그리드에 블록 배치→라인 클리어. 드래그&드롭, 프리뷰, 콤보, 게임오버 판정 정상 |
| 3 | brick-breaker | 아케이드 (벽돌깨기) | Canvas 기반. 패들+공, 파워업(5종), 레벨 진행, 게임오버/레벨클리어. 터치 OK |
| 4 | bubble-defense | 하이브리드 (버블+타워디펜스) | 버블 매칭으로 에너지 획득→타워 설치. 10웨이브, 승리/패배 분기. 복합 메카닉 잘 구현 |
| 5 | chain-pop | 퍼즐 (팝 퍼즐) | 8x8 그리드, 연결된 같은 색 2+개 터치→제거. 중력+열 이동, 레벨 목표점수, 셔플 |
| 6 | color-sort | 퍼즐 (볼 소팅) | ball-sort와 유사하되 다크 테마. 레벨 진행, undo, hint, 승리 판정 정상 |
| 7 | conveyor-sort-factory | 아케이드 (공장 분류) | Canvas 기반. 컨베이어 벨트 위 아이템을 스위치로 분류. 웨이브 진행, 게임오버(빈 초과) |
| 8 | crystal-match | 퍼즐 (Match-3 + Merge) | 매우 완성도 높음. 레벨 모드(100+레벨)+무한 모드, 크리스탈 시스템, L/T 매치, 별 시스템, 저장 |
| 9 | dice-master | 보드게임 (야찌) | Canvas 기반. 5주사위, 13라운드, 13카테고리, 상단보너스. 홀드/리롤, 게임오버 판정 |
| 10 | dungeon-run | 러너 (횡스크롤) | 픽셀아트 스프라이트 직접 생성. 점프→장애물 회피+아이템 수집. 속도 점진 증가, 게임오버 |
| 11 | fishing-tycoon | 시뮬/아이들 | Canvas 기반 낚시 게임. 터치 조작, UI 오버레이 |
| 12 | fruit-merge-drop | 퍼즐 (수박 게임) | 물리 엔진 직접 구현. 11단계 과일 머지, 위험선 초과 시 게임오버. 드롭 조작 |
| 13 | gravity-orbit | 아케이드 (궤도) | Canvas. 위성이 행성 궤도 돌며 별 수집. 터치로 궤도 전환, 체인 보너스 |
| 14 | hex-drop | 퍼즐 (헥스 블록) | 헥사곤 그리드에 조각 배치. 드래그&드롭, 라인 클리어, 콤보. 게임오버 판정 |
| 15 | hole-swallow | 아케이드 (hole.io) | Canvas. 구멍 이동→오브젝트 흡수→구멍 커짐. 타이머, 레벨 진행 |
| 16 | infinite-stack-climb | 아케이드 (스태킹) | Canvas. 블록 정확히 쌓기→위로 올라감. 퍼펙트/콤보, 파워업, 게임오버 |
| 17 | jump-physics | 플랫포머 | Canvas. 파워 차지→점프. 플랫폼 종류 다양(이동/소멸/바운스), 게임오버 |
| 18 | match-3d-zen | 퍼즐 (3D 매칭) | 3D 느낌 아이템을 슬롯에 매칭. 레벨 진행, 셔플/힌트, 승리/패배 판정 |
| 19 | merge-rush | 퍼즐 (2048 변형) | 그리드에서 같은 숫자 합치기. 클래식/러시 모드, undo, 게임오버 |
| 20 | merge-tower | 아케이드 (머지+타워) | Canvas. 몬스터 드롭→합체→레벨업. 적 웨이브 방어, 게임오버 |
| 21 | micro-factory | 시뮬 (팩토리오 미니) | Canvas. 채굴기/제련/조립/판매기 배치, 컨베이어 연결. 자원 흐름 시뮬 |
| 22 | neon-snake | 아케이드 (스네이크) | Canvas. 네온 테마 스네이크. 파워업(스피드/고스트), 콤보, 스와이프/키보드 |
| 23 | number-drop | 퍼즐 (숫자 드롭) | 숫자 블록 드롭→합체→큰 숫자. 물리 기반, 게임오버 판정 |
| 24 | orbit-striker | 아케이드 (궤도 공격) | Canvas. 행성 궤도 돌며 적 처치. 터치 발사, 웨이브, 게임오버 |
| 25 | pet-simulator | 시뮬 (펫 키우기) | DOM 기반. 먹이기/놀기/재우기 → 경험치/레벨업. 상태바(배고픔/행복/에너지), 게임루프 |
| 26 | pipe-connect | 퍼즐 (파이프 연결) | Canvas. 파이프 회전→연결 완성. 레벨 진행, 힌트, 승리 판정 |
| 27 | pixel-defense | 전략 (타워 디펜스) | DOM 기반. 유닛 배치→적 웨이브 방어. 성 HP, 상점, 웨이브 진행, 게임오버 |
| 28 | polygon-dungeon | 로그라이크 | Canvas. 폴리곤 아트 던전 탐험. 레벨업+스킬 선택, 적 웨이브, 게임오버 |
| 29 | rhythm-pulse | 리듬게임 | Canvas+WebAudio. 3레인 리듬게임, 프로시저럴 비트 생성, Perfect/Great/Miss |
| 30 | rhythm-runner | 리듬+러너 | Canvas. 리듬에 맞춰 점프/슬라이드. 타이밍 스코어링, 게임오버 |
| 31 | rope-untangle | 퍼즐 (줄 풀기) | Canvas. 노드 드래그→줄 교차 해소. 레벨 진행, 힌트, 승리 판정 |
| 32 | screw-sort-factory | 퍼즐 (나사 분류) | DOM 기반. 나사를 색상별 슬롯에 분류. 잠금 메카닉(레벨 31+), 녹슨/사슬 나사, 팩토리 메타게임 |
| 33 | single-tap-golf | 아케이드 (골프) | Canvas. 탭 타이밍으로 파워/각도 조절. 홀 진행, 코스 생성 |
| 34 | slide-block-match | 퍼즐 (슬라이드 매치) | 블록 슬라이드→같은 색 매치. 타임어택/무한 모드, 게임오버 |
| 35 | slime-survivor | 서바이벌 (뱀서) | Canvas. 이동→자동 공격→경험치→레벨업. 적 웨이브, 무기 진화, 게임오버 |
| 36 | slime-survivor-premium | 서바이벌 (뱀서 프리미엄) | Canvas. slime-survivor 확장판. 미니맵, 추가 무기/적, 리더보드, 더 복잡한 시스템 |
| 37 | stack-tower | 아케이드 (타워 스택) | Canvas. 블록 정확히 쌓기. 퍼펙트/콤보, 게임오버 |
| 38 | zombie-survivor | 서바이벌 (뱀서 변형) | Canvas. 좀비 서바이벌. 이동+자동공격, 레벨업+스킬 선택, 게임오버 |

---

### ❌ FAIL (삭제 권장)

해당 없음 — 근본적 결함(시작 불가, 빈 화면, 메카닉 불성립)이 있는 게임은 없음.

---

### ⚠️ NEEDS_FIX (5개)

| # | 게임 | 문제 | 수정 방법 |
|---|------|------|-----------|
| 1 | laser-reflect | **requestAnimationFrame 게임루프 없음** — 정적 렌더링만 존재. 레이저 발사 시 한 번 그리고 끝. 레벨 15개 하드코딩, 이후 콘텐츠 없음. 거울 회전 시 시각 피드백 부족 | 거울 회전 애니메이션 추가, 레이저 발사 애니메이션 추가, 레벨 자동 생성기 추가 |
| 2 | idle-slime-merge | **gameOver 조건 없음** — 순수 아이들 게임이라 의도적일 수 있으나, 목표/마일스톤 없이 무한 반복. 프레스티지 시스템은 있으나 엔드게임 콘텐츠 부족 | 마일스톤 목표 추가 (예: "슬라임 Lv.10 달성" 업적), 프레스티지 보상 다양화 |
| 3 | spin-village | **게임루프/requestAnimationFrame 없음** — DOM 기반 슬롯머신이지만, 공격/방어 메카닉이 `onclick`만으로 처리됨. 빌딩 업그레이드 후 시각적 변화 미미. 상대방(AI) 공격이 랜덤 타이밍 없이 사용자 액션에만 반응 | 자동 웨이브/이벤트 시스템 추가, AI 공격 타이머 추가, 빌딩 시각 이펙트 강화 |
| 4 | stack-kingdom | **시작 화면 없음** — 바로 게임 시작됨. 게임 설명/튜토리얼 부재. 스택 메카닉은 정상 작동하나 첫 사용자 안내 부족 | 시작 오버레이 추가 (게임 설명 + 시작 버튼), 첫 탭 전까지 일시정지 상태 |
| 5 | zen-tile-match | **레벨 선택 UI 스크롤 문제** — 레벨 수가 많을 때 스크롤 영역이 화면 밖으로 나갈 수 있음. 게임 자체 메카닉은 정상 (마작 솔리테어) | 레벨 선택 영역에 overflow-y: auto 추가, 스크롤 가능하게 수정 |

---

## 감사 세부 분석

### 장르별 분류

| 장르 | 게임 수 | 게임 목록 |
|------|---------|-----------|
| 퍼즐 | 16 | ball-sort, block-bounce, chain-pop, color-sort, crystal-match, fruit-merge-drop, hex-drop, laser-reflect, match-3d-zen, merge-rush, number-drop, pipe-connect, rope-untangle, screw-sort-factory, slide-block-match, zen-tile-match |
| 아케이드 | 10 | brick-breaker, conveyor-sort-factory, gravity-orbit, hole-swallow, infinite-stack-climb, neon-snake, orbit-striker, single-tap-golf, stack-kingdom, stack-tower |
| 서바이벌/로그라이크 | 4 | polygon-dungeon, slime-survivor, slime-survivor-premium, zombie-survivor |
| 러너 | 3 | dungeon-run, jump-physics, rhythm-runner |
| 시뮬레이션 | 3 | fishing-tycoon, micro-factory, pet-simulator |
| 전략/타워디펜스 | 3 | bubble-defense, merge-tower, pixel-defense |
| 리듬 | 1 | rhythm-pulse |
| 보드게임 | 1 | dice-master |
| 아이들/캐주얼 | 2 | idle-slime-merge, spin-village |

### 기술 현황

| 항목 | 수치 |
|------|------|
| Canvas 기반 | 30 |
| DOM 기반 | 13 |
| i18n (한/영) 지원 | 35+ |
| localStorage 저장 | 40+ |
| 터치 지원 | 43 (전체) |
| Telegram Mini App 통합 | 2 (crystal-match, screw-sort-factory) |
| 사운드 (WebAudio) | 5+ (brick-breaker, bubble-defense, rhythm-pulse 등) |

### 품질 등급

| 등급 | 기준 | 게임 수 | 대표 게임 |
|------|------|---------|-----------|
| ⭐⭐⭐ S급 | 복합 메카닉, 높은 완성도, 리플레이 가치 | 8 | crystal-match, slime-survivor-premium, screw-sort-factory, polygon-dungeon, bubble-defense, zombie-survivor, dungeon-run, brick-breaker |
| ⭐⭐ A급 | 완성된 게임, 깔끔한 구현 | 20 | ball-sort, block-bounce, chain-pop, fruit-merge-drop, hex-drop, merge-rush, neon-snake, pipe-connect, rhythm-pulse, slime-survivor 등 |
| ⭐ B급 | 기본 메카닉 동작, 콘텐츠 부족 또는 미세 이슈 | 10 | hole-swallow, jump-physics, merge-tower, orbit-striker, single-tap-golf 등 |
| ⚠️ C급 | NEEDS_FIX 항목 | 5 | laser-reflect, idle-slime-merge, spin-village, stack-kingdom, zen-tile-match |

---

## 결론

**43개 게임 전체가 기본적으로 플레이 가능한 상태**입니다.

- **FAIL 게임 0개** — 시작 불가, 빈 화면, 메카닉 불성립 등 근본적 결함은 없음
- **NEEDS_FIX 5개** — 삭제 불필요, 비교적 간단한 수정으로 개선 가능
- **상위 8개 게임(S급)**은 상용 모바일 게임에 근접한 완성도
- **i18n 지원, 터치 대응, 저장 기능** 등 인프라 수준 높음

### 우선 수정 권장 순서
1. **stack-kingdom** — 시작 화면 추가 (가장 간단)
2. **zen-tile-match** — 레벨 선택 스크롤 수정 (CSS 한 줄)
3. **laser-reflect** — 애니메이션 추가 (중간 난이도)
4. **spin-village** — AI 타이머 추가 (중간 난이도)
5. **idle-slime-merge** — 목표/업적 시스템 추가 (큰 작업)
