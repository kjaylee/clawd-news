# QA 전용 에이전트/도구 리서치

> 작성일: 2026-01-31
> 작성자: 미스 김
> 목적: 게임 QA 자동화를 위한 도구/에이전트 조사 및 자체 파이프라인 설계

---

## 1. AI QA 에이전트/도구 현황

### 1.1 게임 QA 전문 AI 에이전트

#### modl.ai (modl:test)
- **유형:** SaaS / Unity·Unreal 플러그인
- **아키텍처:** "Black-box" 방식 — 화면 비주얼(OCR + 비전 모델)만으로 게임 상태 파악. 코드 접근 불필요
- **핵심 기능:**
  - AI 봇이 자율적으로 게임 환경 탐색, 버그 감지, 에러 로깅
  - 실시간 리포팅 (크래시 로그 + 성능 데이터)
  - CI/CD 파이프라인 통합
- **장점:** SDK/코드 통합 없이 시작 가능, Unity Asset Store 배포
- **가격:** 상용 (가격 비공개, 데모 요청)
- **우리 환경 적용:** Unity Asset Store 패키지 있음. 하지만 우리는 HTML5 웹게임이라 직접 사용 불가. **개념만 흡수: "블랙박스 비전 기반 탐색" 아이디어**

#### Regression Games
- **유형:** Unity 전용 AI 테스팅 플랫폼
- **아키텍처:** Unity SDK → C# 봇 스크립트 → LLM으로 행동 트리 노드 자동 생성
- **핵심 기능:**
  - LLM 기반 UI 자동 테스트 (자연어 → 테스트 코드)
  - Claude for Computer Use 실험 성공 사례 보유
  - 행동 트리 기반 AI 에이전트
- **가격:** 무료 오픈소스 SDK + 유료 클라우드
- **우리 환경 적용:** Unity 전용이라 직접 사용 불가. **개념 흡수: "LLM 기반 자동 테스트 생성"**

#### TITAN (NetEase Fuxi + 저장대학)
- **유형:** 학술 연구 프레임워크 (arxiv 2509.22170)
- **아키텍처:** LLM 에이전트 → 게임 상태 인식 → 행동 추천 → 메모리 기반 반성적 추론 → 버그 진단 리포트
- **핵심 기능:**
  - 고차원 게임 상태 추상화
  - 액션 트레이스 메모리 + 자기 교정
  - LLM 기반 오라클로 기능/로직 버그 자동 탐지
  - 8개 실제 게임 QA 파이프라인에 배포됨
  - 95% 태스크 완료율, 기존 방법이 못 찾은 4개 버그 발견
- **우리 환경 적용:** MMORPG 전용이지만 **핵심 개념 흡수: "상태 추상화 → 행동 추천 → 반성 → 버그 리포트" 루프**

### 1.2 범용 AI QA 도구/서비스

#### QA Wolf
- **유형:** AI + 인간 하이브리드 QA 서비스
- **아키텍처:** Playwright 기반 (vanilla, 벤더 락인 없음) → AI가 테스트 생성·유지보수 → 인간 QA 엔지니어 감독
- **핵심 기능:**
  - 4개월 내 80% E2E 테스트 커버리지 달성
  - 무제한 병렬 실행 (실제 디바이스)
  - Flake-free 테스트 유지보수
- **가격:** 유료 서비스 (엔터프라이즈 가격)
- **우리 환경 적용:** 웹앱 QA에 특화 — Playwright 기반이라 개념적으로 직접 적용 가능. **핵심 흡수: "Playwright + AI 자동 테스트 생성"**

#### Testim (Tricentis)
- **유형:** AI 기반 테스트 자동화 플랫폼
- **아키텍처:** 레코더 → AI Smart Locator → 자동 유지보수
- **핵심 기능:**
  - 코드 없이 녹화 기반 테스트 생성
  - AI 스마트 로케이터 (동적 UI 변경에 강인)
  - Agentic 자연어 → 테스트 자동 생성
- **가격:** 무료 Community + 유료 Pro
- **우리 환경 적용:** 웹앱용이지만 Canvas 게임에는 제한적. **개념 흡수: "AI 로케이터로 깨지지 않는 테스트"**

#### Applitools Eyes
- **유형:** Visual AI 테스팅 SaaS
- **아키텍처:** 스크린샷 촬영 → CNN 인코더 → 특징 벡터 → 베이스라인과 유사도 비교
- **핵심 기능:**
  - AI 기반 시각 비교 (픽셀 단순 비교가 아닌 "사람 눈" 수준)
  - 동적 콘텐츠에도 강인 (렌더링 차이 무시)
  - Cross-browser, cross-device 시각 테스트
- **가격:** 유료 (비쌈), Percy(BrowserStack)가 더 저렴한 대안
- **우리 환경 적용:** 스크린샷 기반이라 Canvas 게임에 적합! **핵심 흡수: "CNN 기반 지능형 스크린샷 비교"**

### 1.3 게임 특화 자동화 프레임워크

#### AirTest + Poco (NetEase)
- **유형:** 오픈소스 크로스플랫폼 게임 자동화 프레임워크
- **아키텍처:**
  - **AirTest:** 이미지 인식 기반 UI 자동화 (OpenCV)
  - **Poco:** UI 컨트롤 트리 기반 자동화 (Unity/Cocos2d/Android)
- **핵심 기능:**
  - 이미지 매칭으로 UI 요소 찾기 (DOM 없어도 OK)
  - 원클릭 녹화·재생
  - HTML 리포트 자동 생성
  - Android, iOS, Windows 지원
- **가격:** 완전 무료 오픈소스 (Python)
- **우리 환경 적용:** 이미지 인식 아이디어는 Canvas 게임에 적용 가능. **핵심 흡수: "이미지 인식으로 Canvas 요소 감지"**

#### GameBench
- **유형:** 모바일 게임 성능 프로파일링 도구
- **아키텍처:** 디바이스 레벨 FPS/CPU/GPU/메모리/배터리 모니터링
- **핵심 기능:**
  - 실시간 FPS 트렌드 시각화
  - CPU/GPU/메모리 사용량 추적
  - 배터리 소모 측정
- **가격:** 무료 기본 + Pro 유료
- **우리 환경 적용:** 모바일 전용이라 직접 불가. **개념 흡수: "FPS 트렌드 + 리소스 모니터링 대시보드"**

### 1.4 Visual Regression 오픈소스 도구

| 도구 | 특징 | 오픈소스 |
|------|------|----------|
| **pixelmatch** | 경량 JS 이미지 비교 라이브러리 (Playwright 내장) | ✅ MIT |
| **Resemble.js** | CSS/이미지 비교, PhantomCSS 기반 | ✅ MIT |
| **Visual Regression Tracker** | 자체 호스팅, pixelmatch + VLM 하이브리드 | ✅ Apache 2.0 |
| **Lost Pixel** | Storybook + 페이지 + E2E 통합 | ✅ (오픈소스 엔진) |
| **BackstopJS** | Playwright/Puppeteer 기반 시각 회귀 | ✅ MIT |

**핵심:** Playwright는 내장 `toHaveScreenshot()` API로 pixelmatch 기반 시각 비교를 이미 제공함.

---

## 2. Playwright + Canvas 게임 테스트 핵심 기법

### 2.1 Canvas 요소 상호작용 문제와 해법

HTML5 Canvas 게임의 핵심 도전: **DOM 요소가 없다** → 버튼이 `<button>`이 아니라 캔버스 위 그려진 영역.

#### 해법 A: 게임 내부 요소 노출 (PhaserJS 사례)
```javascript
// 게임 코드에서 interactive 요소 좌표를 window에 노출
window.elements = {};
document.addEventListener('declare-element', (event) => {
  window.elements[event.detail.name] = { x: event.detail.x, y: event.detail.y };
});

// Playwright에서 접근
const element = await page.evaluate((id) => window.elements?.[id], 'start-button');
await page.mouse.click(element.x, element.y);
```

#### 해법 B: 좌표 기반 직접 클릭
```javascript
// Canvas 크기 기준 상대 좌표로 클릭
const canvas = page.locator('canvas');
const box = await canvas.boundingBox();
await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
```

#### 해법 C: 게임 상태 직접 조작
```javascript
// game 객체에 직접 접근하여 상태 설정
await page.evaluate(() => {
  window.game.state.gold = 10000;
  window.game.state.score = 0;
});
```

### 2.2 Playwright Clock API로 Canvas 애니메이션 테스트
- `playwright-canvas` PoC: Clock API로 시간 제어 + Visual Comparison으로 프레임별 스크린샷 비교
- 게임플레이 루프, 3D 씬, 셰이더 출력 등 테스트 가능

### 2.3 FPS 측정
```javascript
// Playwright에서 page.evaluate로 FPS 카운터 주입
const fps = await page.evaluate(() => {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    function count() {
      frames++;
      if (performance.now() - start >= 1000) {
        resolve(frames);
      } else {
        requestAnimationFrame(count);
      }
    }
    requestAnimationFrame(count);
  });
});
```

### 2.4 콘솔 에러 감지
```javascript
// Playwright 콘솔 이벤트 리스너
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', err => errors.push(err.message));
```

### 2.5 성능 메트릭 수집
```javascript
// Navigation Timing API
const metrics = await page.evaluate(() => JSON.stringify(performance.timing));
// Paint Timing
const paint = await page.evaluate(() => JSON.stringify(performance.getEntriesByType('paint')));
// LCP (Largest Contentful Paint)
const lcp = await page.evaluate(() => new Promise(resolve => {
  new PerformanceObserver(list => {
    const entries = list.getEntries();
    resolve(entries.at(-1).startTime);
  }).observe({ type: 'largest-contentful-paint', buffered: true });
}));
```

---

## 3. ClawdHub 스킬 검색 결과

- ClawdHub (clawdhub.com) 스킬 레지스트리에서 "QA", "testing", "game" 관련 스킬 조사
- **직접 결과:** QA/게임 테스트 전용 스킬은 현재 확인되지 않음
- **보안 주의:** ClawdHub 최근 보안 이슈 발견 (Snyk 리포트, backdoor 스킬 사례)
  - 다운로드 수 조작 가능한 API 취약점 발견됨
  - **결론: clawdhub install 절대 금지 — 개념만 조사, 자체 재작성 원칙 재확인**

---

## 4. 학술 연구 동향

### 4.1 "Leveraging LLM Agents for Automated Video Game Testing" (TITAN, 2025.09)
- **4단계 파이프라인:** 상태 인식 → 행동 최적화 → 메모리 기반 추론 → LLM 오라클 버그 진단
- **성과:** 95% 태스크 완료, 기존 방법 미발견 4개 버그 탐지
- **교훈:** LLM의 추론 능력을 게임 상태 이해에 활용하면 단순 스크립트보다 훨씬 높은 커버리지

### 4.2 "Coverage-Aware Game Playtesting with LLM-Guided RL" (2025.12)
- 코드 커버리지 + 게임플레이 의도를 결합한 LLM+RL 하이브리드 플레이테스트

### 4.3 "LLMs May Not Be Human-Level Players, But They Can Be Testers" (2024.10)
- LLM 에이전트로 게임 난이도 측정
- **교훈:** LLM은 "잘 하는" 것보다 "다양하게 시도하는" 데 강점 → QA에 적합

---

## 5. 우리 환경 분석

### 5.1 현재 인프라
| 리소스 | 역할 | QA 관련 능력 |
|--------|------|-------------|
| **MiniPC** (Linux) | 브라우저 자동화 | Playwright 설치됨, headless 가능 |
| **맥 스튜디오** (macOS) | 메인 작업 | git, node, 보고서 생성 |
| **맥북 Pro** (M3) | 이미지 생성 | 스크린샷 비교 가능 |
| **GCP VM** | 웹 호스팅 | 게임 서빙 (Traefik) |

### 5.2 우리 게임 특성
- **플랫폼:** HTML5 Canvas (텔레그램 Mini App)
- **엔진:** Vanilla JS / 단일 파일 게임
- **배포:** eastsea.monster + 텔레그램
- **UI:** Canvas 기반 (DOM 요소 최소)
- **인터랙션:** 터치/클릭, 스와이프

### 5.3 기존 QA 방식의 한계
- 코드 리뷰만으로는 실제 플레이 버그 놓침
- 수동 테스트 = 미스 김 혼자 → 커버리지 한계
- 해상도별, 디바이스별 테스트 불가

---

## 6. 🎯 자체 QA 파이프라인 설계안

### 6.1 아키텍처 개요

```
┌─────────────────────────────────────────────────────┐
│                    QA Runner (MiniPC)                │
│                                                     │
│  ┌───────────┐   ┌──────────────┐   ┌────────────┐ │
│  │ Playwright │──▶│ 게임 로더     │──▶│ 테스트 실행 │ │
│  │ (headless) │   │ (URL 접속)   │   │ (시나리오) │ │
│  └───────────┘   └──────────────┘   └────────────┘ │
│        │                                     │      │
│        ▼                                     ▼      │
│  ┌───────────┐                        ┌──────────┐  │
│  │ 수집기     │                        │ 판정기   │  │
│  │ - 스크린샷 │                        │ - PASS   │  │
│  │ - 콘솔로그 │                        │ - FAIL   │  │
│  │ - FPS      │                        │ - WARN   │  │
│  │ - 성능     │                        └──────────┘  │
│  └───────────┘                              │        │
│        │                                    │        │
│        ▼                                    ▼        │
│  ┌─────────────────────────────────────────────┐     │
│  │              리포트 생성기                    │     │
│  │  HTML 리포트 + 스크린샷 비교 + JSON 결과     │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  맥 스튜디오     │
              │  결과 수집 + git │
              │  + 텔레그램 보고 │
              └─────────────────┘
```

### 6.2 5가지 테스트 모듈

#### 모듈 1: 스모크 테스트 (기본 동작 확인)
- 게임 URL 접속 → Canvas 렌더링 확인
- 콘솔 에러 0건 확인
- 기본 인터랙션 (시작 버튼 클릭) 동작 확인
- **자동화:** Playwright `page.goto()` → `page.on('console')` → 스크린샷

#### 모듈 2: Visual Regression (시각 회귀 테스트)
- 베이스라인 스크린샷 저장
- 새 빌드 스크린샷 촬영 → pixelmatch로 비교
- 의도하지 않은 UI 변경 감지
- **도구:** Playwright 내장 `toHaveScreenshot()` (pixelmatch 내장)
- **해상도별:** 360×640, 390×844, 414×896, 768×1024, 1920×1080

#### 모듈 3: 인터랙션 테스트 (클릭/터치 시뮬레이션)
- Canvas 좌표 기반 클릭 시뮬레이션
- 게임 내부 요소 좌표 노출 API (선택적)
- 터치 이벤트 에뮬레이션 (모바일 시뮬레이션)
- **기법:**
  - `page.mouse.click(x, y)` — 좌표 기반 클릭
  - `page.touchscreen.tap(x, y)` — 터치 탭
  - `page.evaluate()` — 게임 상태 직접 조작/확인

#### 모듈 4: 성능 테스트 (FPS + 로딩)
- 게임 로딩 시간 측정 (Navigation Timing API)
- FPS 카운터 주입 (requestAnimationFrame 기반)
- 메모리 사용량 추적 (performance.memory)
- **임계값:**
  - 로딩: < 3초 (모바일 기준)
  - FPS: > 30 (최소), > 55 (양호)
  - 메모리: < 200MB

#### 모듈 5: 에러 모니터링
- `page.on('console', ...)` — 콘솔 에러/경고 수집
- `page.on('pageerror', ...)` — 미처리 예외 수집
- `page.on('requestfailed', ...)` — 실패한 네트워크 요청
- **판정:** 에러 0건 = PASS, 경고만 = WARN, 에러 있음 = FAIL

### 6.3 게임별 테스트 매트릭스

```
게임 URL × 해상도 × 테스트 모듈 = 테스트 케이스

예시:
- /games/pirate-dice/ × 5 해상도 × 5 모듈 = 25 테스트
- /games/new-game/   × 5 해상도 × 5 모듈 = 25 테스트
```

### 6.4 리포트 형식

```json
{
  "timestamp": "2026-01-31T15:00:00Z",
  "game": "pirate-dice",
  "results": {
    "smoke": { "status": "PASS", "consoleErrors": 0, "loadTime": 1.2 },
    "visual": {
      "status": "WARN",
      "diffs": [
        { "resolution": "390x844", "diffPercent": 0.3, "screenshot": "diff-390x844.png" }
      ]
    },
    "interaction": { "status": "PASS", "clicksSimulated": 15, "responsiveClicks": 15 },
    "performance": { "status": "PASS", "fps": 58, "loadTime": 1.2, "memory": "45MB" },
    "errors": { "status": "PASS", "errors": [], "warnings": [] }
  },
  "overall": "PASS"
}
```

### 6.5 실행 방식

#### 수동 실행
```bash
# MiniPC에서
cd ~/game-qa
npx playwright test --project=smoke
npx playwright test --project=visual
npx playwright test --project=all
```

#### 자동 실행 (크론)
- **배포 후 자동:** git push → webhook → QA 실행
- **정기 실행:** 매일 09:00 → 전체 게임 QA → 결과 텔레그램 보고

#### 결과 보고
- JSON 결과 파일 → 맥 스튜디오로 전송
- FAIL 시 → 텔레그램 즉시 알림 (스크린샷 첨부)
- PASS 시 → 일일 요약에 포함

### 6.6 향후 확장 계획

#### Phase 1: 기본 파이프라인 (현재 설계)
- Playwright headless 기반
- 5개 모듈 구현
- JSON 리포트

#### Phase 2: 지능형 테스트
- LLM 기반 테스트 시나리오 자동 생성 (TITAN 개념 적용)
- 게임 상태 추상화 → "어디를 더 테스트해야 하는지" AI 판단
- 플레이어 행동 시뮬레이션 (랜덤 워크 + 목표 지향)

#### Phase 3: 비전 AI 통합
- 스크린샷 분석으로 "이상해 보이는" UI 자동 감지
- Gemini Vision (MiniPC) 활용 가능
- "이 스크린샷에 문제가 있나?" → AI 판정

---

## 7. 핵심 발견 요약

### ✅ 바로 적용 가능한 것
1. **Playwright 내장 Visual Comparison** — 추가 도구 없이 스크린샷 비교 가능
2. **Console/Error 리스너** — 즉시 구현 가능
3. **FPS 측정** — requestAnimationFrame + page.evaluate
4. **좌표 기반 Canvas 인터랙션** — mouse.click(x,y)

### 🔄 개념만 흡수할 것
1. **modl.ai 블랙박스 비전 탐색** — 코드 없이 화면만 보고 테스트하는 개념
2. **TITAN 4단계 파이프라인** — 인식→추천→추론→진단 루프
3. **Applitools CNN 비교** — 픽셀이 아닌 "의미적" 시각 비교
4. **AirTest 이미지 매칭** — Canvas에서 이미지로 요소 찾기
5. **Regression Games LLM 테스트 생성** — 자연어 → 테스트 코드

### ❌ 우리에게 불필요한 것
1. 모바일 디바이스 팜 (모바일 앱이 아니므로)
2. Unity/Unreal SDK 통합 (웹게임이므로)
3. 유료 SaaS (자체 구축이 목표)

---

## 8. 참고 자료

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [playwright-canvas PoC](https://github.com/satelllte/playwright-canvas)
- [PhaserJS + Playwright 실전 사례](https://www.reddit.com/r/gamedev/comments/1p3d5ze/)
- [TITAN: LLM Game Testing Agent](https://arxiv.org/html/2509.22170v1)
- [modl.ai Game Testing Tools List](https://modl.ai/game-testing-tools)
- [AirTest/Poco GitHub](https://github.com/AirtestProject/Airtest)
- [Playwright Performance Testing](https://www.browserstack.com/guide/playwright-performance-testing)
- [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker)
