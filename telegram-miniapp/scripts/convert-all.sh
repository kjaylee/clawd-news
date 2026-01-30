#!/bin/bash
# ================================================================
# convert-all.sh — TOP 5 게임 일괄 변환
#
# 사용법:
#   bash scripts/convert-all.sh [games-base-dir]
#   bash scripts/convert-all.sh /path/to/games
#
# 기본 경로: /Users/kjaylee/clawd/games
# ================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GAMES_DIR="${1:-/Users/kjaylee/clawd/games}"

# TOP 5 게임 목록
TOP5_GAMES=(
    "spin-village"
    "crystal-match"
    "screw-sort-factory"
    "slime-survivor-premium"
    "idle-slime-merge"
)

echo "╔══════════════════════════════════════════╗"
echo "║  🎮 Telegram Mini App 게임 변환 시작     ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📁 게임 폴더: $GAMES_DIR"
echo "🎯 대상: ${#TOP5_GAMES[@]}개 게임"
echo ""

SUCCESS=0
SKIP=0
FAIL=0

for game in "${TOP5_GAMES[@]}"; do
    GAME_PATH="$GAMES_DIR/$game"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ ! -d "$GAME_PATH" ]; then
        echo "❌ $game — 폴더 없음: $GAME_PATH"
        FAIL=$((FAIL + 1))
        continue
    fi

    bash "$SCRIPT_DIR/convert-game.sh" "$GAME_PATH"
    RESULT=$?

    if [ $RESULT -eq 0 ]; then
        # 이미 변환된 경우도 성공으로 카운트
        if grep -q 'telegram-web-app.js' "$GAME_PATH/index.html" 2>/dev/null; then
            SUCCESS=$((SUCCESS + 1))
        fi
    else
        FAIL=$((FAIL + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 변환 결과:"
echo "   ✅ 성공: ${SUCCESS}개"
echo "   ❌ 실패: ${FAIL}개"
echo "   총: ${#TOP5_GAMES[@]}개"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 모든 게임 변환 완료!"
else
    echo "⚠️  일부 게임 변환 실패. 로그를 확인하세요."
    exit 1
fi
