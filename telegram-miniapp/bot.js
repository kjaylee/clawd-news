/**
 * East Sea Games — Telegram Bot
 * 
 * 기능:
 * - /start: 환영 메시지 + TOP 5 게임 인라인 키보드
 * - /games: 전체 게임 목록
 * - /shop:  상점 (Stars 구매)
 * - /help:  도움말
 * - Menu Button: Mini App 직접 열기
 * - Pre-checkout / Payment 핸들러
 * 
 * 사용법:
 *   BOT_TOKEN=xxx node bot.js
 */
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const dbHelper = require('./server/db');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://eastsea.monster/games';
const API_URL = process.env.API_URL || 'http://localhost:3000';

if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.error('❌ BOT_TOKEN이 설정되지 않았습니다.');
    console.error('   .env 파일에 BOT_TOKEN=<your_token>을 추가하세요.');
    console.error('   토큰 발급: @BotFather → /newbot');
    process.exit(1);
}

// Polling 모드로 봇 시작 (개발용)
// 프로덕션에서는 webhook 사용 권장
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 East Sea Games Bot started (polling mode)');

// ══════════════════════════════════════
// 상품 카탈로그
// ══════════════════════════════════════
const PRODUCTS = {
    coins_s:  { title: '💰 코인 팩 S',       desc: '5,000 코인',        amount: 10 },
    coins_m:  { title: '💰 코인 팩 M',       desc: '30,000 코인',       amount: 50 },
    coins_l:  { title: '💰 코인 팩 L',       desc: '75,000 코인',       amount: 100 },
    spins_5:  { title: '🎰 추가 스핀 5회',   desc: '즉시 스핀 5회 충전', amount: 15 },
    lives_5:  { title: '❤️ 생명 5개',         desc: '즉시 생명 5개 충전', amount: 10 },
    revive:   { title: '💚 부활',             desc: '즉시 부활',          amount: 10 },
    vip_1d:   { title: '👑 VIP 1일',         desc: '24시간 2x 보상',     amount: 50 },
};

// ══════════════════════════════════════
// TOP 5 게임 데이터
// ══════════════════════════════════════
const TOP_GAMES = [
    { id: 'spin-village',           name: '🎰 Spin Village',        desc: '슬롯 + 마을 경영',     emoji: '🎰' },
    { id: 'crystal-match',          name: '💎 Crystal Match',       desc: '매치3 퍼즐',           emoji: '💎' },
    { id: 'screw-sort-factory',     name: '🔩 Screw Sort Factory',  desc: '나사 분류 퍼즐',        emoji: '🔩' },
    { id: 'slime-survivor-premium', name: '🟢 Slime Survivor',     desc: '뱀서라이크 서바이벌',    emoji: '🟢' },
    { id: 'idle-slime-merge',       name: '🫧 Idle Slime Merge',   desc: '아이들 + 머지',         emoji: '🫧' },
];

// ══════════════════════════════════════
// /start 명령어
// ══════════════════════════════════════
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    const startParam = (match[1] || '').trim();

    // 유저 저장
    dbHelper.upsertUser(user);

    // 딥링크 파라미터 처리 (예: /start game_spin-village)
    if (startParam.startsWith('game_')) {
        const gameId = startParam.replace('game_', '');
        const game = TOP_GAMES.find(g => g.id === gameId);
        if (game) {
            bot.sendMessage(chatId,
                `${game.emoji} **${game.name}**\n${game.desc}\n\n아래 버튼을 눌러 플레이하세요!`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: `🎮 ${game.name} 플레이`, web_app: { url: `${WEBAPP_URL}/${game.id}/` } }],
                            [{ text: '📋 다른 게임 보기', callback_data: 'show_games' }]
                        ]
                    }
                }
            );
            return;
        }
    }

    // 기본 환영 메시지
    const keyboard = TOP_GAMES.map(g => ([{
        text: g.name,
        web_app: { url: `${WEBAPP_URL}/${g.id}/` }
    }]));
    keyboard.push([{ text: '📋 전체 게임 목록 (42개)', web_app: { url: `${WEBAPP_URL}/` } }]);

    bot.sendMessage(chatId,
        `🎮 안녕하세요 **${user.first_name}**님!\n\n` +
        `**East Sea Games**에 오신 걸 환영합니다!\n` +
        `42개 HTML5 게임을 무료로 즐기세요!\n\n` +
        `🏆 **TOP 5 인기 게임** ↓`,
        {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: keyboard }
        }
    );
});

// ══════════════════════════════════════
// /games 명령어
// ══════════════════════════════════════
bot.onText(/\/games/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = TOP_GAMES.map(g => ([{
        text: g.name,
        web_app: { url: `${WEBAPP_URL}/${g.id}/` }
    }]));
    keyboard.push([{ text: '🎮 전체 게임 허브', web_app: { url: `${WEBAPP_URL}/` } }]);

    bot.sendMessage(chatId,
        `📋 **게임 목록**\n\n` +
        TOP_GAMES.map((g, i) => `${i + 1}. ${g.name} — ${g.desc}`).join('\n') +
        `\n\n... 외 37개 게임!\n아래 버튼으로 바로 플레이 👇`,
        {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: keyboard }
        }
    );
});

// ══════════════════════════════════════
// /shop 명령어
// ══════════════════════════════════════
bot.onText(/\/shop/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = Object.entries(PRODUCTS).map(([id, p]) => ([{
        text: `${p.title} — ⭐ ${p.amount}`,
        callback_data: `buy_${id}`
    }]));

    bot.sendMessage(chatId,
        `🛒 **상점**\n\n` +
        `⭐ Telegram Stars로 아이템을 구매하세요!\n` +
        `게임 안에서도 구매할 수 있어요.`,
        {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: keyboard }
        }
    );
});

// ══════════════════════════════════════
// /help 명령어
// ══════════════════════════════════════
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `❓ **도움말**\n\n` +
        `**명령어:**\n` +
        `/start — 게임 시작\n` +
        `/games — 게임 목록\n` +
        `/shop — 상점 (Stars 구매)\n` +
        `/help — 도움말\n\n` +
        `**게임 방법:**\n` +
        `1️⃣ 버튼을 눌러 게임을 선택하세요\n` +
        `2️⃣ 텔레그램 안에서 바로 플레이!\n` +
        `3️⃣ ⭐ Stars로 아이템 구매 가능\n` +
        `4️⃣ 📺 광고 보고 무료 보상 받기\n\n` +
        `🎮 즐거운 게임 되세요!`,
        { parse_mode: 'Markdown' }
    );
});

// ══════════════════════════════════════
// 콜백 쿼리 (인라인 버튼)
// ══════════════════════════════════════
bot.on('callback_query', async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    await bot.answerCallbackQuery(query.id);

    // 게임 목록 표시
    if (data === 'show_games') {
        const keyboard = TOP_GAMES.map(g => ([{
            text: g.name,
            web_app: { url: `${WEBAPP_URL}/${g.id}/` }
        }]));
        await bot.sendMessage(chatId, '🎮 게임을 선택하세요:', {
            reply_markup: { inline_keyboard: keyboard }
        });
        return;
    }

    // 구매 요청
    if (data.startsWith('buy_')) {
        const productId = data.replace('buy_', '');
        const product = PRODUCTS[productId];
        if (!product) return;

        try {
            const payload = JSON.stringify({
                productId,
                userId: query.from.id,
                timestamp: Date.now()
            });

            const invoiceLink = await bot.createInvoiceLink(
                product.title,
                product.desc,
                payload,
                '',      // provider_token (Stars = 빈 문자열)
                'XTR',   // currency (Telegram Stars)
                [{ label: product.title, amount: product.amount }]
            );

            await bot.sendMessage(chatId,
                `${product.title}\n${product.desc}\n\n💰 가격: ⭐ ${product.amount} Stars`,
                {
                    reply_markup: {
                        inline_keyboard: [[{
                            text: `⭐ ${product.amount} Stars 결제`,
                            url: invoiceLink
                        }]]
                    }
                }
            );
        } catch (err) {
            console.error('[Bot] Invoice error:', err.message);
            await bot.sendMessage(chatId, '❌ 결제 링크 생성에 실패했습니다. 다시 시도해주세요.');
        }
    }
});

// ══════════════════════════════════════
// 결제 핸들러
// ══════════════════════════════════════

// Pre-checkout (결제 전 확인 — 10초 내 응답 필수!)
bot.on('pre_checkout_query', async (query) => {
    try {
        const payload = JSON.parse(query.invoice_payload);
        const product = PRODUCTS[payload.productId];

        if (!product) {
            await bot.answerPreCheckoutQuery(query.id, false, {
                error_message: '상품을 찾을 수 없습니다.'
            });
            return;
        }

        await bot.answerPreCheckoutQuery(query.id, true);
        console.log(`✅ Pre-checkout approved: ${payload.productId} for user ${query.from.id}`);
    } catch (err) {
        console.error('[Bot] Pre-checkout error:', err.message);
        await bot.answerPreCheckoutQuery(query.id, false, {
            error_message: '결제 처리 중 오류가 발생했습니다.'
        });
    }
});

// 결제 성공
bot.on('message', async (msg) => {
    if (!msg.successful_payment) return;

    const payment = msg.successful_payment;
    const payload = JSON.parse(payment.invoice_payload);
    const product = PRODUCTS[payload.productId];

    console.log(`💰 Payment: ${payment.total_amount} Stars | user: ${msg.from.id} | product: ${payload.productId}`);

    // DB 기록
    dbHelper.upsertUser(msg.from);
    dbHelper.savePayment({
        telegram_id: msg.from.id,
        product_id: payload.productId,
        amount: payment.total_amount,
        currency: payment.currency,
        tg_charge_id: payment.telegram_payment_charge_id,
        provider_charge_id: payment.provider_payment_charge_id,
        status: 'completed'
    });

    // 확인 메시지
    const productTitle = product ? product.title : `상품 (${payload.productId})`;
    await bot.sendMessage(msg.chat.id,
        `✅ 결제 완료!\n\n` +
        `${productTitle} 지급되었습니다.\n` +
        `게임으로 돌아가서 확인해주세요! 🎮`
    );
});

// ══════════════════════════════════════
// 봇 초기 설정 (메뉴 버튼)
// ══════════════════════════════════════
async function setupBot() {
    try {
        // 메뉴 버튼 설정
        await bot.setChatMenuButton({
            menu_button: {
                type: 'web_app',
                text: '🎮 Play Games',
                web_app: { url: `${WEBAPP_URL}/spin-village/` }
            }
        });
        console.log('✅ Menu button set');

        // 봇 명령어 설정
        await bot.setMyCommands([
            { command: 'start', description: '🎮 게임 시작' },
            { command: 'games', description: '📋 게임 목록' },
            { command: 'shop',  description: '🛒 상점 (Stars)' },
            { command: 'help',  description: '❓ 도움말' },
        ]);
        console.log('✅ Commands set');
    } catch (err) {
        console.error('[Bot] Setup error:', err.message);
    }
}

setupBot();

// 에러 핸들러
bot.on('polling_error', (err) => {
    console.error('[Bot] Polling error:', err.message);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Bot stopping...');
    bot.stopPolling();
    process.exit(0);
});
