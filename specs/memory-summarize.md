# Daily Summary Script

## 목적
하루 기록을 핵심 포인트로 요약하여 core.md 업데이트

## 스크립트
`scripts/summarize-day.py`

## 입력
- `memory/YYYY-MM-DD.md` (특정 날짜 또는 어제)

## 출력
- 핵심 요약 (importance 태깅 포함)
- core.md 업데이트 제안

## 요약 기준

### importance 5 (필수 유지)
- 주인님 개인 정보 변경
- 중요한 결정/약속
- 심각한 교훈

### importance 4 (장기 유지)
- 프로젝트 마일스톤
- 새로운 선호도 발견
- 기술적 발견

### importance 3 (중기 유지)
- 일반 대화 패턴
- 반복되는 주제

### importance 1-2 (단기/삭제)
- 일상 잡담
- 일회성 질문

## 구현

```python
#!/usr/bin/env python3
"""
summarize-day.py - 일일 기록 요약
Usage: python summarize-day.py [YYYY-MM-DD]
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

def main():
    # 날짜 파싱 (기본: 어제)
    if len(sys.argv) > 1:
        date_str = sys.argv[1]
    else:
        date_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    memory_dir = Path(__file__).parent.parent / "memory"
    day_file = memory_dir / f"{date_str}.md"
    
    if not day_file.exists():
        print(f"File not found: {day_file}")
        return
    
    content = day_file.read_text()
    
    # LLM API 호출하여 요약 (또는 로컬 LLM)
    summary = extract_summary(content)
    
    print(summary)

def extract_summary(content: str) -> str:
    """핵심 추출 (LLM 사용)"""
    # 구현: Ollama 또는 Claude API
    pass

if __name__ == "__main__":
    main()
```

## LLM 선택 우선순위
1. Ollama (로컬, 무료)
2. Claude API (clawd 내장?)
3. OpenAI API (fallback)

## 실행 트리거
- 하트비트에서 매일 1회 호출
- 수동: `python scripts/summarize-day.py`
