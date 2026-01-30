# 게임 품질 현황 보고서
> 작성: 2025-07-22 | 분석 방법: 소스코드 정적 분석 + 메카닉 리뷰

## 요약
- **총 게임 수:** 44개 (games/ 내 디렉토리)
- **삭제 권장:** 5개 (중복/미성립)
- **재개발 필요:** 2개 (메카닉 재설계)
- **버그 수정 필요:** 3개
- **폴리싱 필요:** 8개
- **양호:** 26개
- **완료(수정됨):** 1개 (neon-snake)

---

## 🔴 삭제 권장 (5개)

### 1. slime-survivor
- **사유:** slime-survivor-premium과 중복. Premium이 87KB(2235줄)로 기본판 49KB(1235줄)의 완전 상위호환
- **Premium 추가기능:** 사운드, 이펙트, 리더보드, 데일리 챌린지, 프로그레션
- **결론:** 기본판 삭제, Premium 유지

### 2. color-sort
- **사유:** ball-sort와 동일 장르 (튜브 정렬 퍼즐). 둘 다 튜브 간 볼 이동 → 단색 완성
- **비교:** color-sort (19KB, 피처 34개) vs ball-sort (14KB, 피처 20개)
- **결론:** color-sort가 약간 나으나, 둘 다 존재하면 포트폴리오 중복. color-sort 유지, ball-sort 삭제
- **대안:** ball-sort를 유지하고 color-sort 삭제도 가능 (ball-sort가 더 간결)

### 3. stack-tower
- **사유:** stack-kingdom과 동일 메카닉 (타이밍 기반 블록 쌓기)
- **비교:** stack-tower (14KB) vs stack-kingdom (21KB, 킹덤 테마 + 추가 피처)
- **결론:** stack-kingdom 유지, stack-tower 삭제

### 4. conveyor-sort-factory
- **사유:** 인터랙션 부족 (터치 8회). 컨베이어 벨트의 스위치만 토글. 플레이어 에이전시 극히 제한적.
- **코드 분석:** 게임 루프, 웨이브 시스템, 점수/콤보 존재하지만 "정렬 팩토리" 메카닉이 충분히 성립하지 않음
- **문제:** 아이템이 벨트를 따라 자동 이동, 스위치 토글만이 유일한 입력. 비전략적.
- **결론:** 삭제 또는 메카닉 전면 재설계 필요 → 비용 대비 삭제 권장

### 5. (보류 - 추가 테스트 필요)
- **후보:** gravity-orbit — 게임 메카닉은 성립하나, 실제 플레이 경험이 핵심. 브라우저 테스트 필요.

---

## 🟠 재개발 필요 (2개)

### 1. screw-sort-factory
- **문제:** 블로킹 메카닉이 레벨 31부터 시작. 레벨 1~30은 아무 나사나 탭하면 클리어 → 챌린지 제로
  - locked: 레벨 31+ (15% 확률)
  - rusty: 레벨 45+ (10% 확률)
  - chained: 레벨 61+ (10% 확률)
- **HTML 버그:** `id="winFactoryBtn" id="i18nFact2"` (중복 id 속성)
- **수정 방안:** 
  - 레벨 1부터 순서 의존성(order dependency) 도입
  - locked는 레벨 3+, rusty는 레벨 8+, chained는 레벨 15+
  - 확률을 높여서 실제 퍼즐성 확보
- **난이도:** 중 (밸런스 숫자 조정 + 레벨 생성 로직 수정)

### 2. spin-village
- **문제:** 게임 메카닉이 "슬롯머신 돌리기 → 코인 얻기 → 건물 업그레이드" 루프만 존재
- **함수 1개** (spin)가 유일한 인터랙션. startBtn 없음 (0). 이벤트리스너 4개뿐.
- **문제점:** 
  - 시작 버튼/화면 없음 (바로 게임)
  - 전략적 선택 거의 없음 (코인 → 업그레이드만)
  - 슬롯 결과가 랜덤이므로 스킬 요소 없음
- **수정 방안:**
  - 공격/방어/도둑 시스템 추가 (Coin Master 스타일)
  - 시작 화면 + 튜토리얼
  - 건물 파괴/보호 메카닉
- **난이도:** 상 (전면 재설계에 가까움) → 삭제 권장 변경 가능

---

## 🟡 버그 수정 필요 (3개)

### 1. screw-sort-factory (상기 재개발과 별도)
- **버그:** HTML에 중복 id 속성 (`id="winFactoryBtn" id="i18nFact2"`)
- **수정:** 두 번째 id를 data-i18n으로 변경

### 2. rhythm-pulse
- **잠재 이슈:** gameOver 0, restart 0 — 스테이지 클리어 후 결과 화면은 있으나 명시적 재시작 없을 수 있음
- **확인 필요:** result 화면에서 메뉴로 돌아가는 플로우

### 3. pipe-connect
- **잠재 이슈:** restart 0 — 레벨 중 재시작 버튼 부재 가능
- **win 시스템:** 존재 (showWin, nextLevel)
- **확인 필요:** 막힌 상태에서 리셋 방법

---

## 🟢 폴리싱 필요 (8개)

### 1. fishing-tycoon
- **상태:** 게임으로서 성립하나 startBtn 없음(0). idle/tycoon 장르라 gameOver도 없음 (by design)
- **개선:** 시작 화면/온보딩 추가

### 2. hex-drop
- **상태:** 헥사곤 드롭 퍼즐. startBtn 0.
- **개선:** 시작 화면 추가

### 3. gravity-orbit  
- **상태:** 우주 궤도 게임. startBtn 0, tutorial 1.
- **개선:** 시작 화면 + 더 나은 온보딩

### 4. laser-reflect
- **상태:** 레이저 반사 퍼즐. startBtn 0.
- **개선:** 시작 화면 추가

### 5. idle-slime-merge
- **상태:** 아이들 머지 게임. gameOver 0, restart 0 (아이들 장르 특성)
- **문제 없음** (아이들 게임은 게임오버가 없는 게 정상)
- **개선:** 프레스티지 시스템 확인, 오프라인 보상 UI 개선

### 6. rope-untangle
- **상태:** 노드 언탱글 퍼즐. gameOver 0 (퍼즐은 실패가 없음), restart 3.
- **개선:** 시간 제한 모드 또는 이동수 제한 추가로 챌린지 부여

### 7. single-tap-golf
- **상태:** 탭 골프. gameOver 0 (코스 기반).
- **개선:** 전체 코스 완료 후 결과 화면

### 8. micro-factory
- **상태:** 팩토리 시뮬. gameOver 0 (시뮬레이션 장르).
- **개선:** 목표 시스템, 달성도 표시

---

## ✅ 양호 (26개)

다음 게임들은 소스코드 분석 기준으로 핵심 메카닉 성립, 게임 루프 완전:

| # | 게임 | 크기 | 주요 메카닉 | 비고 |
|---|------|------|-------------|------|
| 1 | ball-sort | 14KB | 튜브 정렬 | color-sort와 중복 → 삭제 대상 |
| 2 | block-bounce | 23KB | 블록 배치 (1010! 스타일) | ✅ |
| 3 | brick-breaker | 23KB | 벽돌깨기 | ✅ |
| 4 | bubble-defense | 46KB | 버블 타워디펜스 | 튜토리얼 있음 ✅ |
| 5 | chain-pop | 22KB | 체인 리액션 | ✅ |
| 6 | crystal-match | 49KB | 매치3 + 레벨맵 | 별점 시스템 ✅✅ |
| 7 | dice-master | 22KB | 주사위 전략 | ✅ |
| 8 | dungeon-run | 46KB | 무한 러너 | ✅ |
| 9 | fruit-merge-drop | 22KB | 과일 머지 (수박게임) | ✅ |
| 10 | hole-swallow | 18KB | hole.io 스타일 | ✅ |
| 11 | infinite-stack-climb | 29KB | 스택 클라이밍 | 튜토리얼 ✅ |
| 12 | jump-physics | 34KB | 물리 점프 | ✅ |
| 13 | match-3d-zen | 26KB | 3D 매칭 | 튜토리얼 ✅ |
| 14 | merge-rush | 34KB | 2048 머지 | ✅ |
| 15 | merge-tower | 17KB | 타워 머지 | ✅ |
| 16 | number-drop | 21KB | 숫자 드롭 퍼즐 | 튜토리얼 ✅ |
| 17 | orbit-striker | 25KB | 궤도 액션 | 튜토리얼 ✅ |
| 18 | pet-simulator | 30KB | 가상 펫 | 튜토리얼 ✅ |
| 19 | pixel-defense | 32KB | 타워디펜스 | ✅ |
| 20 | polygon-dungeon | 44KB | 로그라이크 던전 | ✅ |
| 21 | power-2048 | 63KB | 향상된 2048 | 최대 규모 ✅✅ |
| 22 | rhythm-runner | 29KB | 리듬 러너 | ✅ |
| 23 | slide-block-match | 24KB | 슬라이드 매치 | 튜토리얼 ✅ |
| 24 | slime-survivor-premium | 87KB | 서바이버 로그라이크 | 최고 품질 ✅✅✅ |
| 25 | stack-kingdom | 21KB | 스택 빌딩 | ✅ |
| 26 | zen-tile-match | 37KB | 마작 타일 매칭 | ✅ |
| 27 | zombie-survivor | 47KB | 좀비 서바이벌 | 튜토리얼 ✅ |

---

## ✅ 완료 (수정됨)
- **neon-snake** — 벽 통과 버그 + 카운트다운 (이전에 수정 완료)

---

## 중복 분석

| 그룹 | 게임 A | 게임 B | 판정 |
|------|--------|--------|------|
| 튜브 정렬 | color-sort (19KB) | ball-sort (14KB) | **ball-sort 삭제** |
| 서바이버 | slime-survivor (49KB) | slime-survivor-premium (87KB) | **basic 삭제** |
| 스택 타워 | stack-tower (14KB) | stack-kingdom (21KB) | **stack-tower 삭제** |

*참고: block-bounce ≠ slide-block-match (다른 메카닉), zen-tile-match ≠ match-3d-zen (다른 메카닉), merge-rush ≠ merge-tower (다른 메카닉)*

---

## 다음 단계
1. IMPLEMENTATION_PLAN.md 작성
2. 우선순위별 태스크 실행 (워커 서브에이전트)
3. 삭제 대상은 실행 전 주인님 확인
