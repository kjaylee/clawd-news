#!/usr/bin/env python3
"""
generate_briefing.py - 세션 브리핑 생성

Usage:
    python generate_briefing.py
    python generate_briefing.py --output BRIEFING.md

core.md + today.md를 기반으로 압축된 세션 브리핑 생성
"""

import sys
import argparse
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent))
from memory_utils import (
    WORKSPACE, MEMORY_DIR, load_file, save_file, 
    get_today, count_tokens_approx, filter_by_importance
)


def generate_briefing() -> str:
    """브리핑 생성"""
    core_file = MEMORY_DIR / "core.md"
    today_file = MEMORY_DIR / "today.md"
    
    core_content = load_file(core_file)
    today_content = load_file(today_file)
    
    # 토큰 예산
    CORE_BUDGET = 800
    TODAY_BUDGET = 600
    
    # core.md 압축 (importance 4+ 만)
    core_filtered = filter_by_importance(core_content, min_importance=4)
    if count_tokens_approx(core_filtered) > CORE_BUDGET:
        # 더 압축 필요 시 importance 5만
        core_filtered = filter_by_importance(core_content, min_importance=5)
    
    # today.md 최근 부분만
    today_lines = today_content.split('\n')
    today_summary = '\n'.join(today_lines[-50:]) if len(today_lines) > 50 else today_content
    
    # 즉시 참고 추출 (TODO, 약속 등)
    immediate = extract_immediate(today_content)
    
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    today_str = get_today()
    
    briefing = f"""# 세션 브리핑

## 🎯 즉시 참고
{immediate if immediate else "- 특별한 일정 없음"}

## 🧠 핵심 기억
{core_filtered}

## 📅 오늘 ({today_str}) 최근 기록
{today_summary if today_summary else "(기록 없음)"}

---
Generated: {now}
Tokens (approx): ~{count_tokens_approx(core_filtered + today_summary)}
"""
    
    return briefing


def extract_immediate(content: str) -> str:
    """즉시 참고할 내용 추출 (TODO, 약속, 긴급)"""
    keywords = ['TODO', 'FIXME', '약속', '일정', '오늘', '내일', '긴급', '중요']
    lines = []
    
    for line in content.split('\n'):
        for kw in keywords:
            if kw.lower() in line.lower():
                line_clean = line.strip()
                if line_clean and line_clean not in lines:
                    lines.append(f"- {line_clean}" if not line_clean.startswith('-') else line_clean)
                break
    
    return '\n'.join(lines[:10])  # 최대 10줄


def main():
    parser = argparse.ArgumentParser(description='세션 브리핑 생성')
    parser.add_argument('--output', '-o', default='BRIEFING.md',
                        help='출력 파일 (기본: BRIEFING.md)')
    parser.add_argument('--stdout', action='store_true',
                        help='파일 대신 stdout 출력')
    
    args = parser.parse_args()
    
    briefing = generate_briefing()
    
    if args.stdout:
        print(briefing)
    else:
        output_path = WORKSPACE / args.output
        save_file(output_path, briefing)
        print(f"✅ 브리핑 저장: {output_path}")
        print(f"   크기: {len(briefing)} bytes")


if __name__ == "__main__":
    main()
