---
layout: post
title: "HTML5 게임 개발 완벽 가이드: Canvas API로 첫 게임 만들기"
date: 2026-01-29
categories: [tutorial]
tags: [html5, canvas, game-development, javascript, tutorial, 게임개발]
description: "HTML5 Canvas API를 활용한 게임 개발 입문 튜토리얼. 게임 루프, 입력 처리, 충돌 감지까지 단계별로 배우고 직접 플레이 가능한 게임을 만들어봅니다."
---

# HTML5 게임 개발 완벽 가이드

웹 브라우저에서 바로 실행되는 게임을 만들고 싶으신가요? HTML5 Canvas API를 사용하면 별도의 플러그인 없이 모든 브라우저에서 작동하는 게임을 개발할 수 있습니다. 이 튜토리얼에서는 기초부터 시작해서 실제로 플레이 가능한 간단한 게임을 완성해보겠습니다.

## 🎯 이 튜토리얼에서 배우는 것

- Canvas API 기초와 그래픽 렌더링
- 60fps 게임 루프 구현
- 키보드/터치 입력 처리
- 충돌 감지 알고리즘
- 게임 상태 관리
- 실전: "공 피하기" 게임 만들기

## 📋 준비물

- 텍스트 에디터 (VS Code 추천)
- 웹 브라우저 (Chrome, Firefox, Safari 등)
- JavaScript 기초 지식

---

## 1단계: Canvas 기초 설정

### HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 첫 HTML5 게임</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a2e;
        }
        canvas {
            border: 3px solid #4a4a6a;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script src="game.js"></script>
</body>
</html>
```

### Canvas 컨텍스트 가져오기

```javascript
// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 상수
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
```

### 기본 도형 그리기

Canvas 2D API로 다양한 도형을 그릴 수 있습니다:

```javascript
// 사각형 그리기
ctx.fillStyle = '#ff6b6b';  // 채우기 색상
ctx.fillRect(100, 100, 50, 50);  // x, y, width, height

// 원 그리기
ctx.beginPath();
ctx.arc(200, 200, 30, 0, Math.PI * 2);  // x, y, radius, startAngle, endAngle
ctx.fillStyle = '#4ecdc4';
ctx.fill();
ctx.closePath();

// 선 그리기
ctx.beginPath();
ctx.moveTo(300, 100);
ctx.lineTo(400, 200);
ctx.strokeStyle = '#ffe66d';
ctx.lineWidth = 3;
ctx.stroke();
ctx.closePath();

// 텍스트 그리기
ctx.font = '24px Arial';
ctx.fillStyle = '#ffffff';
ctx.fillText('Hello, Game!', 100, 50);
```

---

## 2단계: 게임 루프 구현

게임 루프는 모든 게임의 심장입니다. 매 프레임마다 **업데이트(Update)**와 **렌더링(Render)**을 반복합니다.

### requestAnimationFrame 사용

```javascript
let lastTime = 0;

function gameLoop(currentTime) {
    // 델타 타임 계산 (초 단위)
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // 1. 화면 지우기
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 2. 게임 상태 업데이트
    update(deltaTime);
    
    // 3. 화면에 그리기
    render();
    
    // 4. 다음 프레임 요청
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    // 게임 로직 업데이트
}

function render() {
    // 화면에 그리기
}

// 게임 시작
requestAnimationFrame(gameLoop);
```

### 왜 deltaTime을 사용하나요?

컴퓨터 성능에 따라 프레임 레이트가 달라질 수 있습니다. `deltaTime`을 사용하면 어떤 기기에서도 동일한 속도로 게임이 작동합니다.

```javascript
// ❌ 잘못된 방법: 프레임마다 고정 이동
player.x += 5;

// ✅ 올바른 방법: 시간 기반 이동
const PLAYER_SPEED = 300; // 초당 300픽셀
player.x += PLAYER_SPEED * deltaTime;
```

---

## 3단계: 입력 처리

### 키보드 입력

```javascript
// 현재 눌린 키 추적
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    e.preventDefault(); // 기본 동작 방지 (스크롤 등)
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// update() 함수에서 사용
function update(dt) {
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.x -= PLAYER_SPEED * dt;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.x += PLAYER_SPEED * dt;
    }
    if (keys['ArrowUp'] || keys['KeyW']) {
        player.y -= PLAYER_SPEED * dt;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.y += PLAYER_SPEED * dt;
    }
}
```

### 터치/마우스 입력 (모바일 지원)

```javascript
let touchPos = { x: 0, y: 0 };
let isTouching = false;

canvas.addEventListener('touchstart', (e) => {
    isTouching = true;
    updateTouchPos(e);
    e.preventDefault();
});

canvas.addEventListener('touchmove', (e) => {
    updateTouchPos(e);
    e.preventDefault();
});

canvas.addEventListener('touchend', () => {
    isTouching = false;
});

function updateTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    touchPos.x = touch.clientX - rect.left;
    touchPos.y = touch.clientY - rect.top;
}
```

---

## 4단계: 충돌 감지

### 사각형 충돌 (AABB)

가장 기본적이고 빠른 충돌 감지 방법입니다.

```javascript
function rectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 사용 예시
const player = { x: 100, y: 100, width: 40, height: 40 };
const enemy = { x: 150, y: 150, width: 30, height: 30 };

if (rectCollision(player, enemy)) {
    console.log('충돌 발생!');
}
```

### 원형 충돌

```javascript
function circleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

// 사용 예시
const player = { x: 100, y: 100, radius: 20 };
const ball = { x: 130, y: 130, radius: 15 };

if (circleCollision(player, ball)) {
    console.log('충돌 발생!');
}
```

---

## 5단계: 실전 프로젝트 - "공 피하기" 게임

이제 배운 것을 모두 활용해 실제 게임을 만들어봅시다!

### 전체 코드

```javascript
// game.js - 공 피하기 게임

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// 게임 상태
let gameState = 'playing'; // 'playing', 'gameover'
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// 플레이어 설정
const player = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 80,
    radius: 20,
    speed: 400,
    color: '#4ecdc4'
};

// 적 공들
const enemies = [];
const ENEMY_SPAWN_RATE = 0.02; // 프레임당 스폰 확률
const ENEMY_SPEED_MIN = 150;
const ENEMY_SPEED_MAX = 350;

// 입력 상태
const keys = {};

// 이벤트 리스너
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && gameState === 'gameover') {
        restartGame();
    }
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// 적 생성
function spawnEnemy() {
    const radius = Math.random() * 20 + 10;
    enemies.push({
        x: Math.random() * (CANVAS_WIDTH - radius * 2) + radius,
        y: -radius,
        radius: radius,
        speed: Math.random() * (ENEMY_SPEED_MAX - ENEMY_SPEED_MIN) + ENEMY_SPEED_MIN,
        color: `hsl(${Math.random() * 60 + 330}, 70%, 60%)` // 분홍~빨강 계열
    });
}

// 충돌 감지
function circleCollision(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < c1.radius + c2.radius;
}

// 게임 업데이트
function update(dt) {
    if (gameState !== 'playing') return;
    
    // 점수 증가
    score += dt * 10;
    
    // 플레이어 이동
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.x -= player.speed * dt;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.x += player.speed * dt;
    }
    if (keys['ArrowUp'] || keys['KeyW']) {
        player.y -= player.speed * dt;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.y += player.speed * dt;
    }
    
    // 화면 경계 처리
    player.x = Math.max(player.radius, Math.min(CANVAS_WIDTH - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(CANVAS_HEIGHT - player.radius, player.y));
    
    // 적 스폰
    if (Math.random() < ENEMY_SPAWN_RATE) {
        spawnEnemy();
    }
    
    // 적 업데이트
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += enemy.speed * dt;
        
        // 화면 밖으로 나간 적 제거
        if (enemy.y > CANVAS_HEIGHT + enemy.radius) {
            enemies.splice(i, 1);
            continue;
        }
        
        // 충돌 체크
        if (circleCollision(player, enemy)) {
            gameOver();
        }
    }
}

// 렌더링
function render() {
    // 배경
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 그리드 효과 (선택적)
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
    
    // 적 그리기
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        ctx.closePath();
        
        // 글로우 효과
        ctx.shadowColor = enemy.color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    // 플레이어 그리기
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
    
    // 플레이어 글로우
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // UI
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`점수: ${Math.floor(score)}`, 20, 40);
    ctx.fillText(`최고: ${Math.floor(highScore)}`, 20, 70);
    
    // 게임오버 화면
    if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.font = 'bold 60px Arial';
        ctx.fillStyle = '#ff6b6b';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`최종 점수: ${Math.floor(score)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('Space를 눌러 다시 시작', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
        ctx.textAlign = 'left';
    }
}

// 게임오버
function gameOver() {
    gameState = 'gameover';
    if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem('highScore', highScore);
    }
}

// 게임 재시작
function restartGame() {
    gameState = 'playing';
    score = 0;
    player.x = CANVAS_WIDTH / 2;
    player.y = CANVAS_HEIGHT - 80;
    enemies.length = 0;
}

// 게임 루프
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    update(deltaTime);
    render();
    
    requestAnimationFrame(gameLoop);
}

// 게임 시작
requestAnimationFrame(gameLoop);
```

---

## 🚀 더 발전시키기

### 파워업 추가

```javascript
const powerups = [];

function spawnPowerup() {
    powerups.push({
        x: Math.random() * CANVAS_WIDTH,
        y: -20,
        radius: 15,
        type: Math.random() > 0.5 ? 'shield' : 'slow',
        speed: 100
    });
}
```

### 사운드 효과

```javascript
// Web Audio API 사용
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// 충돌 시 효과음
playSound(200, 0.3);
```

### 파티클 효과

```javascript
const particles = [];

function createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * (Math.random() * 200 + 100),
            vy: Math.sin(angle) * (Math.random() * 200 + 100),
            radius: Math.random() * 5 + 2,
            color: color,
            life: 1.0
        });
    }
}
```

---

## 📚 다음 단계

이 튜토리얼을 완료했다면:

1. **더 많은 게임 예제 보기**: [eastsea.monster/games](/games) - 30개 이상의 HTML5 게임 소스코드
2. **게임 프레임워크 배우기**: Phaser.js, PixiJS 같은 프레임워크로 더 복잡한 게임 제작
3. **모바일 배포**: Capacitor나 Cordova로 iOS/Android 앱으로 변환

## 🎮 직접 플레이해보기

이 튜토리얼의 완성된 게임을 직접 플레이해보세요:

**[공 피하기 게임 플레이하기 →](/games/)**

---

*이 글이 도움이 되었다면 공유해주세요! 질문이 있으시면 댓글로 남겨주세요.*
