#!/bin/bash
# =============================================================================
# disk-cleanup.sh — Mac Studio 디스크 체크 + 자동 정리
# 용도: 하트비트/크론잡에서 호출
# 모드:
#   --check   디스크 상태만 JSON 출력 (경량, 정리 없음)
#   --json    정리 포함 JSON 출력 (80%+ 시에만 정리)
#   (없음)    텍스트 로그 + JSON (80%+ 시에만 정리)
# 주의: Xcode DerivedData 제외 (주인님 카메라 앱 개발 중)
# 생성: 2026-02-01
# =============================================================================

set -euo pipefail

WARN_THRESHOLD=80
CRITICAL_THRESHOLD=90
DRY_RUN=false
JSON_ONLY=false
CHECK_ONLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check)    CHECK_ONLY=true; JSON_ONLY=true; shift ;;
    --dry-run)  DRY_RUN=true; shift ;;
    --json)     JSON_ONLY=true; shift ;;
    -h|--help)
      echo "Usage: $(basename "$0") [--check] [--dry-run] [--json]"
      echo "  --check   디스크 상태만 (정리 없음, JSON)"
      echo "  --json    JSON 출력 (80%+ 시 자동 정리)"
      echo "  --dry-run 정리 시뮬레이션"
      exit 0 ;;
    *)  echo "Unknown: $1"; exit 1 ;;
  esac
done

# --- 유틸 ---
log()       { [[ "$JSON_ONLY" == false ]] && echo "[$(date '+%H:%M:%S')] $*" || true; }
get_pct()   { df -h / | tail -1 | awk '{print $5}' | tr -d '%'; }
get_avail() { df -h / | tail -1 | awk '{print $4}'; }
get_total() { df -h / | tail -1 | awk '{print $2}'; }
get_used()  { df -h / | tail -1 | awk '{print $3}'; }

# --- --check 모드: 상태만 출력 ---
if [[ "$CHECK_ONLY" == true ]]; then
  PCT=$(get_pct)
  LEVEL="ok"
  [[ "$PCT" -gt "$CRITICAL_THRESHOLD" ]] && LEVEL="critical"
  [[ "$PCT" -gt "$WARN_THRESHOLD" && "$LEVEL" == "ok" ]] && LEVEL="warn"
  cat <<EOF
{"timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","hostname":"$(hostname -s)","usage_pct":$PCT,"available":"$(get_avail)","total":"$(get_total)","used":"$(get_used)","level":"$LEVEL","threshold_warn":$WARN_THRESHOLD,"threshold_critical":$CRITICAL_THRESHOLD}
EOF
  exit 0
fi

# --- 정리 모드 ---
CLEANED=()
ERRORS=()

run() {
  local desc="$1"; shift
  if [[ "$DRY_RUN" == true ]]; then
    log "  [DRY-RUN] $desc"
    CLEANED+=("$desc (dry-run)")
    return 0
  fi
  log "  🧹 $desc"
  if eval "$@" 2>/dev/null; then
    CLEANED+=("$desc")
  else
    ERRORS+=("$desc")
    log "  ⚡ $desc — 실패 (계속)"
  fi
}

BEFORE_PCT=$(get_pct)
BEFORE_AVAIL=$(get_avail)
START=$(date +%s)
LEVEL="ok"

# --- 80% 미만: 정리 불필요 ---
if [[ "$BEFORE_PCT" -le "$WARN_THRESHOLD" ]]; then
  log "✅ 디스크 ${BEFORE_PCT}% (여유 ${BEFORE_AVAIL}) — 정리 불필요"
  AFTER_PCT=$BEFORE_PCT
  AFTER_AVAIL=$BEFORE_AVAIL
else
  # --- 80% 초과: 일반 정리 ---
  LEVEL="warn"
  log "━━━ 디스크 정리 시작 (${BEFORE_PCT}%, 여유 ${BEFORE_AVAIL}) ━━━"
  log ""

  run "Homebrew 캐시"          "brew cleanup --prune=all 2>/dev/null"
  run "npm 캐시"               "npm cache clean --force 2>/dev/null"
  run "Go 캐시"                "go clean -cache 2>/dev/null"
  run "pip3 캐시"              "pip3 cache purge 2>/dev/null"
  run "Clawdbot 로그 (3일+)"  "find /tmp/clawdbot -name '*.log' -mtime +3 -delete 2>/dev/null || true"
  run "삭제된 세션 (1일+)"    "find ~/.clawdbot/agents/main/sessions/ -name '*.deleted.*' -mtime +1 -delete 2>/dev/null || true"
  run "Swift PM 캐시"          "rm -rf ~/Library/Caches/org.swift.swiftpm/ 2>/dev/null || true"
  run "Claude ShipIt 캐시"     "rm -rf ~/Library/Caches/com.anthropic.claudefordesktop.ShipIt/ 2>/dev/null || true"
  # ⚠️ Xcode DerivedData 제외 — 주인님 카메라 앱 개발 중

  # --- 90% 초과: 추가 정리 ---
  MID_PCT=$(get_pct)
  if [[ "$MID_PCT" -gt "$CRITICAL_THRESHOLD" ]] || [[ "$BEFORE_PCT" -gt "$CRITICAL_THRESHOLD" ]]; then
    LEVEL="critical"
    log ""
    log "🚨 ${MID_PCT}% > ${CRITICAL_THRESHOLD}% — 추가 정리"

    run "시뮬레이터 (unavailable)"   "xcrun simctl delete unavailable 2>/dev/null"
    run "pip 캐시 디렉토리"          "rm -rf ~/Library/Caches/pip/ 2>/dev/null || true"
    run "Xcode iOS DeviceSupport"    "rm -rf ~/Library/Developer/Xcode/iOS\ DeviceSupport/* 2>/dev/null || true"
    run "Xcode Archives"             "rm -rf ~/Library/Developer/Xcode/Archives/* 2>/dev/null || true"
  fi

  AFTER_PCT=$(get_pct)
  AFTER_AVAIL=$(get_avail)
  log ""
  log "━━━ 결과: ${BEFORE_PCT}% → ${AFTER_PCT}% ($(( BEFORE_PCT - AFTER_PCT ))%p 해제) ━━━"
  [[ "$DRY_RUN" == true ]] && log "모드: DRY-RUN"
fi

ELAPSED=$(( $(date +%s) - START ))
FREED=$((BEFORE_PCT - AFTER_PCT))

# --- JSON ---
to_json_arr() {
  if [[ $# -eq 0 ]] || [[ $# -eq 1 && -z "${1:-}" ]]; then
    echo "[]"
    return
  fi
  local out="["
  for i in $(seq 1 $#); do
    [[ $i -gt 1 ]] && out+=","
    out+="\"${!i}\""
  done
  echo "${out}]"
}

JSON=$(cat <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "hostname": "$(hostname -s)",
  "dry_run": $DRY_RUN,
  "level": "$LEVEL",
  "before": {"usage_pct": $BEFORE_PCT, "available": "$BEFORE_AVAIL", "total": "$(get_total)", "used": "$(get_used)"},
  "after":  {"usage_pct": $AFTER_PCT, "available": "$AFTER_AVAIL"},
  "freed_pct": $FREED,
  "elapsed_sec": $ELAPSED,
  "cleaned": $(to_json_arr ${CLEANED[@]+"${CLEANED[@]}"}),
  "errors":  $(to_json_arr ${ERRORS[@]+"${ERRORS[@]}"})
}
EOF
)

if [[ "$JSON_ONLY" == true ]]; then
  echo "$JSON"
else
  log ""; log "📊 JSON:"; echo "$JSON"
fi

[[ "$AFTER_PCT" -gt "$CRITICAL_THRESHOLD" && "$DRY_RUN" == false ]] && exit 2
exit 0
