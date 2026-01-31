---
title: "Unity Asset Inventory Update — 전체 에셋 현황"
headline: "265개 에셋 (38GB) 카탈로그 + 12,615개 오디오 파일 추출 완료"
summary: "Unity Asset Store에서 총 265개 패키지(170개 퍼블리셔, 38GB)를 확보하고, 오디오 17개 패키지에서 12,615개 사운드 파일(6.6GB)을 추출 완료. 카테고리별 분류와 게임 폴리싱 활용 계획 정리."
date: 2026-01-31
categories: [assets]
tags: [unity, asset-store, inventory]
---

## 📊 인벤토리 요약

| 항목 | 수치 |
|------|------|
| 총 패키지 수 | **265개** |
| 퍼블리셔 수 | **170개** |
| 총 용량 | **38 GB** |
| 추출 오디오 파일 | **12,615개 (6.6 GB)** |

### 성장 이력

| 시점 | 패키지 수 | 변동 |
|------|-----------|------|
| 2025-01-29 (최초 스캔) | 82개 | — |
| 2026-01-31 (업데이트) | 265개 | **+183개** |

---

## 🗂️ 카테고리별 현황

### 🔊 오디오 — 17개 (10.9 GB)

게임 폴리싱의 핵심. **12,615개 사운드 파일** 추출 완료.

| 분류 | 대표 에셋 | 용도 |
|------|----------|------|
| 범용 SFX | Ultimate Sound FX Bundle (5.9GB) | 모든 게임 |
| 판타지 | Medieval Fantasy SFX, Fantasy Music Pack 2 | RPG, 어드벤처 |
| SF | Sci-Fi Game Sound Effects | 우주, 미래 |
| 레트로 | 8-Bit Retro Game SFX Pack | 픽셀 게임 |
| UI | UI SFX Mega Pack, Cute UI SFX | 모든 게임 UI |
| 발걸음 | Footsteps Pack (626MB) | 리얼리즘 |

### 🎨 2D 에셋 — 48개

| 분류 | 수량 | 핵심 에셋 |
|------|------|----------|
| 캐릭터 메이커 | 10 | SPUM 3종, Hippo 7종, LAYERLAB |
| 캐릭터 스프라이트 | 18 | Luiz Melo 7종, Ansimuz, ARTAPEX |
| 타일셋/배경 | 12 | Gif RPG topdown, Tiny Swords, ElvGames |
| 애니메이션 | 8 | KAWAII ANIMATIONS, ARPG Pack |

### 🖼️ GUI & 아이콘 — 84개

**GUI 스킨 28개** — LAYERLAB 13종이 주력:

| 스타일 | 에셋 |
|--------|------|
| 판타지 RPG | Fantasy RPG GUI (2.1GB), Classic RPG GUI, GUI Pro - Fantasy RPG |
| 캐주얼 | GUI Pro - Casual Game, Yellow Kid, Simple Casual |
| SF/모던 | Heat UI, Sci-fi GUI skin |
| 카드/슬롯 | Card shirts Lite, Match 3 UI |

**아이콘 56개** — 거의 모든 장르 커버:

| 분류 | 대표 에셋 |
|------|----------|
| RPG 아이템 | 2000 Fantasy Icons, Basic RPG Icons, RPG inventory icons |
| 음식/요리 | 150 Food Icon Pack (563MB), Sweet Cakes (434MB) |
| 무기 | Flat 2D Weapons, Melee Weapons, Swordsman Skills |
| 코인/보석 | Coins Mega Pack, Coins Crystals Diamonds |
| 픽셀아트 | Pixel Items, Pixel Art Icons RPG |

### 🧱 3D 모델 — 26개

| 분류 | 수량 | 핵심 에셋 |
|------|------|----------|
| 캐릭터 | 16 | Ida Faber 4종 (6.7GB), POLYBOX, Synty |
| 환경 | 10 | Low Poly Mega Pack, Casino Pack, Polyquest Islands |

### ✨ VFX/셰이더 — 26개

| 분류 | 수량 | 핵심 에셋 |
|------|------|----------|
| 파티클 FX | 18 | Archanor 3종, GAPH 100 Skills, RPG VFX Bundle |
| 셰이더 | 8 | Toony Colors Pro 2, Anime Shading Plus |

### ⚙️ 도구/시스템 — 51개

| 분류 | 수량 | 핵심 에셋 |
|------|------|----------|
| 에디터 확장 | 34 | DOTween, Playmaker, Lean 시리즈 5종 |
| 스크립팅 | 10 | Feel (302MB), Map Creator |
| 완성 프로젝트 | 7 | TopDown Engine, Corgi Engine, Monster Survivors |

---

## 🎵 오디오 추출 상세

모든 오디오 에셋(17개)에서 unitypackage 내부 사운드 파일을 자동 추출:

```
unity-assets/audio/
├── Ultimate Sound FX Bundle/     # ~6,500 파일
├── Medieval Fantasy SFX/         # ~2,000 파일
├── 8-Bit Retro Game SFX/        # ~1,500 파일
├── Footsteps Pack/               # ~800 파일
├── SoundBits Collection/         # ~600 파일
├── ... (12개 추가 패키지)
└── 총 12,615개 파일 / 6.6 GB
```

### 포맷 분포
- **WAV** — 고품질 원본 (대부분)
- **OGG** — 게임 내 사용 최적화
- **MP3** — BGM/Music

---

## 🎮 게임 폴리싱 활용 계획

### 즉시 사용 가능한 조합

| 게임 장르 | GUI | 오디오 | VFX | 캐릭터 |
|----------|-----|--------|-----|--------|
| **RPG/판타지** | Fantasy RPG GUI + Classic RPG GUI | Medieval Fantasy SFX + Fantasy Music | RPG VFX Bundle + 100 Skills FX | SPUM + Luiz Melo |
| **캐주얼/퍼즐** | GUI Pro - Casual + Yellow Kid | Casual Game SFX + Cute UI SFX | Hyper Casual FX + Cartoon FX | 2D Art Maker |
| **SF/우주** | Sci-fi GUI + Heat UI | Sci-Fi Game SFX | Polygon Arsenal | — |
| **카드/슬롯** | Card shirts + Casino Pack | UI SFX Mega Pack | Board Card Game VFX | — |
| **레트로/픽셀** | Pixel 기반 UI | 8-Bit Retro SFX | Retro Arsenal + Arcade VFX | Pixel Hero Maker |
| **서바이벌** | Survival Clean GUI | Survival Sounds + Footsteps | Epic Toon FX | 3D 캐릭터들 |

### 우선순위

1. **🥇 HTML5 게임 포트폴리오 (51개) 폴리싱** — 오디오 + VFX 적용
2. **🥈 텔레그램 Mini App 게임** — UI SFX + 캐주얼 GUI 적용
3. **🥉 신규 게임 프로토타이핑** — 완성 프로젝트 에셋 활용

---

## 📁 주요 퍼블리셔 (패키지 수 Top 10)

| 퍼블리셔 | 패키지 수 | 주력 |
|---------|----------|------|
| LAYERLAB | 16 | GUI/UI 스킨 |
| Hippo | 11 | 2D 캐릭터 메이커 |
| PONETI | 6 | 아이콘/GUI |
| Luiz Melo | 7 | 2D 중세 캐릭터 |
| Carlos Wilkes | 5 | Lean 유틸리티 시리즈 |
| Redcode Games | 5 | C# 유틸리티 |
| CraftPix | 4 | 픽셀 아이콘 |
| Synty Studios | 3 | Low Poly 3D |
| soonsoon | 3 | SPUM 캐릭터 메이커 |
| Ida Faber | 4 | 3D 캐릭터 (고용량) |

---

## 📌 결론

- **82개 → 265개**: 3배 이상 에셋 확보
- **오디오 완전 확보**: 12,615개 사운드 파일로 모든 장르 커버
- **GUI 완비**: LAYERLAB 13종 + 15개 추가 = 어떤 스타일이든 즉시 적용
- **VFX 풍부**: RPG, 캐주얼, 레트로 모든 장르 커버
- **즉시 게임 폴리싱 가능**: 사운드, UI, 이펙트 모두 ready
