# IMPLEMENTATION_PLAN.md — 삼국지 패왕전 Phase 2

> **상태**: 🚧 Phase 2 진행 중
> **최종 수정**: 2025-02-03
> **목표**: 앱스토어 출시 최소 기준 — 48+ 장수, 34 스테이지, 장비/가챠/진형/시너지

---

## Phase 1: MVP ✅ 완료 (2025-02-02)

<details>
<summary>Phase 1 태스크 (접기)</summary>

| 태스크 | 상태 | 내용 |
|--------|------|------|
| Task 1: 프로젝트 기반 | ✅ | project.godot, JSON 데이터, Autoload |
| Task 2: 전투 시스템 | ✅ | 턴제 전투, 데미지 공식, AI |
| Task 3: 캠페인+컷씬 | ✅ | 5스테이지, 컷씬 시스템 |
| Task 4: UI 화면들 | ✅ | 타이틀/메뉴/장수/설정 |
| Task 5: 통합+배포 | ✅ | 웹 빌드, 배포 |

</details>

---

## Phase 2: 앱스토어 출시 최소 (8개 태스크)

### 현재 코드 분석

**파일 구조:**
```
three-kingdoms-godot/
├── data/
│   ├── generals.json      # 5명 (유비,관우,장비,장각,화웅)
│   ├── skills.json        # 8개 스킬
│   ├── stages.json        # 5스테이지 (Ch1만)
│   └── cutscenes.json     # 3개 컷씬
├── scripts/autoload/
│   ├── game_manager.gd    # DB 로드, 스탯 계산, 상성
│   ├── save_manager.gd    # 저장/로드, 장수/팀/골드 관리
│   └── event_bus.gd       # 시그널 버스
├── scenes/
│   ├── battle_scene.gd/.tscn    # 전투 (물리/책략, AI, 쿨다운)
│   ├── battle_result.gd/.tscn   # 전투 결과
│   ├── title_screen.gd/.tscn    # 타이틀
│   ├── main_menu.gd/.tscn       # 메인 메뉴
│   ├── general_list.gd/.tscn    # 장수 목록
│   ├── general_detail.gd/.tscn  # 장수 상세
│   ├── stage_select.gd/.tscn    # 스테이지 선택
│   ├── cutscene.gd/.tscn        # 컷씬
│   └── settings.gd/.tscn        # 설정
└── export_presets.cfg
```

**현재 시스템 역량:**
- ✅ 턴제 전투 (SPD 기반, 물리/책략 데미지)
- ✅ 병종 상성 상수 (TYPE_ADVANTAGE) — 실 적용은 부분적
- ✅ 스킬 (액티브/패시브, 쿨타임)
- ✅ AI (무모형/균형형)
- ✅ 저장/로드 (generals, team, gold, campaign)
- ✅ 컷씬 시스템 (대사+감정 배경)
- ❌ 장비 없음
- ❌ 가챠 없음
- ❌ 진형 없음 (전열/후열 구분은 데이터에만 있고 전투 미적용)
- ❌ 시너지 없음 (도원결의 패시브만 스킬 데이터에 존재)
- ❌ 상태이상 없음
- ❌ 챕터 1만 5스테이지

---

### Task 2.1: 장수+스킬 데이터 대확장 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `data/generals.json` — 5명 → **48명** (GDD §3.3 전체)
  - 위(魏) 14명: 조조, 사마의, 장료, 하후돈, 전위, 서황, 하후연, 장합, 순욱, 곽가, 가후, 조인, 우금, 악진
  - 촉(蜀) 14명: 유비, 제갈량, 관우, 장비, 조운, 마초, 황충, 위연, 방통, 관평, 마대, 법정, 마속, 강유
  - 오(吳) 12명: 손권, 주유, 손견, 손책, 육손, 여몽, 태사자, 감녕, 황개, 노숙, 정보, 주태
  - 기타 8명: 여포, 동탁, 초선, 원소, 장각, 안량, 문추, 공손찬 (화웅+장보=기존)
  - 각 장수: id, name_ko, faction, rarity, unit_type, position, stats(4), skills, quotes(4)
- `data/skills.json` — 8개 → **60+개** (GDD §3.4)
  - 액티브 스킬: 각 장수 1-2개
  - 패시브 스킬: 각 장수 1-3개
  - 궁극기: SSR/UR 장수 전용
- 기존 5명 데이터 보존, 신규 장수 추가
- `game_manager.gd` 변경 없음 (기존 로드 로직 호환)

**산출물**: 확장된 generals.json, skills.json
**의존성**: 없음
**검증**: headless 빌드 성공 + 기존 5스테이지 정상 플레이

---

### Task 2.2: 스테이지+컷씬 데이터 확장 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `data/stages.json` 확장:
  - 챕터 1: 5→**10** 스테이지 (1-6 ~ 1-10 추가)
  - 챕터 2: **12** 스테이지 (2-1 ~ 2-12, 동탁 토벌)
  - 챕터 3: **12** 스테이지 (3-1 ~ 3-12, 군웅할거)
  - 총 34 스테이지 (GDD §5.5 + §5.1)
  - 적 구성: 기존 enemy_templates 확장 (동탁군, 원소군 템플릿)
  - 보스 스테이지: 장수 적 (화웅, 장각, 여포, 원소)
  - 보상: 골드, 경험치, 장수 획득 (스토리 장수 7명)
- `data/cutscenes.json` 확장:
  - 챕터 2 컷씬 6개 (GDD §5.2)
  - 챕터 3 컷씬 4개 (GDD §5.2)
- enemy_templates 추가:
  - dong_zhuo_soldier, dong_zhuo_officer, yuan_shao_soldier, yuan_shao_officer
  - cavalry_unit, archer_unit (궁병/기병 적)

**산출물**: 확장된 stages.json, cutscenes.json
**의존성**: Task 2.1 (신규 장수가 적/보스로 등장)
**검증**: headless 빌드 성공

---

### Task 2.3: 핵심 시스템 업그레이드 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `scripts/autoload/game_manager.gd` 업그레이드:
  - 장비 스탯 계산 함수 추가
  - 진형 효과 조회 함수
  - 시너지 감지 함수
  - equipment_db, formations_db, synergies_db 로드
- `scripts/autoload/save_manager.gd` 확장:
  - equipment 슬롯 (weapon/armor/helmet/accessory per general)
  - formation 선택 저장
  - gacha_pity_counter 저장
  - gems (보석) 재화 추가
  - resources 확장 (food, troops, iron)
  - stamina 시스템
- `scripts/autoload/event_bus.gd` 시그널 추가:
  - equipment_changed, formation_changed
  - gacha_pulled, gems_changed
  - synergy_activated
- **새 데이터 파일**:
  - `data/equipment.json` — 장비 30+종 (백/녹/파/보라/금)
  - `data/formations.json` — 5진형 (어린/학익/봉시/방원/장사)
  - `data/synergies.json` — 15+종 시너지 (GDD §3.4)

**산출물**: 업그레이드된 autoload 3개 + 데이터 파일 3개
**의존성**: Task 2.1
**검증**: headless 빌드 + 기존 전투 정상 작동

---

### Task 2.4: 전투 시스템 v2 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `scenes/battle_scene.gd` 대폭 업그레이드:
  - **상태이상 시스템** (GDD §4.6):
    - 화상(8%/턴), 혼란(50% 아군공격), 위축(-20% ATK)
    - 속박(행동불가), 중독(5%/턴), 사기충천(+25%), 철벽(+30% DEF)
    - 상태 아이콘 표시, 턴 종료 시 처리
  - **진형 전투 적용** (GDD §4.4):
    - 전열/후열 공격 규칙 (기본: 전열만 공격 가능)
    - 궁병/책사: 후열 직접 타격
    - 기병: 돌격 시 후열 타격 확률
    - 전열 전멸 → 후열 이동
  - **병종 상성 시각화**:
    - 타겟 선택 시 상성 표시 (유리: ↑, 불리: ↓)
    - 데미지 로그에 상성 표시
  - **AI 업그레이드** (GDD §4.7):
    - 전략형: 상성 고려 + HP 낮은 적 우선
    - 두뇌형: 진형 파괴 + 책사 우선 제거
  - **연의 이벤트** (GDD §4.8):
    - 스테이지별 특수 조건 체크
    - 이벤트 발동 시 컷씬 + 버프
  - **궁극기 게이지**:
    - 피해 주고받으면 게이지 충전
    - 100% 시 궁극기 사용 가능
  - **자동전투 + 2배속**:
    - 자동: AI가 아군도 조종
    - 2배속: 애니메이션/대기 시간 단축

**산출물**: 대폭 개선된 전투 시스템
**의존성**: Task 2.3 (진형/시너지 데이터 필요)
**검증**: 34스테이지 전투 가능, 상태이상/진형/상성 작동

---

### Task 2.5: 장비 시스템 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `scenes/general_detail.gd` 확장:
  - 장비 4슬롯 UI (무기/갑옷/투구/악세서리)
  - 장비 선택 팝업 (보유 장비 목록)
  - 장착/해제 로직
  - 스탯 변화 미리보기
- `scenes/equipment_popup.tscn` + `.gd` (신규):
  - 장비 목록 표시 (등급별 색상)
  - 장비 정보 (이름, 스탯, 등급)
  - 장착 확인
- `scenes/battle_scene.gd` 연동:
  - 유닛 생성 시 장비 스탯 반영
  - 공격력 = 무력×3 + 무기 공격력
  - 방어력 = 통솔×2 + 갑옷 방어력
  - 특수 효과 (악세서리)
- 장비 획득:
  - 스테이지 클리어 보상에 장비 추가
  - stages.json 보상에 equipment 필드

**산출물**: 장비 시스템 전체 (UI + 전투 연동)
**의존성**: Task 2.3 (equipment_db, save 확장)
**검증**: 장비 장착 → 전투 스탯 변화 확인

---

### Task 2.6: 가챠(뽑기) 시스템 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `scenes/gacha_screen.tscn` + `.gd` (신규):
  - 일반 뽑기 (골드 3,000 / 10연차 27,000)
  - 고급 뽑기 (보석 300 / 10연차 2,700)
  - 뽑기 확률 표시 (N:50%, R:30%, SR:15%, SSR:4.5%, UR:0.5%)
  - 천장 카운터 표시 ("SSR까지 N회 남음")
  - 10연차 시 SR+ 1명 확정
  - 뽑기 버튼 + 재화 표시
- `scenes/gacha_result.tscn` + `.gd` (신규):
  - 단일 뽑기 결과 연출 (등급별 이펙트)
  - 10연차 결과 (카드 10장 순차 공개)
  - SSR 이상 특수 연출
  - "새 장수!" vs "중복 → 조각" 표시
- 가챠 로직:
  - 확률 테이블 기반 뽑기
  - 천장 (pity): 80회 = SSR 확정
  - 중복 장수 → 조각으로 변환
- `scenes/main_menu.gd` 연동:
  - 메인 메뉴에 "뽑기" 버튼 추가

**산출물**: 완전한 가챠 시스템
**의존성**: Task 2.3 (gems 재화, gacha pity 저장)
**검증**: 뽑기 → 장수 획득 → 목록 반영

---

### Task 2.7: 캠페인 UI + 진형/시너지 UI ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- `scenes/chapter_select.tscn` + `.gd` (신규 또는 대폭 수정):
  - 3챕터 선택 (가로 스크롤 또는 세로 리스트)
  - 챕터 언락 조건 표시
  - 챕터별 진행률 표시
- `scenes/stage_select.gd` 대폭 수정:
  - 10-12 스테이지 표시 (스크롤)
  - 잠긴 스테이지 시각화
  - 보스 스테이지 특별 표시
  - 첫 클리어 보상 / 반복 보상 구분
- `scenes/formation_select.tscn` + `.gd` (신규):
  - 5진형 카드 (해금/잠김)
  - 진형 효과 설명
  - 현재 진형 선택
- `scenes/team_setup.tscn` + `.gd` (신규):
  - 출전 5명 선택
  - 전열/후열 배치
  - 시너지 미리보기 (발동 가능한 조합 표시)
  - 진형 선택 버튼
- 출전 전 화면 흐름:
  스테이지 선택 → 팀 편성 → 진형 선택 → 전투 시작

**산출물**: 완전한 캠페인 + 편성 UI
**의존성**: Task 2.2 (스테이지 데이터), Task 2.4 (진형 전투)
**검증**: 3챕터 탐색 + 팀 편성 + 전투 진입

---

### Task 2.8: 통합 + 밸런스 + 빌드 + 배포 ⬜
**상태**: ⬜ 대기
**담당**: TBD

**범위**:
- 전체 시스템 연결 검증:
  - 타이틀 → 메뉴 → 출전/장수/뽑기/설정
  - 출전 → 챕터 → 스테이지 → 편성 → 전투 → 결과
  - 장수 → 상세 → 장비 → 레벨업
  - 뽑기 → 결과 → 장수 목록
- 세이브 호환성:
  - 기존 Phase 1 세이브 → Phase 2 마이그레이션
  - version 필드 체크 + 신규 필드 기본값
- 밸런스 확인:
  - Ch1 (~Lv10), Ch2 (~Lv20), Ch3 (~Lv28) 난이도
  - 장비 유무에 따른 전투력 차이
  - 가챠 경제 (무과금 진행 가능 확인)
- 웹 빌드:
  - `godot4 --headless --path ... --export-release "Web"`
  - MiniPC HTTP → 맥스튜디오 전송
  - `/Users/kjaylee/clawd/games/three-kingdoms/` 배포
  - Git commit & push

**산출물**: 웹 플레이 가능한 Phase 2 완성 빌드
**의존성**: Task 2.1~2.7 전부
**검증**: 전체 플로우 테스트, 빌드 에러 0

---

## 실행 순서 (엄격 순차)

```
Task 2.1 (장수+스킬 데이터)
  └→ Task 2.2 (스테이지+컷씬 데이터)
      └→ Task 2.3 (핵심 시스템 업그레이드)
          └→ Task 2.4 (전투 v2)
              └→ Task 2.5 (장비 시스템)
                  └→ Task 2.6 (가챠 시스템)
                      └→ Task 2.7 (캠페인+진형+시너지 UI)
                          └→ Task 2.8 (통합+빌드)
```

**이유**: 1태스크 1워커, Godot 파일 충돌 방지. 데이터→시스템→UI→통합 순.

---

## 환경 정보 (Phase 1과 동일)

| 항목 | 값 |
|------|-----|
| MiniPC 노드 | `nodes.run(node="MiniPC")` |
| Godot | `/home/spritz/godot4` (4.6) |
| 프로젝트 | `/home/spritz/three-kingdoms-godot/` |
| export_presets | 기존 것 유지 (직접 작성 금지) |
| 배포 | HTTP(9877) → curl → `/Users/kjaylee/clawd/games/three-kingdoms/` |
| Git push | 맥 스튜디오에서만 |

## 필수 코딩 규칙

- GDScript: `var x: Type = value` (`:=` 타입 추론 금지)
- Viewport: `get_viewport_rect().size` (하드코딩 금지)
- export_presets.cfg 직접 작성 금지
- 매 태스크 후 `godot4 --headless --path ... --export-release "Web"` 빌드 테스트

---

## 진행 로그

| 시각 | 태스크 | 상태 | 메모 |
|------|--------|------|------|
| 2025-02-03 | Phase 2 Plan 작성 | ✅ | 8태스크 분해 완료 |
| 2025-02-03 | Task 2.1 | ✅ | 58명 장수 + 160개 스킬 데이터 완료, 빌드 성공 |
| 2025-02-03 | Task 2.2 | ✅ | 34스테이지 + 31컷씬 + 17적템플릿 + 3챕터 완료 |
| 2025-02-03 | Task 2.3 | ✅ | 3 Autoload 업그레이드 + equipment/formations/synergies 데이터 |
| 2025-02-03 | Task 2.4 | ✅ | 전투v2: 상태이상/진형/시너지/AI업/자동전투/2배속 |
| 2025-02-03 | Task 2.5 | ✅ | 장비 UI (4슬롯, 장착팝업, 스탯미리보기) |
| 2025-02-03 | Task 2.6 | ✅ | 가챠 시스템 (일반/고급, 천장80, 10연차) + 메뉴 업데이트 |
| 2025-02-03 | Task 2.7 | ✅ | 캠페인 UI: 멀티챕터 스테이지선택, 보상미리보기 |
| 2025-02-03 | Task 2.8 | ✅ | 통합 빌드 + 웹 배포 + git push |
