# spec-battle.md — 턴제 전투 시스템

## 1. 전투 기본 구조

- **방식**: 턴제 (SPD 기준 행동 순서)
- **참전**: 아군 최대 5명 vs 적군 최대 5명
- **배치**: 전열 3자리 + 후열 2자리
- **턴**: 속도 순으로 개별 행동 (아군·적군 교차 아님)
- **종료**: 한쪽 전멸 또는 20턴 경과 (HP% 비교)

## 2. 행동 순서 결정

```
turn_order = base_spd + equip_bonus + buff_debuff + randi_range(-5, 5)
```

매 턴:
1. 모든 생존 유닛의 turn_order 계산
2. 높은 순서대로 정렬
3. 순서대로 한 명씩 행동
4. 행동 종류: 일반공격 / 스킬 / 방어

## 3. 병종 상성

```
보병 > 궁병 > 기병 > 보병 (각 1.3배)
역상성: 0.8배
동일: 1.0배
```

특수:
- **보병**: 방어 시 데미지 감소 50%
- **궁병**: 후열에서도 전열 공격 가능
- **기병**: 첫 턴 공격 시 돌격 보너스 +20%

## 4. 데미지 공식

### 물리 데미지
```gdscript
func calc_physical_damage(attacker: Dictionary, defender: Dictionary, skill_mult: float) -> int:
    var base_dmg: float = (attacker.atk * 3.0 + attacker.weapon_atk) * skill_mult
    var def_reduction: float = float(defender.cmd * 2 + defender.armor_def) / float(defender.cmd * 2 + defender.armor_def + 300)
    var type_bonus: float = get_type_advantage(attacker.unit_type, defender.unit_type)
    var crit: float = 1.5 if randf() < (float(attacker.atk) / 500.0) else 1.0
    var variance: float = randf_range(0.9, 1.1)
    var final_dmg: int = int(base_dmg * (1.0 - def_reduction) * type_bonus * crit * variance)
    return max(1, final_dmg)
```

### 책략 데미지
```gdscript
func calc_strategy_damage(attacker: Dictionary, defender: Dictionary, skill_mult: float) -> int:
    var base_dmg: float = (attacker.int_stat * 3.0 + attacker.equip_bonus) * skill_mult
    var def_reduction: float = float(defender.int_stat * 1.5 + defender.cmd * 0.5) / float(defender.int_stat * 1.5 + defender.cmd * 0.5 + 250)
    var variance: float = randf_range(0.9, 1.1)
    var final_dmg: int = int(base_dmg * (1.0 - def_reduction) * variance)
    return max(1, final_dmg)
```

### HP 계산
```gdscript
func calc_max_hp(cmd: int, level: int) -> int:
    return cmd * 50 + level * 20 + 500
```

## 5. 전투 배치 (전열/후열)

```
전열 (Front Row): slot[0], slot[1], slot[2]
후열 (Back Row):  slot[3], slot[4]
```

규칙:
- 적은 기본적으로 전열만 공격 가능
- 전열 전멸 시 후열이 전열로 이동
- 궁병/책사 스킬은 후열 직접 타격 가능
- 기병 돌격은 후열 타격 가능 (50% 확률)

## 6. AI 패턴 (MVP)

### 무모형 (Easy) — MVP 기본
```
1. 랜덤 타겟 선택
2. 스킬 사용 가능하면 50% 확률로 사용
3. 아니면 일반 공격
```

### 균형형 (Normal) — 보스용
```
1. HP 가장 낮은 적 우선 (가중치 2)
2. 상성 유리한 적 우선 (가중치 1.5)
3. 스킬 쿨타임 끝나면 사용
4. HP 30% 이하 시 방어
```

## 7. 상태이상 (MVP)

| 상태 | 효과 | 지속 |
|------|------|------|
| 화상 | 매 턴 maxHP의 8% | 2턴 |
| 위축 | 공격력 -20% | 2턴 |
| 사기충천 | 공격력 +25% | 2턴 |

## 8. 전투 흐름 (시퀀스)

```
BattleStart
  → 진형 배치 (아군/적군)
  → 시너지 체크 & 패시브 적용
  → 턴 루프:
      → 행동순서 계산
      → 각 유닛 행동:
          → [플레이어] UI 선택 (공격/스킬/방어)
          → [AI] 패턴에 따라 행동 결정
          → 데미지 계산 → HP 감소 → 상태이상 적용
          → 사망 체크
      → 턴 종료 (상태이상 틱, 쿨타임 감소)
  → 승패 판정
  → 보상 지급
BattleEnd
```

## 9. 스킬 시스템 (MVP)

### 일반 공격
- 배율: 1.0
- 물리 기반 (atk 사용)
- 쿨타임 없음

### 액티브 스킬 (MVP 2종)
1. **청룡참월** (관우): 물리 5.0배, 단일, CD 3
2. **태평요술** (장각): 책략 3.0배, 전체, CD 4

### 패시브 스킬 (MVP 2종)
1. **만인지적** (장비): 적 3+ 시 공격력 +20%
2. **인의지심** (유비): 아군 전체 방어력 +10%

## 10. 전투 UI 요구사항

```
┌─────────────────────────────┐
│ 턴: N/20      [자동] [x2]  │
├─────────────────────────────┤
│     [적1] [적2] [적3]       │  ← 전열
│        [적4] [적5]          │  ← 후열
│                             │
│        [아4] [아5]          │  ← 후열
│     [아1] [아2] [아3]       │  ← 전열
├─────────────────────────────┤
│ 현재: {장수명} HP: ███░ N%  │
│ [일반공격] [스킬] [방어]     │
└─────────────────────────────┘
```

- 유닛 탭 시 타겟 선택
- HP 바 상시 표시
- 데미지 팝업 (숫자 위로 떠오르기)
- 치명타: 큰 글씨 + 노란색
- 유리 상성: 초록 표시, 불리: 빨강 표시
