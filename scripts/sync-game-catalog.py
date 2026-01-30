#!/usr/bin/env python3
"""
sync-game-catalog.py — 게임 카탈로그 정합성 자동화
games/ 디렉토리를 스캔하여 sitemap.xml을 재생성하고,
index.html / tg-launcher와의 불일치를 감지합니다.

Usage:
  python3 scripts/sync-game-catalog.py          # 정합성 체크 + sitemap 재생성
  python3 scripts/sync-game-catalog.py --fix     # index.html GAMES 배열에 누락 게임 추가
  python3 scripts/sync-game-catalog.py --report   # 보고서만 출력
"""
import os, re, sys, json
from datetime import datetime, timezone

GAMES_DIR = os.path.join(os.path.dirname(__file__), '..', 'games')
GAMES_DIR = os.path.abspath(GAMES_DIR)
BASE_URL = 'https://eastsea.monster/games'

# 제외 디렉토리 (게임이 아닌 것)
EXCLUDE_DIRS = {'tg-launcher', 'godot-demo', 'brick-breaker-godot', 'icons', 'og-images', '_removed'}

def scan_filesystem():
    """games/ 디렉토리에서 실제 게임 목록 추출"""
    games = []
    for d in sorted(os.listdir(GAMES_DIR)):
        full = os.path.join(GAMES_DIR, d)
        if not os.path.isdir(full):
            continue
        if d in EXCLUDE_DIRS or d.startswith('.') or d.startswith('_'):
            continue
        index_path = os.path.join(full, 'index.html')
        if os.path.exists(index_path):
            games.append(d)
    return games

def parse_index_games():
    """index.html의 GAMES 배열에서 게임 ID 추출"""
    index_path = os.path.join(GAMES_DIR, 'index.html')
    if not os.path.exists(index_path):
        return []
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # id: 'xxx' 패턴 매칭
    ids = re.findall(r"id:\s*'([^']+)'", content)
    return ids

def parse_sitemap():
    """sitemap.xml에서 게임 URL 추출"""
    sitemap_path = os.path.join(GAMES_DIR, 'sitemap.xml')
    if not os.path.exists(sitemap_path):
        return []
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        content = f.read()
    urls = re.findall(r'<loc>https://eastsea\.monster/games/([^/<]+)/</loc>', content)
    return urls

def parse_tg_launcher():
    """tg-launcher에서 게임 목록 추출"""
    tg_path = os.path.join(GAMES_DIR, 'tg-launcher', 'index.html')
    if not os.path.exists(tg_path):
        return []
    with open(tg_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # slug 또는 id 패턴
    ids = re.findall(r"slug:\s*'([^']+)'", content)
    if not ids:
        ids = re.findall(r"id:\s*'([^']+)'", content)
    return ids

def generate_sitemap(games):
    """sitemap.xml 생성"""
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
             '',
             '  <!-- Main Pages -->',
             f'  <url><loc>{BASE_URL}/</loc><lastmod>{now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>',
             f'  <url><loc>{BASE_URL}/tg-launcher/</loc><lastmod>{now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>',
             '',
             f'  <!-- Games ({len(games)}) -->']
    
    for g in games:
        lines.append(f'  <url><loc>{BASE_URL}/{g}/</loc><lastmod>{now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>')
    
    lines.extend(['', '</urlset>', ''])
    
    sitemap_path = os.path.join(GAMES_DIR, 'sitemap.xml')
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    return sitemap_path

def main():
    fix_mode = '--fix' in sys.argv
    report_only = '--report' in sys.argv
    
    # 1. 스캔
    fs_games = scan_filesystem()
    idx_games = parse_index_games()
    sm_games = parse_sitemap()
    tg_games = parse_tg_launcher()
    
    fs_set = set(fs_games)
    idx_set = set(idx_games)
    sm_set = set(sm_games)
    tg_set = set(tg_games)
    
    # 2. 불일치 감지
    idx_missing = fs_set - idx_set  # 파일시스템에 있지만 index.html에 없음
    idx_orphan = idx_set - fs_set   # index.html에 있지만 파일시스템에 없음
    sm_missing = fs_set - sm_set
    sm_orphan = sm_set - fs_set
    tg_missing = fs_set - tg_set
    tg_orphan = tg_set - fs_set
    
    # 3. 보고
    print(f"📊 게임 카탈로그 정합성 보고")
    print(f"{'='*50}")
    print(f"파일시스템: {len(fs_games)}개 게임")
    print(f"index.html: {len(idx_games)}개 게임")
    print(f"sitemap.xml: {len(sm_games)}개 URL")
    print(f"tg-launcher: {len(tg_games)}개 게임")
    print()
    
    all_ok = True
    
    if idx_missing:
        print(f"⚠️  index.html 누락 ({len(idx_missing)}개): {', '.join(sorted(idx_missing))}")
        all_ok = False
    if idx_orphan:
        print(f"⚠️  index.html 고아 ({len(idx_orphan)}개): {', '.join(sorted(idx_orphan))}")
        all_ok = False
    if sm_missing:
        print(f"⚠️  sitemap 누락 ({len(sm_missing)}개): {', '.join(sorted(sm_missing))}")
        all_ok = False
    if sm_orphan:
        print(f"⚠️  sitemap 고아 ({len(sm_orphan)}개): {', '.join(sorted(sm_orphan))}")
        all_ok = False
    if tg_missing:
        print(f"⚠️  tg-launcher 누락 ({len(tg_missing)}개): {', '.join(sorted(tg_missing))}")
        all_ok = False
    if tg_orphan:
        print(f"⚠️  tg-launcher 고아 ({len(tg_orphan)}개): {', '.join(sorted(tg_orphan))}")
        all_ok = False
    
    if all_ok:
        print("✅ 모든 카탈로그 정합!")
    
    if report_only:
        return
    
    # 4. sitemap 재생성 (항상)
    sitemap_path = generate_sitemap(fs_games)
    print(f"\n✅ sitemap.xml 재생성: {len(fs_games)}개 게임 + 2 페이지")
    
    # 5. index.html 메타데이터 업데이트
    index_path = os.path.join(GAMES_DIR, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        count = len(fs_games)
        # 숫자 업데이트 (33 → 실제 수)
        content = re.sub(r'(\d+) Games', f'{count} Games', content)
        content = re.sub(r'(\d+)개 게임', f'{count}개 게임', content)
        content = re.sub(r'"(\d+)개 무료 HTML5', f'"{count}개 무료 HTML5', content)
        
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ index.html 메타데이터 업데이트: {count}개 게임")
    
    print(f"\n{'='*50}")
    print(f"게임 목록: {', '.join(fs_games)}")

if __name__ == '__main__':
    main()
