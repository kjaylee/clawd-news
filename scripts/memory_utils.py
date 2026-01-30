#!/usr/bin/env python3
"""
memory_utils.py - 메모리 시스템 공통 유틸리티
"""

import re
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, List, Tuple

WORKSPACE = Path(__file__).parent.parent
MEMORY_DIR = WORKSPACE / "memory"
ARCHIVE_DIR = MEMORY_DIR / "archive"


def parse_importance(text: str) -> int:
    """텍스트에서 importance 추출 (기본: 2)"""
    patterns = [
        r'\[i(\d)\]',
        r'\[importance:\s*(\d)\]',
        r'\[importance:\s*(\d)\]',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return 2


def filter_by_importance(content: str, min_importance: int = 3) -> str:
    """최소 importance 이상만 필터링"""
    lines = []
    current_section_importance = 2
    in_code_block = False
    
    for line in content.split('\n'):
        # 코드 블록 처리
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            lines.append(line)
            continue
        
        if in_code_block:
            lines.append(line)
            continue
        
        # 섹션 헤더의 importance
        if line.startswith('#'):
            imp = parse_importance(line)
            if imp > 2:  # 명시적으로 지정된 경우
                current_section_importance = imp
            else:
                current_section_importance = 2
        
        # 인라인 importance
        line_imp = parse_importance(line)
        effective_imp = max(current_section_importance, line_imp)
        
        if effective_imp >= min_importance or line.startswith('#'):
            lines.append(line)
    
    return '\n'.join(lines)


def get_date_file(date: Optional[str] = None) -> Path:
    """날짜 문자열로 메모리 파일 경로 반환"""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    return MEMORY_DIR / f"{date}.md"


def get_yesterday() -> str:
    """어제 날짜 문자열"""
    return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")


def get_today() -> str:
    """오늘 날짜 문자열"""
    return datetime.now().strftime("%Y-%m-%d")


def load_file(path: Path) -> str:
    """파일 로드 (없으면 빈 문자열)"""
    if path.exists():
        return path.read_text(encoding='utf-8')
    return ""


def save_file(path: Path, content: str) -> None:
    """파일 저장"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def extract_keywords(text: str) -> List[str]:
    """중요도 판단용 키워드 추출"""
    importance_5 = ['이름', '생년월일', '가족', '절대', '항상', '반드시', '계정', '비밀번호']
    importance_4 = ['프로젝트', '좋아', '싫어', '선호', '목표']
    importance_3 = ['요즘', '최근', '진행', '작업']
    importance_1 = ['그냥', '잠깐', '날씨']
    
    found = []
    text_lower = text.lower()
    
    for kw in importance_5:
        if kw in text_lower:
            found.append((kw, 5))
    for kw in importance_4:
        if kw in text_lower:
            found.append((kw, 4))
    for kw in importance_3:
        if kw in text_lower:
            found.append((kw, 3))
    for kw in importance_1:
        if kw in text_lower:
            found.append((kw, 1))
    
    return found


def estimate_importance(text: str) -> int:
    """텍스트의 추정 중요도"""
    keywords = extract_keywords(text)
    if not keywords:
        return 2
    return max(imp for _, imp in keywords)


def count_tokens_approx(text: str) -> int:
    """대략적인 토큰 수 (한국어: 글자당 ~0.5토큰, 영어: 단어당 ~1.3토큰)"""
    korean_chars = len(re.findall(r'[가-힣]', text))
    english_words = len(re.findall(r'[a-zA-Z]+', text))
    other_chars = len(text) - korean_chars - english_words * 5
    
    return int(korean_chars * 0.5 + english_words * 1.3 + other_chars * 0.3)
