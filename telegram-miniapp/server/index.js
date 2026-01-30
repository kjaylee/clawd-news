/**
 * East Sea Games — Telegram Mini App 백엔드 서버
 * Express + better-sqlite3
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { validateInitData, authMiddleware } = require('./middleware/auth');
const invoiceRoutes = require('./routes/invoice');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');
const scoreRoutes = require('./routes/score');
const webhookRoutes = require('./routes/webhook');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ── 미들웨어 ──
app.use(helmet({
    contentSecurityPolicy: false, // Mini App에서 외부 리소스 로드 허용
}));
app.use(cors({
    origin: ['https://eastsea.monster', 'https://web.telegram.org', /\.telegram\.org$/],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-Init-Data'],
}));
app.use(morgan('combined'));
app.use(express.json());

// ── 정적 파일 (public/) ──
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// ── 헬스 체크 ──
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// ── API 라우트 ──
app.use('/api/webhook', webhookRoutes);    // Telegram Bot webhook
app.use('/api/invoice', invoiceRoutes);    // Stars Invoice 생성
app.use('/api/payment', paymentRoutes);    // 결제 콜백 처리
app.use('/api/user', userRoutes);          // 유저 데이터
app.use('/api/score', scoreRoutes);        // 점수 저장/조회

// ── 에러 핸들러 ──
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack || err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ── 서버 시작 ──
app.listen(PORT, () => {
    console.log(`🚀 East Sea Games API server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Bot token: ${process.env.BOT_TOKEN ? '✅ configured' : '❌ missing'}`);
});

module.exports = app;
