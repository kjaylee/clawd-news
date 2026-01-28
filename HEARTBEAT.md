# HEARTBEAT.md

## 용량 체크 (매 heartbeat)
1. 로그 용량 확인: `du -sh /tmp/clawdbot/`
2. 100MB 초과 시 → 3일 이상 된 로그 삭제
3. 디스크 용량 확인: `df -h /`
4. 90% 초과 시 → 주인님께 경고

## 실행 명령어
```bash
# 로그 용량
LOG_SIZE=$(du -sm /tmp/clawdbot/ 2>/dev/null | cut -f1)
if [ "$LOG_SIZE" -gt 100 ]; then
  find /tmp/clawdbot -name '*.log' -mtime +3 -delete
fi

# 디스크 용량
DISK_USE=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
if [ "$DISK_USE" -gt 90 ]; then
  echo "⚠️ 디스크 90% 초과!"
fi
```
