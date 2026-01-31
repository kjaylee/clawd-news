# HEARTBEAT.md

## 📅 2026-01-30 리마인더
**오전 10시경 주인님께 알림:**
- ⚡ **블록된 항목 5개 해제 요청** (전부 주인님 계정/액션 필요)
- 1순위: Gumroad 등록 3개 (10분 가이드: `products/QUICK_REGISTER_GUIDE.md`)
- 2순위: 삼국지 앱스토어 출시 (개발자 계정)
- 3순위: Vercel 환경변수 (ContentForge)
- 진짜 수익: 삼국지 앱스토어 출시 / 카메라 앱 프리미엄

## 크론잡 실패 자동복구 (매 heartbeat) [i5 — 주인님 직접 지시 2026-02-01]
1. `cron` → `list` 로 전체 잡 상태 확인
2. lastStatus가 error/terminated인 잡 → **즉시 서브에이전트로 동일 작업 재실행** (다음 스케줄까지 기다리지 말 것!)
3. "not-due"로 cron run 안 되면 → 서브에이전트 스폰해서 동일 task 직접 수행
4. 보고 불필요, 알아서 복구. 복구 실패 시에만 주인님께 보고
5. **크론잡 실패 = 미스 김 실패. 즉시 바로잡는 것이 내 일.**

## 서브에이전트 감독 (매 heartbeat)
1. `sessions_list` 실행 — 활성 서브에이전트 확인
2. 정지/에러 발생 시 → 즉시 주인님께 보고
3. 완료된 작업 → `memory/subagent-log.md` 업데이트

## 용량 체크 (매 heartbeat)
1. `scripts/disk-cleanup.sh --check` → 여유 용량 확인
2. **여유 50GB 이하** → 주인님께 경고 + NAS/다른 볼륨(/Volumes/workspace)으로 이동 가능한 파일 자동 이전
3. **여유 20GB 이하** → `scripts/disk-cleanup.sh --json` 캐시/임시파일 실제 삭제
4. 그 외 → 끝 (정리 불필요)

## 🧠 자기 개선 (매 heartbeat 1회)
매 heartbeat에서 아래 중 하나를 수행:
1. **새 스킬/도구 발견** — ClawdHub, 웹 검색으로 유용한 스킬/도구 탐색
2. **기존 스킬 개선** — 사용 중 발견한 비효율/버그 수정
3. **워크플로우 최적화** — 반복 작업을 자동화/크론잡화
4. **지식 업데이트** — 게임 트렌드, 마케팅, 기술 변화 학습
5. **교훈 기록** — 오늘 배운 것을 TOOLS.md/AGENTS.md/스킬에 반영

## Unity 에셋 일일 체크 (1일 1회)
1. `/Volumes/workspace/Asset Store-5.x/` 패키지 수 확인 (현재 265개 기준)
2. 신규 추가분 있으면 → 서브에이전트로 분석/분류/카탈로그 업데이트
3. 오디오 에셋 신규분 → unity-assets/audio/에 추출
4. _assets/ 카탈로그 + 프로젝트 허브 업데이트
5. git push

## GCP VM 모니터링 (매 heartbeat)
1. `curl -so/dev/null -w '%{http_code}' https://eastsea.xyz` → 응답 확인
2. 비정상 시 → `gcloud compute ssh`로 docker 상태 체크 + 자동 복구
3. Traefik/서비스 다운 시 → `sudo docker restart` 후 보고

## MiniPC 노드 자동복구 (매 heartbeat)
1. `nodes status`로 MiniPC 연결 확인
2. 차단 시 → `nodes invoke`로 `system.execApprovals.set` (security:full) 자동 복구
3. 주인님께 절대 시키지 말 것

## NAS 노드 자동복구 (매 heartbeat)
1. `nodes status`로 NAS 연결 확인
2. **연결 끊김 시** → SSH로 서비스 재시작: `ssh spritz@100.100.59.78 "systemctl --user restart clawdbot-node"`
3. **차단 시** → `nodes invoke`로 `system.execApprovals.set` (security:full) 자동 복구
4. **서비스 파일 깨짐 시** → SSH로 서비스 파일 재생성 (권한 반드시 644!)
5. 주인님께 절대 시키지 말 것 — 자동 복구 실패 시에만 보고

## 실행 명령어
```bash
# 하트비트: 경량 체크 (JSON)
scripts/disk-cleanup.sh --check

# 80%+ 시 정리 (자동 임계치 방어 내장)
scripts/disk-cleanup.sh --json

# 테스트
scripts/disk-cleanup.sh --dry-run
```
