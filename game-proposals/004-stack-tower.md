# 004. Stack Tower

## 게임 컨셉
**한 줄 요약:** 타이밍 맞춰 블록 쌓기 — 완벽할수록 높이 올라간다

Stack 스타일의 하이퍼캐주얼 게임. 좌우로 움직이는 블록을 터치해서 떨어뜨리고, 이전 블록과 정확히 맞추면 그대로 유지, 어긋나면 튀어나온 부분이 잘려나간다. 블록이 점점 작아지다가 결국 게임 오버.

## 핵심 메카닉
1. **타이밍 터치**: 블록이 좌우로 왔다갔다 → 터치하면 낙하
2. **정밀도 보상**: 완벽 착지(Perfect) 시 블록 크기 유지 또는 증가
3. **누적 긴장감**: 블록 작아질수록 난이도 상승
4. **콤보 시스템**: Perfect 연속 시 보너스 점수 + 시각 이펙트

## 타겟 유저
- 캐주얼 게이머 전 연령대
- 짧은 시간에 한 판 즐기고 싶은 유저
- 최고 기록 경쟁을 좋아하는 유저

## 차별점
- **3D 시점 + 카메라 상승**: 쌓을수록 카메라가 올라가며 성취감
- **테마 스킨**: 도시, 우주, 사막 등 다양한 배경
- **일일 챌린지**: 매일 다른 조건 (속도 증가, 바람 등)

## 수익 모델
- **광고**: 게임 오버 시 리워드 광고 (Continue 1회)
- **IAP**: 스킨 팩, 광고 제거
- **배너**: 메인 화면 하단

## 기술 스택
- **엔진**: HTML5 Canvas / Phaser 3
- **3D 효과**: CSS 3D Transform 또는 pseudo-3D 렌더링
- **저장**: localStorage (최고 기록, 스킨)
- **사운드**: Howler.js

---

## 상세 설계

### 시스템 설계

```
[Game State Machine]
├── MENU → 시작 버튼, 최고 기록 표시
├── PLAYING → 블록 이동, 터치 대기
├── DROPPING → 블록 낙하 애니메이션
├── RESULT → Perfect/Good/Miss 판정
├── GAMEOVER → 점수 표시, 광고 옵션
└── CONTINUE → 리워드 광고 후 재개

[Block System]
- currentBlock: { x, y, width, direction, speed }
- towerBlocks: Array<{ x, y, width }>
- baseWidth: 200px
- minWidth: 20px (이하면 게임 오버)

[Scoring]
- Perfect: +100 × combo
- Good: +50
- Miss: +10
- Combo: Perfect 연속 횟수
```

### UI/UX 플로우

```
[메인 화면]
┌─────────────────────┐
│                     │
│    STACK TOWER      │
│                     │
│   ★ Best: 1,234     │
│                     │
│   [ ▶ PLAY ]        │
│                     │
│   [🎨] [🔊] [🏆]    │
│   스킨  사운드 리더보드│
└─────────────────────┘

[플레이 화면]
┌─────────────────────┐
│  Score: 520  x3     │ ← 점수 + 콤보
│                     │
│    ←[====]→         │ ← 움직이는 블록
│                     │
│      ████           │
│     █████           │ ← 쌓인 타워
│    ██████           │
│   ███████           │
└─────────────────────┘
       ↑ 터치하면 낙하

[게임 오버]
┌─────────────────────┐
│                     │
│    GAME OVER        │
│                     │
│    Score: 1,520     │
│    Best: 1,234 NEW! │
│                     │
│ [📺 Continue]       │ ← 리워드 광고
│ [ 🔄 Retry ]        │
│ [ 🏠 Home ]         │
└─────────────────────┘
```

### 밸런스 파라미터

```javascript
const BALANCE = {
  // 블록 설정
  block: {
    initialWidth: 200,      // 시작 블록 너비 (px)
    minWidth: 20,           // 최소 너비 (이하 게임오버)
    height: 30,             // 블록 높이
    perfectThreshold: 5,    // Perfect 판정 허용 오차 (px)
    goodThreshold: 15,      // Good 판정 허용 오차 (px)
  },
  
  // 이동 속도
  speed: {
    initial: 3,             // 시작 속도 (px/frame)
    increment: 0.1,         // 층당 속도 증가
    max: 8,                 // 최대 속도
  },
  
  // 점수
  scoring: {
    perfect: 100,           // Perfect 기본 점수
    good: 50,               // Good 기본 점수
    miss: 10,               // Miss 기본 점수
    comboMultiplier: 1.0,   // 콤보당 배율 증가
  },
  
  // Perfect 보너스
  perfectBonus: {
    growWidth: 5,           // Perfect 3연속 시 너비 증가량
    comboRequired: 3,       // 너비 증가 필요 콤보
  },
  
  // 애니메이션
  animation: {
    dropSpeed: 15,          // 낙하 속도
    cameraSpeed: 0.1,       // 카메라 상승 부드러움
    sliceFlySpeed: 5,       // 잘린 조각 날아가는 속도
  }
};
```

### 구현 우선순위

1. **MVP (1시간)**
   - 기본 블록 이동 + 터치 낙하
   - Perfect/Good/Miss 판정
   - 블록 쌓기 + 잘림
   - 점수 + 게임오버

2. **Polish (30분)**
   - 콤보 시스템
   - 카메라 상승 효과
   - 잘린 조각 날아감

3. **Extra (선택)**
   - 사운드 이펙트
   - 스킨 시스템
   - 리더보드
