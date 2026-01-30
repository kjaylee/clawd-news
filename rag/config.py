"""RAG system configuration."""
import os

# Base paths
CLAWD_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAG_DIR = os.path.dirname(os.path.abspath(__file__))
LANCE_DB_PATH = os.path.join(RAG_DIR, "lance_db")

# Table name
TABLE_NAME = "clawd_memory"

# Embedding model (multilingual, supports Korean + English)
EMBEDDING_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"

# Chunking settings
MAX_CHUNK_SIZE = 500  # characters
CHUNK_OVERLAP = 50    # characters

# Files to index
INDEX_PATTERNS = [
    "memory/*.md",
    "MEMORY.md",
    "TOOLS.md",
    "CREATIVE_IDEAS.md",
    "SOUL.md",
    "USER.md",
    "AGENTS.md",
    "IDENTITY.md",
    "HEARTBEAT.md",
]

# State file for change detection
INDEX_STATE_FILE = os.path.join(RAG_DIR, "index_state.json")

# Search defaults
DEFAULT_TOP_K = 5
DEFAULT_MIN_SCORE = 0.0
