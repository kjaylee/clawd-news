/**
 * Telegram Bot Webhook 핸들러
 * POST /api/webhook
 */
const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const dbHelper = require('../db');
const { PRODUCTS } = require('./invoice');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://eastsea.monster/games';

let bot = null;
if (BOT_TOKEN && BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
    bot = new TelegramBot(BOT_TOKEN);
}

// ── Webhook 수신 ──
router.post('/', async (req, res) => {
    try {
        if (!bot) {
            console.warn('[Webhook] No bot token — ignoring');
            return res.sendStatus(200);
        }

        const update = req.body;

        // Pre-checkout query (결제 전 확인 — 10초 내 응답 필수!)
        if (update.pre_checkout_query) {
            await handlePreCheckout(update.pre_checkout_query);
        }

        // 메시지 (결제 성공 포함)
        if (update.message) {
            await handleMessage(update.message);
        }

        // 콜백 쿼리 (인라인 버튼 클릭)
        if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('[Webhook] Error:', err.message);
        res.sendStatus(200); // Telegram은 200이 아니면 재시도함
    }
});

// ── Pre-Checkout 핸들러 ──
async function handlePreCheckout(query) {
    try {
        const payload = JSON.parse(query.invoice_payload);
        const product = PRODUCTS[payload.productId];

        if (!product) {
            await bot.answerPreCheckoutQuery(query.id, false, {
                error_message: '상품을 찾을 수 없습니다.'
            });
            return;
        }

        // 결제 승인
        await bot.answerPreCheckoutQuery(query.id, true);
        console.log(`[Payment] Pre-checkout approved: ${payload.productId} for user ${query.from.id}`);
    } catch (err) {
        console.error('[Payment] Pre-checkout error:', err.message);
        try {
            await bot.answerPreCheckoutQuery(query.id, false, {
                error_message: '결제 처리 중 오류가 발생했습니다.'
            });
        } catch(e) {}
    }
}

// ── 메시지 핸들러 ──
async function handleMessage(msg) {
    // 결제 성공
    if (msg.successful_payment) {
        await handleSuccessfulPayment(msg);
        return;
    }

    // 텍스트 명령어
    const text = msg.text || '';
    const chatId = msg.chat.id;

    if (text === '/start') {
        await sendStartMessage(chatId, msg.from);
    } else if (text === '/games') {
        await sendGamesList(chatId);
    } else if (text === '/help') {
        await sendHelp(chatId);
    }
}

// ── 결제 성공 처리 ──
async function handleSuccessfulPayment(msg) {
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
    await bot.sendMessage(msg.chat.id,
        `✅ 결제 완료!\n\n` +
        `${product.title} 지급되었습니다.\n` +
        `게임으로 돌아가서 확인해주세요! 🎮`,
        {
            reply_markup: {
                inline_keyboard: [[{
                    text: '🎮 게임으로 돌아가기',
                    web_app: { url: `${WEBAPP_URL}/${product.game}/` }
                }]]
            }
        }
    );
}

// ── /start 명령어 ──
async function sendStartMessage(chatId, user) {
    dbHelper.upsertUser(user);

    await bot.sendMessage(chatId,
        `🎮 안녕하세요 ${user.first_name}님!\n\n` +
        `**East Sea Games**에 오신 걸 환영합니다!\n` +
        `42개 HTML5 게임을 무료로 즐기세요!\n\n` +
        `🏆 TOP 5 인기 게임을 추천드릴게요 ↓`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎰 Spin Village', web_app: { url: `${WEBAPP_URL}/spin-village/` } }],
                    [{ text: '💎 Crystal Match', web_app: { url: `${WEBAPP_URL}/crystal-match/` } }],
                    [{ text: '🔩 Screw Sort Factory', web_app: { url: `${WEBAPP_URL}/screw-sort-factory/` } }],
                    [{ text: '🟢 Slime Survivor', web_app: { url: `${WEBAPP_URL}/slime-survivor-premium/` } }],
                    [{ text: '🫧 Idle Slime Merge', web_app: { url: `${WEBAPP_URL}/idle-slime-merge/` } }],
                    [{ text: '📋 전체 게임 목록 (42개)', web_app: { url: `${WEBAPP_URL}/` } }]
                ]
            }
        }
    );
}

// ── /games 게임 목록 ──
async function sendGamesList(chatId) {
    await bot.sendMessage(chatId,
        `📋 **전체 게임 목록**\n\n` +
        `🎰 캐주얼\n` +
        `• Spin Village — 슬롯 + 마을 경영\n` +
        `• Dice Master — 주사위 게임\n\n` +
        `💎 퍼즐\n` +
        `• Crystal Match — 매치3\n` +
        `• Screw Sort Factory — 나사 정렬\n` +
        `• Ball Sort — 공 분류\n` +
        `• Pipe Connect — 파이프 연결\n\n` +
        `⚔️ 서바이벌\n` +
        `• Slime Survivor — 뱀서라이크\n` +
        `• Zombie Survivor — 좀비 서바이벌\n\n` +
        `🏭 아이들/머지\n` +
        `• Idle Slime Merge — 아이들 머지\n` +
        `• Merge Rush — 합체 러시\n\n` +
        `... 외 32개 게임!\n\n` +
        `아래 버튼으로 전체 목록을 확인하세요 👇`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎮 게임 허브 열기', web_app: { url: `${WEBAPP_URL}/` } }]
                ]
            }
        }
    );
}

// ── /help ──
async function sendHelp(chatId) {
    await bot.sendMessage(chatId,
        `❓ **도움말**\n\n` +
        `/start — 게임 시작\n` +
        `/games — 전체 게임 목록\n` +
        `/help — 도움말\n\n` +
        `💡 게임 안에서 ⭐ Stars로 아이템을 구매하거나\n` +
        `📺 광고를 보고 무료 보상을 받을 수 있어요!\n\n` +
        `🎮 즐거운 게임 되세요!`,
        { parse_mode: 'Markdown' }
    );
}

// ── 콜백 쿼리 핸들러 ──
async function handleCallbackQuery(query) {
    const data = query.data;
    if (!data) return;

    await bot.answerCallbackQuery(query.id);

    // 구매 콜백
    if (data.startsWith('buy_')) {
        const productId = data.replace('buy_', '');
        const product = PRODUCTS[productId];
        if (product) {
            try {
                const payload = JSON.stringify({
                    productId,
                    userId: query.from.id,
                    timestamp: Date.now()
                });
                const invoiceLink = await bot.createInvoiceLink(
                    product.title, product.desc, payload,
                    '', 'XTR',
                    [{ label: product.title, amount: product.amount }]
                );
                await bot.sendMessage(query.message.chat.id,
                    `${product.title}\n${product.desc}\n\n가격: ⭐ ${product.amount} Stars`,
                    {
                        reply_markup: {
                            inline_keyboard: [[{
                                text: `⭐ ${product.amount} Stars 결제하기`,
                                url: invoiceLink
                            }]]
                        }
                    }
                );
            } catch(err) {
                console.error('[Callback] Invoice error:', err.message);
            }
        }
    }
}

module.exports = router;
