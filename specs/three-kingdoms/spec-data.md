# spec-data.md — 장수 데이터 구조

## 1. JSON 데이터 스키마

### generals.json
```json
{
  "generals": [
    {
      "id": "liu_bei",
      "name_ko": "유비",
      "name_cn": "劉備",
      "name_en": "Liu Bei",
      "faction": "shu",
      "rarity": "SSR",
      "unit_type": "infantry",
      "position": "commander",
      "stats": {
        "atk": 82,
        "int": 85,
        "cmd": 80,
        "spd": 70
      },
      "skills": {
        "active": ["ren_yi_zhi_xin"],
        "passive": ["tao_yuan_bond"],
        "ultimate": "ren_yi_zhi_xin"
      },
      "quotes": {
        "battle_start": "의로 뭉친 자들은 비록 작을지라도, 결국 대세를 얻는다는 것을 보여줍시다.",
        "victory": "천하는 무력으로 얻을 수 있어도, 백성의 마음은 무력으로 얻을 수 없습니다.",
        "defeat": "오늘의 떠남이 내일의 천하를 위한 씨앗이 되길 바라오.",
        "skill": "세상에 천하의 지혜를 품은 자가 있다면, 몇 번을 가서라도 그 뜻을 청하겠소."
      }
    }
  ]
}
```

### skills.json
```json
{
  "skills": [
    {
      "id": "qing_long_zhan_yue",
      "name_ko": "청룡참월",
      "name_cn": "靑龍斬月",
      "type": "active",
      "category": "physical_single",
      "multiplier": 5.0,
      "cooldown": 3,
      "description_ko": "적 1명에게 무력×5.0 물리 데미지. HP 50% 이하 시 +50%",
      "extra_condition": {
        "type": "target_hp_below",
        "threshold": 0.5,
        "bonus_damage": 0.5
      }
    }
  ]
}
```

### stages.json
```json
{
  "stages": [
    {
      "id": "1-1",
      "chapter": 1,
      "stage": 1,
      "name_ko": "도원결의",
      "is_tutorial": true,
      "enemies": [
        {"id": "yellow_turban_soldier", "level": 1, "count": 3}
      ],
      "rewards": {
        "gold": 500,
        "generals": ["liu_bei"]
      },
      "cutscene_before": "chapter1_intro",
      "cutscene_after": null
    }
  ]
}
```

## 2. 스탯 계산 공식

```
최대 HP = cmd × 50 + level × 20 + 500
물리 공격력 = atk × 3 + weapon_atk
책략 공격력 = int × 3 + equip_bonus
물리 방어 = cmd × 2 + armor_def
책략 방어 = int × 1.5 + cmd × 0.5 + equip_bonus
회피율 = spd / 3.0 (최대 30%)
치명타율 = atk / 5.0 (최대 20%)
```

## 3. MVP 장수 목록 (5명)

| ID | 이름 | 등급 | 병종 | ATK | INT | CMD | SPD |
|----|------|------|------|-----|-----|-----|-----|
| liu_bei | 유비 | R→SSR | 보병 | 82 | 85 | 80 | 70 |
| guan_yu | 관우 | R→SSR | 기병 | 97 | 80 | 85 | 78 |
| zhang_fei | 장비 | R→SR | 기병 | 96 | 70 | 80 | 75 |
| zhang_jiao | 장각 | SR | 보병 | 45 | 85 | 90 | 60 |
| hua_xiong | 화웅 | N | 보병 | 87 | 45 | 70 | 72 |

## 4. 등급별 색상 코드

| 등급 | 색상 hex | GDScript Color |
|------|---------|----------------|
| N | #888888 | Color(0.53, 0.53, 0.53) |
| R | #4CAF50 | Color(0.30, 0.69, 0.31) |
| SR | #2196F3 | Color(0.13, 0.59, 0.95) |
| SSR | #9C27B0 | Color(0.61, 0.15, 0.69) |
| UR | #F44336 | Color(0.96, 0.26, 0.21) |

## 5. 세력 데이터

| 세력 ID | 이름 | 색상 hex |
|---------|------|---------|
| wei | 위(魏) | #E53935 |
| shu | 촉(蜀) | #43A047 |
| wu | 오(吳) | #1E88E5 |
| other | 기타 | #757575 |

## 6. 병종 상성 테이블

```gdscript
const TYPE_ADVANTAGE: Dictionary = {
    "infantry_vs_archer": 1.3,
    "archer_vs_cavalry": 1.3,
    "cavalry_vs_infantry": 1.3,
    "infantry_vs_cavalry": 0.8,
    "archer_vs_infantry": 0.8,
    "cavalry_vs_archer": 0.8,
}
```

## 7. 파일 구조

```
data/
├── generals.json          # 장수 전체 데이터
├── skills.json            # 스킬 전체 데이터
├── stages.json            # 스테이지 전체 데이터
├── synergies.json         # 시너지 데이터 (Phase 2)
└── formations.json        # 진형 데이터 (Phase 2)
```
