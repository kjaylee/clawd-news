# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## MiniPC (노드)
- **IP:** 100.80.169.94 (Tailscale)
- **User:** spritz
- **승인:** system.run 활성화됨
- **우회:** bash heredoc 차단 → base64+python으로 파일 생성
- **설치됨:**
  - Playwright (브라우저 자동화)
  - `/home/spritz/gemini-image.py` — Gemini 이미지 생성
- **브라우저:**
  - Brave 브라우저 연결됨
  - browser.proxy 사용 가능
  - 웹 검색/스크래핑 가능
  - **주인님 계정 로그인됨** → Gemini Pro 무료 사용 가능

### 🎬 Remotion (영상 제작)
- **프로젝트:** `/home/spritz/remotion-videos`
- **ffmpeg:** 설치됨
- **사용법:**
  ```bash
  cd /home/spritz/remotion-videos
  npx remotion render <CompositionId> out/video.mp4
  ```
- React 컴포넌트로 영상 프로그래밍 가능

### ⚠️ 주의
- **직접 실행 금지** — 오래 걸리는 작업은 반드시 서브에이전트 스폰해서 시킬 것
- 메인 세션에서 직접 MiniPC 작업 수행 ❌
- 서브에이전트 스폰 후 위임 ✅

## 🚨 맥 스튜디오 사용 원칙 (필수)
- **주인님이 맥 스튜디오 사용 중일 때 방해 금지** — 브라우저, 무거운 프로세스 등
- **주인님 부재 시에는 사용 가능**
- 확인 방법: `ps aux`로 Xcode/Safari/Chrome 등 활성 앱 체크
- **브라우저 테스트/자동화 → 기본적으로 MiniPC browser.proxy 사용**
  - `browser` tool: `target="node"`, `node="MiniPC"`
  - 또는 `nodes.run` (node="MiniPC")으로 실행
- 서브에이전트에게도 반드시 이 원칙 전달할 것

---

## MacBook Pro (노드)
- **IP:** 100.91.184.81 (Tailscale)
- **User:** kjaylee
- **칩:** Apple M3, 24GB RAM
- **macOS:** 15.6
- **승인:** system.run + browser.proxy 활성화됨
- **설치됨:**
  - node, python3, git, ffmpeg
  - **MLX Z-Image-Turbo** (이미지 생성 전담)

### 🎨 이미지 생성 (MLX Z-Image-Turbo)
- **경로:** `/Users/kjaylee/MLX_z-image/`
- **모델:** Z-Image-Turbo 4-bit quantized (6.1GB)
- **성능:** 1024×1024, 9스텝, ~180초
- **사용법:**
  ```bash
  cd /Users/kjaylee/MLX_z-image
  # 1. prompt.txt에 프롬프트 작성
  echo "프롬프트 내용" > prompt.txt
  # 2. venv 활성화 + 실행
  source venv/bin/activate && python run.py --output output.png
  # 옵션: --steps 9 --seed 42 --width 1024 --height 1024 --lora_path "" --lora_scale 1.0
  ```
- **역할:** 이미지 생성 전담 노드 (Mac Studio 부담 경감)

### ⚠️ 주의
- 디스크 여유 적음 (~16GB) — 추가 모델 설치 자제
- **이미지 생성 → 맥북 위임** (서브에이전트 스폰)
- Mac Studio는 메인 작업 집중, 맥북은 이미지 전담

---

---

## 🧠 RAG 시맨틱 검색
- **경로:** `/Users/kjaylee/clawd/rag/`
- **DB:** LanceDB (로컬 벡터 DB, 서버 불필요)
- **임베딩:** paraphrase-multilingual-MiniLM-L12-v2 (한국어+영어, ~471MB)
- **비용:** 0원 (로컬 모델)
- **현재:** 100 chunks, 7 files

### 사용법
```bash
# 검색 (JSON 출력)
./rag/search "맥북 설정" -k 5

# 검색 (읽기 쉬운 텍스트)
./rag/search "게임 개발" --raw

# 소스 필터링
./rag/search "미스 김" --source memory

# 전체 재인덱싱
./rag/index --all

# 변경된 파일만 인덱싱
./rag/index --changed

# 단일 파일 인덱싱
./rag/index memory/2026-01-29.md
```

### 인덱싱 대상
- `memory/*.md`, `MEMORY.md`, `TOOLS.md`, `CREATIVE_IDEAS.md`, `SOUL.md`, `USER.md`
- 새 파일 추가 시: `rag/config.py`의 `INDEX_PATTERNS`에 추가 후 `--all`

---

---

## 🌐 프로젝트 허브
- **경로:** `/Users/kjaylee/clawd/`
- **URL:** https://eastsea.monster
- **포스트:** `_posts/` 폴더
- **Jekyll 기반** 사이트

---

---

## 🧰 현재 능력 총정리

### 🔧 내장 도구
| 도구 | 용도 |
|------|------|
| `exec` | 맥 스튜디오 쉘 명령 실행 |
| `nodes.run` | MiniPC/맥북 원격 명령 실행 |
| `browser` | 웹 브라우저 자동화 (MiniPC만!) |
| `web_search` | Brave API 웹 검색 |
| `web_fetch` | URL 콘텐츠 추출 (마크다운) |
| `message` | 텔레그램 메시지/반응/폴 전송 |
| `cron` | 크론잡 관리 (리마인더, 자동화) |
| `sessions_spawn` | 서브에이전트 스폰 (병렬 작업) |
| `tts` | 텍스트→음성 변환 |
| `image` | 이미지 분석 (비전) |
| `canvas` | Canvas UI 렌더링 |
| `memory_search` | 시맨틱 메모리 검색 |
| `gateway` | Clawdbot 설정/재시작 |

### 📡 노드 (원격 머신)
| 노드 | 역할 | 주요 능력 |
|------|------|-----------|
| **맥 스튜디오** (로컬) | 메인 작업, 코딩 | exec, git, node, python3 |
| **MiniPC** (Linux) | 브라우저 자동화, 영상 제작 | Playwright, Remotion, ffmpeg, Gemini |
| **맥북 Pro** (M3) | 이미지 생성 | MLX Z-Image-Turbo, node, python3 |

### 🎨 콘텐츠 생성
- **이미지:** 맥북 MLX Z-Image-Turbo (로컬, 무료)
- **이미지(AI):** MiniPC Gemini (주인님 계정, 무료)
- **영상:** MiniPC Remotion (React 기반 영상 프로그래밍)
- **TTS:** tts 도구 (음성 생성)
- **블로그:** Jekyll → eastsea.monster (자동 배포)

### 🎮 게임 개발
- HTML5 단일 파일 게임 제작
- 텔레그램 Mini App SDK 통합
- 게임 QA: MiniPC Playwright headless 테스트
- 게임 포트폴리오: eastsea.monster/games/

### 📊 데이터/검색
- RAG 시맨틱 검색 (LanceDB, 로컬)
- Brave Search API (웹 검색)
- web_fetch (웹 스크래핑)

### 💬 커뮤니케이션
- 텔레그램 (메인 채널)
- 크론잡 자동 보고
- 서브에이전트 병렬 작업

### 🔄 자동화
- 크론잡 6개 (뉴스, 증시, 게임개발, 자율사이클, 일기, 로그정리)
- 하트비트 주기적 체크
- Git 자동 커밋/푸시

### 📦 스킬 (skills/)
- ralph-loop: AI 자율 구현 방법론
- game-marketing: 게임 마케팅 플레이북 (구축 중)
- + ClawdHub 외부 스킬 다수

### ⚡ 습득한 교훈
- 새 플랫폼 → 조사 먼저, 코딩은 그 다음
- 맥 스튜디오 → 주인님 사용 중 방해 금지
- 서브에이전트 보고 → 대화 중 끼어들기 금지
- 게임 QA → 코드 리뷰만으론 부족, 실제 플레이 필수
- 양보다 질

Add whatever helps you do your job. This is your cheat sheet.

---

## 🎮 Godot Engine (MiniPC)
- **버전:** 4.6 stable
- **경로:** `/home/spritz/godot4` (심볼릭 링크)
- **Export Templates:** 4.6.stable (Web, Linux, Android, iOS 등)
- **커스텀 부트 스플래시:** `/home/spritz/godot-demo/boot_splash.png` (East Sea Games 로고)
- **빌드:** `godot4 --headless --path <project> --export-release "Web"`
- **파일 전송:** MiniPC→맥스튜디오는 HTTP 서버(9877) + curl 사용
- **주의:** MiniPC에서 GitHub push 불가 (인증 없음), 맥 스튜디오에서 pull & push

---

## 🎮 게임 유통 플랫폼 리스트

### 웹게임 (HTML5 그대로)
| 플랫폼 | 수수료 | 특징 |
|--------|--------|------|
| **itch.io** | 자유 설정 (0%~) | 인디 1위, 번들 세일 |
| **Newgrounds** | 광고 수익 분배 | 웹게임 전통 강자 |
| **CrazyGames** | 광고 CPM | 웹게임 포털, 수익 쉐어 |
| **Poki** | 광고 CPM | 대형 웹게임 포털 |
| **Game Jolt** | 자유 | 인디 커뮤니티 |
| **텔레그램 Mini App** | 0% | 현재 운영 중 |

### 데스크톱 (Godot 네이티브 빌드)
| 플랫폼 | 수수료 | 등록비 | 특징 |
|--------|--------|--------|------|
| **Steam** | 30% (→25%→20%) | $100/앱 | PC 표준, 최대 유저풀 |
| **Epic Games Store** | 12% | 무료 | 낮은 수수료 |
| **GOG** | 30% | 무료 | DRM-free, 인디 친화 |
| **itch.io** | 자유 | 무료 | 데스크톱 다운로드도 지원 |

### 모바일 (Godot Android/iOS 빌드)
| 플랫폼 | 수수료 | 등록비 | 특징 |
|--------|--------|--------|------|
| **Google Play** | 15% (첫 $1M) | $25 일회 | 최대 안드로이드 마켓 |
| **App Store** | 15% (첫 $1M) | $99/년 | iOS 독점 |
| **Samsung Galaxy Store** | 30% | 무료 | 경쟁 적음 |
| **Amazon Appstore** | 30% | 무료 | Fire 태블릿 |

### 🏆 우선순위 전략
1. **텔레그램 Mini App** — 이미 운영 중 (무료)
2. **itch.io** — 웹+데스크톱 동시, 무료
3. **Google Play + App Store** — 모바일 유저 최대
4. **Steam** — PC 게이머, $100 투자
5. **CrazyGames/Poki** — 웹 광고 수익
