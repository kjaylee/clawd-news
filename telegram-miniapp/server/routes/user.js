/**
 * 유저 데이터 API
 * GET /api/user/:telegramId
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const dbHelper = require('../db');

// ── 유저 정보 조회 ──
router.get('/:telegramId', authMiddleware, (req, res) => {
    const telegramId = parseInt(req.params.telegramId);

    // 본인만 조회 가능
    if (req.telegramUser.id !== telegramId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const user = dbHelper.getUser(telegramId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // 결제 통계
    const payments = dbHelper.getPayments(telegramId, 100);
    const totalSpent = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);

    res.json({
        user: {
            telegram_id: user.telegram_id,
            username: user.username,
            first_name: user.first_name,
            is_premium: !!user.is_premium,
            created_at: user.created_at,
            last_active: user.last_active,
        },
        stats: {
            total_payments: payments.filter(p => p.status === 'completed').length,
            total_stars_spent: totalSpent,
        }
    });
});

// ── 유저 게임 상태 조회 ──
router.get('/:telegramId/game/:gameId', authMiddleware, (req, res) => {
    const telegramId = parseInt(req.params.telegramId);
    const gameId = req.params.gameId;

    if (req.telegramUser.id !== telegramId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const state = dbHelper.getGameState(telegramId, gameId);
    res.json({ state: state || {} });
});

// ── 유저 게임 상태 저장 ──
router.post('/:telegramId/game/:gameId', authMiddleware, (req, res) => {
    const telegramId = parseInt(req.params.telegramId);
    const gameId = req.params.gameId;

    if (req.telegramUser.id !== telegramId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    dbHelper.saveGameState(telegramId, gameId, req.body.state || {});
    res.json({ success: true });
});

module.exports = router;
