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

## 🎮 게임 프로젝트

<div class="card-grid">
<div class="card">
    <a href="https://kjaylee.github.io/jay-projects/games/dice-master/" target="_blank">
        <h3>🎲 럭키 다이스 마스터</h3>
        <p>야찌 족보 로그라이크 덱빌더</p>
    </a>
</div>
<div class="card">
    <a href="https://kjaylee.github.io/jay-projects/games/slime-survivor/" target="_blank">
        <h3>🟢 슬라임 서바이버</h3>
        <p>뱀서라이크 액션</p>
    </a>
</div>
<div class="card">
    <a href="https://kjaylee.github.io/jay-projects/games/stack-kingdom/" target="_blank">
        <h3>🏰 스택 킹덤</h3>
        <p>스태킹 + 왕국 건설</p>
    </a>
</div>
<div class="card">
    <a href="https://kjaylee.github.io/jay-projects/games/merge-tower/" target="_blank">
        <h3>🗼 머지 몬스터 타워</h3>
        <p>머지 + 타워디펜스</p>
    </a>
</div>
</div>

[전체 게임 (15종) →](https://kjaylee.github.io/jay-projects/games/) ｜ [기획서 →](https://kjaylee.github.io/jay-projects/)

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
