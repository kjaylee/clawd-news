#!/bin/bash
# =============================================================================
# doctor.sh — 전체 인프라 자동 진단+수리 스크립트
# 용도: 하트비트/크론잡/수동 실행
# 실행: scripts/doctor.sh          (전체)
#       scripts/doctor.sh nas       (특정 노드)
#       scripts/doctor.sh --json    (JSON 출력)
#       scripts/doctor.sh --no-fix  (수리 비활성화)
# 생성: 2026-02-01
# =============================================================================

set -uo pipefail

# ── 설정 ────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAWD_DIR="$(dirname "$SCRIPT_DIR")"
CHECK_TIMEOUT=10
NAS_IP="100.100.59.78"
NAS_USER="spritz"
NAS_SERVICE="clawdbot-node.service"
GCP_URL="https://eastsea.xyz"
GCP_INSTANCE="instance-20250423-131130"
GCP_ZONE="us-west1-a"

# ── 옵션 파싱 ──────────────────────────────────────────────────
FIX=true
JSON_OUT=false
TARGET=""
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)     JSON_OUT=true; shift ;;
    --no-fix)   FIX=false; shift ;;
    --fix)      FIX=true; shift ;;
    --verbose)  VERBOSE=true; shift ;;
    -h|--help)
      cat <<'EOF'
Usage: doctor.sh [target] [options]

Targets (생략 시 전체):
  nas       NAS만 체크
  minipc    MiniPC만 체크
  gcp       GCP VM만 체크
  cron      크론잡만 체크
  disk      디스크만 체크
  macbook   MacBook만 체크

Options:
  --json      JSON 출력 (파싱용)
  --no-fix    자동 수리 비활성화
  --fix       자동 수리 활성화 (기본)
  --verbose   상세 출력
  -h, --help  도움말
EOF
      exit 0
      ;;
    *)
      TARGET="$(echo "$1" | tr '[:upper:]' '[:lower:]')"
      shift
      ;;
  esac
done

# ── 색상 (터미널용) ────────────────────────────────────────────
if [[ -t 1 ]] && [[ "$JSON_OUT" == "false" ]]; then
  C_GREEN='\033[0;32m'
  C_RED='\033[0;31m'
  C_YELLOW='\033[0;33m'
  C_BLUE='\033[0;34m'
  C_DIM='\033[2m'
  C_BOLD='\033[1m'
  C_RESET='\033[0m'
else
  C_GREEN='' C_RED='' C_YELLOW='' C_BLUE='' C_DIM='' C_BOLD='' C_RESET=''
fi

# ── JSON 파싱 헬퍼 ─────────────────────────────────────────────
json_get() {
  local json="$1" key="$2"
  if command -v jq &>/dev/null; then
    echo "$json" | jq -r "$key" 2>/dev/null
  else
    echo "$json" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    keys = '''$key'''.strip('.').split('.')
    for k in keys:
        if k.startswith('['):
            d = d[int(k.strip('[]'))]
        else:
            d = d[k]
    print(d if d is not None else '')
except: print('')
" 2>/dev/null
  fi
}

# ── 결과 수집 ──────────────────────────────────────────────────
declare -a RESULTS_NAME=()
declare -a RESULTS_STATUS=()  # ok, fail, warn, sleep, skip
declare -a RESULTS_MSG=()
declare -a RESULTS_DETAIL=()

add_result() {
  local name="$1" status="$2" msg="$3" detail="${4:-}"
  RESULTS_NAME+=("$name")
  RESULTS_STATUS+=("$status")
  RESULTS_MSG+=("$msg")
  RESULTS_DETAIL+=("$detail")
}

# ── 캐시 (nodes status 한 번만 호출) ──────────────────────────
NODES_JSON=""
get_nodes_json() {
  if [[ -z "$NODES_JSON" ]]; then
    NODES_JSON=$(clawdbot nodes status --json 2>/dev/null || echo '{"nodes":[]}')
    [[ -z "$NODES_JSON" ]] && NODES_JSON='{"nodes":[]}'
  fi
  echo "$NODES_JSON"
}

get_node_info() {
  local name="$1"
  get_nodes_json | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    for n in d.get('nodes', []):
        if n.get('displayName','').lower() == '${name}'.lower() or '${name}'.lower() in n.get('displayName','').lower():
            cmds = n.get('commands', [])
            print(json.dumps({
                'connected': n.get('connected', False),
                'has_run': 'system.run' in cmds,
                'has_browser': 'browser.proxy' in cmds,
                'version': n.get('version', 'unknown'),
                'displayName': n.get('displayName', '')
            }))
            sys.exit()
    print(json.dumps({'connected': False, 'has_run': False, 'has_browser': False, 'version': 'not_found'}))
except Exception as e:
    print(json.dumps({'connected': False, 'error': str(e)}))
" 2>/dev/null
}

# ── 체크 함수들 ────────────────────────────────────────────────

# 1. NAS 체크+수리
check_nas() {
  local status="ok" msg="" detail=""

  # SSH 접속 테스트
  if ! timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
       "${NAS_USER}@${NAS_IP}" "echo ok" &>/dev/null; then
    add_result "NAS" "fail" "SSH 접속 실패 (${NAS_IP})" "SSH timeout or auth failure"
    return
  fi

  # 서비스 파일 권한 확인
  local svc_path=".config/systemd/user/${NAS_SERVICE}"
  local svc_perms
  svc_perms=$(timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
    "${NAS_USER}@${NAS_IP}" "stat -c '%a' ~/${svc_path} 2>/dev/null || echo 'missing'" 2>/dev/null)

  if [[ "$svc_perms" == "missing" ]]; then
    add_result "NAS" "fail" "서비스 파일 없음" "${svc_path} not found"
    return
  fi

  if [[ "$svc_perms" != "644" ]]; then
    detail="서비스 파일 권한 ${svc_perms} (644 필요)"
    if [[ "$FIX" == "true" ]]; then
      timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
        "${NAS_USER}@${NAS_IP}" "chmod 644 ~/${svc_path} && systemctl --user daemon-reload" &>/dev/null
      local new_perms
      new_perms=$(timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
        "${NAS_USER}@${NAS_IP}" "stat -c '%a' ~/${svc_path}" 2>/dev/null)
      if [[ "$new_perms" == "644" ]]; then
        detail="${detail} → 수정 완료"
      else
        detail="${detail} → 수정 실패"
        status="fail"
      fi
    else
      status="warn"
    fi
  fi

  # 서비스 상태 확인
  local svc_status
  svc_status=$(timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
    "${NAS_USER}@${NAS_IP}" "systemctl --user is-active ${NAS_SERVICE} 2>/dev/null" 2>/dev/null)

  if [[ "$svc_status" != "active" ]]; then
    local old_detail="$detail"
    detail="${old_detail:+$old_detail; }서비스 ${svc_status:-unknown}"

    if [[ "$FIX" == "true" ]]; then
      timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
        "${NAS_USER}@${NAS_IP}" "systemctl --user restart ${NAS_SERVICE}" &>/dev/null
      sleep 2
      svc_status=$(timeout "$CHECK_TIMEOUT" ssh -o ConnectTimeout=5 -o BatchMode=yes \
        "${NAS_USER}@${NAS_IP}" "systemctl --user is-active ${NAS_SERVICE} 2>/dev/null" 2>/dev/null)
      if [[ "$svc_status" == "active" ]]; then
        msg="서비스 inactive → 재시작 → 복구됨"
        detail="${detail} → 재시작 성공"
      else
        status="fail"
        msg="서비스 inactive → 재시작 실패"
        detail="${detail} → 재시작 후에도 ${svc_status:-unknown}"
      fi
    else
      status="fail"
      msg="서비스 ${svc_status:-unknown}"
    fi
  fi

  # 게이트웨이 연결 확인 (캐시된 nodes status)
  local nas_info nas_connected
  nas_info=$(get_node_info "NAS")
  nas_connected=$(echo "$nas_info" | python3 -c "import sys,json; d=json.load(sys.stdin); print('true' if d.get('connected') else 'false')" 2>/dev/null)

  if [[ "$nas_connected" == "true" ]]; then
    [[ -z "$msg" ]] && msg="connected, 서비스 active"
  elif [[ "$nas_connected" == "false" ]]; then
    if [[ "$status" == "ok" ]]; then
      status="warn"
      msg="${msg:+$msg; }게이트웨이 미연결 (서비스는 active)"
    fi
  fi

  [[ -z "$msg" ]] && msg="SSH OK, 서비스 active"
  add_result "NAS" "$status" "$msg" "$detail"
}

# 2. MiniPC 체크+수리
check_minipc() {
  local status="ok" msg="" detail=""

  # nodes status 확인 (캐시)
  local minipc_info
  minipc_info=$(get_node_info "MiniPC")

  local connected has_run has_browser
  connected=$(echo "$minipc_info" | python3 -c "import sys,json; print(json.load(sys.stdin).get('connected',False))" 2>/dev/null)
  has_run=$(echo "$minipc_info" | python3 -c "import sys,json; print(json.load(sys.stdin).get('has_run',False))" 2>/dev/null)
  has_browser=$(echo "$minipc_info" | python3 -c "import sys,json; print(json.load(sys.stdin).get('has_browser',False))" 2>/dev/null)

  if [[ "$connected" != "True" ]]; then
    add_result "MiniPC" "fail" "disconnected" "노드 연결 끊김"
    return
  fi

  # system.run 차단 확인
  if [[ "$has_run" != "True" ]]; then
    detail="system.run 미활성"
    if [[ "$FIX" == "true" ]]; then
      # exec-approvals 복구 시도
      local hash
      hash=$(clawdbot nodes invoke --node MiniPC --command "system.execApprovals.get" --json 2>&1 | \
        python3 -c "import sys,json; print(json.load(sys.stdin).get('payload',{}).get('hash',''))" 2>/dev/null)
      if [[ -n "$hash" ]]; then
        clawdbot nodes invoke --node MiniPC --command "system.execApprovals.set" \
          --params "{\"baseHash\":\"$hash\",\"file\":{\"version\":1,\"defaults\":{\"security\":\"full\",\"ask\":\"off\",\"askFallback\":\"full\"},\"agents\":{\"*\":{\"allowlist\":[{\"pattern\":\"*\"}]},\"main\":{\"allowlist\":[{\"pattern\":\"*\"}]}}}}" &>/dev/null
        detail="${detail} → 복구 시도"
      fi
    else
      status="warn"
    fi
  fi

  # 브라우저 프로세스 상태 (간접 확인)
  local browser_ok=""
  if [[ "$has_browser" == "True" ]]; then
    browser_ok="browser.proxy OK"
  else
    browser_ok="browser.proxy 미활성"
    [[ "$status" == "ok" ]] && status="warn"
  fi

  msg="connected"
  [[ "$has_run" == "True" ]] && msg="${msg}, system.run OK"
  [[ -n "$browser_ok" ]] && msg="${msg}, ${browser_ok}"

  add_result "MiniPC" "$status" "$msg" "$detail"
}

# 3. GCP VM 체크+수리
check_gcp() {
  local status="ok" msg="" detail=""

  # HTTP 응답 체크
  local http_code
  http_code=$(timeout "$CHECK_TIMEOUT" curl -sL -o /dev/null -w '%{http_code}' "$GCP_URL" 2>/dev/null || echo "000")

  if [[ "$http_code" == "200" ]] || [[ "$http_code" == "301" ]] || [[ "$http_code" == "302" ]]; then
    msg="eastsea.xyz HTTP ${http_code}"
  else
    status="fail"
    msg="eastsea.xyz HTTP ${http_code}"
    detail="Expected 200, got ${http_code}"

    if [[ "$FIX" == "true" ]]; then
      # gcloud SSH → docker compose restart
      detail="${detail}; docker restart 시도"
      timeout 30 gcloud compute ssh "$GCP_INSTANCE" --zone="$GCP_ZONE" --command \
        "cd /home/k_jaylee/spritz && sudo docker compose restart" &>/dev/null
      sleep 3
      http_code=$(timeout "$CHECK_TIMEOUT" curl -sL -o /dev/null -w '%{http_code}' "$GCP_URL" 2>/dev/null || echo "000")
      if [[ "$http_code" == "200" ]] || [[ "$http_code" == "301" ]] || [[ "$http_code" == "302" ]]; then
        status="ok"
        msg="eastsea.xyz 복구됨 (HTTP ${http_code})"
        detail="${detail} → 성공"
      else
        detail="${detail} → 실패 (여전히 ${http_code})"
      fi
    fi
  fi

  # Traefik 에러 체크 (빠르게)
  if [[ "$VERBOSE" == "true" ]]; then
    local traefik_errors
    traefik_errors=$(timeout 15 gcloud compute ssh "$GCP_INSTANCE" --zone="$GCP_ZONE" --command \
      "sudo docker logs spritz-traefik-1 --since 1h 2>&1 | grep -i 'error\|ERR' | tail -5" 2>/dev/null || echo "")
    [[ -n "$traefik_errors" ]] && detail="${detail:+$detail; }Traefik 최근 에러: $(echo "$traefik_errors" | wc -l | tr -d ' ')건"
  fi

  add_result "GCP VM" "$status" "$msg" "$detail"
}

# 4. 크론잡 체크
check_cron() {
  local status="ok" msg="" detail=""

  local cron_json
  cron_json=$(clawdbot cron list --json 2>/dev/null || echo '{}')

  local cron_info
  cron_info=$(echo "$cron_json" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    jobs = d.get('jobs', [])
    total = len(jobs)
    enabled = [j for j in jobs if j.get('enabled', False)]
    errors = []
    for j in enabled:
        state = j.get('state', {})
        if state.get('lastStatus') == 'error':
            errors.append(j.get('name', j.get('id', 'unknown')))
    print(json.dumps({'total': total, 'enabled': len(enabled), 'error_count': len(errors), 'errors': errors}))
except Exception as e:
    print(json.dumps({'total': 0, 'enabled': 0, 'error_count': 0, 'errors': [], 'parse_error': str(e)}))
" 2>/dev/null)

  local total enabled error_count
  total=$(echo "$cron_info" | python3 -c "import sys,json; print(json.load(sys.stdin).get('total',0))" 2>/dev/null)
  enabled=$(echo "$cron_info" | python3 -c "import sys,json; print(json.load(sys.stdin).get('enabled',0))" 2>/dev/null)
  error_count=$(echo "$cron_info" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error_count',0))" 2>/dev/null)

  msg="${enabled} jobs, ${error_count} errors"

  if [[ "$error_count" -gt 0 ]]; then
    status="warn"
    local error_names
    error_names=$(echo "$cron_info" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for e in d.get('errors', []):
    print(f'  - {e}')
" 2>/dev/null)
    detail="에러 잡: ${error_names}"
  fi

  add_result "Cron" "$status" "$msg" "$detail"
}

# 5. 디스크 체크
check_disk() {
  local status="ok" msg="" detail=""

  if [[ -x "${SCRIPT_DIR}/disk-cleanup.sh" ]]; then
    local disk_json
    disk_json=$("${SCRIPT_DIR}/disk-cleanup.sh" --check 2>/dev/null || echo '{}')

    local free_gb usage_pct level_str
    free_gb=$(echo "$disk_json" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('available_gb', d.get('free_gb', 0)))
except: print(0)
" 2>/dev/null)
    usage_pct=$(echo "$disk_json" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('usage_pct', '?'))
except: print('?')
" 2>/dev/null)
    level_str=$(echo "$disk_json" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('level', 'unknown'))
except: print('unknown')
" 2>/dev/null)

    local percent_free="${usage_pct}%"

    msg="${free_gb}GB free (used ${percent_free})"

    # 임계치: disk-cleanup.sh의 level 또는 직접 계산
    local free_int
    free_int=$(python3 -c "print(int(float('${free_gb}')))" 2>/dev/null || echo 0)
    if [[ "$level_str" == "critical" ]] || [[ "$free_int" -lt 20 ]]; then
      status="fail"
      msg="${msg} ⚠️ CRITICAL"
    elif [[ "$level_str" == "warn" ]] || [[ "$free_int" -lt 50 ]]; then
      status="warn"
      msg="${msg} ⚠️ LOW"
    fi
  else
    # disk-cleanup.sh 없으면 df로 직접 체크
    local avail_kb
    avail_kb=$(df -k / | awk 'NR==2 {print $4}')
    local avail_gb=$(( avail_kb / 1024 / 1024 ))
    local capacity
    capacity=$(df -h / | awk 'NR==2 {print $5}')
    msg="${avail_gb}GB free (${capacity} used)"
    if [[ "$avail_gb" -lt 20 ]]; then
      status="fail"
    elif [[ "$avail_gb" -lt 50 ]]; then
      status="warn"
    fi
  fi

  add_result "Disk" "$status" "$msg" "$detail"
}

# 6. MacBook 체크
check_macbook() {
  local status="ok" msg="" detail=""

  local macbook_info macbook_connected
  macbook_info=$(get_node_info "MacBook")
  macbook_connected=$(echo "$macbook_info" | python3 -c "import sys,json; d=json.load(sys.stdin); print('true' if d.get('connected') else 'false')" 2>/dev/null)

  if [[ "$macbook_connected" == "true" ]]; then
    msg="connected"
  elif [[ "$macbook_connected" == "false" ]]; then
    status="sleep"
    msg="offline (sleeping)"
  else
    status="skip"
    msg="노드 미등록"
  fi

  add_result "MacBook" "$status" "$msg" "$detail"
}

# ── 실행 ───────────────────────────────────────────────────────

# 타겟별 실행 또는 전체
run_checks() {
  case "$TARGET" in
    nas)     check_nas ;;
    minipc)  check_minipc ;;
    gcp)     check_gcp ;;
    cron)    check_cron ;;
    disk)    check_disk ;;
    macbook) check_macbook ;;
    "")
      check_minipc
      check_nas
      check_gcp
      check_cron
      check_disk
      check_macbook
      ;;
    *)
      echo "Unknown target: $TARGET"
      exit 1
      ;;
  esac
}

run_checks

# ── 출력 ───────────────────────────────────────────────────────

timestamp=$(TZ="Asia/Seoul" date "+%Y-%m-%d %H:%M KST")

if [[ "$JSON_OUT" == "true" ]]; then
  # JSON 출력 — 안전한 방식: temp 파일로 전달
  tmpfile=$(mktemp /tmp/doctor-XXXXXX.jsonl)

  for i in "${!RESULTS_NAME[@]}"; do
    # 각 결과를 한 줄 JSON으로 기록
    python3 -c "
import json
print(json.dumps({
    'name': '''${RESULTS_NAME[$i]}''',
    'status': '''${RESULTS_STATUS[$i]}''',
    'message': $(python3 -c "import json; print(json.dumps('''${RESULTS_MSG[$i]}'''))" 2>/dev/null),
    'detail': $(python3 -c "import json; print(json.dumps('''${RESULTS_DETAIL[$i]}'''))" 2>/dev/null)
}, ensure_ascii=False))
" >> "$tmpfile"
  done

  python3 -c "
import json, sys

checks = []
ok_count = 0

with open('$tmpfile') as f:
    for line in f:
        line = line.strip()
        if not line: continue
        c = json.loads(line)
        is_ok = c['status'] in ('ok', 'sleep', 'skip')
        if is_ok:
            ok_count += 1
        c['ok'] = is_ok
        checks.append(c)

total = len(checks)
result = {
    'timestamp': '$timestamp',
    'fix_enabled': $([[ "$FIX" == "true" ]] && echo "True" || echo "False"),
    'total': total,
    'ok_count': ok_count,
    'all_ok': ok_count == total,
    'checks': checks
}
print(json.dumps(result, ensure_ascii=False, indent=2))
"
  rm -f "$tmpfile"
else
  # 사람용 출력
  echo ""
  echo -e "${C_BOLD}🏥 Doctor Report — ${timestamp}${C_RESET}"
  echo "──────────────────────────────────────"

  ok_count=0
  total=${#RESULTS_NAME[@]}

  for i in "${!RESULTS_NAME[@]}"; do
    local_name="${RESULTS_NAME[$i]}"
    local_status="${RESULTS_STATUS[$i]}"
    local_msg="${RESULTS_MSG[$i]}"

    icon=""
    padded_name=""
    case "$local_status" in
      ok)    icon="${C_GREEN}✅${C_RESET}"; ((ok_count++)) ;;
      fail)  icon="${C_RED}❌${C_RESET}" ;;
      warn)  icon="${C_YELLOW}⚠️${C_RESET}"; ((ok_count++)) ;;
      sleep) icon="😴"; ((ok_count++)) ;;
      skip)  icon="${C_DIM}⏭️${C_RESET}"; ((ok_count++)) ;;
      *)     icon="❓" ;;
    esac

    # 이름 패딩 (10자)
    padded_name=$(printf "%-10s" "$local_name")
    echo -e "${icon} ${C_BOLD}${padded_name}${C_RESET} ${local_msg}"

    # 상세 정보 (verbose 또는 에러 시)
    if [[ -n "${RESULTS_DETAIL[$i]}" ]] && { [[ "$VERBOSE" == "true" ]] || [[ "$local_status" == "fail" ]]; }; then
      echo -e "   ${C_DIM}↳ ${RESULTS_DETAIL[$i]}${C_RESET}"
    fi
  done

  echo "──────────────────────────────────────"

  result_color="$C_GREEN"
  [[ "$ok_count" -lt "$total" ]] && result_color="$C_RED"

  echo -e "결과: ${result_color}${ok_count}/${total} 정상${C_RESET}"

  if [[ "$FIX" == "true" ]]; then
    echo -e "${C_DIM}(자동 수리: ON — --no-fix로 비활성화)${C_RESET}"
  else
    echo -e "${C_DIM}(자동 수리: OFF — --fix로 활성화)${C_RESET}"
  fi
  echo ""
fi
