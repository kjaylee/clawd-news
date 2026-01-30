/**
 * 결제 콜백 처리 API
 * POST /api/payment — 결제 상태 확인/환불
 */
const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const { authMiddleware } = require('../middleware/auth');
const dbHelper = require('../db');

const BOT_TOKEN = process.env.BOT_TOKEN || '';

// ── 결제 상태 확인 ──
router.post('/', authMiddleware, (req, res) => {
    const { telegramId, productId } = req.body;
    const userId = telegramId || req.telegramUser?.id;

    if (!userId) {
        return res.status(400).json({ error: 'Missing telegramId' });
    }

    const payments = dbHelper.getPayments(userId, 10);
    const matching = payments.find(p => p.product_id === productId && p.status === 'completed');

    res.json({
        found: !!matching,
        payment: matching || null
    });
});

// ── 결제 내역 조회 ──
router.get('/history/:telegramId', authMiddleware, (req, res) => {
    const telegramId = parseInt(req.params.telegramId);
    const limit = parseInt(req.query.limit) || 20;

    // 본인 확인
    if (req.telegramUser.id !== telegramId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const payments = dbHelper.getPayments(telegramId, limit);
    res.json({ payments });
});

// ── 환불 요청 ──
router.post('/refund', authMiddleware, async (req, res) => {
    const { tg_charge_id } = req.body;

    if (!tg_charge_id) {
        return res.status(400).json({ error: 'Missing tg_charge_id' });
    }

    if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        return res.status(503).json({ error: 'Bot not configured' });
    }

    try {
        const bot = new TelegramBot(BOT_TOKEN);
        const payment = dbHelper.stmts.getPaymentByChargeId.get(tg_charge_id);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // 본인 확인
        if (payment.telegram_id !== req.telegramUser.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await bot.refundStarPayment(payment.telegram_id, tg_charge_id);

        // DB 상태 업데이트
        dbHelper.stmts.updatePaymentStatus.run('refunded', tg_charge_id);

        res.json({ success: true, message: 'Refund processed' });
    } catch (err) {
        console.error('[Refund] Error:', err.message);
        res.status(500).json({ error: 'Refund failed' });
    }
});

module.exports = router;
