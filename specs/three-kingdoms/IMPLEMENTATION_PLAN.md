# IMPLEMENTATION_PLAN.md — 삼국지 패왕전 Godot MVP

> **상태**: ✅ Phase 1 MVP 완료
> **최종 수정**: 2025-02-02
> **목표**: 웹 플레이 가능한 MVP — 세력 선택 없이, 5스테이지 턴제 전투 + 장수 3명 획득

---

## Phase 1: MVP 태스크 분해

### Task 1: 프로젝트 기반 구축 ✅
**상태**: ✅ 완료
**담당**: ralph-worker-1

**범위**:
- MiniPC에 Godot 프로젝트 생성 (`/home/spritz/three-kingdoms-godot/`)
- `project.godot` 설정 (해상도, autoload 등)
- `export_presets.cfg` 복사 (`/home/spritz/godot-demo/export_presets.cfg`)
- JSON 데이터 파일 생성:
  - `data/generals.json` (장수 5명: 유비, 관우, 장비, 장각, 화웅)
  - `data/skills.json` (스킬 4종)
  - `data/stages.json` (5스테이지)
  - `data/cutscenes.json` (컷씬 3종)
- Autoload 스크립트:
  - `scripts/autoload/game_manager.gd` (데이터 로드, 장수 스탯 계산)
  - `scripts/autoload/save_manager.gd` (저장/로드)
  - `scripts/autoload/event_bus.gd` (시그널 버스)
- 빌드 테스트 (headless)

**산출물**: 프로젝트 골격 + 데이터 + 싱글톤
**의존성**: 없음

---

### Task 2: 전투 시스템 (로직 + UI) ✅
**상태**: ✅ 완료
**담당**: ralph-worker-2

**범위**:
- `scripts/battle/battle_manager.gd` — 전투 흐름 관리
- `scripts/battle/damage_calculator.gd` — 데미지 공식 (물리/책략)
- `scripts/battle/ai_controller.gd` — AI (무모형 + 균형형)
- `scenes/battle_scene.tscn` — 전투 UI:
  - 유닛 배치 (전열 3 + 후열 2, 아군/적군)
  - HP 바, 이름 레이블
  - 행동 선택 UI (일반공격/스킬/방어)
  - 타겟 선택
  - 데미지 팝업 (Tween)
  - 턴 표시, 자동전투 토글
- `scenes/battle_result.tscn` — 승리/패배 결과 화면

**산출물**: 완전한 전투 시스템 (5v5 턴제 전투)
**의존성**: Task 1 완료

---

### Task 3: 캠페인 + 컷씬 ✅
**상태**: ✅ 완료
**담당**: ralph-worker-3

**범위**:
- `scenes/chapter_select.tscn` — 챕터 선택 화면
- `scenes/stage_select.tscn` — 스테이지 선택 화면 (5개)
- `scenes/cutscene.tscn` — 컷씬 시스템:
  - 대사 타이핑 효과
  - 감정별 배경색 변경
  - 화자 이름 표시
  - 탭 진행 / 스킵
- 스테이지 진행 로직 (언락, 클리어 기록)
- 보상 지급 (장수 획득, 골드)

**산출물**: 캠페인 5스테이지 선택 + 컷씬 재생
**의존성**: Task 1 완료

---

### Task 4: UI 화면들 (타이틀/메뉴/장수) ✅
**상태**: ✅ 완료
**담당**: ralph-worker-4

**범위**:
- `scenes/title_screen.tscn` — 타이틀 화면 (새게임/이어하기/설정)
- `scenes/main_menu.tscn` — 메인 메뉴 (출전/장수/설정)
- `scenes/general_list.tscn` — 장수 목록 (3열 그리드)
- `scenes/general_detail.tscn` — 장수 상세 (스탯바, 스킬 정보)
- `scenes/settings.tscn` — 설정 (볼륨, 저장/로드)
- 씬 전환 로직

**산출물**: 전체 메뉴 UI 시스템
**의존성**: Task 1 완료

---

### Task 5: 통합 + 웹 빌드 + 배포 ✅
**상태**: ✅ 완료
**담당**: ralph-worker-5

**범위**:
- 모든 씬 연결 (씬 전환 흐름 완성)
- 전투 → 보상 → 캠페인 진행 연동
- 장수 획득 → 장수 목록 반영
- 편성 시스템 (장수 상세에서 편성 추가/제거)
- 웹 빌드 (Godot --export-release "Web")
- index.html J&J 스플래시 적용
- MiniPC HTTP → 맥 스튜디오 전송
- `/Users/kjaylee/clawd/games/three-kingdoms/` 배포
- Git commit & push

**산출물**: 웹 플레이 가능한 완성 MVP
**의존성**: Task 2, 3, 4 완료

---

## 실행 순서

```
Task 1 (기반) ──→ Task 2 (전투)  ──→ Task 5 (통합+배포)
              ├──→ Task 3 (캠페인) ──┤
              └──→ Task 4 (UI)    ──┘
```

1. **Task 1** 먼저 (프로젝트 기반)
2. Task 1 완료 후 **Task 2, 3, 4** 병렬 가능 (하지만 순차 실행 권장 — 충돌 방지)
3. 모두 완료 후 **Task 5** (통합)

**권장 실행**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 (순차)

---

## 환경 정보

| 항목 | 값 |
|------|-----|
| MiniPC 노드 | `nodes.run(node="MiniPC")` |
| Godot | `/home/spritz/godot4` (4.6) |
| 프로젝트 | `/home/spritz/three-kingdoms-godot/` |
| export_presets | `/home/spritz/godot-demo/export_presets.cfg` 복사 |
| 배포 | HTTP(9877) → curl → `/Users/kjaylee/clawd/games/three-kingdoms/` |
| Git push | 맥 스튜디오에서만 |

## 필수 규칙

- GDScript: `var x: Type = value` (`:=` 타입 추론 금지)
- Viewport: `get_viewport_rect().size` (하드코딩 금지)
- export_presets.cfg 직접 작성 금지

---

## 진행 로그

| 시각 | 태스크 | 상태 | 메모 |
|------|--------|------|------|
| 2025-02-02 | Plan 작성 | ✅ 완료 | specs 5개 + plan 생성 |
| 2025-02-02 | Task 1 | ✅ 완료 | 프로젝트+데이터+싱글톤 |
| 2025-02-02 | Task 2 | ✅ 완료 | 전투 시스템 (물리/책략 데미지, AI) |
| 2025-02-02 | Task 3 | ✅ 완료 | 캠페인 5스테이지 + 컷씬 |
| 2025-02-02 | Task 4 | ✅ 완료 | UI 전체 (타이틀/메뉴/장수/설정) |
| 2025-02-02 | Task 5 | ✅ 완료 | 웹 빌드 + 배포 + git push |
