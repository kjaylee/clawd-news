# RAG 자동 인덱싱

## 목적
파일 변경 시 자동으로 재인덱싱

## 방식
1. **수동 전체 인덱싱**: `python3 rag/index.py --all`
2. **단일 파일 인덱싱**: `python3 rag/index.py path/to/file.md`
3. **변경 감지 인덱싱**: `python3 rag/index.py --changed`
   - 파일 mtime vs 마지막 인덱싱 시간 비교
   - 상태 파일: `rag/index_state.json`

## Clawdbot 연동
- exec로 검색: `exec python3 /Users/kjaylee/clawd/rag/rag_search.py "쿼리"`
- 하트비트에서 주기적으로 `--changed` 실행 가능
- TOOLS.md에 사용법 기록
