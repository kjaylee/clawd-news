---
title: "TOP 5 게임 실제 에셋 폴리싱 계획"
date: 2026-01-31
categories: [docs, planning]
tags: [폴리싱, 에셋, 게임]
layout: post
---

# 🎨 TOP 5 게임 실제 에셋 폴리싱 계획

> **작성:** 2026-01-31
> **목표:** oscillator/프로시저럴 → 실제 에셋으로 교체
> **원칙:** 게임마당 스프라이트 + 무료 CC0 오디오

---

## 📦 에셋 소스

### 🎨 스프라이트/아트 (NAS 게임마당 432GB)
- **경로:** `/volume1/미디어/gamemadang/extracted/2D/`
- **총량:** 150 패키지, 187K PNG, 11K PSD, 645 Aseprite
- **라이선스:** 게임에 넣어 출시+수익화 OK, 리소스 자체 판매 NO
- **출처 표기 필수:** 게임마당 (한국콘텐츠진흥원/한국게임개발자협회)

### 🔊 오디오 (외부 CC0)
- **opengameart.org** — CC0 SFX 팩 (100개+), 무료 BGM
- **kenney.nl** — CC0 게임 에셋 (오디오 포함)
- **freesound.org** — CC0 효과음
- **라이선스:** CC0 (무조건 무료, 출처 표기 불필요)

---

## 🎯 게임별 에셋 매핑

### 1️⃣ Power 2048 (ROI 최고)
**필요 에셋:**
| 항목 | 현재 | 목표 | 소스 |
|------|------|------|------|
| 타일 | CSS gradient | 실제 타일 텍스처 | 퍼즐매치 GUI/게임스크린 |
| 배경 | CSS gradient | 배경 텍스처 | 퍼즐매치 배경 or 캐주얼5종 |
| UI 버튼 | CSS | 실제 버튼 스프라이트 | 퍼즐매치 UI_아이콘&버튼 |
| BGM | oscillator | lo-fi/casual 루프 | opengameart "casual puzzle music" |
| SFX 슬라이드 | oscillator | 실제 슬라이드 효과음 | opengameart CC0 SFX |
| SFX 머지 | oscillator | 실제 머지/팝 효과음 | opengameart CC0 SFX |
| SFX 게임오버 | oscillator | 실제 게임오버 | opengameart CC0 SFX |

**게임마당 패키지:**
- `퍼즐매치_PKGE_1674097468279` — GUI, 버튼, 아이콘, 게임스크린
- `다함께 퍼즐아케이드_PKGE_1648709986453` — 퍼즐 UI, 타일

### 2️⃣ Merge Bloom (가든 게임)
**필요 에셋:**
| 항목 | 소스 |
|------|------|
| 꽃/식물 스프라이트 | 게임마당 캐주얼5종 or 웹 무료 에셋 |
| 정원 배경 | 게임마당 캐주얼 배경 |
| 머지 이펙트 | VFX 스프라이트 (파티클) |
| BGM | 자연/가든 분위기 | opengameart |
| SFX | 꽃 피는 소리, 물뿌리기 | opengameart |

**게임마당 패키지:**
- `캐주얼 5종_PKGE_1618824235914` — 캐주얼 게임 전반
- `Painting Zoo 외_PKGE_1616407500389` — 자연/동물 테마

### 3️⃣ Slime Survivor Premium (뱀서류)
**필요 에셋:**
| 항목 | 소스 |
|------|------|
| 캐릭터 스프라이트 | 인섹트서바이벌 캐릭터 |
| 적 몬스터 | Monster Killer, 몬스터태그, Hunters |
| 무기/아이템 아이콘 | 인섹트서바이벌 아이템 (Weapon/Armor/Potion) |
| 타일맵 배경 | 로그던전/무한더던전 배경 |
| BGM | 8bit chiptune 전투 | opengameart |
| SFX | 공격/피격/레벨업 | opengameart CC0 SFX |

**게임마당 패키지:**
- `인섹트서바이벌_PKGE_1674105643296` — 캐릭터, 무기, 방어구, 포션, UI
- `Monster Killer_PKGE_1674108606610` — 몬스터 스프라이트
- `Hunters_PKGE_1648707132658` — 사냥 게임 캐릭터
- `로그던전 외 1종_PKGE_1681263893599` — 던전 배경, 좀비 캐릭터

### 4️⃣ Sushi Sprint (타임매니지먼트)
**필요 에셋:**
| 항목 | 소스 |
|------|------|
| 음식 스프라이트 | cooking house 패키지 |
| 주방 배경 | cooking house 배경 |
| UI 요소 | 하이퍼캐주얼8종 UI |
| BGM | 일본풍 경쾌한 음악 | opengameart |
| SFX | 요리/서빙/타이머 | opengameart CC0 SFX |

**게임마당 패키지:**
- `cooking house_PKGE_1674031488662` — 요리 게임 전반!
- `하이퍼캐주얼 8종_PKGE_1648706842501` — 캐주얼 UI

### 5️⃣ Puzzle Rogue (던전 로그라이크)
**필요 에셋:**
| 항목 | 소스 |
|------|------|
| 영웅 캐릭터 | 로그던전 캐릭터, 인섹트서바이벌 |
| 적 몬스터 | 무한더던전, 던전리그 몬스터 |
| 던전 타일 | 로그런-어비스타워, darktower defense |
| 아이템/유물 | 인섹트서바이벌 아이템 |
| BGM | 다크 앰비언트 던전 | opengameart |
| SFX | 전투/스킬/보스전 | opengameart CC0 SFX |

**게임마당 패키지:**
- `로그던전 외 1종_PKGE_1681263893599` — 던전 테마 전반
- `무한더던전_PKGE_1615797055686` — 무한 던전 스프라이트
- `던전리그_PKGE_1618563688729` — 던전 리그 에셋
- `로그런-어비스타워_PKGE_1674113809058` — 로그라이크 타워 에셋
- `darktower defense_PKGE_1674179136981` — 다크 타워 에셋

---

## 🔊 다운로드할 오디오 리스트

### 공통 SFX (모든 게임 공유)
- [ ] 버튼 클릭 / UI 터치
- [ ] 게임 시작 / 게임 오버
- [ ] 레벨 업 팡파르
- [ ] 코인/포인트 획득
- [ ] 콤보/체인

### Power 2048 전용
- [ ] 타일 슬라이드
- [ ] 타일 머지 (팝)
- [ ] 2048 달성 축하

### Slime Survivor 전용
- [ ] 8bit chiptune BGM (메인/전투/보스)
- [ ] 무기별 발사 효과음 5종
- [ ] 적 피격 / 사망
- [ ] 보스 등장 경고

### Sushi Sprint 전용
- [ ] 일본풍 BGM
- [ ] 요리 완성 / 서빙 / 실패
- [ ] 타이머 경고

### Puzzle Rogue 전용
- [ ] 다크 앰비언트 BGM
- [ ] 매치-3 콤보
- [ ] 전투 시작 / 보스전

---

## ⚡ 실행 순서

1. **오디오 다운로드** (MiniPC curl) — opengameart CC0 팩
2. **NAS 스프라이트 탐색** — 각 패키지에서 관련 PNG 추출
3. **Power 2048부터 시작** (ROI 최고, 구조 단순)
4. **게임별 서브에이전트 1개씩** (thinking: high)
5. **QA → 커밋 → 다음 게임**

---

## 📏 통합 방법

### 단일 HTML 유지 전략
- 작은 스프라이트 (<50KB) → base64 data URI 임베딩
- 큰 에셋 (BGM 등) → games/{game}/assets/ 폴더에 분리
- Audio: `new Audio('assets/bgm.mp3')` 로 로드
- Sprites: `new Image(); img.src = 'data:image/png;base64,...'` 또는 `assets/sprite.png`

### 파일 구조 변경
```
games/
├── power-2048/
│   ├── index.html      (메인 게임 파일)
│   └── assets/         (신규!)
│       ├── bgm.mp3
│       ├── sfx-merge.mp3
│       ├── sfx-slide.mp3
│       └── tiles.png   (스프라이트시트)
```
