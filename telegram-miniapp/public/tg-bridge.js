/**
 * tg-bridge.js — 게임 내부에 삽입되는 Telegram 브릿지 스크립트
 * 
 * 이 파일은 convert-game.sh에 의해 각 게임 index.html에 삽입됩니다.
 * 래퍼(wrapper.html)의 iframe 안에서 실행되거나, 직접 로드될 때도 동작합니다.
 */
(function() {
    'use strict';

    const TGBridge = {
        app: window.Telegram?.WebApp,
        user: null,
        isIframe: window.self !== window.top,
        _initData: null,

        // ── 초기화 ──
        init() {
            // Telegram SDK 직접 사용 가능한 경우
            if (this.app) {
                this.app.ready();
                this.app.expand();
                this.user = this.app.initDataUnsafe?.user || null;
                this._initData = this.app.initData;
                this._applyTheme();
                this._setupSafeArea();
                this._setupBackButton();
            }

            // iframe 내부일 때: 래퍼로부터 컨텍스트 수신
            if (this.isIframe) {
                window.addEventListener('message', (e) => this._handleMessage(e));
            }

            console.log(`[TGBridge] init — user: ${this.getUserId()}, iframe: ${this.isIframe}`);
        },

        // ── 래퍼로부터 메시지 수신 ──
        _handleMessage(event) {
            const { type, user, theme, productId, watched, rewardType } = event.data || {};
            switch(type) {
                case 'tg-init':
                    if (user) this.user = user;
                    if (theme) this._applyThemeFromParams(theme);
                    break;
                case 'tg-payment-success':
                    this._onPaymentSuccess(productId);
                    break;
                case 'tg-ad-reward':
                    this._onAdReward();
                    break;
                case 'tg-ad-result':
                    this._onAdResult(watched, rewardType);
                    break;
                case 'tg-back':
                    this._onBack();
                    break;
            }
        },

        // ── 테마 ──
        _applyTheme() {
            if (!this.app?.themeParams) return;
            this._applyThemeFromParams(this.app.themeParams);
        },

        _applyThemeFromParams(tp) {
            const root = document.documentElement.style;
            if (tp.bg_color) root.setProperty('--tg-bg', tp.bg_color);
            if (tp.text_color) root.setProperty('--tg-text', tp.text_color);
            if (tp.hint_color) root.setProperty('--tg-hint', tp.hint_color);
            if (tp.link_color) root.setProperty('--tg-link', tp.link_color);
            if (tp.button_color) root.setProperty('--tg-button', tp.button_color);
            if (tp.button_text_color) root.setProperty('--tg-button-text', tp.button_text_color);
            if (tp.secondary_bg_color) root.setProperty('--tg-secondary-bg', tp.secondary_bg_color);
        },

        _setupSafeArea() {
            // CSS safe area는 브라우저가 자동 처리
            // 추가적으로 TG SDK safe area 적용
            if (this.app?.safeAreaInset) {
                const sa = this.app.safeAreaInset;
                const root = document.documentElement.style;
                root.setProperty('--safe-top', `${sa.top || 0}px`);
                root.setProperty('--safe-bottom', `${sa.bottom || 0}px`);
            }
            if (this.app?.contentSafeAreaInset) {
                const csa = this.app.contentSafeAreaInset;
                const totalTop = (this.app.safeAreaInset?.top || 0) + (csa.top || 0);
                document.documentElement.style.setProperty('--safe-top', `${totalTop}px`);
            }
        },

        _setupBackButton() {
            if (!this.app?.BackButton) return;
            this.app.BackButton.show();
            this.app.BackButton.onClick(() => this._onBack());
        },

        // ── 뒤로가기 처리 ──
        _onBack() {
            // 게임별 커스텀 핸들러가 있으면 호출
            if (typeof window.onTGBack === 'function') {
                const handled = window.onTGBack();
                if (handled) {
                    // 래퍼에 처리 완료 알림
                    if (this.isIframe) {
                        window.parent.postMessage({ type: 'tg-back-handled' }, '*');
                    }
                    return;
                }
            }
            // 처리 안 됨 → 앱 닫기
            if (this.app) this.app.close();
        },

        // ── 유틸리티 ──
        getUserId()   { return this.user?.id || 'anonymous'; },
        getUserName() { return this.user?.first_name || 'Player'; },
        isPremium()   { return !!this.user?.is_premium; },

        // 유저별 저장/로드
        save(key, value) {
            const uid = this.getUserId();
            localStorage.setItem(`tg_${uid}_${key}`, JSON.stringify(value));
        },
        load(key, fallback = null) {
            try {
                const uid = this.getUserId();
                const raw = localStorage.getItem(`tg_${uid}_${key}`);
                return raw ? JSON.parse(raw) : fallback;
            } catch { return fallback; }
        },

        // ── 래퍼에 요청 보내기 ──
        _postToWrapper(type, data = {}) {
            if (this.isIframe) {
                window.parent.postMessage({ type, data }, '*');
            }
        },

        // 상점 열기
        openShop(products) {
            if (this.isIframe) {
                this._postToWrapper('tg-open-shop', { products });
            } else if (this.app) {
                // 직접 로드 시: showPopup으로 대체
                this.app.showAlert('상점 기능은 래퍼 모드에서 사용 가능합니다.');
            }
        },

        // 결제 요청
        purchase(productId) {
            this._postToWrapper('tg-purchase', { productId });
        },

        // 보상형 광고 요청
        showAd(rewardType) {
            this._postToWrapper('tg-show-ad', { rewardType });
        },

        // 햅틱 피드백
        haptic(hapticType, style) {
            if (this.app?.HapticFeedback) {
                switch(hapticType) {
                    case 'impact':       this.app.HapticFeedback.impactOccurred(style || 'medium'); break;
                    case 'notification': this.app.HapticFeedback.notificationOccurred(style || 'success'); break;
                    case 'selection':    this.app.HapticFeedback.selectionChanged(); break;
                }
            } else {
                this._postToWrapper('tg-haptic', { hapticType, style });
            }
        },

        // 점수 공유
        shareScore(score, gameName) {
            const text = `🎮 ${gameName}에서 ${score}점 달성!\n도전해보세요! 👇`;
            if (this.app) {
                this.app.openTelegramLink(
                    `https://t.me/share/url?text=${encodeURIComponent(text)}`
                );
            } else {
                this._postToWrapper('tg-share', { text });
            }
        },

        // 점수 서버 저장
        saveScore(gameId, score) {
            this._postToWrapper('tg-save-score', { gameId, score });
        },

        // ── 결제/광고 결과 콜백 (게임이 오버라이드) ──
        _onPaymentSuccess(productId) {
            if (typeof window.onTGPaymentSuccess === 'function') {
                window.onTGPaymentSuccess(productId);
            }
        },
        _onAdReward() {
            if (typeof window.onTGAdReward === 'function') {
                window.onTGAdReward();
            }
        },
        _onAdResult(watched, rewardType) {
            if (typeof window.onTGAdResult === 'function') {
                window.onTGAdResult(watched, rewardType);
            }
        }
    };

    // CSS 변수 기본값 삽입
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --tg-bg: #ffffff;
            --tg-text: #000000;
            --tg-hint: #999999;
            --tg-link: #2481cc;
            --tg-button: #2481cc;
            --tg-button-text: #ffffff;
            --tg-secondary-bg: #f0f0f0;
            --safe-top: env(safe-area-inset-top, 0px);
            --safe-bottom: env(safe-area-inset-bottom, 0px);
        }
    `;
    document.head.appendChild(style);

    // 전역 등록
    window.TGBridge = TGBridge;

    // DOM 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TGBridge.init());
    } else {
        TGBridge.init();
    }
})();
