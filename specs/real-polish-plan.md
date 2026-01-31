# 진짜 폴리싱 계획

## 현황
- TOP 5 게임에 코드 생성 사운드(oscillator)/프로시저럴 이펙트만 있음
- 게임마당 에셋: NAS `/volume1/미디어/gamemadang/extracted/2D/` (150 패키지, 32만 PNG)
- 오디오 에셋 없음 → 무료 라이선스 소싱 필요

## NAS 접근
- SSH: `spritz@192.168.219.149`
- 에셋 경로: `/volume1/미디어/gamemadang/extracted/2D/`
- 패키지 구조: `패키지명/1.캐릭터/`, `2.배경/`, `3.GUI/`, `4.타일맵/`, `5.VFX/` 등

## TOP 5 게임 × 에셋 매칭

### 1. Power 2048 (숫자 퍼즐)
- **필요:** 블록/타일 스프라이트, UI 패널, 배경
- **NAS 후보:** `캐주얼 5종`, `하이퍼캐주얼 8종`, `Pinpang`
- **비주얼 방향:** 클린/미니멀, 컬러풀한 블록

### 2. Merge Bloom (머지 가든)
- **필요:** 꽃/식물 스프라이트, 가든 배경, 귀여운 UI
- **NAS 후보:** `Painting Zoo`, `애니멀카페`, `캐주얼 5종`
- **비주얼 방향:** 따뜻하고 코지한 가든 테마

### 3. Slime Survivor (액션 서바이벌)
- **필요:** 몬스터 스프라이트, 캐릭터, VFX, 던전 타일
- **NAS 후보:** `마족키우기`, `Monster Killer`, `로그던전`, `darktower defense`, `만랩영웅키우기`
- **비주얼 방향:** 도트풍 or 귀여운 몬스터

### 4. Sushi Sprint (타임 매니지먼트)
- **필요:** 음식/요리 스프라이트, 주방 배경, 캐릭터
- **NAS 후보:** `cooking house`, `캐주얼 5종`, `애니멀카페`
- **비주얼 방향:** 밝고 활기찬 주방/레스토랑

### 5. Puzzle Rogue (던전 RPG 퍼즐)
- **필요:** 던전 타일, 캐릭터/몬스터, 아이템, 전투 VFX
- **NAS 후보:** `로그던전`, `darktower defense`, `만랩영웅키우기`, `PIXEL JONES`, `Hunters`
- **비주얼 방향:** 판타지 던전, 픽셀아트 or 2D 캐릭터

## 전체 리소스 파이프라인 (우선순위)
1. **게임마당** (NAS) — 있으면 즉시 사용 (32만 PNG, Spine, Aseprite)
2. **Gemini AI 생성** (MiniPC browser.proxy) — 커스텀 스프라이트/배경/아이콘
3. **웹 무료 에셋** — kenney.nl (CC0), opengameart.org, freesound.org, itch.io 무료
4. **Blender** (MiniPC) — 3D→2D 렌더링 에셋
5. **Remotion** (MiniPC) — 모션 그래픽/애니메이션

## 오디오 소싱 전략
- **BGM:** opengameart.org, freesound.org, pixabay.com/music (CC0/CC-BY)
- **SFX:** freesound.org, kenney.nl/assets (CC0)
- 포맷: MP3 (호환성) + OGG (품질)
- 각 게임당: BGM 1-2곡 + SFX 6-10종

## 기술 구현
- 단일 HTML에서 **외부 에셋 로딩**으로 전환
  ```
  games/[name]/
  ├── index.html
  └── assets/
      ├── sprites/ (PNG, 최적화)
      ├── audio/ (MP3)
      └── ui/ (PNG)
  ```
- 이미지: 웹 최적화 (리사이즈, 압축)
- 오디오: Howler.js 또는 Web Audio API로 로딩
- 로딩 화면 추가 (에셋 프리로드)

## 작업 순서
1. NAS에서 게임별 적합 에셋 탐색 & 선별
2. 무료 오디오 다운로드 (BGM + SFX)
3. 에셋 웹 최적화 (리사이즈/압축)
4. 게임별 비주얼 리디자인 + 오디오 통합
5. 테스트 (MiniPC 브라우저)
6. 출처 표기: 게임마당 (한국콘텐츠진흥원/한국게임개발자협회)

## 품질 기준
- ❌ oscillator 비프음, Canvas 원/사각형으로 때우기
- ✅ 실제 스프라이트 시트로 캐릭터/오브젝트 표현
- ✅ 실제 배경 이미지 (단색 그라데이션 아님)
- ✅ 실제 BGM 파일 (루프, 장르 매칭)
- ✅ 실제 SFX 파일 (클릭, 매치, 폭발 등)
- ✅ UI 패널/버튼 이미지 (CSS box-shadow 아님)
- ✅ 출처 표기 (게임마당)
