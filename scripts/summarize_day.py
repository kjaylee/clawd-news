#!/usr/bin/env python3
"""
summarize_day.py - 일일 기록 요약 및 핵심 추출

Usage:
    python summarize_day.py [YYYY-MM-DD]
    python summarize_day.py --update-core  # core.md 자동 업데이트

기본값: 어제 날짜
"""

import sys
import argparse
from pathlib import Path
from datetime import datetime

# 상위 디렉토리 import
sys.path.insert(0, str(Path(__file__).parent))
from memory_utils import (
    MEMORY_DIR, load_file, save_file, get_yesterday, 
    filter_by_importance, estimate_importance, count_tokens_approx
)


def extract_sections(content: str) -> list:
    """마크다운 섹션 추출"""
    sections = []
    current_section = None
    current_content = []
    
    for line in content.split('\n'):
        if line.startswith('## '):
            if current_section:
                sections.append({
                    'title': current_section,
                    'content': '\n'.join(current_content)
                })
            current_section = line[3:].strip()
            current_content = []
        elif current_section:
            current_content.append(line)
    
    if current_section:
        sections.append({
            'title': current_section,
            'content': '\n'.join(current_content)
        })
    
    return sections


def summarize_section(section: dict) -> dict:
    """섹션 요약 (importance 추정 포함)"""
    content = section['content']
    importance = estimate_importance(content)
    
    # 핵심 라인 추출 (importance 3 이상 또는 중요 키워드 포함)
    key_lines = []
    for line in content.split('\n'):
        line = line.strip()
        if not line or line.startswith('```'):
            continue
        
        line_imp = estimate_importance(line)
        if line_imp >= 3 or line.startswith('- ') and len(line) < 100:
            key_lines.append(line)
    
    return {
        'title': section['title'],
        'importance': importance,
        'summary': key_lines[:5]  # 최대 5줄
    }


def generate_summary(date_str: str) -> str:
    """일일 기록 요약 생성"""
    day_file = MEMORY_DIR / f"{date_str}.md"
    
    if not day_file.exists():
        return f"# 요약 불가\n\n파일 없음: {day_file}"
    
    content = load_file(day_file)
    sections = extract_sections(content)
    
    output = [f"# {date_str} 요약\n"]
    
    high_importance = []
    medium_importance = []
    
    for section in sections:
        summary = summarize_section(section)
        
        if summary['importance'] >= 4:
            high_importance.append(summary)
        elif summary['importance'] >= 3:
            medium_importance.append(summary)
    
    if high_importance:
        output.append("## 🔴 핵심 (core.md 추가 권장)\n")
        for s in high_importance:
            output.append(f"### {s['title']} [i{s['importance']}]")
            for line in s['summary']:
                output.append(f"  {line}")
            output.append("")
    
    if medium_importance:
        output.append("## 🟡 중요 (검토 필요)\n")
        for s in medium_importance:
            output.append(f"### {s['title']} [i{s['importance']}]")
            for line in s['summary'][:3]:
                output.append(f"  {line}")
            output.append("")
    
    output.append(f"---\n생성: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    output.append(f"원본: {day_file}")
    output.append(f"토큰 추정: ~{count_tokens_approx(content)}")
    
    return '\n'.join(output)


def update_core(date_str: str) -> str:
    """core.md에 고중요도 항목 추가"""
    core_file = MEMORY_DIR / "core.md"
    day_file = MEMORY_DIR / f"{date_str}.md"
    
    if not day_file.exists():
        return f"파일 없음: {day_file}"
    
    content = load_file(day_file)
    high_importance = filter_by_importance(content, min_importance=4)
    
    if not high_importance.strip():
        return "추가할 고중요도 항목 없음"
    
    core_content = load_file(core_file)
    
    # 업데이트 표시 추가
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
    update_marker = f"\n\n## {date_str} 추가 [importance: 4]\n"
    
    # 기존 내용에 추가
    if "Last updated:" in core_content:
        core_content = core_content.split("Last updated:")[0].rstrip()
    
    new_core = f"{core_content}{update_marker}{high_importance}\n\n---\nLast updated: {timestamp}"
    
    # 토큰 체크 (2KB 제한)
    if len(new_core) > 2048:
        return f"⚠️ core.md가 2KB를 초과합니다 ({len(new_core)} bytes). 수동 정리 필요."
    
    save_file(core_file, new_core)
    return f"✅ core.md 업데이트 완료 ({len(new_core)} bytes)"


def main():
    parser = argparse.ArgumentParser(description='일일 기록 요약')
    parser.add_argument('date', nargs='?', default=get_yesterday(), 
                        help='날짜 (YYYY-MM-DD, 기본: 어제)')
    parser.add_argument('--update-core', action='store_true',
                        help='core.md 자동 업데이트')
    
    args = parser.parse_args()
    
    if args.update_core:
        result = update_core(args.date)
        print(result)
    else:
        summary = generate_summary(args.date)
        print(summary)


if __name__ == "__main__":
    main()
