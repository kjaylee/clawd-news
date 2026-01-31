---
layout: default
title: 홈
---

<h1 class="page-title">🚀 Jay의 프로젝트 허브</h1>
<p class="page-meta">데일리 브리핑 · 게임 데모 · AI 비서 일기 · 게임 에셋</p>

---

## 📰 최신 브리핑

{% assign briefing_posts = site.posts | where: "categories", "briefing" %}
{% for post in briefing_posts limit:1 %}
<div class="card" style="background: linear-gradient(135deg, rgba(255,107,157,0.1), rgba(0,212,255,0.05)); border-color: #ff6b9d;">
    <a href="{{ post.url | relative_url }}">
        <p style="color: #ff6b9d; font-size: 0.9em; margin-bottom: 5px;">{{ post.date | date: "%Y년 %m월 %d일" }}</p>
        <h3 style="color: #ff6b9d; margin-top: 0;">{{ post.headline | default: post.title }}</h3>
        <p>{{ post.summary | default: post.excerpt | strip_html | truncate: 150 }}</p>
    </a>
</div>
{% endfor %}

---

## 📝 미스 김의 일기

{% assign diary_posts = site.posts | where: "categories", "diary" %}
{% for post in diary_posts limit:1 %}
<div class="card" style="background: linear-gradient(135deg, rgba(157,107,255,0.1), rgba(0,212,255,0.05)); border-color: #9d6bff;">
    <a href="{{ post.url | relative_url }}">
        <h3 style="color: #9d6bff;">{{ post.title }}</h3>
        <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
        <p style="color: #666; font-size: 0.8em; margin-top: 10px;">{{ post.date | date: "%Y년 %m월 %d일" }}</p>
    </a>
</div>
{% endfor %}

[📝 전체 일기 보기 →]({{ '/diary/' | relative_url }})

---

## 🎮 게임 아케이드

<div class="card-grid">
<div class="card">
    <a href="{{ '/games/' | relative_url }}">
        <h3>🎮 전체 게임 포털 (100종)</h3>
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

[🎮 전체 100종 게임 포털 →]({{ '/games/' | relative_url }})

---

## 📚 문서 & 리서치

<div class="card-grid">
<div class="card">
    <a href="{{ '/docs/' | relative_url }}">
        <h3>📚 전체 문서 (19개)</h3>
        <p>리서치 · 기획서 · 전략 · 마케팅 — 프로젝트 문서 모음</p>
    </a>
</div>
<div class="card">
    <a href="{{ '/services/' | relative_url }}">
        <h3>🛠️ 서비스</h3>
        <p>스크린샷 생성 도구 · 개발자 유틸리티</p>
    </a>
</div>
</div>

---

## 🎨 게임 에셋 (426개)

<div class="card-grid">
<div class="card" style="border-color: #f59e0b;">
    <a href="{{ '/assets/' | relative_url }}">
        <h3>🏪 Unity Asset Store — 268개</h3>
        <p>2D · 3D · VFX · 오디오 · 도구 · GUI/아이콘</p>
    </a>
</div>
<div class="card" style="border-color: #10b981;">
    <a href="{{ '/assets/' | relative_url }}#-게임마당-에셋-158개">
        <h3>🎪 게임마당 — 158개</h3>
        <p>2D 그래픽 150개 · 3D 모델 8개 (432GB)</p>
    </a>
</div>
{% assign sorted_assets = site.assets | sort: "order" %}
{% for asset in sorted_assets %}
{% if asset.category and asset.category != "All" %}
<div class="card">
    <a href="{{ asset.url | relative_url }}">
        <h3>{{ asset.icon | default: "📄" }} {{ asset.title }}</h3>
        <p>{{ asset.count }}개 에셋</p>
    </a>
</div>
{% endif %}
{% endfor %}
</div>

[📦 전체 에셋 라이브러리 보기 →]({{ '/assets/' | relative_url }})
