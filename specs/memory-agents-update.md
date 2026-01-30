# AGENTS.md Update for Memory System

## 목적
세션 시작 시 자동으로 기억 시스템 활용하도록 지시 추가

## 변경 사항

### Every Session 섹션 업데이트

기존:
```markdown
## Every Session

Before doing anything else:
1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4. **If in MAIN SESSION** (direct chat with your human): Also read `MEMORY.md`
```

변경:
```markdown
## Every Session

Before doing anything else:
1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/core.md` — 핵심 기억 (항상)
4. Read `memory/today.md` — 오늘 기록 (심볼릭 링크)
5. **If in MAIN SESSION**: Also read `MEMORY.md`
6. **Optional**: Check `BRIEFING.md` if exists (압축 브리핑)
```

### Memory 섹션 업데이트

추가:
```markdown
### 🧠 계층적 메모리 시스템

메모리는 3계층으로 구성:

1. **core.md** (항상 로드)
   - 핵심 기억만 (~2KB)
   - importance 4-5 항목
   - 수동/자동 업데이트

2. **today.md** (항상 로드)
   - 오늘 날짜 파일 심볼릭 링크
   - 실시간 기록

3. **archive/** (RAG 검색)
   - 3일+ 지난 기록
   - 시맨틱 검색으로 접근

### Importance 태깅
기억 작성 시 중요도 표시:
- `[i5]` 핵심/영구
- `[i4]` 장기
- `[i3]` 중기
- `[i2]` 단기
- `[i1]` 임시
```

### Heartbeat 섹션 추가

```markdown
### 메모리 유지보수 (하트비트 시)

주기적으로 (매일):
1. `scripts/summarize-day.py` 실행 (어제 요약)
2. core.md 업데이트 여부 확인
3. 오래된 파일 archive/로 이동 검토
4. RAG 인덱스 갱신 (`rag/index --changed`)
```

## 적용 방법
AGENTS.md 직접 수정 (Edit 도구 사용)
