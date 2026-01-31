#!/usr/bin/env python3
"""Unity Asset 다축 분류 스크립트 — 645 packages → 8-axis tagging"""

import json, re, os
from pathlib import Path

# ─── 패키지 목록 로드 ───
def load_packages(path="/tmp/all-unity-packages.txt"):
    assets = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or "|" not in line:
                continue
            rel, sz = line.rsplit("|", 1)
            parts = rel.split("/")
            publisher = parts[0]
            category = parts[1] if len(parts) > 1 else ""
            name = parts[-1].replace(".unitypackage", "")
            assets.append({
                "publisher": publisher,
                "category": category,
                "rawName": name,
                "size": int(sz),
                "relPath": rel,
            })
    return assets

# ─── 키워드 기반 분류 규칙 ───

def classify_asset_type(cat, name_l):
    """에셋 타입 (8축 중 기본)"""
    cat_l = cat.lower()
    if "3d model" in cat_l:
        return "3D모델"
    if "particle" in cat_l or "vfx" in cat_l:
        return "VFX/셰이더"
    if "shader" in cat_l:
        return "VFX/셰이더"
    if "audio" in cat_l:
        return "오디오"
    if "editor ext" in cat_l or "scripting" in cat_l or "tools" in cat_l or "decentralization" in cat_l:
        return "도구/플러그인"
    if "animation" in cat_l and "editor" not in cat_l:
        return "애니메이션"
    if "complete project" in cat_l:
        return "완성프로젝트"
    # 2D 판별
    if "2d" in cat_l or "icon" in cat_l or "gui" in cat_l or "font" in cat_l:
        return "2D스프라이트"
    if "texture" in cat_l:
        # 텍스처 계열 → 이름으로 세분
        if any(k in name_l for k in ["skybox", "sky box", "skies"]):
            return "스카이박스"
        if any(k in name_l for k in ["pbr", "seamless", "tileable", "floor", "stone texture", "brick", "grass texture", "dirt", "lava", "metal", "pavement"]):
            return "텍스처/머티리얼"
        return "2D스프라이트"
    return "기타"

def classify_art_style(name_l, cat_l, publisher_l):
    """아트 스타일"""
    styles = []
    if any(k in name_l for k in ["pixel", "8-bit", "8bit", "retro", "1bit", "1-bit", "16x16", "32x32", "64x64"]):
        styles.append("픽셀")
    if any(k in name_l for k in ["cartoon", "toon", "cartoony"]):
        styles.append("카툰")
    if any(k in name_l for k in ["low poly", "lowpoly", "low-poly", "polyart", "polygon"]):
        styles.append("로우폴리")
    if any(k in name_l for k in ["realistic", "pbr", "scanned", "photorealistic", "hq"]):
        styles.append("리얼리스틱")
    if any(k in name_l for k in ["anime", "chibi", "kawaii", "manga"]):
        styles.append("애니메")
    if any(k in name_l for k in ["stylized", "stylised", "hand painted", "hand-painted", "handpainted", "painterly"]):
        styles.append("스타일라이즈드")
    if any(k in name_l for k in ["flat", "minimal", "simple", "clean", "basic"]):
        styles.append("플랫/미니멀")
    if any(k in name_l for k in ["vector"]):
        styles.append("벡터")
    if any(k in name_l for k in ["neon", "cyberpunk", "sci-fi", "scifi"]):
        if "네온" not in styles:
            styles.append("네온/사이버")
    if not styles:
        # 퍼블리셔 기반 추정
        pixel_pubs = {"pixel frog", "ansimuz", "cainos", "kenmi", "sven thole", "luiz melo",
                      "dead revolver", "szadi art", "henry software", "eder", "blackspire",
                      "goldmetal", "karsiori", "aiden art", "hiro hamstone", "lifty",
                      "superposition principle", "anomaly pixel", "pixelart studio",
                      "pixelchad", "pixelconstructs", "pixelmush", "grande pixel",
                      "blue crystal studio", "littlesweet daemon", "bg studio",
                      "krishna palacio", "nulltale", "porforever", "chromisu"}
        cartoon_pubs = {"sics games", "ricimi", "severin baclet", "app advisory",
                        "blackthornprod", "brackeys", "blue goblin store"}
        lowpoly_pubs = {"synty studios", "justcreate", "polybox", "bitgem",
                        "polyperfect", "dungeon mason", "off axis studios", "lmhpoly"}
        realistic_pubs = {"ida faber", "naturemanufacture", "leartes studios",
                          "scans factory", "gabro media", "art equilibrium"}
        stylized_pubs = {"stylarts", "n-hance studio", "sics games", "vefects",
                         "hovl studio", "piloto studio", "whitebox studio"}
        if publisher_l in pixel_pubs:
            styles.append("픽셀")
        elif publisher_l in cartoon_pubs:
            styles.append("카툰")
        elif publisher_l in lowpoly_pubs:
            styles.append("로우폴리")
        elif publisher_l in realistic_pubs:
            styles.append("리얼리스틱")
        elif publisher_l in stylized_pubs:
            styles.append("스타일라이즈드")
        elif "2d character" in cat_l or "2d isometric" in cat_l:
            styles.append("픽셀")  # 대부분 2D 에셋은 픽셀 계열
        elif "gui" in cat_l or "icon" in cat_l:
            styles.append("플랫/미니멀")
        elif "ground" in cat_l or "stone" in cat_l or "nature" in cat_l or "brick" in cat_l or "metal" in cat_l:
            styles.append("리얼리스틱")
        elif "particle" in cat_l or "vfx" in cat_l:
            styles.append("스타일라이즈드")
        else:
            styles.append("범용")
    return styles

def classify_usage(name_l, cat_l):
    """용도"""
    usages = []
    if "character" in cat_l or "character" in name_l or "hero" in name_l or "warrior" in name_l or "girl" in name_l or "knight" in name_l or "zombie" in name_l or "monster" in name_l or "creature" in name_l or "skeleton" in name_l or "wizard" in name_l or "soldier" in name_l or "avatar" in name_l or "npc" in name_l:
        usages.append("캐릭터")
    if "gui" in cat_l or "gui" in name_l or "ui " in name_l or "menu" in name_l or "button" in name_l or "panel" in name_l or "hud" in name_l or "crosshair" in name_l:
        usages.append("UI")
    if "icon" in cat_l or "icon" in name_l or "emoji" in name_l or "cursor" in name_l:
        usages.append("아이콘")
    if "tile" in name_l or "tileset" in name_l or "tilemap" in name_l:
        usages.append("타일셋")
    if "background" in name_l or "parallax" in name_l or "skybox" in name_l or "skies" in name_l or "sky " in name_l:
        usages.append("배경")
    if "environment" in name_l or "dungeon" in name_l or "forest" in name_l or "cave" in name_l or "city" in name_l or "village" in name_l or "island" in name_l or "house" in name_l or "room" in name_l or "interior" in name_l or "castle" in name_l or "church" in name_l:
        usages.append("환경")
    if "effect" in name_l or "vfx" in name_l or "fx" in name_l or "particle" in name_l or "explosion" in name_l or "fire " in name_l or "lightning" in name_l or "aura" in name_l or "projectile" in name_l or "dissolve" in name_l:
        usages.append("이펙트")
    if "weapon" in name_l or "sword" in name_l or "gun" in name_l or "pistol" in name_l or "rifle" in name_l or "missile" in name_l or "katana" in name_l:
        usages.append("무기")
    if "prop" in name_l or "chest" in name_l or "furniture" in name_l or "item" in name_l or "coin" in name_l or "gem " in name_l or "potion" in name_l or "food" in name_l or "loot" in name_l:
        usages.append("소품")
    if "font" in cat_l or "font" in name_l:
        usages.append("폰트")
    if "texture" in name_l or "material" in name_l or "pbr" in name_l or ("texture" in cat_l and not usages):
        usages.append("텍스처")
    if "sfx" in name_l or "sound" in name_l or "audio" in name_l or "music" in name_l or "bgm" in name_l or "footstep" in name_l or "punch" in name_l:
        usages.append("사운드")
    if "animation" in name_l or "anim " in name_l or "animset" in name_l or "motion" in name_l or "locomotion" in name_l or "dance" in name_l:
        usages.append("애니메이션")
    if "shader" in name_l or "shadow" in name_l or "fog" in name_l:
        usages.append("셰이더")
    if "editor" in name_l or "tool" in name_l or "inspector" in name_l or "hot reload" in name_l:
        usages.append("에디터도구")
    if "engine" in name_l or "framework" in name_l or "controller" in name_l or "system" in name_l or "template" in name_l:
        usages.append("게임시스템")
    if "tree" in name_l or "plant" in name_l or "rock" in name_l or "grass" in name_l or "flower" in name_l or "bush" in name_l or "nature" in name_l or "stone" in name_l:
        usages.append("자연요소")
    if not usages:
        usages.append("범용")
    return usages

def classify_theme(name_l, publisher_l):
    """테마"""
    themes = []
    if any(k in name_l for k in ["fantasy", "medieval", "kingdom", "knight", "dragon", "dungeon", "dwarf", "wizard", "magic", "enchant", "rune", "fairy", "elf", "pirate", "gothic"]):
        themes.append("판타지")
    if any(k in name_l for k in ["sci-fi", "scifi", "space", "cyber", "futur", "galaxy", "nebula", "robot", "mech", "tech", "starship", "spaceship", "turret"]):
        themes.append("SF")
    if any(k in name_l for k in ["modern", "city", "urban", "street", "suburban", "car ", "vehicle", "gamer", "school"]):
        themes.append("현대")
    if any(k in name_l for k in ["nature", "forest", "meadow", "mountain", "lake", "island", "tropical", "desert", "ice ", "arctic", "ocean", "underwater", "tree", "grass", "flower"]):
        themes.append("자연")
    if any(k in name_l for k in ["zombie", "undead", "apocalyp", "horror", "abandon", "survival", "post apoc"]):
        themes.append("좀비/포스트아포칼립스")
    if any(k in name_l for k in ["cute", "kawaii", "chibi", "sweet", "casual", "cat ", "pet ", "batty", "baby"]):
        themes.append("귀여운")
    if any(k in name_l for k in ["dark", "demon", "evil", "cursed", "horror", "skull", "death"]):
        themes.append("다크")
    if any(k in name_l for k in ["japanese", "japan", "asian", "korea", "cherry blossom", "samurai", "ninja", "anime"]):
        themes.append("동양")
    if any(k in name_l for k in ["farm", "cooking", "food", "kitchen", "beer", "cake"]):
        themes.append("생활/농장")
    if any(k in name_l for k in ["war ", "military", "combat", "battle", "army", "wwii", "soldier", "shoot"]):
        themes.append("전쟁/밀리터리")
    if any(k in name_l for k in ["casino", "slot", "card ", "poker", "board"]):
        themes.append("카지노/보드")
    if any(k in name_l for k in ["christmas", "halloween", "easter"]):
        themes.append("시즌이벤트")
    if not themes:
        # 카테고리/퍼블리셔 기반 추정
        if any(k in name_l for k in ["platformer", "platform", "tileset", "tile set", "sprite", "gui", "icon", "font", "texture", "ground", "stone", "brick", "lava", "metal", "grass", "shader", "shadow"]):
            themes.append("범용")
        elif any(k in name_l for k in ["rpg", "quest", "inventory", "skill", "spell", "potion", "armor", "weapon", "sword", "staff"]):
            themes.append("판타지")
        elif "audio" in name_l or "sound" in name_l or "sfx" in name_l or "music" in name_l:
            themes.append("범용")
        elif "editor" in name_l or "tool" in name_l or "inspector" in name_l:
            themes.append("범용")
        elif publisher_l in ["ansimuz", "pixel frog", "cainos", "kenmi", "szadi art"]:
            themes.append("판타지")
        elif publisher_l in ["goldmetal"]:
            themes.append("범용")
        elif publisher_l in ["layerlab", "poneti", "ricimi"]:
            themes.append("범용")
        else:
            themes.append("범용")
    return themes

def classify_viewpoint(name_l, cat_l, asset_type):
    """시점 호환"""
    views = []
    if any(k in name_l for k in ["top down", "topdown", "top-down", "bird"]):
        views.append("탑다운")
    if any(k in name_l for k in ["isometric", "iso "]):
        views.append("아이소메트릭")
    if any(k in name_l for k in ["platformer", "platform", "side-scroll", "sidescroll", "side scroll", "sideview"]):
        views.append("사이드뷰")
    if any(k in name_l for k in ["fps", "first person", "1st person"]):
        views.append("1인칭")
    if any(k in name_l for k in ["third person", "3rd person", "tps"]):
        views.append("3인칭")
    if any(k in name_l for k in ["2.5d", "2d+3d"]):
        views.append("2.5D")
    if "isometric" in cat_l or "isometric" in name_l:
        if "아이소메트릭" not in views:
            views.append("아이소메트릭")
    if asset_type == "3D모델":
        if not views:
            views.append("3D자유시점")
    if asset_type in ["오디오", "도구/플러그인", "VFX/셰이더", "애니메이션"]:
        if not views:
            views.append("시점무관")
    if asset_type in ["스카이박스", "텍스처/머티리얼"]:
        if not views:
            views.append("시점무관")
    if not views:
        views.append("범용")
    return views

def classify_genre(name_l, cat_l, usages):
    """장르 적합"""
    genres = []
    if any(k in name_l for k in ["rpg", "fantasy rpg", "action rpg", "arpg", "roguelike", "rogue"]):
        genres.append("RPG")
    if any(k in name_l for k in ["platformer", "platform game"]):
        genres.append("플랫포머")
    if any(k in name_l for k in ["shoot", "fps", "gun", "bullet", "rifle", "pistol", "muzzle"]):
        genres.append("슈팅")
    if any(k in name_l for k in ["puzzle", "match 3", "match3", "block"]):
        genres.append("퍼즐")
    if any(k in name_l for k in ["casual", "hyper casual", "hypercasual"]):
        genres.append("캐주얼")
    if any(k in name_l for k in ["action", "combat", "fight", "melee", "slash"]):
        genres.append("액션")
    if any(k in name_l for k in ["tower defense", "defence", "defense"]):
        genres.append("디펜스")
    if any(k in name_l for k in ["survival", "survivor"]):
        genres.append("서바이벌")
    if any(k in name_l for k in ["strategy", "rts", "tactic"]):
        genres.append("전략")
    if any(k in name_l for k in ["racing", "car ", "vehicle", "drive"]):
        genres.append("레이싱")
    if any(k in name_l for k in ["horror", "scary"]):
        genres.append("호러")
    if any(k in name_l for k in ["simulation", "simul", "farm"]):
        genres.append("시뮬레이션")
    if any(k in name_l for k in ["card game", "card ", "casino", "slot", "poker", "board"]):
        genres.append("카드/보드")
    if any(k in name_l for k in ["metroidvania"]):
        genres.append("메트로배니아")
    if any(k in name_l for k in ["runner", "infinite run"]):
        genres.append("러너")
    if any(k in name_l for k in ["multiplayer", "mmo", "online"]):
        genres.append("멀티플레이어")
    if not genres:
        # 용도 기반 추정
        if "UI" in usages or "아이콘" in usages:
            genres.append("범용")
        elif "캐릭터" in usages:
            genres.append("RPG")
            genres.append("액션")
        elif "타일셋" in usages or "환경" in usages:
            genres.append("RPG")
        elif "이펙트" in usages:
            genres.append("액션")
        else:
            genres.append("범용")
    return genres

def classify_scroll(name_l, views):
    """스크롤 방향"""
    scrolls = []
    if any(k in name_l for k in ["side scroll", "sidescroll", "side-scroll", "horizontal"]):
        scrolls.append("횡스크롤")
    if any(k in name_l for k in ["vertical", "top-down scroll"]):
        scrolls.append("종스크롤")
    if any(k in name_l for k in ["infinite run", "runner", "endless"]):
        scrolls.append("무한스크롤")
    if "사이드뷰" in views and not scrolls:
        scrolls.append("횡스크롤")
    if "탑다운" in views and not scrolls:
        scrolls.append("전방향")
    if "아이소메트릭" in views and not scrolls:
        scrolls.append("전방향")
    if "3D자유시점" in views and not scrolls:
        scrolls.append("전방향")
    if "시점무관" in views and not scrolls:
        scrolls.append("방향무관")
    if not scrolls:
        scrolls.append("고정화면")
    return scrolls

def classify_resolution(name_l, asset_type, size):
    """해상도/품질"""
    res = []
    if any(k in name_l for k in ["4k", "ultra"]):
        res.append("4K")
    if any(k in name_l for k in [" hd", "high def", "hq"]):
        res.append("HD")
    if any(k in name_l for k in ["vector"]):
        res.append("벡터")
    if any(k in name_l for k in ["sprite sheet", "spritesheet", "atlas"]):
        res.append("스프라이트시트")
    if any(k in name_l for k in ["retina"]):
        res.append("레티나")
    if any(k in name_l for k in ["16x16", "32x32"]):
        res.append("SD")
    if any(k in name_l for k in ["pixel", "8-bit", "retro"]):
        if not res:
            res.append("SD")
    if asset_type in ["오디오"]:
        if size > 100_000_000:
            res.append("고품질")
        else:
            res.append("표준")
    if asset_type in ["도구/플러그인", "완성프로젝트"]:
        res.append("해당없음")
    if not res:
        if size > 500_000_000:
            res.append("HD")
        elif size > 50_000_000:
            res.append("HD")
        else:
            res.append("SD")
    return res

def human_size(sz):
    if sz >= 1_000_000_000:
        return f"{sz/1_000_000_000:.1f}GB"
    if sz >= 1_000_000:
        return f"{sz/1_000_000:.1f}MB"
    if sz >= 1_000:
        return f"{sz/1_000:.1f}KB"
    return f"{sz}B"

# ─── 기존 카탈로그 에셋명 추출 ───
def load_existing_names():
    """기존 5개 카탈로그에서 에셋명 추출"""
    existing = set()
    base = "/Users/kjaylee/clawd/_assets"
    files = [
        "unity-assets-2d.md",
        "unity-assets-3d.md",
        "unity-assets-vfx.md",
        "unity-assets-audio.md",
        "unity-assets-tools.md",
    ]
    for fname in files:
        p = os.path.join(base, fname)
        if not os.path.exists(p):
            continue
        with open(p) as f:
            for line in f:
                line = line.strip()
                if line.startswith("|") and "---" not in line and "에셋" not in line and "용량" not in line:
                    cols = [c.strip() for c in line.split("|")]
                    if len(cols) >= 3:
                        name = cols[1]
                        if name and name != "#":
                            existing.add(name.lower().strip())
    return existing

# ─── 메인 ───
def main():
    assets = load_packages()
    existing_names = load_existing_names()
    
    results = []
    new_count = 0
    
    for a in assets:
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
        
        # 신규 여부
        is_new = True
        name_check = a["rawName"].lower().strip()
        for ex in existing_names:
            # 부분 매치로 확인
            if ex in name_check or name_check in ex:
                is_new = False
                break
            # 단어 단위 매치
            ex_words = set(re.findall(r'\w+', ex))
            name_words = set(re.findall(r'\w+', name_check))
            if len(ex_words) >= 3 and len(ex_words & name_words) >= len(ex_words) * 0.7:
                is_new = False
                break
        
        if is_new:
            new_count += 1
        
        results.append({
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
            "isNew": is_new,
            "category": a["category"],
        })
    
    # 정렬: 타입 → 이름
    type_order = {"3D모델": 0, "2D스프라이트": 1, "VFX/셰이더": 2, "오디오": 3, "애니메이션": 4, "도구/플러그인": 5, "완성프로젝트": 6, "스카이박스": 7, "텍스처/머티리얼": 8, "기타": 9}
    results.sort(key=lambda x: (type_order.get(x["type"], 99), x["name"]))
    
    # ─── 통계 ───
    stats = {
        "total": len(results),
        "new": new_count,
        "existing": len(results) - new_count,
        "byType": {},
        "byArtStyle": {},
        "byTheme": {},
        "byViewpoint": {},
        "byGenre": {},
    }
    
    for r in results:
        stats["byType"][r["type"]] = stats["byType"].get(r["type"], 0) + 1
        for s in r["artStyle"]:
            stats["byArtStyle"][s] = stats["byArtStyle"].get(s, 0) + 1
        for t in r["theme"]:
            stats["byTheme"][t] = stats["byTheme"].get(t, 0) + 1
        for v in r["viewpoint"]:
            stats["byViewpoint"][v] = stats["byViewpoint"].get(v, 0) + 1
        for g in r["genre"]:
            stats["byGenre"][g] = stats["byGenre"].get(g, 0) + 1
    
    # ─── Markdown 출력 ───
    out_dir = "/Users/kjaylee/clawd/_assets"
    
    md_lines = []
    md_lines.append("---")
    md_lines.append('title: "유니티 에셋 다축 분류 카탈로그"')
    md_lines.append("---")
    md_lines.append("# 🎮 유니티 에셋 다축 분류 카탈로그\n")
    md_lines.append(f"> **총 {stats['total']}개 에셋** (기존 {stats['existing']}개 + 🆕 신규 {stats['new']}개)")
    md_lines.append(f"> 자동 분류 기준: 에셋명, 퍼블리셔, 카테고리 경로, 파일 크기\n")
    
    # 통계 테이블들
    md_lines.append("## 📊 분류 통계\n")
    
    md_lines.append("### 에셋 타입별")
    md_lines.append("| 타입 | 수량 |")
    md_lines.append("|------|------|")
    for k, v in sorted(stats["byType"].items(), key=lambda x: -x[1]):
        md_lines.append(f"| {k} | {v} |")
    
    md_lines.append("\n### 아트 스타일별")
    md_lines.append("| 스타일 | 수량 |")
    md_lines.append("|--------|------|")
    for k, v in sorted(stats["byArtStyle"].items(), key=lambda x: -x[1]):
        md_lines.append(f"| {k} | {v} |")
    
    md_lines.append("\n### 테마별")
    md_lines.append("| 테마 | 수량 |")
    md_lines.append("|------|------|")
    for k, v in sorted(stats["byTheme"].items(), key=lambda x: -x[1]):
        md_lines.append(f"| {k} | {v} |")
    
    md_lines.append("\n### 시점별")
    md_lines.append("| 시점 | 수량 |")
    md_lines.append("|------|------|")
    for k, v in sorted(stats["byViewpoint"].items(), key=lambda x: -x[1]):
        md_lines.append(f"| {k} | {v} |")
    
    md_lines.append("\n### 장르별")
    md_lines.append("| 장르 | 수량 |")
    md_lines.append("|------|------|")
    for k, v in sorted(stats["byGenre"].items(), key=lambda x: -x[1]):
        md_lines.append(f"| {k} | {v} |")
    
    # 타입별 섹션
    current_type = None
    idx = 0
    for r in results:
        if r["type"] != current_type:
            current_type = r["type"]
            md_lines.append(f"\n---\n## 📦 {current_type}\n")
            md_lines.append("| # | 에셋명 | 퍼블리셔 | 용량 | 아트스타일 | 용도 | 테마 | 시점 | 장르적합 | 스크롤 | 해상도 | 신규 |")
            md_lines.append("|---|--------|---------|------|-----------|------|------|------|---------|--------|--------|------|")
            idx = 0
        idx += 1
        new_mark = "🆕" if r["isNew"] else ""
        md_lines.append(f"| {idx} | {r['name']} | {r['publisher']} | {r['sizeHuman']} | {','.join(r['artStyle'])} | {','.join(r['usage'])} | {','.join(r['theme'])} | {','.join(r['viewpoint'])} | {','.join(r['genre'])} | {','.join(r['scroll'])} | {','.join(r['resolution'])} | {new_mark} |")
    
    md_path = os.path.join(out_dir, "unity-assets-classified.md")
    with open(md_path, "w") as f:
        f.write("\n".join(md_lines))
    print(f"✅ Markdown: {md_path} ({len(results)} assets)")
    
    # ─── JSON 인덱스 ───
    json_data = []
    for r in results:
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
            "isNew": r["isNew"],
            "category": r["category"],
        })
    
    json_path = os.path.join(out_dir, "asset-search-index.json")
    with open(json_path, "w") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"✅ JSON: {json_path} ({len(json_data)} assets)")
    
    # ─── 요약 출력 ───
    print(f"\n{'='*60}")
    print(f"총 에셋: {stats['total']}")
    print(f"기존: {stats['existing']} | 신규: {stats['new']}")
    print(f"{'='*60}")
    print("\n타입별:")
    for k, v in sorted(stats["byType"].items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    print("\n아트 스타일 TOP 10:")
    for k, v in sorted(stats["byArtStyle"].items(), key=lambda x: -x[1])[:10]:
        print(f"  {k}: {v}")
    print("\n테마 TOP 10:")
    for k, v in sorted(stats["byTheme"].items(), key=lambda x: -x[1])[:10]:
        print(f"  {k}: {v}")

if __name__ == "__main__":
    main()
