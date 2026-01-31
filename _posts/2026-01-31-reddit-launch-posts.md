---
title: "Reddit 런칭 포스트 초안"
date: 2026-01-31
categories: [docs, marketing]
tags: [Reddit, 마케팅, 런칭]
layout: post
---

# 📮 Reddit 런칭 포스트 초안

> **작성일:** 2026-01-30
> **대상 서브레딧:** r/WebGames, r/IndieGaming, r/playmygame, r/html5games
> **규칙:** "Show, don't sell" — 게임 링크 직접 제공, 피드백 요청 중심

---

## 📌 서브레딧별 규칙 요약

| 서브레딧 | 구독자 | 셀프 프로모 | 핵심 규칙 |
|---------|--------|-----------|----------|
| r/WebGames | ~640K | ✅ 허용 | 브라우저 직접 플레이 가능해야 함 |
| r/IndieGaming | ~451K | ⚠️ 제한적 | 마일스톤 당 1회, GIF/영상 필수 |
| r/playmygame | ~80K | ✅ 전용 | 피드백 요청 형태 권장 |
| r/html5games | ~20K | ✅ 허용 | HTML5 게임 전용 |
| r/gamedev | ~1.5M | ⚠️ 주의 | Screenshot Saturday만 셀프 프로모 가능 |

---

## 🎯 포스트 #1 — r/WebGames (메인 런칭)

### 제목 옵션 (A/B)
**A:** `I made 42 free browser games — play them all right now, no install needed`
**B:** `42 Free HTML5 Games — Puzzle, Arcade, Roguelike, Simulation. Play instantly in your browser!`

### 본문
```
Hey r/WebGames!

I've been building HTML5 games as a solo dev and just hit 42 games on my arcade:

🎮 **Play here:** https://eastsea.monster/games/

All games are:
- 100% free, no ads, no login
- Play instantly in any browser (mobile works too!)
- Single HTML file each — super fast load

**My top 5 picks to start with:**

🗡️ **Slime Survivor Premium** — Vampire Survivors in your browser. Full progression, boss fights, daily challenges
→ https://eastsea.monster/games/slime-survivor-premium/

🔵 **Ball Sort Puzzle** — 150+ procedurally generated levels. Surprisingly addictive color sorting
→ https://eastsea.monster/games/ball-sort/

🍣 **Sushi Sprint** — Run a sushi bar! 11 recipes, wave system, shop upgrades
→ https://eastsea.monster/games/sushi-sprint/

🔢 **Power 2048** — Classic 2048 with 5 powerups (bomb, freeze, double, undo, sniper). 3 game modes
→ https://eastsea.monster/games/power-2048/

🍉 **Fruit Merge Drop** — Suika-style physics merge puzzle. Can you make the watermelon?
→ https://eastsea.monster/games/fruit-merge-drop/

**Other genres covered:** Tower defense, rhythm, mahjong, idle/merge, fishing sim, factory builder, golf, and more.

Built with vanilla JS + Canvas. Each game is a single HTML file.

Would love to hear which ones you enjoy (or hate)! Feedback welcome 🙏

---
*Solo dev, all games made with ❤️*
```

### 포스팅 팁
- **시간대**: 미국 오전 9-11시 EST (한국 밤 11시-새벽 1시)
- **플레어**: 있으면 "Browser Game" 또는 "HTML5"
- **댓글 대응**: 피드백에 빠르게 답변, 감사 표시

---

## 🎯 포스트 #2 — r/IndieGaming (플래그십 포커스)

### 제목
`Slime Survivor Premium — A Vampire Survivors-style game you can play right in your browser [Free]`

### 본문
```
Hey r/IndieGaming!

I just released my flagship game — **Slime Survivor Premium**, a Vampire Survivors-style roguelike that runs entirely in your browser.

🎮 **Play now:** https://eastsea.monster/games/slime-survivor-premium/

**Features:**
- 🗡️ Auto-attack roguelike — survive waves of enemies
- 🎯 Character unlocks with unique abilities
- 👹 Boss fights every few waves
- 📅 Daily challenges
- 🏆 Leaderboard + score sharing
- 🔊 Full sound effects
- 📱 Works on mobile too!

**Tech:** Single HTML file, vanilla JS + Canvas. No frameworks, no build tools.

It's part of my 42-game arcade (https://eastsea.monster/games/) — all free, no ads.

**I'd love feedback on:**
- Difficulty curve — too easy/hard?
- What power-ups feel good/bad?
- Any bugs on mobile?

Thanks for playing! 🙏
```

### 첨부
- GIF 또는 짧은 영상 (게임플레이 10초) — **r/IndieGaming은 미디어 필수**
- 스크린샷 3-4장

---

## 🎯 포스트 #3 — r/playmygame (피드백 요청)

### 제목
`[Feedback Request] I built 42 free browser games — which ones are actually fun?`

### 본문
```
Hi everyone!

I'm a solo dev who's been making HTML5 casual games. I've built 42 so far and I honestly need outside perspective on which ones are worth developing further.

🎮 **Full arcade:** https://eastsea.monster/games/

All free, no install, no login — just click and play in your browser.

**I'm especially looking for feedback on:**

1. Which game hooked you the most?
2. Which game did you quit immediately?
3. Any UX issues (especially on mobile)?
4. What's missing that would make you come back?

**Quick picks by genre:**
- 🗡️ Action: Slime Survivor Premium, Zombie Survivor
- 🧩 Puzzle: Ball Sort, Power 2048, Fruit Merge Drop
- 🍳 Sim: Sushi Sprint, Micro Factory, Fishing Tycoon
- 🎵 Other: Rhythm Pulse, Mahjong Zen, Neon Snake

Your honest feedback (even harsh!) is super valuable. I want to focus on the games people actually enjoy.

Thanks in advance! 🙏
```

---

## 🎯 포스트 #4 — r/html5games (기술 커뮤니티)

### 제목
`42 single-file HTML5 games — no frameworks, just vanilla JS + Canvas`

### 본문
```
Built 42 casual games, each as a single HTML file using vanilla JavaScript and Canvas API. No React, no Phaser, no build step.

🎮 https://eastsea.monster/games/

**Tech highlights:**
- Single HTML file per game (everything inlined)
- Canvas-based rendering
- Touch + keyboard support
- PWA enabled (installable)
- Telegram Mini App SDK integrated
- Cross-promotion system between games
- SEO optimized with JSON-LD structured data

**Genres:** Puzzle, arcade, roguelike, simulation, rhythm, strategy, sports

The constraint of single-file HTML made me think creatively about asset management — all sprites are generated programmatically or use emoji/unicode.

Happy to discuss the technical approach if anyone's interested. Also open to feedback on gameplay!
```

---

## 🎯 포스트 #5 — r/gamedev (Screenshot Saturday)

### 제목
`[Screenshot Saturday] 42 HTML5 games, each in a single file — here's my arcade!`

### 본문
```
Been building HTML5 casual games as a solo dev hobby. Each game is a single HTML file — no build tools, no frameworks.

[Screenshot/GIF collage of 4-6 games]

🎮 Play all 42: https://eastsea.monster/games/

Highlights:
- Slime Survivor Premium (Vampire Survivors-style)
- Ball Sort Puzzle (150+ levels)
- Power 2048 (2048 with powerups)
- Sushi Sprint (sushi bar time management)

All free, browser-based, mobile-friendly.

Feedback welcome! What would you improve?
```

### ⚠️ 주의
- r/gamedev는 **Screenshot Saturday 스레드**에서만 셀프 프로모 가능
- 별도 포스트로 올리면 삭제됨
- 매주 토요일 자동 스레드 확인

---

## 📅 포스팅 스케줄

| 순서 | 서브레딧 | 시점 | 비고 |
|------|---------|------|------|
| 1 | r/WebGames | Day 1 (월) | 메인 런칭, 가장 관대 |
| 2 | r/playmygame | Day 2 (화) | 피드백 수집 |
| 3 | r/html5games | Day 3 (수) | 기술 커뮤니티 |
| 4 | r/IndieGaming | Day 4-5 | GIF/영상 준비 후 |
| 5 | r/gamedev | 다음 토요일 | Screenshot Saturday만 |

### 포스팅 최적 시간
- **미국 East Coast 오전 9-11시** = 한국 시간 밤 11시-새벽 1시
- **토요일 오전** (r/gamedev Screenshot Saturday)

---

## ⚡ 포스팅 후 액션

1. **댓글 모니터링** — 첫 2시간이 골든타임 (Reddit 알고리즘)
2. **피드백 적극 수용** — "good point, I'll fix that!" 형태
3. **크로스 포스팅 금지** — 각 서브레딧에 맞춤 작성
4. **업보트 조작 금지** — Reddit은 이에 매우 민감
5. **피드백 정리** — docs/reddit-feedback-log.md에 기록

---

## 📊 기대 효과

| 서브레딧 | 예상 업보트 | 예상 클릭 | 예상 전환 |
|---------|-----------|----------|----------|
| r/WebGames | 30-150 | 300-2,000 | 높음 (직접 플레이) |
| r/IndieGaming | 10-50 | 100-500 | 중간 |
| r/playmygame | 5-20 | 50-200 | 높음 (피드백 목적) |
| r/html5games | 10-30 | 50-200 | 높음 (타겟 정확) |
| r/gamedev (SS) | 5-30 | 30-100 | 낮음 (개발자 중심) |

**합계 예상: 500-3,000 첫 주 방문자**

---

*⚠️ 주인님 Reddit 계정으로 포스팅 필요 — 초안만 준비됨*
