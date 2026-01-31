---
title: "앱스토어 스크린샷 자동 생성 툴 기획서"
date: 2026-01-31
categories: [docs, planning]
tags: [스크린샷, 도구, 기획]
layout: post
---

# 앱스토어 스크린샷 자동 생성 툴 기획서

> 작성일: 2026-01-31
> 대상: 1인 소프트웨어 사업자 (카메라 앱 + 인디게임 개발)
> 환경: Mac Studio (M-series), macOS

---

## 목차

1. [시장 조사 — 기존 툴 비교](#1-시장-조사--기존-툴-비교)
2. [앱스토어 스크린샷 요구사항](#2-앱스토어-스크린샷-요구사항)
3. [문제 정의 — 왜 자동화가 필요한가](#3-문제-정의--왜-자동화가-필요한가)
4. [AI 디자인 에이전트 활용 가능성](#4-ai-디자인-에이전트-활용-가능성)
5. [제안 솔루션 비교](#5-제안-솔루션-비교)
6. [자체 구축 상세 설계](#6-자체-구축-상세-설계)
7. [ROI 분석](#7-roi-분석)
8. [실행 계획](#8-실행-계획)

---

## 1. 시장 조사 — 기존 툴 비교

### 1.1 SaaS / 웹 기반 도구

| 툴 | 가격 | 주요 기능 | 장점 | 단점 |
|---|---|---|---|---|
| **AppScreens** | 무료 제한 / $24/월 / $6.95/월(연간) | 반응형 디자인 → 전 디바이스 자동 생성, AI 캡션, 다국어 | 속도·자동화 최강, iOS+Android 한번에 | AI 창의성 한계, 구독 비용 |
| **Screenshots.pro** | 무료 제한 / $19/월~$59/월 / $149~$379/년 | 파노라마 스크린샷, Google Translate API 연동, 고급 커스터마이징 | 다국어 자동번역, 글로벌 롤아웃 최적 | 러닝커브 높음, 비용 높음 |
| **The App Launchpad** | 무료 제한 / $29/월 / $15/월(연간) | 템플릿 라이브러리 + 인스피레이션 허브 | 초보자 친화, 레퍼런스 풍부 | 커스터마이징 제한 |
| **Placeit (Envato)** | $7.47/월(구독) | 목업 템플릿, 드래그&드롭 | 저렴, 목업 종류 방대 | 앱스토어 특화가 아님, 배치 처리 불편 |
| **App Mockup** | $35~$199 (일회성) | 고품질 템플릿 팩 | 구독 없음, 디자인 퀄리티 높음 | 자동화 부족, 수동 작업 필요 |

### 1.2 네이티브 Mac 앱

| 툴 | 가격 | 주요 기능 | 장점 | 단점 |
|---|---|---|---|---|
| **Picasso** | $6.99/월 / $45/년 / $79.99 평생 | 40+ 디바이스 프레임, 다국어(.xcstrings), App Store Connect 직접 업로드 | Mac 네이티브, ASC 직접 업로드, fastlane 연동 | Apple 플랫폼만, 템플릿 기본적 |
| **App Store Screenshot Studio** | $6.99/월 / $45/년 / $79.99 평생 | AI 번역, 간단한 에디터, ASC 업로드 | 경량·간편 | 커스터마이징 제한, 간헐적 버그 |

### 1.3 개발자 도구 (CLI / 오픈소스)

| 툴 | 가격 | 주요 기능 | 장점 | 단점 |
|---|---|---|---|---|
| **Fastlane frameit** | 무료 (오픈소스) | CLI로 디바이스 프레임 씌우기, 텍스트/배경 추가, Framefile.json 설정 | 무료, CI/CD 연동, 자동화 극대 | 설정 복잡, 프레임 업데이트 지연, Ruby 의존 |
| **Fastlane snapshot** | 무료 (오픈소스) | Xcode UI Test로 자동 스크린샷 캡처 | 실제 시뮬레이터에서 캡처 | iOS만, 설정 난이도 높음 |
| **YUZU AppScreen** | 무료 (MIT, 오픈소스) | 웹 기반 에디터, 3D 목업, 다국어, AI 번역(Claude/OpenAI/Google), 배치 ZIP 내보내기 | 무료, 셀프호스팅 가능, 기능 풍부 | 브라우저 기반 (CLI 아님) |
| **SetKu ScreenshotGenerator** | 무료 (오픈소스) | Python + Pillow, CLI, 디바이스 프레임 합성 | Python 기반, 확장 용이 | macOS만, 디바이스 지원 제한적 |
| **solesby/appshots** | 무료 (오픈소스) | Bash + ImageMagick, 설정 파일(appshots.txt) | 단순, 빠름 | 오래됨, 최신 디바이스 미지원 |

### 1.4 핵심 인사이트

- **AppScreens**가 가장 완성도 높은 SaaS이나 구독 비용 발생
- **Picasso**는 Mac 네이티브로 편리하나 프로그래밍적 자동화 한계
- **Fastlane frameit**은 CI/CD에 강하나 디자인 자유도 낮음
- **YUZU AppScreen**은 오픈소스로 기능이 풍부하나 브라우저 기반
- **자체 구축**의 참고 코드가 이미 여러 오픈소스에 존재 (Python+Pillow, Bash+ImageMagick)

---

## 2. 앱스토어 스크린샷 요구사항

### 2.1 Apple App Store (2025/2026 기준)

#### iPhone (필수: 6.9" 또는 6.5" 중 하나)

| 디스플레이 | 해상도 (세로) | 대표 기기 | 필수 여부 |
|---|---|---|---|
| **6.9"** | 1320×2868 / 1290×2796 / 1260×2736 | iPhone 17 Pro Max, 16 Pro Max, 16 Plus, Air | ✅ 필수 (6.5" 대체 가능) |
| **6.5"** | 1284×2778 / 1242×2688 | iPhone 14 Plus, 13 Pro Max, XS Max | 6.9" 없으면 필수 |
| **6.3"** | 1206×2622 / 1179×2556 | iPhone 17 Pro, 16 Pro, 15 Pro | 자동 스케일 |
| **6.1"** | 1170×2532 / 1125×2436 / 1080×2340 | iPhone 16e, 14, 13, 12 | 자동 스케일 |
| **5.5"** | 1242×2208 | iPhone 8 Plus, 7 Plus | 자동 스케일 |

#### iPad (앱이 iPad에서 실행되면 필수)

| 디스플레이 | 해상도 (세로) | 대표 기기 | 필수 여부 |
|---|---|---|---|
| **13"** | 2064×2752 / 2048×2732 | iPad Pro M5/M4, iPad Air M3/M2 | ✅ 필수 |
| **11"** | 1488×2266 / 1668×2420 / 1640×2360 | iPad Pro 11", iPad Air, iPad mini | 자동 스케일 |

#### 기타
- **Mac**: 2880×1800, 2560×1600, 1440×900, 1280×800 (16:10 비율)
- **Apple Watch**: 422×514 (Ultra 3) ~ 312×390 (Series 3)
- **Apple TV**: 1920×1080 또는 3840×2160
- **Apple Vision Pro**: 3840×2160
- **포맷**: JPEG, JPG, PNG
- **파일 크기**: 최대 8MB/장
- **개수**: 1~10장/디바이스/언어

#### 실무 최소 세트 (2025+ 전략)

Apple이 자동 스케일링을 지원하므로, **실질적으로 2세트만 준비하면 됨:**

| 타겟 | 해상도 | 커버 범위 |
|---|---|---|
| **iPhone 6.9"** | 1290×2796 | → 6.5", 6.3", 6.1", 5.5" 자동 스케일 |
| **iPad 13"** | 2048×2732 | → 12.9", 11" 자동 스케일 |

### 2.2 Google Play Store

| 디바이스 | 필수 수량 | 최대 수량 | 비율 | 권장 해상도 | 포맷 |
|---|---|---|---|---|---|
| **Phone** | 2장 | 8장 | 9:16 (세로) / 16:9 (가로) | 1080×1920 | JPEG / 24-bit PNG (알파 없음) |
| **Tablet 7"/10"** | 4장 | 8장 | 9:16 / 16:9 | 1080×1920+ | JPEG / 24-bit PNG |
| **Wear OS** | 1장 | 8장 | 1:1 | 384×384+ | JPEG / 24-bit PNG |
| **Android TV** | 1장 | 8장 | 16:9 | 1920×1080 | JPEG / 24-bit PNG |
| **Feature Graphic** | 1장 | 1장 | — | 1024×500 (고정) | JPEG / 24-bit PNG |

- **치수 제한**: 최소 320px, 최대 3840px, 최대 치수가 최소 치수의 2배를 넘지 않아야 함
- **파일 크기**: 최대 8MB/장

### 2.3 통합 생성 매트릭스

카메라 앱 + 게임 앱을 위한 최소 필요 세트:

```
앱 1개 기준:
├── Apple App Store
│   ├── iPhone 6.9" (1290×2796)  × 스크린샷 10장 × 언어 3종 = 30장
│   └── iPad 13" (2048×2732)     × 스크린샷 10장 × 언어 3종 = 30장
├── Google Play
│   ├── Phone (1080×1920)        × 스크린샷 8장 × 언어 3종 = 24장
│   └── Feature Graphic (1024×500) × 언어 3종 = 3장
└── 합계: ~87장/앱

앱 2개 기준: ~174장
향후 앱 추가 시: ×N
```

---

## 3. 문제 정의 — 왜 자동화가 필요한가

### 3.1 현재 고통점

1. **볼륨**: 앱 1개에 최소 87장, 앱이 늘어날수록 N배 증가
2. **반복 작업**: 같은 디자인을 해상도만 바꿔서 수십 번 내보내기
3. **다국어**: 텍스트 교체 → 줄바꿈/정렬 확인 → 다시 내보내기
4. **업데이트 주기**: 앱 업데이트마다 스크린샷도 갱신 필요
5. **일관성**: 수동 작업 시 디바이스별 정렬·여백 불일치 리스크
6. **기회비용**: 스크린샷 만드는 시간 = 개발하지 못하는 시간

### 3.2 1인 개발자 특수 상황

- 디자이너 없음 → 프로그래밍적 접근이 유일한 확장 방법
- Mac Studio 환경 → 로컬 CLI 도구가 가장 효율적
- 카메라 앱 + 게임 → 스타일이 다른 2종 이상의 앱 관리
- 앱스토어 전환율에서 **스크린샷이 50%+ 결정** (상위 3장이 핵심)

### 3.3 자동화의 핵심 가치

```
수동: 스크린샷 1장 × 20분 × 87장 = 29시간 (약 3.5일)
자동: 템플릿 1회 제작 (4시간) + 생성 실행 (5분) = 4시간 5분

앱 업데이트 시:
수동: 매번 29시간
자동: 스크린샷 교체 + 재실행 = 30분
```

---

## 4. AI 디자인 에이전트 활용 가능성

### 4.1 Lovart.ai

- **개요**: "세계 최초 AI 디자인 에이전트". 텍스트 프롬프트 → 전문 디자인 생성
- **기능**: 이미지/영상/3D, 레이어 편집, 스타일 일관성, 텍스트 편집, 실시간 레퍼런스 검색
- **가격**: 무료 플랜(소량 크레딧) / Starter $15/월(2000 크레딧) / Pro ~$90/월(11000 크레딧)
- **활용 가능성**:
  - ✅ 배경 디자인/그라데이션 생성
  - ✅ 마케팅 비주얼 컨셉 잡기
  - ⚠️ 정확한 픽셀 사이즈 제어 어려움
  - ❌ 배치 생성 자동화 미지원
  - ❌ 앱스토어 규격 정밀 출력 불가
  - ❌ 프로그래밍적 API 없음 (인터랙티브만)

### 4.2 기타 AI 도구

| 도구 | 활용 가능 영역 | 한계 |
|---|---|---|
| **Midjourney / DALL-E** | 배경 이미지 생성 | 정확한 사이즈/레이어 제어 불가 |
| **Canva AI** | 템플릿 기반 디자인 | 배치 자동화 없음, 구독 필요 |
| **Claude/GPT (코드 생성)** | 자동화 스크립트 작성 도움 | 직접 이미지 생성은 불가 |

### 4.3 AI 활용 결론

> AI 디자인 에이전트는 **초기 컨셉/배경 디자인에 보조적**으로 활용 가능하나,
> 앱스토어 스크린샷의 **정밀한 규격·배치·다국어 자동화**에는 부적합.
> **자체 구축 도구 + AI 배경 생성** 하이브리드가 최적.

---

## 5. 제안 솔루션 비교

### 옵션 A: 기존 SaaS 사용 (AppScreens)

| 항목 | 평가 |
|---|---|
| 초기 비용 | $6.95/월 (연간) |
| 자동화 수준 | ★★★★☆ (웹 UI 필요) |
| 커스터마이징 | ★★★☆☆ |
| CLI 통합 | ❌ |
| 다국어 | ✅ (AI 번역 포함) |
| 관리 부담 | 낮음 |
| 적합도 | 빠르게 시작, 커스텀 한계 |

### 옵션 B: Mac 네이티브 앱 (Picasso)

| 항목 | 평가 |
|---|---|
| 초기 비용 | $79.99 (평생) |
| 자동화 수준 | ★★★☆☆ (GUI, ASC 업로드) |
| 커스터마이징 | ★★★★☆ |
| CLI 통합 | ❌ (GUI만) |
| 다국어 | ✅ (.xcstrings) |
| 관리 부담 | 낮음 |
| 적합도 | Apple 전용 앱에 좋음, Android 커버 불가 |

### 옵션 C: 자체 구축 (Python CLI)

| 항목 | 평가 |
|---|---|
| 초기 비용 | $0 (개발 시간만) |
| 자동화 수준 | ★★★★★ (완전 자동) |
| 커스터마이징 | ★★★★★ |
| CLI 통합 | ✅ 네이티브 |
| 다국어 | ✅ (YAML/JSON 설정) |
| 관리 부담 | 중간 (유지보수 필요) |
| 적합도 | 완전한 제어, 장기 ROI 최고 |

### 옵션 D: 하이브리드 (자체 CLI + 오픈소스 활용)

| 항목 | 평가 |
|---|---|
| 초기 비용 | $0 |
| 자동화 수준 | ★★★★★ |
| 커스터마이징 | ★★★★★ |
| CLI 통합 | ✅ |
| 다국어 | ✅ |
| 관리 부담 | 낮~중 (검증된 라이브러리 활용) |
| 적합도 | **🏆 최적 선택** |

### ✅ 권장: 옵션 D — 하이브리드 자체 구축

**이유:**
1. 1인 개발자의 워크플로우에 완벽히 맞춤
2. 구독 비용 $0, 장기적 ROI 최고
3. CLI 기반으로 `make screenshots` 한 줄로 전체 생성
4. 오픈소스(Pillow, frameit 프레임 등) 활용으로 개발 시간 단축
5. 향후 앱 추가 시 설정 파일만 추가하면 됨

---

## 6. 자체 구축 상세 설계

### 6.1 기술 스택

```
Python 3.11+ (Mac Studio에 이미 설치)
├── Pillow (PIL Fork) — 이미지 합성·리사이즈·텍스트 렌더링
├── PyYAML — 설정 파일 파싱
├── Click — CLI 프레임워크
├── Jinja2 — 텍스트 템플릿 (선택)
└── (선택) CairoSVG — SVG 디바이스 프레임 지원
```

**Python + Pillow 선택 이유:**
- Mac Studio에 Python 이미 설치됨
- Pillow은 이미지 처리의 표준, 풍부한 기능
- 참고할 오픈소스 코드 다수 존재 (SetKu/ScreenshotGenerator 등)
- Node + Sharp 대비: Python이 이미지 처리 생태계가 더 풍부
- Puppeteer 대비: 헤드리스 브라우저 불필요한 단순 이미지 합성에 과잉

### 6.2 프로젝트 구조

```
screenshot-forge/
├── forge.py                  # 메인 CLI 엔트리포인트
├── config/
│   ├── devices.yaml          # 디바이스 정의 (사이즈, 프레임 경로)
│   └── stores.yaml           # 스토어별 요구사항
├── templates/
│   ├── camera-app/
│   │   ├── template.yaml     # 레이아웃 정의
│   │   └── screens/          # 스크린 번호별 설정
│   └── indie-game/
│       ├── template.yaml
│       └── screens/
├── assets/
│   ├── frames/               # 디바이스 프레임 PNG
│   │   ├── iphone-6.9/
│   │   ├── iphone-6.5/
│   │   ├── ipad-13/
│   │   └── android-phone/
│   ├── fonts/                # 폰트 파일
│   ├── backgrounds/          # 배경 이미지/그라데이션
│   └── badges/               # 뱃지 (New, #1 등)
├── locales/
│   ├── ko.yaml               # 한국어 텍스트
│   ├── en.yaml               # 영어 텍스트
│   └── ja.yaml               # 일본어 텍스트
├── screenshots/
│   ├── camera-app/           # 원본 스크린샷
│   │   ├── screen-01.png
│   │   ├── screen-02.png
│   │   └── ...
│   └── indie-game/
├── output/                   # 생성 결과물
│   ├── camera-app/
│   │   ├── ko/
│   │   │   ├── iphone-6.9/
│   │   │   ├── ipad-13/
│   │   │   └── android-phone/
│   │   ├── en/
│   │   └── ja/
│   └── indie-game/
├── lib/
│   ├── composer.py           # 이미지 합성 엔진
│   ├── frame_renderer.py     # 디바이스 프레임 오버레이
│   ├── text_renderer.py      # 텍스트 렌더링 (다국어)
│   ├── background.py         # 배경 생성 (단색/그라데이션/이미지)
│   ├── resizer.py            # 디바이스별 리사이즈
│   └── exporter.py           # 출력 (PNG/JPEG, 폴더 구조)
├── requirements.txt
└── Makefile
```

### 6.3 템플릿 시스템

```yaml
# templates/camera-app/template.yaml
app_name: "CameraApp Pro"
style:
  background:
    type: gradient  # solid | gradient | image
    colors: ["#1a1a2e", "#16213e", "#0f3460"]
    angle: 135
  frame:
    device: auto     # 디바이스에 따라 자동 선택
    color: midnight  # midnight | silver | gold
    shadow:
      blur: 30
      opacity: 0.4
      offset_y: 15
  text:
    headline:
      font: "Pretendard-Bold"
      size_ratio: 0.04   # 캔버스 높이 대비 비율
      color: "#FFFFFF"
      position: top       # top | bottom | center
      margin_top: 0.08
    subheadline:
      font: "Pretendard-Regular"
      size_ratio: 0.025
      color: "#CCCCCC"
      position: below_headline
      margin_top: 0.02
  screenshot:
    position: center-bottom  # center | center-bottom | offset-right
    scale: 0.65              # 캔버스 대비 스케일
    corner_radius: 12
    margin_bottom: 0.05

screens:
  - id: screen-01
    screenshot: "screen-01.png"
    text_key: "screen_01"    # locales/*.yaml의 키
  - id: screen-02
    screenshot: "screen-02.png"
    text_key: "screen_02"
  # ...
```

### 6.4 다국어 처리

```yaml
# locales/ko.yaml
app_name: "카메라앱 프로"
screens:
  screen_01:
    headline: "더 선명한 사진"
    subheadline: "AI 노이즈 제거로 완벽한 순간을 담다"
  screen_02:
    headline: "프로급 필터"
    subheadline: "30가지 전문가 프리셋"

# locales/en.yaml
app_name: "CameraApp Pro"
screens:
  screen_01:
    headline: "Sharper Photos"
    subheadline: "AI Noise Reduction for Perfect Moments"
  screen_02:
    headline: "Pro-Grade Filters"
    subheadline: "30 Expert Presets"

# locales/ja.yaml
app_name: "カメラアプリ Pro"
screens:
  screen_01:
    headline: "より鮮明な写真"
    subheadline: "AIノイズ除去で完璧な瞬間を"
  screen_02:
    headline: "プロ級フィルター"
    subheadline: "30種のエキスパートプリセット"
```

**다국어 처리 핵심:**
- 텍스트 길이에 따른 자동 폰트 크기 조정
- CJK (한중일) 폰트 + Latin 폰트 자동 전환
- RTL (아랍어 등) 고려 시 확장 가능
- 권장 폰트: Pretendard (한국어), Inter (영어), Noto Sans JP (일본어)

### 6.5 디바이스 프레임 오버레이

```yaml
# config/devices.yaml
devices:
  iphone-6.9:
    name: "iPhone 16 Pro Max"
    canvas_size: [1290, 2796]  # 최종 출력 사이즈
    screen_area: [1290, 2796]  # 스크린 영역 (프레임 내부)
    frame_image: "frames/iphone-6.9/midnight.png"
    frame_padding:  # 프레임이 스크린 밖으로 나가는 영역
      top: 45
      bottom: 45
      left: 22
      right: 22
    corner_radius: 55
    platform: apple

  ipad-13:
    name: "iPad Pro 13 M4"
    canvas_size: [2048, 2732]
    screen_area: [2048, 2732]
    frame_image: "frames/ipad-13/space-black.png"
    frame_padding:
      top: 50
      bottom: 50
      left: 50
      right: 50
    corner_radius: 30
    platform: apple

  android-phone:
    name: "Android Phone"
    canvas_size: [1080, 1920]
    screen_area: [1080, 1920]
    frame_image: null  # 프레임 없이 또는 제네릭 프레임
    corner_radius: 20
    platform: google

  google-feature:
    name: "Google Play Feature Graphic"
    canvas_size: [1024, 500]
    screen_area: null  # 스크린샷이 아닌 그래픽
    platform: google
```

**프레임 소스:**
1. **Apple 공식**: Apple Design Resources에서 기기 베젤 다운로드
2. **Facebook Devices**: [design.facebook.com](https://design.facebook.com/toolsandresources/devices/) (fastlane frameit도 이 소스 사용)
3. **직접 제작**: 단색 라운드 렉트로 미니멀 프레임 (가장 유연)

### 6.6 이미지 합성 파이프라인

```
[1] 배경 생성
    ↓ (단색/그라데이션/이미지 블러)
[2] 스크린샷 리사이즈
    ↓ (타겟 디바이스 비율에 맞춰 스케일)
[3] 라운드 코너 적용
    ↓ (디바이스별 코너 라디어스)
[4] 디바이스 프레임 합성
    ↓ (프레임 PNG 오버레이)
[5] 그림자 생성
    ↓ (드롭 쉐도우 효과)
[6] 캔버스에 배치
    ↓ (position 설정에 따라)
[7] 텍스트 렌더링
    ↓ (headline + subheadline, 다국어)
[8] 뱃지 오버레이 (선택)
    ↓
[9] 최종 사이즈 확인 & 내보내기
    ↓ (PNG/JPEG, 8MB 미만 확인)
[10] 출력 폴더 정리
```

### 6.7 CLI 인터페이스

```bash
# 전체 생성 (모든 앱, 모든 디바이스, 모든 언어)
python forge.py generate

# 특정 앱만
python forge.py generate --app camera-app

# 특정 언어만
python forge.py generate --app camera-app --lang ko

# 특정 디바이스만
python forge.py generate --app camera-app --device iphone-6.9

# 특정 스크린만
python forge.py generate --app camera-app --screen screen-01

# 미리보기 (웹 브라우저에서 결과물 확인)
python forge.py preview --app camera-app

# 디바이스 프레임 다운로드/업데이트
python forge.py frames update

# 출력 정리
python forge.py clean

# 검증 (사이즈, 포맷, 파일크기 체크)
python forge.py validate --app camera-app
```

**Makefile 통합:**
```makefile
.PHONY: screenshots screenshots-ko preview clean

screenshots:
	python forge.py generate

screenshots-ko:
	python forge.py generate --lang ko

preview:
	python forge.py preview

clean:
	python forge.py clean
```

### 6.8 예상 구현 시간

| 단계 | 작업 | 예상 시간 |
|---|---|---|
| **Phase 1: 코어** | CLI 뼈대 + 설정 파서 + 단색 배경 + 텍스트 렌더링 | 8시간 |
| **Phase 2: 프레임** | 디바이스 프레임 합성 + 그림자 | 6시간 |
| **Phase 3: 다국어** | locale 시스템 + CJK 폰트 처리 | 4시간 |
| **Phase 4: 배치** | 전체 매트릭스 생성 + 폴더 구조 | 3시간 |
| **Phase 5: 고급** | 그라데이션 배경 + 뱃지 + 미리보기 | 5시간 |
| **Phase 6: 폴리싱** | 엣지 케이스 + 검증 + 문서화 | 4시간 |
| **합계** | | **~30시간** |

서브에이전트를 활용한 AI 페어 프로그래밍 시: **~15~20시간** (약 2~3일)

---

## 7. ROI 분석

### 7.1 시간 절약

| 시나리오 | 수동 | 자동 | 절약 |
|---|---|---|---|
| **초기 제작** (앱 1개, 87장) | 29시간 | 4시간(템플릿) + 5분(생성) | 25시간 |
| **앱 업데이트** (스크린샷 교체) | 15시간 | 30분 | 14.5시간 |
| **새 앱 추가** | 29시간 | 2시간(템플릿) + 5분 | 27시간 |
| **언어 추가** (1종) | 10시간 | 1시간(번역) + 5분 | 9시간 |
| **연간** (4회 업데이트 × 2앱) | 232시간 | 18시간 | **214시간** |

### 7.2 비용 비교 (연간)

| 방법 | 직접 비용 | 기회비용 (시간) | 총 비용 |
|---|---|---|---|
| **수동 (Figma 등)** | $0 | 232시간 | 232시간 |
| **AppScreens SaaS** | $83.40/년 | 40시간 | $83 + 40h |
| **Picasso** | $79.99 (1회) | 60시간 | $80 + 60h |
| **자체 구축** | $0 | 30시간(초기) + 18시간(운영) | 48시간 (1년차), 18시간 (2년차~) |

### 7.3 손익분기점

- **자체 구축 vs SaaS**: 1년차부터 자체 구축이 유리 (시간·비용 모두)
- **자체 구축 vs 수동**: 앱 1개 업데이트 2회부터 ROI 달성
- **2년차 이후**: 연간 18시간만 투입 (= 2일 반)

---

## 8. 실행 계획

### Phase 1: MVP (1주차) — "일단 돌아가게"

**목표:** iPhone 6.9" + 한국어 1종으로 스크린샷 5장 자동 생성

- [ ] 프로젝트 초기화 (`screenshot-forge/`)
- [ ] `config/devices.yaml` — iPhone 6.9" 정의
- [ ] `lib/background.py` — 단색/그라데이션 배경 생성
- [ ] `lib/text_renderer.py` — Pillow 기반 텍스트 렌더링 (한국어)
- [ ] `lib/composer.py` — 배경 + 스크린샷 + 텍스트 합성
- [ ] `forge.py` — 기본 CLI (`generate` 커맨드)
- [ ] `locales/ko.yaml` — 테스트 텍스트
- [ ] 카메라 앱 시뮬레이터 스크린샷 5장 캡처
- [ ] 실행 테스트 → 5장 PNG 출력 확인

**산출물:** `output/camera-app/ko/iphone-6.9/*.png`

### Phase 2: 다디바이스 (2주차) — "전 디바이스 커버"

- [ ] iPad 13" 추가
- [ ] Android Phone (1080×1920) 추가
- [ ] Google Feature Graphic (1024×500) 추가
- [ ] 디바이스 프레임 통합 (미니멀 프레임 직접 생성 or 공식 프레임)
- [ ] `lib/frame_renderer.py` — 프레임 오버레이 + 그림자
- [ ] `lib/resizer.py` — 스크린샷을 각 디바이스 비율에 맞게 리사이즈
- [ ] 배치 생성 테스트 (4 디바이스 × 5 스크린)

### Phase 3: 다국어 (3주차) — "글로벌 출시 준비"

- [ ] `locales/en.yaml`, `locales/ja.yaml` 추가
- [ ] CJK + Latin 폰트 자동 선택 로직
- [ ] 텍스트 길이별 자동 폰트 크기 조정
- [ ] 전체 매트릭스 배치 생성 (4 디바이스 × 5 스크린 × 3 언어 = 60장)
- [ ] `forge.py validate` — 사이즈/포맷/파일크기 검증

### Phase 4: 폴리싱 (4주차) — "프로덕션 레디"

- [ ] 게임 앱용 템플릿 추가
- [ ] 뱃지 시스템 (New!, Editor's Choice 등)
- [ ] `forge.py preview` — HTML 미리보기 페이지 생성
- [ ] 에러 핸들링 강화
- [ ] README.md 문서화
- [ ] `Makefile` 정리
- [ ] 실제 앱스토어 제출 테스트

### Phase 5: 확장 (이후)

- [ ] App Store Connect API 연동 (자동 업로드)
- [ ] Google Play Console API 연동
- [ ] A/B 테스트 변형 자동 생성
- [ ] CI/CD 연동 (앱 빌드 시 자동 스크린샷 갱신)
- [ ] AI 번역 연동 (Claude API로 번역 자동화)
- [ ] 배경 이미지 AI 생성 연동 (맥북 MLX or Gemini)

---

## 부록 A: 대안 아키텍처 비교

### Node.js + Sharp

```
장점: Sharp는 libvips 기반으로 매우 빠름, npm 생태계
단점: 텍스트 렌더링이 Pillow 대비 약함, SVG 우회 필요
결론: 이미지 리사이즈에 강하나 복합 합성에 불편
```

### Puppeteer/Playwright (HTML → Screenshot)

```
장점: CSS로 레이아웃, 웹 폰트 자유, 반응형 자연스러움
단점: 헤드리스 브라우저 오버헤드, 느림, 환경 의존성
결론: 복잡한 레이아웃이 필요하면 고려, 하지만 과잉
```

### SwiftUI (Xcode Preview + 렌더링)

```
장점: Apple 생태계 네이티브, 정확한 렌더링
단점: Apple 전용, Android 불가, 자동화 복잡
결론: iOS만 지원하면 고려 가능
```

### Python + Pillow ← **선택**

```
장점: 이미 설치됨, 이미지 처리 생태계 풍부, 참고 코드 다수
단점: 복잡한 텍스트 레이아웃은 수동 계산 필요
결론: 단순성과 기능의 최적 균형, 1인 개발자에 적합
```

---

## 부록 B: 참고 오픈소스

| 프로젝트 | 기술 | 참고 포인트 |
|---|---|---|
| [SetKu/ScreenshotGenerator](https://github.com/SetKu/ScreenshotGenerator) | Python + Pillow | 디바이스 프레임 합성 로직 |
| [solesby/appshots](https://github.com/solesby/appshots) | Bash + ImageMagick | 배치 처리 구조, 설정 파일 |
| [YUZU-Hub/appscreen](https://github.com/YUZU-Hub/appscreen) | JavaScript (웹) | 3D 목업, 다국어, UI 참고 |
| [fastlane/frameit](https://docs.fastlane.tools/actions/frameit/) | Ruby | Framefile.json 구조, 프레임 DB |
| [JorgeFrias/Automated-AppStore-Screenshots](https://github.com/JorgeFrias/Automated-AppStore-Screenshots_How-To) | SwiftUI | SwiftUI 기반 접근법 |

---

## 부록 C: Quick Start 예시

도구 완성 후의 실제 워크플로우:

```bash
# 1. 앱 업데이트 후 시뮬레이터에서 스크린샷 캡처
# (수동 또는 fastlane snapshot)

# 2. 스크린샷을 screenshots/ 폴더에 복사
cp ~/Desktop/screenshots/*.png screenshot-forge/screenshots/camera-app/

# 3. 한 줄로 전체 생성
cd screenshot-forge
make screenshots

# 결과:
# output/camera-app/ko/iphone-6.9/screen-01.png  (1290×2796)
# output/camera-app/ko/iphone-6.9/screen-02.png
# ...
# output/camera-app/en/ipad-13/screen-01.png      (2048×2732)
# ...
# output/camera-app/ja/android-phone/screen-01.png (1080×1920)
# ...
# 총 60장 자동 생성 (4 디바이스 × 5 스크린 × 3 언어)

# 4. 미리보기
make preview
# → 브라우저에서 전체 결과물 그리드 확인

# 5. 검증
python forge.py validate
# ✅ All 60 screenshots valid
# ✅ File sizes under 8MB
# ✅ Dimensions match App Store requirements

# 6. App Store Connect에 업로드
# (향후 API 연동 시 자동화 가능)
```

---

*이 기획서는 조사 결과와 실무 경험을 바탕으로 작성되었습니다. 구현 진행 시 Phase 1 MVP부터 시작하여 점진적으로 확장하는 것을 권장합니다.*
