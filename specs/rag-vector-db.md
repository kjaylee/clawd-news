# RAG 벡터 DB 설정

## 목적
ChromaDB를 로컬에 설치하고 영구 스토리지로 구성

## 요구사항
- ChromaDB 로컬 설치 (pip)
- 영구 저장 경로: `/Users/kjaylee/clawd/rag/chroma_db/`
- 컬렉션: `clawd_memory` (메모리 문서용)

## 구현
- `rag/` 디렉토리 생성
- chromadb pip 설치
- 초기화 스크립트로 DB 생성 확인
