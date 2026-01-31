# 서비스 양산 Phase 1 — HTML5 웹도구 구현 계획

## 난이도 1 서비스 목록 (20개)

| # | 배치 | 서비스명 | 디렉토리 | 상태 |
|---|------|----------|----------|------|
| 2 | B5 | Bulk Image Resizer | bulk-image-resizer | ⬜ |
| 4 | B5 | Favicon Factory | favicon-factory | ⬜ |
| 5 | B5 | Watermark Stamper | watermark-stamper | ⬜ |
| 13 | B5 | HEIC2JPG Express | heic2jpg | ⬜ |
| 16 | B2 | JSON Formatter | json-formatter | ⬜ |
| 34 | B2 | Regex Playground | regex-playground | ⬜ |
| 35 | B2 | Cron Expression Builder | cron-builder | ⬜ |
| 44 | B3 | Hashtag Generator | hashtag-generator | ⬜ |
| 45 | B3 | Social Card Preview | social-card-preview | ⬜ |
| 46 | B3 | UTM Builder | utm-builder | ⬜ |
| 58 | B6 | Typing Speed Test | typing-test | ⬜ |
| 65 | B4 | Meeting Cost Calculator | meeting-cost | ⬜ |
| 72 | B6 | QR Code Generator | qr-generator | ⬜ |
| 73 | B1 | Lorem Ipsum Generator | lorem-ipsum | ⬜ |
| 74 | B1 | Password Generator | password-generator | ⬜ |
| 75 | B1 | Unix Timestamp Converter | timestamp-converter | ⬜ |
| 76 | B1 | Online Timer/Stopwatch | timer-stopwatch | ⬜ |
| 82 | B4 | Salary Calculator | salary-calculator | ⬜ |
| 83 | B4 | SaaS Revenue Calculator | saas-calculator | ⬜ |
| 93 | B6 | Email Signature Generator | email-signature | ⬜ |

## 배치 계획

- **Batch 1**: password-generator, timestamp-converter, lorem-ipsum, timer-stopwatch
- **Batch 2**: json-formatter, regex-playground, cron-builder
- **Batch 3**: hashtag-generator, social-card-preview, utm-builder
- **Batch 4**: salary-calculator, saas-calculator, meeting-cost
- **Batch 5**: bulk-image-resizer, favicon-factory, watermark-stamper, heic2jpg
- **Batch 6**: typing-test, qr-generator, email-signature
- **Portal**: services/index.html (포털 페이지)

## 공통 규칙
- 단일 HTML5 파일, 외부 의존성 최소화
- 반응형 (모바일 + 데스크톱)
- 다국어 (ko/en)
- SEO 메타태그 + Open Graph
- 광고 자리 준비 (AdSense placeholder)
- 다크 테마, 게임 포털과 일관된 디자인
