/**
 * Telegram initData HMAC-SHA256 검증 미들웨어
 */
const crypto = require('crypto');

const BOT_TOKEN = process.env.BOT_TOKEN || '';

/**
 * initData 해시 검증
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function validateInitData(initData, botToken) {
    if (!initData || !botToken) return false;

    try {
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');
        if (!hash) return false;

        params.delete('hash');

        // 알파벳순 정렬 후 줄바꿈으로 연결
        const dataCheckString = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        // HMAC-SHA256: key = HMAC("WebAppData", botToken)
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();

        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        return calculatedHash === hash;
    } catch (err) {
        console.error('[Auth] Validation error:', err.message);
        return false;
    }
}

/**
 * 인증 미들웨어
 * X-Init-Data 헤더에서 initData를 검증하고,
 * req.telegramUser에 유저 정보를 설정합니다.
 */
function authMiddleware(req, res, next) {
    const initData = req.headers['x-init-data'];

    // 개발 모드: BOT_TOKEN 없으면 스킵
    if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.warn('[Auth] No BOT_TOKEN — skipping validation (dev mode)');
        // 개발용 기본 유저
        req.telegramUser = {
            id: parseInt(req.body?.userId) || 0,
            first_name: 'DevUser',
            username: 'devuser',
            language_code: 'ko'
        };
        return next();
    }

    if (!initData) {
        return res.status(401).json({ error: 'Missing X-Init-Data header' });
    }

    if (!validateInitData(initData, BOT_TOKEN)) {
        return res.status(401).json({ error: 'Invalid initData signature' });
    }

    // initData에서 유저 정보 추출
    try {
        const params = new URLSearchParams(initData);
        const userStr = params.get('user');
        req.telegramUser = userStr ? JSON.parse(userStr) : null;

        if (!req.telegramUser) {
            return res.status(401).json({ error: 'No user in initData' });
        }

        // auth_date 유효성 (5분 이내)
        const authDate = parseInt(params.get('auth_date'));
        const now = Math.floor(Date.now() / 1000);
        if (now - authDate > 300) {
            return res.status(401).json({ error: 'initData expired' });
        }

        next();
    } catch (err) {
        console.error('[Auth] Parse error:', err.message);
        return res.status(401).json({ error: 'Failed to parse initData' });
    }
}

module.exports = { validateInitData, authMiddleware };
