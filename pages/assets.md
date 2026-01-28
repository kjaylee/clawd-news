---
layout: default
title: Unity 에셋
permalink: /assets/
---

# 🎨 Unity 에셋

> 보유 Unity Asset Store 에셋 목록

---

## 📚 에셋 문서

<div class="card-grid">
{% for asset in site.assets %}
<div class="card">
    <a href="{{ asset.url | relative_url }}">
        <h3>{{ asset.title | default: asset.name }}</h3>
        <p>{{ asset.excerpt | strip_html | truncate: 100 }}</p>
    </a>
</div>
{% endfor %}
</div>

---

## 🔧 핵심 도구

| 에셋 | 용도 | 추천 |
|------|------|:----:|
| Feel | 게임 필, 스크린쉐이크, 햅틱 | ⭐⭐⭐ |
| DOTween Pro | 애니메이션, 트위닝 | ⭐⭐⭐ |
| Odin Inspector | 에디터 확장 | ⭐⭐⭐ |
| Hot Reload | 핫 리로드 | ⭐⭐ |

---

## 🎮 게임별 추천 에셋 조합

### 뱀서라이크/로그라이크
- POLYGON Dungeons + Feel + Fantasy RPG GUI

### 타워 디펜스
- Tiny Swords + Dungeon Generation + DOTween

### 캐주얼 3D
- KayKit 시리즈 + Feel + Odin

---

[게임 기획서로 돌아가기 →](/games/)
