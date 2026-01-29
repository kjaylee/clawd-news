# RAG 인덱서

## 목적
마크다운 파일들을 청크로 분할하여 ChromaDB에 인덱싱

## 인덱싱 대상
- `memory/*.md` (일별 기억)
- `MEMORY.md` (장기 기억)
- `TOOLS.md` (도구 설정)
- `CREATIVE_IDEAS.md` (아이디어)
- `SOUL.md`, `USER.md` (정체성/사용자 정보)

## 청킹 전략
- 마크다운 헤더(##, ###) 기준으로 섹션 분할
- 섹션이 없으면 단락(\n\n) 기준 분할
- 최대 청크 크기: 500자
- 오버랩: 50자

## 메타데이터
- `source`: 파일 경로
- `filename`: 파일명
- `chunk_index`: 청크 순서
- `date`: 파일 날짜 (memory 파일의 경우)
- `indexed_at`: 인덱싱 시각

## 중복 방지
- document ID = `{filename}:{chunk_index}:{content_hash}`
- 재인덱싱 시 기존 문서 삭제 후 재삽입 (upsert)
