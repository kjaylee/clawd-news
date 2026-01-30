# 🎮 슬라임 게임 3종 버튼/터치 전수 QA 리포트

**작성일:** 2025-07-19  
**QA 범위:** 버튼/터치 이벤트, 게임 조작, UI/UX, 공통 버그 패턴

---

## 1️⃣ Idle Slime Merge (`games/idle-slime-merge/index.html`)

### 발견된 문제

#### [Warning] 소형 화면에서 버튼 터치 타겟 44px 미달
- **위치:** CSS `@media (max-height: 600px)` (line 근처)
- **설명:** 화면 높이 600px 이하에서 `.btn`의 padding이 `10px 6px`로 줄어들어, 버튼 높이가 약 34-36px로 모바일 최소 터치 타겟(44px) 미달
- **수정 제안:**
```css
@media (max-height: 600px) {
  .btn { padding: 12px 6px; font-size: 12px; min-height: 44px; }
}
```

#### [Warning] 프레스티지 버튼 `confirm()` 사용
- **위치:** 버튼 이벤트 리스너 (`confirm('프레스티지 하시겠습니까?...')`)
- **설명:** 네이티브 `confirm()` 대화상자는 일부 모바일 브라우저(특히 WebView)에서 예상대로 동작하지 않을 수 있음. iOS PWA에서는 동작 불안정
- **수정 제안:** 커스텀 모달로 교체 권장

#### [Warning] touchend 이벤트에 `{ passive: false }` 미지정
- **위치:** `gridEl.addEventListener('touchend', ...)` 
- **설명:** touchend 핸들러에서 `e.preventDefault()`를 호출하지만 `{ passive: false }` 옵션 미지정. 현재 대부분 브라우저에서 element-level 리스너는 기본값이 non-passive라 동작하지만, 명시적 선언이 베스트 프랙티스
- **수정 제안:**
```javascript
gridEl.addEventListener('touchend', e => {
  e.preventDefault();
  if (dragging) {
    const t = e.changedTouches[0];
    endDrag(t.clientX, t.clientY);
  }
}, { passive: false });  // 추가
```

#### [Info] 버튼에 touch 전용 이벤트 없음 (click만 사용)
- **위치:** `btn-summon`, `btn-prestige`, `btn-boost` 이벤트 리스너
- **설명:** 모든 버튼이 `click` 이벤트만 사용. viewport에 `user-scalable=no` 설정되어 있어 300ms 딜레이는 없지만, `:active` 피드백이 약간 느릴 수 있음
- **영향:** 경미 — 현대 모바일 브라우저에서는 viewport 메타로 충분

#### [Info] 다중 setInterval 호출
- **위치:** 하단 초기화 코드
- **설명:** `tick`, `save`, `updateUI`, 부스트 타이머 등 4개의 setInterval이 각각 1초 간격. 하나로 통합하면 성능 개선 가능
- **영향:** 경미 — 기능 문제 없음, 최적화 사항

#### [Info] DPR(devicePixelRatio) 미처리
- **설명:** DOM 기반 렌더링이라 canvas DPR 이슈는 없으나, 고해상도 디스플레이에서 CSS 기반 요소 렌더링이 기본값으로 처리됨
- **영향:** 없음 — DOM 요소 사용으로 자동 처리

### 정상 항목
- ✅ **body touch-action: none** — 스크롤/줌 완전 차단
- ✅ **user-select: none** — 텍스트 선택 차단 (`-webkit-user-select` 포함)
- ✅ **viewport user-scalable=no** — 300ms 딜레이 방지
- ✅ **그리드 터치 드래그**: touchstart/touchmove에 `{ passive: false }` + `preventDefault()` 올바르게 적용
- ✅ **마우스/터치 분리**: 그리드는 touch 이벤트 + mouse 이벤트 별도 처리, touchstart에서 `preventDefault()`로 이중 트리거 방지
- ✅ **드래그 좌표 처리**: `clientX/Y` 사용, `position: fixed` 고스트와 정확히 매칭
- ✅ **셀 히트 테스트**: `getBoundingClientRect()` 기반 — 스크롤/줌 없는 환경에서 정확
- ✅ **버튼 비활성 상태**: `disabled` 속성 + CSS `opacity: 0.4; cursor: not-allowed` 적용
- ✅ **z-index 관리**: ghost(1000) < toast(2000) < offline-popup(3000) 적절히 분리
- ✅ **오프라인 팝업**: 터치 블로킹 없음, z-index 최상위

---

## 2️⃣ 슬라임 서바이버 (`games/slime-survivor/index.html`)

### 발견된 문제

#### [Critical] 모바일 터치 해제 시 이동 정지 불가
- **위치:** 터치 이벤트 핸들러 (canvas 리스너 영역)
- **설명:** `touchstart`와 `touchmove`로 `mousePos`를 설정하지만, **`touchend` 이벤트가 없음**. 손가락을 떼도 캐릭터가 마지막 터치 위치로 계속 이동. 프리미엄 버전은 가상 조이스틱으로 이 문제를 해결함
- **수정 제안:**
```javascript
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    // 손가락을 떼면 플레이어 현재 위치로 mousePos 설정 (이동 정지)
    mousePos.x = player.x;
    mousePos.y = player.y;
}, { passive: false });
```

#### [Warning] touchmove/touchstart에 `{ passive: false }` 미지정
- **위치:** canvas의 touchmove, touchstart 리스너
- **설명:** `e.preventDefault()`를 호출하지만 `{ passive: false }` 미지정. element-level에서는 기본이 non-passive이지만, 명시적 선언 권장
- **수정 제안:**
```javascript
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    // ...
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    // ...
}, { passive: false });
```

#### [Warning] 게임 루프 delta 미클램핑
- **위치:** `gameLoop()` 함수
- **설명:** 탭 전환 후 복귀 시 `delta`가 매우 커질 수 있음 (예: 10초). 물리 시뮬레이션이 한 프레임에 큰 점프를 하여 의도치 않은 동작 발생 가능. Premium 버전은 `Math.min(rawDelta, 0.05)` 클램핑 적용
- **수정 제안:**
```javascript
function gameLoop(timestamp) {
    if (!game.running) return;
    const rawDelta = (timestamp - lastTime) / 1000;
    const delta = Math.min(rawDelta, 0.05);  // 최대 50ms로 제한
    lastTime = timestamp;
    // ...
}
```

#### [Warning] Safe Area (노치) 미처리
- **위치:** CSS 전역
- **설명:** iPhone 노치/다이내믹 아일랜드 영역에 UI 요소가 가려질 수 있음. HUD(`#ui`)가 `top: 10px; left: 10px` 고정
- **수정 제안:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
```
```css
#ui {
    top: max(10px, env(safe-area-inset-top, 10px));
    left: max(10px, env(safe-area-inset-left, 10px));
}
```

#### [Warning] 캔버스 크기가 모바일 화면을 채우지 못함
- **위치:** `resizeCanvas()` 함수
- **설명:** `canvas.width = Math.min(window.innerWidth - 20, 800)` — 20px 여백과 800px 상한. 모바일에서 화면을 완전히 채우지 못해 상하좌우에 빈 공간 발생
- **영향:** 기능 문제는 없으나 모바일 UX 저하

#### [Warning] hover 스타일 모바일 스티키 문제
- **위치:** `.upgrade-btn:hover`, `button:hover` CSS
- **설명:** 모바일에서 탭 후 hover 상태가 해제되지 않고 유지("sticky hover"). 업그레이드 버튼 선택 후 시각적 잔여
- **수정 제안:**
```css
@media (hover: hover) {
    .upgrade-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
    }
    button:hover {
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
    }
}
```

#### [Info] 업그레이드 버튼 inline `onclick` 대신 `addEventListener` 사용
- **설명:** 업그레이드 버튼은 `btn.onclick`으로 할당. 기능적으로 동작하며, touch-action: none 환경에서 문제없음

#### [Info] 인라인 onclick 사용
- **위치:** `onclick="startGame()"`, `onclick="restartGame()"`
- **설명:** 인라인 이벤트 핸들러 사용. CSP(Content Security Policy)가 strict할 경우 문제될 수 있으나, 단일 파일 게임에서는 무관

### 정상 항목
- ✅ **body touch-action: none** — 스크롤/줌 차단
- ✅ **viewport user-scalable=no** — 300ms 딜레이 방지
- ✅ **canvas 터치 좌표 변환**: `getBoundingClientRect()` 기반, canvas 속성 크기 = CSS 크기 일치
- ✅ **게임 루프**: paused 상태에서도 render/rAF 유지 — 업그레이드 해제 시 정상 재개
- ✅ **lastTime 업데이트**: pause 중에도 갱신되어 unpause 시 delta 정상
- ✅ **적 스폰 인터벌**: `spawnEnemy()` 내 `if (!game.running || game.paused) return` 체크
- ✅ **게임오버 시 인터벌 클리어**: `clearInterval(spawnIntervalId)`
- ✅ **overflow: hidden** — 스크롤바 방지
- ✅ **업그레이드 버튼 크기**: padding 20px, width 150px — 터치 타겟 충분 (>44px)
- ✅ **시작/재시작 버튼 크기**: padding 15px 40px — 터치 타겟 충분

---

## 3️⃣ 슬라임 서바이버 PREMIUM (`games/slime-survivor-premium/index.html`)

### 발견된 문제

#### [Warning] 일시정지 버튼 터치 타겟 44px 미달
- **위치:** `#pauseBtn` CSS
- **설명:** `padding: 8px`, `font-size: 20px`로 버튼 총 크기가 약 36×36px. 모바일 최소 권장 터치 타겟(44×44px) 미달. 게임 중 급히 일시정지할 때 탭 실패 가능
- **수정 제안:**
```css
#pauseBtn {
    padding: 12px;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

#### [Warning] hover 스타일 모바일 스티키 문제
- **위치:** `.btn:hover`, `.upgrade-card:hover`, `.char-card` CSS
- **설명:** Game 2와 동일 — 모바일에서 탭 후 hover 상태 유지
- **수정 제안:**
```css
@media (hover: hover) {
    .btn:hover { box-shadow: 0 0 30px rgba(0,255,136,0.5); transform: scale(1.03); }
    .upgrade-card:hover { box-shadow: 0 0 20px rgba(0,255,136,0.4); transform: scale(1.03); }
}
```

#### [Warning] 인라인 onclick 다수 사용
- **위치:** 시작화면, 게임오버, 리더보드, 일시정지 화면 등
- **설명:** `onclick="startNormalGame()"`, `onclick="shareScore()"` 등 인라인 핸들러 다수. CSP strict 환경에서 문제 가능. 또한 touch 전용 이벤트 미등록
- **영향:** 경미 — viewport + touch-action 설정으로 동작에는 문제없음

#### [Info] 데스크톱에서 조이스틱 영역 완전 제거
- **위치:** `joystickZone.style.display = 'none'` (데스크톱 분기)
- **설명:** 데스크톱에서 조이스틱 영역이 `display: none`이지만, 하위 50% 영역이 터치 입력 영역이었음. 데스크톱에서는 불필요하므로 올바른 처리
- **영향:** 없음 — 정상

#### [Info] gesturestart 이벤트 핸들러 passive 미지정
- **위치:** `document.addEventListener('gesturestart', (e) => e.preventDefault())`
- **설명:** gesturestart는 비표준 이벤트(Safari 전용)이며, passive 기본값이 false. 동작에 문제없음

### 정상 항목
- ✅ **종합 터치 차단**: `touch-action: none`, `-webkit-tap-highlight-color: transparent`, `-webkit-touch-callout: none`, `user-select: none`
- ✅ **가상 조이스틱**: touchstart/touchmove/touchend/touchcancel 전부 처리, `{ passive: false }` 적용
- ✅ **조이스틱 비활성화**: 업그레이드/메뉴/일시정지 시 `setJoystickEnabled(false)` 호출
- ✅ **DPR 처리**: `devicePixelRatio` 감지, canvas 해상도 스케일링, CSS 크기 별도 설정
- ✅ **Safe Area 처리**: `env(safe-area-inset-top/bottom)` 사용, `viewport-fit=cover`
- ✅ **100dvh 지원**: `min-height: 100dvh` fallback으로 모바일 주소바 문제 해결
- ✅ **멀티터치 차단**: `document.addEventListener('touchmove', ...)` 에서 2+ 터치 시 preventDefault, `{ passive: false }`
- ✅ **iOS 제스처 차단**: `gesturestart` preventDefault
- ✅ **오디오 컨텍스트 resume**: 첫 click/touchstart에서 AudioContext resume (autoplay 정책 대응)
- ✅ **delta 클램핑**: `Math.min(rawDelta, 0.05)` — 탭 전환 후 물리 점프 방지
- ✅ **lastTime 리셋**: 업그레이드 선택 후 `lastTime = performance.now()` — 정확한 delta
- ✅ **z-index 관리**: HUD(50) < pauseBtn(55) < joystick(60) < overlay(200) < upgrade(300) < toast(500)
- ✅ **오버레이 스크롤**: `.screen-overlay` 에 `touch-action: auto`, `-webkit-overflow-scrolling: touch` — 메뉴 스크롤 가능
- ✅ **캐릭터 카드 잠금**: `.locked` 에 `pointer-events: none` — 잠긴 캐릭터 터치 차단
- ✅ **공유 기능**: `navigator.share` → `navigator.clipboard` → `prompt()` 폴백 체인
- ✅ **PWA 메타**: `apple-mobile-web-app-capable`, `theme-color` 설정
- ✅ **데스크톱 마우스**: canvas mousemove로 mouseTarget 설정, 매 프레임 inputDir 계산

---

## 🔀 전체 공통 점검

### [Warning] Android 뒤로가기 처리 없음 (3개 게임 모두)
- **설명:** 안드로이드에서 뒤로가기 버튼 누르면 페이지 이탈. `popstate` 이벤트 처리 없음
- **수정 제안 (공통):**
```javascript
// 뒤로가기 방지 또는 게임 일시정지
history.pushState(null, '', location.href);
window.addEventListener('popstate', (e) => {
    history.pushState(null, '', location.href);
    // 게임 중이면 일시정지 또는 확인 다이얼로그
    if (game && game.running && !game.paused) {
        pauseGame(); // 또는 confirm 후 메뉴 이동
    }
});
```

### [Info] iOS Safari 고무줄 스크롤 (3개 게임 모두)
- **상태:** `touch-action: none` + `overflow: hidden`으로 대부분 차단. Game 3은 추가로 `viewport-fit=cover` 적용
- **결론:** ✅ 정상 처리

### [Info] 300ms 탭 딜레이 (3개 게임 모두)
- **상태:** 모든 게임이 `user-scalable=no` viewport 메타 사용. 현대 모바일 브라우저에서 300ms 딜레이 없음
- **결론:** ✅ 정상 처리

### [Info] 더블 트리거 방지 (3개 게임 모두)
- **상태:** Game 1: touchstart에서 `preventDefault()` → 마우스 이벤트 생성 차단. Game 2-3: 동일 패턴
- **결론:** ✅ 이중 발생 없음

---

## 📊 종합 요약

| 게임 | Critical | Warning | Info | 정상 항목 |
|------|----------|---------|------|-----------|
| Idle Slime Merge | 0 | 3 | 3 | 10 |
| 슬라임 서바이버 | 1 | 5 | 2 | 10 |
| 슬라임 서바이버 PREMIUM | 0 | 3 | 2 | 17 |
| 공통 | 0 | 1 | 2 | - |

### 우선 수정 권장:
1. **🔴 슬라임 서바이버 touchend 누락** — 모바일 플레이 경험에 직접 영향
2. **🟡 슬라임 서바이버 delta 미클램핑** — 탭 전환 후 이상 동작 가능
3. **🟡 소형화면 버튼 & 일시정지 버튼 터치 타겟** — 모바일 조작 실수 유발
4. **🟡 Android 뒤로가기** — 실수로 게임 이탈
5. **🟡 hover 스티키** — 시각적 이상 (기능 영향 없음)

### 전체 평가:
- **Idle Slime Merge**: 모바일 터치 처리 양호. DOM 기반이라 좌표 문제 적음. 소형 화면 버튼 크기만 보완 필요
- **슬라임 서바이버**: touchend 누락이 가장 큰 이슈. 기본적인 터치 처리는 되어있으나 모바일 최적화 부족
- **슬라임 서바이버 PREMIUM**: 3종 중 가장 완성도 높음. 가상 조이스틱, DPR, safe area, delta 클램핑 등 프로덕션 수준의 모바일 대응

---
*QA by Claude · 2025-07-19*
