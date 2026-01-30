# 🚀 수익화 원클릭 가이드

**총 예상 소요:** 45분~1시간
**예상 초기 월 수익:** $200-1,000+
**주인님 역할:** 계정 생성 + 제품 등록 → 나머지는 미스 김이 처리

---

## ⚡ 우선순위 순서 (빠른 수익 → 장기 수익)

| # | 채널 | 예상 시간 | 예상 월 수익 | 준비 상태 |
|---|------|-----------|-------------|-----------|
| 1 | Gumroad 3개 제품 | 10분 | $50-200 | ✅ 완료 |
| 2 | Ko-fi 후원 | 3분 | $10-50 | ✅ 가이드 준비 |
| 3 | GameDistribution 게임 등록 | 15분 | $30-300 | ✅ 게임 준비 |
| 4 | CrazyGames 게임 제출 | 10분 | $50-500 | ✅ 게임 준비 |
| 5 | 삼국지 앱스토어 | 15분 | ₩500만 | ✅ 빌드 완료 |
| 6 | ContentForge 환경변수 | 3분 | $0 (2주 뒤 런칭) | ✅ 코드 배포 |
| **합계** | | **~56분** | **$140-1,050+** | |

---

## 📦 1단계: Gumroad 제품 등록 (10분)

### 준비물
- Gumroad 계정 (gumroad.com → Google 로그인)
- PayPal 또는 Stripe 연결

### 제품 A: HTML5 게임 번들 ($29)
1. **Gumroad → New Product**
2. **Name:** `Indie HTML5 Game Bundle: 10 Complete Games`
3. **Price:** $29 (PWYW 최소 $19)
4. **파일:** `products/html5-game-bundle/html5-game-bundle.zip` (98KB)
5. **설명:** `products/html5-game-bundle/GUMROAD_LISTING.md` 복붙
6. **썸네일:** `products/html5-game-bundle/screenshots/` 중 하나
7. **카테고리:** Software / Games
8. **Tags:** html5, game, indie, javascript, source code

### 제품 B: AI Prompt Guide ($19)
1. **Gumroad → New Product**
2. **Name:** `Claude Mastery: 100+ Pro Prompts for Productivity`
3. **Price:** $19
4. **파일:** `products/claude-prompt-guide/claude-mastery-prompts.md` (ZIP 필요)
5. **설명:** `products/claude-prompt-guide/GUMROAD_LISTING.md` 복붙
6. **카테고리:** Education / Productivity

### 제품 C: Notion 템플릿 ($15)
1. **Gumroad → New Product**
2. **Name:** `Ultimate Productivity Bundle for Notion`
3. **Price:** $15
4. **파일:** `products/notion-productivity-bundle/` (ZIP 필요)
5. **설명:** `products/notion-productivity-bundle/GUMROAD_LISTING.md` 복붙

---

## ☕ 2단계: Ko-fi 후원 설정 (3분)

1. **ko-fi.com** → Google 로그인
2. **프로필 설정:** "Jay's Game Arcade" 또는 원하시는 이름
3. **PayPal 연결** (수수료 0%!)
4. **페이지 URL 확인** → 미스 김에게 알려주세요
5. → 미스 김이 모든 게임에 후원 버튼 자동 삽입

**Ko-fi 장점:** 수수료 0%, 즉시 입금, 위젯 임베드 가능

---

## 🎮 3단계: GameDistribution 게임 등록 (15분)

**GameDistribution:** HTML5 게임 전문 광고 네트워크 (가입만 하면 수익 분배)

1. **gamedistribution.com/developers** → 회원가입
2. **이메일 인증** (Gmail 확인)
3. **대시보드 → Add Game** × 5회:

| 게임 | 폴더 |
|------|-------|
| Crystal Match Quest | `games/crystal-match/` |
| Zombie Survivor Town | `games/zombie-survivor-town/` |
| Screw Sort Factory | `games/screw-sort-factory/` |
| Polygon Dungeon Survivor | `games/polygon-dungeon/` |
| Rhythm Pulse | `games/rhythm-pulse/` |

4. 각 게임: ZIP 업로드 + 설명 + 카테고리 + 스크린샷
5. → 미스 김에게 Game ID 알려주시면 SDK 자동 통합

**수익 구조:** 광고 수익 분배 (업계 평균 50-70%). 인터스티셜 + 보상형 비디오.

---

## 🕹️ 4단계: CrazyGames 게임 제출 (10분)

**CrazyGames:** 월 2천만+ 플레이어, HTML5 게임 전문 포탈

1. **developer.crazygames.com** → 회원가입
2. **Submit Game** → TOP 3 게임 제출:

| 게임 | 장르 | 예상 승인률 |
|------|------|-------------|
| Crystal Match Quest | 매치-3 퍼즐 | ⭐⭐⭐⭐⭐ |
| Screw Sort Factory | 소트 퍼즐 | ⭐⭐⭐⭐ |
| Zombie Survivor Town | 서바이벌 | ⭐⭐⭐⭐ |

3. 게임 URL (eastsea.monster/games/xxx/) 또는 ZIP 업로드
4. QA 검토 후 승인 → 자동 수익 분배

**수익 구조:** 광고 수익 분배 + 독점 계약 시 50% 보너스

---

## 📱 5단계: 삼국지 패왕전 앱스토어 출시 (15분)

### iOS (App Store Connect)
1. **appstoreconnect.apple.com** 로그인
2. **My Apps → +** → 새 앱 생성
3. 메타데이터 입력: `specs/store-metadata-ko.md` + `specs/store-metadata-en.md` 참조
4. 스크린샷 업로드: `specs/screenshots/` 폴더
5. **빌드 업로드:** Xcode → Archive → Upload (이미 빌드 완료)
6. **제출** → 심사 (보통 1-3일)

### Android (Google Play Console)
1. **play.google.com/console** 로그인
2. **앱 만들기** → 삼국지 패왕전
3. 메타데이터 + 스크린샷 입력
4. **AAB 업로드** (이미 빌드 완료)
5. **제출** → 심사 (보통 몇 시간)

---

## ⚙️ 6단계: ContentForge 환경변수 (3분)

1. **vercel.com** → contentforge 프로젝트
2. **Settings → Environment Variables**
3. 추가:
   ```
   OPENAI_API_KEY = sk-xxxx (주인님의 OpenAI API 키)
   ```
4. **Redeploy** 클릭
5. → contentforge.vercel.app 작동 시작

---

## 🔜 추후 (급하지 않음)

### Etsy 셀러 등록
- Notion 템플릿 판매용
- 미국 은행 계좌 또는 PayPal 필요

### ProductHunt 출시
- Game Arcade + ContentForge 동시 런칭
- 런칭 자료: `products/producthunt-game-arcade.md`

### Buy Me a Coffee
- Ko-fi와 유사 (수수료 5%)
- Ko-fi 우선 설정 후 추가 고려

### Brave Creators
- BAT 토큰 패시브 수익
- **publishers.basicattentiontoken.org** → 도메인 인증

### Google Search Console
- eastsea.monster SEO 최적화
- **search.google.com/search-console** → 사이트 추가 → sitemap 제출

---

## 🎯 주인님이 하실 일 요약

1. ☐ Gumroad 로그인 → 3개 제품 등록 (10분)
2. ☐ Ko-fi 가입 → URL 알려주기 (3분)
3. ☐ GameDistribution 가입 → 5개 게임 등록 (15분)
4. ☐ CrazyGames 가입 → 3개 게임 제출 (10분)
5. ☐ 삼국지 앱스토어 제출 (15분)
6. ☐ ContentForge 환경변수 (3분)

**"OK" 한마디면 제가 화면 공유로 도와드립니다!** 💋
