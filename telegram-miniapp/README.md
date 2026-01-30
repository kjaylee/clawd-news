# 🎮 East Sea Games — Telegram Mini App

텔레그램 Mini App으로 42개 HTML5 게임을 배포하고, Stars 결제 + 보상형 광고로 수익화하는 플랫폼.

## 📁 프로젝트 구조

```
telegram-miniapp/
├── bot.js                    # 텔레그램 봇 (polling 모드)
├── package.json
├── .env.example              # 환경변수 템플릿
├── Procfile                  # 배포 설정 (Heroku/Railway)
├── vercel.json               # Vercel 배포 설정
│
├── server/                   # Express 백엔드
│   ├── index.js              # 서버 엔트리
│   ├── db.js                 # SQLite DB (better-sqlite3)
│   ├── middleware/
│   │   └── auth.js           # initData HMAC-SHA256 검증
│   └── routes/
│       ├── webhook.js        # POST /api/webhook — Bot webhook
│       ├── invoice.js        # POST /api/invoice — Stars Invoice
│       ├── payment.js        # POST /api/payment — 결제 처리
│       ├── user.js           # GET  /api/user/:id — 유저 데이터
│       └── score.js          # POST /api/score — 점수 저장
│
├── public/                   # 프론트엔드 (정적 파일)
│   ├── wrapper.html          # 게임 래퍼 (TG SDK, 상점, 광고)
│   └── tg-bridge.js          # 게임 내 삽입 브릿지 스크립트
│
└── scripts/                  # 변환 스크립트
    ├── convert-game.sh       # 단일 게임 변환
    └── convert-all.sh        # TOP 5 일괄 변환
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
cd telegram-miniapp
cp .env.example .env
npm install
```

### 2. BotFather에서 봇 생성

1. 텔레그램에서 [@BotFather](https://t.me/BotFather) 채팅
2. `/newbot` → 봇 이름/유저네임 설정
3. 발급받은 **API 토큰**을 `.env`의 `BOT_TOKEN`에 입력

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
WEBAPP_URL=https://eastsea.monster/games
API_URL=https://your-api-server.com
```

### 3. BotFather 추가 설정

```
/setmenubutton → 봇 선택 → Web App → "🎮 Play Games" → https://eastsea.monster/games/spin-village/
/setdescription → "🎮 42개 HTML5 게임! 스핀, 퍼즐, 서바이벌 등"
/setcommands → start - 게임 시작, games - 게임 목록, shop - 상점, help - 도움말
```

### 4. 게임 변환

```bash
# TOP 5 게임 일괄 변환
bash scripts/convert-all.sh /path/to/games

# 개별 게임 변환
bash scripts/convert-game.sh /path/to/games/spin-village
```

### 5. 서버 실행

```bash
# 백엔드 서버 (개발)
npm run dev

# 봇 실행 (별도 터미널)
npm run bot

# 프로덕션
npm start
```

## 💰 수익 모델

### Stars 인앱결제
- `WebApp.openInvoice()` → Telegram Stars 결제
- 코인, 스핀, 생명, VIP 등 상품
- 수수료 0% (Telegram Stars)

### 보상형 광고
- RichAds / Monetag SDK
- "광고 보고 보상 받기" 방식
- CPM $5~$16

## 🎯 TOP 5 게임

| 순위 | 게임 | 장르 | 수익화 포인트 |
|------|------|------|--------------|
| 🥇 | Spin Village | 슬롯+경영 | 코인, 스핀, VIP |
| 🥈 | Crystal Match | 매치3 | 생명, 이동, 파워업 |
| 🥉 | Screw Sort Factory | 퍼즐 | 힌트, 되돌리기, 슬롯 |
| 4 | Slime Survivor | 서바이벌 | 부활, 스킨, 업그레이드 |
| 5 | Idle Slime Merge | 아이들 | 골드, 부스트, 오프라인 |

## 🔧 API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/webhook` | Telegram Bot webhook |
| POST | `/api/invoice` | Stars Invoice 생성 |
| POST | `/api/payment` | 결제 상태 확인 |
| GET | `/api/user/:id` | 유저 데이터 |
| POST | `/api/score` | 점수 저장 |
| GET | `/api/score/leaderboard/:gameId` | 리더보드 |

## 📱 래퍼 사용법

게임을 래퍼로 로드:
```
wrapper.html?game=/games/spin-village/index.html&api=https://api.example.com
```

또는 직접 게임에 SDK 삽입 (convert-game.sh 사용).

## 🔐 보안

- initData **HMAC-SHA256 검증** (server/middleware/auth.js)
- auth_date 5분 만료
- 유저 본인만 자기 데이터 접근 가능
- BOT_TOKEN은 서버 사이드에서만 사용

## 📋 배포 옵션

### Railway / Render
```bash
# Procfile 사용
web: node server/index.js
bot: node bot.js
```

### Vercel
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server/index.js"]
```

## 📚 참고 문서

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Bot Payments (Stars)](https://core.telegram.org/bots/payments-stars)
- [기획서](../specs/telegram-mini-app-plan.md)
- [기술 스펙](../specs/telegram-mini-app-tech.md)
