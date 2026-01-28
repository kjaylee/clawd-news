---
layout: default
title: 홈
---

<h1 class="page-title">🚀 주인님의 프로젝트 허브</h1>
<p class="page-meta">데일리 브리핑 · 게임 데모 · Unity 에셋</p>

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

## 🎮 게임 아케이드

<div class="card-grid">
<div class="card">
    <a href="{{ '/games/' | relative_url }}">
        <h3>🎮 전체 게임 포털 (28종)</h3>
        <p>퍼즐 · 아케이드 · 액션 · 리듬 — 브라우저에서 바로 플레이!</p>
    </a>
</div>
<div class="card">
    <a href="{{ '/games/rhythm-pulse/' | relative_url }}">
        <h3>🎵 Rhythm Pulse</h3>
        <p>비트에 맞춰 노트 탭! 리듬 게임</p>
    </a>
</div>
<div class="card">
    <a href="{{ '/games/block-bounce/' | relative_url }}">
        <h3>🧱 Block Bounce</h3>
        <p>블록 블라스트 스타일 퍼즐</p>
    </a>
</div>
<div class="card">
    <a href="{{ '/games/idle-slime-merge/' | relative_url }}">
        <h3>🟢 Idle Slime Merge</h3>
        <p>아이들 + 머지 하이브리드</p>
    </a>
</div>
<div class="card">
    <a href="{{ '/games/gravity-orbit/' | relative_url }}">
        <h3>🌌 Gravity Orbit</h3>
        <p>행성 궤도 물리 아케이드</p>
    </a>
</div>
<div class="card">
    <a href="https://eastsea.monster/games/slime-survivor/" target="_blank">
        <h3>🟢 슬라임 서바이버</h3>
        <p>뱀서라이크 액션</p>
    </a>
</div>
</div>

[🎮 전체 28종 게임 포털 →]({{ '/games/' | relative_url }})

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
