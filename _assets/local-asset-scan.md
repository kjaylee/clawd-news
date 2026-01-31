# 로컬 Unity 에셋 전수 조사 결과
> 스캔 일시: 2025-01-29
> 대상 볼륨: `/Volumes/workspace/`, `/Volumes/14TB/`

## 요약

| 항목 | 수량 |
|------|------|
| Unity 프로젝트 (Assets/ 포함) | 12개 |
| Asset Store 패키지 (.unitypackage) | 82개 |
| Asset Store 퍼블리셔 | 62개 |
| /Volumes/14TB/ Unity 에셋 | 0개 (미디어 볼륨) |

---

## P1 다운로드 요청 에셋 상태

| 에셋명 | 상태 | 위치/비고 |
|--------|------|-----------|
| **SPUM** | ✅ 있음 | `/Volumes/workspace/spum-maker/Assets/SPUM/` (483MB) |
| | | `Asset Store-5.x/soonsoon/` — 3개 패키지 (SPUM, Retro Heroes, Bundle Basic) |
| **Pixel Hero Maker** | ✅ 있음 | `/Volumes/workspace/pixel-hero-maker/` (1.8GB) |
| | | `Asset Store-5.x/Hippo/` — 3개 패키지 (기본, Megapack, for 2D shooters) |
| **Tiny Swords** | ❌ 없음 | 전체 검색 결과 없음 |
| **Classic RPG GUI** | ❌ 없음 | GUI 에셋 있으나 "Classic RPG GUI" 아님 (GUI-The Stone, UI-23 Comic 등) |
| **RPG VFX Bundle** | ❌ 없음 | Archanor VFX의 Retro Arsenal만 있음, RPG VFX Bundle 없음 |
| **Cute & Chibi** | ⚠️ 유사 | `HUBERTH ART 2D` — "2D Character - Cute Chibi Free Pack" (무료 버전) |
| | | `2D Mobile Test01/Assets/` 프로젝트에 이미 임포트됨 |
| **Hyper Casual FX** | ✅ 있음 | `Asset Store-5.x/Kyeoms/Particle Systems/Hyper Casual FX Pack Vol1.unitypackage` |
| **Medieval Fantasy SFX** | ❌ 없음 | SFX 에셋 전무 |
| **8-Bit Retro SFX** | ❌ 없음 | SFX 에셋 전무 |
| **UI SFX Mega Pack** | ❌ 없음 | SFX 에셋 전무 |

### P1 결론
- **보유:** 3개 (SPUM, Pixel Hero Maker, Hyper Casual FX)
- **유사:** 1개 (Cute & Chibi — 무료 버전만)
- **미보유:** 6개 (Tiny Swords, Classic RPG GUI, RPG VFX Bundle, Medieval Fantasy SFX, 8-Bit Retro SFX, UI SFX Mega Pack)
- **특히 SFX 계열 3종은 완전 부재** — 오디오 에셋이 하나도 없음

---

## Unity 프로젝트 목록 (12개)

| 프로젝트 | 경로 | 주요 에셋 |
|---------|------|-----------|
| **spum-maker** | `/Volumes/workspace/spum-maker/` | SPUM |
| **pixel-hero-maker** | `/Volumes/workspace/pixel-hero-maker/` | PixelFantasy, FantasyMapEditor, FanyasyStatusIcons |
| **pixel-hero-shooter** | `/Volumes/workspace/pixel-hero-shooter/` | PixelFantasy (PixelHeroes) |
| **Last Infinity** | `/Volumes/workspace/Last Infinity/` | SPUM, Layer Lab, PixelMonsters, Retro Arsenal, GEM, Gif |
| **unity3d-exit-001** | `/Volumes/workspace/unity3d-exit-001/` | TopDownEngine, Feel, Boing Kit, DamageNumbersPro, NV3D, KAWAII_ANIMATIONS, FogOfWar, PinePie, Suriyun, RPGMonsterBundle, VFX_Klaus |
| **Exit** | `/Volumes/workspace/Exit/` | TopDownEngine, Suriyun, UmbraSoftShadows |
| **Test010** | `/Volumes/workspace/Test010/` | TopDownEngine, AI Toolbox, KAWAII_ANIMATIONS, Suriyun, MMData |
| **2D Mobile Test01** | `/Volumes/workspace/2D Mobile Test01/` | Chibi Character Free (Cute Chibi), DeadRevolver, HeroEditor |
| **2D-test-001** | `/Volumes/workspace/2D-test-001/` | (기본 에셋만) |
| **Rescue** | `/Volumes/workspace/Rescue/` | (기본 에셋만) |
| **JJ001** | `/Volumes/workspace/JJ001/` | Izzy (iClone), Suriyun, TopDownEngine |
| **Slot** | `/Volumes/workspace/Slot/` | ModernCasinoBundle |

---

## Asset Store 패키지 전체 목록 (82개)

### 퍼블리셔별 정리

| 퍼블리셔 | 패키지명 | 카테고리 |
|----------|---------|----------|
| **Archanor VFX** | Retro Arsenal | Particle Systems |
| **BG Studio** | Free Pixel Battle Backgrounds Free Pixel Characters | 2D Tiles |
| **BIPER** | CombatGirlsRifleCharacterPack | 3D Humanoids |
| **Binary Charm** | Text Color Buttons | GUI |
| **BitGem** | Micro Monster Heroes Pack Low Poly | 3D Toons |
| **BitWave Labs** | Animated Text Reveal | GUI Skins |
| **Brain Station 23** | UI 23 - Comic Menu | GUI Skins |
| **CatBorg Studio** | 3D Characters Zombie City Streets Lowpoly Pack - Lite | 3D Humanoids |
| **Crystal Pug** | Safe Area Helper | GUI |
| **Dead Revolver** | Pixel Prototype Player Sprites | 2D Characters |
| **Demigiant** | DOTween HOTween v2 | Animation |
| **Dogmatic** | FREE Skyboxes - Space | Skies |
| **Dungeon Mason** | RPG Monster BUNDLE Polyart | 3D Creatures |
| **Dustyroom** | AI Toolbox with ChatGPT DALLE Whisper Gemini etc | Tools/AI |
| **Ekincan Tas** | Damage Numbers Pro | GUI Skins |
| **ElvGames** | 2D Farm Game Grasslands 4 Seasons Tileset | 2D Tiles |
| **ElvGames** | 2D TopDown Tilesets Fantasy Dreamland | 2D Tiles |
| **Eric Hu** | Anime Shading Plus | Shaders |
| **Exceed7 Experiments** | Notch Solution | GUI |
| **FUDASTORE** | KAWAII ANIMATIONS 100 | Animation |
| **Febucci Tools** | Text Animator for Unity | GUI |
| **GGEZ** | Perfect Pixel Camera by GG EZ | Camera |
| **Gif** | 2D RPG topdown tilesets - pixelart assets FULL BUNDLE | 2D Tiles |
| **HUBERTH ART 2D** | 2D Character - Cute Chibi Free Pack (+ SFX) | 2D Characters |
| **Harry Heath** | Lattice Modifier for Unity | Animation |
| **Helix Studio** | Chibi Mummy | 3D Toons |
| **Hippo** | Fantasy Map Creator Editor | Textures |
| **Hippo** | Character Editor Fantasy | 2D Characters |
| **Hippo** | Fantasy Monsters Animated Megapack | 2D Characters |
| **Hippo** | Pixel Hero Maker Megapack | 2D Characters |
| **Hippo** | Pixel Hero Maker for 2D shooters | 2D Characters |
| **Hippo** | Pixel Hero Maker | 2D Characters |
| **Hippo** | Fantasy Inventory Icons Free | Icons UI |
| **Hippo** | Fantasy Status Icons | Icons UI |
| **Ida Faber** | Dress Up Maids | 3D Fantasy |
| **Ida Faber** | Beach Bundle Boys and Girls | 3D Humans |
| **Ida Faber** | Gamer Girl | 3D Humans |
| **Ida Faber** | Techwear Girls | 3D Humans |
| **Infinity Code** | Project Context Actions | Utilities |
| **Joo Baltieri** | Mini Simple Characters Skeleton Free Demo | 3D Fantasy |
| **KINEMATION** | Magic Animation Blend | Animation |
| **Kenmi** | Cute Fantasy RPG - 16x16 top down pixel art | 2D Tiles |
| **Kevin Animation** | ARPG Pack | Animation |
| **Kevin Iglesias** | Giant Monster Model - Golem | 3D Fantasy |
| **Kronnect** | Umbra Soft Shadows (URP) | Shaders |
| **Kyeoms** | Hyper Casual FX Pack Vol1 | Particle Systems |
| **Kyeoms** | Stylized Shoot Hit Vol1 | Particle Systems |
| **LAYERLAB** | GUI - The Stone | GUI Skins |
| **Long Bunny Labs** | Boing Kit Dynamic Bouncy Bones Grass | Effects |
| **Luiz Melo** | Evil Wizard 3 | 2D Characters |
| **Luiz Melo** | Hero Knight | 2D Characters |
| **Luiz Melo** | Martial Hero | 2D Characters |
| **Luiz Melo** | Medieval King Pack 2 | 2D Characters |
| **Luiz Melo** | Medieval King Pack | 2D Characters |
| **Luiz Melo** | Medieval Warrior Pack 2 | 2D Characters |
| **Luiz Melo** | Medieval Warrior Pack | 2D Characters |
| **Master Key** | MK Slot Bundle Modern Casino Template | Complete Project |
| **Matthew Guz** | Hit Effects FREE | Particle Systems |
| **MilkDrinker01** | Pixel-Perfect Fog Of War | Shaders |
| **Mingames** | Mini Shadow | Shaders |
| **More Mountains** | TopDown Engine | Complete Project |
| **More Mountains** | Feel | Effects |
| **MotionDezire** | Sword Animation | Animation |
| **NV3D** | Dark Dungeon Tile Set | 3D Environments |
| **Nyukiland** | FolderColor | Utilities |
| **October Studio** | Monster Survivors - Full Game | Complete Project |
| **POLYBOX** | Polyquest Heroes Adventurer I Explorer | 3D Characters |
| **POLYBOX** | Polyquest Islands Full Pack Vol2 | 3D Environments |
| **Pine Pie** | PinePie Joystick | GUI |
| **Pixel Crushers** | Scene Streamer | System |
| **Reallusion** | Izzy - iClone Character | 3D Humans |
| **SURIYUN** | Anime Girls Pack | 3D Humans |
| **Studio New Punch** | Zombies Bundle V2 | 3D Humanoids |
| **Sven Thole** | Hero Knight - Pixel Art | 2D Characters |
| **Sven Thole** | Prototype Hero Demo - Pixel Art | 2D Characters |
| **Synty Studios** | POLYGON City Zombies - Low Poly 3D Art | 3D Fantasy |
| **The Naughty Cult** | Hot Reload Edit Code Without Compiling | Utilities |
| **ThunderForgeStudio** | Stylized Free Skeleton | 3D Creatures |
| **bestgamekits** | 118 sprite effects bundle | Textures |
| **karsiori** | Pixel Art Gem Pack - Animated | 2D Tiles |
| **soonsoon** | 2D Pixel Unit Maker - SPUM | 2D Characters |
| **soonsoon** | 2D Retro Heroes - SPUM Premium Addon Pack | 2D Characters |
| **soonsoon** | Pixel Units - SPUM Bundle Pack Basic | 2D Characters |

---

## 기타 발견

| 항목 | 위치 | 비고 |
|------|------|------|
| SimpleEncryption.unitypackage | `/Volumes/workspace/` | 단독 패키지 파일 |
| GoogleMobileAds-v8.1.0.unitypackage | `/Volumes/workspace/2T/` | AdMob SDK |
| neon.dash (Godot 프로젝트) | `/Volumes/workspace/neon.dash/` | Godot 4 게임 (Unity 아님) |
| jump (Godot 프로젝트) | `/Volumes/workspace/jump/` | Geometry Dash 클론 (Godot) |
| /Volumes/14TB/ | 미디어 볼륨 | Unity 에셋 없음 |

---

## 디스크 사용량

| 폴더 | 용량 |
|------|------|
| Asset Store-5.x/ | 15GB |
| Last Infinity/ | 7.0GB |
| pixel-hero-maker/ | 1.8GB |
| spum-maker/ | 483MB |
| pixel-hero-shooter/ | 167MB |
