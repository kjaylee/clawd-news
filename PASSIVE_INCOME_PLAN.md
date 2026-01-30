# 🎯 불로소득 2000만원 달성 계획

**목표:** 월 2,000만원 패시브 인컴
**담당:** 미스 김 (100% 자율 실행)
**주인님 역할:** 돈 받기

---

## 📊 수익 목표 구조

| 수익원 | 월 목표 | 상태 |
|--------|---------|------|
| 🔥 텔레그램 Mini App | 400만원 | **MVP 완성! 배포 대기** |
| 게임 (삼국지 패왕전) | 500만원 | 앱스토어 대기 |
| 카메라 앱 프리미엄 | 300만원 | 기획 완료 |
| AI SaaS (ContentForge) | 700만원 | MVP 배포 완료 (환경변수 대기) |
| 투자 배당 | 500만원 | 자본 확보 먼저 |
| 디지털 제품 (Gumroad) | 100만원 | 3개 제품 완성 (등록 대기) |
| **합계** | **2,500만원** | |

---

## 🗓️ 실행 로드맵

### Phase 1: 게임 출시 (1-2개월)
- [x] 삼국지 패왕전 코어 완성 (894개 테스트 통과) ✅
- [x] 웹 버전 배포 완료 (GitHub Pages) ✅
- [x] 모바일 앱 빌드 완료 (Capacitor iOS/Android) ✅
- [x] 광고 SDK 연동 (AdMob 테스트 ID) ✅
- [ ] **대기 중:** 앱스토어/플레이스토어 출시 (주인님 개발자 계정)
- [ ] ASO 최적화
- [x] 게임 포트폴리오 34개 (QA 후 정리, 자동 정합성 스크립트 구축) ✅

### Phase 2: 앱 수익화 (2-3개월)
- [x] 카메라 앱 프리미엄 기능 기획 ✅ (2026-01-29)
  - 기획서: `specs/camera-app-premium.md`
  - 하이브리드 모델: 구독 + AI 크레딧 + 필터팩
  - 예상 월 수익: 440만원 (DAU 1만 기준)
- [x] 구독 모델 설계 ✅
  - 주간 ₩2,500 / 월간 ₩6,900 / 연간 ₩49,000 / 평생 ₩129,000
- [ ] 인앱결제 구현
- [ ] 마케팅 자동화

### Phase 3: AI SaaS (3-6개월)
- [x] 시장 조사 완료 (2026-01-29) ✅
- [x] MVP 선정: **ContentForge** (AI 콘텐츠 리퍼포저) ✅
- [x] 기획서 완성 (`specs/ai-saas-mvp.md`) ✅
- [x] MVP 셋업 완료 (2026-01-29 13:06)
  - Next.js 14 프로젝트 생성 ✅
  - GitHub: https://github.com/kjaylee/contentforge ✅
  - Supabase 스키마 완성 ✅
  - 랜딩페이지 완성 ✅
- [x] 핵심 기능 개발 완료 (2026-01-29 13:35)
  - URL 크롤러 (cheerio) ✅
  - Gemini API 연동 (gemini-1.5-flash) ✅
  - API 라우트 (/api/generate) ✅
  - UI 컴포넌트 ✅
- [x] Vercel 배포 완료 (https://contentforge.vercel.app) ✅
- [x] OpenAI API 전환 완료 (2026-01-29 14:05) ✅
  - GPT-4o-mini 사용
  - API 테스트 성공
  - 비용: 요청당 ~$0.0003
- [ ] **대기 중:** Vercel 환경변수 설정 (주인님 수동)
- [ ] 2주 목표 런칭
- [ ] ProductHunt 출시 예정
- [ ] B2B 영업 자동화
- [ ] 구독 수익 구조

### Phase 4: 투자 포트폴리오 (지속)
- [x] 매일 아침 증시 분석 (설정 완료 ✅)
- [x] 배당 ETF 조사 완료 (2026-01-29) ✅
  - 추천: SCHD, SPDR High Dividend, NOBL
  - 현실: 월 500만원 배당 → 원금 5.5~11억 필요
  - **결론: 사업 수익으로 자본 확보 먼저**
- [ ] 투자 추천 → 주인님 승인 → 실행
- [ ] 배당주/ETF 포트폴리오 구축 (자본 확보 후)

### Phase 1.5: 텔레그램 Mini App (신규 — 최우선! 🔥)
- [x] 기획서 완성 (`specs/telegram-mini-app-plan.md`, 15KB) ✅
- [x] 기술 스펙 완성 (`specs/telegram-mini-app-tech.md`, 38KB) ✅
- [x] TOP 5 게임 선정: Spin Village, Crystal Match, Screw Sort, Slime Survivor, Idle Slime Merge ✅
- [x] TG SDK 래퍼 구현 (`games/tg-sdk-wrapper.js`) ✅
- [x] 게임 런처 구현 (`games/tg-launcher/index.html` — 42게임 카탈로그) ✅
- [x] TOP 5 게임 TG SDK 적용 (공유/점수/뒤로가기) ✅
- [x] Express 봇 서버 (`telegram-miniapp/`) ✅
  - Stars 결제 핸들러, SQLite DB, initData 인증
  - 19종 상품 카탈로그
- [x] Git push 완료 ✅
- [ ] **진행 중:** safe area 수정 (주인님 직접 작업 중)
- [ ] BotFather 토큰 설정 → 봇 라이브 배포
- [x] 전체 게임 TG SDK 일괄 적용 (2026-01-30 10:30) ✅
  - 전체 33게임 TG Mini App SDK 호환 완료 (QA 후 정리)
  - 쉘 스크립트 자동화 (서브에이전트 비용 0)
- [ ] Stars 결제 실서비스 테스트
- [ ] 바이럴 메카닉 (초대 보상, 공유)
- [ ] 텔레그램 디렉토리/채널 유입
- **예상 수익:** 보수적 $3,000/월 → 낙관적 $21,000~$60,000/월 (12개월)
- **핵심 장점:** 주인님 계정 블록 최소화! (앱스토어/Gumroad 불필요)

### Phase 5: 디지털 제품 판매 (신규)
- [x] 게임 번들 패키지 준비 (2026-01-29 16:06) ✅
  - 10개 HTML5 게임 선별
  - ZIP 파일 생성 (98KB)
  - README + Gumroad 리스팅 문서
  - 경로: `/Users/kjaylee/clawd/products/html5-game-bundle/`
- [ ] **대기 중:** Gumroad 제품 등록 (주인님 계정 필요)
- [x] 스크린샷 10개 캡처 완료 ✅
- [x] 블로그 SEO 포스트 작성 (2026-01-29 17:00) ✅
  - 38개 게임 소개 글
  - eastsea.monster/games/ 트래픽 유입용
- [x] ProductHunt 출시 준비 (2026-01-29 17:00) ✅
  - 런칭 자료: `products/producthunt-game-arcade.md`
  - 태그라인, 설명문, 첫 코멘트, 체크리스트
- [x] AI Prompt Guide 완성 (2026-01-29 17:40) ✅
  - "Claude Mastery: 100+ Pro Prompts"
  - 가격: $19
  - 5700줄 가이드 (6개 카테고리, 107개 프롬프트)
  - 경로: `products/claude-prompt-guide/`
- [ ] **대기 중:** AI Prompt Guide Gumroad 등록 (주인님 계정 필요)
- [ ] Gumroad 마케팅 자동화
- [ ] ProductHunt 실제 출시 (주인님 계정 필요)
- [ ] 추가 디지털 제품 기획 (템플릿, 강좌 등)

---

## 📈 진행 상황

### 2026-01-28
- 계획 수립 완료
- 삼국지 패왕전 75% → 완성 목표
- 아침 5시 증시 브리핑 cron 설정됨

### 2026-01-29
- 삼국지 패왕전 코어 완성 (75% → 95%)
- 웹 배포 완료 (https://kjaylee.github.io/three-kingdoms-warlord/)
- 모바일 빌드 완료 (iOS 빌드 성공, Android 프로젝트 생성)
- 스토어 메타데이터 완성 (한/영 양쪽)
- ASO 키워드 분석 완료
- 스토어 제출 체크리스트 작성
- ContentForge MVP 개발→배포 완료
- 카메라 앱 프리미엄 기획 완료
- 디지털 제품 3개 완성 (게임번들, 프롬프트가이드, 노션번들)
- Etsy/Medium 멀티플랫폼 준비
- 게임 포트폴리오 32→42개
- RAG 시맨틱 검색 완성

### 2026-01-30
- 🔥 **전환점: 텔레그램 Mini App 최우선 프로젝트로 격상!**
- 주인님이 08:08 텔레그램 수익화 관심 → 직접 핸즈온 시작
- **Mini App Phase 1 MVP 완성** (기획→구현→배포 6시간)
  - TG SDK 래퍼 + 런처 + 봇 서버 + TOP 5 게임 변환
  - @eastsea_games_bot + https://eastsea.monster/games/tg-launcher/
- 게임 QA + 중복/저퀄 제거 (45→33개, 주인님 직접 핸즈온)
  - 중복: color-sort/ball-sort, rhythm-runner/rhythm-pulse, stack-kingdom/infinite-stack-climb
  - 저퀄/의미불명: screw-sort-factory, merge-rush, merge-tower, slide-block-match, match-3d-zen, zen-tile-match 등
  - 네온 스네이크 즉사 버그 수정
- SEO 완비 (OG 이미지 33개 + sitemap + meta)
- PWA 설정 완료 (manifest + SW + 아이콘)
- 마케팅 콘텐츠 6종 준비 완료 (Reddit/HN/DevTo/Twitter/TG/IH)
- **블록 5개 유지:** BotFather, Gumroad, Vercel, 앱스토어, Etsy

---

## 💰 수익 추적

| 월 | 게임 | 앱 | SaaS | 투자 | 합계 |
|----|------|-----|------|------|------|
| 2026-02 | - | - | - | - | - |
| 2026-03 | - | - | - | - | - |

---

*미스 김이 알아서 합니다. 주인님은 보고만 받으세요.* 💋
