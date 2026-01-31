# 🚀 웹 서비스/마이크로SaaS 100개 기획서

> **작성일:** 2026-01-31  
> **목표:** 1인 개발자가 양산 가능한 수익형 서비스 100개 기획  
> **인프라:** Mac Studio(로컬) / MiniPC(서버) / NAS(스토리지) / 맥북(이미지생성)  
> **허브:** eastsea.monster  

---

## Part 1: 리서치 결과 요약

### 1.1 소스 목록

| 소스 | 핵심 발견 |
|------|-----------|
| **Reddit r/SaaS** | "Boring SaaS"가 가장 수익성 높음. PDF 변환기 $16K/월, 스코어보드 $11K/월 |
| **Reddit r/microsaas** | $3.9K/월 마이크로SaaS, 주 6시간 운영. 단순함이 핵심 |
| **Reddit r/SideProject** | 이미지 업스케일링 API 405 업보트, AI 배경제거 2.5K 업보트 |
| **Indie Hackers** | Bannerbear $630K ARR(1인), ShipFast $75K MRR, 포트폴리오 전략 $51K/월 |
| **Product Hunt 2025** | AI 개발도구, 디자인자동화, 프로덕티비티 도구가 상위 |
| **Chrome Web Store** | 평균 연매출 $862K, GoFullPage $10K/월, Gmass $130K/월 |
| **AppSumo** | 이미지 처리, 스크린샷, SEO 도구가 지속 인기 |
| **GeekNews (한국)** | NotebookLM 웹 임포터 10만 사용자, DedupX 중복파일 탐지 |
| **Telegram 생태계** | Mini App $35K/30일, Stars 수익화, 봇 $300/월+ |
| **Crunchbase 2025** | 시드 투자 42% AI 집중, 개발자도구+AI = 최고 조합 |

### 1.2 검증된 성공 패턴

1. **Boring SaaS** — 지루하지만 반복 수요 (PDF변환, 인보이스, 모니터링)
2. **API-first** — B2B API = 높은 이탈비용, 안정 MRR
3. **포트폴리오 전략** — 30개 소형 앱 = $22K/월 (한 제품 올인보다 분산)
4. **SEO 리드마그넷** — 무료 도구로 트래픽 → 프리미엄 전환
5. **크롬확장** — 웹스토어가 배포채널, 70-80% 이익률
6. **한국 시장 현지화** — 글로벌 도구의 한국판 = 블루오션

### 1.3 수익 벤치마크

| 서비스 유형 | 1인 MRR 범위 | 대표 사례 |
|-------------|-------------|-----------|
| 이미지 API | $3K-$52K | Bannerbear, ScreenshotOne |
| 문서 변환 | $5K-$16K | BankStatementConverter |
| 크롬 확장 | $1K-$130K | Gmass, GoFullPage, CSS Scan |
| 웹 도구 (광고) | $1K-$250K | Photopea $3M/년 |
| SaaS 보일러플레이트 | $5K-$75K | ShipFast |
| 텔레그램 Mini App | $1K-$35K | 게임/유틸리티 |
| 업타임 모니터링 | $2K-$8K | Healthchecks.io |
| 숏폼 비디오 생성 | $5K-$20K | StoryShort.ai |

---

## Part 2: 분류 매트릭스

### 2.1 축 정의

**기능축 (12개):**
| 코드 | 카테고리 | 예시 |
|------|----------|------|
| IMG | 이미지처리 | 리사이즈, 변환, 배경제거, 생성 |
| DOC | 문서변환 | PDF→Excel, 포맷변환, OCR |
| AI | AI래퍼 | LLM 특화도구, AI 자동화 |
| DEV | 개발자도구 | 코드도구, 테스트, 배포 |
| MKT | 마케팅 | SEO, 소셜미디어, 광고 |
| ECO | 이커머스 | 상품관리, 가격비교, 셀러도구 |
| EDU | 교육 | 학습, 퀴즈, 튜토리얼 |
| PRD | 생산성 | 시간관리, 노트, 자동화 |
| UTL | 유틸리티 | 계산기, 변환기, 생성기 |
| FIN | 금융 | 가계부, 세금, 투자 |
| CNT | 콘텐츠 | 블로그, 비디오, 팟캐스트 |
| COM | 커뮤니케이션 | 이메일, 메신저, 알림 |

**형태축 (6개):**
| 코드 | 형태 | 특징 |
|------|------|------|
| WEB | 웹앱 | HTML5 단일파일~풀스택 |
| API | API서비스 | REST/GraphQL, 유료 크레딧 |
| EXT | 크롬확장 | Chrome Web Store 배포 |
| CLI | CLI도구 | npm/pip 패키지, 터미널 |
| BOT | 텔레그램봇 | Bot API, Mini App |
| APP | 모바일앱 | iOS/Android |

### 2.2 매트릭스 히트맵 (서비스 수)

|      | WEB | API | EXT | CLI | BOT | APP |
|------|-----|-----|-----|-----|-----|-----|
| IMG  | 5   | 3   | 2   | 1   | 1   | 1   |
| DOC  | 4   | 2   | 1   | 1   | 1   | 0   |
| AI   | 4   | 2   | 2   | 1   | 2   | 0   |
| DEV  | 3   | 2   | 2   | 3   | 0   | 0   |
| MKT  | 3   | 1   | 2   | 0   | 1   | 0   |
| ECO  | 3   | 1   | 2   | 0   | 1   | 0   |
| EDU  | 3   | 0   | 1   | 0   | 2   | 0   |
| PRD  | 3   | 0   | 2   | 1   | 1   | 1   |
| UTL  | 5   | 1   | 1   | 1   | 1   | 0   |
| FIN  | 3   | 0   | 1   | 0   | 1   | 0   |
| CNT  | 3   | 1   | 1   | 1   | 1   | 0   |
| COM  | 1   | 1   | 1   | 0   | 2   | 0   |
| **계** | **40** | **14** | **18** | **9** | **14** | **2** |

> **비고:** 모바일앱은 개발비용 대비 ROI가 낮아 최소화. 웹앱(40개)이 가장 양산 용이.

---

## Part 3: 100개 서비스 목록

### 범례
- **난이도**: 1(HTML 단일파일) ~ 5(풀스택+인프라)
- **트렌드**: 1(하락) ~ 5(급상승)
- **수익모델**: 💰광고 / 💎프리미엄 / 🔑API크레딧 / 📦구독 / 🛒일회성

---

### 🖼️ 이미지처리 (IMG) — 13개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 1 | **OG Image Forge** | WEB | URL 입력 → OG 이미지 자동 생성기 | 💰💎 | 2 | 5 |
| 2 | **Bulk Image Resizer** | WEB | 드래그앤드롭 대량 이미지 리사이즈+포맷변환 | 💰💎 | 1 | 4 |
| 3 | **App Screenshot Studio** | WEB | 앱스토어 스크린샷 자동 생성기 (이미 구현 중) | 💎📦 | 2 | 5 |
| 4 | **Favicon Factory** | WEB | 이미지→모든 사이즈 파비콘/앱아이콘 일괄 생성 | 💰💎 | 1 | 3 |
| 5 | **Watermark Stamper** | WEB | 대량 이미지 워터마크 일괄 삽입 도구 | 💰💎 | 1 | 3 |
| 6 | **Banner Genie API** | API | 템플릿 기반 배너/소셜카드 자동 생성 REST API | 🔑📦 | 3 | 5 |
| 7 | **BG Eraser API** | API | AI 배경 제거 API (remove.bg 저가 대안) | 🔑📦 | 4 | 5 |
| 8 | **Image Upscale API** | API | AI 이미지 업스케일링 API (2x/4x) | 🔑📦 | 4 | 5 |
| 9 | **Color Palette Picker** | EXT | 웹페이지에서 컬러 팔레트 원클릭 추출 | 💎🛒 | 1 | 4 |
| 10 | **Screenshot Beautifier** | EXT | 스크린샷 캡처 → 자동 꾸미기 (그라데이션 배경+둥근모서리) | 💎 | 2 | 4 |
| 11 | **img-squeeze** | CLI | CLI 이미지 압축기 (WebP/AVIF 자동 변환) | 🛒 | 2 | 3 |
| 12 | **PhotoBot** | BOT | 텔레그램에 이미지 전송 → 리사이즈/변환/압축 즉시 반환 | 💎 | 2 | 3 |
| 13 | **HEIC2JPG Express** | WEB | HEIC→JPG/PNG 브라우저 내 변환 (서버 업로드 없음) | 💰 | 1 | 4 |

### 📄 문서변환 (DOC) — 9개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 14 | **PDF to Excel Pro** | WEB | 은행명세서/인보이스 PDF→Excel 변환기 | 💎📦 | 3 | 5 |
| 15 | **Markdown Resume** | WEB | 마크다운으로 이력서 작성 → PDF/HTML 내보내기 | 💰💎 | 2 | 4 |
| 16 | **JSON Formatter** | WEB | JSON 뷰어/포맷터/유효성검사 (오프라인 지원) | 💰 | 1 | 3 |
| 17 | **CSV Kitchen** | WEB | CSV 파일 편집/정렬/필터/변환 웹 도구 | 💰💎 | 2 | 3 |
| 18 | **Invoice PDF API** | API | 데이터→전문 인보이스 PDF 자동 생성 API | 🔑📦 | 3 | 4 |
| 19 | **Receipt OCR API** | API | 영수증 사진→구조화 데이터(JSON) OCR API | 🔑📦 | 4 | 4 |
| 20 | **DocMerge** | EXT | 크롬에서 여러 웹페이지를 하나의 PDF로 병합 | 💎 | 2 | 3 |
| 21 | **md2pdf** | CLI | 마크다운→PDF 변환 CLI (커스텀 CSS 지원) | 🛒 | 2 | 3 |
| 22 | **PaperBot** | BOT | 텔레그램에 파일 전송 → 포맷 변환(PDF↔Word↔이미지) | 💎 | 2 | 3 |

### 🤖 AI래퍼 (AI) — 11개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 23 | **AI Headshot Pro** | WEB | AI 증명사진/프로필 사진 생성기 (한국인 최적화) | 🛒💎 | 4 | 5 |
| 24 | **Alt Text Generator** | WEB | 이미지 업로드 → AI가 접근성용 alt 텍스트 자동 생성 | 💰💎 | 2 | 4 |
| 25 | **AI 한줄 요약기** | WEB | 긴 글 붙여넣기 → 핵심 1-3줄 요약 | 💰 | 1 | 4 |
| 26 | **AI Blog Writer** | WEB | 키워드 입력 → SEO 최적화 블로그 포스트 초안 생성 | 💎📦 | 3 | 5 |
| 27 | **Prompt Craft API** | API | 프롬프트 최적화/테스트/버전관리 API | 🔑📦 | 3 | 5 |
| 28 | **AI Translation API** | API | 맥락 인식 고품질 번역 API (DeepL 대안) | 🔑📦 | 3 | 4 |
| 29 | **Tab Summarizer** | EXT | 현재 탭 내용을 AI로 즉시 요약 | 💎 | 2 | 5 |
| 30 | **AI Code Reviewer** | EXT | GitHub PR 페이지에서 AI 코드 리뷰 오버레이 | 💎📦 | 3 | 5 |
| 31 | **ai-commit** | CLI | git diff → AI가 커밋 메시지 자동 생성 | 🛒 | 2 | 4 |
| 32 | **AskBot** | BOT | 텔레그램에서 AI에게 뭐든 물어보기 (GPT/Claude 래퍼) | 💎📦 | 2 | 4 |
| 33 | **WriterBot** | BOT | 텔레그램에서 글쓰기 보조 (교정/톤변환/번역) | 💎📦 | 2 | 4 |

### 🛠️ 개발자도구 (DEV) — 10개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 34 | **Regex Playground** | WEB | 실시간 정규표현식 테스트+설명+치트시트 | 💰 | 1 | 3 |
| 35 | **Cron Expression Builder** | WEB | 시각적 크론 표현식 생성기+영어 설명 | 💰 | 1 | 3 |
| 36 | **API Tester** | WEB | 브라우저에서 REST API 테스트 (Postman 경량판) | 💰💎 | 2 | 4 |
| 37 | **Web Screenshot API** | API | URL→고품질 스크린샷 REST API (Playwright 기반) | 🔑📦 | 3 | 5 |
| 38 | **Webhook Debugger API** | API | 웹훅 수신/로깅/리플레이 서비스 | 🔑📦 | 3 | 4 |
| 39 | **GitHub Repo Stats** | EXT | GitHub 레포 페이지에 다운로드/스타 트렌드 차트 추가 | 💎 | 2 | 3 |
| 40 | **CSS Inspector** | EXT | 웹 요소 호버 → CSS 속성 즉시 복사 | 💎🛒 | 2 | 4 |
| 41 | **deploy-check** | CLI | 배포 전 체크리스트 자동 검증 (SSL, SEO, 성능) | 🛒 | 2 | 3 |
| 42 | **env-vault** | CLI | .env 파일 암호화/팀 공유/동기화 CLI | 📦 | 3 | 4 |
| 43 | **perf-audit** | CLI | 웹사이트 Lighthouse 스코어 + 개선 제안 CLI | 🛒 | 2 | 3 |

### 📢 마케팅 (MKT) — 7개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 44 | **Hashtag Generator** | WEB | 키워드→인스타/X/틱톡 해시태그 자동 생성 | 💰💎 | 1 | 4 |
| 45 | **Social Card Preview** | WEB | URL의 OG/Twitter 카드 미리보기+검증 도구 | 💰 | 1 | 4 |
| 46 | **UTM Builder** | WEB | UTM 파라미터 빌더+단축URL+QR코드 일체형 | 💰💎 | 1 | 3 |
| 47 | **Email Subject Tester** | API | AI 이메일 제목 품질 점수+개선 제안 API | 🔑 | 2 | 3 |
| 48 | **SEO Meta Checker** | EXT | 현재 페이지 SEO 메타태그 분석+점수 | 💎 | 2 | 4 |
| 49 | **Amazon Price Tracker** | EXT | 아마존/쿠팡 상품 가격 변동 추적+알림 | 💎 | 3 | 4 |
| 50 | **PromoBot** | BOT | 텔레그램 채널에 예약 포스팅+분석 봇 | 💎📦 | 3 | 3 |

### 🛒 이커머스 (ECO) — 7개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 51 | **Product Image Enhancer** | WEB | 상품 사진 배경 교체+보정 자동화 도구 | 💎📦 | 3 | 5 |
| 52 | **Review Analyzer** | WEB | 상품 리뷰 크롤링 → 긍/부정 분석 대시보드 | 💎 | 3 | 4 |
| 53 | **Shipping Calculator** | WEB | 국제 배송비 비교 계산기 (EMS/DHL/FedEx) | 💰 | 2 | 3 |
| 54 | **Product Listing API** | API | AI로 상품 설명/타이틀 자동 생성 API | 🔑📦 | 3 | 4 |
| 55 | **Coupon Finder** | EXT | 결제 페이지에서 자동 쿠폰 검색+적용 | 💰(제휴) | 3 | 4 |
| 56 | **Price Drop Alert** | EXT | 모니터링 중인 상품 가격 하락 시 알림 | 💎 | 2 | 4 |
| 57 | **DealBot** | BOT | 텔레그램으로 특가/핫딜 실시간 알림 | 💰(제휴) | 3 | 4 |

### 📚 교육 (EDU) — 6개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 58 | **Typing Speed Test** | WEB | 타이핑 속도 측정+연습+리더보드 | 💰 | 1 | 3 |
| 59 | **Flashcard Maker** | WEB | 학습 플래시카드 생성+반복학습(SRS) 도구 | 💎📦 | 2 | 4 |
| 60 | **Code Quiz Arena** | WEB | 프로그래밍 퀴즈+코딩챌린지 플랫폼 | 💰💎 | 3 | 4 |
| 61 | **Math Solver** | EXT | 수학 문제 선택 → AI 풀이+설명 오버레이 | 💎 | 3 | 4 |
| 62 | **VocaBot** | BOT | 텔레그램 영어단어 하루 10개 + 퀴즈 봇 | 💎 | 2 | 3 |
| 63 | **StudyTimerBot** | BOT | 뽀모도로 타이머+학습 기록+주간 리포트 봇 | 💎 | 2 | 3 |

### ⚡ 생산성 (PRD) — 8개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 64 | **Scoreboard Live** | WEB | 임베드 가능 실시간 스코어보드/리더보드 생성기 | 💎📦 | 3 | 4 |
| 65 | **Meeting Cost Calculator** | WEB | 참석자 수×시급→회의 비용 실시간 계산 | 💰 | 1 | 3 |
| 66 | **Kanban Lite** | WEB | 초경량 칸반보드 (로컬 저장, 계정 불필요) | 💰💎 | 2 | 3 |
| 67 | **Tab Manager** | EXT | 크롬 탭 그룹 저장/복원/공유 | 💎 | 2 | 4 |
| 68 | **Focus Mode** | EXT | 소셜미디어/뉴스 사이트 자동 차단+타이머 | 💎 | 2 | 4 |
| 69 | **todo-cli** | CLI | 미니멀 CLI 투두리스트 (마크다운 기반) | 🛒 | 1 | 2 |
| 70 | **DailyBot** | BOT | 일일 스탠드업 수집+요약+리포트 봇 | 💎📦 | 3 | 3 |
| 71 | **Habit Tracker** | APP | 습관 추적+연속일수+통계 앱 | 💎📦 | 3 | 4 |

### 🔧 유틸리티 (UTL) — 9개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 72 | **QR Code Generator** | WEB | 커스텀 QR코드 생성기 (로고삽입/컬러/디자인) | 💰💎 | 1 | 4 |
| 73 | **Lorem Ipsum Generator** | WEB | 다양한 스타일의 더미 텍스트 생성기 (한국어 포함) | 💰 | 1 | 2 |
| 74 | **Password Generator** | WEB | 보안 비밀번호 생성+강도 체크 도구 | 💰 | 1 | 3 |
| 75 | **Unix Timestamp Converter** | WEB | 유닉스 타임스탬프↔날짜 변환+타임존 | 💰 | 1 | 3 |
| 76 | **Online Timer/Stopwatch** | WEB | 전체화면 타이머+스톱워치+알람 | 💰 | 1 | 3 |
| 77 | **Uptime Monitor API** | API | 웹사이트 업타임 모니터링+알림 API | 📦 | 3 | 5 |
| 78 | **Link Shortener** | EXT | 원클릭 URL 단축+QR+복사 확장 | 💎 | 1 | 3 |
| 79 | **file-renamer** | CLI | 파일 일괄 이름변경 CLI (패턴/정규식) | 🛒 | 1 | 2 |
| 80 | **ReminderBot** | BOT | 텔레그램 리마인더 설정 봇 (자연어 파싱) | 💎 | 2 | 3 |

### 💰 금융 (FIN) — 5개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 81 | **Freelancer Invoice** | WEB | 프리랜서 세금계산서/인보이스 자동 생성기 | 💎📦 | 2 | 4 |
| 82 | **Salary Calculator** | WEB | 연봉↔월급↔시급 환산+세후 실수령액 계산 (한국) | 💰 | 1 | 4 |
| 83 | **SaaS Revenue Calculator** | WEB | MRR/ARR/이탈률/LTV 계산+시뮬레이션 | 💰 | 1 | 3 |
| 84 | **Expense Tracker** | EXT | 브라우저에서 지출 빠르게 기록+월간 리포트 | 💎 | 2 | 3 |
| 85 | **CryptoBot** | BOT | 암호화폐 가격 알림+포트폴리오 추적 봇 | 💎 | 2 | 3 |

### 🎬 콘텐츠 (CNT) — 7개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 86 | **Thumbnail Maker** | WEB | 유튜브 썸네일 템플릿 에디터 (텍스트+배경+필터) | 💰💎 | 2 | 5 |
| 87 | **Podcast Transcriber** | WEB | 오디오 업로드 → 자동 텍스트 변환+타임스탬프 | 💎📦 | 3 | 4 |
| 88 | **Short Video Generator** | WEB | 텍스트 입력 → 페이스리스 숏폼 비디오 자동 생성 | 💎📦 | 4 | 5 |
| 89 | **RSS to Newsletter API** | API | RSS 피드 → 이메일 뉴스레터 자동 변환 API | 🔑📦 | 3 | 3 |
| 90 | **Reading Mode** | EXT | 웹페이지 → 깔끔한 읽기 모드 (커스텀 폰트/테마) | 💎 | 2 | 3 |
| 91 | **blogctl** | CLI | 마크다운→정적 블로그 생성+배포 CLI | 🛒 | 3 | 3 |
| 92 | **NewsBot** | BOT | 관심 키워드 뉴스 큐레이션+요약 봇 | 💎📦 | 3 | 4 |

### 💬 커뮤니케이션 (COM) — 5개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 93 | **Email Signature Generator** | WEB | 전문 이메일 서명 HTML 생성기 | 💰💎 | 1 | 3 |
| 94 | **Webhook Relay API** | API | 웹훅 수신→변환→다중 채널 전달 API | 🔑📦 | 3 | 4 |
| 95 | **Gmail Quick Reply** | EXT | 이메일에 AI 기반 빠른 답장 템플릿 제안 | 💎 | 3 | 4 |
| 96 | **AnonymousBot** | BOT | 익명 메시지 전달 봇 (피드백/제보 수집) | 💰 | 2 | 3 |
| 97 | **PollBot** | BOT | 고급 투표/설문 생성+결과분석 봇 | 💎 | 2 | 3 |

### 🎯 보너스: 크로스카테고리 서비스 — 3개

| # | 이름 | 형태 | 한줄 설명 | 수익모델 | 난이도 | 트렌드 |
|---|------|------|-----------|----------|--------|--------|
| 98 | **Digital Business Card** | WEB | 디지털 명함 생성+QR+NFC 연동 | 💎📦 | 2 | 4 |
| 99 | **Online Fax** | WEB | 계정 없이 건당 결제 온라인 팩스 서비스 | 🛒 | 3 | 3 |
| 100 | **SaaS Starter Kit** | WEB | 한국형 SaaS 보일러플레이트 (카카오+토스+Next.js) | 🛒 | 4 | 5 |

---

### 요약 통계

| 형태 | 수량 | 평균 난이도 | 양산 용이성 |
|------|------|-------------|-------------|
| 웹앱 (WEB) | 42개 | 1.8 | ⭐⭐⭐⭐⭐ |
| API | 14개 | 3.1 | ⭐⭐⭐ |
| 크롬확장 (EXT) | 18개 | 2.2 | ⭐⭐⭐⭐ |
| CLI | 8개 | 1.9 | ⭐⭐⭐⭐ |
| 텔레그램봇 (BOT) | 14개 | 2.4 | ⭐⭐⭐⭐ |
| 모바일앱 (APP) | 2개 | 3.0 | ⭐⭐ |
| 무료 도구형 (난이도 1) | 22개 | — | 즉시 양산 가능 |

---

## Part 4: 우선순위 TOP 20 상세

### 우선순위 점수 = (6-난이도) × 트렌드 × 수익잠재력(1-3)

| 순위 | # | 이름 | 점수 | 예상 MRR | 착수 시간 |
|------|---|------|------|----------|-----------|
| 1 | 6 | Banner Genie API | 45 | $3-15K | 3주 |
| 2 | 3 | App Screenshot Studio | 40 | $2-8K | 구현 중 |
| 3 | 1 | OG Image Forge | 40 | $1-5K | 1주 |
| 4 | 37 | Web Screenshot API | 40 | $2-8K | 2주 |
| 5 | 100 | SaaS Starter Kit | 35 | $5-20K | 6주 |
| 6 | 14 | PDF to Excel Pro | 35 | $5-16K | 4주 |
| 7 | 88 | Short Video Generator | 35 | $5-20K | 6주 |
| 8 | 77 | Uptime Monitor API | 35 | $2-8K | 4주 |
| 9 | 23 | AI Headshot Pro | 30 | $3-10K | 4주 |
| 10 | 86 | Thumbnail Maker | 30 | $1-5K | 2주 |
| 11 | 51 | Product Image Enhancer | 30 | $2-8K | 3주 |
| 12 | 64 | Scoreboard Live | 28 | $3-10K | 4주 |
| 13 | 2 | Bulk Image Resizer | 27 | $0.5-2K | 3일 |
| 14 | 72 | QR Code Generator | 27 | $0.5-2K | 3일 |
| 15 | 29 | Tab Summarizer | 27 | $1-3K | 2주 |
| 16 | 44 | Hashtag Generator | 25 | $0.5-2K | 3일 |
| 17 | 45 | Social Card Preview | 25 | $0.5-1K | 3일 |
| 18 | 81 | Freelancer Invoice | 24 | $1-5K | 2주 |
| 19 | 82 | Salary Calculator | 24 | $0.5-2K | 2일 |
| 20 | 98 | Digital Business Card | 24 | $1-3K | 2주 |

---

### TOP 20 상세 기획

#### 🥇 1위: Banner Genie API (#6)

**컨셉:** 템플릿 기반 이미지 자동 생성 REST API. HTML/CSS 템플릿 → Puppeteer 렌더링 → 이미지 반환.

**시장 검증:**
- Bannerbear: $630K ARR, 1인 운영
- ScreenshotOne: $8.5K/월
- DynaPictures, Placid.app 등 경쟁 존재

**기술 스택:** Node.js + Puppeteer + Express + Stripe
**인프라:** MiniPC (Playwright 설치됨)
**수익 모델:**
- Free: 50 이미지/월
- Starter: $29/월 (500 이미지)
- Pro: $79/월 (3,000 이미지)
- Enterprise: $199/월 (무제한)

**구현 계획:**
1. 주 1: 코어 API (HTML→이미지 렌더링)
2. 주 2: 템플릿 시스템 + 대시보드
3. 주 3: 결제 통합 + 문서화
4. 주 4: Product Hunt 런칭

**차별화:** 한국/일본 현지화, CJK 폰트 최적화, OG 이미지+배너+소셜카드 올인원

---

#### 🥈 2위: App Screenshot Studio (#3)

**컨셉:** 앱 스크린샷 업로드 → 디바이스 프레임+배경+텍스트 자동 합성 → 앱스토어 제출용

**시장 검증:**
- AppScreens: AppSumo 핫딜
- AppLaunchpad: $83/월
- 레딧 "스크린샷 제작은 고문" 반복 언급

**상태:** 이미 구현 중 (screenshot-tool/)
**추가 필요:** 웹 UI, 프리미엄 기능, 결제

---

#### 🥉 3위: OG Image Forge (#1)

**컨셉:** URL 또는 파라미터 입력 → OG 이미지 자동 생성. 블로그/랜딩페이지용.

**시장 검증:**
- Vercel OG: 무료이나 제한적
- "og image generator" 검색량 꾸준히 증가
- Keepthescore가 OG 이미지 API에 $180/월 지출

**기술 스택:** HTML5 단일 파일 (프론트) + API 백엔드 (선택)
**구현 시간:** 1주
**수익 모델:** 무료 기본 (로고 워터마크) + $9/월 프리미엄 (워터마크 제거, API 접근)

---

#### 4위: Web Screenshot API (#37)

**컨셉:** URL → 풀페이지/요소/모바일 스크린샷 REST API

**시장 검증:** APIFlash, ScreenshotOne 등 $5-10K/월
**인프라:** MiniPC Playwright 즉시 활용
**구현 시간:** 2주
**가격:** $0.01/스크린샷, 월 구독 $19-$99

---

#### 5위: SaaS Starter Kit (#100)

**컨셉:** 한국형 SaaS 보일러플레이트. 카카오 로그인+토스 결제+Next.js+Supabase.

**시장 검증:** ShipFast $75K MRR, 7,621 구매자
**차별화:** 한국 결제/인증 통합 (유일)
**가격:** $199 일회성 + $99/년 업데이트
**구현 시간:** 6주

---

#### 6위: PDF to Excel Pro (#14)

**컨셉:** 은행명세서/인보이스 PDF → 구조화된 Excel/CSV

**시장 검증:** BankStatementConverter $16K/월
**기술:** Python + PyMuPDF + AI (Gemini) 파싱
**차별화:** 한국 은행 명세서 특화 (퍼스트 무버)
**가격:** 5페이지 무료 + $15-$50/월 구독

---

#### 7위: Short Video Generator (#88)

**컨셉:** 텍스트 → 스크립트 → 이미지+TTS → 숏폼 비디오 자동 생성

**시장 검증:** StoryShort.ai $20K/월
**인프라:** MiniPC Remotion + TTS + 이미지 생성
**차별화:** 한국어 TTS/자막 최적화
**가격:** $19-$79/월 구독

---

#### 8위: Uptime Monitor API (#77)

**컨셉:** 웹사이트 업타임 체크 + 알림 (이메일/슬랙/텔레그램)

**시장 검증:** UptimeRobot 가격 425% 인상 → 대안 수요 폭발
**기술:** Python/Node + 크론 체커 + 알림
**가격:** 5사이트 무료 + $9-$49/월

---

#### 9위: AI Headshot Pro (#23)

**컨셉:** 셀카 업로드 → AI 증명사진/링크드인 프로필 사진 생성

**시장 검증:** HeadshotPro $300K/월
**차별화:** 한국인/아시아인 얼굴 최적화, 증명사진 규격
**인프라:** 맥북 MLX 모델
**가격:** $29-$149 크레딧 기반

---

#### 10위: Thumbnail Maker (#86)

**컨셉:** 유튜브 썸네일 템플릿 에디터. 텍스트+배경+필터+스티커.

**기술:** 브라우저 Canvas API, 서버 불필요
**구현 시간:** 2주
**수익:** 광고 + 프리미엄 템플릿 $5/월

---

#### 11-20위 간략

| 순위 | 서비스 | 핵심 포인트 |
|------|--------|-------------|
| 11 | Product Image Enhancer | 이커머스 셀러 타겟, 쿠팡/네이버 스마트스토어 |
| 12 | Scoreboard Live | Keepthescore 대항마, Flask+WebSocket |
| 13 | Bulk Image Resizer | HTML5 단일파일, 3일 구현, SEO 트래픽 |
| 14 | QR Code Generator | HTML5 단일파일, 3일 구현, 높은 검색량 |
| 15 | Tab Summarizer | 크롬확장, AI 요약, 빠른 개발 |
| 16 | Hashtag Generator | HTML5 단일파일, SNS 마케터 타겟 |
| 17 | Social Card Preview | HTML5 단일파일, 개발자 필수 도구 |
| 18 | Freelancer Invoice | 한국 프리랜서 타겟, 세금계산서 |
| 19 | Salary Calculator | HTML5 단일파일, 한국 특화, 높은 검색량 |
| 20 | Digital Business Card | NFC/QR 연동, 모던 명함 |

---

## Part 5: 양산 실행 계획

### 5.1 양산 유형별 전략

#### Type A: HTML5 단일파일 웹도구 (22개, 난이도 1)

**특징:** 서버 불필요, GitHub Pages/Netlify 무료 호스팅, 게임처럼 양산 가능

**해당 서비스:**
#2, #4, #5, #13, #16, #34, #35, #44, #45, #46, #58, #65, #66, #72, #73, #74, #75, #76, #82, #83, #93, #69

**양산 속도:** 하루 1-2개
**수익화:** Google AdSense + 프리미엄 잠금

**실행:**
```
Week 1-2: 하루 1개씩 14개 제작
Week 3: 나머지 8개 + 포털 페이지 제작
```

#### Type B: 크롬확장 (18개, 난이도 2-3)

**특징:** Chrome Web Store 자체 배포 채널, 70-80% 이익률

**해당 서비스:**
#9, #10, #20, #29, #30, #39, #40, #48, #49, #55, #56, #61, #67, #68, #78, #84, #90, #95

**양산 속도:** 주 1-2개
**수익화:** ExtensionPay + 프리미엄 기능

**실행:**
```
Month 1: 4개 확장 출시 (가장 쉬운 것부터)
Month 2: 4개 추가 + 첫 확장 프리미엄화
Month 3: 나머지 10개 순차 출시
```

#### Type C: 텔레그램 봇/Mini App (14개, 난이도 2-3)

**특징:** 텔레그램 Stars 수익화, 기존 채널 활용

**해당 서비스:**
#12, #22, #32, #33, #50, #57, #62, #63, #70, #80, #85, #92, #96, #97

**양산 속도:** 주 1-2개
**수익화:** Telegram Stars + 프리미엄 기능

**실행:**
```
Month 1: 유틸리티 봇 4개 (PhotoBot, PaperBot, ReminderBot, PollBot)
Month 2: AI 봇 3개 (AskBot, WriterBot, NewsBot)
Month 3: 나머지 7개 순차 출시
```

#### Type D: API 서비스 (14개, 난이도 3-4)

**특징:** B2B, 높은 MRR, 안정적 수익

**해당 서비스:**
#6, #7, #8, #18, #19, #27, #28, #37, #38, #47, #54, #77, #89, #94

**인프라:** MiniPC (메인) + NAS (스토리지)
**양산 속도:** 월 2-3개
**수익화:** API 크레딧 + 월 구독

**실행:**
```
Month 1: Web Screenshot API + Banner Genie API
Month 2: BG Eraser API + Image Upscale API
Month 3-4: 나머지 10개 순차 출시
```

#### Type E: 풀스택 SaaS (2개, 난이도 4-5)

**특징:** 높은 수익 잠재력, 장기 프로젝트

**해당 서비스:**
#88 Short Video Generator, #100 SaaS Starter Kit

**실행:** 별도 프로젝트로 관리, 다른 서비스와 병행

### 5.2 전체 타임라인

```
═══════════════════════════════════════════════════
Phase 1: 기반 구축 (Month 1)
═══════════════════════════════════════════════════
Week 1-2: HTML5 도구 14개 양산
Week 3-4: 크롬확장 4개 + 봇 4개 출시
→ 산출물: 22개 서비스 라이브
→ 예상 수익: $100-500/월 (광고+초기 사용자)

═══════════════════════════════════════════════════
Phase 2: 수익화 (Month 2-3)
═══════════════════════════════════════════════════
- HTML5 도구 나머지 8개 완성 (총 22개)
- API 서비스 4개 출시 (핵심: Banner Genie, Web Screenshot)
- 크롬확장 8개 추가 (총 12개)
- 봇 7개 추가 (총 11개)
→ 산출물: 57개 서비스 라이브
→ 예상 수익: $500-2K/월

═══════════════════════════════════════════════════
Phase 3: 스케일링 (Month 4-6)
═══════════════════════════════════════════════════
- 나머지 크롬확장 6개 + 봇 3개
- API 서비스 10개 추가
- CLI 8개 npm 배포
- SaaS Starter Kit + Short Video Generator 착수
→ 산출물: 100개 서비스 완성
→ 예상 수익: $2-5K/월

═══════════════════════════════════════════════════
Phase 4: 최적화 (Month 7-12)
═══════════════════════════════════════════════════
- TOP 5 서비스에 집중 투자 (SEO, 마케팅)
- 저성과 서비스 정리 또는 피벗
- B2B 영업 시작
→ 목표 수익: $10K/월
```

### 5.3 포털화 전략

**eastsea.monster 통합:**

```
eastsea.monster/
├── /games/        ← 게임 100개 (기존)
├── /tools/        ← 웹 도구 모음 (NEW)
│   ├── /image/    ← 이미지 도구
│   ├── /document/ ← 문서 도구
│   ├── /developer/← 개발자 도구
│   ├── /utility/  ← 유틸리티
│   └── /finance/  ← 금융 도구
├── /api/          ← API 문서+대시보드
├── /extensions/   ← 크롬확장 소개
└── /bots/         ← 텔레그램봇 소개
```

**SEO 전략:**
- 각 도구별 랜딩페이지 (키워드 타겟팅)
- "무료 [도구이름]" 롱테일 SEO
- 도구 디렉토리 등록 (Product Hunt, AlternativeTo, ToolFinder)

### 5.4 인프라 배분

| 인프라 | 용도 | 서비스 |
|--------|------|--------|
| **GitHub Pages** | HTML5 웹도구 (정적) | Type A 22개 |
| **MiniPC** | API 서비스, Playwright | Type D 14개 |
| **NAS** | 스토리지, Docker 서비스 | 백업, 미디어 |
| **맥북** | 이미지 생성 (MLX) | #7 BG Eraser, #8 Upscale, #23 Headshot |
| **Cloudflare Workers** | 엣지 캐싱, 프록시 | 전체 CDN |
| **Stripe** | 결제 | 프리미엄 서비스 |

### 5.5 양산 템플릿

모든 웹도구는 공통 템플릿 사용:

```html
<!-- 공통 구조 -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>[도구이름] - Free Online Tool</title>
  <meta name="description" content="...">
  <!-- OG tags, favicon, analytics -->
  <style>/* 공통 CSS 프레임워크 */</style>
</head>
<body>
  <header><!-- 네비게이션, 로고, 다른 도구 링크 --></header>
  <main><!-- 도구 본체 --></main>
  <footer><!-- 광고, 관련 도구, eastsea.monster 링크 --></footer>
  <script>/* 도구 로직 */</script>
</body>
</html>
```

크롬확장 공통 구조:
```
extension-template/
├── manifest.json     (v3)
├── popup.html/js     (팝업 UI)
├── content.js        (페이지 조작)
├── background.js     (서비스워커)
├── options.html/js   (설정)
└── icons/            (16, 48, 128px)
```

### 5.6 핵심 KPI

| 지표 | 3개월 | 6개월 | 12개월 |
|------|-------|-------|--------|
| 서비스 수 | 57개 | 100개 | 100개 (최적화) |
| 월 방문자 | 10K | 50K | 200K |
| MRR | $500 | $2-5K | $10K |
| 유료 사용자 | 50명 | 200명 | 1,000명 |
| 크롬확장 설치 | 1K | 10K | 50K |
| 봇 사용자 | 500 | 5K | 20K |

---

## 부록: 기존 서비스 현황

| 서비스 | 상태 | 위치 |
|--------|------|------|
| App Screenshot Studio | 구현 중 | screenshot-tool/ |
| 게임 포트폴리오 | 운영 중 | eastsea.monster/games/ |
| 텔레그램 Mini App | 운영 중 | 텔레그램 |

---

*작성: 미스 김 서브에이전트 | 2026-01-31*
*리서치 소스: Reddit, Indie Hackers, Product Hunt, Chrome Web Store, GeekNews, Crunchbase 등 15+ 소스*
