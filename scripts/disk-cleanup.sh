#!/bin/bash
# =============================================================================
# disk-cleanup.sh — Mac Studio 디스크 체크 + 자동 정리
# 용도: 하트비트/크론잡에서 호출
# 모드:
#   --check   디스크 상태만 JSON 출력 (경량, 정리 없음)
#   --json    정리 포함 JSON 출력 (여유 50GB 이하 시에만 정리)
#   (없음)    텍스트 로그 + JSON (여유 50GB 이하 시에만 정리)
# 기준: APFS 여유 용량(GB) 기반 — df Capacity% 대신 Available 사용
# 생성: 2026-02-01 / 수정: GB 기준 전환
# =============================================================================

set -euo pipefail

# 여유 용량 기준 (GB)
WARN_GB=50       # 여유 50GB 이하 → 일반 정리
CRITICAL_GB=20   # 여유 20GB 이하 → 추가 정리 + 경고

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
      echo "  --json    JSON 출력 (여유 ${WARN_GB}GB 이하 시 자동 정리)"
      echo "  --dry-run 정리 시뮬레이션"
      exit 0 ;;
    *)  echo "Unknown: $1"; exit 1 ;;
  esac
done

# --- 유틸 ---
log()       { [[ "$JSON_ONLY" == false ]] && echo "[$(date '+%H:%M:%S')] $*" || true; }
get_pct()   { df -h / | tail -1 | awk '{print $5}' | tr -d '%'; }
get_avail_human() { df -h / | tail -1 | awk '{print $4}'; }
get_total() { df -h / | tail -1 | awk '{print $2}'; }
get_used()  { df -h / | tail -1 | awk '{print $3}'; }

# 여유 용량을 정수 GB로 반환 (APFS 안전: 1K-block 기반)
get_avail_gb() {
  local avail_kb
  avail_kb=$(df -k / | tail -1 | awk '{print $4}')
  echo $(( avail_kb / 1048576 ))
}

# --- --check 모드: 상태만 출력 ---
if [[ "$CHECK_ONLY" == true ]]; then
  AVAIL_GB=$(get_avail_gb)
  LEVEL="ok"
  [[ "$AVAIL_GB" -le "$CRITICAL_GB" ]] && LEVEL="critical"
  [[ "$AVAIL_GB" -le "$WARN_GB" && "$LEVEL" != "critical" ]] && LEVEL="warn"
  cat <<EOF
{"timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","hostname":"$(hostname -s)","available_gb":$AVAIL_GB,"available":"$(get_avail_human)","total":"$(get_total)","used":"$(get_used)","usage_pct":$(get_pct),"level":"$LEVEL","threshold_warn_gb":$WARN_GB,"threshold_critical_gb":$CRITICAL_GB}
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

BEFORE_GB=$(get_avail_gb)
BEFORE_AVAIL=$(get_avail_human)
BEFORE_PCT=$(get_pct)
START=$(date +%s)
LEVEL="ok"

# --- 여유 50GB 초과: 정리 불필요 ---
if [[ "$BEFORE_GB" -gt "$WARN_GB" ]]; then
  log "✅ 디스크 여유 ${BEFORE_GB}GB (${BEFORE_AVAIL}) — 정리 불필요"
  AFTER_GB=$BEFORE_GB
  AFTER_AVAIL=$BEFORE_AVAIL
  AFTER_PCT=$BEFORE_PCT
else
  # --- 여유 50GB 이하: 일반 정리 ---
  LEVEL="warn"
  log "━━━ 디스크 정리 시작 (여유 ${BEFORE_GB}GB, ${BEFORE_AVAIL}) ━━━"
  log ""

  run "Homebrew 캐시"          "brew cleanup --prune=all 2>/dev/null"
  run "npm 캐시"               "npm cache clean --force 2>/dev/null"
  run "Go 캐시"                "go clean -cache 2>/dev/null"
  run "pip3 캐시"              "pip3 cache purge 2>/dev/null"
  run "Clawdbot 로그 (3일+)"  "find /tmp/clawdbot -name '*.log' -mtime +3 -delete 2>/dev/null || true"
  run "삭제된 세션 (1일+)"    "find ~/.clawdbot/agents/main/sessions/ -name '*.deleted.*' -mtime +1 -delete 2>/dev/null || true"
  run "Swift PM 캐시"          "rm -rf ~/Library/Caches/org.swift.swiftpm/ 2>/dev/null || true"
  run "Claude ShipIt 캐시"     "rm -rf ~/Library/Caches/com.anthropic.claudefordesktop.ShipIt/ 2>/dev/null || true"

  # --- 여유 20GB 이하: 추가 정리 ---
  MID_GB=$(get_avail_gb)
  if [[ "$MID_GB" -le "$CRITICAL_GB" ]] || [[ "$BEFORE_GB" -le "$CRITICAL_GB" ]]; then
    LEVEL="critical"
    log ""
    log "🚨 여유 ${MID_GB}GB ≤ ${CRITICAL_GB}GB — 추가 정리"

    run "시뮬레이터 (unavailable)"   "xcrun simctl delete unavailable 2>/dev/null"
    run "pip 캐시 디렉토리"          "rm -rf ~/Library/Caches/pip/ 2>/dev/null || true"
    run "Xcode iOS DeviceSupport"    "rm -rf ~/Library/Developer/Xcode/iOS\ DeviceSupport/* 2>/dev/null || true"
    run "Xcode Archives"             "rm -rf ~/Library/Developer/Xcode/Archives/* 2>/dev/null || true"
  fi

  AFTER_GB=$(get_avail_gb)
  AFTER_AVAIL=$(get_avail_human)
  AFTER_PCT=$(get_pct)
  FREED_GB=$(( AFTER_GB - BEFORE_GB ))
  log ""
  log "━━━ 결과: 여유 ${BEFORE_GB}GB → ${AFTER_GB}GB (+${FREED_GB}GB 해제) ━━━"
  [[ "$DRY_RUN" == true ]] && log "모드: DRY-RUN"
fi

ELAPSED=$(( $(date +%s) - START ))
FREED_GB=$(( AFTER_GB - BEFORE_GB ))

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
  "before": {"available_gb": $BEFORE_GB, "available": "$BEFORE_AVAIL", "usage_pct": $BEFORE_PCT, "total": "$(get_total)", "used": "$(get_used)"},
  "after":  {"available_gb": $AFTER_GB, "available": "$AFTER_AVAIL", "usage_pct": $AFTER_PCT},
  "freed_gb": $FREED_GB,
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

[[ "$AFTER_GB" -le "$CRITICAL_GB" && "$DRY_RUN" == false ]] && exit 2
exit 0
