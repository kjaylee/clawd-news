#!/bin/bash
# ================================================================
# convert-game.sh — 기존 HTML5 게임을 Telegram Mini App 포맷으로 변환
#
# 사용법:
#   bash scripts/convert-game.sh <game-folder-path>
#   bash scripts/convert-game.sh /path/to/games/spin-village
#
# 변환 내용:
#   1. Telegram WebApp SDK 삽입
#   2. tg-bridge.js 삽입
#   3. viewport 메타태그 보강
#   4. Safe area CSS 추가
#   5. Back button 처리
#   6. 기존 파일 백업 (.bak)
# ================================================================

set -euo pipefail

# 색상 출력
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

GAME_DIR="${1:?Usage: convert-game.sh <game-folder-path>}"
GAME_NAME=$(basename "$GAME_DIR")
INDEX_FILE="$GAME_DIR/index.html"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BRIDGE_JS="$PROJECT_ROOT/public/tg-bridge.js"

# 유효성 검사
if [ ! -f "$INDEX_FILE" ]; then
    echo -e "${RED}❌ $INDEX_FILE 파일을 찾을 수 없습니다.${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Converting: ${GAME_NAME}${NC}"

# 이미 변환된 파일인지 확인
if grep -q 'telegram-web-app.js' "$INDEX_FILE" 2>/dev/null; then
    echo -e "${GREEN}✅ 이미 변환됨 — 스킵${NC}"
    exit 0
fi

# 1. 백업
cp "$INDEX_FILE" "${INDEX_FILE}.bak"
echo "   📦 백업 완료: index.html.bak"

# 2. 임시 파일로 작업
TEMP_FILE=$(mktemp)
cp "$INDEX_FILE" "$TEMP_FILE"

# 3. Telegram WebApp SDK + tg-bridge.js 삽입 (</head> 직전)
TG_SCRIPTS='    <!-- Telegram Mini App SDK -->\
    <script src="https://telegram.org/js/telegram-web-app.js"><\/script>\
    <script src="/telegram-miniapp/public/tg-bridge.js"><\/script>'

if grep -q '</head>' "$TEMP_FILE"; then
    sed -i.tmp "s|</head>|${TG_SCRIPTS}\n</head>|" "$TEMP_FILE"
    echo "   📜 SDK + Bridge 스크립트 삽입 완료"
else
    echo -e "${YELLOW}   ⚠️  </head> 태그 없음 — <head> 앞에 삽입${NC}"
    sed -i.tmp "s|<head>|<head>\n${TG_SCRIPTS}|" "$TEMP_FILE"
fi

# 4. viewport 메타태그 보강 (viewport-fit=cover 추가)
if grep -q 'viewport-fit=cover' "$TEMP_FILE"; then
    echo "   ✅ viewport-fit=cover 이미 있음"
else
    # 기존 viewport를 보강
    sed -i.tmp 's/content="width=device-width, initial-scale=1.0/content="width=device-width, initial-scale=1.0, viewport-fit=cover/' "$TEMP_FILE"
    # user-scalable=no 확인
    if ! grep -q 'user-scalable=no' "$TEMP_FILE"; then
        sed -i.tmp 's/viewport-fit=cover"/viewport-fit=cover, user-scalable=no"/' "$TEMP_FILE"
    fi
    echo "   📐 viewport 메타태그 보강"
fi

# 5. Safe area CSS 삽입 — Python으로 처리 (sed 호환성 문제 회피)
python3 - "$TEMP_FILE" << 'PYEOF'
import sys
filepath = sys.argv[1]
with open(filepath, 'r') as f:
    content = f.read()

modified = False

# Safe area CSS
if 'safe-area-inset-top' not in content:
    safe_css = """
        /* Telegram Mini App Safe Area */
        :root {
            --safe-top: env(safe-area-inset-top, 0px);
            --safe-bottom: env(safe-area-inset-bottom, 0px);
            --safe-left: env(safe-area-inset-left, 0px);
            --safe-right: env(safe-area-inset-right, 0px);
            --tg-viewport-height: 100vh;
        }"""
    content = content.replace('<style>', '<style>' + safe_css, 1)
    modified = True
    print("   🛡️ Safe area CSS 삽입")
else:
    print("   ✅ Safe area CSS 이미 있음")

# min-height: 100vh → TG viewport
if 'min-height: 100vh' in content:
    content = content.replace('min-height: 100vh', 'min-height: var(--tg-viewport-height, 100vh)')
    modified = True
    print("   📏 min-height → TG viewport 변수 적용")

# TG Init script
if 'TGBridge' not in content:
    tg_init = """
    <!-- Telegram Mini App Init -->
    <script>
    (function() {
        if (typeof TGBridge !== "undefined") {
            window.onTGBack = function() { return false; };
            console.log("[TG] Game ready:", document.title);
        }
    })();
    </script>
"""
    content = content.replace('</body>', tg_init + '</body>')
    modified = True
    print("   🚀 TG 초기화 스크립트 삽입")
else:
    print("   ✅ TG 초기화 스크립트 이미 있음")

if modified:
    with open(filepath, 'w') as f:
        f.write(content)
PYEOF

# 9. 결과 적용
cp "$TEMP_FILE" "$INDEX_FILE"
rm -f "$TEMP_FILE" "${TEMP_FILE}.tmp"

# 10. 변환 결과 확인
echo ""
echo -e "${GREEN}✅ ${GAME_NAME} 변환 완료!${NC}"
echo "   원본 백업: ${INDEX_FILE}.bak"
echo ""
echo "   변환 항목:"
grep -c 'telegram-web-app.js' "$INDEX_FILE" > /dev/null && echo "   ✅ Telegram SDK"
grep -c 'tg-bridge.js' "$INDEX_FILE" > /dev/null && echo "   ✅ TG Bridge"
grep -c 'viewport-fit=cover' "$INDEX_FILE" > /dev/null && echo "   ✅ Viewport fit"
grep -c 'safe-area-inset' "$INDEX_FILE" > /dev/null && echo "   ✅ Safe Area CSS"
echo ""
