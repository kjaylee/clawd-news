---
layout: default
title: 게임 기획서
permalink: /games/
---

# 🎮 게임 기획서

> 에셋 기반 게임 기획서 모음 (총 {{ site.games | size }}개)

---

## 📊 트렌드 및 분석 문서

<div class="card-grid">
{% for game in site.games %}
{% if game.order == 0 or game.name contains '트렌드' or game.name contains '에셋_활용' %}
<div class="card">
    <a href="{{ game.url | relative_url }}">
        <h3>📋 {{ game.title | default: game.name }}</h3>
        <p>{{ game.excerpt | strip_html | truncate: 100 }}</p>
    </a>
</div>
{% endif %}
{% endfor %}
</div>

---

## 🎯 게임 기획서

<div class="card-grid">
{% assign sorted_games = site.games | sort: "order" %}
{% for game in sorted_games %}
{% if game.order > 0 %}
<div class="card">
    <a href="{{ game.url | relative_url }}">
        <h3>{{ game.title | default: game.name }}</h3>
        {% if game.genre %}<p style="color: #ff6b9d; font-size: 0.85em; margin-bottom: 5px;">{{ game.genre }}</p>{% endif %}
        <p>{{ game.headline | default: game.excerpt | strip_html | truncate: 80 }}</p>
        {% if game.status == '신규' or game.order > 10 %}
        <span class="tag" style="background: #ff6b9d; color: #000;">✨ 신규</span>
        {% endif %}
    </a>
</div>
{% endif %}
{% endfor %}
</div>

---

## 🎨 활용 가능 에셋

주요 보유 에셋:
- **POLYGON 시리즈** — Dungeons, Horror Mansion, Sci-Fi
- **Tiny Swords** — 2D 픽셀 캐릭터
- **KayKit 시리즈** — 캐주얼 3D
- **Feel** — 게임 필, 햅틱
- **Fantasy RPG GUI** — UI

[전체 에셋 목록 →](/assets/)
