# RAG 기억력 향상 프로젝트 — 구현 계획

## DONE
- [x] Task 1: 환경 설정 — venv + pip 패키지 설치 (lancedb, sentence-transformers)
- [x] Task 2: 핵심 모듈 — `rag/config.py` (경로, 설정 상수)
- [x] Task 3: 청킹 모듈 — `rag/chunker.py` (마크다운 분할)
- [x] Task 4: 인덱서 — `rag/index.py` (파일 → LanceDB 저장)
- [x] Task 5: 검색 CLI — `rag/rag_search.py` (시맨틱 검색)
- [x] Task 6: 자동 인덱싱 — `rag/index.py --changed` (변경 감지)
- [x] Task 7: 전체 인덱싱 실행 및 테스트 — 7파일 100청크 성공
- [x] Task 8: TOOLS.md 업데이트 및 문서화

## 기술 결정
- **ChromaDB → LanceDB** 변경: Python 3.14에서 onnxruntime 호환성 문제로 변경
- **임베딩 모델**: paraphrase-multilingual-MiniLM-L12-v2 (한국어+영어 다국어)
- **거리 메트릭**: Cosine similarity
- **Wrapper scripts**: `rag/search`, `rag/index` (stderr 억제, 깔끔한 출력)
