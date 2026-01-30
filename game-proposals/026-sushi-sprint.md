# 026 — Sushi Sprint 🍣

> Pizza Ready (154M DL, 글로벌 #4) + My Perfect Hotel 하이브리드캐주얼 인스파이어

## 🎯 게임 컨셉
스시 바 카운터에서 손님 주문을 읽고 정확한 재료를 올려 스시를 만들어 서빙하는 탭 기반 타임 매니지먼트 게임.
간단한 탭 조작 + 시간 압박 + 메타 진행(가게 업그레이드)으로 하이브리드캐주얼 구조.

## 🕹️ 핵심 메카닉
1. **주문 시스템:** 손님이 말풍선으로 주문 표시 (이미지 아이콘)
2. **재료 조합:** 하단 재료 버튼 탭 → 접시에 재료 추가
3. **서빙:** 완성된 스시를 손님에게 슬라이드
4. **시간 제한:** 손님 인내심 게이지 (0이 되면 떠남)
5. **콤보:** 연속 정확 서빙 시 팁 보너스 + 속도 버프
6. **웨이브:** 점심/저녁 러시 시간대로 난이도 상승

## 👥 타겟 유저
- 25-44세 여성 (캐주얼 주요 타겟 61%)
- Pizza Ready, Cooking Fever, My Perfect Hotel 유저
- 2-3분 세션 반복 플레이어
- 음식/요리 관심 유저

## 💎 차별점
- **일본 테마:** 스시 바 고유의 비주얼 (목재, 대나무, 수조)
- **ASMR 사운드:** 밥 쥐는 소리, 생선 써는 소리, "이라샤이마세!"
- **메타 진행:** 팁으로 가게 업그레이드 (의자, 메뉴, 인테리어)
- **콤보 이펙트:** 연속 정확 서빙 시 화려한 이펙트 + 칭찬 대사
- **시즌 이벤트:** 일본 축제 테마 (벚꽃, 마츠리 등)

## 💰 수익 모델
- **리워드 광고:** 시간 연장, 추가 생명, 2배 팁
- **IAP:** 가게 스킨 팩, 프리미엄 레시피 언락
- **구독:** VIP 패스 (광고 제거 + 일일 보너스 + 독점 레시피)
- **일일 챌린지:** 특별 주문 클리어 → 보상

## 🛠️ 기술 스택
- **HTML5 Canvas + JavaScript (Vanilla)**
- CSS3 애니메이션 (UI 트랜지션)
- LocalStorage (진행 저장)
- 모바일 터치 + 데스크탑 클릭 지원

---

## 📐 시스템 설계

### 게임 오브젝트
```
Customer {
  id: number
  order: Ingredient[]    // 주문한 재료 목록
  patience: number       // 100 → 0 (시간 감소)
  patienceSpeed: number  // 감소 속도
  seat: number           // 카운터 좌석 번호 (0-4)
  state: 'waiting'|'served'|'angry'|'happy'
  tipMultiplier: number  // 빠른 서빙 시 팁 보너스
}

Ingredient {
  type: string           // 'rice'|'salmon'|'tuna'|'shrimp'|'egg'|'cucumber'|'avocado'|'nori'
  icon: string           // 이모지 또는 아이콘
  color: string          // 시각 구분용 색상
}

Recipe {
  name: string           // 'Salmon Nigiri', 'Tuna Roll', etc.
  ingredients: string[]  // 필요 재료 타입 배열
  points: number         // 기본 점수
  difficulty: number     // 1-5
}

Plate {
  ingredients: Ingredient[]  // 현재 올려진 재료
  position: number           // 카운터 위치
}

Shop {
  level: number          // 가게 레벨
  seats: number          // 좌석 수 (3→5)
  menuItems: Recipe[]    // 해금된 레시피
  decor: string[]        // 인테리어 아이템
  coins: number          // 보유 코인
}
```

### 게임 루프
1. **손님 입장:** 빈 좌석에 랜덤 손님 등장 (2-5초 간격)
2. **주문 표시:** 말풍선에 레시피 아이콘 표시
3. **재료 선택:** 하단 재료 버튼 탭 → 접시에 추가
4. **완성 판정:** 접시 재료 == 주문 재료 → 서빙 가능
5. **서빙:** 접시를 손님 방향으로 스와이프/탭
6. **정산:** 정확도 + 속도 → 코인 + 팁
7. **인내심:** 매 프레임 감소, 0 = 화난 얼굴 + 떠남 (-1 생명)
8. **웨이브 종료:** 일정 손님 수 서빙 → 다음 웨이브 (속도↑, 레시피↑)

### 레시피 목록
```
RECIPES = [
  // Lv.1 (기본)
  { name: 'Salmon Nigiri',    ingredients: ['rice', 'salmon'],              points: 10, difficulty: 1 },
  { name: 'Tuna Nigiri',      ingredients: ['rice', 'tuna'],                points: 10, difficulty: 1 },
  { name: 'Shrimp Nigiri',    ingredients: ['rice', 'shrimp'],              points: 10, difficulty: 1 },
  
  // Lv.2 (3재료)
  { name: 'Salmon Roll',      ingredients: ['rice', 'salmon', 'nori'],      points: 20, difficulty: 2 },
  { name: 'Cucumber Roll',    ingredients: ['rice', 'cucumber', 'nori'],    points: 20, difficulty: 2 },
  { name: 'Egg Sushi',        ingredients: ['rice', 'egg', 'nori'],         points: 20, difficulty: 2 },
  
  // Lv.3 (4재료)
  { name: 'Dragon Roll',      ingredients: ['rice', 'shrimp', 'avocado', 'nori'],   points: 35, difficulty: 3 },
  { name: 'Rainbow Roll',     ingredients: ['rice', 'salmon', 'tuna', 'nori'],       points: 35, difficulty: 3 },
  { name: 'Spicy Tuna Roll',  ingredients: ['rice', 'tuna', 'cucumber', 'nori'],     points: 35, difficulty: 3 },
  
  // Lv.4 (5재료 - 고급)
  { name: 'Deluxe Platter',   ingredients: ['rice', 'salmon', 'tuna', 'shrimp', 'nori'], points: 50, difficulty: 4 },
  { name: 'Chef Special',     ingredients: ['rice', 'salmon', 'avocado', 'cucumber', 'nori'], points: 50, difficulty: 4 }
]
```

### 난이도 곡선
| 웨이브 | 좌석 수 | 레시피 난이도 | 인내심 속도 | 손님 간격 |
|--------|---------|-------------|-----------|----------|
| 1-3    | 3       | 1-2         | 느림      | 4초      |
| 4-6    | 4       | 1-3         | 보통      | 3초      |
| 7-9    | 4       | 2-3         | 빠름      | 2.5초    |
| 10-12  | 5       | 2-4         | 빠름      | 2초      |
| 13+    | 5       | 3-4         | 매우 빠름 | 1.5초    |

---

## 🎨 UI/UX 플로우

### 메인 화면
```
┌──────────────────────────┐
│      🍣 SUSHI SPRINT     │
│                          │
│    🏮  [▶ PLAY]  🏮      │
│    [🏪 SHOP]  [🏆 RANK]  │
│                          │
│  💰 1,250  ❤️ 3          │
│  🌊 Wave: 7  Best: 12    │
└──────────────────────────┘
```

### 게임 화면
```
┌──────────────────────────────────┐
│ 💰 850  ❤️ 3  🌊 Wave 3  x2 🔥 │
├──────────────────────────────────┤
│                                  │
│  😊💬[🍚🐟]  😄💬[🍚🦐🥒🍙]   │
│  ████████░░  █████░░░░░         │
│                                  │
│  😐💬[🍚🐟🍙]                   │
│  ████░░░░░░                      │
│                                  │
│  ┌─────────────────────────┐     │
│  │  🍣 [접시: 🍚 🐟]       │     │
│  │  [✓ 서빙] [✗ 리셋]      │     │
│  └─────────────────────────┘     │
│                                  │
│ [🍚] [🐟] [🐟] [🦐] [🥚]       │
│ [🥒] [🥑] [🍙]                  │
├──────────────────────────────────┤
│          [Banner Ad]             │
└──────────────────────────────────┘
```

### 인터랙션 플로우
1. **재료 탭** → 접시에 추가 (애니메이션: 재료가 접시로 날아감)
2. **서빙 버튼** → 주문과 비교 → 맞으면 성공 (코인 + 이펙트)
3. **리셋 버튼** → 접시 비우기 (실수 시)
4. **손님 탭** → 주문 상세 확인 (큰 말풍선)
5. **가게 업그레이드** → 코인 소비 → 좌석/메뉴/인테리어 추가

### 피드백 시스템
- **정확 서빙:** "すごい!" + 코인 분수 이펙트 + 손님 하트
- **콤보 3+:** "COMBO x3!" + 화면 흔들림 + 금색 이펙트
- **시간 초과:** 손님 화남 얼굴 + "..." + 하트 -1
- **틀린 주문:** 접시 흔들림 + ❌ 표시 (감점 없이 리셋)

---

## ⚖️ 밸런스 파라미터
```javascript
const BALANCE = {
  // 시간
  CUSTOMER_SPAWN_INTERVAL: 4000,  // ms
  CUSTOMER_SPAWN_MIN: 1500,       // ms (최소)
  PATIENCE_BASE: 100,             // 기본 인내심
  PATIENCE_DECAY_SLOW: 0.15,     // /frame (느림)
  PATIENCE_DECAY_NORMAL: 0.25,   // /frame (보통)
  PATIENCE_DECAY_FAST: 0.4,      // /frame (빠름)
  
  // 점수/보상
  BASE_TIP: 10,                   // 기본 코인
  SPEED_BONUS_THRESHOLD: 70,      // 인내심 70% 이상 시 스피드 보너스
  SPEED_BONUS_MULTIPLIER: 1.5,    // 스피드 보너스 배율
  COMBO_BONUS: 0.5,               // 콤보당 추가 배율 (+50%)
  COMBO_TIMEOUT: 5000,            // ms, 콤보 유지 시간
  
  // 생명
  LIVES_MAX: 3,                   // 최대 생명
  LIVES_RECOVER_COST: 100,        // 코인으로 생명 회복
  
  // 가게 업그레이드
  SEAT_UPGRADE_COST: [0, 0, 0, 500, 1000],  // 3→4→5 좌석
  MENU_UNLOCK_COST: [0, 200, 500, 1000],     // 난이도 레벨 해금
  DECOR_COSTS: { 'lantern': 300, 'bamboo': 500, 'aquarium': 1000, 'gold_counter': 2000 },
  
  // 웨이브
  WAVE_CUSTOMER_COUNT: 8,         // 웨이브당 손님 수
  WAVE_SPEED_INCREASE: 0.1,       // 웨이브당 속도 증가
  
  // 색상
  INGREDIENT_COLORS: {
    rice: '#FFFFFF',
    salmon: '#FA8072',
    tuna: '#DC143C',
    shrimp: '#FFA07A',
    egg: '#FFD700',
    cucumber: '#32CD32',
    avocado: '#9ACD32',
    nori: '#2F4F2F'
  }
};
```

---

## 📊 시장 근거
- **Pizza Ready:** 154M DL (글로벌 #4) — 동일 장르 검증됨
- **My Perfect Hotel:** 하이브리드캐주얼 성공 사례 (SayGames)
- **Good Pizza, Great Pizza:** 장기 롱런 음식 게임
- **타겟 시장:** 캐주얼 $24.2B, 여성 61%, 시뮬레이션 CPI $0.59 (최저)
- **차별화:** 일본 테마 → 전 세계적으로 인기 있는 스시 문화 활용

## 구현 우선순위
1. 기본 카운터 레이아웃 + 재료 버튼
2. 손님 등장 + 주문 표시 + 인내심 게이지
3. 재료 선택 → 접시 → 서빙 로직
4. 점수/콤보/생명 시스템
5. 웨이브 진행 + 난이도 스케일링
6. 가게 업그레이드 시스템
7. 사운드 + 이펙트 + 폴리시

---
*Created: 2026-01-30 | Status: 미구현 | Trend: Pizza Ready #4, 하이브리드캐주얼, 시뮬레이션 장르*
