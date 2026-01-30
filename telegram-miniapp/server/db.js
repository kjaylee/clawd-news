/**
 * SQLite 데이터베이스 (better-sqlite3)
 */
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'miniapp.db');

// data/ 폴더 생성
const fs = require('fs');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// WAL 모드 활성화 (성능)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── 스키마 초기화 ──
db.exec(`
    -- 유저 테이블
    CREATE TABLE IF NOT EXISTS users (
        telegram_id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        language_code TEXT DEFAULT 'en',
        is_premium INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        last_active TEXT DEFAULT (datetime('now'))
    );

    -- 결제 테이블
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER NOT NULL,
        product_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'XTR',
        tg_charge_id TEXT UNIQUE,
        provider_charge_id TEXT,
        status TEXT DEFAULT 'completed',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
    );

    -- 게임 상태 테이블
    CREATE TABLE IF NOT EXISTS game_state (
        telegram_id INTEGER NOT NULL,
        game_id TEXT NOT NULL,
        state_json TEXT NOT NULL DEFAULT '{}',
        updated_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (telegram_id, game_id),
        FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
    );

    -- 점수/리더보드 테이블
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER NOT NULL,
        game_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        period TEXT DEFAULT 'alltime',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
    );

    -- 인덱스
    CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game_id, score DESC);
    CREATE INDEX IF NOT EXISTS idx_scores_period ON scores(game_id, period, score DESC);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(telegram_id);
`);

// ── Prepared Statements ──
const stmts = {
    // 유저
    upsertUser: db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, last_name, language_code, is_premium, last_active)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(telegram_id) DO UPDATE SET
            username = excluded.username,
            first_name = excluded.first_name,
            last_name = excluded.last_name,
            language_code = excluded.language_code,
            is_premium = excluded.is_premium,
            last_active = datetime('now')
    `),
    getUser: db.prepare('SELECT * FROM users WHERE telegram_id = ?'),

    // 결제
    insertPayment: db.prepare(`
        INSERT INTO payments (telegram_id, product_id, amount, currency, tg_charge_id, provider_charge_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `),
    getPaymentsByUser: db.prepare('SELECT * FROM payments WHERE telegram_id = ? ORDER BY created_at DESC LIMIT ?'),
    getPaymentByChargeId: db.prepare('SELECT * FROM payments WHERE tg_charge_id = ?'),
    updatePaymentStatus: db.prepare('UPDATE payments SET status = ? WHERE tg_charge_id = ?'),

    // 게임 상태
    upsertGameState: db.prepare(`
        INSERT INTO game_state (telegram_id, game_id, state_json, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(telegram_id, game_id) DO UPDATE SET
            state_json = excluded.state_json,
            updated_at = datetime('now')
    `),
    getGameState: db.prepare('SELECT state_json FROM game_state WHERE telegram_id = ? AND game_id = ?'),

    // 점수
    insertScore: db.prepare(`
        INSERT INTO scores (telegram_id, game_id, score, period)
        VALUES (?, ?, ?, ?)
    `),
    getLeaderboard: db.prepare(`
        SELECT s.telegram_id, s.score, u.username, u.first_name,
               ROW_NUMBER() OVER (ORDER BY s.score DESC) as rank
        FROM scores s
        JOIN users u ON s.telegram_id = u.telegram_id
        WHERE s.game_id = ? AND s.period = ?
        ORDER BY s.score DESC
        LIMIT ?
    `),
    getUserBest: db.prepare(`
        SELECT MAX(score) as best_score FROM scores
        WHERE telegram_id = ? AND game_id = ? AND period = ?
    `),
};

module.exports = {
    db,
    stmts,

    // ── 헬퍼 함수 ──
    upsertUser(user) {
        return stmts.upsertUser.run(
            user.id, user.username || null, user.first_name || null,
            user.last_name || null, user.language_code || 'en',
            user.is_premium ? 1 : 0
        );
    },

    getUser(telegramId) {
        return stmts.getUser.get(telegramId);
    },

    savePayment(payment) {
        return stmts.insertPayment.run(
            payment.telegram_id, payment.product_id, payment.amount,
            payment.currency || 'XTR', payment.tg_charge_id || null,
            payment.provider_charge_id || null, payment.status || 'completed'
        );
    },

    getPayments(telegramId, limit = 20) {
        return stmts.getPaymentsByUser.all(telegramId, limit);
    },

    saveGameState(telegramId, gameId, state) {
        return stmts.upsertGameState.run(telegramId, gameId, JSON.stringify(state));
    },

    getGameState(telegramId, gameId) {
        const row = stmts.getGameState.get(telegramId, gameId);
        return row ? JSON.parse(row.state_json) : null;
    },

    saveScore(telegramId, gameId, score, period = 'alltime') {
        return stmts.insertScore.run(telegramId, gameId, score, period);
    },

    getLeaderboard(gameId, period = 'alltime', limit = 20) {
        return stmts.getLeaderboard.all(gameId, period, limit);
    },

    getUserBestScore(telegramId, gameId, period = 'alltime') {
        const row = stmts.getUserBest.get(telegramId, gameId, period);
        return row?.best_score || 0;
    }
};
