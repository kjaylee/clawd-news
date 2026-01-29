#!/usr/bin/env python3
"""Semantic search over Clawdbot memory using LanceDB RAG."""
import argparse
import json
import os
import sys
import warnings
warnings.filterwarnings("ignore")

# Add rag dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import (
    LANCE_DB_PATH, TABLE_NAME, EMBEDDING_MODEL,
    DEFAULT_TOP_K, DEFAULT_MIN_SCORE
)

_model = None


def get_model():
    """Lazy-load the sentence transformer model."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def search(query: str, top_k: int = DEFAULT_TOP_K, source_filter: str = None,
           min_score: float = DEFAULT_MIN_SCORE) -> list:
    """Search the vector DB."""
    import lancedb
    
    db = lancedb.connect(LANCE_DB_PATH)
    
    if TABLE_NAME not in db.table_names():
        return []
    
    table = db.open_table(TABLE_NAME)
    
    # Encode query
    model = get_model()
    query_vector = model.encode(query).tolist()
    
    # Search with cosine metric
    builder = table.search(query_vector).metric("cosine").limit(top_k)
    
    if source_filter:
        builder = builder.where(f"source LIKE '%{source_filter}%'")
    
    results_df = builder.to_pandas()
    
    output = []
    for _, row in results_df.iterrows():
        # Cosine distance: _distance = 1 - cosine_similarity
        # So score = 1 - distance
        distance = row.get("_distance", 0)
        score = round(1.0 - distance, 4)
        
        if score < min_score:
            continue
        
        output.append({
            "source": row.get("source", ""),
            "content": row.get("text", ""),
            "score": score,
            "metadata": {
                "filename": row.get("filename", ""),
                "chunk_index": int(row.get("chunk_index", 0)),
                "date": row.get("date", ""),
            }
        })
    
    return output


def format_raw(results: list) -> str:
    """Format results as human-readable text."""
    if not results:
        return "No results found."
    
    lines = []
    for i, r in enumerate(results, 1):
        lines.append(f"--- Result {i} (score: {r['score']}) ---")
        lines.append(f"Source: {r['source']}")
        lines.append(r['content'])
        lines.append("")
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Search Clawdbot memory with RAG")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--top-k", "-k", type=int, default=DEFAULT_TOP_K,
                        help=f"Number of results (default: {DEFAULT_TOP_K})")
    parser.add_argument("--source", "-s", type=str, default=None,
                        help="Filter by source (e.g., 'memory', 'MEMORY', 'TOOLS')")
    parser.add_argument("--min-score", type=float, default=DEFAULT_MIN_SCORE,
                        help=f"Minimum similarity score (default: {DEFAULT_MIN_SCORE})")
    parser.add_argument("--raw", "-r", action="store_true",
                        help="Human-readable output instead of JSON")
    
    args = parser.parse_args()
    
    results = search(
        query=args.query,
        top_k=args.top_k,
        source_filter=args.source,
        min_score=args.min_score
    )
    
    if args.raw:
        print(format_raw(results))
    else:
        print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
