# 🔧 텔레그램 Mini App 기술 스펙

> **작성일:** 2026-01-30
> **버전:** 1.0
> **참조:** [기획서](./telegram-mini-app-plan.md)

---

## 목차

1. [아키텍처 개요](#1-아키텍처-개요)
2. [Telegram Bot 설정](#2-telegram-bot-설정)
3. [Mini App SDK 통합](#3-mini-app-sdk-통합)
4. [Stars 결제 연동](#4-stars-결제-연동)
5. [광고 SDK 연동](#5-광고-sdk-연동)
6. [게임 변환 가이드](#6-게임-변환-가이드)
7. [백엔드 서버](#7-백엔드-서버)
8. [배포 및 인프라](#8-배포-및-인프라)
9. [코드 예제: 전체 통합](#9-코드-예제-전체-통합)

---

## 1. 아키텍처 개요

```
┌────────────────────────────────────────────────────────┐
│                    Telegram Client                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Mini App (WebView)                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │  │
│  │  │  HTML5 Game  │  │ TG WebApp   │  │  Ad SDK  │ │  │
│  │  │  (기존 게임) │  │    SDK      │  │ RichAds/ │ │  │
│  │  │             │  │             │  │ Monetag  │ │  │
│  │  └──────┬──────┘  └──────┬──────┘  └────┬─────┘ │  │
│  │         │                │               │       │  │
│  │         └────────┬───────┘               │       │  │
│  │                  │                       │       │  │
│  └──────────────────┼───────────────────────┼───────┘  │
│                     │                       │          │
└─────────────────────┼───────────────────────┼──────────┘
                      │ WebApp API            │ HTTPS
                      ▼                       ▼
           ┌──────────────────┐    ┌──────────────────┐
           │  Telegram Bot    │    │   Ad Network      │
           │  API Server      │    │   (RichAds/       │
           │  (Node.js)       │    │    Monetag)        │
           │                  │    │                    │
           │  • Invoice API   │    │  • CPM/CPC         │
           │  • Payment       │    │  • Reporting        │
           │  • User Data     │    │                    │
           └────────┬─────────┘    └──────────────────┘
                    │
                    ▼
           ┌──────────────────┐
           │   Database       │
           │  (SQLite/        │
           │   Supabase)      │
           │                  │
           │  • Users         │
           │  • Payments      │
           │  • Game State    │
           └──────────────────┘
```

### 기술 스택

| 계층 | 기술 | 이유 |
|------|------|------|
| 프론트엔드 | Vanilla HTML5/JS (기존 게임) | 변환 최소화 |
| TG SDK | `telegram-web-app.js` | 공식 SDK |
| 백엔드 | Node.js + Express | 간단, 빠른 개발 |
| 호스팅 | Cloudflare Pages / Vercel | 무료, 글로벌 CDN |
| 봇 서버 | Cloudflare Workers / Railway | 서버리스, 저비용 |
| DB | SQLite (D1) / Supabase | 무료 티어, 확장 가능 |
| 광고 | RichAds + Monetag | TMA 전문 |

---

## 2. Telegram Bot 설정

### 2.1 BotFather 설정 단계

```bash
# 1. @BotFather에게 메시지
/start

# 2. 새 봇 생성
/newbot
# → 봇 이름 입력: "East Sea Games"
# → 봇 username 입력: "eastsea_games_bot"
# → API 토큰 수령: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# 3. Web App 설정 (메뉴 버튼)
/setmenubutton
# → 봇 선택: @eastsea_games_bot
# → Type: web_app
# → Text: "🎮 Play Games"
# → URL: https://eastsea.monster/games/spin-village/

# 4. 봇 설명 설정
/setdescription
# → "🎮 42개 HTML5 게임을 무료로 즐기세요! 스핀, 퍼즐, 서바이벌 등"

# 5. 봇 사진 설정
/setuserpic
# → 로고 이미지 업로드

# 6. 인라인 모드 활성화 (게임 공유용)
/setinline

# 7. Mini App 직접 링크 설정
/newapp
# → 봇 선택
# → 앱 이름: "spinvillage"
# → URL: https://eastsea.monster/games/spin-village/
# 결과 링크: https://t.me/eastsea_games_bot/spinvillage
```

### 2.2 봇 서버 기본 코드 (Node.js)

```javascript
// bot.js
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = 'https://eastsea.monster/games';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();

app.use(express.json());

// /start 명령어
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  
  bot.sendMessage(chatId, 
    `🎮 안녕하세요 ${userName}님!\nEast Sea Games에 오신 걸 환영합니다!\n\n🕹️ 아래 버튼을 눌러 게임을 시작하세요!`, 
    {
      reply_markup: {
        inline_keyboard: [
          [{ 
            text: '🎰 Spin Village', 
            web_app: { url: `${WEBAPP_URL}/spin-village/` }
          }],
          [{ 
            text: '💎 Crystal Match', 
            web_app: { url: `${WEBAPP_URL}/crystal-match/` }
          }],
          [{ 
            text: '🔩 Screw Sort', 
            web_app: { url: `${WEBAPP_URL}/screw-sort-factory/` }
          }],
          [{ 
            text: '🟢 Slime Survivor', 
            web_app: { url: `${WEBAPP_URL}/slime-survivor/` }
          }],
          [{ 
            text: '🫧 Idle Slime Merge', 
            web_app: { url: `${WEBAPP_URL}/idle-slime-merge/` }
          }],
          [{ 
            text: '📋 전체 게임 목록', 
            web_app: { url: `${WEBAPP_URL}/` }
          }]
        ]
      }
    }
  );
});

// /shop 명령어 — 상점
bot.onText(/\/shop/, (msg) => {
  bot.sendMessage(msg.chat.id, '🛒 상점에 오신 걸 환영합니다!', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '⭐ 코인 팩 S (10 Stars)', callback_data: 'buy_coins_s' }],
        [{ text: '⭐ 코인 팩 M (50 Stars)', callback_data: 'buy_coins_m' }],
        [{ text: '⭐ 코인 팩 L (100 Stars)', callback_data: 'buy_coins_l' }],
        [{ text: '🎰 추가 스핀 5회 (15 Stars)', callback_data: 'buy_spins' }],
        [{ text: '🛡️ VIP 1일 (50 Stars)', callback_data: 'buy_vip_1d' }],
      ]
    }
  });
});

app.listen(3000, () => console.log('Bot server running on 3000'));
```

---

## 3. Mini App SDK 통합

### 3.1 기본 통합 코드

기존 게임의 `index.html` `<head>` 섹션에 추가:

```html
<!-- Telegram Mini App SDK -->
<script src="https://telegram.org/js/telegram-web-app.js"></script>

<script>
// ============================================
// Telegram Mini App 초기화 모듈
// ============================================
const TG = {
  app: window.Telegram?.WebApp,
  user: null,
  
  init() {
    if (!this.app) {
      console.log('Not running in Telegram');
      return false;
    }
    
    // 1. 앱 준비 완료 알림
    this.app.ready();
    
    // 2. 전체 화면으로 확장
    this.app.expand();
    
    // 3. 유저 정보 가져오기
    this.user = this.app.initDataUnsafe?.user;
    
    // 4. 테마 적용
    this.applyTheme();
    
    // 5. 뒤로가기 버튼 설정
    this.setupBackButton();
    
    // 6. 뷰포트 변경 대응
    this.app.onEvent('viewportChanged', ({ isStateStable }) => {
      if (isStateStable) {
        this.handleViewportChange();
      }
    });
    
    console.log(`TG Mini App initialized for user: ${this.user?.id}`);
    return true;
  },
  
  // 텔레그램 테마 색상 적용
  applyTheme() {
    const tp = this.app.themeParams;
    if (tp) {
      document.documentElement.style.setProperty('--tg-bg', tp.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-text', tp.text_color || '#000000');
      document.documentElement.style.setProperty('--tg-hint', tp.hint_color || '#999999');
      document.documentElement.style.setProperty('--tg-link', tp.link_color || '#2481cc');
      document.documentElement.style.setProperty('--tg-button', tp.button_color || '#2481cc');
      document.documentElement.style.setProperty('--tg-button-text', tp.button_text_color || '#ffffff');
    }
  },
  
  // 뒤로가기 버튼
  setupBackButton() {
    this.app.BackButton.onClick(() => {
      // 게임 메인 메뉴로 이동하거나 앱 닫기
      if (window.gameState === 'playing') {
        window.gameState = 'menu';
        showMenu();
      } else {
        this.app.close();
      }
    });
  },
  
  // 뷰포트 변경 처리
  handleViewportChange() {
    const vh = this.app.viewportStableHeight;
    document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
  },
  
  // 유저 ID 기반 저장/로드
  getUserId() {
    return this.user?.id || 'anonymous';
  },
  
  saveData(key, value) {
    const userId = this.getUserId();
    localStorage.setItem(`${userId}_${key}`, JSON.stringify(value));
  },
  
  loadData(key, defaultValue = null) {
    const userId = this.getUserId();
    const data = localStorage.getItem(`${userId}_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  },
  
  // 햅틱 피드백
  haptic(type = 'impact', style = 'medium') {
    if (!this.app?.HapticFeedback) return;
    switch (type) {
      case 'impact':
        this.app.HapticFeedback.impactOccurred(style); // light|medium|heavy|rigid|soft
        break;
      case 'notification':
        this.app.HapticFeedback.notificationOccurred(style); // error|success|warning
        break;
      case 'selection':
        this.app.HapticFeedback.selectionChanged();
        break;
    }
  },
  
  // 공유 기능
  shareScore(score, gameName) {
    const text = `🎮 ${gameName}에서 ${score}점 달성!\n도전해보세요! 👇`;
    const url = `https://t.me/eastsea_games_bot/${gameName.toLowerCase().replace(/\s+/g, '')}`;
    this.app.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  },
  
  // 메인 버튼 (하단 고정)
  showMainButton(text, callback) {
    const btn = this.app.MainButton;
    btn.text = text;
    btn.show();
    btn.onClick(callback);
  },
  
  hideMainButton() {
    this.app.MainButton.hide();
  }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  TG.init();
});
</script>
```

### 3.2 CSS 테마 변수

```css
/* Telegram 테마 호환 CSS */
:root {
  --tg-bg: #ffffff;
  --tg-text: #000000;
  --tg-hint: #999999;
  --tg-link: #2481cc;
  --tg-button: #2481cc;
  --tg-button-text: #ffffff;
  --tg-viewport-height: 100vh;
}

body {
  background-color: var(--tg-bg);
  color: var(--tg-text);
  /* Safe area 처리 */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  min-height: var(--tg-viewport-height);
}

/* 다크 모드 자동 대응 */
@media (prefers-color-scheme: dark) {
  :root {
    --tg-bg: #1a1a2e;
    --tg-text: #ffffff;
  }
}
```

### 3.3 주요 WebApp API 메서드 정리

| 메서드 | 설명 | 버전 |
|--------|------|------|
| `ready()` | 앱 로딩 완료 알림 | 6.0 |
| `expand()` | 전체 화면 확장 | 6.0 |
| `close()` | 앱 닫기 | 6.0 |
| `openInvoice(url, cb)` | Stars 결제 창 열기 | 6.1 |
| `openTelegramLink(url)` | TG 내부 링크 열기 | 6.1 |
| `openLink(url)` | 외부 브라우저 열기 | 6.0 |
| `showPopup(params, cb)` | 네이티브 팝업 | 6.2 |
| `showAlert(msg, cb)` | 알림 팝업 | 6.2 |
| `showConfirm(msg, cb)` | 확인 팝업 | 6.2 |
| `MainButton.*` | 하단 메인 버튼 | 6.0 |
| `BackButton.*` | 상단 뒤로가기 | 6.1 |
| `HapticFeedback.*` | 진동 피드백 | 6.1 |
| `CloudStorage.*` | 클라우드 저장소 | 6.9 |
| `requestFullscreen()` | 전체 화면 모드 | 8.0 |
| `addToHomeScreen()` | 홈 화면 추가 | 8.0 |
| `shareMessage(msg_id)` | 메시지 공유 | 8.0 |

### 3.4 initData 구조

```javascript
// Telegram.WebApp.initDataUnsafe 구조
{
  query_id: "AAGhZ...",       // 쿼리 ID
  user: {
    id: 557002367,            // 유저 고유 ID
    first_name: "Jay",
    last_name: "Lee",
    username: "jaylee",
    language_code: "ko",      // 언어
    is_premium: true,         // 프리미엄 여부
    photo_url: "https://..."
  },
  auth_date: 1706500000,
  hash: "abc123..."           // 검증용 해시
}
```

---

## 4. Stars 결제 연동

### 4.1 결제 플로우

```
유저 (Mini App)                    백엔드 서버                      Telegram API
     │                                │                                │
     │  1. "코인 구매" 클릭           │                                │
     ├──────────────────────────────►│                                │
     │                                │  2. createInvoiceLink()        │
     │                                ├──────────────────────────────►│
     │                                │                                │
     │                                │  3. invoice URL 반환            │
     │                                │◄──────────────────────────────┤
     │  4. invoiceLink 반환           │                                │
     │◄──────────────────────────────┤                                │
     │                                │                                │
     │  5. WebApp.openInvoice(url)   │                                │
     │  ───(결제 UI 표시)───          │                                │
     │                                │                                │
     │  6. 유저 결제 승인             │                                │
     │  ────────────────────────────►│                                │
     │                                │  7. pre_checkout_query          │
     │                                │◄──────────────────────────────┤
     │                                │                                │
     │                                │  8. answerPreCheckoutQuery(ok) │
     │                                ├──────────────────────────────►│
     │                                │                                │
     │                                │  9. successful_payment          │
     │                                │◄──────────────────────────────┤
     │                                │                                │
     │  10. callback(status="paid")   │  11. 아이템 지급               │
     │◄──────────────────────────────┤                                │
     │                                │                                │
```

### 4.2 백엔드: Invoice 생성 API

```javascript
// server.js — Stars 결제 서버
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN);

// ─── 상품 카탈로그 ───
const PRODUCTS = {
  coins_s:  { title: '💰 코인 팩 S',     desc: '5,000 코인',       amount: 10,  reward: { coins: 5000 } },
  coins_m:  { title: '💰 코인 팩 M',     desc: '30,000 코인',      amount: 50,  reward: { coins: 30000 } },
  coins_l:  { title: '💰 코인 팩 L',     desc: '75,000 코인',      amount: 100, reward: { coins: 75000 } },
  spins_5:  { title: '🎰 추가 스핀 5회', desc: '즉시 스핀 5회 충전', amount: 15,  reward: { spins: 5 } },
  shield:   { title: '🛡️ 실드',          desc: '공격 1회 방어',     amount: 20,  reward: { shields: 1 } },
  vip_1d:   { title: '👑 VIP 1일',       desc: '24시간 2x 보상',    amount: 50,  reward: { vip_hours: 24 } },
  vip_7d:   { title: '👑 VIP 7일',       desc: '7일 2x + 특별 마을', amount: 200, reward: { vip_hours: 168 } },
  // Crystal Match 상품
  lives_5:  { title: '❤️ 생명 5개',      desc: '즉시 생명 5개 충전', amount: 10,  reward: { lives: 5 } },
  moves_5:  { title: '➕ 이동 +5',       desc: '추가 이동 5회',      amount: 5,   reward: { moves: 5 } },
  powerup:  { title: '💣 색상 폭탄',     desc: '강력한 파워업',       amount: 8,   reward: { powerup: 'color_bomb' } },
  // Slime Survivor 상품
  revive:   { title: '💚 부활',          desc: '즉시 부활',          amount: 10,  reward: { revives: 1 } },
  skin_fire:{ title: '🔥 불꽃 스킨',    desc: '영구 불꽃 슬라임',    amount: 50,  reward: { skin: 'fire' } },
};

// ─── Invoice 생성 엔드포인트 ───
app.post('/api/create-invoice', async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const product = PRODUCTS[productId];
    
    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }
    
    const invoiceLink = await bot.createInvoiceLink(
      product.title,                          // title
      product.desc,                           // description
      JSON.stringify({                        // payload (결제 완료 시 확인용)
        productId,
        userId,
        timestamp: Date.now()
      }),
      '',                                     // provider_token (Stars는 빈 문자열)
      'XTR',                                  // currency (Telegram Stars)
      [{ label: product.title, amount: product.amount }]  // prices
    );
    
    res.json({ invoiceLink });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// ─── Pre-Checkout Query 핸들러 ───
// 결제 전 최종 확인 — 반드시 10초 내에 응답해야 함!
bot.on('pre_checkout_query', (query) => {
  // payload 검증
  try {
    const payload = JSON.parse(query.invoice_payload);
    const product = PRODUCTS[payload.productId];
    
    if (!product) {
      bot.answerPreCheckoutQuery(query.id, false, {
        error_message: '상품을 찾을 수 없습니다.'
      });
      return;
    }
    
    // 결제 승인
    bot.answerPreCheckoutQuery(query.id, true);
  } catch (e) {
    bot.answerPreCheckoutQuery(query.id, false, {
      error_message: '결제 처리 중 오류가 발생했습니다.'
    });
  }
});

// ─── 결제 성공 핸들러 ───
bot.on('message', (msg) => {
  if (msg.successful_payment) {
    const payment = msg.successful_payment;
    const payload = JSON.parse(payment.invoice_payload);
    const product = PRODUCTS[payload.productId];
    
    console.log(`💰 Payment received: ${payment.total_amount} Stars from user ${msg.from.id}`);
    
    // DB에 결제 기록
    savePayment({
      userId: msg.from.id,
      productId: payload.productId,
      amount: payment.total_amount,
      currency: payment.currency,    // 'XTR'
      telegramPaymentChargeId: payment.telegram_payment_charge_id,
      providerPaymentChargeId: payment.provider_payment_charge_id,
      timestamp: Date.now()
    });
    
    // 아이템 지급
    grantReward(msg.from.id, product.reward);
    
    // 확인 메시지
    bot.sendMessage(msg.chat.id, 
      `✅ 결제 완료!\n${product.title} 지급되었습니다.\n게임으로 돌아가서 확인해주세요! 🎮`
    );
  }
});

// ─── 환불 엔드포인트 (필요시) ───
app.post('/api/refund', async (req, res) => {
  try {
    const { userId, telegramPaymentChargeId } = req.body;
    await bot.refundStarPayment(userId, telegramPaymentChargeId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Refund failed' });
  }
});

app.listen(3000);
```

### 4.3 프론트엔드: 결제 UI

```javascript
// ============================================
// Stars 결제 모듈 (Mini App 프론트엔드)
// ============================================
const Shop = {
  API_URL: 'https://api.eastsea.monster', // 백엔드 서버
  
  // 결제 실행
  async purchase(productId) {
    if (!TG.app) {
      alert('텔레그램에서만 구매할 수 있습니다.');
      return;
    }
    
    try {
      // 1. 백엔드에서 Invoice 링크 생성
      const response = await fetch(`${this.API_URL}/api/create-invoice`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Init-Data': TG.app.initData  // 인증용
        },
        body: JSON.stringify({
          productId,
          userId: TG.getUserId()
        })
      });
      
      const { invoiceLink } = await response.json();
      
      // 2. Telegram 결제 UI 열기
      TG.app.openInvoice(invoiceLink, (status) => {
        switch (status) {
          case 'paid':
            // 결제 성공!
            TG.haptic('notification', 'success');
            this.onPaymentSuccess(productId);
            break;
          case 'cancelled':
            console.log('Payment cancelled');
            break;
          case 'failed':
            TG.app.showAlert('결제에 실패했습니다. 다시 시도해주세요.');
            break;
          case 'pending':
            console.log('Payment pending');
            break;
        }
      });
      
    } catch (error) {
      console.error('Purchase error:', error);
      TG.app.showAlert('결제 처리 중 오류가 발생했습니다.');
    }
  },
  
  // 결제 성공 처리
  onPaymentSuccess(productId) {
    // 게임 내 보상 지급 (프론트엔드 즉시 반영)
    switch (productId) {
      case 'coins_s':
        Game.addCoins(5000);
        break;
      case 'coins_m':
        Game.addCoins(30000);
        break;
      case 'coins_l':
        Game.addCoins(75000);
        break;
      case 'spins_5':
        Game.addSpins(5);
        break;
      case 'shield':
        Game.addShields(1);
        break;
      case 'vip_1d':
        Game.activateVIP(24);
        break;
      case 'lives_5':
        Game.addLives(5);
        break;
      case 'revive':
        Game.revive();
        break;
    }
    
    // 저장
    TG.saveData('gameState', Game.getState());
    
    // UI 업데이트
    updateUI();
    
    // 성공 이펙트
    showPurchaseEffect(productId);
  },
  
  // 상점 UI 표시
  showShop() {
    const shopHTML = `
      <div id="shop-overlay" class="shop-overlay">
        <div class="shop-container">
          <h2>🛒 상점</h2>
          <div class="shop-items">
            <div class="shop-item" onclick="Shop.purchase('coins_s')">
              <span class="item-icon">💰</span>
              <span class="item-name">코인 5,000</span>
              <span class="item-price">⭐ 10</span>
            </div>
            <div class="shop-item" onclick="Shop.purchase('coins_m')">
              <span class="item-icon">💰</span>
              <span class="item-name">코인 30,000</span>
              <span class="item-price">⭐ 50</span>
            </div>
            <div class="shop-item" onclick="Shop.purchase('spins_5')">
              <span class="item-icon">🎰</span>
              <span class="item-name">추가 스핀 5회</span>
              <span class="item-price">⭐ 15</span>
            </div>
            <div class="shop-item" onclick="Shop.purchase('shield')">
              <span class="item-icon">🛡️</span>
              <span class="item-name">실드 1개</span>
              <span class="item-price">⭐ 20</span>
            </div>
            <div class="shop-item vip" onclick="Shop.purchase('vip_1d')">
              <span class="item-icon">👑</span>
              <span class="item-name">VIP 1일</span>
              <span class="item-price">⭐ 50</span>
            </div>
          </div>
          <button class="shop-close" onclick="Shop.hideShop()">닫기</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', shopHTML);
  },
  
  hideShop() {
    document.getElementById('shop-overlay')?.remove();
  }
};
```

### 4.4 initData 검증 (보안)

```javascript
// server-side: initData 해시 검증
const crypto = require('crypto');

function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  
  // 알파벳순 정렬
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // HMAC-SHA256 with "WebAppData" + bot token
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}

// 미들웨어로 사용
function authMiddleware(req, res, next) {
  const initData = req.headers['x-init-data'];
  if (!initData || !validateInitData(initData, BOT_TOKEN)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const params = new URLSearchParams(initData);
  req.telegramUser = JSON.parse(params.get('user'));
  next();
}
```

---

## 5. 광고 SDK 연동

### 5.1 RichAds 연동

```html
<!-- RichAds 퍼블리셔 코드 (head에 삽입) -->
<!-- 실제 코드는 RichAds 퍼블리셔 대시보드에서 발급 -->
<script>
  // RichAds Push-Style 광고
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://richads.com/publisher/YOUR_PUBLISHER_ID.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'richads-sdk'));
</script>
```

### 5.2 Monetag 연동 (보상형 광고)

```javascript
// Monetag Rewarded Interstitial 연동
const AdManager = {
  monetagZone: 'YOUR_ZONE_ID',  // Monetag 대시보드에서 발급
  
  // SDK 로드
  init() {
    const script = document.createElement('script');
    script.src = `https://monetag.com/sdk/rewarded.js?zone=${this.monetagZone}`;
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('Monetag SDK loaded');
      this.ready = true;
    };
  },
  
  // 보상형 광고 표시
  showRewarded(callback) {
    if (!this.ready) {
      console.log('Ad SDK not ready');
      callback(false);
      return;
    }
    
    // Monetag 보상형 광고 호출
    if (window.monetag?.show) {
      window.monetag.show({
        zone: this.monetagZone,
        type: 'rewarded',
        onComplete: () => {
          TG.haptic('notification', 'success');
          callback(true);  // 광고 시청 완료 → 보상 지급
        },
        onClose: () => {
          callback(false); // 광고 닫힘 (미시청)
        },
        onError: (err) => {
          console.error('Ad error:', err);
          callback(false);
        }
      });
    }
  }
};

// 사용 예시: "광고 보고 추가 스핀 받기"
function watchAdForSpins() {
  AdManager.showRewarded((watched) => {
    if (watched) {
      Game.addSpins(3);
      TG.saveData('gameState', Game.getState());
      updateUI();
      TG.app?.showAlert('🎰 스핀 3회가 추가되었습니다!');
    }
  });
}

// 사용 예시: "광고 보고 부활하기"
function watchAdForRevive() {
  AdManager.showRewarded((watched) => {
    if (watched) {
      Game.revive();
      updateUI();
    }
  });
}
```

### 5.3 광고 삽입 전략

```javascript
// 자연스러운 광고 삽입 포인트

// 1. 게임 오버 시
function onGameOver(score) {
  showGameOverScreen();
  
  // 결제 옵션 + 광고 옵션 동시 제공
  showReviveOptions({
    starOption: {
      text: '⭐ 10 Stars로 부활',
      action: () => Shop.purchase('revive')
    },
    adOption: {
      text: '📺 광고 보고 부활',
      action: () => watchAdForRevive()
    },
    skipOption: {
      text: '메인 메뉴로',
      action: () => showMenu()
    }
  });
}

// 2. 스핀/생명 소진 시
function onResourceDepleted(resource) {
  TG.app?.showPopup({
    title: `${resource} 부족!`,
    message: '충전 방법을 선택하세요',
    buttons: [
      { id: 'buy', type: 'default', text: '⭐ Stars로 구매' },
      { id: 'ad', type: 'default', text: '📺 광고 보기' },
      { id: 'wait', type: 'cancel', text: '나중에' }
    ]
  }, (btnId) => {
    switch (btnId) {
      case 'buy': Shop.showShop(); break;
      case 'ad': watchAdForResource(resource); break;
    }
  });
}

// 3. 레벨 간 인터스티셜 (3레벨마다)
let levelCount = 0;
function onLevelComplete(level) {
  levelCount++;
  if (levelCount % 3 === 0) {
    AdManager.showInterstitial();
  }
}
```

---

## 6. 게임 변환 가이드

### 6.1 변환 체크리스트 (모든 게임 공통)

```
□ Step 1: telegram-web-app.js 스크립트 추가
□ Step 2: TG.init() 모듈 삽입  
□ Step 3: TG.app.ready() + expand() 호출
□ Step 4: 뷰포트 높이를 var(--tg-viewport-height) 사용
□ Step 5: localStorage → TG.saveData/loadData 변환
□ Step 6: 테마 색상 CSS 변수 적용
□ Step 7: safe area padding 추가
□ Step 8: 결제 포인트 식별 & Shop 모듈 연동
□ Step 9: 광고 포인트 식별 & AdManager 연동
□ Step 10: 공유/리더보드 기능 추가
□ Step 11: 햅틱 피드백 추가 (터치 이벤트)
□ Step 12: 텔레그램 Desktop/Mobile/Web 테스트
```

### 6.2 게임별 변환 상세

#### Spin Village (MVP 1호)

```javascript
// 기존 코드에서 수정할 부분:

// 1. localStorage 호출 → TG 래퍼로 교체
// Before:
localStorage.setItem('spinVillage_coins', coins);
// After:
TG.saveData('spinVillage_coins', coins);

// 2. 코인 소진 시 결제/광고 옵션 추가
function onSpinsEmpty() {
  if (TG.app) {
    TG.app.showPopup({
      title: '🎰 스핀 부족!',
      message: '스핀을 충전하시겠습니까?',
      buttons: [
        { id: 'buy', type: 'default', text: '⭐ 15 Stars (5스핀)' },
        { id: 'ad', type: 'default', text: '📺 광고 (3스핀)' },
        { id: 'wait', type: 'cancel', text: '기다리기' }
      ]
    }, (btnId) => {
      if (btnId === 'buy') Shop.purchase('spins_5');
      if (btnId === 'ad') watchAdForSpins();
    });
  }
}

// 3. 스핀 결과에 햅틱 추가
function onSpinResult(result) {
  switch (result.type) {
    case 'jackpot':
      TG.haptic('notification', 'success');
      break;
    case 'coins':
      TG.haptic('impact', 'medium');
      break;
    case 'attack':
      TG.haptic('impact', 'heavy');
      break;
  }
}

// 4. 점수 공유
function shareVillageProgress() {
  TG.shareScore(village.level, 'Spin Village');
}
```

#### Crystal Match 변환 포인트

```javascript
// 기존 구조: score, GEM, life, HighScore, localStorage 모두 있음
// 수정:

// 1. 생명 소진 시 → Shop (10 Stars = 5 생명) 또는 광고
// 2. 이동 소진 시 → Shop (5 Stars = 5 이동) 또는 광고
// 3. 파워업 구매 → Stars
// 4. 젬(GEM) → Stars로 직접 구매 가능
// 5. 레벨 클리어 시 → 공유 버튼 + 리더보드
// 6. 3레벨마다 → 인터스티셜 광고
```

### 6.3 자동 변환 스크립트

```bash
#!/bin/bash
# convert-to-miniapp.sh — 기존 게임을 Mini App으로 변환

GAME_DIR=$1
GAME_NAME=$(basename $GAME_DIR)

echo "🔄 Converting $GAME_NAME to Mini App..."

# 1. 백업
cp "$GAME_DIR/index.html" "$GAME_DIR/index.html.bak"

# 2. telegram-web-app.js 스크립트 삽입 (</head> 직전)
sed -i '' 's|</head>|<script src="https://telegram.org/js/telegram-web-app.js"></script>\n<script src="/games/tg-common.js"></script>\n</head>|' "$GAME_DIR/index.html"

# 3. 뷰포트 메타 태그 확인
grep -q 'viewport' "$GAME_DIR/index.html" && echo "✅ viewport OK" || echo "⚠️  viewport missing"

echo "✅ $GAME_NAME converted! Manual steps remaining:"
echo "   - Add TG.init() call"
echo "   - Replace localStorage with TG.saveData/loadData"
echo "   - Add payment/ad hooks"
echo "   - Test on Telegram"
```

---

## 7. 백엔드 서버

### 7.1 프로젝트 구조

```
telegram-game-server/
├── package.json
├── wrangler.toml          # Cloudflare Workers 설정
├── src/
│   ├── index.js           # 메인 엔트리
│   ├── bot.js             # 봇 핸들러
│   ├── routes/
│   │   ├── invoice.js     # 결제 API
│   │   ├── leaderboard.js # 리더보드 API
│   │   └── user.js        # 유저 API
│   ├── middleware/
│   │   └── auth.js        # initData 검증
│   └── db/
│       ├── schema.sql     # DB 스키마
│       └── queries.js     # DB 쿼리
├── games/
│   ├── tg-common.js       # 공통 TG 모듈
│   ├── tg-shop.js         # 공통 상점 모듈
│   ├── tg-ads.js          # 공통 광고 모듈
│   └── ...
```

### 7.2 DB 스키마

```sql
-- users 테이블
CREATE TABLE users (
  telegram_id INTEGER PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP
);

-- payments 테이블
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER REFERENCES users(telegram_id),
  product_id TEXT NOT NULL,
  amount INTEGER NOT NULL,           -- Stars 수량
  currency TEXT DEFAULT 'XTR',
  tg_charge_id TEXT UNIQUE,
  status TEXT DEFAULT 'completed',   -- completed, refunded
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- game_state 테이블 (유저별 게임 진행 상태)
CREATE TABLE game_state (
  telegram_id INTEGER,
  game_id TEXT,
  state_json TEXT,                   -- JSON으로 저장
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (telegram_id, game_id)
);

-- leaderboard 테이블
CREATE TABLE leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER REFERENCES users(telegram_id),
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  period TEXT DEFAULT 'weekly',      -- weekly, monthly, alltime
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_leaderboard_game_score ON leaderboard(game_id, score DESC);
CREATE INDEX idx_payments_user ON payments(telegram_id);
```

### 7.3 리더보드 API

```javascript
// routes/leaderboard.js

// 점수 제출
app.post('/api/leaderboard/submit', authMiddleware, async (req, res) => {
  const { game_id, score } = req.body;
  const userId = req.telegramUser.id;
  
  // 현재 주간/월간 최고 점수 체크
  const existing = await db.get(
    'SELECT score FROM leaderboard WHERE telegram_id = ? AND game_id = ? AND period = ? ORDER BY score DESC LIMIT 1',
    [userId, game_id, 'weekly']
  );
  
  if (!existing || score > existing.score) {
    await db.run(
      'INSERT INTO leaderboard (telegram_id, game_id, score, period) VALUES (?, ?, ?, ?)',
      [userId, game_id, score, 'weekly']
    );
  }
  
  res.json({ success: true, newHighScore: !existing || score > existing.score });
});

// 리더보드 조회
app.get('/api/leaderboard/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const { period = 'weekly', limit = 20 } = req.query;
  
  const leaders = await db.all(`
    SELECT 
      l.telegram_id, l.score, u.username, u.first_name,
      ROW_NUMBER() OVER (ORDER BY l.score DESC) as rank
    FROM leaderboard l
    JOIN users u ON l.telegram_id = u.telegram_id
    WHERE l.game_id = ? AND l.period = ?
    ORDER BY l.score DESC
    LIMIT ?
  `, [gameId, period, limit]);
  
  res.json({ leaders });
});
```

---

## 8. 배포 및 인프라

### 8.1 Cloudflare Pages (정적 게임 호스팅)

```bash
# eastsea.monster은 이미 배포 중이므로,
# 기존 게임 파일에 TG SDK만 추가하면 됨

# 또는 별도 서브도메인:
# games.eastsea.monster → Cloudflare Pages
```

### 8.2 Cloudflare Workers (봇 서버)

```toml
# wrangler.toml
name = "eastsea-game-bot"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
BOT_TOKEN = "" # secret으로 관리

[[d1_databases]]
binding = "DB"
database_name = "game-db"
database_id = "xxxx"
```

### 8.3 Webhook 설정

```bash
# Polling 대신 Webhook 사용 (프로덕션 권장)
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://bot.eastsea.monster/webhook",
    "allowed_updates": ["message", "callback_query", "pre_checkout_query"],
    "drop_pending_updates": true
  }'
```

---

## 9. 코드 예제: 전체 통합

### 9.1 공통 모듈 (`tg-common.js`)

이 파일을 `/games/tg-common.js`에 배치하여 모든 게임에서 공유:

```javascript
// tg-common.js — 모든 Mini App 게임에서 공유하는 공통 모듈

(function() {
  'use strict';
  
  // ─── TG 모듈 (위의 TG 객체) ───
  window.TG = { /* ... 위 3.1절 코드 ... */ };
  
  // ─── Shop 모듈 ───
  window.Shop = { /* ... 위 4.3절 코드 ... */ };
  
  // ─── AdManager 모듈 ───
  window.AdManager = { /* ... 위 5.2절 코드 ... */ };
  
  // ─── Analytics 모듈 ───
  window.Analytics = {
    track(event, data = {}) {
      const userId = TG.getUserId();
      fetch(`${Shop.API_URL}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, userId, data, timestamp: Date.now() })
      }).catch(() => {});
    }
  };
  
  // ─── 자동 초기화 ───
  document.addEventListener('DOMContentLoaded', () => {
    const isTG = TG.init();
    if (isTG) {
      AdManager.init();
      Analytics.track('game_open', { game: document.title });
    }
  });
})();
```

### 9.2 빠른 시작: Spin Village 변환 diff

```diff
 <!DOCTYPE html>
 <html lang="ko">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
     <title>Spin Village 🎰🏘️</title>
+    <!-- Telegram Mini App SDK -->
+    <script src="https://telegram.org/js/telegram-web-app.js"></script>
+    <script src="/games/tg-common.js"></script>
     <style>
+        :root {
+            --tg-bg: #1a1a2e;
+            --tg-text: #ffffff;
+            --tg-viewport-height: 100vh;
+        }
         * {
             margin: 0;
             padding: 0;
             box-sizing: border-box;
         }
         body {
             font-family: 'Segoe UI', system-ui, sans-serif;
-            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
-            min-height: 100vh;
+            background: linear-gradient(135deg, var(--tg-bg) 0%, #16213e 50%, #0f3460 100%);
+            min-height: var(--tg-viewport-height, 100vh);
+            padding-top: env(safe-area-inset-top);
+            padding-bottom: env(safe-area-inset-bottom);
             display: flex;
             /* ... */
         }
+
+        /* 상점 버튼 */
+        .shop-btn {
+            position: fixed;
+            top: 15px;
+            right: 15px;
+            background: linear-gradient(135deg, #f5af19, #f12711);
+            border: none;
+            border-radius: 50%;
+            width: 50px;
+            height: 50px;
+            font-size: 24px;
+            cursor: pointer;
+            z-index: 100;
+            box-shadow: 0 4px 15px rgba(241, 39, 17, 0.4);
+        }
     </style>
 </head>
 <body>
+    <!-- 상점 버튼 -->
+    <button class="shop-btn" onclick="Shop.showShop()">🛒</button>

     <!-- 기존 게임 HTML -->
     <!-- ... -->

     <script>
+    // Telegram 환경에서 localStorage 래핑
+    const originalSetItem = localStorage.setItem.bind(localStorage);
+    const originalGetItem = localStorage.getItem.bind(localStorage);
+    if (TG.app) {
+        localStorage.setItem = (key, value) => {
+            originalSetItem(`${TG.getUserId()}_${key}`, value);
+        };
+        localStorage.getItem = (key) => {
+            return originalGetItem(`${TG.getUserId()}_${key}`);
+        };
+    }

     // 기존 게임 코드
     // ...
     
+    // 스핀 소진 시 결제/광고 옵션
+    function onSpinsEmpty() {
+        if (TG.app) {
+            TG.app.showPopup({
+                title: '🎰 스핀 부족!',
+                message: '충전 방법을 선택하세요',
+                buttons: [
+                    { id: 'buy', type: 'default', text: '⭐ 15 Stars (5스핀)' },
+                    { id: 'ad', type: 'default', text: '📺 광고 (3스핀)' },
+                    { id: 'wait', type: 'cancel', text: '기다리기' }
+                ]
+            }, (btnId) => {
+                if (btnId === 'buy') Shop.purchase('spins_5');
+                if (btnId === 'ad') {
+                    AdManager.showRewarded((ok) => {
+                        if (ok) { addSpins(3); updateUI(); }
+                    });
+                }
+            });
+        }
+    }
+
+    // 마을 레벨업 시 공유
+    function onLevelUp(level) {
+        // 기존 레벨업 로직...
+        
+        if (TG.app) {
+            TG.haptic('notification', 'success');
+            setTimeout(() => {
+                TG.app.showPopup({
+                    title: '🎉 레벨 업!',
+                    message: `레벨 ${level} 달성! 친구들에게 자랑할까요?`,
+                    buttons: [
+                        { id: 'share', type: 'default', text: '📢 공유하기' },
+                        { id: 'ok', type: 'ok' }
+                    ]
+                }, (btnId) => {
+                    if (btnId === 'share') TG.shareScore(level, 'SpinVillage');
+                });
+            }, 1500);
+        }
+    }
     </script>
 </body>
 </html>
```

---

## 부록: 참고 자료

### 공식 문서
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Bot Payments API (Stars)](https://core.telegram.org/bots/payments-stars)
- [Mini App Methods](https://docs.telegram-mini-apps.com/platform/methods)
- [Bot API Reference](https://core.telegram.org/bots/api)

### 광고 네트워크
- [RichAds TMA Publisher](https://richads.com/publishers/telegram/)
- [Monetag Mini App Ads](https://monetag.com/blog/telegram-mini-app-ads/)

### 커뮤니티 리소스
- [tma.js SDK (npm)](https://www.npmjs.com/package/@tma.js/sdk)
- [@twa-dev/sdk (npm)](https://www.npmjs.com/package/@twa-dev/sdk)
- [Awesome Telegram Mini Apps (GitHub)](https://github.com/telegram-mini-apps-dev/awesome-telegram-mini-apps)
- [FindMini.app (디렉토리)](https://www.findmini.app)

### 성공 사례 분석
- [RichAds: $11K/월 게임 수익](https://richads.com/blog/how-telegram-games-earn-money-case-study-with-11000-monthly-profit/)
- [RichAds: $35K/월 케이스](https://richads.com/blog/how-to-create-telegram-mini-app-35k-profit-case-study/)
- [텔레그램 Mini App 혁명 (earlybird.so)](https://earlybird.so/the-telegram-mini-apps-revolution/)

---

*이 기술 스펙은 2026년 1월 기준 Telegram Bot API v7.x, Mini App SDK v6.0+ 기반으로 작성되었습니다.*
