/**
 * Lightweight i18n module for Telegram Mini App games
 * Supports: en (default), ko
 * Size: <1KB minified
 * 
 * Usage:
 *   <script src="../i18n.js"></script>
 *   <script>
 *     const T = GameI18n({
 *       start: { en: 'Start', ko: '시작' },
 *       gameOver: { en: 'Game Over', ko: '게임 오버' }
 *     });
 *     // T('start') → returns localized string
 *   </script>
 */

(function() {
  'use strict';

  // Detect user language: Telegram WebApp > navigator.language > 'en'
  function detectLanguage() {
    try {
      var tgLang = window.Telegram &&
        window.Telegram.WebApp &&
        window.Telegram.WebApp.initDataUnsafe &&
        window.Telegram.WebApp.initDataUnsafe.user &&
        window.Telegram.WebApp.initDataUnsafe.user.language_code;
      if (tgLang && tgLang.startsWith('ko')) return 'ko';
      if (tgLang) return 'en';
    } catch(e) {}

    var navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (navLang.startsWith('ko')) return 'ko';
    return 'en';
  }

  var _lang = detectLanguage();

  // Set HTML lang attribute
  if (document.documentElement) {
    document.documentElement.lang = _lang;
  }

  /**
   * Create a translation function for a game
   * @param {Object} translations - { key: { en: '...', ko: '...' }, ... }
   * @returns {Function} T(key, fallback?) → localized string
   */
  function GameI18n(translations) {
    return function T(key, fallback) {
      var entry = translations[key];
      if (!entry) return fallback || key;
      return entry[_lang] || entry['en'] || fallback || key;
    };
  }

  // Export
  window.detectLanguage = detectLanguage;
  window.GameI18n = GameI18n;
  window._i18nLang = _lang;
})();
