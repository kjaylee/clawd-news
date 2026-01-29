# RAG 임베딩 모델

## 목적
로컬 무료 임베딩 모델로 문서를 벡터화

## 요구사항
- 비용 0원 (로컬 실행)
- 메모리 최소화 (가벼운 모델)
- 한국어 + 영어 지원
- sentence-transformers 기반

## 모델 후보
1. `paraphrase-multilingual-MiniLM-L12-v2` — 다국어, 가볍고 빠름 (471MB)
2. `all-MiniLM-L6-v2` — 영어 전용, 매우 가벼움 (80MB)
3. ChromaDB 기본 임베딩 함수 (Sentence Transformers 래핑)

## 결정
- ChromaDB의 기본 `SentenceTransformerEmbeddingFunction` 사용
- 모델: `paraphrase-multilingual-MiniLM-L12-v2` (한국어 필수)
- 최초 실행 시 자동 다운로드
