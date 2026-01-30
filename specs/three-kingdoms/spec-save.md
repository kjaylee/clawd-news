# spec-save.md — 데이터 저장/로드

## 1. 저장 경로

```gdscript
const SAVE_PATH: String = "user://save_data.json"
const SAVE_BACKUP_PATH: String = "user://save_data_backup.json"
```

## 2. 저장 데이터 구조

```json
{
  "version": "0.1.0",
  "player": {
    "name": "패왕",
    "level": 1,
    "exp": 0,
    "faction": ""
  },
  "resources": {
    "gold": 500,
    "gems": 0
  },
  "generals": [
    {
      "id": "liu_bei",
      "level": 1,
      "exp": 0,
      "stars": 1
    }
  ],
  "team": ["liu_bei"],
  "campaign": {
    "current_chapter": 1,
    "current_stage": 1,
    "cleared_stages": []
  },
  "settings": {
    "bgm_volume": 0.8,
    "sfx_volume": 0.6,
    "language": "ko"
  },
  "statistics": {
    "total_battles": 0,
    "total_wins": 0,
    "play_time_seconds": 0,
    "generals_collected": 1
  }
}
```

## 3. SaveManager 싱글톤 API

```gdscript
# scripts/autoload/save_manager.gd
extends Node

var save_data: Dictionary = {}

func save_game() -> bool:
    # JSON 직렬화 → user://save_data.json
    pass

func load_game() -> bool:
    # user://save_data.json → Dictionary
    pass

func has_save() -> bool:
    # 저장 파일 존재 여부
    pass

func new_game() -> void:
    # 초기 데이터로 리셋
    pass

func add_general(general_id: String) -> void:
    # 장수 추가
    pass

func add_gold(amount: int) -> void:
    # 골드 추가
    pass

func clear_stage(stage_id: String) -> void:
    # 스테이지 클리어 기록
    pass

func is_stage_cleared(stage_id: String) -> bool:
    # 클리어 여부
    pass

func get_team() -> Array:
    # 현재 편성
    pass

func set_team(team: Array) -> void:
    # 편성 변경
    pass
```

## 4. 자동 저장 시점

- 전투 종료 (승리/패배)
- 장수 레벨업
- 편성 변경
- 설정 변경
- 스테이지 클리어

## 5. GameManager 싱글톤 API

```gdscript
# scripts/autoload/game_manager.gd
extends Node

# 장수 원본 데이터 (generals.json 로드)
var generals_db: Dictionary = {}
# 스킬 원본 데이터
var skills_db: Dictionary = {}
# 스테이지 원본 데이터
var stages_db: Dictionary = {}

func _ready() -> void:
    load_databases()

func load_databases() -> void:
    # res://data/*.json 로드
    pass

func get_general_data(id: String) -> Dictionary:
    # 장수 기본 데이터 반환
    pass

func get_skill_data(id: String) -> Dictionary:
    # 스킬 데이터 반환
    pass

func get_stage_data(id: String) -> Dictionary:
    # 스테이지 데이터 반환
    pass

func calc_general_stats(general_save: Dictionary) -> Dictionary:
    # 저장 데이터 + 원본 데이터 → 계산된 스탯 반환
    # (레벨 보정, 장비 보정 등)
    pass
```

## 6. EventBus 싱글톤

```gdscript
# scripts/autoload/event_bus.gd
extends Node

signal battle_started(stage_id: String)
signal battle_ended(result: String)
signal general_obtained(general_id: String)
signal stage_cleared(stage_id: String)
signal gold_changed(new_amount: int)
signal scene_change_requested(scene_path: String)
```

## 7. Autoload 등록 (project.godot)

```
[autoload]
GameManager = "*res://scripts/autoload/game_manager.gd"
SaveManager = "*res://scripts/autoload/save_manager.gd"
EventBus = "*res://scripts/autoload/event_bus.gd"
```

## 8. 초기 데이터 (새 게임)

```json
{
  "player": {"name": "패왕", "level": 1, "exp": 0, "faction": ""},
  "resources": {"gold": 500, "gems": 0},
  "generals": [],
  "team": [],
  "campaign": {"current_chapter": 1, "current_stage": 1, "cleared_stages": []},
  "settings": {"bgm_volume": 0.8, "sfx_volume": 0.6, "language": "ko"},
  "statistics": {"total_battles": 0, "total_wins": 0, "play_time_seconds": 0, "generals_collected": 0}
}
```

주의: 새 게임 시 장수가 없음. 1-1 도원결의 클리어 후 유비 획득, 1-3 클리어 후 관우+장비 획득.
