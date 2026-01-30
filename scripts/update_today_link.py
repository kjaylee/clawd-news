#!/usr/bin/env python3
"""
update_today_link.py - today.md 심볼릭 링크 갱신 및 아카이브

Usage:
    python update_today_link.py
    python update_today_link.py --archive-days 3

기능:
- today.md를 오늘 날짜 파일로 링크
- N일 이상 지난 파일을 archive/로 이동
"""

import sys
import argparse
import shutil
from pathlib import Path
from datetime import datetime, timedelta

sys.path.insert(0, str(Path(__file__).parent))
from memory_utils import MEMORY_DIR, ARCHIVE_DIR, get_today


def update_today_link() -> str:
    """today.md 심볼릭 링크 갱신"""
    today_str = get_today()
    today_file = MEMORY_DIR / f"{today_str}.md"
    link_path = MEMORY_DIR / "today.md"
    
    # 오늘 파일이 없으면 생성
    if not today_file.exists():
        today_file.write_text(f"# {today_str}\n\n## 기록\n\n", encoding='utf-8')
    
    # 기존 링크 제거
    if link_path.exists() or link_path.is_symlink():
        link_path.unlink()
    
    # 새 링크 생성 (상대 경로)
    link_path.symlink_to(f"{today_str}.md")
    
    return f"✅ today.md → {today_str}.md"


def archive_old_files(days: int = 3) -> list:
    """N일 이상 지난 파일을 archive/로 이동"""
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    
    cutoff = datetime.now() - timedelta(days=days)
    archived = []
    
    for file in MEMORY_DIR.glob("????-??-??.md"):
        # 날짜 파싱
        try:
            date_str = file.stem
            file_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue
        
        # 오래된 파일 이동
        if file_date < cutoff:
            dest = ARCHIVE_DIR / file.name
            shutil.move(str(file), str(dest))
            archived.append(file.name)
    
    return archived


def list_status() -> str:
    """현재 메모리 상태 출력"""
    output = ["## 메모리 상태\n"]
    
    # today.md 링크 확인
    today_link = MEMORY_DIR / "today.md"
    if today_link.is_symlink():
        target = today_link.resolve().name
        output.append(f"today.md → {target}")
    else:
        output.append("today.md: ❌ 링크 없음")
    
    # 일일 파일 목록
    day_files = sorted(MEMORY_DIR.glob("????-??-??.md"), reverse=True)
    output.append(f"\n일일 파일: {len(day_files)}개")
    for f in day_files[:5]:
        size = f.stat().st_size
        output.append(f"  - {f.name} ({size} bytes)")
    
    # 아카이브 파일
    archive_files = list(ARCHIVE_DIR.glob("*.md")) if ARCHIVE_DIR.exists() else []
    output.append(f"\n아카이브: {len(archive_files)}개")
    
    # core.md 상태
    core_file = MEMORY_DIR / "core.md"
    if core_file.exists():
        size = core_file.stat().st_size
        output.append(f"\ncore.md: {size} bytes")
    else:
        output.append("\ncore.md: ❌ 없음")
    
    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description='메모리 링크 및 아카이브 관리')
    parser.add_argument('--archive-days', type=int, default=3,
                        help='N일 이상 지난 파일 아카이브 (기본: 3)')
    parser.add_argument('--status', action='store_true',
                        help='현재 상태만 출력')
    parser.add_argument('--no-archive', action='store_true',
                        help='아카이브 건너뛰기')
    
    args = parser.parse_args()
    
    if args.status:
        print(list_status())
        return
    
    # 링크 갱신
    result = update_today_link()
    print(result)
    
    # 아카이브
    if not args.no_archive:
        archived = archive_old_files(args.archive_days)
        if archived:
            print(f"📦 아카이브됨: {', '.join(archived)}")
        else:
            print("📦 아카이브할 파일 없음")
    
    print()
    print(list_status())


if __name__ == "__main__":
    main()
