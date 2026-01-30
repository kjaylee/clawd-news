/**
 * Stars Invoice 생성 API
 * POST /api/invoice
 */
const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const { authMiddleware } = require('../middleware/auth');
const dbHelper = require('../db');

const BOT_TOKEN = process.env.BOT_TOKEN || '';

// ── 상품 카탈로그 ──
const PRODUCTS = {
    // Spin Village
    coins_s:     { title: '💰 코인 팩 S',       desc: '5,000 코인',             amount: 10,  game: 'spin-village',       reward: { type: 'coins', value: 5000 } },
    coins_m:     { title: '💰 코인 팩 M',       desc: '30,000 코인',            amount: 50,  game: 'spin-village',       reward: { type: 'coins', value: 30000 } },
    coins_l:     { title: '💰 코인 팩 L',       desc: '75,000 코인',            amount: 100, game: 'spin-village',       reward: { type: 'coins', value: 75000 } },
    spins_5:     { title: '🎰 추가 스핀 5회',   desc: '즉시 스핀 5회 충전',      amount: 15,  game: 'spin-village',       reward: { type: 'spins', value: 5 } },
    shield:      { title: '🛡️ 실드 1개',        desc: '공격 1회 방어',           amount: 20,  game: 'spin-village',       reward: { type: 'shields', value: 1 } },
    vip_1d:      { title: '👑 VIP 1일',         desc: '24시간 2x 보상',          amount: 50,  game: 'spin-village',       reward: { type: 'vip_hours', value: 24 } },
    vip_7d:      { title: '👑 VIP 7일',         desc: '7일 2x 보상 + 특별 마을',  amount: 200, game: 'spin-village',       reward: { type: 'vip_hours', value: 168 } },
    // Crystal Match
    lives_5:     { title: '❤️ 생명 5개',         desc: '즉시 생명 5개 충전',       amount: 10,  game: 'crystal-match',      reward: { type: 'lives', value: 5 } },
    moves_5:     { title: '➕ 이동 +5',          desc: '추가 이동 5회',            amount: 5,   game: 'crystal-match',      reward: { type: 'moves', value: 5 } },
    powerup_cb:  { title: '💣 색상 폭탄',        desc: '강력한 파워업',            amount: 8,   game: 'crystal-match',      reward: { type: 'powerup', value: 'color_bomb' } },
    // Screw Sort Factory
    hint_1:      { title: '💡 힌트 1개',         desc: '최적 이동 힌트',           amount: 3,   game: 'screw-sort-factory', reward: { type: 'hints', value: 1 } },
    undo_1:      { title: '↩️ 되돌리기',          desc: '마지막 이동 취소',          amount: 5,   game: 'screw-sort-factory', reward: { type: 'undos', value: 1 } },
    extra_slot:  { title: '🔲 추가 슬롯',        desc: '빈 구멍 슬롯 1개 추가',    amount: 10,  game: 'screw-sort-factory', reward: { type: 'slots', value: 1 } },
    // Slime Survivor
    revive:      { title: '💚 부활',             desc: '즉시 부활 (체력 전체 회복)', amount: 10,  game: 'slime-survivor',     reward: { type: 'revives', value: 1 } },
    skin_fire:   { title: '🔥 불꽃 스킨',        desc: '영구 불꽃 슬라임 스킨',     amount: 50,  game: 'slime-survivor',     reward: { type: 'skin', value: 'fire' } },
    // Idle Slime Merge
    gold_s:      { title: '🪙 골드 10,000',      desc: '기본 골드 팩',             amount: 10,  game: 'idle-slime-merge',   reward: { type: 'gold', value: 10000 } },
    boost_2x:    { title: '⚡ 2x 속도 (영구)',    desc: '영구 2배 속도 부스트',      amount: 30,  game: 'idle-slime-merge',   reward: { type: 'boost', value: '2x_permanent' } },
    offline_3x:  { title: '🌙 오프라인 3x',      desc: '24시간 오프라인 3배 수익',  amount: 20,  game: 'idle-slime-merge',   reward: { type: 'offline_boost', value: 24 } },
};

// ── Invoice 생성 ──
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId, userId } = req.body;
        const product = PRODUCTS[productId];

        if (!product) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // BOT_TOKEN 없으면 개발 모드
        if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
            return res.json({
                invoiceLink: `https://t.me/$pay?slug=dev_${productId}_${Date.now()}`,
                dev: true,
                product
            });
        }

        const bot = new TelegramBot(BOT_TOKEN);

        const payload = JSON.stringify({
            productId,
            userId: userId || req.telegramUser.id,
            timestamp: Date.now()
        });

        const invoiceLink = await bot.createInvoiceLink(
            product.title,
            product.desc,
            payload,
            '',       // provider_token: Stars는 빈 문자열
            'XTR',    // currency: Telegram Stars
            [{ label: product.title, amount: product.amount }]
        );

        // 유저 정보 업데이트
        dbHelper.upsertUser(req.telegramUser);

        res.json({ invoiceLink });
    } catch (err) {
        console.error('[Invoice] Error:', err.message);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// ── 상품 목록 조회 ──
router.get('/products', (req, res) => {
    const { game } = req.query;
    let products = Object.entries(PRODUCTS).map(([id, p]) => ({
        id, ...p
    }));
    if (game) {
        products = products.filter(p => p.game === game);
    }
    res.json({ products });
});

module.exports = router;
module.exports.PRODUCTS = PRODUCTS;
