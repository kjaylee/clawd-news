#!/bin/bash
# disk-check.sh — 디스크 사용률 숫자만 반환 (초경량)
df -h / | tail -1 | awk '{print $5}' | tr -d '%'
