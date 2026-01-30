/**
 * tg-sdk-wrapper.js — Telegram Mini App SDK Wrapper
 * 
 * 모든 게임에서 공유하는 텔레그램 통합 모듈
 * 위치: /games/tg-sdk-wrapper.js
 * 배포: https://eastsea.monster/games/tg-sdk-wrapper.js
 * 
 * 기능:
 * - Telegram WebApp 초기화, 테마 적용
 * - 뒤로가기 버튼 처리
 * - 유저 데이터 수집 & 유저별 저장소
 * - 공유 기능 (친구 초대)
 * - 햅틱 피드백
 * - Stars 결제 준비 (Phase 2)
 * - 광고 SDK 준비 (Phase 2)
 * - 점수 기록 (localStorage 기반)
 */
(function() {
    'use strict';

    // ═══════════════════════════════════════
    // TG — Telegram WebApp SDK 래퍼
    // ═══════════════════════════════════════
    const TG = {
        app: window.Telegram?.WebApp,
        user: null,
        isReady: false,
        _backHandlers: [],

        // ── 초기화 ──
        init() {
            if (!this.app) {
                console.log('[TG] Not running in Telegram — standalone mode');
                this.isReady = true;
                this._injectStandaloneCSS();
                return false;
            }

            // 1. 앱 준비 완료 알림
            this.app.ready();

            // 2. 전체 화면 확장 (네비게이션 바 유지)
            this.app.expand();

            // 3. 전체 화면 모드는 수동 호출용으로만 제공
            //    자동 호출 시 네비게이션 바와 콘텐츠가 겹침
            //    게임에서 필요 시: TG.requestFullscreen()

            // 4. 유저 정보
            this.user = this.app.initDataUnsafe?.user || null;

            // 5. 테마 적용
            this._applyTheme();

            // 6. Safe Area 적용
            this._setupSafeArea();

            // 7. 뒤로가기 버튼
            this._setupBackButton();

            // 8. 뷰포트 변경 감지
            this.app.onEvent('viewportChanged', ({ isStateStable }) => {
                if (isStateStable) this._updateViewport();
            });

            // 9. 테마 변경 감지
            this.app.onEvent('themeChanged', () => this._applyTheme());

            this.isReady = true;
            console.log(`[TG] Initialized — user: ${this.getUserId()}, name: ${this.getUserName()}`);
            return true;
        },

        // ── 테마 ──
        _applyTheme() {
            const tp = this.app?.themeParams;
            if (!tp) return;

            const root = document.documentElement.style;
            const map = {
                '--tg-bg': tp.bg_color,
                '--tg-text': tp.text_color,
                '--tg-hint': tp.hint_color,
                '--tg-link': tp.link_color,
                '--tg-button': tp.button_color,
                '--tg-button-text': tp.button_text_color,
                '--tg-secondary-bg': tp.secondary_bg_color,
                '--tg-header-bg': tp.header_bg_color,
                '--tg-section-bg': tp.section_bg_color,
                '--tg-accent-text': tp.accent_text_color,
                '--tg-subtitle-text': tp.subtitle_text_color,
                '--tg-destructive-text': tp.destructive_text_color,
            };
            for (const [prop, val] of Object.entries(map)) {
                if (val) root.setProperty(prop, val);
            }
        },

        _setupSafeArea() {
            // ⚠️ env(safe-area-inset-*) CSS는 텔레그램 WebView에서 작동 안 함 (알려진 버그)
            // 반드시 JavaScript API로 값을 가져와서 CSS 변수에 직접 설정해야 함
            
            this._applySafeAreaValues();

            // safe area 변경 감지 (fullscreen 진입/해제, 회전 등)
            if (this.app?.onEvent) {
                this.app.onEvent('safeAreaChanged', () => {
                    console.log('[TG] safeAreaChanged:', this.app.safeAreaInset);
                    this._applySafeAreaValues();
                });
                this.app.onEvent('contentSafeAreaChanged', () => {
                    console.log('[TG] contentSafeAreaChanged:', this.app.contentSafeAreaInset);
                    this._applySafeAreaValues();
                });
            }

            this._updateViewport();
        },

        _applySafeAreaValues() {
            const root = document.documentElement.style;
            
            // Device safe area (노치, 홈 인디케이터 등)
            const sa = this.app?.safeAreaInset || { top: 0, bottom: 0, left: 0, right: 0 };
            // Content safe area (텔레그램 헤더 바 영역) — 핵심!
            const csa = this.app?.contentSafeAreaInset || { top: 0, bottom: 0, left: 0, right: 0 };

            // 개별 값 설정
            root.setProperty('--device-safe-top', `${sa.top}px`);
            root.setProperty('--device-safe-bottom', `${sa.bottom}px`);
            root.setProperty('--device-safe-left', `${sa.left}px`);
            root.setProperty('--device-safe-right', `${sa.right}px`);
            root.setProperty('--tg-content-safe-top', `${csa.top}px`);
            root.setProperty('--tg-content-safe-bottom', `${csa.bottom}px`);

            // 합산 (실제 콘텐츠 시작 위치)
            const totalTop = sa.top + csa.top;
            const totalBottom = sa.bottom + csa.bottom;
            root.setProperty('--safe-top', `${totalTop}px`);
            root.setProperty('--safe-bottom', `${totalBottom}px`);
            root.setProperty('--safe-left', `${sa.left}px`);
            root.setProperty('--safe-right', `${sa.right}px`);

            console.log(`[TG] Safe area applied — top:${totalTop}px bottom:${totalBottom}px (device:${sa.top}/${sa.bottom}, content:${csa.top}/${csa.bottom})`);

            // body padding 업데이트
            this._updateBodyPadding(totalTop, totalBottom);
        },

        _updateBodyPadding(top, bottom) {
            document.body.style.paddingTop = `${top}px`;
            document.body.style.paddingBottom = `${bottom}px`;
            document.body.style.boxSizing = 'border-box';
        },

        _updateViewport() {
            const vh = this.app?.viewportStableHeight || window.innerHeight;
            document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
        },

        _setupBackButton() {
            if (!this.app?.BackButton) return;
            this.app.BackButton.show();
            this.app.BackButton.onClick(() => {
                // 커스텀 핸들러 역순으로 실행
                for (let i = this._backHandlers.length - 1; i >= 0; i--) {
                    if (this._backHandlers[i]()) return; // handled
                }
                // 기본: 앱 닫기
                this.app.close();
            });
        },

        _injectStandaloneCSS() {
            // Telegram 외부에서 실행 시 기본 다크 테마 적용
            const root = document.documentElement.style;
            root.setProperty('--tg-bg', '#1a1a2e');
            root.setProperty('--tg-text', '#ffffff');
            root.setProperty('--tg-hint', '#999999');
            root.setProperty('--tg-link', '#4ea8ff');
            root.setProperty('--tg-button', '#3390ec');
            root.setProperty('--tg-button-text', '#ffffff');
            root.setProperty('--tg-secondary-bg', '#16213e');
            root.setProperty('--tg-viewport-height', `${window.innerHeight}px`);
            root.setProperty('--safe-top', '0px');
            root.setProperty('--safe-bottom', '0px');
        },

        // ── 풀스크린 (수동 호출용) ──
        requestFullscreen() {
            if (this.app?.requestFullscreen) {
                try { this.app.requestFullscreen(); } catch(e) {}
            }
        },
        exitFullscreen() {
            if (this.app?.exitFullscreen) {
                try { this.app.exitFullscreen(); } catch(e) {}
            }
        },

        // ── 유저 정보 ──
        getUserId()   { return this.user?.id || 'anonymous'; },
        getUserName() { return this.user?.first_name || 'Player'; },
        getLang()     { return this.user?.language_code || 'en'; },
        isPremium()   { return !!this.user?.is_premium; },
        isTelegram()  { return !!this.app; },

        // ── 유저별 저장소 (localStorage 기반) ──
        save(key, value) {
            try {
                const uid = this.getUserId();
                localStorage.setItem(`tg_${uid}_${key}`, JSON.stringify(value));
            } catch(e) { console.warn('[TG] save error:', e); }
        },

        load(key, fallback = null) {
            try {
                const uid = this.getUserId();
                const raw = localStorage.getItem(`tg_${uid}_${key}`);
                return raw ? JSON.parse(raw) : fallback;
            } catch { return fallback; }
        },

        remove(key) {
            try {
                const uid = this.getUserId();
                localStorage.removeItem(`tg_${uid}_${key}`);
            } catch {}
        },

        // ── 뒤로가기 핸들러 등록 ──
        // handler: () => boolean (true면 처리됨, false면 다음 핸들러)
        onBack(handler) {
            this._backHandlers.push(handler);
        },

        offBack(handler) {
            this._backHandlers = this._backHandlers.filter(h => h !== handler);
        },

        // ── 햅틱 피드백 ──
        haptic(type = 'impact', style = 'medium') {
            if (!this.app?.HapticFeedback) return;
            try {
                switch(type) {
                    case 'impact':       this.app.HapticFeedback.impactOccurred(style); break;
                    case 'notification': this.app.HapticFeedback.notificationOccurred(style); break;
                    case 'selection':    this.app.HapticFeedback.selectionChanged(); break;
                }
            } catch {}
        },

        // ── 공유 기능 ──
        shareScore(score, gameName, gameId) {
            const text = `🎮 ${gameName}에서 ${score.toLocaleString()}점 달성!\n도전해보세요! 👇`;
            const url = `https://t.me/eastsea_games_bot?startapp=game_${gameId || gameName.toLowerCase().replace(/\s+/g, '-')}`;
            
            if (this.app) {
                this.app.openTelegramLink(
                    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
                );
            }
        },

        shareInvite() {
            const text = '🎮 East Sea Games — 42개 무료 게임!\n지금 바로 플레이하세요 👇';
            const url = 'https://t.me/eastsea_games_bot';
            
            if (this.app) {
                this.app.openTelegramLink(
                    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
                );
            }
        },

        // ── 네이티브 팝업 ──
        popup(title, message, buttons) {
            return new Promise((resolve) => {
                if (this.app?.showPopup) {
                    this.app.showPopup({ title, message, buttons }, resolve);
                } else {
                    // Fallback
                    alert(`${title}\n${message}`);
                    resolve('ok');
                }
            });
        },

        alert(message) {
            return new Promise((resolve) => {
                if (this.app?.showAlert) {
                    this.app.showAlert(message, resolve);
                } else {
                    alert(message);
                    resolve();
                }
            });
        },

        confirm(message) {
            return new Promise((resolve) => {
                if (this.app?.showConfirm) {
                    this.app.showConfirm(message, resolve);
                } else {
                    resolve(confirm(message));
                }
            });
        },

        // ── 메인 버튼 (하단) ──
        showMainButton(text, callback) {
            if (!this.app?.MainButton) return;
            this.app.MainButton.text = text;
            this.app.MainButton.show();
            this.app.MainButton.onClick(callback);
        },

        hideMainButton() {
            if (this.app?.MainButton) this.app.MainButton.hide();
        },

        // ── 봇으로 데이터 전송 ──
        sendData(data) {
            if (this.app?.sendData) {
                this.app.sendData(JSON.stringify(data));
            }
        },

        // ── 외부 링크 열기 ──
        openLink(url) {
            if (this.app) {
                this.app.openLink(url);
            } else {
                window.open(url, '_blank');
            }
        }
    };

    // ═══════════════════════════════════════
    // GameScore — 점수 기록 모듈
    // ═══════════════════════════════════════
    const GameScore = {
        // 점수 저장 (localStorage 기반)
        save(gameId, score) {
            const uid = TG.getUserId();
            const key = `score_${gameId}`;
            
            // 현재 최고점수
            const best = this.getBest(gameId);
            const isNewBest = score > best;
            
            if (isNewBest) {
                TG.save(`${key}_best`, score);
            }

            // 최근 점수 기록 (최대 20개)
            const history = TG.load(`${key}_history`, []);
            history.unshift({ score, date: Date.now() });
            if (history.length > 20) history.pop();
            TG.save(`${key}_history`, history);

            // 플레이 횟수
            const plays = TG.load(`${key}_plays`, 0);
            TG.save(`${key}_plays`, plays + 1);

            return { isNewBest, bestScore: isNewBest ? score : best };
        },

        getBest(gameId) {
            return TG.load(`score_${gameId}_best`, 0);
        },

        getHistory(gameId) {
            return TG.load(`score_${gameId}_history`, []);
        },

        getPlays(gameId) {
            return TG.load(`score_${gameId}_plays`, 0);
        }
    };

    // ═══════════════════════════════════════
    // GameOverUI — 게임 오버 화면 + 공유 버튼
    // ═══════════════════════════════════════
    const GameOverUI = {
        _overlay: null,

        show(options) {
            const {
                gameId,
                gameName,
                score = 0,
                bestScore = 0,
                isNewBest = false,
                extra = '',        // 추가 정보 (레벨, 시간 등)
                onReplay = null,
                onHome = null,
            } = options;

            this.hide(); // 기존 오버레이 제거

            const lang = TG.getLang();
            const isKo = lang === 'ko';

            const overlay = document.createElement('div');
            overlay.id = 'tg-gameover';
            overlay.innerHTML = `
                <div class="tg-go-backdrop"></div>
                <div class="tg-go-card">
                    <div class="tg-go-title">${isKo ? '게임 오버' : 'Game Over'}</div>
                    ${isNewBest ? `<div class="tg-go-newbest">🏆 ${isKo ? '새로운 최고 기록!' : 'New Best!'}</div>` : ''}
                    <div class="tg-go-score">${score.toLocaleString()}</div>
                    <div class="tg-go-label">${isKo ? '점수' : 'Score'}</div>
                    <div class="tg-go-best">🏅 ${isKo ? '최고' : 'Best'}: ${bestScore.toLocaleString()}</div>
                    ${extra ? `<div class="tg-go-extra">${extra}</div>` : ''}
                    <div class="tg-go-buttons">
                        <button class="tg-go-btn tg-go-replay" data-action="replay">
                            🔄 ${isKo ? '다시 하기' : 'Replay'}
                        </button>
                        <button class="tg-go-btn tg-go-share" data-action="share">
                            📢 ${isKo ? '공유하기' : 'Share'}
                        </button>
                    </div>
                    <div class="tg-go-buttons secondary">
                        <button class="tg-go-btn tg-go-invite" data-action="invite">
                            👥 ${isKo ? '친구 초대' : 'Invite'}
                        </button>
                        ${onHome ? `<button class="tg-go-btn tg-go-home" data-action="home">🏠 ${isKo ? '홈' : 'Home'}</button>` : ''}
                    </div>
                </div>
            `;

            // 이벤트 바인딩
            overlay.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-action]');
                if (!btn) return;
                TG.haptic('impact', 'light');
                
                switch(btn.dataset.action) {
                    case 'replay':
                        this.hide();
                        if (onReplay) onReplay();
                        break;
                    case 'share':
                        TG.shareScore(score, gameName, gameId);
                        break;
                    case 'invite':
                        TG.shareInvite();
                        break;
                    case 'home':
                        this.hide();
                        if (onHome) onHome();
                        break;
                }
            });

            document.body.appendChild(overlay);
            this._overlay = overlay;

            // 입장 애니메이션
            requestAnimationFrame(() => overlay.classList.add('tg-go-show'));

            // 햅틱
            TG.haptic('notification', isNewBest ? 'success' : 'warning');
        },

        hide() {
            if (this._overlay) {
                this._overlay.remove();
                this._overlay = null;
            }
        }
    };

    // ═══════════════════════════════════════
    // Stars Payment — 결제 준비 (Phase 2)
    // ═══════════════════════════════════════
    const StarsPayment = {
        API_URL: 'https://eastsea.monster/api', // Phase 2에서 실제 서버 연결

        async purchase(productId) {
            if (!TG.isTelegram()) {
                TG.alert('텔레그램에서만 구매할 수 있습니다.');
                return false;
            }

            // Phase 2: 실제 결제 구현
            console.log('[Stars] Purchase requested:', productId);
            TG.alert('⭐ Stars 결제는 곧 오픈됩니다!');
            return false;
        },

        // 구매 가능 상태 체크
        isAvailable() {
            return TG.isTelegram() && !!TG.app?.openInvoice;
        }
    };

    // ═══════════════════════════════════════
    // AdManager — 광고 준비 (Phase 2)
    // ═══════════════════════════════════════
    const AdManager = {
        ready: false,

        init() {
            // Phase 2: RichAds / Monetag SDK 로드
            console.log('[Ads] Ad SDK will be loaded in Phase 2');
        },

        showRewarded(callback) {
            // Phase 2: 보상형 광고
            console.log('[Ads] Rewarded ad requested');
            // 개발 중에는 항상 보상 지급 (테스트)
            if (callback) callback(false);
        },

        isAvailable() {
            return this.ready;
        }
    };

    // ═══════════════════════════════════════
    // CSS 주입 — GameOver UI 스타일
    // ═══════════════════════════════════════
    const style = document.createElement('style');
    style.textContent = `
        /* TG SDK Wrapper — CSS Variables */
        :root {
            --tg-bg: #1a1a2e;
            --tg-text: #ffffff;
            --tg-hint: #999999;
            --tg-link: #4ea8ff;
            --tg-button: #3390ec;
            --tg-button-text: #ffffff;
            --tg-secondary-bg: #16213e;
            --tg-viewport-height: 100vh;
            --safe-top: env(safe-area-inset-top, 0px);
            --safe-bottom: env(safe-area-inset-bottom, 0px);
            --safe-left: env(safe-area-inset-left, 0px);
            --safe-right: env(safe-area-inset-right, 0px);
        }

        /* GameOver Overlay */
        #tg-gameover {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #tg-gameover.tg-go-show { opacity: 1; }

        .tg-go-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .tg-go-card {
            position: relative;
            background: var(--tg-secondary-bg, #16213e);
            border-radius: 20px;
            padding: 30px 24px;
            text-align: center;
            min-width: 280px;
            max-width: 340px;
            width: 85%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #tg-gameover.tg-go-show .tg-go-card {
            transform: scale(1) translateY(0);
        }

        .tg-go-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--tg-text, #fff);
            margin-bottom: 4px;
        }

        .tg-go-newbest {
            font-size: 14px;
            color: #ffd700;
            font-weight: 600;
            margin-bottom: 8px;
            animation: tg-go-pulse 1s ease-in-out infinite;
        }

        .tg-go-score {
            font-size: 48px;
            font-weight: 800;
            color: var(--tg-text, #fff);
            line-height: 1.1;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .tg-go-label {
            font-size: 13px;
            color: var(--tg-hint, #999);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
        }

        .tg-go-best {
            font-size: 15px;
            color: var(--tg-hint, #aaa);
            margin-bottom: 6px;
        }

        .tg-go-extra {
            font-size: 13px;
            color: var(--tg-hint, #888);
            margin-bottom: 10px;
        }

        .tg-go-buttons {
            display: flex;
            gap: 10px;
            margin-top: 16px;
        }
        .tg-go-buttons.secondary {
            margin-top: 8px;
        }

        .tg-go-btn {
            flex: 1;
            padding: 14px 12px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.15s, opacity 0.15s;
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .tg-go-btn:active { transform: scale(0.95); opacity: 0.85; }

        .tg-go-replay {
            background: var(--tg-button, #3390ec);
            color: var(--tg-button-text, #fff);
        }

        .tg-go-share {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: #fff;
        }

        .tg-go-invite {
            background: rgba(255,255,255,0.1);
            color: var(--tg-text, #fff);
            border: 1px solid rgba(255,255,255,0.15);
        }

        .tg-go-home {
            background: rgba(255,255,255,0.1);
            color: var(--tg-text, #fff);
            border: 1px solid rgba(255,255,255,0.15);
        }

        @keyframes tg-go-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);

    // ═══════════════════════════════════════
    // 전역 등록
    // ═══════════════════════════════════════
    window.TG = TG;
    window.GameScore = GameScore;
    window.GameOverUI = GameOverUI;
    window.StarsPayment = StarsPayment;
    window.AdManager = AdManager;

    // ═══════════════════════════════════════
    // 자동 초기화
    // ═══════════════════════════════════════
    function autoInit() {
        const isTG = TG.init();
        if (isTG) {
            console.log('[TG] Running inside Telegram Mini App');
        } else {
            console.log('[TG] Running in standalone browser');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }
})();
