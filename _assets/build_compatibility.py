#!/usr/bin/env python3
"""아트 스타일 호환 그룹 분석 + 세부 스타일 리파인"""

import json, re, os
from collections import defaultdict

# ─── 1. 세부 아트 스타일 분류 ───

def refine_art_style(name, publisher, category, size, coarse_styles):
    """기존 대분류 → 세부 서브스타일"""
    n = name.lower()
    p = publisher.lower()
    c = category.lower()

    # ── 픽셀 세분화 ──
    if "픽셀" in coarse_styles:
        m = re.search(r'(\d+)x(\d+)', n)
        if m:
            px = int(m.group(1))
            if px <= 16:
                return "픽셀-마이크로(≤16px)"
            elif px <= 32:
                return "픽셀-클래식(32px)"
            else:
                return "픽셀-HD(64px+)"
        if any(k in n for k in ["tiny", "mini", "micro", "minifantasy"]):
            return "픽셀-마이크로(≤16px)"
        if any(k in n for k in ["retro", "8-bit", "8bit", "1bit", "1-bit", "nes"]):
            return "픽셀-레트로8비트"
        # 퍼블리셔별 추정
        micro_pubs = {"krishna palacio", "anomaly pixel", "porforever", "nulltale", "dunatos studio",
                      "idkd", "henry software", "aiden art", "startled pixels", "pixelconstructs"}
        classic_pubs = {"ansimuz", "pixel frog", "cainos", "szadi art", "luiz melo", "sven thole",
                        "dead revolver", "eder", "blackspire", "lifty", "superposition principle",
                        "kenmi", "kin ng", "goldmetal", "blue crystal studio", "bg studio"}
        hd_pubs = {"hippo", "soonsoon", "layer lab", "murlyka", "smallscale interactive",
                   "piablood", "app advisory", "phat phrog studio", "natsuyacharacterart"}
        if p in micro_pubs:
            return "픽셀-마이크로(≤16px)"
        if p in hd_pubs:
            return "픽셀-HD(64px+)"
        if p in classic_pubs:
            return "픽셀-클래식(32px)"
        # 크기 기반: 큰 패키지 = HD 가능성
        if size > 20_000_000:
            return "픽셀-HD(64px+)"
        return "픽셀-클래식(32px)"

    # ── 카툰 세분화 ──
    if "카툰" in coarse_styles:
        if any(k in n for k in ["toon", "epic toon", "cartoon fx"]):
            return "카툰-셀셰이딩"
        if any(k in n for k in ["flat", "simple", "clean"]):
            return "카툰-플랫"
        if p in ["ricimi", "sics games"]:
            return "카툰-그라디언트"
        if p in ["severin baclet", "blackthornprod"]:
            return "카툰-아웃라인"
        if any(k in n for k in ["outline", "cel"]):
            return "카툰-아웃라인"
        return "카툰-그라디언트"

    # ── 로우폴리 세분화 ──
    if "로우폴리" in coarse_styles:
        if p in ["synty studios"]:
            return "로우폴리-Synty스타일"
        if p in ["polybox"]:
            return "로우폴리-파스텔"
        if any(k in n for k in ["polygon", "synty"]):
            return "로우폴리-Synty스타일"
        if any(k in n for k in ["cute", "kawaii", "chibi"]):
            return "로우폴리-파스텔"
        if p in ["justcreate"]:
            return "로우폴리-파스텔"
        if p in ["castle bravo"]:
            return "로우폴리-밀리터리"
        return "로우폴리-일반"

    # ── 리얼리스틱 세분화 ──
    if "리얼리스틱" in coarse_styles:
        if any(k in n for k in ["pbr", "scanned", "photorealistic", "4k"]):
            return "리얼리스틱-PBR"
        if any(k in n for k in ["hand painted", "hand-painted", "handpainted"]):
            return "리얼리스틱-핸드페인팅"
        if p in ["ida faber", "maksim bugrimov"]:
            return "리얼리스틱-하이폴리"
        if p in ["naturemanufacture", "leartes studios"]:
            return "리얼리스틱-PBR"
        return "리얼리스틱-일반"

    # ── 스타일라이즈드 세분화 ──
    if "스타일라이즈드" in coarse_styles:
        if any(k in n for k in ["hand painted", "hand-painted", "handpainted", "painterly"]):
            return "스타일라이즈드-핸드페인팅"
        if p in ["stylarts"]:
            return "스타일라이즈드-핸드페인팅"
        if p in ["vefects"]:
            return "스타일라이즈드-클린"
        if p in ["hovl studio", "piloto studio", "whitebox studio", "gabriel aguiar prod"]:
            return "스타일라이즈드-VFX특화"
        if p in ["n-hance studio"]:
            return "스타일라이즈드-파스텔"
        return "스타일라이즈드-클린"

    # ── 애니메 세분화 ──
    if "애니메" in coarse_styles:
        if any(k in n for k in ["chibi"]):
            return "애니메-치비"
        return "애니메-일반"

    # ── 플랫/미니멀 세분화 ──
    if "플랫/미니멀" in coarse_styles:
        if "gui" in c or "gui" in n:
            return "플랫-UI/GUI"
        if "icon" in c or "icon" in n:
            return "플랫-아이콘"
        if any(k in n for k in ["simple", "basic", "clean", "minimal"]):
            return "플랫-미니멀"
        return "플랫-일반"

    # ── 네온/사이버 ──
    if "네온/사이버" in coarse_styles:
        return "네온/사이버펑크"

    # ── 벡터 ──
    if "벡터" in coarse_styles:
        return "벡터/SVG"

    return "범용"

# ─── 2. 호환성 규칙 매트릭스 ───

COMPAT_MATRIX = {
    # (스타일A, 스타일B) → 호환 레벨: 3=완벽 2=가능 1=주의 0=불가

    # ── 픽셀 내부 ──
    ("픽셀-마이크로(≤16px)", "픽셀-클래식(32px)"): 1,
    ("픽셀-클래식(32px)", "픽셀-HD(64px+)"): 1,
    ("픽셀-마이크로(≤16px)", "픽셀-HD(64px+)"): 0,
    ("픽셀-레트로8비트", "픽셀-마이크로(≤16px)"): 2,
    ("픽셀-레트로8비트", "픽셀-클래식(32px)"): 2,
    ("픽셀-레트로8비트", "픽셀-HD(64px+)"): 1,

    # ── 로우폴리 내부 ──
    ("로우폴리-Synty스타일", "로우폴리-파스텔"): 1,
    ("로우폴리-Synty스타일", "로우폴리-일반"): 2,
    ("로우폴리-파스텔", "로우폴리-일반"): 2,
    ("로우폴리-밀리터리", "로우폴리-일반"): 2,
    ("로우폴리-밀리터리", "로우폴리-Synty스타일"): 1,

    # ── 카툰 내부 ──
    ("카툰-셀셰이딩", "카툰-그라디언트"): 2,
    ("카툰-셀셰이딩", "카툰-아웃라인"): 2,
    ("카툰-그라디언트", "카툰-아웃라인"): 2,
    ("카툰-플랫", "카툰-셀셰이딩"): 1,
    ("카툰-플랫", "카툰-그라디언트"): 2,

    # ── 리얼리스틱 내부 ──
    ("리얼리스틱-PBR", "리얼리스틱-하이폴리"): 2,
    ("리얼리스틱-PBR", "리얼리스틱-핸드페인팅"): 1,
    ("리얼리스틱-PBR", "리얼리스틱-일반"): 2,
    ("리얼리스틱-하이폴리", "리얼리스틱-일반"): 2,
    ("리얼리스틱-핸드페인팅", "리얼리스틱-일반"): 1,

    # ── 스타일라이즈드 내부 ──
    ("스타일라이즈드-핸드페인팅", "스타일라이즈드-클린"): 1,
    ("스타일라이즈드-핸드페인팅", "스타일라이즈드-파스텔"): 2,
    ("스타일라이즈드-클린", "스타일라이즈드-파스텔"): 2,
    ("스타일라이즈드-VFX특화", "스타일라이즈드-클린"): 3,  # VFX는 클린과 완벽
    ("스타일라이즈드-VFX특화", "스타일라이즈드-파스텔"): 2,
    ("스타일라이즈드-VFX특화", "스타일라이즈드-핸드페인팅"): 2,

    # ── 플랫 내부 (UI계열 → 대부분 게임 스타일 무관) ──
    ("플랫-미니멀", "플랫-UI/GUI"): 3,
    ("플랫-미니멀", "플랫-아이콘"): 3,
    ("플랫-미니멀", "플랫-일반"): 3,
    ("플랫-UI/GUI", "플랫-아이콘"): 3,
    ("플랫-UI/GUI", "플랫-일반"): 3,
    ("플랫-아이콘", "플랫-일반"): 3,

    # ── 크로스 계열: 로우폴리 ↔ 카툰/스타일 ──
    ("로우폴리-Synty스타일", "카툰-셀셰이딩"): 2,  # Synty+카툰톤은 어울림
    ("로우폴리-파스텔", "카툰-그라디언트"): 2,
    ("로우폴리-파스텔", "스타일라이즈드-파스텔"): 2,
    ("로우폴리-파스텔", "스타일라이즈드-클린"): 2,
    ("로우폴리-일반", "카툰-셀셰이딩"): 1,
    ("로우폴리-일반", "스타일라이즈드-클린"): 1,

    # ── 크로스: 카툰 ↔ 스타일라이즈드 ──
    ("카툰-셀셰이딩", "스타일라이즈드-클린"): 2,
    ("카툰-그라디언트", "스타일라이즈드-클린"): 1,
    ("카툰-아웃라인", "스타일라이즈드-핸드페인팅"): 1,

    # ── 크로스: 애니메 ↔ 카툰/스타일 ──
    ("애니메-일반", "카툰-셀셰이딩"): 2,
    ("애니메-일반", "스타일라이즈드-클린"): 2,
    ("애니메-치비", "카툰-셀셰이딩"): 2,
    ("애니메-치비", "카툰-그라디언트"): 2,
    ("애니메-일반", "로우폴리-파스텔"): 1,

    # ── 플랫 UI는 어느 스타일에든 보조 사용 가능 ──
    ("플랫-UI/GUI", "픽셀-클래식(32px)"): 1,   # 약간 이질적이지만 UI로는 사용 가능
    ("플랫-UI/GUI", "카툰-셀셰이딩"): 2,
    ("플랫-UI/GUI", "로우폴리-Synty스타일"): 2,
    ("플랫-UI/GUI", "스타일라이즈드-클린"): 2,
    ("플랫-UI/GUI", "로우폴리-파스텔"): 2,
    ("플랫-UI/GUI", "애니메-일반"): 2,
    ("플랫-아이콘", "픽셀-클래식(32px)"): 1,
    ("플랫-아이콘", "카툰-셀셰이딩"): 2,
    ("플랫-아이콘", "로우폴리-Synty스타일"): 2,
    ("플랫-아이콘", "스타일라이즈드-클린"): 2,
    ("플랫-아이콘", "리얼리스틱-하이폴리"): 1,

    # ── 스타일라이즈드 VFX는 3D 계열 범용 ──
    ("스타일라이즈드-VFX특화", "로우폴리-Synty스타일"): 2,
    ("스타일라이즈드-VFX특화", "로우폴리-파스텔"): 2,
    ("스타일라이즈드-VFX특화", "로우폴리-일반"): 2,
    ("스타일라이즈드-VFX특화", "카툰-셀셰이딩"): 2,
    ("스타일라이즈드-VFX특화", "애니메-일반"): 2,
    ("스타일라이즈드-VFX특화", "리얼리스틱-하이폴리"): 1,
    ("스타일라이즈드-VFX특화", "리얼리스틱-PBR"): 1,

    # ── 리얼리스틱 ↔ 나머지 (대부분 불가) ──
    ("리얼리스틱-PBR", "리얼리스틱-하이폴리"): 2,
    ("리얼리스틱-하이폴리", "애니메-일반"): 1,  # 캐릭터만 애니메, 환경 리얼 = 셀셰이드 렌더
    ("리얼리스틱-하이폴리", "스타일라이즈드-클린"): 1,

    # ── 네온/사이버 ──
    ("네온/사이버펑크", "리얼리스틱-PBR"): 2,   # 사이버펑크 게임은 PBR+네온 자연스러움
    ("네온/사이버펑크", "리얼리스틱-하이폴리"): 2,
    ("네온/사이버펑크", "스타일라이즈드-클린"): 2,
    ("네온/사이버펑크", "로우폴리-Synty스타일"): 1,
    ("네온/사이버펑크", "픽셀-클래식(32px)"): 1,  # 사이버펑크 픽셀 가능
    ("네온/사이버펑크", "픽셀-HD(64px+)"): 2,

    # ── 벡터 ──
    ("벡터/SVG", "플랫-UI/GUI"): 2,
    ("벡터/SVG", "플랫-아이콘"): 2,
    ("벡터/SVG", "플랫-미니멀"): 2,
}

# VFX/오디오/도구는 모든 스타일과 호환
UNIVERSAL_TYPES = {"VFX/셰이더", "오디오", "도구/플러그인", "완성프로젝트", "애니메이션", "스카이박스"}
# VFX 중에서도 스타일별 호환
VFX_STYLE_COMPAT = {
    "픽셀": ["Retro Arsenal", "Arcade Pixel", "DL Fantasy RPG"],
    "카툰": ["Cartoon FX", "Epic Toon", "Hyper Casual"],
    "로우폴리": ["Polygon Arsenal", "Simple FX"],
    "스타일라이즈드": ["Board Card Game", "100 Special Skills", "RPG VFX Bundle"],
}

def get_compat_level(style_a, style_b):
    """두 서브스타일 간 호환 레벨 반환"""
    if style_a == style_b:
        return 3
    key1 = (style_a, style_b)
    key2 = (style_b, style_a)
    if key1 in COMPAT_MATRIX:
        return COMPAT_MATRIX[key1]
    if key2 in COMPAT_MATRIX:
        return COMPAT_MATRIX[key2]
    # 같은 대분류면 1 (주의), 다르면 0 (불가)
    base_a = style_a.split("-")[0] if "-" in style_a else style_a
    base_b = style_b.split("-")[0] if "-" in style_b else style_b
    if base_a == base_b:
        return 1
    return 0

# ─── 3. 게임 레디 번들 생성 ───

def has_role(usages, role):
    """용도에 특정 역할이 있는지"""
    for u in usages:
        if role in u:
            return True
    return False

def build_game_bundles(assets_by_style):
    """스타일별 게임 완성 가능 번들 생성"""
    bundles = []
    for style, assets in assets_by_style.items():
        if style == "범용":
            continue
        chars = [a for a in assets if has_role(a["usage"], "캐릭터")]
        envs = [a for a in assets if has_role(a["usage"], "환경") or has_role(a["usage"], "타일셋") or has_role(a["usage"], "배경")]
        uis = [a for a in assets if has_role(a["usage"], "UI") or has_role(a["usage"], "아이콘")]
        props = [a for a in assets if has_role(a["usage"], "소품") or has_role(a["usage"], "무기")]
        
        completeness = sum([len(chars) > 0, len(envs) > 0, len(uis) > 0, len(props) > 0])
        
        if completeness >= 2 and len(chars) > 0:
            bundles.append({
                "style": style,
                "completeness": completeness,
                "chars": chars,
                "envs": envs,
                "uis": uis,
                "props": props,
                "total": len(assets),
            })
    
    bundles.sort(key=lambda x: (-x["completeness"], -x["total"]))
    return bundles

# ─── 메인 ───

def main():
    with open("/Users/kjaylee/clawd/_assets/asset-search-index.json") as f:
        data = json.load(f)

    # 세부 스타일 태깅
    for d in data:
        d["subStyle"] = refine_art_style(
            d["name"], d["publisher"], d["category"],
            d["size"], d["artStyle"]
        )

    # JSON 업데이트
    with open("/Users/kjaylee/clawd/_assets/asset-search-index.json", "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 서브스타일별 그룹핑
    by_substyle = defaultdict(list)
    for d in data:
        by_substyle[d["subStyle"]].append(d)

    # 퍼블리셔별 그룹핑
    by_publisher = defaultdict(list)
    for d in data:
        by_publisher[d["publisher"]].append(d)

    # ─── 호환 그룹 분석 ───
    game_bundles = build_game_bundles(by_substyle)

    # ─── 퍼블리셔 코히어런스 분석 ───
    pub_coherence = []
    for pub, assets in by_publisher.items():
        if len(assets) < 3:
            continue
        styles = set(a["subStyle"] for a in assets)
        non_generic = [s for s in styles if s != "범용"]
        if len(non_generic) <= 1 and non_generic:
            coherence = "완벽"
        elif len(non_generic) <= 2:
            coherence = "높음"
        else:
            coherence = "혼합"
        
        usages = set()
        for a in assets:
            for u in a["usage"]:
                usages.add(u)
        
        pub_coherence.append({
            "publisher": pub,
            "count": len(assets),
            "coherence": coherence,
            "styles": sorted(non_generic) if non_generic else sorted(styles),
            "usages": sorted(usages),
        })
    pub_coherence.sort(key=lambda x: (-x["count"]))

    # ─── 혼용 불가 경고 생성 ───
    warnings = [
        ("픽셀-마이크로(≤16px)", "리얼리스틱-PBR", "16px 픽셀과 PBR 리얼리스틱은 완전히 다른 세계"),
        ("픽셀-마이크로(≤16px)", "리얼리스틱-하이폴리", "타일 해상도와 폴리곤 밀도 충돌"),
        ("픽셀-클래식(32px)", "리얼리스틱-PBR", "픽셀 그리드와 PBR 텍스처 부조화"),
        ("픽셀-클래식(32px)", "로우폴리-Synty스타일", "2D 픽셀과 3D 로우폴리 혼합 어색"),
        ("카툰-아웃라인", "리얼리스틱-하이폴리", "아웃라인 스타일과 리얼리스틱 이질감"),
        ("로우폴리-Synty스타일", "리얼리스틱-PBR", "Synty 로우폴리와 PBR 환경은 톤 불일치"),
        ("애니메-일반", "리얼리스틱-PBR", "애니메 셀셰이드와 PBR 머티리얼 충돌"),
        ("네온/사이버펑크", "픽셀-마이크로(≤16px)", "네온 이펙트가 마이크로 픽셀에서 해상도 부족"),
        ("플랫-UI/GUI", "리얼리스틱-PBR", "플랫 UI는 리얼리스틱 게임에서 부조화 (의도적 제외)"),
    ]

    # ─── Markdown 생성 ───
    md = []
    
    # ===== 세부 스타일 통계 =====
    md.append("\n\n---\n# 🎨 아트 스타일 호환 분석\n")
    md.append("> 에셋을 게임에 쓸 때 가장 중요한 건 **스타일 통일**.\n")
    md.append("> 같은 '픽셀'이라도 16px과 64px는 혼용 불가. 이 섹션이 해결.\n")

    # 세부 스타일 분포
    md.append("## 📊 세부 아트 스타일 분포\n")
    md.append("| 세부 스타일 | 수량 | 대표 퍼블리셔 |")
    md.append("|-----------|------|------------|")
    for style in sorted(by_substyle.keys(), key=lambda x: -len(by_substyle[x])):
        assets = by_substyle[style]
        pubs = defaultdict(int)
        for a in assets:
            pubs[a["publisher"]] += 1
        top_pubs = ", ".join(f"{p}({c})" for p, c in sorted(pubs.items(), key=lambda x: -x[1])[:3])
        md.append(f"| {style} | {len(assets)} | {top_pubs} |")

    # ===== 게임 레디 번들 =====
    md.append("\n## 🎮 게임 레디 번들 — 이 조합으로 게임 완성 가능\n")
    md.append("> 같은 세부 스타일 안에서 캐릭터+환경+UI+소품이 갖춰진 그룹\n")
    
    for i, b in enumerate(game_bundles):
        stars = "⭐" * b["completeness"]
        md.append(f"\n### {stars} 그룹 {i+1}: 「{b['style']}」 ({b['total']}개 에셋)\n")
        
        coverage = []
        if b["chars"]: coverage.append(f"✅ 캐릭터({len(b['chars'])})")
        else: coverage.append("❌ 캐릭터")
        if b["envs"]: coverage.append(f"✅ 환경/배경({len(b['envs'])})")
        else: coverage.append("❌ 환경/배경")
        if b["uis"]: coverage.append(f"✅ UI/아이콘({len(b['uis'])})")
        else: coverage.append("❌ UI/아이콘")
        if b["props"]: coverage.append(f"✅ 소품/무기({len(b['props'])})")
        else: coverage.append("❌ 소품/무기")
        md.append(f"**커버리지:** {' | '.join(coverage)}\n")
        
        if b["chars"]:
            md.append("**캐릭터:**")
            for a in b["chars"][:8]:
                loc = "💾" if a.get("location") == "로컬" else "☁️"
                md.append(f"- {loc} {a['name']} ({a['publisher']}) — {a['sizeHuman']}")
            if len(b["chars"]) > 8:
                md.append(f"- ... 외 {len(b['chars'])-8}개")
        
        if b["envs"]:
            md.append("\n**환경/배경:**")
            for a in b["envs"][:8]:
                loc = "💾" if a.get("location") == "로컬" else "☁️"
                md.append(f"- {loc} {a['name']} ({a['publisher']}) — {a['sizeHuman']}")
            if len(b["envs"]) > 8:
                md.append(f"- ... 외 {len(b['envs'])-8}개")
        
        if b["uis"]:
            md.append("\n**UI/아이콘:**")
            for a in b["uis"][:5]:
                loc = "💾" if a.get("location") == "로컬" else "☁️"
                md.append(f"- {loc} {a['name']} ({a['publisher']}) — {a['sizeHuman']}")
            if len(b["uis"]) > 5:
                md.append(f"- ... 외 {len(b['uis'])-5}개")
        
        if b["props"]:
            md.append("\n**소품/무기:**")
            for a in b["props"][:5]:
                loc = "💾" if a.get("location") == "로컬" else "☁️"
                md.append(f"- {loc} {a['name']} ({a['publisher']}) — {a['sizeHuman']}")
            if len(b["props"]) > 5:
                md.append(f"- ... 외 {len(b['props'])-5}개")

    # ===== VFX 호환 매칭 =====
    md.append("\n## ✨ VFX 스타일별 추천 매칭\n")
    md.append("> VFX는 대부분 범용이지만, 최적 매칭이 있음\n")
    
    vfx_assets = [d for d in data if d["type"] in ("VFX/셰이더",)]
    
    vfx_groups = {
        "픽셀 계열 ← 레트로/픽셀 VFX": [],
        "카툰 계열 ← 카툰 VFX": [],
        "로우폴리/스타일라이즈드 ← 스타일라이즈드 VFX": [],
        "리얼리스틱 계열 ← PBR/고품질 VFX": [],
        "범용 VFX (모든 스타일)": [],
    }
    
    for v in vfx_assets:
        n = v["name"].lower()
        if any(k in n for k in ["retro", "pixel", "arcade pixel", "8-bit"]):
            vfx_groups["픽셀 계열 ← 레트로/픽셀 VFX"].append(v)
        elif any(k in n for k in ["cartoon", "toon", "hyper casual"]):
            vfx_groups["카툰 계열 ← 카툰 VFX"].append(v)
        elif any(k in n for k in ["stylized", "board card", "anime", "buff", "lumen"]):
            vfx_groups["로우폴리/스타일라이즈드 ← 스타일라이즈드 VFX"].append(v)
        elif any(k in n for k in ["realistic", "blood", "war"]):
            vfx_groups["리얼리스틱 계열 ← PBR/고품질 VFX"].append(v)
        else:
            vfx_groups["범용 VFX (모든 스타일)"].append(v)
    
    for group_name, vfx_list in vfx_groups.items():
        if not vfx_list:
            continue
        md.append(f"\n### {group_name}")
        for v in vfx_list:
            loc = "💾" if v.get("location") == "로컬" else "☁️"
            md.append(f"- {loc} {v['name']} ({v['publisher']}) — {v['sizeHuman']}")

    # ===== 퍼블리셔 코히어런스 =====
    md.append("\n## 🏢 퍼블리셔별 스타일 통일성\n")
    md.append("> 같은 퍼블리셔 에셋은 보통 스타일이 통일됨 → **안전한 조합**\n")
    md.append("| 퍼블리셔 | 에셋수 | 통일성 | 세부 스타일 | 주요 용도 |")
    md.append("|---------|--------|--------|-----------|----------|")
    
    coherence_emoji = {"완벽": "🟢", "높음": "🟡", "혼합": "🔴"}
    for pc in pub_coherence:
        emoji = coherence_emoji.get(pc["coherence"], "⚪")
        styles_str = ", ".join(pc["styles"][:3])
        usages_str = ", ".join(pc["usages"][:5])
        md.append(f"| {pc['publisher']} | {pc['count']} | {emoji} {pc['coherence']} | {styles_str} | {usages_str} |")

    # 퍼블리셔 번들 상세 (완벽 통일 3개+)
    md.append("\n### 🟢 완벽 통일 퍼블리셔 상세\n")
    for pc in pub_coherence:
        if pc["coherence"] != "완벽" or pc["count"] < 3:
            continue
        md.append(f"#### {pc['publisher']} ({pc['count']}개) — {pc['styles'][0]}\n")
        pub_assets = by_publisher[pc["publisher"]]
        for a in pub_assets:
            loc = "💾" if a.get("location") == "로컬" else "☁️"
            u = ",".join(a["usage"][:3])
            md.append(f"- {loc} **{a['name']}** [{u}] {a['sizeHuman']}")
        md.append("")

    # ===== 혼용 불가 경고 =====
    md.append("\n## 🚨 혼용 불가 경고\n")
    md.append("> 이 조합은 스타일이 절대 안 맞음. 한 게임에 섞어 쓰지 말 것!\n")
    md.append("| 스타일 A | 스타일 B | 이유 |")
    md.append("|---------|---------|------|")
    for sa, sb, reason in warnings:
        count_a = len(by_substyle.get(sa, []))
        count_b = len(by_substyle.get(sb, []))
        md.append(f"| {sa} ({count_a}개) | {sb} ({count_b}개) | ⛔ {reason} |")

    # ===== 호환성 매트릭스 요약 =====
    md.append("\n## 🔀 스타일 호환성 매트릭스 (주요)\n")
    md.append("> 🟢=완벽 🟡=가능 🟠=주의 🔴=불가\n")

    major_styles = [s for s in sorted(by_substyle.keys(), key=lambda x: -len(by_substyle[x])) 
                    if s != "범용" and len(by_substyle[s]) >= 3][:12]
    
    # 축약명 매핑
    short = {
        "픽셀-클래식(32px)": "PX32",
        "플랫-아이콘": "아이콘",
        "플랫-UI/GUI": "UI",
        "스타일라이즈드-클린": "S클린",
        "픽셀-HD(64px+)": "PXHD",
        "스타일라이즈드-핸드페인팅": "S페인팅",
        "픽셀-마이크로(≤16px)": "PX16",
        "카툰-셀셰이딩": "C셀",
        "플랫-미니멀": "미니멀",
        "스타일라이즈드-VFX특화": "SVFX",
        "로우폴리-일반": "LP일반",
        "리얼리스틱-하이폴리": "R하이",
        "픽셀-레트로8비트": "PX8",
        "카툰-그라디언트": "C그라",
        "리얼리스틱-PBR": "RPBR",
        "네온/사이버펑크": "네온",
        "로우폴리-파스텔": "LP파스",
        "로우폴리-Synty스타일": "LPSy",
        "애니메-일반": "ANI",
    }
    
    header = "| 스타일 | " + " | ".join(short.get(s, s[:4]) for s in major_styles) + " |"
    sep = "|---|" + "|".join(":---:" for _ in major_styles) + "|"
    md.append(header)
    md.append(sep)
    
    compat_emoji = {3: "🟢", 2: "🟡", 1: "🟠", 0: "🔴"}
    for sa in major_styles:
        row = f"| **{short.get(sa, sa[:6])}** |"
        for sb in major_styles:
            level = get_compat_level(sa, sb)
            row += f" {compat_emoji[level]} |"
        md.append(row)
    
    md.append(f"\n**범례:** PX=픽셀 LP=로우폴리 S=스타일라이즈드 C=카툰 R=리얼리스틱 ANI=애니메")

    # ===== 통합 Markdown 파일에 추가 =====
    # 기존 classified.md 읽기
    classified_path = "/Users/kjaylee/clawd/_assets/unity-assets-classified.md"
    with open(classified_path) as f:
        existing = f.read()
    
    # 기존 호환 분석 섹션 제거 (있으면)
    marker = "\n\n---\n# 🎨 아트 스타일 호환 분석"
    if marker in existing:
        existing = existing[:existing.index(marker)]
    
    # 추가
    with open(classified_path, "w") as f:
        f.write(existing + "\n".join(md))
    
    # 통계 출력
    print(f"✅ 호환 분석 추가 완료: {classified_path}")
    print(f"   세부 스타일: {len(by_substyle)}종")
    print(f"   게임레디 번들: {len(game_bundles)}개")
    print(f"   퍼블리셔 분석: {len(pub_coherence)}개")
    print(f"   혼용불가 경고: {len(warnings)}개")
    
    # 번들 요약
    print(f"\n🎮 게임 레디 번들 TOP 5:")
    for i, b in enumerate(game_bundles[:5]):
        stars = "⭐" * b["completeness"]
        print(f"  {stars} {b['style']}: {b['total']}개 (캐:{len(b['chars'])} 환:{len(b['envs'])} UI:{len(b['uis'])} 소:{len(b['props'])})")

if __name__ == "__main__":
    main()
