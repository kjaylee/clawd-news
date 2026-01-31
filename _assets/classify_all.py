#!/usr/bin/env python3
"""Unity Asset 통합 다축 분류 — 로컬(645) + 클라우드(234) = 전체"""

import json, re, os

# ─── classify_assets.py의 분류 함수들 재사용 ───
from classify_assets import (
    classify_asset_type, classify_art_style, classify_usage,
    classify_theme, classify_viewpoint, classify_genre,
    classify_scroll, classify_resolution, human_size,
    load_packages, load_existing_names
)

def parse_size_str(s):
    """'4.3 GB' → bytes"""
    s = s.strip()
    m = re.match(r'([\d.]+)\s*(GB|MB|KB|B)', s, re.IGNORECASE)
    if not m:
        return 0
    val = float(m.group(1))
    unit = m.group(2).upper()
    if unit == "GB": return int(val * 1e9)
    if unit == "MB": return int(val * 1e6)
    if unit == "KB": return int(val * 1e3)
    return int(val)

def section_to_category(section):
    """all-assets-with-links.md 섹션 → 카테고리 힌트"""
    s = section.lower()
    if "3d" in s and ("캐릭터" in s or "character" in s):
        return "3D ModelsCharactersHumanoids"
    if "3d" in s and ("몬스터" in s or "크리처" in s or "monster" in s or "creature" in s):
        return "3D ModelsCharactersCreatures"
    if "3d" in s and ("자연" in s or "nature" in s):
        return "3D ModelsEnvironments"
    if "3d" in s and ("건물" in s or "던전" in s or "building" in s or "dungeon" in s):
        return "3D ModelsEnvironments"
    if "3d" in s and ("무기" in s or "weapon" in s):
        return "3D ModelsPropsWeapons"
    if "vfx" in s or "시각 효과" in s:
        return "Particle Systems"
    if "도구" in s and ("에디터" in s or "editor" in s):
        return "Editor ExtensionsUtilities"
    if "도구" in s and ("게임플레이" in s or "gameplay" in s):
        return "ScriptingEffects"
    if "게임 템플릿" in s or "game template" in s:
        return "Complete ProjectsSystems"
    if "음향" in s or "audio" in s:
        return "AudioSound FX"
    if "2d" in s and ("캐릭터" in s or "character" in s or "스프라이트" in s):
        return "Textures Materials2D Characters"
    if "2d" in s and ("ui" in s or "gui" in s):
        return "Textures MaterialsGUI Skins"
    if "네트워킹" in s or "networking" in s:
        return "ScriptingNetwork"
    if "애니메이션" in s or "animation" in s:
        return "Animation"
    if "기타" in s:
        return "ScriptingEffects"
    return ""

def load_cloud_assets():
    """all-assets-with-links.md에서 에셋 추출"""
    assets = []
    path = "/Users/kjaylee/clawd/_assets/all-assets-with-links.md"
    current_section = ""
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("## "):
                current_section = line[3:]
            if line.startswith("|") and "---" not in line and "에셋" not in line and "퍼블리셔" not in line and "카테고리" not in line and "개수" not in line:
                cols = [c.strip() for c in line.split("|")]
                if len(cols) >= 5:
                    name = cols[1].replace("⭐","").strip()
                    publisher = cols[2].strip()
                    size_str = cols[3].strip()
                    if name and publisher and name != "#":
                        assets.append({
                            "rawName": name,
                            "publisher": publisher,
                            "size": parse_size_str(size_str),
                            "sizeStr": size_str,
                            "section": current_section,
                            "category": section_to_category(current_section),
                        })
    return assets

def main():
    # 1. 로컬 패키지 분류 (645)
    local_packages = load_packages()
    existing_names = load_existing_names()
    
    local_results = []
    for a in local_packages:
        name_l = a["rawName"].lower()
        cat_l = a["category"].lower()
        pub_l = a["publisher"].lower()
        
        asset_type = classify_asset_type(a["category"], name_l)
        art_style = classify_art_style(name_l, cat_l, pub_l)
        usage = classify_usage(name_l, cat_l)
        theme = classify_theme(name_l, pub_l)
        viewpoint = classify_viewpoint(name_l, cat_l, asset_type)
        genre = classify_genre(name_l, cat_l, usage)
        scroll = classify_scroll(name_l, viewpoint)
        resolution = classify_resolution(name_l, asset_type, a["size"])
        
        local_results.append({
            "name": a["rawName"],
            "publisher": a["publisher"],
            "size": a["size"],
            "sizeHuman": human_size(a["size"]),
            "type": asset_type,
            "artStyle": art_style,
            "usage": usage,
            "theme": theme,
            "viewpoint": viewpoint,
            "genre": genre,
            "scroll": scroll,
            "resolution": resolution,
            "location": "로컬",
            "category": a["category"],
        })
    
    # 로컬 이름 집합
    local_name_set = set()
    for r in local_results:
        local_name_set.add(r["name"].lower().strip())
    
    # 2. 클라우드 에셋 (all-assets-with-links.md)
    cloud_assets = load_cloud_assets()
    cloud_results = []
    
    for a in cloud_assets:
        name_l = a["rawName"].lower()
        # 로컬에 이미 있는지 확인
        found = False
        for ln in local_name_set:
            if name_l in ln or ln in name_l:
                found = True
                break
            nw = set(re.findall(r'\w+', name_l))
            lw = set(re.findall(r'\w+', ln))
            if len(nw) >= 2 and len(nw & lw) >= len(nw) * 0.6:
                found = True
                break
        if found:
            continue
        
        cat_l = a["category"].lower()
        pub_l = a["publisher"].lower()
        
        asset_type = classify_asset_type(a["category"], name_l)
        art_style = classify_art_style(name_l, cat_l, pub_l)
        usage = classify_usage(name_l, cat_l)
        theme = classify_theme(name_l, pub_l)
        viewpoint = classify_viewpoint(name_l, cat_l, asset_type)
        genre = classify_genre(name_l, cat_l, usage)
        scroll = classify_scroll(name_l, viewpoint)
        resolution = classify_resolution(name_l, asset_type, a["size"])
        
        cloud_results.append({
            "name": a["rawName"],
            "publisher": a["publisher"],
            "size": a["size"],
            "sizeHuman": a["sizeStr"],
            "type": asset_type,
            "artStyle": art_style,
            "usage": usage,
            "theme": theme,
            "viewpoint": viewpoint,
            "genre": genre,
            "scroll": scroll,
            "resolution": resolution,
            "location": "클라우드",
            "category": a["category"],
        })
    
    # 3. 합산
    all_results = local_results + cloud_results
    
    # 정렬
    type_order = {"3D모델": 0, "2D스프라이트": 1, "VFX/셰이더": 2, "오디오": 3, "애니메이션": 4, "도구/플러그인": 5, "완성프로젝트": 6, "스카이박스": 7, "텍스처/머티리얼": 8, "기타": 9}
    all_results.sort(key=lambda x: (type_order.get(x["type"], 99), x["name"]))
    
    # 통계
    stats = {
        "total": len(all_results),
        "local": len(local_results),
        "cloud": len(cloud_results),
        "byType": {},
        "byArtStyle": {},
        "byTheme": {},
        "byViewpoint": {},
        "byGenre": {},
        "byScroll": {},
    }
    
    for r in all_results:
        stats["byType"][r["type"]] = stats["byType"].get(r["type"], 0) + 1
        for s in r["artStyle"]:
            stats["byArtStyle"][s] = stats["byArtStyle"].get(s, 0) + 1
        for t in r["theme"]:
            stats["byTheme"][t] = stats["byTheme"].get(t, 0) + 1
        for v in r["viewpoint"]:
            stats["byViewpoint"][v] = stats["byViewpoint"].get(v, 0) + 1
        for g in r["genre"]:
            stats["byGenre"][g] = stats["byGenre"].get(g, 0) + 1
        for s in r["scroll"]:
            stats["byScroll"][s] = stats["byScroll"].get(s, 0) + 1
    
    # ─── Markdown ───
    out_dir = "/Users/kjaylee/clawd/_assets"
    md = []
    md.append("---")
    md.append('title: "유니티 에셋 다축 분류 카탈로그"')
    md.append("---")
    md.append("# 🎮 유니티 에셋 다축 분류 카탈로그\n")
    md.append(f"> **총 {stats['total']}개 에셋** | 💾 로컬 {stats['local']}개 + ☁️ 클라우드 {stats['cloud']}개")
    md.append(f"> 자동 분류: 에셋명 + 퍼블리셔 + 카테고리 + 파일크기 기반 8축 태깅\n")
    
    md.append("## 📊 분류 통계\n")
    
    # 축별 통계 테이블
    for title, key in [
        ("에셋 타입", "byType"),
        ("아트 스타일", "byArtStyle"),
        ("테마", "byTheme"),
        ("시점 호환", "byViewpoint"),
        ("장르 적합", "byGenre"),
        ("스크롤 방향", "byScroll"),
    ]:
        md.append(f"### {title}")
        md.append(f"| {title} | 수량 | 비율 |")
        md.append("|--------|------|------|")
        total_for_pct = sum(stats[key].values())
        for k, v in sorted(stats[key].items(), key=lambda x: -x[1]):
            pct = v / total_for_pct * 100
            bar = "█" * int(pct / 5) + "░" * (20 - int(pct / 5))
            md.append(f"| {k} | {v} | {pct:.1f}% |")
        md.append("")
    
    # 타입별 상세 목록
    current_type = None
    idx = 0
    for r in all_results:
        if r["type"] != current_type:
            current_type = r["type"]
            type_count = stats["byType"].get(current_type, 0)
            md.append(f"\n---\n## 📦 {current_type} ({type_count}개)\n")
            md.append("| # | 에셋명 | 퍼블리셔 | 용량 | 위치 | 아트스타일 | 용도 | 테마 | 시점 | 장르적합 | 스크롤 | 해상도 |")
            md.append("|---|--------|---------|------|------|-----------|------|------|------|---------|--------|--------|")
            idx = 0
        idx += 1
        loc = "💾" if r["location"] == "로컬" else "☁️"
        md.append(f"| {idx} | {r['name']} | {r['publisher']} | {r['sizeHuman']} | {loc} | {','.join(r['artStyle'])} | {','.join(r['usage'])} | {','.join(r['theme'])} | {','.join(r['viewpoint'])} | {','.join(r['genre'])} | {','.join(r['scroll'])} | {','.join(r['resolution'])} |")
    
    md_path = os.path.join(out_dir, "unity-assets-classified.md")
    with open(md_path, "w") as f:
        f.write("\n".join(md))
    print(f"✅ Markdown: {md_path}")
    
    # ─── JSON ───
    json_data = []
    for r in all_results:
        json_data.append({
            "name": r["name"],
            "publisher": r["publisher"],
            "size": r["size"],
            "sizeHuman": r["sizeHuman"],
            "type": r["type"],
            "artStyle": r["artStyle"],
            "usage": r["usage"],
            "theme": r["theme"],
            "viewpoint": r["viewpoint"],
            "genre": r["genre"],
            "scroll": r["scroll"],
            "resolution": r["resolution"],
            "location": r["location"],
            "category": r["category"],
        })
    
    json_path = os.path.join(out_dir, "asset-search-index.json")
    with open(json_path, "w") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"✅ JSON: {json_path}")
    
    # ─── 요약 ───
    print(f"\n{'='*60}")
    print(f"📦 총 에셋: {stats['total']}개")
    print(f"💾 로컬: {stats['local']}개 | ☁️ 클라우드: {stats['cloud']}개")
    print(f"{'='*60}")
    
    print("\n📊 타입별:")
    for k, v in sorted(stats["byType"].items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    
    print("\n🎨 아트 스타일 TOP:")
    for k, v in sorted(stats["byArtStyle"].items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    
    print("\n🏷️ 테마 TOP:")
    for k, v in sorted(stats["byTheme"].items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    
    print("\n👁️ 시점:")
    for k, v in sorted(stats["byViewpoint"].items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    
    print("\n🎯 장르:")
    for k, v in sorted(stats["byGenre"].items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")

if __name__ == "__main__":
    main()
