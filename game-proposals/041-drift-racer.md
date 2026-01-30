# 041 - Drift Racer (드리프트 레이서)

## 게임 컨셉
원터치 드리프트 레이싱. 화면을 꾹 누르면 차가 드리프트하고, 떼면 직진. 프로시저럴 트랙에서 최대한 오래 살아남으며 점수를 얻는 무한 러너형 레이싱. Traffic Rider(6,700만 DL) 대비 극도로 단순화한 접근. 레이싱 장르는 포트폴리오에 부재.

## 핵심 메카닉
- **원터치 조작**: 홀드 = 드리프트 (회전), 릴리즈 = 직진
- **속도 증가**: 시간이 지날수록 점점 빨라짐
- **코인 수집**: 드리프트 궤적에 코인 배치 → 스킬풀 드리프트로 수집
- **장애물**: 벽, 다른 차, 오일, 바리케이드
- **드리프트 보너스**: 벽에 가까이 드리프트할수록 점수 배율 상승
- **차량 업그레이드**: 코인으로 핸들링/속도/내구력 업그레이드

## 차별점
1. **레이싱 장르 최초**: 포트폴리오에 레이싱 게임 없음
2. **극강 단순 조작**: 홀드/릴리즈만 (Traffic Rider보다 쉬움)
3. **드리프트 만족감**: 타이어 자국, 연기, 스피드라인 효과
4. **무한 트랙**: 프로시저럴 생성 (매번 다른 코스)
5. **경쟁**: 글로벌 리더보드 + 고스트 레이싱

## 타겟 유저
- **1차**: 하이퍼캐주얼 게이머 (원터치, 즉시 이해)
- **2차**: 레이싱 팬 (드리프트 만족감)
- **3차**: 경쟁적 게이머 (최고 거리 경쟁)

## 수익 모델
- **보상 광고**: 부활 (1회), 코인 ×2
- **전면 광고**: 3라운드마다
- **IAP**: 광고 제거 $2.99, 코인 팩 $0.99~$4.99
- **프리미엄 차량**: 특수 스킨 $0.99 각

## 기술 스택
- Pure HTML5 Canvas (단일 파일)
- Vanilla JavaScript
- 2D 탑다운 뷰
- LocalStorage (최고 점수, 차량, 업그레이드)

---

## 상세 설계

### 시스템 설계

#### 트랙 생성
```javascript
// 프로시저럴 트랙 세그먼트
const SEGMENTS = [
  'straight',      // 직선
  'gentle_left',   // 완만한 좌커브
  'gentle_right',  // 완만한 우커브
  'sharp_left',    // 급커브 좌
  'sharp_right',   // 급커브 우
  'chicane',       // 시케인 (좌우좌)
  's_curve',       // S자 커브
  'hairpin'        // 헤어핀 (180도)
];

function generateTrack(difficulty) {
  const segments = [];
  let curveBias = 0;  // 한쪽으로 너무 쏠리지 않게
  
  for (let i = 0; i < CHUNK_SIZE; i++) {
    const seg = pickSegment(difficulty, curveBias);
    segments.push(seg);
    curveBias += seg.curvature;
  }
  return segments;
}
```

#### 드리프트 물리
```javascript
const CAR = {
  x: 0, y: 0,
  angle: 0,         // 차량 방향
  speed: 200,        // px/s
  driftAngle: 0,     // 드리프트 각도
  isDrifting: false,
  
  update(dt, holding) {
    if (holding) {
      // 드리프트: 회전 + 미끄러짐
      this.driftAngle += DRIFT_RATE * dt;
      this.angle += this.driftAngle * dt;
      // 횡방향 미끄러짐 (드리프트 느낌)
      this.x += Math.cos(this.angle + Math.PI/6) * this.speed * dt;
      this.y += Math.sin(this.angle + Math.PI/6) * this.speed * dt;
      this.isDrifting = true;
    } else {
      // 직진: 드리프트 각도 감소
      this.driftAngle *= 0.9;
      this.x += Math.cos(this.angle) * this.speed * dt;
      this.y += Math.sin(this.angle) * this.speed * dt;
      this.isDrifting = false;
    }
    
    // 속도 점진 증가
    this.speed = Math.min(BASE_SPEED + elapsed * ACCEL, MAX_SPEED);
  }
};
```

#### 니어미스 시스템 (드리프트 보너스)
```javascript
function checkNearMiss(car, walls) {
  const distToWall = getMinDistToWall(car, walls);
  
  if (distToWall < NEAR_MISS_THRESHOLD) {
    // 벽에 가까울수록 높은 보너스
    const bonus = Math.floor((NEAR_MISS_THRESHOLD - distToWall) / 5);
    nearMissStreak++;
    score += bonus * nearMissStreak;
    showNearMissEffect();
  } else {
    nearMissStreak = 0;
  }
}
```

#### 차량 & 업그레이드
```javascript
const CARS = {
  starter: { handling: 1.0, maxSpeed: 300, durability: 1, cost: 0 },
  sport:   { handling: 1.2, maxSpeed: 350, durability: 1, cost: 500 },
  drift:   { handling: 1.5, maxSpeed: 320, durability: 1, cost: 800 },
  tank:    { handling: 0.8, maxSpeed: 280, durability: 3, cost: 1000 },
  turbo:   { handling: 1.0, maxSpeed: 400, durability: 1, cost: 1500 },
};

const UPGRADES = {
  handling: [1.0, 1.1, 1.2, 1.3, 1.5],  // 5단계
  speed:    [0, 20, 40, 60, 100],
  durability: [0, 1, 2, 3, 5]            // 추가 충돌 허용
};
```

### UI/UX 플로우

#### 메인 화면
```
┌──────────────────────┐
│   🏎️ DRIFT RACER     │
│                      │
│   Best: 2,340m       │
│   🪙 1,250 coins     │
│                      │
│     [▶ RACE]         │
│   [🚗 Garage]        │
│   [🏆 Ranks]         │
│                      │
└──────────────────────┘
```

#### 게임 화면 (탑다운 뷰)
```
┌──────────────────────┐
│ 1,240m    🪙 85      │
│ ×3 Near Miss!        │
├──────────────────────┤
│                      │
│  ┃        🪙    ┃   │
│  ┃              ┃   │
│  ┃    🏎️💨       ┃   │ ← 드리프트 중!
│  ┃        ~~~    ┃   │    타이어 자국
│  ┃   🪙         ┃   │
│  ┃         ⬛    ┃   │ ← 장애물
│  ┃              ┃   │
│                      │
├──────────────────────┤
│ Speed: 280 km/h      │
│ [HOLD TO DRIFT]      │
└──────────────────────┘
```

#### 드리프트 이펙트
```
드리프트 시 →
1. 타이어 자국 (검은 곡선) 잔상
2. 연기 파티클 (흰색/회색)
3. 스피드라인 (배경 스트리크)
4. 화면 가장자리 블러
5. 니어미스 시 노란 번개 이펙트 ⚡
```

#### 충돌 & 게임오버
```
벽 충돌 →
1. 감속 + 스파크 이펙트
2. 내구력 -1 (0이면 게임오버)
3. 화면 흔들림 (0.2s)
4. 게임오버: 거리/코인/니어미스 통계 표시
5. [🎬 Watch Ad = Revive] [🔄 Retry]
```

### 밸런스 파라미터

| 구간 (m) | 속도 | 커브 빈도 | 트랙 폭 | 장애물 |
|----------|------|-----------|---------|--------|
| 0-200    | 200  | 낮음      | 넓음    | 없음   |
| 200-500  | 250  | 보통      | 보통    | 가끔   |
| 500-1000 | 300  | 높음      | 보통    | 보통   |
| 1000-2000| 350  | 높음      | 좁음    | 많음   |
| 2000+    | 400  | 극한      | 좁음    | 극한   |

| 파라미터 | 값 | 설명 |
|---------|-----|------|
| BASE_SPEED | 200 | 초기 속도 (px/s) |
| MAX_SPEED | 400 | 최대 속도 |
| ACCEL_RATE | 0.5 | 초당 속도 증가 |
| DRIFT_RATE | 2.5 | 드리프트 회전 속도 |
| NEAR_MISS_THRESHOLD | 30px | 니어미스 판정 거리 |
| COIN_VALUE | 10 | 코인 기본 가치 |
| REVIVE_AD | 1회/게임 | 부활 광고 제한 |

### 비주얼 스타일
- **네온 아케이드**: 어두운 배경 + 네온 트랙 라인
- **미니멀 탑다운**: 차량은 단순한 삼각형/사각형
- **속도감**: 배경 별/점 스트리크, 줌 효과
- **밤 드라이브**: 헤드라이트 원추, 주변 어둡게
- **컬러 테마**: 보라/시안 기본, 업그레이드로 변경

---
*생성일: 2026-01-31*
*기반 트렌드: Traffic Rider 6,700만 DL (레이싱 수요 건재), 원터치 하이퍼캐주얼 흥행, 드리프트/레이싱 포트폴리오 부재*
