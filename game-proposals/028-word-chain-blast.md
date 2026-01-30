# 028 — Word Chain Blast 🔤

> Block Blast (#1 퍼즐 다운로드, 3x Candy Crush) + 워드 게임($2B+ 시장) 융합

## 🎯 게임 컨셉
6×6 그리드에서 인접한 글자를 스와이프로 연결하여 단어를 만드는 워드 퍼즐. 단어를 완성하면 해당 타일이 폭발하고 새 타일이 떨어짐. Block Blast의 "채우고 터뜨리는" 중독성 + 워드 게임의 지적 만족감 결합.

## 🕹️ 핵심 메카닉
1. **스와이프 연결:** 인접 타일(8방향)을 손가락으로 연결하여 단어 형성
2. **단어 검증:** 내장 사전(5000+ 영어 단어)으로 실시간 검증
3. **타일 폭발:** 유효 단어 완성 시 타일 폭발 + 새 타일 드롭
4. **보너스 타일:** 5글자+ 단어 → 특수 타일 생성 (💎보석=주변 폭발, ⚡번개=열 클리어, 🔥화염=행 클리어)
5. **콤보 시스템:** 연속 단어 시 점수 배율 증가 (x2, x3...)
6. **목표 시스템:** 레벨별 목표 (점수, 특정 글자 사용, 보너스 타일 생성 등)
7. **일일 챌린지:** 매일 새로운 특수 보드 + 리더보드

## 👥 타겟 유저
- 25-55세 (워드 게임 주요 타겟)
- Wordle, Wordscapes, Word Cookies 유저
- Block Blast, Candy Crush에서 유입 가능
- 영어 학습에 관심 있는 비영어권 유저
- 뇌 훈련/교육적 가치 추구 유저

## 💎 차별점
- **Block Blast + Word:** 최고 인기 퍼즐 메카닉과 워드 게임 융합 (미개척 틈새)
- **시각적 폭발:** 단어 완성 시 화려한 이펙트 (파티클, 화면 흔들림)
- **교육적 가치:** "오늘의 단어" 학습, 어원 표시, 어휘 확장
- **한국어/영어 전환:** 한글 모드 추가 가능 (2-5자 한국어 단어)
- **소셜:** 일일 챌린지 점수 공유, 친구와 배틀

## 💰 수익 모델
- **보상형 광고:** 힌트 (다음 단어 3글자 공개), 추가 시간, 특수 타일
- **IAP:** 힌트 팩 (30개 $1.99), 테마 팩 (배경/타일 스킨), 광고 제거 ($3.99)
- **구독:** 주간 챌린지 + 무제한 힌트 + 독점 테마 ($2.99/월)
- **인앱 배너:** 하단 비침습적 광고
- **예상 eCPM:** $20-30 (워드+퍼즐 프리미엄 장르)

## 🛠️ 기술 스택
- **HTML5 Canvas + JavaScript (Vanilla)**
- CSS3 애니메이션 (UI 트랜지션)
- LocalStorage (진행 저장 + 사전 캐시)
- 내장 영어 사전 (5000단어, ~80KB gzip)
- 모바일 터치 + 데스크탑 마우스 지원

---

## 📐 시스템 설계

### 게임 오브젝트
```javascript
Tile {
  letter: string        // 'A'-'Z'
  row: number           // 그리드 위치 (0-5)
  col: number           // 그리드 위치 (0-5)
  special: null|'gem'|'lightning'|'fire'  // 특수 타일
  selected: boolean     // 현재 선택 중
  falling: boolean      // 낙하 애니메이션 중
}

Level {
  id: number
  gridSize: 6           // 6x6 고정
  target: {
    type: 'score'|'words'|'letters'|'special'
    value: number       // 목표 수치
  }
  moves: number         // 이동 제한 (0=무한)
  timeLimit: number     // 시간 제한 (0=무한)
  letterPool: string[]  // 출현 가능 글자 (난이도 조절)
  difficulty: 'easy'|'medium'|'hard'|'expert'
}

GameState {
  score: number
  wordsFound: string[]
  combo: number
  comboTimer: number
  currentPath: Tile[]
  currentWord: string
  level: number
  movesLeft: number
  hintsLeft: number
  totalWordsFound: number
  longestWord: string
  dailyChallenge: boolean
}
```

### 글자 빈도 (영어)
```javascript
const LETTER_WEIGHTS = {
  E: 12, T: 9, A: 8, O: 7, I: 7, N: 7, S: 6, H: 6,
  R: 6, D: 4, L: 4, C: 3, U: 3, M: 3, W: 2, F: 2,
  G: 2, Y: 2, P: 2, B: 2, V: 1, K: 1, J: 0.5, X: 0.5,
  Q: 0.3, Z: 0.3
};
// 빈도 기반 가중치 랜덤 → 자연스러운 단어 형성 가능
```

### 사전 시스템
```javascript
// Trie 기반 사전 (메모리 효율 + O(k) 조회)
class WordTrie {
  insert(word) { ... }
  isWord(word) { ... }      // 완전한 단어인가?
  isPrefix(prefix) { ... }  // 유효한 접두사인가? (실시간 피드백용)
}

// 최소 3글자, 최대 12글자
// 5000+ 일반 영어 단어 내장
// 비속어/부적절 단어 필터링
```

### 보너스 타일 생성 규칙
```
3-4글자 단어: 기본 점수 (특수 타일 없음)
5글자 단어:   💎 보석 타일 (주변 8칸 폭발)
6글자 단어:   ⚡ 번개 타일 (해당 열 전체 클리어)
7글자+ 단어:  🔥 화염 타일 (해당 행 전체 클리어)
```

### 점수 시스템
```javascript
function calculateScore(word, combo, specialTiles) {
  const basePoints = {
    3: 100, 4: 200, 5: 400, 6: 800, 7: 1500, 8: 3000
  };
  let score = basePoints[Math.min(word.length, 8)] || 3000;
  
  // 희귀 글자 보너스
  const rareLetters = { Q: 10, Z: 10, X: 8, J: 8, K: 5, V: 4 };
  word.split('').forEach(ch => {
    if (rareLetters[ch]) score += rareLetters[ch] * 10;
  });
  
  // 콤보 배율
  score *= (1 + combo * 0.5); // x1, x1.5, x2, x2.5...
  
  return Math.floor(score);
}
```

### 난이도 곡선
| 구간 | 레벨 | 글자 풀 | 목표 | 시간 |
|------|------|---------|------|------|
| 튜토리얼 | 1-5 | 모음 多, 자음 少 | 3단어 | 무한 |
| Easy | 6-20 | 일반 빈도 | 점수 1000+ | 120초 |
| Medium | 21-50 | 일반 + Q,Z | 점수 2500+ 또는 5단어 | 90초 |
| Hard | 51-100 | 전체 + 희귀 多 | 점수 5000+ 또는 특수타일 3개 | 75초 |
| Expert | 101+ | 희귀 가중 | 복합 목표 | 60초 |

---

## 🎨 UI/UX 플로우

### 메인 화면
```
┌──────────────────────┐
│   🔤 WORD CHAIN BLAST │
│                      │
│      [▶ PLAY]        │
│   [📅 Daily] [🏆 Top]│
│                      │
│  ⭐ 234  📖 185 words │
│  Longest: FANTASTIC  │
└──────────────────────┘
```

### 게임 화면
```
┌──────────────────────────────┐
│ Lv.12  ⭐850  🔥x3  💡2     │
│ Goal: 2000 pts  Moves: 15   │
├──────────────────────────────┤
│                              │
│  [S] [T] [A] [R] [E] [D]   │
│  [O] [N] [I] [G] [H] [T]   │
│  [P] [L] [A] [Y]💎[E] [R]  │
│  [W] [O] [R] [D] [S] [A]   │
│  [C] [H] [A] [I] [N] [E]   │
│  [B] [L] [A] [S] [T] [!]   │
│                              │
│  ╔══════════════════════╗    │
│  ║  S → T → A → R       ║   │
│  ║  "STAR" ✓ +200       ║   │
│  ╚══════════════════════╝    │
│                              │
│ Recent: PLAY, NIGHT, WORD   │
└──────────────────────────────┘
```

### 단어 완성 이펙트
```
타일 연결 중: 선택된 타일 하이라이트 + 라인 표시
유효 접두사: 녹색 언더라인 (실시간 피드백)
무효 접두사: 빨간 언더라인
단어 완성: 타일 폭발 + 파티클 + 점수 팝업
콤보 3+: 화면 흔들림 + "COMBO x3!" 배너
보너스 타일: 생성 시 빛 이펙트 + 특수 사운드
```

### 인터랙션 디테일
1. **스와이프 시작:** 타일 탭 → 하이라이트
2. **스와이프 진행:** 인접 타일로 드래그 → 경로 라인 표시 + 현재 단어 미리보기
3. **스와이프 종료:** 손가락 뗌 → 단어 검증
4. **유효 단어:** 타일 폭발 + 점수 + 새 타일 드롭
5. **무효 단어:** 타일 흔들림 + 리셋 (감점 없음)
6. **힌트:** 탭 시 보드에서 가능한 단어 하나 하이라이트

---

## ⚖️ 밸런스 파라미터
```javascript
const BALANCE = {
  // 그리드
  GRID_SIZE: 6,
  MIN_WORD_LENGTH: 3,
  MAX_WORD_LENGTH: 12,
  
  // 점수
  POINTS_3: 100,
  POINTS_4: 200,
  POINTS_5: 400,
  POINTS_6: 800,
  POINTS_7: 1500,
  POINTS_8_PLUS: 3000,
  
  // 콤보
  COMBO_MULTIPLIER: 0.5,    // 콤보당 +50%
  COMBO_TIMEOUT: 8000,       // ms, 콤보 유지 시간
  
  // 특수 타일
  GEM_THRESHOLD: 5,          // 5글자+ → 💎
  LIGHTNING_THRESHOLD: 6,    // 6글자+ → ⚡
  FIRE_THRESHOLD: 7,         // 7글자+ → 🔥
  
  // 힌트
  HINTS_START: 3,            // 시작 힌트 수
  HINT_AD_REWARD: 1,         // 광고 시청 시 힌트 +1
  
  // 타이머
  TIME_EASY: 120,            // 초
  TIME_MEDIUM: 90,
  TIME_HARD: 75,
  TIME_EXPERT: 60,
  
  // 레벨 진행
  STAR_THRESHOLDS: [0.5, 0.75, 1.0], // 목표 대비 ⭐1~3
  
  // 일일 챌린지
  DAILY_GRID_SEED: true,     // 날짜 기반 시드 → 모든 유저 동일 보드
  DAILY_TIME_LIMIT: 180,     // 3분
  DAILY_BONUS_COINS: 50
};
```

---

## 📊 시장 근거
- **Block Blast:** 퍼즐 #1, 3x Candy Crush 다운로드 — "타일 폭발" 메카닉 검증
- **Wordscapes:** 2억+ DL, 워드 퍼즐 스테디셀러
- **Wordle:** 소셜 바이럴의 교과서 — 일일 챌린지 공유 문화
- **워드 게임 시장:** $2B+ (2025), 높은 eCPM ($20-30)
- **퍼즐+워드 융합:** 미개척 틈새 — Block Blast 유저가 워드 게임으로 전환 가능
- **교육적 가치:** 앱스토어 "교육" 카테고리 이중 등록 가능 → 노출 2배

## 구현 우선순위
1. 6x6 그리드 렌더링 + 글자 배치
2. 스와이프 연결 메카닉 (터치 + 마우스)
3. 실시간 단어 검증 (Trie 사전)
4. 타일 폭발 + 새 타일 드롭 애니메이션
5. 점수/콤보 시스템
6. 보너스 타일 (💎⚡🔥)
7. 레벨 시스템 + 목표
8. 힌트 시스템
9. 일일 챌린지
10. 사운드 + 폴리시

---
*Created: 2026-01-30 | Status: ✅ 구현완료 (2026-02-14) | Trend: Block Blast #1 + 워드 게임 $2B, 퍼즐+워드 틈새 융합*

## 구현 노트 (2026-02-14)
- **파일:** `games/word-chain-blast/index.html` (단일 HTML5 파일, ~64KB)
- **사전:** 4,665 영어 단어 내장 (3~8글자), Trie 기반 O(k) 조회
- **모드:** 클래식 (무한) + 러시 (90초)
- **보너스 타일:** 💎(5글자) ⚡(6글자) 🔥(7글자+) — 주변폭발/열클리어/행클리어
- **기능:** 실시간 접두사 검증, 콤보 시스템, 힌트, 파티클 이펙트, 셔플
- **저장:** LocalStorage (최고점수, 발견단어수, 최장단어, 힌트잔량)
- **지원:** 모바일 터치 + 데스크탑 마우스, 다크모드, 한/영 i18n
- **텔레그램:** Mini App SDK 통합
