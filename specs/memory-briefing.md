# Session Briefing Generator

## 목적
세션 시작 시 압축된 브리핑 생성

## 스크립트
`scripts/generate-briefing.py`

## 입력
- `memory/core.md` (핵심 기억)
- `memory/today.md` (오늘 기록)
- `memory/YYYY-MM-DD.md` (어제, 선택적)

## 출력
- `BRIEFING.md` (세션 시작 시 로드)

## 브리핑 형식

```markdown
# 세션 브리핑

## 🎯 즉시 참고
- [오늘 할 일/약속]
- [진행 중인 작업]

## 🧠 핵심 기억
[core.md 압축 버전]

## 📅 최근 컨텍스트
[어제/오늘 주요 내용]

---
Generated: YYYY-MM-DD HH:MM
```

## 토큰 예산
- 전체 브리핑: 1500 토큰 이하
- 즉시 참고: 300 토큰
- 핵심 기억: 800 토큰
- 최근 컨텍스트: 400 토큰

## 구현

```python
#!/usr/bin/env python3
"""
generate-briefing.py - 세션 브리핑 생성
Usage: python generate-briefing.py
"""

from pathlib import Path
from datetime import datetime

def main():
    workspace = Path(__file__).parent.parent
    memory_dir = workspace / "memory"
    
    # 파일 로드
    core = load_file(memory_dir / "core.md")
    today = load_file(memory_dir / "today.md")
    
    # 브리핑 생성
    briefing = generate_briefing(core, today)
    
    # 저장
    output = workspace / "BRIEFING.md"
    output.write_text(briefing)
    print(f"Briefing saved to {output}")

def load_file(path: Path) -> str:
    if path.exists():
        return path.read_text()
    return ""

def generate_briefing(core: str, today: str) -> str:
    """브리핑 생성 (템플릿 기반 또는 LLM)"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    return f"""# 세션 브리핑

## 🎯 즉시 참고
- 새 세션 시작됨

## 🧠 핵심 기억
{core[:2000]}

## 📅 오늘 기록
{today[:1500] if today else "(없음)"}

---
Generated: {now}
"""

if __name__ == "__main__":
    main()
```

## 자동 트리거
- AGENTS.md에서 세션 시작 시 `BRIEFING.md` 확인 지시
- 하트비트에서 주기적 갱신
