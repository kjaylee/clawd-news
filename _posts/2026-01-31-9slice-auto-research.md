---
title: "9-Slice 자동화 도구/원리 심층 조사"
date: 2026-01-31
categories: [docs, research]
tags: [9slice, GUI, 에셋, 자동화]
layout: post
---

# 9-Slice (9-Patch) 자동화 도구/원리 심층 조사

> 작성일: 2026-01-31
> 목적: GUI 에셋에 자동 9-slice 값 감지/적용 자동화

---

## 1. 9-Slice 개요

### 1.1 정의
9-slice scaling (= Scale 9 grid, 9-patch)은 이미지를 3×3 그리드(9개 영역)로 분할하여 크기 조절 시 모서리/테두리를 보존하는 2D 이미지 리사이징 기법.

```
┌─────────┬───────────────┬─────────┐
│ Corner  │   Top Edge    │ Corner  │  ← 고정
│  (TL)   │  (stretch-x)  │  (TR)   │
├─────────┼───────────────┼─────────┤
│  Left   │    Center     │  Right  │  ← 좌/우 고정
│  Edge   │ (stretch-xy)  │  Edge   │     중앙 양방향 확장
│(str-y)  │               │ (str-y) │
├─────────┼───────────────┼─────────┤
│ Corner  │ Bottom Edge   │ Corner  │  ← 고정
│  (BL)   │  (stretch-x)  │  (BR)   │
└─────────┴───────────────┴─────────┘
```

- **4 Corners**: 절대 스케일링 안 함 (고정)
- **4 Edges**: 한 축으로만 확장 (상/하: 가로 확장, 좌/우: 세로 확장)
- **1 Center**: 양축 확장 가능

### 1.2 역사
- **2005**: Macromedia Flash 8에서 최초 도입
- **2007**: Adobe Fireworks CS3, Illustrator에서 지원
- **현재**: Unity, Godot, Unreal, CSS border-image, Android 9-patch 등 표준 기술

### 1.3 왜 중요한가?
1. **반응형 UI**: 텍스트 길이/화면 크기에 따라 자동 조절
2. **메모리 절약**: 중앙 영역을 1px로 트리밍 가능 → 텍스처 크기 대폭 감소
3. **빌드 크기 감소**: 작은 텍스처 = 적은 저장 공간
4. **아틀라스 효율**: 작은 스프라이트 = 하나의 아틀라스에 더 많이 적재

---

## 2. 기존 도구 분석

### 2.1 TexturePacker (상용)
- **가격**: $39.99 (Pro)
- **9-slice 기능**: 수동 설정 (드래그 방식)
- **자동 감지**: ❌ 없음 (수동으로 녹색 바 드래그)
- **장점**: 30+ 게임 엔진 포맷 지원, 스프라이트 시트 최적화
- **한계**: 자동 border 감지 기능 없음, 수동 작업 필요
- **URL**: https://www.codeandweb.com/texturepacker

### 2.2 Android draw9patch (무료)
- **포함**: Android Studio SDK 내장
- **방식**: WYSIWYG 에디터, 1px 검은 테두리에 마커 그리기
- **포맷**: `.9.png` (1px 테두리에 stretch/content 영역 인코딩)
- **자동 감지**: ❌ 완전 수동
- **특징**:
  - 상/좌 테두리: stretch 가능 영역 지정
  - 하/우 테두리: content 영역 지정
  - 비연속 stretch 영역 가능 (여러 구간)

### 2.3 Unity Sprite Editor
- **자동 슬라이싱**: 투명도 기반으로 스프라이트 분할 (개별 스프라이트 추출)
- **9-slice 설정**: Border 값 수동 입력 (L, T, R, B)
- **주의**: Unity "Automatic Slicing"은 스프라이트 시트 분할이지 9-slice 자동 감지가 아님
- **Image.type**: Simple / Sliced / Tiled / Filled (하나만 선택)

### 2.4 Godot NinePatchRect
- **노드 타입**: `NinePatchRect` (Control 상속)
- **설정**: `patch_margin_left/top/right/bottom` (px 단위)
- **자동 감지**: ❌ 수동 값 입력
- **Stretch Mode**: Stretch / Tile / Tile Fit
- **StyleBoxTexture**: 또 다른 9-slice 지원 (테마 시스템)
- **장점**: Region 설정으로 아틀라스 내 부분 사용 가능

### 2.5 CSS border-image
- **속성**: `border-image-source`, `border-image-slice`, `border-image-width`, `border-image-repeat`
- **slice 단위**: px 또는 % (이미지 기준)
- **repeat 모드**: stretch / repeat / round / space
- **자동 감지**: ❌ 없음

### 2.6 웹/CLI 무료 도구
| 도구 | URL | 특징 |
|------|-----|------|
| **9-slicer** | https://leanrada.com/9-slicer/ | CSS border-image 코드 생성, 시각적 에디터 |
| **MDN Border-image Generator** | https://mdn.github.io/css-examples/tools/border-image-generator/ | 공식 MDN 도구, 전체 border-image 옵션 |
| **border-image.com** | https://border-image.com/ | 프리뷰 + CSS 코드 생성 |
| **Android Asset Studio** | https://romannurik.github.io/AndroidAssetStudio/nine-patches.html | 9-patch 생성, 자동 추정(!) |

### 2.7 자동 감지 기능이 있는 도구 ⭐
| 도구 | 플랫폼 | 알고리즘 | 언어 |
|------|--------|---------|------|
| **Auto9Slicer** (kyubuns) | Unity | 행/열 해시 → 최장 연속 구간 | C# |
| **OnionRing** (kyubuns) | CLI | 동일 알고리즘의 Ruby 원본 | Ruby |
| **ScaleNineSlicer** (utkaka) | Unity | 행/열 비교 + 트리밍 | C# |
| **Android Asset Studio** | Web | 자동 추정 (비공개) | JS |

---

## 3. 자동 감지 알고리즘 (핵심!) ⭐⭐⭐

### 3.1 OnionRing/Auto9Slicer 알고리즘 (검증된 방법)

**핵심 통찰**: 동일한 열(column)/행(row)이 연속되면, 그 영역은 안전하게 확장/축소 가능하다.

#### 알고리즘 단계:
```
1. 각 열(column)을 해시: 열의 모든 픽셀을 연결 → SHA1 해시
   - 투명 픽셀(alpha=0)은 동일값(0)으로 취급
   
2. 각 행(row)을 해시: 행의 모든 픽셀을 연결 → SHA1 해시

3. 열 해시 배열에서 "동일 해시가 가장 길게 연속되는 구간" 탐색
   → 이것이 수평(horizontal) stretch 영역
   
4. 행 해시 배열에서 "동일 해시가 가장 길게 연속되는 구간" 탐색
   → 이것이 수직(vertical) stretch 영역

5. stretch 영역의 시작/끝 좌표 → 9-slice border 값 계산
   - left = stretch_start_x
   - right = width - stretch_end_x
   - top = stretch_start_y
   - bottom = height - stretch_end_y
```

#### Ruby 원본 코드 (OnionRing, kyubuns):
```ruby
# 각 열의 픽셀을 해시
range_width = calc_trim_range(
  (0...png.width).map { |x| 
    Digest::SHA1.hexdigest(
      png.column(x).map { |color| 
        (ChunkyPNG::Color.a(color) != 0) ? color : 0 
      }.join(',')
    )
  }
)

# 각 행의 픽셀을 해시
range_height = calc_trim_range(
  (0...png.height).map { |y|
    Digest::SHA1.hexdigest(
      png.row(y).map { |color|
        (ChunkyPNG::Color.a(color) != 0) ? color : 0
      }.join(',')
    )
  }
)

# 가장 긴 연속 동일 해시 구간 탐색
def calc_trim_range(hash_list)
  tmp_hash = nil
  tmp_start_index = 0
  max_length = 0
  max_range = nil
  hash_list.each_with_index do |hash, index|
    length = (index - 1) - tmp_start_index
    if length > max_length
      max_length = length
      max_range = [tmp_start_index, index - 1]
    end
    if tmp_hash != hash
      tmp_hash = hash
      tmp_start_index = index
    end
  end
  max_range
end
```

### 3.2 대안 알고리즘들

#### A. 엣지 디텍션 (Sobel/Canny)
```
1. 이미지를 그레이스케일 변환
2. Sobel 또는 Canny 엣지 디텍터 적용
3. 수평/수직 프로젝션 생성 (각 행/열의 엣지 강도 합산)
4. 프로젝션에서 "평탄 구간" = stretch 영역
```
- **장점**: 그라디언트/복잡한 패턴에도 동작
- **단점**: 임계값 튜닝 필요, 오탐 가능성

#### B. 알파 채널 분석
```
1. 각 행의 알파 프로파일 추출
2. 인접 행 간 알파 차이 계산
3. 차이가 0인 연속 구간 = stretch 영역
```
- **장점**: 구현 간단, 투명 배경 이미지에 최적
- **단점**: 불투명 이미지에는 불충분

#### C. 색상 히스토그램 기반
```
1. 이미지를 수평/수직 밴드로 분할
2. 각 밴드의 색상 히스토그램 계산
3. 히스토그램이 유사한 인접 밴드 = stretch 영역
```
- **장점**: 색상 변화 패턴 포착
- **단점**: 계산 비용 높음, 구현 복잡

#### D. 행/열 직접 비교 (해시 대신)
```
1. 각 열을 numpy 배열로 추출
2. 인접 열 간 직접 비교 (np.array_equal)
3. 연속 동일 열의 최장 구간 = stretch X 영역
4. 같은 방식으로 행에 적용 → stretch Y 영역
```
- **장점**: 해시 충돌 없음, 정확
- **단점**: 메모리 사용 약간 높음 (큰 이미지에서)

### 3.3 추천 방법 ⭐

**OnionRing 해시 기반 + numpy 직접 비교 하이브리드**

1. **1차**: numpy 행/열 직접 비교 (정확성 우선)
2. **2차**: 알파 프리필터 (투명 영역 무시)
3. **3차**: 최소 border 보장 (1px 이상)
4. **4차**: 대칭 보정 (좌우/상하 대칭 UI는 border도 대칭)

---

## 4. Python 자동 감지 구현

### 4.1 구현 위치
- **프로토타입**: `/Users/kjaylee/clawd/scripts/auto-9slice.py`
- **의존성**: Pillow (PIL), numpy (선택: OpenCV)

### 4.2 핵심 함수
```python
def detect_9slice(image_path):
    """
    이미지에서 9-slice border 값 자동 감지.
    
    Returns:
        dict: {
            'top': int, 'right': int, 'bottom': int, 'left': int,
            'css': str  # border-image-slice CSS 값
        }
    """
```

### 4.3 알고리즘 상세 (프로토타입에 구현됨)

```
Phase 1: 이미지 로드 + 전처리
  - RGBA로 변환
  - numpy 배열로 변환
  - 투명 픽셀 정규화 (alpha=0 → 모든 채널 0)

Phase 2: 열(Column) 분석 → 좌/우 border
  - 각 열 추출 (W개의 열)
  - 인접 열 간 동일성 비교
  - 최장 연속 동일 열 구간 탐색
  - stretch_x = (start, end)

Phase 3: 행(Row) 분석 → 상/하 border
  - 각 행 추출 (H개의 행)
  - 인접 행 간 동일성 비교
  - 최장 연속 동일 행 구간 탐색
  - stretch_y = (start, end)

Phase 4: Border 계산
  - left = stretch_x.start
  - right = width - stretch_x.end - 1
  - top = stretch_y.start
  - bottom = height - stretch_y.end - 1

Phase 5: 검증 + 보정
  - 최소 border: 1px
  - border가 이미지 50% 초과 시 경고
  - stretch 영역이 너무 작으면 (< 2px) 경고
```

---

## 5. 관련 패키지 조사

### 5.1 Python (pip)
| 패키지 | 버전 | 용도 | 자동 감지 |
|--------|------|------|----------|
| `ninepatch` | 0.1.22 | Android 9-patch 읽기/쓰기/뷰어 | ❌ |
| `Pillow` | 11.x | 이미지 처리 기반 | - |
| `opencv-python` | 4.x | 엣지 디텍션, 이미지 분석 | - |
| `numpy` | 2.x | 배열 비교, 수학 | - |

> ⚠️ Python에 **9-slice 자동 감지 패키지는 존재하지 않음**. 직접 구현 필요.

### 5.2 npm (Node.js)
| 패키지 | 용도 | 자동 감지 |
|--------|------|----------|
| `postcss-border-9-patch` | 9-patch CSS border-image 변환 | ❌ (수동 값 입력) |
| `phaser3-nineslice` | Phaser 3 게임 엔진 9-slice 지원 | ❌ |

### 5.3 기타
| 도구/패키지 | 언어 | 용도 | 자동 감지 |
|------------|------|------|----------|
| OnionRing | Ruby | 자동 9-slice + 트리밍 | ✅ |
| Auto9Slicer | C# (Unity) | Unity용 자동 9-slice | ✅ |
| ScaleNineSlicer | C# (Unity) | 자동 감지 + SlicedFilledImage | ✅ |

---

## 6. 실제 적용 계획

### 6.1 우리 에셋 구조
```
unity-assets/
├── gui-casual/   (GUI PRO Kit - Casual Game)
├── gui-rpg/      (GUI PRO Kit - Fantasy RPG)
├── gui-scifi/    (GUI PRO Kit - Sci-Fi)
games/
├── slime-survivor-premium/assets/gui/
└── [기타 게임]/assets/gui/
```

### 6.2 일괄 적용 스크립트 사용법
```bash
# 단일 이미지
python3 scripts/auto-9slice.py path/to/button.png

# 디렉토리 일괄 처리
python3 scripts/auto-9slice.py --dir path/to/gui/ --recursive

# CSS 출력
python3 scripts/auto-9slice.py path/to/panel.png --format css

# JSON 출력 (프로그래밍 연동)
python3 scripts/auto-9slice.py --dir path/to/gui/ --format json --output slices.json

# Godot용 출력
python3 scripts/auto-9slice.py path/to/panel.png --format godot
```

### 6.3 출력 포맷 예시

**CSS (HTML5 게임)**:
```css
.panel {
  border-image-source: url('panel.png');
  border-image-slice: 12 15 12 15;  /* top right bottom left */
  border-image-width: 12px 15px 12px 15px;
  border-image-repeat: stretch;
}
```

**Godot (tscn)**:
```
[node name="Panel" type="NinePatchRect"]
texture = ExtResource("1_abc123")
patch_margin_left = 15
patch_margin_top = 12
patch_margin_right = 15
patch_margin_bottom = 12
```

**JSON**:
```json
{
  "file": "panel.png",
  "width": 100,
  "height": 80,
  "slice": {
    "top": 12,
    "right": 15,
    "bottom": 12,
    "left": 15
  },
  "stretch_region": {
    "x": [15, 84],
    "y": [12, 67]
  },
  "confidence": 0.95
}
```

---

## 7. 알고리즘 심화: Edge Cases와 해결

### 7.1 그라디언트 배경
- **문제**: 그라디언트가 있으면 인접 행/열이 미세하게 다름
- **해결**: 허용 오차(tolerance) 도입 — 픽셀 차이 합이 임계값 이하이면 "동일"로 간주
- **코드**: `np.allclose(col_a, col_b, atol=tolerance)`

### 7.2 완전 투명 이미지 영역
- **문제**: 넓은 투명 영역이 stretch로 잘못 인식
- **해결**: alpha=0 픽셀을 정규화(RGB 무시) + 최소 border 보장

### 7.3 타일링 패턴
- **문제**: 반복 패턴이 "동일 열"로 인식 → border가 너무 작게 나옴
- **해결**: 최소 border를 이미지 크기의 10% 이상으로 제한 (옵션)

### 7.4 비대칭 장식
- **문제**: 좌우/상하 장식이 다른 경우
- **해결**: 각 방향 독립적으로 감지 (이미 기본 동작)

### 7.5 9-slice 불가능한 이미지
- **감지 조건**: stretch 영역이 이미지의 5% 미만이면 "9-slice 부적합" 판정
- **예**: 아이콘, 캐릭터 스프라이트, 복잡한 일러스트

---

## 8. 성능 고려사항

| 이미지 크기 | 처리 시간 (예상) | 메모리 |
|------------|-----------------|--------|
| 64×64 | < 1ms | ~64KB |
| 256×256 | < 5ms | ~1MB |
| 1024×1024 | < 50ms | ~16MB |
| 4096×4096 | < 500ms | ~256MB |

- GUI 에셋은 대부분 256×256 이하 → 일괄 처리도 빠름
- 1000개 이미지 일괄 처리: ~5초 예상

---

## 9. 참고 자료

### 핵심 레퍼런스
- [9-slice scaling - Wikipedia](https://en.wikipedia.org/wiki/9-slice_scaling)
- [OnionRing (Ruby)](https://github.com/kyubuns/onion_ring) — 자동 감지 알고리즘 원본
- [Auto9Slicer (Unity)](https://github.com/kyubuns/Auto9Slicer) — Unity 포팅
- [ScaleNineSlicer (Unity)](https://github.com/utkaka/ScaleNineSlicer) — 고급 기능 (Sliced+Filled)
- [9 Sliced Image 기술 블로그](https://utkaka.github.io/posts/9-sliced-image/) — 렌더링 최적화 심층 분석

### 도구
- [9-slicer Web App](https://leanrada.com/9-slicer/) — CSS border-image 생성
- [MDN border-image Generator](https://mdn.github.io/css-examples/tools/border-image-generator/)
- [Android Asset Studio 9-patch](https://romannurik.github.io/AndroidAssetStudio/nine-patches.html)
- [CSS border-image-slice MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image-slice)

### 문서
- [Unity 9-Slicing Manual](https://docs.unity3d.com/Manual/9SliceSprites.html)
- [Godot NinePatchRect Docs](https://docs.godotengine.org/en/stable/classes/class_ninepatchrect.html)
- [Android draw9patch](https://developer.android.com/studio/write/draw9patch)
- [TexturePacker 9-patch](https://www.codeandweb.com/texturepacker/documentation/user-interface-overview)

---

## 10. 결론 및 추천

### 핵심 발견
1. **자동 9-slice 감지 도구는 거의 없다** — 대부분 수동 설정
2. **검증된 알고리즘은 OnionRing 방식** — 행/열 해시 비교 → 최장 연속 동일 구간
3. **Python 패키지는 존재하지 않음** → 직접 구현 필요 (프로토타입 완성)

### 추천 접근법
1. **우리 프로토타입 사용** (`scripts/auto-9slice.py`)
   - OnionRing 알고리즘 Python 포팅
   - tolerance 파라미터로 그라디언트 지원
   - CSS/Godot/JSON 다중 출력
2. **게임별 일괄 적용**
   - HTML5 게임: CSS border-image-slice 자동 생성
   - Godot 게임: NinePatchRect margin 값 자동 계산
3. **에셋 파이프라인에 통합**
   - 새 GUI 에셋 추가 시 자동 실행
   - 결과를 JSON으로 저장 → 빌드 시스템에서 참조
