# Power 2048 — Polishing Plan (Phase 1 → Phase 2)

> Created: 2025-07-28 | Status: **Phase 1 Complete (조사/계획)**
> 폴리싱 ROI 1위 — 예상 25h, 높은 수익 잠재력

---

## 1. 현재 상태 분석

### 1.1 파일 구조
```
games/power-2048/
├── index.html          (2004줄, 86KB — 단일 파일 게임)
├── og.png              (OG 이미지)
└── assets/
    ├── sprites/        (12 PNG)
    │   ├── Yellow.png   (128×128, 금빛 왕관 블록 — 게임마당)
    │   ├── Orange.png   (128×128)
    │   ├── Red.png      (128×128)
    │   ├── Green.png    (128×128)
    │   ├── Blue.png     (128×128)
    │   ├── Purple.png   (128×128)
    │   └── crystal00~05.png  (35×150, 크리스탈 — 게임마당)
    ├── audio/          (11 files)
    │   ├── bgm.mp3      (1.5MB — Kenney/OGA CC0)
    │   ├── clear.mp3    (196KB)
    │   ├── fail.mp3     (252KB)
    │   ├── click.ogg    (8KB)
    │   ├── combo.ogg    (12KB)
    │   ├── merge.ogg    (16KB)
    │   ├── pop.ogg      (8KB)
    │   ├── powerup.ogg  (8KB)
    │   ├── select.ogg   (8KB)
    │   ├── slide.ogg    (8KB)
    │   └── gameover.ogg (8KB)
    └── ui/             (8 PNG — ⚠️ 미사용!)
        ├── btn1.png     (1248×1208, 뉴모피즘 폭탄 버튼)
        ├── btn2.png     (1215×1183)
        ├── panel.png    (64×16, 삼각형 그림자)
        ├── panel2.png   (90×51)
        ├── top-bar.png  (500×131)
        ├── bar-bg.png   (149×22)
        ├── board-border.png (20×20)
        └── cell-bg.png  (72×72)
```

### 1.2 현재 에셋 사용 현황

| 카테고리 | 사용 중 | 미사용 | 비고 |
|---------|--------|--------|------|
| 스프라이트 | 9/12 | crystal03~05 | 타일 오버레이로 사용 (opacity 0.35~0.6) |
| 오디오 | 11/11 | - | 모두 사용 중, Web Audio API |
| UI 이미지 | **0/8** | 8개 전부 | ❗CSS로 대체됨, 이미지 미참조 |

### 1.3 현재 폴리싱 수준 (이미 적용된 것들)

**이미 있는 효과들 (✅):**
- ✅ Glassmorphism 타일 디자인 (반투명 + 블러)
- ✅ 파티클 배경 (Canvas 기반, 타일 진행에 따라 색상 변화)
- ✅ 타일 등장/합체 애니메이션 (bounce-in, merge pop)
- ✅ 화면 흔들림 (512+, 1024+ heavy)
- ✅ 합체 글로우 버스트 (DOM 기반)
- ✅ 콤보 텍스트 플로팅
- ✅ 2048 달성 셀레브레이션 (컨페티 + 텍스트)
- ✅ BGM + 11개 SFX (Web Audio API)
- ✅ 파워업 플래시 효과 (bomb, freeze, sniper)
- ✅ 배경색 진행에 따라 변화
- ✅ 레인보우 애니메이션 (super 타일)
- ✅ 다국어 지원 (EN/KO/JA/ZH)
- ✅ 3개 모드 (클래식/스테이지/일일)
- ✅ 로딩 화면 + 에셋 프리로드

**문제점 (❌):**
- ❌ UI 에셋 8개가 완전 미사용 → CSS-only UI (밋밋함)
- ❌ 스프라이트 오버레이가 opacity 0.35로 거의 안 보임
- ❌ 사운드가 대부분 8KB ogg → 퀄리티 낮음 (간단한 톤)
- ❌ 파워업 아이콘이 이모지 기반 (💣❄️⚡🔄🎯)
- ❌ 타일 구분이 색상 그라디언트에만 의존 → 색각이상자 접근성 낮음
- ❌ 메뉴 화면이 단순 (배경, 로고 없음)
- ❌ 합체 시 파티클 이펙트 없음 (글로우만 있음)

---

## 2. 폴리싱 필요 항목

### Priority 1 — 핵심 비주얼 (예상 8h)

#### 2.1 타일 디자인 대폭 업그레이드
- **현재**: 색상 그라디언트 + 반투명 스프라이트 오버레이 (거의 안보임)
- **목표**: 각 타일 값별 고유한 비주얼 아이덴티티
- **방법**:
  - **karsiori Gem Pack 활용** — 10종 보석 × 8색 = 80가지 조합!
    - GEM 1 (단순) → 2, 4 타일
    - GEM 2~3 → 8, 16, 32 타일
    - GEM 4~6 → 64, 128, 256 타일
    - GEM 7~9 → 512, 1024, 2048 타일
    - GEM 10 (클러스터) → 4096+ 타일
    - Spark 애니메이션 → 합체 이펙트
  - 스프라이트 opacity를 0.35→0.8+ 로 올리고 타일 전면에 배치
  - 보석이 숫자보다 더 부각되도록 레이아웃 변경

#### 2.2 UI 에셋 실제 적용
- **현재**: CSS-only (단색 그라디언트, 가는 보더)
- **목표**: LAYERLAB GUI Pro Casual Game 스타일 적용
- **가용 에셋**:
  - `Button01_145` 시리즈 (BlueGray, Purple 등)
  - `Button_Hexagon199` 시리즈
  - `PanelFrame01~03` (라운드, 탑바, 이너)
  - `Popup01~03` (오버레이 다이얼로그)
  - `Slider` 시리즈 (콤보 게이지)
  - `Background_01~09` (메뉴 배경)
  - `Title_Flag/Ribbon` (타이틀 장식)
  - `CardFrame` (스테이지 셀)
  - `SkillFrame02_Border` (파워업 프레임)
  - `Icon_Gem01_Green` 등 아이템 아이콘
- **적용 대상**:
  - 메뉴 버튼 → LAYERLAB Button
  - 게임 보드 프레임 → PanelFrame
  - 다이얼로그 → Popup 스킨
  - 파워업 바 → SkillFrame
  - 스코어 박스 → CardFrame

#### 2.3 파워업 아이콘 교체
- **현재**: 이모지 (💣❄️⚡🔄🎯)
- **목표**: LAYERLAB PictoIcon 또는 Gemini 생성 커스텀 아이콘
- 512px 해상도 아이콘 사용 가능

### Priority 2 — 사운드 업그레이드 (예상 5h)

#### 2.4 SFX 교체 (고퀄리티)
- **현재**: 8KB ogg 파일들 (간단한 톤)
- **가용 에셋**:
  - **SwishSwoosh Cute UI SFX** (최우선):
    - `SFX_Match_Bright/Boxy/Pop` → merge SFX (3 variations!)
    - `SFX_Player_Collect_Bright/Pop/Coin` → 타일 생성
    - `SFX_Movement_Swoosh_Fast/Med/Slow` → slide SFX
    - `SFX_UI_Button_Click_Generic/Select/Settings` → 버튼 클릭
    - `SFX_Powerup_Bright/Crystal/Potion/Rich` → 파워업 사용
    - `SFX_Confetti_Explosion_Bright` → 2048 셀레브레이션
    - `SFX_UI_Success_Bright/Rich/Achievement` → 스테이지 클리어
    - `SFX_UI_Error` → 이동 불가
    - `SFX_Boing_Bounce` → 타일 바운스
    - `SFX_Pop_Bubble_Designed` → 폭탄 폭발
    - `SFX_Firework_Explosion` → 2048 달성
    - `SFX_UI_Fillup_Gem/Star` → 콤보 게이지
    - `SFX_Chest_Open` → 파워업 획득
    - `SFX_UI_Swipe_Swoosh` → 스와이프
  - **Dustyroom Casual Game SFX** (보조):
    - 50개 WAV 파일 (DM-CGS-01~50)
    - 슬라이드, 팝, 딩 등 다양한 캐주얼 SFX
  - **Skril Studio UI SFX Mega Pack** (추가):
    - Buttons (700+), High_Pitched, Sliders, Warning, Ok, Cancel
    - 매우 다양한 변형 → 랜덤 SFX 풀 가능

#### 2.5 BGM 추가/개선
- **현재**: 1곡 (1.5MB mp3, 루프)
- **목표**: 모드별 BGM + 진행도별 변화
- **방법**:
  - 웹 무료 소스: Kenney.nl, OpenGameArt.org, Incompetech
  - 또는 MiniPC Gemini에서 BGM 추천/생성 조사

### Priority 3 — 이펙트/애니메이션 (예상 7h)

#### 2.6 합체 파티클 이펙트
- **현재**: DOM 기반 글로우 버스트 (단순 원형)
- **목표**: Canvas 기반 파티클 이펙트
- **방법**:
  - 합체 시 보석 파편이 흩어지는 효과
  - 타일 값에 따라 파티클 수/크기/색상 변화
  - Gem Pack의 **Spark 스프라이트** (10프레임) 활용
  - 고가치 합체 시 화면 전체 플래시

#### 2.7 타일 애니메이션 강화
- **현재**: scale 바운스 (0→1.15→1)
- **목표**: 
  - 타일 등장: 크리스탈 성장 애니메이션
  - 합체: 두 보석이 충돌→폭발→새 보석 탄생
  - 제거: 보석 파편화 + 소멸
  - 동결: 얼음 결정 형성 효과
  - 폭탄: 충격파 + 파편 산란

#### 2.8 배경 강화
- **현재**: 단색 배경 + 50개 파티클
- **목표**:
  - LAYERLAB Background 이미지 적용 (메뉴)
  - 게임 중: 다이내믹 배경 (성운/우주 테마 from CPasteGame Galaxy Background)
  - 진행도에 따라 배경 단계적 변화

#### 2.9 UI 전환 애니메이션
- **현재**: 단순 opacity + translateY
- **목표**:
  - 화면 전환: 슬라이드/페이드 조합
  - 다이얼로그: 스케일 + 블러 배경
  - 토스트: 위에서 떨어지는 애니메이션
  - 스코어 변경: 숫자 롤링 애니메이션

### Priority 4 — 접근성/완성도 (예상 5h)

#### 2.10 접근성 개선
- 색상만이 아닌 보석 모양으로 타일 구분 → 색각이상자 지원
- 진동 피드백 (Telegram Mini App haptic)
- 음소거 상태 시각적 피드백 강화

#### 2.11 메뉴/로고 강화
- 타이틀 로고 이미지 생성 (Gemini on MiniPC)
- 메뉴 배경에 보석 파티클 효과
- 게임 프로모 스크린샷 생성

#### 2.12 성능 최적화
- 에셋 용량 최적화 (WebP 변환)
- 스프라이트 시트 생성 (HTTP 요청 최소화)
- 파티클 수 모바일 기기 대응 조절

---

## 3. 사용 가능한 에셋 매칭

### 3.1 Unity Asset Store 패키지 (로컬: `/Volumes/workspace/Asset Store-5.x/`)

| 패키지 | 용도 | 우선순위 |
|--------|------|---------|
| **karsiori/Pixel Art Gem Pack - Animated** (3.4MB) | 타일 스프라이트 10종×8색 + Spark FX | ⭐⭐⭐ 최우선 |
| **LAYERLAB/GUI Pro - Casual Game** | 버튼, 패널, 팝업, 프레임, 아이콘 | ⭐⭐⭐ 최우선 |
| **SwishSwoosh/Cute UI Interact SFX** | Match, Collect, Pop, Swoosh, UI SFX | ⭐⭐⭐ 최우선 |
| **Dustyroom/FREE Casual Game SFX** (50 WAV) | 보조 캐주얼 SFX | ⭐⭐ |
| **Skril Studio/UI SFX Mega Pack** (1000+) | 버튼, 슬라이더, 경고음 대량 | ⭐⭐ |
| **SheepFactory/Coins Mega Pack** | 코인/점수 UI 장식 | ⭐ |
| **LAYERLAB/GUI Pro - Simple Casual** | 추가 UI 변형 | ⭐ |
| **Sky Den Games/Free Casual GUI** | 대안 UI 스타일 | ⭐ |
| **ricimi/Cartoon GUI Pack** | 대안 카툰 UI | ⭐ |

### 3.2 웹 무료 에셋 (필요 시)

| 소스 | 에셋 유형 | 라이선스 |
|------|----------|---------|
| Kenney.nl | 2D UI, SFX, 타일셋 | CC0 |
| OpenGameArt.org | BGM, SFX, 스프라이트 | CC0/CC-BY |
| Freesound.org | SFX, 환경음 | CC0/CC-BY |
| Incompetech | BGM | Royalty-free |

### 3.3 AI 생성 (MiniPC Gemini)
- 커스텀 타이틀 로고
- 파워업 전용 아이콘 (이모지 대체)
- 프로모 스크린샷/배너

### 3.4 NAS 게임마당 에셋 (161GB)
- **현재 상태**: NAS (100.100.59.78) 접근 불가 ⚠️
- **필요 시**: 추가 한국식 캐주얼 게임 에셋
- 현재 이미 게임마당 에셋 일부 사용 중 (sprites/Yellow~Purple)

---

## 4. 에셋 추출 전략

### 4.1 Unity Package → HTML5 에셋 변환 프로세스
```bash
# 1. .unitypackage 압축 해제 (tar.gz 포맷)
tar -xzf package.unitypackage -C /tmp/extract/

# 2. 에셋 파일 찾기 (GUID 디렉토리 구조)
find /tmp/extract/ -name "pathname" -exec cat {} \;  # 경로 확인
find /tmp/extract/ -name "asset" -exec file {} \;     # 파일 유형 확인

# 3. PNG/WAV 파일 복사 + 리네임
# (GUID 폴더 안의 'asset' 파일이 실제 에셋)

# 4. WAV → OGG/MP3 변환 (ffmpeg)
ffmpeg -i input.wav -c:a libvorbis -q:a 4 output.ogg
ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3

# 5. PNG → WebP 변환 (용량 절감)
cwebp -q 85 input.png -o output.webp

# 6. 스프라이트시트 생성 (선택)
# ImageMagick montage 또는 웹 도구 사용
```

### 4.2 Gem Pack 추출 계획
- **필요**: 타일당 1개 대표 프레임 + Spark 애니메이션
- **선택 기준**:
  - 2 타일 → GEM 1 (GOLD) — 단순, 작음
  - 4 타일 → GEM 2 (BLUE) — 약간 복잡
  - 8 타일 → GEM 3 (TURQUOISE) — 중간
  - 16 타일 → GEM 4 (LIGHT GREEN)
  - 32 타일 → GEM 5 (RED)
  - 64 타일 → GEM 6 (PURPLE)
  - 128 타일 → GEM 7 (GOLD) — 더 화려
  - 256 타일 → GEM 8 (DARK BLUE)
  - 512 타일 → GEM 9 (LILAC)
  - 1024 타일 → GEM 10 Cluster (RED)
  - 2048 타일 → GEM 10 Cluster (GOLD) — 최고 화려
  - 4096+ → GEM 10 Cluster (TURQUOISE) + rainbow FX

---

## 5. Phase 2 실행 계획 (예상 25h)

### Sprint 1: 타일 비주얼 (8h)
1. [ ] Gem Pack 추출 — 11개 대표 보석 PNG + Spark 프레임 (1h)
2. [ ] 타일 CSS 리팩토링 — 보석 이미지 전면 배치, opacity 올리기 (2h)
3. [ ] 타일 값별 보석 매핑 적용 (1h)
4. [ ] 합체 파티클 시스템 구현 (Canvas 기반) (2h)
5. [ ] Spark 애니메이션 통합 (1h)
6. [ ] 테스트 + 미세 조정 (1h)

### Sprint 2: UI 스킨 (7h)
1. [ ] LAYERLAB GUI 에셋 추출 (버튼, 패널, 팝업, 프레임) (1h)
2. [ ] 메뉴 화면 리디자인 — 배경 + 버튼 교체 (2h)
3. [ ] 게임 화면 UI — 스코어바, 파워업바, 보드 프레임 (2h)
4. [ ] 다이얼로그 스킨 교체 (1h)
5. [ ] 반응형 테스트 (모바일/텔레그램) (1h)

### Sprint 3: 사운드 (5h)
1. [ ] SwishSwoosh SFX 추출 + WAV→OGG 변환 (1h)
2. [ ] SFX 매핑 교체 (slide, merge, pop, click, powerup 등) (2h)
3. [ ] 멀티 SFX 변형 시스템 (같은 효과에 랜덤 변형) (1h)
4. [ ] BGM 개선 (추가 트랙 또는 진행도별 변화) (1h)

### Sprint 4: 이펙트/마무리 (5h)
1. [ ] 파워업 아이콘 교체 (Gemini 생성 or LAYERLAB 아이콘) (1h)
2. [ ] UI 전환 애니메이션 강화 (1h)
3. [ ] 배경 업그레이드 (다이내믹 + LAYERLAB BG) (1h)
4. [ ] 성능 최적화 (WebP, 스프라이트시트, 모바일 대응) (1h)
5. [ ] 최종 QA + 배포 (1h)

---

## 6. 라이선스 참고

| 에셋 | 라이선스 | 제한 |
|------|---------|------|
| Unity Asset Store 패키지 | Asset Store EULA | 1 프로젝트 사용 허용, 재배포 금지 |
| 게임마당 (한국콘텐츠진흥원) | 별도 약관 | 크레딧 표기 필요 |
| Kenney.nl | CC0 | 제한 없음 |
| OpenGameArt.org | CC0/CC-BY | CC-BY는 크레딧 표기 |
| AI 생성 (Gemini) | Google ToS | 상업적 사용 가능 |

**현재 크레딧 표기 (index.html에 이미 있음)**:
```
Art: 게임마당 (한국콘텐츠진흥원/한국게임개발자협회)
Audio: Kenney.nl · OpenGameArt.org (CC0)
```
→ Unity Asset Store 에셋 추가 시 크레딧 업데이트 필요

---

## 7. 핵심 요약

**가장 임팩트 높은 작업 (Quick Wins):**
1. 🎯 **Gem Pack 타일 교체** — 즉각적 비주얼 업그레이드 (보석 10종!)
2. 🔊 **SwishSwoosh SFX 교체** — 즉각적 오디오 퀄리티 향상
3. 🎨 **LAYERLAB UI 스킨** — 메뉴/버튼이 한층 프로페셔널

**이미 갖고 있는 에셋으로 해결 가능:**
- 타일 비주얼: ✅ karsiori Gem Pack (1536개 보석 PNG + Spark)
- UI: ✅ LAYERLAB GUI Pro Casual Game (버튼, 패널, 팝업, 배경)
- SFX: ✅ SwishSwoosh Cute UI SFX (Match, Pop, Swoosh, UI 등 100+)
- 보조 SFX: ✅ Dustyroom Casual (50), Skril UI SFX Mega (1000+)

**추가 필요 에셋:**
- BGM 추가 트랙 (무료 웹 소스)
- 파워업 커스텀 아이콘 (Gemini 생성)
- 프로모 이미지/로고 (Gemini 생성)

---

*Phase 2 실행 시 서브에이전트별 Sprint 단위로 진행 권장.*
