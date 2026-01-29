# RAG 검색 인터페이스

## 목적
CLI로 시맨틱 검색 수행

## 사용법
```bash
python3 rag/rag_search.py "맥북 설정"
python3 rag/rag_search.py "수동수입 아이디어" --top-k 5
python3 rag/rag_search.py "게임 개발" --source memory
```

## 출력 (JSON)
```json
[
  {
    "source": "memory/2026-01-28.md",
    "content": "맥북 프로 세팅 완료...",
    "score": 0.85,
    "metadata": {"date": "2026-01-28", "chunk_index": 3}
  }
]
```

## 옵션
- `--top-k N`: 결과 수 (기본 5)
- `--source PATTERN`: 소스 필터 (memory, MEMORY, TOOLS 등)
- `--min-score FLOAT`: 최소 유사도 (기본 0.0)
- `--raw`: JSON 대신 읽기 쉬운 텍스트 출력
