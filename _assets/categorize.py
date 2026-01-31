#!/usr/bin/env python3
"""Unity asset categorization script."""

import re
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def parse_all_assets(filepath):
    """Parse all-assets-with-links.md and return list of (section, name, publisher, size, link)."""
    assets = []
    current_section = ""
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # Detect section headers
            if line.startswith('## '):
                current_section = line[3:].strip()
                continue
            # Parse table rows (skip headers and separators)
            if line.startswith('|') and not line.startswith('| 에셋') and not line.startswith('|---'):
                parts = [p.strip() for p in line.split('|')]
                parts = [p for p in parts if p]  # remove empty
                if len(parts) >= 4:
                    name = parts[0].replace('⭐', '').strip()
                    publisher = parts[1]
                    size = parts[2]
                    link = parts[3]
                    assets.append({
                        'section': current_section,
                        'name': name,
                        'publisher': publisher,
                        'size': size,
                        'link': link,
                        'raw_line': line
                    })
    return assets

def parse_existing_category(filepath):
    """Parse existing category file and return set of asset names (normalized)."""
    names = set()
    if not os.path.exists(filepath):
        return names
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line.startswith('|') and not line.startswith('| #') and not line.startswith('|---') and not line.startswith('| 에셋'):
                # Extract name - could be in various columns
                parts = [p.strip() for p in line.split('|')]
                parts = [p for p in parts if p]
                if len(parts) >= 2:
                    for part in parts:
                        # Remove markdown links
                        name_match = re.search(r'\[([^\]]+)\]', part)
                        if name_match:
                            names.add(normalize(name_match.group(1)))
                        # Check for plain text asset names (longer than 5 chars, not a number)
                        if len(part) > 10 and not part.replace('.', '').replace(',', '').replace(' ', '').isdigit():
                            # Skip thumbnails, sizes, dates
                            if not part.startswith('<img') and not re.match(r'^\d{4}년', part) and not re.match(r'^[\d.]+\s*(GB|MB|KB)$', part):
                                names.add(normalize(part))
    return names

def normalize(name):
    """Normalize asset name for comparison."""
    name = name.lower().strip()
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name)
    return name

def categorize_asset(asset):
    """Determine category for an asset based on section and name."""
    section = asset['section'].lower()
    name = asset['name'].lower()
    
    # Direct section mapping
    if '3d 모델' in section or '3d 환경' in section:
        return '3d'
    if '몬스터' in section or '크리처' in section:
        return '3d'
    if '무기' in section:
        return '3d'
    if '시각 효과' in section or 'vfx' in section:
        return 'vfx'
    if '도구' in section or '에디터' in section:
        return 'tools'
    if '게임플레이' in section:
        return 'tools'
    if '게임 템플릿' in section or '엔진' in section:
        return 'tools'
    if '음향' in section or '오디오' in section:
        return 'audio'
    if '2d 에셋' in section:
        return '2d'
    if 'ui' in section or 'gui' in section:
        return '2d'
    if '네트워킹' in section:
        return 'tools'
    if '애니메이션' in section:
        return '3d'
    
    # For "기타" section, classify by name keywords
    if '기타' in section:
        # VFX keywords
        if any(kw in name for kw in ['weather', 'motion blur', 'cloud', 'skybox', 'water', 'crest', 'altos', 'dissolve']):
            return 'vfx'
        # Tools keywords
        if any(kw in name for kw in ['system', 'editor', 'toolkit', 'builder', 'navigation', 'tilemap', 
                                       'dialogue', 'quest', 'behavior', 'anti cheat', 'obfuscator',
                                       'ai toolbox', 'llm', 'map', 'radar', 'generation',
                                       'microverse', 'better ui', 'text animator', 'love/hate',
                                       'code monkey', 'agents navigation', 'ecs']):
            return 'tools'
        return 'etc'
    
    return 'etc'

def get_subsection(asset, category):
    """Get subsection label for organization."""
    section = asset['section']
    name = asset['name'].lower()
    
    if category == '3d':
        if '캐릭터' in section:
            return '캐릭터'
        if '몬스터' in section or '크리처' in section:
            return '몬스터/크리처'
        if '자연' in section:
            return '환경 - 자연'
        if '건물' in section or '던전' in section:
            return '환경 - 건물/던전'
        if '무기' in section:
            return '무기/장비'
        if '애니메이션' in section:
            return '애니메이션'
        return '기타 3D'
    
    if category == '2d':
        if '캐릭터' in section or '스프라이트' in section:
            return '캐릭터/스프라이트'
        if 'ui' in section.lower() or 'gui' in section.lower():
            return 'UI/GUI'
        return '기타 2D'
    
    if category == 'tools':
        if '에디터' in section:
            return '에디터 확장'
        if '게임플레이' in section:
            return '게임플레이 시스템'
        if '템플릿' in section or '엔진' in section:
            return '게임 템플릿/엔진'
        if '네트워킹' in section:
            return '네트워킹'
        return '기타 도구/유틸리티'
    
    return ''

def write_category_file(filepath, title, emoji, description, assets_by_subsection, existing_content=""):
    """Write a category file with proper formatting."""
    lines = []
    lines.append(f"---")
    lines.append(f'title: "{title}"')
    lines.append(f"---")
    lines.append(f"# {emoji} {title}")
    lines.append(f"")
    lines.append(f"> Jay의 Unity Asset Store 에셋 목록 — {description}")
    lines.append(f"")
    
    total = sum(len(v) for v in assets_by_subsection.values())
    lines.append(f"**총 {total}개 에셋**")
    lines.append(f"")
    
    for subsection, assets in assets_by_subsection.items():
        if subsection:
            lines.append(f"## {subsection}")
            lines.append(f"")
        
        lines.append(f"| 에셋 | 퍼블리셔 | 용량 | 링크 |")
        lines.append(f"|------|---------|------|------|")
        
        for a in assets:
            lines.append(f"| {a['name']} | {a['publisher']} | {a['size']} | {a['link']} |")
        
        lines.append(f"")
    
    lines.append(f"---")
    lines.append(f"*이 파일은 all-assets-with-links.md에서 자동 분류되었습니다.*")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    return total

def main():
    all_file = os.path.join(BASE, 'all-assets-with-links.md')
    
    # Parse all assets
    all_assets = parse_all_assets(all_file)
    print(f"Total assets in all-assets-with-links.md: {len(all_assets)}")
    
    # Parse existing category files
    existing = {}
    for cat in ['2d', '3d', 'audio', 'vfx', 'tools', 'etc']:
        fpath = os.path.join(BASE, f'unity-assets-{cat}.md')
        existing[cat] = parse_existing_category(fpath)
        print(f"  Existing in {cat}: {len(existing[cat])} names")
    
    all_existing = set()
    for names in existing.values():
        all_existing.update(names)
    
    # Categorize all assets
    categorized = {'3d': {}, '2d': {}, 'audio': {}, 'vfx': {}, 'tools': {}, 'etc': {}}
    
    for asset in all_assets:
        cat = categorize_asset(asset)
        subsection = get_subsection(asset, cat)
        
        if subsection not in categorized[cat]:
            categorized[cat][subsection] = []
        categorized[cat][subsection].append(asset)
    
    # Print summary
    print("\n=== Categorization Summary ===")
    for cat, subs in categorized.items():
        total = sum(len(v) for v in subs.values())
        print(f"  {cat}: {total} assets")
        for sub, assets in subs.items():
            print(f"    {sub}: {len(assets)}")
    
    # Write files
    configs = {
        '3d': ('3D 모델/환경 에셋', '🏗️', '3D 모델, 환경, 캐릭터, 무기, 애니메이션'),
        '2d': ('2D 에셋/스프라이트', '🎨', '2D 캐릭터, 스프라이트, UI/GUI, 타일셋'),
        'audio': ('오디오/음향 에셋', '🔊', '음악, 효과음, BGM, 보이스'),
        'vfx': ('시각 효과 (VFX/셰이더)', '✨', '파티클, 이펙트, 셰이더, 포스트 프로세싱'),
        'tools': ('도구/플러그인/유틸리티', '🛠️', '에디터 도구, 게임플레이 시스템, 게임 엔진, 네트워킹'),
        'etc': ('기타 에셋', '🎲', '위 카테고리에 해당하지 않는 에셋'),
    }
    
    for cat, (title, emoji, desc) in configs.items():
        filepath = os.path.join(BASE, f'unity-assets-{cat}.md')
        count = write_category_file(filepath, title, emoji, desc, categorized[cat])
        print(f"  Wrote {cat}: {count} assets")
    
    # Write unity-assets-all.md (combined summary)
    all_lines = []
    all_lines.append("---")
    all_lines.append('title: "unity assets all"')
    all_lines.append("---")
    all_lines.append("# 📦 전체 에셋 목록 (카테고리별)")
    all_lines.append("")
    all_lines.append("> Jay의 Unity Asset Store 에셋 — 전체 분류 요약")
    all_lines.append("")
    all_lines.append("## 📊 카테고리별 통계")
    all_lines.append("")
    all_lines.append("| 카테고리 | 파일 | 에셋 수 |")
    all_lines.append("|---------|------|--------|")
    
    grand_total = 0
    for cat, (title, emoji, desc) in configs.items():
        total = sum(len(v) for v in categorized[cat].values())
        grand_total += total
        all_lines.append(f"| {emoji} {title} | [unity-assets-{cat}.md](./unity-assets-{cat}.md) | {total}개 |")
    
    all_lines.append(f"| **합계** | | **{grand_total}개** |")
    all_lines.append("")
    all_lines.append("## 📁 원본 데이터")
    all_lines.append("")
    all_lines.append("- [all-assets-with-links.md](./all-assets-with-links.md) — 전체 에셋 원본 (수정 금지)")
    all_lines.append("")
    all_lines.append("---")
    all_lines.append("*자동 분류 완료*")
    
    all_path = os.path.join(BASE, 'unity-assets-all.md')
    with open(all_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(all_lines))
    
    print(f"\n✅ Total categorized: {grand_total} assets")
    print(f"✅ All files written successfully")

if __name__ == '__main__':
    main()
