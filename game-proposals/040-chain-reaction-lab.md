# 040 - Chain Reaction Lab (연쇄 반응 실험실)

## 게임 컨셉
과학 실험실 테마의 연쇄 반응 전략 퍼즐. 격자판에 컬러 원자를 배치하면 인접한 같은 색 원자와 합쳐지고, 임계 질량 도달 시 폭발하여 주변으로 확산. 연쇄 반응으로 고득점. "Pixel Flow" 스타일의 만족스러운 비주얼 + "Block Blast"의 단순한 조작 결합.

## 핵심 메카닉
- **원자 배치**: 빈 셀에 탭하여 주어진 색상의 원자 배치
- **합체 규칙**: 인접한 같은 색 원자 자동 합체 → 질량 증가
- **폭발**: 셀의 원자 수 ≥ 인접 셀 수이면 폭발
  - 모서리: 2개에서 폭발
  - 변: 3개에서 폭발
  - 내부: 4개에서 폭발
- **확산**: 폭발 시 원자가 4방향으로 1개씩 날아감
- **연쇄**: 확산된 원자가 다른 셀에 합류 → 또 폭발 가능 → 대규모 연쇄
- **목표**: 모든 적 원자를 내 색으로 전환 (vs AI) 또는 점수 모드

## 차별점
1. **연쇄 반응 장르 미보유**: chain-pop과 전혀 다른 메카닉 (배치 전략 vs 매칭)
2. **수학적 깊이**: 임계 질량 계산 + 연쇄 예측 = 높은 전략성
3. **과학 테마**: 원자, 분자, 실험실 비주얼 (교육적 느낌)
4. **폭발 만족감**: Pixel Flow처럼 화려한 연쇄 이펙트
5. **듀얼 모드**: 퍼즐 (목표 달성) + vs AI (전략 대결)

## 타겟 유저
- **1차**: 전략 퍼즐러 (체스, 바둑 느낌의 심층 사고)
- **2차**: 캐주얼 게이머 (폭발 만족감, 짧은 세션)
- **3차**: 교육 관심층 (과학 테마, 논리적 사고 훈련)

## 수익 모델
- **보상 광고**: 되돌리기, 추가 힌트
- **전면 광고**: 5라운드마다
- **IAP**: 광고 제거 $2.99, 테마 팩 (우주, 해저, 정글) $0.99
- **프리미엄 모드**: vs AI 고급 난이도 $1.99

## 기술 스택
- Pure HTML5 Canvas (단일 파일)
- Vanilla JavaScript
- 파티클 시스템 (폭발 이펙트)
- LocalStorage (진행도, 통계)

---

## 상세 설계

### 시스템 설계

#### 보드 구조
```javascript
const BOARD = {
  size: 6,  // 6×6 기본
  cells: [],  // 2D 배열
  // 각 셀: { atoms: 0, color: null, maxAtoms: 2|3|4 }
};

function getCriticalMass(row, col, size) {
  const isCorner = (row === 0 || row === size-1) && (col === 0 || col === size-1);
  const isEdge = row === 0 || row === size-1 || col === 0 || col === size-1;
  if (isCorner) return 2;
  if (isEdge) return 3;
  return 4;
}
```

#### 폭발 로직
```javascript
function placeAtom(row, col, color) {
  cell = board[row][col];
  cell.atoms++;
  cell.color = color;
  
  if (cell.atoms >= cell.criticalMass) {
    explode(row, col);
  }
}

function explode(row, col) {
  const cell = board[row][col];
  const color = cell.color;
  cell.atoms = 0;
  cell.color = null;
  
  // 4방향으로 확산
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  for (const [dr,dc] of dirs) {
    const nr = row + dr, nc = col + dc;
    if (inBounds(nr, nc)) {
      placeAtom(nr, nc, color);  // 재귀적 연쇄 가능!
    }
  }
}
```

#### 게임 모드

**퍼즐 모드 (스테이지)**
```javascript
{
  goal: 'clear_all',     // 모든 적 원자 제거
  moves: 10,             // 제한 이동 횟수
  presetAtoms: [...],    // 미리 배치된 원자
  starCriteria: {
    3: { moves: 5 },     // 5수 이하
    2: { moves: 8 },
    1: { moves: 10 }
  }
}
```

**vs AI 모드 (턴제)**
```javascript
{
  players: 2,            // 나 vs AI
  turnOrder: 'alternate',
  winCondition: 'eliminate',  // 상대 색 원자 전멸
  aiDifficulty: 'easy|medium|hard',
  aiStrategy: {
    easy: 'random_valid',
    medium: 'greedy_chain',
    hard: 'minimax_depth3'
  }
}
```

### UI/UX 플로우

#### 메인 화면
```
┌──────────────────────┐
│   ⚛️ CHAIN REACTION  │
│       LAB            │
│                      │
│  🧪 Puzzle Mode      │
│  🤖 vs AI            │
│  📅 Daily Challenge   │
│  🏆 Statistics       │
│                      │
│   ⚗️ Lab theme       │
└──────────────────────┘
```

#### 퍼즐 모드 화면
```
┌──────────────────────┐
│ Stage 15  Moves: 7/10│
│ ⭐⭐⭐ ≤5  ⭐⭐ ≤8     │
├──────────────────────┤
│                      │
│  ·  ·  🔴  ·  ·  ·  │
│  ·  🔵² ·  🔴  ·  · │
│  🔴  ·  🔵³ ·  ·  · │
│  ·  ·  ·  🔴² ·  · │
│  ·  🔴  ·  ·  🔵  · │
│  ·  ·  ·  ·  ·  ·  │
│                      │
│ Next: 🔵             │
├──────────────────────┤
│ [↩️ Undo]  [💡 Hint] │
└──────────────────────┘
```
*숫자는 해당 셀의 원자 수. 임계 질량 도달 시 폭발!*

#### 폭발 연출
```
셀 임계 질량 도달 →
1. 셀 팽창 + 진동 (0.2s)
2. 폭발! 원자 4방향 발사 (0.3s) + 파티클
3. 수신 셀 흡수 애니메이션 (0.2s)
4. 연쇄 폭발 반복 (각 0.3s 딜레이)
5. 최종 점수 팝업 (연쇄 수 표시)
```

### 밸런스 파라미터

| 스테이지 | 보드 | 사전 배치 | 이동 제한 | 난이도 |
|----------|------|-----------|-----------|--------|
| 1-10     | 5×5  | 3-5개     | 15        | 쉬움   |
| 11-30    | 6×6  | 5-8개     | 12        | 보통   |
| 31-60    | 6×6  | 8-12개    | 10        | 어려움 |
| 61-100   | 7×7  | 10-15개   | 10        | 하드   |
| 100+     | 8×8  | 15-20개   | 8         | 마스터 |

| 파라미터 | 값 | 설명 |
|---------|-----|------|
| BOARD_SIZE | 5-8 | 스테이지별 증가 |
| CHAIN_DELAY | 300ms | 연쇄 간 딜레이 |
| EXPLOSION_PARTICLES | 8 | 폭발 파티클 수 |
| AI_THINK_TIME | 500ms | AI 턴 대기 시간 |
| MAX_UNDO | 3 | 무료 되돌리기 |

### 연쇄 반응 만족감 극대화
- **카메라 줌**: 대규모 연쇄 시 살짝 줌아웃
- **슬로모션**: 5연쇄 이상 시 자동 슬로모션
- **카운터**: 화면 중앙에 연쇄 카운트 대형 표시 "×3! ×4! ×5!"
- **사운드**: 점점 높아지는 톤 (연쇄마다 반음 상승)
- **화면 진동**: 큰 폭발 시 미세한 화면 흔들림

---
*생성일: 2026-01-31*
*기반 트렌드: Block Blast 303M 다운로드 (격자 배치), Pixel Flow 만족감 (시각 피드백), 전략 퍼즐 니치*
*참고: Chain Reaction은 인도/동남아에서 인기 있는 클래식 턴제 전략 게임 (Ludo King 138M DL 시장과 겹침)*
