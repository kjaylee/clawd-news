# Importance Tagging System

## 목적
기억의 중요도를 표시하여 자동 정리/유지 결정

## 형식

```markdown
## 섹션 제목 [importance: N]

내용...
```

또는 인라인:
```markdown
- 중요한 정보 `[i5]`
- 덜 중요한 정보 `[i2]`
```

## 점수 기준

| 점수 | 의미 | 유지 기간 | 예시 |
|------|------|-----------|------|
| 5 | 핵심/영구 | 영구 | 주인님 신원, 중요 약속 |
| 4 | 장기 | 6개월+ | 프로젝트, 선호도 |
| 3 | 중기 | 1-3개월 | 진행 상황, 패턴 |
| 2 | 단기 | 1-2주 | 일반 대화 |
| 1 | 임시 | 1-3일 | 일회성 질문 |

## 자동 분류 힌트

### importance 5 키워드
- 이름, 생년월일, 가족
- "절대", "항상", "반드시"
- 계정 정보, 중요 설정

### importance 4 키워드
- 프로젝트명, 목표
- "좋아해", "싫어해"
- 기술 스택, 도구

### importance 3 키워드
- "요즘", "최근에"
- 진행 중, 작업 중

### importance 1-2 키워드
- "그냥", "잠깐"
- 날씨, 일상 잡담

## core.md 정책

- importance 4-5만 core.md에 유지
- importance 3은 RAG로 검색 가능하게
- importance 1-2는 archive 후 삭제 가능

## 파싱 유틸

```python
import re

def parse_importance(line: str) -> int:
    """라인에서 importance 추출"""
    match = re.search(r'\[i(\d)\]|\[importance:\s*(\d)\]', line)
    if match:
        return int(match.group(1) or match.group(2))
    return 2  # 기본값

def filter_by_importance(content: str, min_importance: int) -> str:
    """최소 importance 이상만 필터"""
    lines = []
    current_importance = 2
    
    for line in content.split('\n'):
        # 섹션 헤더의 importance 체크
        if line.startswith('#'):
            match = re.search(r'\[importance:\s*(\d)\]', line)
            if match:
                current_importance = int(match.group(1))
        
        # 인라인 importance 체크
        line_imp = parse_importance(line)
        
        if max(current_importance, line_imp) >= min_importance:
            lines.append(line)
    
    return '\n'.join(lines)
```
