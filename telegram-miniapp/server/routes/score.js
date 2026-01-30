/**
 * 점수 저장 / 리더보드 API
 * POST /api/score — 점수 저장
 * GET  /api/score/leaderboard/:gameId — 리더보드 조회
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const dbHelper = require('../db');

// ── 점수 저장 ──
router.post('/', authMiddleware, (req, res) => {
    const { gameId, score } = req.body;
    const userId = req.telegramUser.id;

    if (!gameId || score === undefined) {
        return res.status(400).json({ error: 'Missing gameId or score' });
    }

    const numScore = parseInt(score);
    if (isNaN(numScore)) {
        return res.status(400).json({ error: 'Invalid score' });
    }

    // 유저 upsert
    dbHelper.upsertUser(req.telegramUser);

    // 현재 주간 기간 키 (ISO 주차)
    const now = new Date();
    const weekKey = `week_${now.getFullYear()}_${getISOWeek(now)}`;
    const monthKey = `month_${now.getFullYear()}_${now.getMonth() + 1}`;

    // 최고 점수 체크
    const currentBest = dbHelper.getUserBestScore(userId, gameId, 'alltime');
    const isNewBest = numScore > currentBest;

    // alltime, weekly, monthly 모두 저장
    dbHelper.saveScore(userId, gameId, numScore, 'alltime');
    dbHelper.saveScore(userId, gameId, numScore, weekKey);
    dbHelper.saveScore(userId, gameId, numScore, monthKey);

    res.json({
        success: true,
        newBest: isNewBest,
        bestScore: isNewBest ? numScore : currentBest
    });
});

// ── 리더보드 조회 ──
router.get('/leaderboard/:gameId', (req, res) => {
    const { gameId } = req.params;
    const { period = 'alltime', limit = 20 } = req.query;

    let periodKey = period;
    if (period === 'weekly') {
        const now = new Date();
        periodKey = `week_${now.getFullYear()}_${getISOWeek(now)}`;
    } else if (period === 'monthly') {
        const now = new Date();
        periodKey = `month_${now.getFullYear()}_${now.getMonth() + 1}`;
    }

    const leaders = dbHelper.getLeaderboard(gameId, periodKey, parseInt(limit));
    res.json({ leaders, period: periodKey });
});

// ── 유저 최고 점수 ──
router.get('/best/:gameId/:telegramId', (req, res) => {
    const { gameId, telegramId } = req.params;
    const best = dbHelper.getUserBestScore(parseInt(telegramId), gameId, 'alltime');
    res.json({ bestScore: best });
});

// ── 유틸: ISO 주차 계산 ──
function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

module.exports = router;
