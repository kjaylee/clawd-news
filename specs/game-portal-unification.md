# Game Portal Unification

## 목표
clawd-news/games/index.html에서 **27개 전체 게임**을 통합 표시

## 현재 상태
- **clawd-news 로컬 10개**: block-bounce, brick-breaker, color-sort, gravity-orbit, hex-drop, idle-slime-merge, merge-rush, pipe-connect, rhythm-pulse, stack-tower
- **jay-projects 외부 17개** (eastsea.monster/games/ 경유):
  slime-survivor, jump-physics, merge-tower, single-tap-golf, dungeon-run, rhythm-runner, stack-kingdom, pet-simulator, zombie-survivor, fishing-tycoon, dice-master, spin-village, micro-factory, bubble-defense, orbit-striker, polygon-dungeon, pixel-defense

## 요구사항
1. games/index.html에 27개 전부 카드로 표시
2. 로컬 게임: 상대경로 링크 (예: `block-bounce/`)
3. 외부 게임: `https://eastsea.monster/games/XXX/` 링크 + `target="_blank"`
4. 카테고리/태그 필터 (JavaScript)
5. 검색 기능
6. 모바일 반응형
7. 시각적으로 세련된 카드 디자인
8. "NEW" / "외부" 배지

## 카테고리 분류
- 퍼즐: block-bounce, color-sort, merge-rush, hex-drop, pipe-connect, merge-tower
- 아케이드: stack-tower, brick-breaker, jump-physics, single-tap-golf, stack-kingdom
- 액션: slime-survivor, zombie-survivor, polygon-dungeon
- 리듬: rhythm-pulse, rhythm-runner
- 아이들/시뮬: idle-slime-merge, pet-simulator, fishing-tycoon, spin-village, micro-factory
- 디펜스: bubble-defense, pixel-defense
- 기타: gravity-orbit, orbit-striker, dungeon-run, dice-master
