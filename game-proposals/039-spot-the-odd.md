# 039 - Spot the Odd (이상한 것을 찾아라)

## 게임 컨셉
격자에 비슷한 오브젝트들이 나열된 중 하나만 다른 것을 찾는 관찰력 퍼즐. "My Keyboard is Full of Ants", "Cat Anomaly Horror Game" 등 itch.io 아노말리 감지 트렌드 + 모바일 하이퍼캐주얼 접근성 결합. 프로시저럴 생성으로 무한 콘텐츠.

## 핵심 메카닉
- **관찰 & 탭**: N×N 격자에 이모지/도형이 나열, 하나만 미묘하게 다름 → 탭
- **시간 제한**: 레벨마다 타이머 (처음 10초 → 점차 줄어듦)
- **연속 정답 콤보**: 빠르게 맞출수록 점수 배율 상승 (×2, ×3, ×4)
- **오답 페널티**: 남은 시간 -2초
- **난이도 에스컬레이션**:
  - 격자 크기 증가 (4×4 → 6×6 → 8×8)
  - 차이점이 점점 미묘해짐 (색상 → 방향 → 크기 → 디테일)
  - 더미 함정 등장 (거의 같지만 다른 것이 2개)

## 차별점
1. **기존 포트폴리오 미보유**: 관찰력/아노말리 감지 장르 없음
2. **무한 콘텐츠**: 프로시저럴 생성 (이모지/도형/색상 조합)
3. **극강 접근성**: 탭 한 번, 규칙 설명 불필요
4. **중독성**: 콤보 시스템 + 타이머 긴장감 + "한판만 더"
5. **itch.io 아노말리 트렌드**: 2026년 핫한 장르

## 타겟 유저
- **1차**: 올 에이지 캐주얼 (5초 이해, 즉시 플레이)
- **2차**: 두뇌 훈련 선호층 (관찰력 테스트)
- **3차**: 경쟁적 게이머 (글로벌 리더보드)

## 수익 모델
- **보상 광고**: 추가 시간 (+5초), 추가 라이프 (+1)
- **전면 광고**: 5라운드마다
- **IAP**: 광고 제거 $2.99, 테마 팩 $0.99
- **데일리 챌린지**: 리텐션용 (고정 시드)

## 기술 스택
- Pure HTML5 Canvas (단일 파일)
- Vanilla JavaScript
- LocalStorage (최고 점수, 통계)
- PWA 지원

---

## 상세 설계

### 시스템 설계

#### 오브젝트 생성 시스템
```javascript
const OBJECT_TYPES = {
  emoji: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊'],
  shapes: ['circle','square','triangle','diamond','star','hexagon'],
  colors: ['#FF6B6B','#4ECDC4','#FFE66D','#95E1D3','#F38181','#AA96DA']
};

function generatePuzzle(level) {
  const gridSize = Math.min(4 + Math.floor(level / 10), 8);
  const totalCells = gridSize * gridSize;
  
  // 기본 오브젝트 선택
  const baseObj = pickRandom(OBJECT_TYPES);
  
  // 차이점 생성 (난이도별)
  const oddObj = createVariation(baseObj, getDifficultyLevel(level));
  
  // 이상한 것의 위치
  const oddIndex = Math.floor(Math.random() * totalCells);
  
  return { gridSize, baseObj, oddObj, oddIndex, timeLimit: getTimeLimit(level) };
}
```

#### 차이점 유형 (난이도순)
```javascript
const DIFFICULTY_TYPES = [
  // Easy (Lv 1-10): 명확한 차이
  { type: 'different_emoji', desc: '완전히 다른 이모지' },
  { type: 'different_color', desc: '다른 색상' },
  
  // Medium (Lv 11-30): 미묘한 차이
  { type: 'rotated', desc: '살짝 회전 (15-45°)' },
  { type: 'slightly_bigger', desc: '약간 크거나 작음' },
  { type: 'mirrored', desc: '좌우 반전' },
  
  // Hard (Lv 31-60): 매우 미묘
  { type: 'shade_different', desc: '색조 미세 변경' },
  { type: 'missing_detail', desc: '디테일 하나 빠짐' },
  { type: 'extra_element', desc: '요소 하나 추가' },
  
  // Expert (Lv 61+): 극한
  { type: 'animation_speed', desc: '애니메이션 속도 다름' },
  { type: 'outline_different', desc: '외곽선만 다름' },
  { type: 'decoy', desc: '거의 같은 것 2개 + 진짜 다른 것 1개' }
];
```

#### 점수 시스템
```javascript
{
  baseScore: 100,
  timeBonus: remainingTime * 10,
  comboMultiplier: min(streak, 5),  // 최대 5배
  totalScore: (baseScore + timeBonus) * comboMultiplier
}
```

### UI/UX 플로우

#### 메인 화면
```
┌──────────────────────┐
│   👁️ SPOT THE ODD    │
│                      │
│   Best: 2,450 pts    │
│   Level: 23          │
│                      │
│     [▶ PLAY]         │
│   [📅 Daily]         │
│   [🏆 Ranks]         │
│                      │
└──────────────────────┘
```

#### 게임 화면
```
┌──────────────────────┐
│ ⏱️ 7.2s    🔥×3 Combo │
│ Score: 1,280         │
├──────────────────────┤
│                      │
│  😀 😀 😀 😀 😀      │
│  😀 😀 😀 😃 😀      │ ← 하나만 다름!
│  😀 😀 😀 😀 😀      │
│  😀 😀 😀 😀 😀      │
│  😀 😀 😀 😀 😀      │
│                      │
├──────────────────────┤
│ ❤️❤️❤️  Lives: 3     │
└──────────────────────┘
```

#### 정답 피드백
```
탭 정답 → 
1. 해당 셀 확대 + 반짝 (0.3s)
2. 콤보 텍스트 팝업 "×3!" (0.5s)
3. 점수 카운터 롤업 
4. 다음 퍼즐 슬라이드 인 (0.3s)
```

### 밸런스 파라미터

| 레벨 범위 | 격자 | 시간 | 차이 유형 | 함정 |
|-----------|------|------|-----------|------|
| 1-5       | 4×4  | 10s  | 명확      | 없음 |
| 6-15      | 5×5  | 8s   | 명확~미묘 | 없음 |
| 16-30     | 5×5  | 7s   | 미묘      | 없음 |
| 31-50     | 6×6  | 6s   | 매우 미묘 | 1개  |
| 51-70     | 7×7  | 5s   | 극한      | 1개  |
| 71+       | 8×8  | 4s   | 극한      | 2개  |

| 파라미터 | 값 | 설명 |
|---------|-----|------|
| INITIAL_LIVES | 3 | 초기 라이프 |
| COMBO_MAX | 5 | 최대 콤보 배율 |
| WRONG_PENALTY | -2s | 오답 시간 감소 |
| AD_INTERVAL | 5 | 전면 광고 간격 |

---
*생성일: 2026-01-31*
*기반 트렌드: itch.io 아노말리 감지 게임 인기 (Cat Anomaly, My Keyboard is Full of Ants), 하이퍼캐주얼 관찰력 게임*
