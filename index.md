---
layout: default
title: 홈
---

<h1 class="page-title">🚀 주인님의 프로젝트 허브</h1>
<p class="page-meta">데일리 브리핑 · 게임 기획 · Unity 에셋</p>

---

## 📰 최신 브리핑

{% for post in site.posts limit:1 %}
<div class="card" style="background: linear-gradient(135deg, rgba(255,107,157,0.1), rgba(0,212,255,0.05)); border-color: #ff6b9d;">
    <a href="{{ post.url | relative_url }}">
        <h3 style="color: #ff6b9d;">{{ post.headline | default: post.title }}</h3>
        <p>{{ post.summary | default: post.excerpt | strip_html | truncate: 150 }}</p>
        <p style="color: #666; font-size: 0.8em; margin-top: 10px;">{{ post.date | date: "%Y년 %m월 %d일" }}</p>
    </a>
</div>
{% endfor %}

---

## 🎮 게임 기획서

<div class="card-grid">
{% assign sorted_games = site.games | sort: "order" %}
{% for game in sorted_games limit:6 %}
<div class="card">
    <a href="{{ game.url | relative_url }}">
        <h3>{{ game.title | default: game.name }}</h3>
        <p>{{ game.excerpt | strip_html | truncate: 80 }}</p>
    </a>
</div>
{% endfor %}
</div>

[전체 기획서 보기 →]({{ '/games/' | relative_url }})

---

## 🎨 Unity 에셋

<div class="card-grid">
{% for asset in site.assets limit:4 %}
<div class="card">
    <a href="{{ asset.url | relative_url }}">
        <h3>{{ asset.title | default: asset.name }}</h3>
        <p>{{ asset.excerpt | strip_html | truncate: 80 }}</p>
    </a>
</div>
{% endfor %}
</div>

[전체 에셋 보기 →]({{ '/assets/' | relative_url }})
