# Memory Hierarchy System

## 목적
컨텍스트 초기화 후에도 핵심 기억을 유지하는 계층적 메모리 구조

## 구조

```
memory/
├── core.md           # 핵심 기억 (항상 로드, ~2KB 제한)
├── today.md          # 오늘 기록 (심볼릭 링크 → YYYY-MM-DD.md)
├── YYYY-MM-DD.md     # 일일 기록 (현재 형식 유지)
└── archive/          # 과거 기록 (RAG 검색용)
    └── YYYY-MM-DD.md
```

## core.md 형식

```markdown
# 핵심 기억

## 주인님 (importance: 5)
- [핵심 정보 1]
- [핵심 정보 2]

## 프로젝트 (importance: 4)
- [진행 중인 프로젝트]

## 교훈 (importance: 5)
- [배운 점]

## 선호도 (importance: 3)
- [주인님 취향/선호]

---
Last updated: YYYY-MM-DD HH:MM
Token estimate: ~XXX
```

## 규칙

1. **core.md**: 압축된 핵심만. 2KB 이하 유지
2. **today.md**: 오늘 날짜 파일의 심볼릭 링크
3. **archive/**: 3일 이상 지난 파일 자동 이동
4. **importance 태그**: 1-5 점수로 중요도 표시

## 자동화
- 매일 자정: today.md 링크 갱신
- 주 1회: 오래된 파일 archive/로 이동
- 요약 후: core.md 업데이트
