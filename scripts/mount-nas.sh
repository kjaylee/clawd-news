#!/bin/bash
# NAS SMB 마운트 스크립트
# 유그린 DXP4800 Plus (LAN: 192.168.219.149)
# 키체인에 저장된 비밀번호 자동 사용

NAS_IP="192.168.219.149"
NAS_USER="spritz"

SHARES=(
    "personal_folder"  # 홈 디렉토리 (7.2TB 볼륨)
    "SSD"              # SSD 볼륨 (1.8TB)
    "미디어"           # 미디어 (게임마당 등)
)

echo "🔌 NAS SMB 마운트 시작..."

# Check NAS reachability
if ! ping -c1 -W2 "$NAS_IP" &>/dev/null; then
    echo "❌ NAS ($NAS_IP) 연결 불가"
    exit 1
fi

MOUNTED=0
for share in "${SHARES[@]}"; do
    mount_point="/Volumes/$share"
    
    # Already mounted?
    if /sbin/mount | grep -q "$mount_point"; then
        echo "✅ $share — 이미 마운트됨"
        ((MOUNTED++))
        continue
    fi
    
    # Mount via osascript (uses keychain)
    if osascript -e "mount volume \"smb://${NAS_USER}@${NAS_IP}/${share}\"" &>/dev/null; then
        echo "✅ $share — 마운트 성공"
        ((MOUNTED++))
    else
        echo "❌ $share — 마운트 실패"
    fi
done

echo "📦 $MOUNTED/${#SHARES[@]} 공유 마운트 완료"
