# 게임 품질 정리 플랜
> 마더 에이전트: ralph-mother | 작성: 2025-07-22

## 분류

### 삭제 (게임 미성립 / 중복) — 5개
- [ ] slime-survivor — slime-survivor-premium과 완전 중복 (기본판)
- [ ] ball-sort — color-sort와 동일 장르 중복 (튜브 정렬)  
- [ ] stack-tower — stack-kingdom과 동일 메카닉 중복 (타이밍 스택)
- [ ] conveyor-sort-factory — 인터랙션 부족 (스위치 토글만), 메카닉 미성립
- [ ] spin-village — 인터랙션 극히 제한적 (함수 1개: spin), 전략성 없음, 슬롯머신+건물 업그레이드만

### 재개발 (메카닉 재설계 필요) — 1개
- [ ] screw-sort-factory — 레벨 1~30 챌린지 제로. 블로킹 메카닉 레벨 1부터 도입 필요 + HTML 중복 id 버그

### 버그 수정 (기본 수정으로 해결) — 2개
- [ ] rhythm-pulse — 게임 종료/재시작 플로우 확인 및 보완
- [ ] pipe-connect — 레벨 중 재시작 버튼 추가

### 폴리싱 (완성도 향상) — 8개
- [ ] fishing-tycoon — 시작 화면/온보딩 추가
- [ ] hex-drop — 시작 화면 추가
- [ ] gravity-orbit — 시작 화면 + 온보딩 개선
- [ ] laser-reflect — 시작 화면 추가
- [ ] idle-slime-merge — 오프라인 보상 UI 개선
- [ ] rope-untangle — 챌린지 요소 추가 (시간/이동수 제한)
- [ ] single-tap-golf — 코스 완료 결과 화면
- [ ] micro-factory — 목표 시스템 + 달성도

## 우선순위 실행 순서

### Phase A: 삭제 (즉시 — 주인님 확인 후)
1. slime-survivor 삭제
2. ball-sort 삭제
3. stack-tower 삭제
4. conveyor-sort-factory 삭제
5. spin-village 삭제

### Phase B: 재개발 (높은 우선순위)
6. screw-sort-factory 재설계

### Phase C: 버그 수정 (중간 우선순위)
7. rhythm-pulse 종료 플로우 수정
8. pipe-connect 재시작 버튼 추가

### Phase D: 폴리싱 (낮은 우선순위)
9~16. 폴리싱 대상 8개 순차 처리

## DONE
- [x] neon-snake — 벽 통과 + 카운트다운 (완료)

---

## 실행 후 예상 결과
- **삭제 전:** 44개 게임
- **삭제 후:** 39개 게임
- **최종:** 39개 게임, 모두 QA 기준 통과
