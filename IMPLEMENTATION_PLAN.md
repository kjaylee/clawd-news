# Implementation Plan - 게임 포털 통합 + 웹디자인 폴리싱

## TODO

- [ ] Task 1: 게임 포털 완전 리빌드 (games/index.html) — 27개 게임 통합, 필터/검색, 반응형 디자인
- [ ] Task 2: 메인 페이지 업데이트 (index.md) + 사이드바 네비게이션 (default.html) 정리
- [ ] Task 3: Git commit + push + Pages 빌드 확인

## DONE

(없음)

## 세부 사항

### Task 1: 게임 포털 리빌드
- games/index.html 완전 재작성
- 10개 로컬 + 17개 외부 = 27개 게임 카드
- JS 필터: 카테고리 버튼으로 필터링
- JS 검색: 실시간 텍스트 검색
- 반응형 그리드 (모바일/태블릿/데스크톱)
- 외부 게임에 "🔗 외부" 배지
- 애니메이션 효과
- specs/game-portal-unification.md 참조

### Task 2: 메인 페이지 + 사이드바
- index.md 게임 섹션 업데이트 — 대표 게임 + "전체 27종 보기" 포털 링크
- _layouts/default.html 사이드바에 게임 포탈 링크 추가
- specs/web-design-polish.md 참조

### Task 3: 배포
- git add, commit, push
- GitHub Pages 빌드 성공 확인
- 최종 URL 동작 확인
