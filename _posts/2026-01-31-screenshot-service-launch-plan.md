---
title: "앱스토어 스크린샷 생성기 — SaaS 런칭 전략"
date: 2026-01-31
categories: [docs, planning]
tags: [스크린샷, SaaS, 런칭]
layout: post
---

# 📱 앱스토어 스크린샷 생성기 — SaaS 런칭 전략

> 작성일: 2026-01-31
> 대상: Flask 기반 앱스토어 스크린샷 자동 생성 웹 서비스 (`screenshot-tool/`)
> 목표: 1인 사업자 비용 최소화 + 빠른 시장 진입

---

## 📊 경쟁사 분석

### 주요 경쟁 서비스 & 가격

| 서비스 | 무료 티어 | 월 구독 | 연간 | 특징 |
|--------|---------|---------|------|------|
| **AppScreens** | ✅ 제한적 | $24/월 | $6.95/월 | 반응형 디자인, AI 생성, 다국어 |
| **Screenshots.pro** | ✅ 제한적 | $19~$59/월 | $149~$379/년 | 파노라마, 자동 번역, 고급 커스텀 |
| **AppLaunchpad** | ✅ 제한적 | $29/월 | $15/월(연간) | 대형 템플릿 라이브러리, 영감 허브 |
| **App-Mockup** | ✅ | $19/월 or 일회성 | $59~$199 팩 | 템플릿 팩 판매, 구독 없음 |
| **Placeit** | 제한적 | $14.95/월 | $7.47/월(연간) | 범용 목업 플랫폼 |
| **Previewed** | 제한적 | $12/월 | - | 비디오 프리뷰 전문, 3D 목업 |
| **AppScreenshots** | ✅ (가입 불필요) | 무료 | - | 2024 런칭, 심플, 무료 모델 |
| **Rotato** | - | - | $49 일회성 | Mac 전용, 3D 렌더링 |
| **App Store Screenshot Studio** | - | $6.99/월 | $45/년 or $79.99 평생 | Mac/iPad 앱, ASC 직접 업로드 |

### 🔑 시장 인사이트
- 인디 개발자들은 **$25/월 구독에 강한 거부감** (Reddit 반복 불만)
- "무료로 만들고 내보내기 할 때 결제" 모델에 대한 분노 다수
- **Canva 같은 범용 도구로 대체**하는 개발자 많음
- 핵심 니즈: "빠르고, 싸고, 정확한 사이즈로 깔끔하게"

### 🎯 우리의 차별화 포인트
1. **즉시 사용 가능** — 회원가입 없이 바로 생성
2. **투명한 가격** — 무료 티어가 실제로 쓸만함
3. **다국어 자동화** — YAML 기반 로케일 시스템 (이미 구현)
4. **오픈소스 접근** — 셀프호스팅 가능 (커뮤니티 구축)

---

## 1. 🖥️ 배포/호스팅 옵션

### 추천 순위

#### 🥇 1순위: Railway (초기 런칭)
| 항목 | 내용 |
|------|------|
| **비용** | $5/월 (Hobby, $5 크레딧 포함 → 실질 무료~소액) |
| **장점** | GitHub 연동 자동 배포, Dockerfile 지원, 빠른 셋업 |
| **단점** | $5 초과 시 과금, 무료 플랜 없음 |
| **Pillow 호환** | ✅ Docker 컨테이너로 완전 호환 |
| **적합도** | ⭐⭐⭐⭐⭐ Flask + Pillow에 최적 |

#### 🥈 2순위: Google Cloud Run (스케일업)
| 항목 | 내용 |
|------|------|
| **비용** | 무료 티어 넉넉 (월 200만 요청, 360K vCPU-초) + $300 크레딧 |
| **장점** | 요청당 과금, 자동 스케일링, 안정성 |
| **단점** | 초기 설정 복잡, Cold start (~1초) |
| **Pillow 호환** | ✅ Docker 이미지로 완전 호환 |
| **적합도** | ⭐⭐⭐⭐ 트래픽 증가 시 이전 추천 |

#### 🥉 3순위: Render
| 항목 | 내용 |
|------|------|
| **비용** | 무료 플랜 (0.5GB RAM, 자동 슬립) / $7/월 Starter |
| **장점** | Git push 자동 배포, Blueprint IaC |
| **단점** | 무료 플랜: 50초+ Cold start (실사용 불가) |
| **Pillow 호환** | ✅ Docker/Native 모두 지원 |
| **적합도** | ⭐⭐⭐ 무료 테스트용으로만 |

#### 참고: Fly.io
| 항목 | 내용 |
|------|------|
| **비용** | $5/월 Hobby ($5 크레딧 포함) |
| **장점** | 글로벌 엣지, CLI 중심 |
| **단점** | CLI 학습 필요, 무료 티어 폐지 |
| **적합도** | ⭐⭐⭐ Railway와 유사하나 설정 복잡 |

#### 참고: 자체 서버 (MiniPC)
| 항목 | 내용 |
|------|------|
| **비용** | $0 (이미 보유, 전기 + 인터넷만) |
| **장점** | 완전한 제어, 무제한 리소스 |
| **단점** | HTTPS 설정 필요, 업타임 보장 어려움, Tailscale 제한 |
| **적합도** | ⭐⭐⭐ 개발/스테이징용으로 적합 |

### 💡 추천 전략 (비용 최소화)
```
Phase 1 (0~3개월): Railway $5/월 — 빠른 런칭, 검증
Phase 2 (3~6개월): Google Cloud Run — 트래픽 증가 대응
Phase 3 (6개월+): 트래픽에 따라 VPS($5/월) 또는 Cloud Run 유지
```

### Dockerfile 예시
```dockerfile
FROM python:3.11-slim

# Pillow 의존성
RUN apt-get update && apt-get install -y \
    libjpeg62-turbo-dev zlib1g-dev libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app
```

---

## 2. 🏷️ 도메인/브랜딩

### 서비스 이름 후보 (15개)

| 이름 | .com | .app | .io | 특징 |
|------|------|------|-----|------|
| **ScreenCraft** | 확인필요 | ✅ 가능성↑ | 확인필요 | 직관적, 기억하기 쉬움 |
| **ShotForge** | 확인필요 | ✅ | ✅ | "forge" = 단조, 제작 느낌 |
| **AppShots** | 확인필요 | ✅ | 확인필요 | 짧고 명확 |
| **ScreenSnap** | 확인필요 | ✅ | 확인필요 | 스냅 = 빠른 생성 |
| **Frameshot** | 확인필요 | ✅ | ✅ | 프레임 + 스크린샷 |
| **Shotly** | 확인필요 | ✅ | 확인필요 | -ly 접미사 트렌드 |
| **SnapStore** | 확인필요 | ✅ | 확인필요 | 스냅 + 스토어 |
| **MockShot** | ✅ 가능성↑ | ✅ | ✅ | 목업 + 스크린샷 |
| **AppFrame** | 확인필요 | ✅ | 확인필요 | 앱 + 프레임 |
| **ScreenForge** | ✅ 가능성↑ | ✅ | ✅ | 스크린 + 단조 |
| **QuickShots** | 확인필요 | ✅ | 확인필요 | 빠른 생성 강조 |
| **ShotStack** | 확인필요 | ✅ | 확인필요 | 다중 스크린샷 |
| **AppCanvas** | 확인필요 | ✅ | 확인필요 | 캔버스 느낌 |
| **ScreenDrop** | ✅ 가능성↑ | ✅ | ✅ | 드래그앤드롭 느낌 |
| **LaunchShot** | ✅ 가능성↑ | ✅ | ✅ | 런칭 + 스크린샷 |

### 도메인 가용성 체크 방법
1. **Namecheap** (namecheap.com) — 실시간 검색, 최저가
2. **Porkbun** (porkbun.com) — .app/.io 저렴
3. **Cloudflare Registrar** — 원가 판매, HTTPS 무료
4. **도메인 가격 참고**: .com ~$10/년, .app ~$14/년, .io ~$30/년

### 📌 추천: `.app` 도메인
- HTTPS 강제 (보안 이미지)
- 앱 관련 서비스에 적합
- .com 대비 가용성 높음
- 가격 합리적 ($14/년)

### 랜딩 페이지 구성

```
[Hero Section]
- 한 줄 카피: "30초 만에 앱스토어 스크린샷 완성"
- 서브: "디자이너 없이도 프로급 스크린샷. 무료로 시작하세요."
- CTA 버튼: "지금 무료로 만들기" → 에디터로 이동
- 히어로 이미지: 생성 전후 비교 GIF

[Feature Section]
- ✅ 디바이스 프레임 자동 적용
- ✅ 다국어 자동 생성
- ✅ App Store & Google Play 규격
- ✅ 배경/텍스트 커스텀
- ✅ 일괄 다운로드 (ZIP)

[Demo Section]
- 인터랙티브 데모 또는 30초 영상

[Pricing Section]
- 간결한 가격표 (아래 섹션 참고)

[Testimonials / Social Proof]
- 초기에는 "N명의 개발자가 사용 중" 카운터
- Product Hunt 배지

[FAQ]
- "무료인가요?" → 기본 무료
- "회원가입 필요한가요?" → 아니요
- "어떤 디바이스를 지원하나요?" → iPhone, iPad, Android...

[Footer]
- 이용약관, 프라이버시, 연락처
```

---

## 3. 💰 수익화 모델

### 경쟁사 가격 요약
| 모델 | 서비스 | 가격 |
|------|--------|------|
| Freemium + 월구독 | AppScreens | 무료 → $6.95~$24/월 |
| Freemium + 월구독 | Screenshots.pro | 무료 → $19~$59/월 |
| Freemium + 월구독 | AppLaunchpad | 무료 → $15~$29/월 |
| 일회성 템플릿 팩 | App-Mockup | $10~$199 |
| 평생 라이선스 | App Store Screenshot Studio | $79.99 |
| 완전 무료 | AppScreenshots.net | 무료 |

### 🎯 추천 가격 전략: "Generous Freemium + Low-Cost Pro"

**핵심 원칙**: 경쟁사보다 넉넉한 무료 + 경쟁사보다 저렴한 유료

#### 무료 플랜 (Free)
- 월 5세트 생성 (세트 = 1앱 × 모든 디바이스)
- 워터마크 없음 (경쟁사와 차별화!)
- 기본 템플릿 5종
- 1개 언어

#### 프로 플랜 (Pro) — **$9/월** 또는 **$59/년** ($4.92/월)
- 무제한 생성
- 전체 템플릿
- 다국어 자동 생성
- 커스텀 폰트
- 우선 렌더링
- ZIP 일괄 다운로드

#### 비즈니스 플랜 (Business) — **$29/월** 또는 **$199/년** ($16.58/월)
- Pro 전부 포함
- API 액세스
- 팀 멤버 (최대 5명)
- 화이트라벨 (로고 제거)
- 우선 지원

#### 가격 근거
- **$9/월**: 경쟁사 최저($12~$24)보다 저렴 → 가격 민감한 인디 개발자 유치
- **연간 할인 45%**: 연간 결제 유도 → 안정적 수입
- **무료 워터마크 없음**: 경쟁사 불만 1위 해소 → 바이럴 효과
- **$29 비즈니스**: 에이전시/팀용, API가 핵심 차별점

#### 💡 런칭 프로모션
- **첫 100명 Early Bird**: Pro 평생 $49 (일회성)
- **Product Hunt 런칭 특가**: Pro 연간 50% 할인 ($29.50/년)

---

## 4. 📢 런칭 채널

### 4-1. Product Hunt 런칭 전략

#### 타이밍
- **요일**: 화요일~목요일 (경쟁 적절, 트래픽 많음)
- **시간**: 태평양 시간 00:01 (한국 시간 17:01) — 하루 최대 노출
- **피해야 할 날**: 대형 테크 기업 발표일, 공휴일

#### 런칭 전 준비 (2~4주 전)
1. **Product Hunt 계정 활성화** — 다른 제품 업보트/댓글로 신뢰도 쌓기
2. **Hunter 확보** — 팔로워 많은 헌터에게 연락 (필수는 아님, 셀프 런칭 OK)
3. **서포터 리스트** — 최소 50명 사전 확보 (이메일, DM)
4. **에셋 준비**:
   - 로고 (240×240)
   - 갤러리 이미지 3~5장 (1270×760)
   - 30초 데모 영상 (선택, 강력 추천)
   - 태그라인 (60자 이내): "Create pro app store screenshots in 30 seconds — free"
   - Maker Comment (첫 댓글): 개인 스토리 + 왜 만들었는지

#### 런칭일 행동
1. 00:01 런칭 게시
2. Maker Comment 즉시 작성
3. 서포터들에게 알림 (이메일 + 소셜)
4. 모든 댓글에 30분 내 답변
5. Twitter/X에 실시간 업데이트
6. **웹사이트에 PH 임베드 배지** 설치

### 4-2. Reddit 전략
| 서브레딧 | 규칙 | 접근법 |
|----------|------|--------|
| r/SideProject | 셀프 프로모 OK | "Show My Project" 형식 |
| r/iOSProgramming | 유용한 도구 공유 OK | "개발 과정 + 도구 공유" |
| r/androiddev | 셀프 프로모 주의 | "Google Play 스크린샷 팁" 글에 자연스럽게 |
| r/startups | Share Your Startup 스레드 | 주간 스레드 활용 |
| r/IndieDev | 인디 친화적 | 빌딩 과정 공유 |
| r/webdev | 기술 내용 위주 | "Flask로 SaaS 만든 경험" |

**⚠️ Reddit 주의사항**
- 노골적 광고 = 즉시 삭제 + 밴
- **먼저 커뮤니티에 기여** (2주+) → 그 후 자연스럽게 공유
- "Ask HN/Reddit" 형식: "앱스토어 스크린샷 어떻게 만드세요?" → 댓글에서 소개

### 4-3. Hacker News (Show HN)
- 제목: "Show HN: Open-source App Store screenshot generator"
- 기술 스택 공유 (Flask, Pillow 등)
- 오픈소스 버전 공개하면 반응 극대화
- 시간: 미국 동부 시간 오전 9~11시

### 4-4. Twitter/X Build in Public
- **#buildinpublic** 해시태그
- 주 2~3회 개발 과정 공유
- 수치 공개: 사용자 수, 생성 횟수, 수익
- 스레드 형식으로 런칭 스토리 공유

### 4-5. Indie Hackers
- Product 페이지 생성
- 런칭 일지 (Milestone) 작성
- "어떻게 $X MRR 달성했는지" 형식 인기

### 4-6. 기타 채널
- **Dev.to** — 기술 블로그 (Flask로 SaaS 만들기)
- **Appsumo** — 평생 라이선스 딜 (트래픽 폭발, 마진 낮음)
- **X (Twitter) Ads** — 소액 ($5/일) 타겟 광고 테스트
- **YouTube** — "How to make app store screenshots" 튜토리얼

### 4-7. SEO 키워드 전략

#### 주요 타겟 키워드
| 키워드 | 검색량 (추정) | 경쟁도 | 우선순위 |
|--------|-------------|--------|---------|
| app store screenshot generator | 높음 | 높음 | ⭐⭐⭐⭐⭐ |
| app store screenshot generator free | 중간 | 중간 | ⭐⭐⭐⭐⭐ |
| app screenshot maker | 중간 | 중간 | ⭐⭐⭐⭐ |
| google play screenshot generator | 중간 | 낮음 | ⭐⭐⭐⭐ |
| app mockup generator online | 중간 | 높음 | ⭐⭐⭐ |
| iphone screenshot mockup | 높음 | 높음 | ⭐⭐⭐ |
| app store screenshot size | 높음 | 낮음 | ⭐⭐⭐⭐ (블로그) |
| app store screenshot template | 중간 | 중간 | ⭐⭐⭐⭐ |
| ASO screenshot best practices | 낮음 | 낮음 | ⭐⭐⭐ (블로그) |

#### SEO 콘텐츠 전략
1. **블로그 5개 작성** (런칭 전):
   - "App Store Screenshot Size Guide 2025 (Complete Reference)"
   - "How to Create App Store Screenshots Without a Designer"
   - "Best Free App Screenshot Generators Compared"
   - "Google Play Screenshot Requirements & Best Practices"
   - "App Store Screenshot Tips That Actually Increase Downloads"
2. **각 블로그에 CTA**: "Try our free screenshot generator"
3. **기술 SEO**: sitemap.xml, robots.txt, Open Graph 메타, JSON-LD

---

## 5. ✅ 런칭 전 준비물 체크리스트

### Phase 0: 기술 준비 (1~2주)
- [ ] **Dockerfile 작성** + 로컬 테스트
- [ ] **gunicorn** 설정 (Flask 프로덕션 서버)
- [ ] **환경변수** 분리 (SECRET_KEY, PORT 등)
- [ ] **HTTPS 설정** (Railway/Cloud Run 자동 or Cloudflare)
- [ ] **파일 업로드 보안**
  - 허용 확장자 제한 (.png, .jpg, .jpeg만)
  - 파일 크기 제한 (10MB)
  - 파일명 sanitize (uuid로 변환)
  - 업로드 후 자동 삭제 (1시간)
- [ ] **Rate Limiting** 설정
  - Flask-Limiter: 무료 유저 5요청/분, Pro 30요청/분
  - IP 기반 + API키 기반
- [ ] **에러 모니터링** — Sentry 무료 플랜 (월 5K 이벤트)
- [ ] **Analytics** — Plausible ($0, 셀프호스팅) 또는 Umami (무료)
  - Google Analytics 대안: 프라이버시 친화적, GDPR 준수

### Phase 1: 제품 완성 (1~2주)
- [ ] **사용자 인증** (선택사항, Pro 플랜용)
  - 옵션 A: Flask-Login + 이메일/비밀번호
  - 옵션 B: OAuth (Google/GitHub 로그인) — 권장
  - 옵션 C: Supabase Auth (무료, 50K MAU)
- [ ] **결제 연동**
  - **Lemon Squeezy** (최우선 추천)
    - MoR (Merchant of Record) — 세금 자동 처리
    - 수수료: 5% + $0.50/건
    - 어필리에이트 프로그램 내장
    - 글로벌 세금 준수 자동
  - Stripe (대안): 2.9% + $0.30, 세금 직접 처리 필요
  - Gumroad (대안): 10% + 결제 수수료, 가장 심플
- [ ] **사용량 트래킹** — 무료 유저 월간 생성 횟수 카운트
- [ ] **ZIP 다운로드** 기능 (이미 구현됨 ✅)

### Phase 2: 마케팅 에셋 (1주)
- [ ] **랜딩 페이지** 제작
  - 별도 제작 또는 현재 Flask 앱에 통합
  - 옵션: Carrd ($19/년), 직접 제작 (추천)
- [ ] **데모 영상/GIF** (30초)
  - 스크린샷 업로드 → 디바이스 선택 → 텍스트 입력 → 다운로드
  - 도구: MiniPC Remotion 또는 OBS 녹화
- [ ] **가격 페이지** — 3 플랜 비교표
- [ ] **이용약관** 생성
  - Termly.io (무료) 또는 직접 작성
- [ ] **프라이버시 정책** 생성
  - 업로드 이미지: 1시간 후 자동 삭제 명시
  - 쿠키: 최소 사용
- [ ] **로고 + 파비콘** 제작

### Phase 3: 런칭 인프라 (1주)
- [ ] **이메일 수집** (웨이팅 리스트)
  - Buttondown (무료, 100구독자) 또는 Mailchimp (무료, 500)
  - 랜딩 페이지에 "런칭 알림 받기" 폼
- [ ] **소셜 계정 생성**
  - Twitter/X: @서비스이름
  - Product Hunt: 제품 페이지 사전 등록
  - Indie Hackers: 제품 등록
- [ ] **GitHub 공개 레포** (오픈소스 버전)
  - Core 엔진 공개, Pro 기능은 SaaS 전용
  - README에 SaaS 링크 → 오가닉 트래픽
- [ ] **Railway 배포** + 도메인 연결
- [ ] **DNS + HTTPS** 확인

### Phase 4: 런칭! (D-Day)
- [ ] Product Hunt 게시
- [ ] Reddit 3곳 게시 (시간 간격 두고)
- [ ] Twitter/X 런칭 스레드
- [ ] Hacker News Show HN
- [ ] Indie Hackers 런칭 일지
- [ ] 이메일 웨이팅 리스트 알림 발송

---

## 6. 🔧 기술적 준비 상세

### HTTPS
- **Railway/Cloud Run**: 자동 HTTPS (추가 설정 불필요)
- **커스텀 도메인**: Cloudflare DNS (무료) → 자동 HTTPS
- **MiniPC 자체 호스팅 시**: Let's Encrypt + Certbot

### 사용자 인증 추천 구현
```python
# Flask-Login + OAuth (Google) 최소 구현
# 1. pip install Flask-Login Flask-OAuthlib
# 2. Google Cloud Console에서 OAuth 클라이언트 생성
# 3. 세션 기반 인증

# 또는 더 심플하게:
# Supabase Auth (무료, JS SDK) + Flask API
```

### Rate Limiting
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",  # Redis for production
)

@app.route('/api/generate')
@limiter.limit("5 per minute")  # Free tier
def generate():
    ...
```

### 파일 업로드 보안
```python
import uuid
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_upload(file):
    if not allowed_file(file.filename):
        abort(400, "허용되지 않는 파일 형식")
    # UUID 파일명으로 변환 (경로 탐색 방지)
    ext = file.filename.rsplit('.', 1)[1].lower()
    safe_name = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, safe_name)
    file.save(filepath)
    return filepath
```

### 에러 모니터링 (Sentry)
```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    integrations=[FlaskIntegration()],
    traces_sample_rate=0.1,
)
```

### Analytics (Umami — 셀프호스팅 무료)
```html
<!-- 헤드에 추가 -->
<script async src="https://analytics.yoursite.app/script.js"
        data-website-id="YOUR-ID"></script>
```

---

## 7. 💡 비용 최소화 전략 (1인 사업자)

### 월간 예상 비용 (최소)

| 항목 | 비용 | 비고 |
|------|------|------|
| Railway 호스팅 | $5/월 | Hobby 플랜 |
| .app 도메인 | ~$1.2/월 | 연 $14 |
| Cloudflare DNS | $0 | 무료 |
| Lemon Squeezy | 거래당 5%+$0.50 | 사전 비용 없음 |
| Sentry | $0 | 무료 플랜 |
| Analytics (Umami) | $0 | 셀프호스팅 |
| 이메일 (Buttondown) | $0 | 100명까지 무료 |
| **총합** | **~$6.2/월** | |

### 손익분기점
- 월 고정비: ~$6.2
- Pro 구독 1건 ($9/월) → Lemon Squeezy 수수료 후 ~$8 → **구독자 1명이면 흑자**
- 연간 구독 1건 ($59/년) → ~$53 수령 → **9개월치 비용 충당**

### 무료 도구 활용
| 필요 기능 | 무료 도구 |
|-----------|----------|
| 결제 | Lemon Squeezy (거래 시에만 수수료) |
| 인증 | Supabase Auth (50K MAU 무료) |
| 에러 추적 | Sentry (5K 이벤트/월 무료) |
| 분석 | Umami (셀프호스팅) 또는 Plausible Cloud ($0 셀프) |
| 이메일 | Buttondown (100명) / Mailchimp (500명) |
| 디자인 | Figma (무료) / Canva (무료) |
| CI/CD | GitHub Actions (무료) |
| DNS/CDN | Cloudflare (무료) |
| SSL | 자동 (Railway/Cloud Run) |

---

## 8. 📅 실행 타임라인

### Week 1: 기술 준비
- [ ] Dockerfile 작성 + 테스트
- [ ] gunicorn + 환경변수 설정
- [ ] Rate limiting, 파일 보안 구현
- [ ] Railway 배포 테스트

### Week 2: 제품 마무리
- [ ] 랜딩 페이지 제작
- [ ] 가격 페이지 구현
- [ ] 사용자 인증 (OAuth)
- [ ] Lemon Squeezy 결제 연동

### Week 3: 마케팅 준비
- [ ] 도메인 구매 + DNS 설정
- [ ] 로고/파비콘 제작
- [ ] 데모 GIF/영상 제작
- [ ] 이용약관 + 프라이버시 정책
- [ ] 소셜 계정 생성
- [ ] SEO 블로그 2개 작성

### Week 4: 런칭!
- [ ] Product Hunt 게시
- [ ] Reddit, HN, IH 게시
- [ ] Twitter 런칭 스레드
- [ ] 웨이팅 리스트 알림
- [ ] 피드백 수집 + 즉시 대응

### Week 5~8: 성장
- [ ] SEO 블로그 추가 3개
- [ ] 사용자 피드백 반영
- [ ] AppSumo 딜 검토
- [ ] 리퍼럴 프로그램 시작

---

## 9. 🔑 핵심 성공 요소

1. **무료 티어를 진짜 쓸만하게** — 경쟁사 불만 = 우리의 기회
2. **회원가입 없이 즉시 사용** — 마찰 최소화
3. **블로그 SEO** — 장기적 오가닉 트래픽의 핵심
4. **오픈소스 전략** — 신뢰 + GitHub 트래픽 + 커뮤니티
5. **인디 개발자 공감** — "나도 앱 개발자, 이게 필요해서 만들었다"
6. **빠른 피드백 루프** — 출시 후 2주 내 사용자 요청 3개 반영

---

## 부록: 결제 플랫폼 비교

| 플랫폼 | 수수료 | MoR | 세금처리 | 어필리에이트 | 추천도 |
|--------|--------|-----|---------|------------|--------|
| **Lemon Squeezy** | 5% + $0.50 | ✅ | 자동 | ✅ 내장 | ⭐⭐⭐⭐⭐ |
| Stripe | 2.9% + $0.30 | ❌ | 직접 | ❌ | ⭐⭐⭐⭐ |
| Polar | 4% + $0.40 | ✅ | 자동 | ❌ | ⭐⭐⭐ |
| Gumroad | 10% + 결제수수료 | ✅ | 자동 | ✅ | ⭐⭐ |

**1인 사업자 추천: Lemon Squeezy**
- 세금 자동 처리 (MoR) = 세무 걱정 없음
- 어필리에이트 내장 = 추가 도구 불필요
- Stripe보다 수수료 높지만, 세금 처리 비용 절약
- 한국 사업자도 가입 가능

---

*이 문서는 조사 결과 기반으로 작성되었으며, 실제 런칭 시 시장 상황에 따라 조정이 필요합니다.*
