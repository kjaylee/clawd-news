# 014. Laser Reflect Puzzle (레이저 반사 퍼즐)

## 게임 컨셉
레이저 빔을 거울로 반사시켜 모든 타겟을 맞추는 퍼즐 게임.
심플한 조작과 점점 복잡해지는 레벨 구성.

## 핵심 메카닉
1. **레이저 발사**: 화면 한쪽에서 레이저 발사
2. **거울 배치**: 터치/드래그로 거울 각도 조절
3. **목표 달성**: 모든 타겟(보석)에 레이저 도달
4. **장애물**: 레이저를 막는 블록, 분할하는 프리즘

## 게임플레이
- 레벨 시작 시 거울 배치 가능 구역 표시
- 거울을 터치하면 회전
- "발사" 버튼으로 레이저 시뮬레이션
- 모든 타겟 적중 시 클리어

## 타겟 유저
- 퍼즐 애호가 (25-45세)
- 차분한 게임 선호층
- 하루 5-10분 플레이어

## 차별점
- 물리 기반 빛 반사 시뮬레이션
- 레벨 에디터로 UGC 가능성
- 색상 혼합 퍼즐 (RGB 레이저)

## 수익 모델
1. 광고: 레벨 클리어 후 전면 광고
2. 힌트 구매: 최적 배치 힌트
3. 테마팩: 레이저/거울 스킨

## 기술 스택
- HTML5 Canvas
- 순수 JavaScript (라이브러리 없음)
- 터치/마우스 지원

---

## 상세 설계

### 시스템 설계
```
GameState
├── currentLevel: number
├── mirrors: Mirror[]
├── targets: Target[]
├── obstacles: Obstacle[]
├── laserSource: {x, y, angle}
└── isSimulating: boolean

Mirror
├── x, y: position
├── angle: 0-360
├── length: number
└── type: 'single' | 'double'

Target
├── x, y: position
├── hit: boolean
└── color: 'any' | 'red' | 'green' | 'blue'
```

### UI/UX 플로우
1. 메인 메뉴 → 레벨 선택 → 게임 플레이
2. 게임 화면:
   - 상단: 레벨 번호, 별 개수
   - 중앙: 게임 영역 (거울, 타겟, 장애물)
   - 하단: 발사 버튼, 리셋 버튼

### 밸런스 파라미터
- 레벨 1-10: 거울 1-2개, 타겟 1개
- 레벨 11-30: 거울 2-3개, 타겟 2개
- 레벨 31+: 거울 3-4개, 타겟 3개, 장애물 등장

### 레벨 데이터 구조
```javascript
const levels = [
  {
    mirrors: [{x: 200, y: 150, angle: 45}],
    targets: [{x: 350, y: 100}],
    obstacles: [],
    laserSource: {x: 50, y: 200, angle: 0}
  },
  // ...
];
```
