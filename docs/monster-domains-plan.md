# Monster Domains 운영 계획

## 도메인 목록 (전체 .monster 7개)
| 도메인 | 용도 | 상태 | 만료 |
|--------|------|------|------|
| eastsea.monster | 블로그/뉴스 허브 (Jekyll) | ✅ 운영 중 | 2026-09-23 |
| lens.monster | Screenshot Studio SaaS | 🔧 세팅 예정 | 2026-09-23 |
| sola.monster | J&J Games 포탈 | 🔧 세팅 예정 | 2026-09-23 |
| pipl.monster | 개발자 도구 허브 | 📋 2단계 | 2026-09-23 |
| neu.monster | 신규 SaaS (미정) | 📋 2단계 | 2026-09-23 |
| wear.monster | 예비 | 💤 | 2026-09-23 |
| xgl.monster | 예비 | 💤 | 2026-09-23 |

## 우선순위 전략

### 1순위: lens.monster — Screenshot Studio SaaS
- screen.eastsea.xyz → lens.monster로 이전
- 이미 구축된 스크린샷 자동 생성 도구
- SaaS 모델: 무료 (3장/일) → Pro $9.99/월 (무제한)
- 도메인명이 "lens" = 카메라/이미지 도구에 완벽
- Cloudflare DNS 추가 → GCP Traefik 라우팅

### 2순위: sola.monster — J&J Games Portal
- 100개 게임 쇼케이스 포탈
- 광고 수익 (AdSense/CrazyGames)
- 게임 카테고리별 분류, 인기순 정렬
- 텔레그램 Mini App 링크 연동

### 3순위: pipl.monster — 개발자 도구 허브
- 마이크로 SaaS 모음 (JSON formatter, color picker 등)
- 각 도구가 독립적 수익 가능
- 100개 서비스 양산 프로젝트와 연결

### 4순위: neu.monster — 신규 SaaS
- 벤치마킹 결과 기반 가장 수요 높은 도구
- 후보: AI 포트폴리오 빌더, 링크인바이오, 노코드 랜딩페이지

## 인프라 구성
- DNS: Cloudflare (eastsea.xyz zone 또는 별도)
- 프록시: GCP VM Traefik → MiniPC (Tailscale)
- 서비스: Docker 컨테이너 (MiniPC)
- SSL: Let's Encrypt (Traefik 자동)

## 비용
- 도메인: 이미 결제됨 (2026-09-23까지)
- 호스팅: 기존 인프라 활용 (추가 비용 0)
- 수익 목표: lens.monster에서 첫 유료 구독 확보

## 관련 파일
- 주인님 비관여 (pipln.com 제외)
- 미스 김 전권 관리
