# MEMORY.md — 미스 김의 장기 기억

> 최종 업데이트: 2026-01-28

## 🧠 핵심 기억

### 미스 김의 역할
- **주인님과 다른 에이전트들 사이의 다리 감독관**
- 서브에이전트들을 스폰하고 관리
- 직접 수행 ❌ → 위임 후 감독 ✅
- 주인님께는 결과만 보고

### 주인님 (Jay Lee)
- 1인 소프트웨어 사업자
- 스마트폰 카메라 앱 개발
- 인디게임 제작 중
- 도커 환경에서 용량 문제 경험 많음 → 모니터링 중요

### 주인님 선호
- 자율적으로 행동 원함
- 보고는 확실히
- **중간 진행 보고 필수** — 오래 걸리는 작업은 주기적으로
- 에러/용량부족/죽기전 보고

## 📍 주요 시스템

### MiniPC 노드 (어드민 권한)
- **IP:** 100.80.169.94 (Tailscale)
- **User:** spritz
- **권한:** system.run 어드민 승인됨 ✅
- **능력:** 터미널 명령, 파일 생성(base64 우회), Playwright, Gemini 이미지 생성
- **Gemini Pro:** 주인님 계정 로그인됨 → 무료 사용 가능 💰
- **규칙:** 직접 실행 ❌ → 서브에이전트 스폰해서 위임
- 상세: TOOLS.md 참조

### 프로젝트 허브
- URL: https://kjaylee.github.io/clawd-news/
- Repo: https://github.com/kjaylee/clawd-news
- 구조: Jekyll + Markdown
- 콘텐츠: 데일리 브리핑, 게임 기획서, Unity 에셋

### iCloud 폴더
- 경로: `~/Library/Mobile Documents/com~apple~CloudDocs/`
- `_Projects/` — 프로젝트 저장소
- `_Documents/`, `_Images/` 등 카테고리별 정리

### Cron Jobs
- 05:30 — 뉴스 브리핑 (web_search → markdown → push)
- 04:00 일요일 — 로그 정리

## 🎮 게임 기획

### 보유 에셋 (핵심)
- **도구**: Feel, DOTween Pro, Odin Inspector
- **2D**: Tiny Swords, Fantasy RPG GUI
- **3D**: POLYGON 시리즈, KayKit 시리즈

### 기획서 관리
- 위치: `_games/##_게임명.md`
- iCloud: `_Projects/games/proposals/`
- 규칙: 에셋 기반 설계, README 함께 업데이트

## 📝 작업 규칙

1. **새 기획서** → 양쪽에 저장 (GitHub + iCloud)
2. **README 업데이트** → 새 문서 추가 시 필수
3. **용량 모니터링** → HEARTBEAT에서 체크
4. **중간 보고** → 30초 이상 작업 시

---

*미스 김의 장기 기억 💋*
