# 044 - Tangram Zen (탱그램 젠)

## 게임 컨셉
클래식 탱그램을 현대적으로 재해석한 공간 퍼즐. 7개의 기하학적 도형을 드래그, 회전, 뒤집어 실루엣을 완성. Monument Valley 3 (9/10 PocketGamer) 같은 미니멀 아트 + 두뇌 훈련 트렌드 결합. 포트폴리오에 **공간 인지 퍼즐 부재** (기존: 매칭/배치/로직만).

## 핵심 메카닉
- **도형 배치**: 7개 탱그램 피스를 드래그&드롭으로 실루엣 안에 배치
- **회전**: 터치 제스처로 90°/자유 회전
- **뒤집기**: 더블탭으로 좌우 대칭
- **스냅**: 올바른 위치 근처에서 자동 스냅 (자석)
- **힌트**: 1개 피스의 정확한 위치 표시 (제한적)
- **타이머**: 빠를수록 별점 높음 (선택적)

## 차별점
1. **공간 인지 장르 최초**: 포트폴리오에 tangram/jigsaw 없음
2. **미니멀 아트**: Monument Valley 감성 (힐링+고급스러움)
3. **무한 퍼즐**: 동물, 건축물, 추상 등 500+ 스테이지
4. **일일 탱그램**: 매일 새 퍼즐 (리텐션)
5. **두뇌 훈련**: 공간 지각력, 문제 해결 점수화

## 타겟 유저
- **1차**: 힐링 퍼즐 팬 (명상적 게임플레이)
- **2차**: 두뇌 훈련 선호층 (공간 인지력 향상)
- **3차**: 교육 시장 (아동 공간 감각 발달)

## 수익 모델
- **보상 광고**: 힌트 (피스 1개 자동 배치), 실루엣 외곽선 표시
- **전면 광고**: 5스테이지마다
- **IAP**: 광고 제거 $2.99, 테마 팩 (네온, 목재, 수채화) $0.99
- **프리미엄 퍼즐팩**: 50 추가 스테이지 $0.99

## 기술 스택
- Pure HTML5 Canvas (단일 파일)
- Vanilla JavaScript
- 2D 폴리곤 렌더링 (path2D)
- 충돌 감지 (SAT — Separating Axis Theorem)
- LocalStorage (진행도)

---

## 상세 설계

### 시스템 설계

#### 탱그램 피스 (7개)
```javascript
const PIECES = [
  { id: 'lg_tri_1', type: 'triangle', size: 'large', color: '#FF6B6B',
    vertices: [[0,0],[100,0],[50,50]] },
  { id: 'lg_tri_2', type: 'triangle', size: 'large', color: '#4ECDC4',
    vertices: [[0,0],[100,0],[50,50]] },
  { id: 'md_tri',   type: 'triangle', size: 'medium', color: '#FFE66D',
    vertices: [[0,0],[70,0],[35,35]] },
  { id: 'sm_tri_1', type: 'triangle', size: 'small', color: '#95E1D3',
    vertices: [[0,0],[50,0],[25,25]] },
  { id: 'sm_tri_2', type: 'triangle', size: 'small', color: '#AA96DA',
    vertices: [[0,0],[50,0],[25,25]] },
  { id: 'square',   type: 'square', size: 'small', color: '#F38181',
    vertices: [[0,0],[35,0],[35,35],[0,35]] },
  { id: 'parallel', type: 'parallelogram', size: 'small', color: '#6C5CE7',
    vertices: [[0,0],[35,0],[50,35],[15,35]] },
];
```

#### 실루엣 정의
```javascript
const PUZZLES = [
  {
    id: 1, name: 'Cat', category: 'animals',
    difficulty: 1,
    silhouette: [[...polygon points...]],
    solution: [
      { pieceId: 'lg_tri_1', x: 120, y: 80, rotation: 90, flipped: false },
      { pieceId: 'lg_tri_2', x: 180, y: 80, rotation: 180, flipped: false },
      // ... 7개 피스 위치
    ],
    stars: { 3: 30, 2: 60, 1: 120 }  // 초 기준
  },
  // ... 500+ 퍼즐
];
```

#### 충돌/스냅 시스템
```javascript
function checkSnap(piece, solution) {
  const dx = Math.abs(piece.x - solution.x);
  const dy = Math.abs(piece.y - solution.y);
  const dAngle = Math.abs(piece.rotation - solution.rotation) % 360;
  
  const SNAP_DIST = 15;
  const SNAP_ANGLE = 10;
  
  if (dx < SNAP_DIST && dy < SNAP_DIST && 
      (dAngle < SNAP_ANGLE || dAngle > 360 - SNAP_ANGLE)) {
    // 스냅!
    piece.x = solution.x;
    piece.y = solution.y;
    piece.rotation = solution.rotation;
    piece.locked = true;
    return true;
  }
  return false;
}
```

### UI/UX 플로우

#### 메인 화면
```
┌──────────────────────┐
│                      │
│   ◇ TANGRAM ZEN ◇   │
│                      │
│   ★ Level 23         │
│   🧠 Brain: 82/100   │
│                      │
│    [▶ Continue]      │
│    [📅 Daily]        │
│    [📂 Categories]   │
│    [📊 Stats]        │
│                      │
└──────────────────────┘
```

#### 카테고리 선택
```
┌──────────────────────┐
│ ← Categories         │
│                      │
│  🐾 Animals  (1-50)  │
│     ★★★ 15/50       │
│                      │
│  🏗️ Buildings (51-100)│
│     ★★☆ 8/50        │
│                      │
│  👤 People (101-150) │
│     🔒 Locked        │
│                      │
│  🌿 Nature (151-200) │
│     🔒 Locked        │
│                      │
└──────────────────────┘
```

#### 게임 화면
```
┌──────────────────────┐
│ Lv.23 Cat   ⏱️ 0:24  │
├──────────────────────┤
│                      │
│      ╱╲              │
│     ╱  ╲ ← 실루엣    │
│    ╱    ╲  (반투명)   │
│   ╱______╲           │
│                      │
├──────────────────────┤
│ 피스 트레이:          │
│  △ △ △ ▽ ▽ □ ▱      │
│  (드래그하여 배치)    │
├──────────────────────┤
│ [↻ Rotate] [↔ Flip]  │
│ [💡 Hint]  [↩ Reset] │
└──────────────────────┘
```

#### 완성 화면
```
┌──────────────────────┐
│                      │
│    ✨ PERFECT! ✨     │
│                      │
│    🐱 Cat            │
│    ⭐⭐⭐ (18.2s)     │
│                      │
│   Time: 18.2s        │
│   Hints: 0           │
│   Brain +5           │
│                      │
│   [▶ Next] [🔄 Retry]│
│   [📤 Share]         │
└──────────────────────┘
```

### 밸런스 파라미터

| 난이도 | 스테이지 | 회전 | 뒤집기 | ★★★ 시간 | 힌트 |
|--------|---------|------|--------|----------|------|
| Easy   | 1-50    | 90°만 | 없음  | 60s      | 3    |
| Normal | 51-150  | 90°만 | 있음  | 45s      | 2    |
| Hard   | 151-300 | 자유  | 있음  | 30s      | 1    |
| Expert | 301-500 | 자유  | 있음  | 20s      | 0    |

| 파라미터 | 값 | 설명 |
|---------|-----|------|
| SNAP_DISTANCE | 15px | 스냅 판정 거리 |
| SNAP_ANGLE | 10° | 스냅 판정 각도 |
| ROTATION_STEP | 90° | Easy 회전 단위 |
| HINT_COST | 1 | 힌트 소비 |
| DAILY_REWARD | 50 coins | 일일 퍼즐 보상 |
| CATEGORY_UNLOCK | 별 30개 | 다음 카테고리 해금 |

### 두뇌 점수 시스템
```javascript
{
  spatial: completionRate * 40,    // 완성률 40%
  speed: avgTimeScore * 30,        // 속도 30%  
  accuracy: (1 - hintRate) * 30,   // 정확도 30%
  
  // 7일 추세 그래프 표시
  history: [78, 80, 82, 81, 84, 85, 87]
}
```

### 비주얼 스타일
- **미니멀 젠**: 무채색 배경 + 파스텔 도형
- **그라데이션**: 실루엣은 은은한 그라데이션
- **완성 이펙트**: 모든 피스 배치 시 골든 파티클 + 실루엣 컬러 채움
- **테마 옵션**: 기본(파스텔), 네온(다크+형광), 목재(텍스처), 수채화(투명)
- **트랜지션**: 부드러운 페이드 + 스케일 전환

---
*생성일: 2026-01-31*
*기반 트렌드: Monument Valley 3 (9/10), 두뇌 훈련 itch.io 인기, 공간 인지 퍼즐 포트폴리오 부재, 힐링 게임 수요*
