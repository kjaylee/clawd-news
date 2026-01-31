---
title: "게임 레벨 밸런싱 자동화 — 심층 조사 보고서"
date: 2026-01-31
categories: [docs, research]
tags: [게임, 밸런싱, 자동화]
layout: post
---

# 🎮 게임 레벨 밸런싱 자동화 — 심층 조사 보고서

> 작성일: 2026-01-31
> 대상: East Sea Games HTML5 게임 포트폴리오 (56개 게임)
> 목적: 플레이 테스트 없이 수학적으로 합리적인 밸런스를 도출하고, 자동화 스크립트로 전 게임에 일괄 적용

---

## 목차
1. [기존 도구/서비스 분석](#1-기존-도구서비스-분석)
2. [AI/ML 기반 자동 밸런싱](#2-aiml-기반-자동-밸런싱)
3. [Dynamic Difficulty Adjustment (DDA)](#3-dynamic-difficulty-adjustment-dda)
4. [수학적 밸런싱 프레임워크](#4-수학적-밸런싱-프레임워크)
5. [실제 적용 가능한 방법](#5-실제-적용-가능한-방법)
6. [최종 추천](#6-최종-추천)

---

## 1. 기존 도구/서비스 분석

### 1.1 Machinations.io
- **유형:** 브라우저 기반 게임 이코노미 시뮬레이션 플랫폼
- **기능:**
  - 노드 기반 다이어그램으로 게임 시스템 시각화
  - AI-Balancer: Influencer 변수 자동 최적화
  - 몬테카를로 시뮬레이션 (수천 회 자동 실행)
  - 싱크/소스 밸런스 시각화
- **사례:** Funday Factory의 Bullet League — 8시간에 전체 메타 이코노미 모델링, 33일치 게임플레이 수초 내 시뮬레이션
- **비용:** 무료 플랜(제한적) / Pro $20+/월
- **적합도:** ⭐⭐⭐ (중)
  - 장점: 복잡한 이코노미 시뮬레이션에 강력
  - 단점: 게임별로 다이어그램을 수동 구축해야 함, 56개 게임에 일괄 적용 불가
  - 적합 시나리오: idle-slime-merge, fishing-tycoon 같은 이코노미 게임 개별 밸런싱

### 1.2 GameAnalytics
- **유형:** 무료 게임 애널리틱스 플랫폼
- **기능:**
  - 실시간 플레이어 행동 추적
  - 레벨별 이탈률, 클리어율 분석
  - A/B 테스팅
- **비용:** 무료 (월 100K DAU까지)
- **적합도:** ⭐⭐ (낮음)
  - 사후 분석 도구 — 실제 플레이어 데이터가 필요
  - 사전 밸런싱(우리 목적)에는 부적합
  - 출시 후 밸런스 모니터링에 활용 가치 있음

### 1.3 deltaDNA (현 Unity Analytics)
- **유형:** Unity 통합 라이브옵스/분석 플랫폼
- **기능:** 실시간 파라미터 조정, 이벤트 분석, 세그먼테이션
- **적합도:** ⭐ (부적합)
  - Unity 전용, HTML5 단일 파일 게임에 통합 어려움

### 1.4 Unity ML-Agents
- **유형:** Unity용 강화학습 에이전트 훈련 프레임워크
- **기능:**
  - 딥 강화학습 + 모방학습으로 에이전트 훈련
  - 게임 빌드 자동 테스팅
  - 게임 디자인 의사결정 평가
- **주요 용도:** NPC 행동 학습, 자동화된 게임 빌드 테스트, 밸런스 검증
- **적합도:** ⭐ (부적합)
  - Unity 전용, Python + C# 환경 필요
  - HTML5 게임에는 직접 적용 불가

### 1.5 OpenAI Gym (Gymnasium)
- **유형:** 강화학습 환경 표준 인터페이스 (Python)
- **기능:** 다양한 RL 알고리즘 벤치마킹, 커스텀 환경 구축
- **적합도:** ⭐⭐ (조건부)
  - 게임을 Python 환경으로 래핑해야 함
  - 직접 적용은 어렵지만, 컨셉 차용 가능 (피드백 루프 설계)

### 1.6 Google DeepMind OpenSpiel
- **유형:** 게임 이론 연구용 오픈소스 환경/알고리즘 모음
- **기능:** n-player 게임 환경, RL/탐색/계획 알고리즘 다수
- **적합도:** ⭐ (부적합)
  - 학술 연구 목적, 실제 게임 밸런싱보다는 이론 연구
  - 우리 상황(HTML5 캐주얼 게임)과 거리 있음

### 1.7 인디 개발자용 무료/오픈소스 도구
| 도구 | 설명 | 적합도 |
|------|------|--------|
| **스프레드시트 (Google Sheets)** | 수식으로 밸런스 테이블 관리 | ⭐⭐⭐⭐ |
| **Desmos/GeoGebra** | 난이도 커브 시각화 | ⭐⭐⭐ |
| **Python + NumPy/SciPy** | 시뮬레이션 스크립트 | ⭐⭐⭐⭐ |
| **Node.js 스크립트** | 게임 파라미터 일괄 조정 | ⭐⭐⭐⭐⭐ |

---

## 2. AI/ML 기반 자동 밸런싱

### 2.1 강화학습(RL) 기반 자동 플레이테스팅
- **원리:** AI 에이전트가 게임을 수천~수만 회 플레이하면서 최적 전략 학습
- **알고리즘:**
  - **PPO (Proximal Policy Optimization):** 안정적 학습, Unity ML-Agents 기본
  - **SAC (Soft Actor-Critic):** match-3 게임에서 PPO보다 우수 (연구 결과)
  - **DQN (Deep Q-Network):** 이산 액션 공간에 적합
- **match-3 연구 결과 (2023):**
  - SAC가 PPO보다 더 효율적인 난이도 밸런싱 테스트 에이전트 생성
  - 누적 보상, 엔트로피 비교 분석에서 SAC 우위
- **적합도:** ⭐⭐ (낮음)
  - Python RL 환경 구축 필요 (게임별)
  - 학습 시간 수 시간~수일
  - 56개 게임 각각에 별도 환경 필요 → 비현실적
  - 하나의 핵심 게임(예: match-3, RPG)에만 투자할 가치

### 2.2 몬테카를로 시뮬레이션
- **원리:** 랜덤 변수로 수천 회 게임 시뮬레이션 → 통계적 밸런스 검증
- **용도:**
  - 레벨 클리어율 추정 (목표: 60~80%)
  - 다양한 플레이어 스킬 레벨에서의 결과 분포
  - 이코노미 밸런스 검증 (인플레이션 예측)
- **Machinations.io 접근:** Law of Large Numbers 기반 — 실제 플레이어 분산을 반영
- **구현:**
  ```javascript
  // 간단한 몬테카를로 시뮬레이션 예시
  function simulateLevel(params, playerSkill, runs = 10000) {
    let wins = 0;
    for (let i = 0; i < runs; i++) {
      if (simulateSingleRun(params, playerSkill)) wins++;
    }
    return wins / runs; // 클리어율
  }
  ```
- **적합도:** ⭐⭐⭐⭐ (높음)
  - JavaScript로 구현 가능
  - 게임 로직을 추상화한 시뮬레이터만 있으면 됨
  - 자동화 스크립트에 통합 용이

### 2.3 유전 알고리즘(GA)으로 파라미터 최적화
- **원리:**
  1. 밸런스 파라미터 세트를 "유전자"로 인코딩
  2. 각 세트의 "적합도(fitness)" 평가 (예: 클리어율이 70%에 가까운 정도)
  3. 높은 적합도 세트끼리 교차/돌연변이
  4. 수세대 반복하여 최적 파라미터 탐색
- **학술 연구:**
  - Jaffe et al. (2012): GA로 게임 파라미터 최적화, 몬테카를로로 fitness 평가
  - Fitness 예측기(신경망) 사용으로 평가 속도 향상 가능
- **구현 가능성:**
  ```javascript
  // 유전 알고리즘 의사코드
  let population = generateRandom(100); // 100개 파라미터 세트
  for (let gen = 0; gen < 50; gen++) {
    let fitness = population.map(p => evaluateFitness(p));
    population = select(population, fitness);
    population = crossover(population);
    population = mutate(population);
  }
  return getBest(population);
  ```
- **적합도:** ⭐⭐⭐ (중)
  - 게임별 적합도 함수 정의 필요
  - 자동화하려면 각 게임의 "클리어 시뮬레이터" 필요
  - 시뮬레이터 없이는 수학적 적합도 함수로 대체 가능

### 2.4 GPT/LLM 기반 밸런싱
- **접근법:**
  1. **밸런스 테이블 생성:** 게임 장르/규칙 설명 → LLM이 레벨별 파라미터 생성
  2. **밸런스 검증:** 기존 파라미터를 LLM에 입력 → 불균형 지점 분석
  3. **코드 생성:** 밸런싱 공식을 직접 코드로 변환
- **실제 프롬프트 예시:**
  ```
  당신은 게임 밸런스 전문가입니다. 아래 match-3 퍼즐 게임의 레벨 파라미터를 생성하세요:
  - 총 50레벨
  - 레벨 1은 쉽게 (4색, 30수, 목표 30개)
  - 레벨 50은 매우 어렵게 (7색, 15수, 목표 100개)
  - 난이도 곡선: S-커브 (초반 완만, 중반 급상승, 후반 안정)
  - 출력: JSON 배열
  ```
- **적합도:** ⭐⭐⭐⭐⭐ (매우 높음)
  - 즉시 적용 가능
  - 게임 장르별 맞춤 프롬프트 템플릿 작성 → 일괄 생성
  - 수학적 일관성 검증은 별도 스크립트로 보완
  - **우리 상황에 가장 실용적**

---

## 3. Dynamic Difficulty Adjustment (DDA)

### 3.1 개요
- **정의:** 플레이어 능력에 따라 실시간으로 게임 파라미터를 자동 조정
- **조정 가능 요소:**
  - 적 속도/체력/빈도
  - 파워업 출현 빈도
  - 플레이어 능력치
  - 시간 제한
  - 레벨 복잡도

### 3.2 주요 DDA 시스템 유형

#### 3.2.1 Hamlet (Hunicke & Chapman)
- 게임 환경 설정을 조작하여 난이도 조절
- 너무 어려우면: 무기 증가, 체력 회복 빠르게, 적 감소
- 너무 쉬우면: 반대
- **주의:** 고무줄 효과(rubber banding) — 플레이어가 인위적 조작을 느끼지 않도록

#### 3.2.2 Andrade et al. RL 기반 DDA
- **Competence 차원:** 최대한 잘 학습
- **Performance 차원:** 필요한 만큼만 잘 수행
- 오프라인 학습 + 온라인 적응

#### 3.2.3 Dynamic Scripting (Spronck et al.)
- 행동 규칙에 확률 가중치 부여
- 게임 진행 중 가중치 동적 업데이트
- 플레이어 수준에 맞는 전략 자동 선택

#### 3.2.4 유전 알고리즘 기반 DDA (Demasi & Cruz)
- AI 에이전트 집단을 진화시켜 플레이어 수준에 맞춤

### 3.3 JavaScript DDA 구현 패턴

```javascript
class DifficultyManager {
  constructor() {
    this.difficulty = 0.5; // 0(쉬움) ~ 1(어려움)
    this.performanceWindow = []; // 최근 성과 기록
    this.windowSize = 5; // 최근 5 라운드 기준
  }

  // 플레이어 성과 기록 (0~1, 높을수록 잘함)
  recordPerformance(score) {
    this.performanceWindow.push(score);
    if (this.performanceWindow.length > this.windowSize) {
      this.performanceWindow.shift();
    }
    this.adjustDifficulty();
  }

  adjustDifficulty() {
    const avg = this.performanceWindow.reduce((a, b) => a + b, 0)
      / this.performanceWindow.length;

    // 목표 성과: 0.6~0.75 (60~75% 성공률)
    const targetLow = 0.6;
    const targetHigh = 0.75;

    if (avg > targetHigh) {
      // 너무 쉬움 → 난이도 증가
      this.difficulty = Math.min(1, this.difficulty + 0.05);
    } else if (avg < targetLow) {
      // 너무 어려움 → 난이도 감소
      this.difficulty = Math.max(0, this.difficulty - 0.05);
    }
    // 목표 범위 내 → 유지
  }

  // 난이도를 게임 파라미터로 변환
  getParams() {
    const d = this.difficulty;
    return {
      enemySpeed: lerp(1.0, 3.0, d),
      enemyHP: lerp(1, 5, d),
      spawnRate: lerp(2000, 500, d), // ms
      powerUpFreq: lerp(0.3, 0.05, d),
      timeLimit: lerp(60, 30, d),
    };
  }
}

function lerp(a, b, t) { return a + (b - a) * t; }
```

### 3.4 HTML5 게임 적용 시 고려사항
- **단일 파일 구조:** DDA 로직을 각 게임에 삽입해야 함
- **저장:** localStorage로 플레이어 성과 누적
- **안티-치트:** 일부러 지는 것 방지 (난이도 하락에 하한선)
- **투명성:** 플레이어에게 DDA 존재 알릴지 여부

### 3.5 적합도 평가
- **런타임 DDA:** ⭐⭐⭐⭐ (높음)
  - JavaScript로 즉시 구현 가능
  - 모든 HTML5 게임에 공통 모듈로 삽입 가능
  - 하지만: 초기 밸런스가 먼저 잡혀야 DDA가 의미 있음
- **오프라인 DDA (사전 밸런싱):** 해당 없음 — DDA는 런타임 기술

---

## 4. 수학적 밸런싱 프레임워크

### 4.1 난이도 커브 공식

#### 4.1.1 선형 (Linear)
```
difficulty(level) = base + rate × level
```
- **특성:** 일정한 증가, 예측 가능
- **적합 장르:** 아케이드, 단순 퍼즐
- **단점:** 후반부 지루, 변화 부족

#### 4.1.2 지수 (Exponential)
```
difficulty(level) = base × multiplier^level
```
- **특성:** 후반부 급격한 상승
- **적합 장르:** RPG 스탯 성장, 이코노미 게임
- **XP 커브 공식:** `XP(L) = a × (1 - b^L) / (1 - b)` (기하급수)
- **파라미터:**
  - `a`: 기본 XP (레벨 1→2 필요량)
  - `b`: 배수 (1.5~2.0이 일반적)

#### 4.1.3 로그 (Logarithmic)
```
difficulty(level) = base × log(level + 1)
```
- **특성:** 초반 급상승, 후반 안정 (수확 체감)
- **적합 장르:** 수집 게임, 캐주얼
- **레벨-XP 관계:** XP→레벨이 로그면, 레벨→XP는 지수

#### 4.1.4 S-커브 (Sigmoid / Logistic)
```
difficulty(level) = max_diff / (1 + e^(-k × (level - midpoint)))
```
- **특성:** 초반 완만 → 중반 급상승 → 후반 안정
- **적합 장르:** 대부분의 캐주얼 게임 (★ 가장 추천)
- **파라미터:**
  - `max_diff`: 최대 난이도
  - `k`: 전이 속도 (클수록 급변)
  - `midpoint`: 급변점 (전체 레벨의 40~60%)

#### 4.1.5 피보나치 기반
```
difficulty(level) = fib(level) / fib(maxLevel) × maxDiff
```
- **특성:** 황금비에 수렴하는 자연스러운 증가
- **적합 장르:** 퍼즐, 교육용

#### 4.1.6 웨이브 (Wave)
```
difficulty(level) = base_curve(level) + amplitude × sin(freq × level)
```
- **특성:** 기본 커브 위에 오르내림 (쉬어가는 레벨)
- **적합 장르:** 모든 장르 (쉬어가기 효과)
- **핵심:** 피로 방지, 도전-휴식 리듬

### 4.2 RPG 스탯 스케일링 공식

#### 4.2.1 HP 스케일링
```
HP(level) = baseHP × (1 + growthRate)^level
```
- 일반적 범위: 레벨 1에서 100, 레벨 100에서 8,000~20,000
- 지수 성장이 표준 (각 레벨에서 HP 증가가 체감되지 않도록)

#### 4.2.2 데미지 스케일링
```
damage(level) = A × level^B + C
```
- A, B, C를 원하는 시작/끝 값으로 역산
  - 예: 레벨 1에서 10, 레벨 100에서 1000 → 2점 방정식

#### 4.2.3 밸런스 원칙: TTK (Time To Kill)
```
TTK = targetHP / playerDPS
```
- TTK가 레벨에 따라 일정하면 밸런스 유지
- 추천: TTK = 3~8초 (액션), 1~3턴 (턴제)

#### 4.2.4 파워 더블링 간격
- D&D 4E: 4레벨마다 파워 2배
- PF2E: 2레벨마다 파워 2배
- **권장:** 5~10레벨마다 2배 (캐주얼 게임)

### 4.3 경제 시뮬레이션

#### 4.3.1 싱크/소스 모델
- **소스 (Source):** 자원 유입 (적 처치, 퀘스트, 시간 보상)
- **싱크 (Sink):** 자원 유출 (구매, 업그레이드, 수리, 세금)
- **밸런스 공식:**
  ```
  소스_총량 ≈ 싱크_총량 × 인플레이션_계수
  ```
  - 인플레이션 계수 = 1.0~1.1 (약간의 잉여 허용)

#### 4.3.2 인플레이션 관리
- **원칙:** 각 자원에 최소 2개 이상의 싱크 존재
- **사전 검증:** 예상 플레이 시간 × 평균 획득량 vs 레벨업/구매 비용 합계
- **공식 도구:** 스프레드시트로 시간 경과에 따른 자원 축적량 그래프화

#### 4.3.3 우리 게임 적용
- idle-slime-merge, fishing-tycoon, micro-factory 등 이코노미 게임에 직접 적용
- 자동화: 각 게임의 reward/cost 테이블을 JSON으로 추출 → 스프레드시트/스크립트 검증

### 4.4 Match-3 게임 특화 밸런싱

연구 결과 (MDPI Electronics, 2023):
- **핵심 파라미터:**
  - 보드 크기 (rows × cols)
  - 색상 수 (3~7)
  - 이동 횟수 (moves)
  - 미션 목표 (타겟 수, 타입)
  - 특수 블록 비율
- **난이도 공식 (경험적):**
  ```
  difficulty ≈ (colors × target) / (moves × boardSize × specialRate)
  ```
- **목표 클리어율:** 60~80% (1차 시도)
- **SAC 알고리즘이 PPO보다 효율적 밸런싱 에이전트 생성**
- **우리 gem-cascade, crystal-match, chain-pop 등에 적용 가능**

---

## 5. 실제 적용 가능한 방법

### 5.1 우리 상황 분석
- **56개 HTML5 단일 파일 게임**
- **다양한 장르:** 퍼즐, 아케이드, RPG, 이코노미, 액션
- **요구사항:**
  1. 플레이 테스트 없이 수학적 밸런스 도출
  2. 자동화 스크립트로 전 게임 일괄 적용
  3. 합리적인 난이도 곡선

### 5.2 장르별 밸런싱 전략

| 장르 | 게임 예시 | 핵심 파라미터 | 추천 커브 | 밸런싱 방법 |
|------|-----------|--------------|-----------|------------|
| Match-3/퍼즐 | gem-cascade, crystal-match, chain-pop, slide-block-match | 색상수, 이동수, 보드크기, 목표 | S-커브 | 공식 기반 |
| 아케이드 | neon-snake, brick-breaker, stack-tower, ball-sort | 속도, 적수, 시간 | 로그+웨이브 | 공식 기반 |
| RPG/던전 | card-dungeon, dungeon-run, puzzle-rogue | HP, ATK, DEF, 적레벨 | 지수 | 스탯 스케일링 |
| 이코노미/방치 | idle-slime-merge, fishing-tycoon, micro-factory, merge-bloom | 수입, 비용, 업그레이드 | 지수/로그 | 싱크소스 모델 |
| 물리/캐주얼 | gravity-orbit, jump-physics, single-tap-golf | 물리 파라미터, 목표 난이도 | S-커브 | 수치 조정 |
| 서바이벌 | slime-survivor-premium, zombie-survivor | 적 스폰율, 파워업 | 지수+웨이브 | DDA 삽입 |
| 타이밍/리듬 | rhythm-pulse, tap-away | BPM, 노트밀도 | 선형+웨이브 | BPM 테이블 |

### 5.3 자동화 파이프라인 설계

```
┌─────────────────────────────────────────┐
│         Balance Automation Pipeline      │
├─────────────────────────────────────────┤
│                                         │
│  1. 게임 분류 (장르 태깅)               │
│     ↓                                   │
│  2. 파라미터 추출 (AST 파싱 or 정규식)  │
│     ↓                                   │
│  3. 밸런스 테이블 생성                  │
│     - S-커브/지수/로그 공식 적용        │
│     - LLM으로 장르별 최적 파라미터 생성 │
│     ↓                                   │
│  4. 파라미터 주입 (AST 변환 or 정규식)  │
│     ↓                                   │
│  5. 검증 스크립트                       │
│     - 파라미터 범위 체크                │
│     - 난이도 커브 시각화                │
│     - 몬테카를로 시뮬레이션 (선택)      │
│     ↓                                   │
│  6. 일괄 적용 + git commit              │
│                                         │
└─────────────────────────────────────────┘
```

### 5.4 구체적 구현 계획

#### Phase 1: 공통 밸런싱 모듈 (즉시 적용 가능)

```javascript
// balance-utils.js — 공통 밸런싱 유틸리티

/**
 * S-커브 난이도 함수
 * @param {number} level - 현재 레벨 (1-based)
 * @param {number} maxLevel - 최대 레벨
 * @param {number} minVal - 최소 난이도 값
 * @param {number} maxVal - 최대 난이도 값
 * @param {number} steepness - 전이 급경사도 (기본 0.15)
 * @param {number} midpoint - 급변점 비율 (기본 0.5)
 */
function sCurve(level, maxLevel, minVal, maxVal, steepness = 0.15, midpoint = 0.5) {
  const x = (level / maxLevel - midpoint) * maxLevel * steepness;
  const sigmoid = 1 / (1 + Math.exp(-x));
  return minVal + (maxVal - minVal) * sigmoid;
}

/**
 * 지수 난이도 함수
 */
function exponential(level, base, multiplier) {
  return base * Math.pow(multiplier, level - 1);
}

/**
 * 로그 난이도 함수
 */
function logarithmic(level, base, scale) {
  return base + scale * Math.log(level);
}

/**
 * 웨이브 변조 (쉬어가는 레벨 효과)
 */
function waveModulate(value, level, amplitude = 0.1, frequency = 0.5) {
  const wave = Math.sin(level * frequency * Math.PI) * amplitude;
  return value * (1 + wave);
}

/**
 * 퍼즐 게임 난이도 파라미터 생성
 */
function generatePuzzleLevels(maxLevel, config) {
  const levels = [];
  for (let i = 1; i <= maxLevel; i++) {
    const diff = sCurve(i, maxLevel, 0, 1);
    levels.push({
      level: i,
      colors: Math.round(lerp(config.minColors, config.maxColors, diff)),
      moves: Math.round(lerp(config.maxMoves, config.minMoves, diff)),
      target: Math.round(lerp(config.minTarget, config.maxTarget, diff)),
      timeLimit: config.hasTime ?
        Math.round(lerp(config.maxTime, config.minTime, diff)) : null,
    });
  }
  return levels;
}
```

#### Phase 2: 게임별 밸런싱 스크립트

```javascript
// scripts/balance-all-games.js
const fs = require('fs');
const path = require('path');

const GAMES_DIR = path.join(__dirname, '../games');

// 장르별 기본 밸런스 프로파일
const PROFILES = {
  puzzle: {
    curve: 'sigmoid',
    maxLevel: 50,
    params: {
      minColors: 3, maxColors: 7,
      maxMoves: 30, minMoves: 10,
      minTarget: 20, maxTarget: 120,
    }
  },
  arcade: {
    curve: 'log_wave',
    speedRange: [1, 5],
    spawnRange: [2000, 300],
  },
  rpg: {
    curve: 'exponential',
    hpBase: 100, hpMultiplier: 1.12,
    atkBase: 10, atkMultiplier: 1.1,
    defBase: 5, defMultiplier: 1.08,
  },
  economy: {
    curve: 'exponential',
    incomeBase: 10, incomeMultiplier: 1.15,
    costBase: 50, costMultiplier: 1.2,
  }
};

// 게임→장르 매핑 (수동 태깅 필요)
const GAME_GENRES = {
  'gem-cascade': 'puzzle',
  'crystal-match': 'puzzle',
  'chain-pop': 'puzzle',
  'neon-snake': 'arcade',
  'brick-breaker': 'arcade',
  'card-dungeon': 'rpg',
  'idle-slime-merge': 'economy',
  // ... 56개 모두 태깅
};
```

#### Phase 3: DDA 공통 모듈 삽입

```javascript
// 각 게임에 삽입할 DDA 스니펫
const DDA_SNIPPET = `
// === Dynamic Difficulty Adjustment ===
const DDA = {
  diff: 0.5,
  history: [],
  maxHistory: 5,
  targetWinRate: [0.55, 0.75],

  record(won) {
    this.history.push(won ? 1 : 0);
    if (this.history.length > this.maxHistory) this.history.shift();
    this.adjust();
  },

  adjust() {
    if (this.history.length < 3) return;
    const winRate = this.history.reduce((a,b) => a+b, 0) / this.history.length;
    if (winRate > this.targetWinRate[1]) {
      this.diff = Math.min(1, this.diff + 0.05);
    } else if (winRate < this.targetWinRate[0]) {
      this.diff = Math.max(0.1, this.diff - 0.05); // 하한 0.1 (안티치트)
    }
    try { localStorage.setItem('dda_' + GAME_ID, JSON.stringify({d: this.diff, h: this.history})); } catch(e) {}
  },

  load(gameId) {
    try {
      const data = JSON.parse(localStorage.getItem('dda_' + gameId));
      if (data) { this.diff = data.d; this.history = data.h || []; }
    } catch(e) {}
  },

  // 난이도 계수 반환 (0.1 ~ 1.0)
  get factor() { return this.diff; }
};
`;
```

### 5.5 LLM 활용 프롬프트 템플릿

```markdown
## 밸런싱 프롬프트 템플릿

### Match-3 퍼즐 게임
"""
{게임명}은 match-3 퍼즐 게임입니다.
현재 파라미터: {현재 파라미터 JSON}
50개 레벨의 밸런스 테이블을 생성하세요.

제약:
- 레벨 1~5: 튜토리얼 (3색, 30수, 목표 15~30)
- 레벨 6~20: 중반 (4~5색, 20~25수)
- 레벨 21~40: 후반 (5~6색, 15~20수)
- 레벨 41~50: 엔드게임 (6~7색, 12~15수)
- 난이도 S-커브: 중간에 급격한 상승
- 5의 배수 레벨: "보스 레벨" (특수 목표, 더 어려움)
- 10의 배수 레벨: "쉬어가기 레벨" (보상 위주)

출력: JSON 배열, 각 원소 = {level, colors, moves, target, special}
"""

### 아케이드 게임
"""
{게임명}은 무한 진행형 아케이드 게임입니다.
현재 파라미터: {현재 파라미터}
난이도 자동 조절을 위한 파라미터 테이블을 생성하세요.

제약:
- 처음 30초: 튜토리얼 (느린 속도, 적은 장애물)
- 1~2분: 중반 (중간 속도, 보통 장애물)
- 3분+: 후반 (빠른 속도, 많은 장애물)
- 속도는 로그 함수로 수렴 (최대 5.0)
- 5초마다 난이도 스텝 업

출력: JSON 타임테이블
"""
```

---

## 6. 최종 추천

### 🏆 즉시 적용 가능한 방안 (우선순위)

#### 1순위: 수학적 공식 기반 자동 밸런싱 스크립트 ⭐⭐⭐⭐⭐
- **방법:** S-커브/지수/로그 공식을 게임 장르별로 적용
- **구현:** Node.js 스크립트 (`scripts/balance-all-games.js`)
- **작업량:** 2~3일
- **효과:** 56개 게임 전체 일괄 밸런싱
- **과정:**
  1. 게임 장르 태깅 (수동, 1시간)
  2. 장르별 밸런스 프로파일 정의 (수동, 2시간)
  3. 파라미터 추출 스크립트 작성 (자동, 반나절)
  4. 밸런스 테이블 생성 + 주입 (자동)
  5. 검증 (파라미터 범위 체크 + 커브 시각화)

#### 2순위: LLM 보조 밸런싱 ⭐⭐⭐⭐⭐
- **방법:** Claude/GPT에 장르/규칙 설명 → 밸런스 테이블 JSON 생성
- **구현:** 프롬프트 템플릿 5개 (장르별) + 검증 스크립트
- **작업량:** 1일
- **효과:** 수학적 공식으로 잡기 어려운 "느낌"을 보완
- **활용:** 공식 결과의 cross-check, 특수 레벨(보스, 이벤트) 생성

#### 3순위: DDA 공통 모듈 삽입 ⭐⭐⭐⭐
- **방법:** 런타임 DDA 스니펫을 전 게임에 삽입
- **구현:** 자동화 스크립트로 DDA 코드 주입
- **작업량:** 1~2일
- **효과:** 플레이어별 자동 난이도 조절 (사전 밸런싱 + 실시간 보정)

#### 4순위: 몬테카를로 시뮬레이션 ⭐⭐⭐
- **방법:** 핵심 게임(match-3, RPG)에 대해 간이 시뮬레이터 작성 → 클리어율 검증
- **구현:** JavaScript 시뮬레이터 (게임별)
- **작업량:** 게임당 반나절
- **효과:** 밸런스 검증 신뢰도 높음, 하지만 시뮬레이터 작성 비용

#### 5순위 (장기): Machinations.io 이코노미 모델링 ⭐⭐⭐
- **방법:** 핵심 이코노미 게임(idle-slime, fishing-tycoon)만 모델링
- **작업량:** 게임당 4~8시간
- **효과:** 깊은 밸런스 검증, 하지만 스케일링 어려움

### ❌ 비추천 (우리 상황에 비효율적)
- Unity ML-Agents: Unity 전용
- OpenAI Gym: Python RL 환경 구축 비용 과대
- DeepMind OpenSpiel: 학술 연구용
- deltaDNA: Unity 전용, 사후 분석
- 순수 GA: 게임별 시뮬레이터 필요 → 비용 과대

### 📋 실행 로드맵

```
Week 1:
├── Day 1-2: 게임 장르 태깅 + 밸런스 프로파일 정의
├── Day 3-4: balance-all-games.js 스크립트 작성
└── Day 5: 1차 일괄 적용 + 검증

Week 2:
├── Day 1-2: DDA 공통 모듈 작성 + 삽입 스크립트
├── Day 3: LLM 프롬프트 템플릿 + 특수 레벨 생성
└── Day 4-5: 통합 테스트 + 미세 조정

Week 3+ (선택):
├── 핵심 게임 몬테카를로 시뮬레이션
└── 이코노미 게임 Machinations 모델링
```

---

## 참고 자료

1. Aversa, D. (2018). "GameDesign Math: RPG Level-based Progression" — https://www.davideaversa.it/blog/gamedesign-math-rpg-level-based-progression/
2. UserWise Blog. "The Mathematics of Game Balance" — https://blog.userwise.io/blog/the-mathematics-of-game-balance
3. Gamedeveloper.com (2023). "Difficulty Curves" — https://www.gamedeveloper.com/design/difficulty-curves
4. MDPI Electronics (2023). "Efficient Difficulty Level Balancing in Match-3 Puzzle Games" — https://www.mdpi.com/2079-9292/12/21/4456
5. Machinations.io (2024). "Balancing, solved!" — https://machinations.io/articles/balancing-solved
6. Wikipedia. "Dynamic game difficulty balancing" — https://en.wikipedia.org/wiki/Dynamic_game_difficulty_balancing
7. Hunicke & Chapman. "AI for Dynamic Difficulty Adjustment in Games" (Hamlet system)
8. designthegame.com (2025). "Example Level Curve Formulas" — https://www.designthegame.com/learning/courses/course/fundamentals-level-curve-design/
9. NCB/PMC (2018). "A Monte Carlo Approach to Skill-Based Automated Playtesting" — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6319931/
10. ACM (2017). "Speeding up genetic algorithm-based game balancing using fitness predictors"
