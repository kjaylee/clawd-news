#!/usr/bin/env python3
"""
auto-9slice.py — 9-Slice Border 자동 감지 도구

이미지에서 9-slice (9-patch) border 값을 자동으로 감지합니다.

알고리즘 원리:
  OnionRing (kyubuns) 방식을 Python으로 재구현.
  각 행/열의 픽셀을 비교하여 "동일 열/행이 연속되는 최장 구간"을 찾고,
  그 구간이 stretch 가능한 영역 → 나머지가 border.

사용법:
  # 단일 이미지
  python3 auto-9slice.py image.png

  # 디렉토리 일괄 처리
  python3 auto-9slice.py --dir path/to/gui/ --recursive

  # CSS 출력
  python3 auto-9slice.py image.png --format css

  # JSON 출력
  python3 auto-9slice.py --dir path/to/gui/ --format json --output slices.json

  # Godot NinePatchRect 출력
  python3 auto-9slice.py image.png --format godot

  # 허용 오차 조절 (그라디언트 이미지용)
  python3 auto-9slice.py image.png --tolerance 5

의존성:
  pip install Pillow numpy

저자: Miss Kim (Clawdbot AI)
날짜: 2026-01-31
라이선스: MIT
참고: https://github.com/kyubuns/onion_ring
"""

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import numpy as np
    from PIL import Image
except ImportError:
    print("필요한 패키지를 설치해주세요:")
    print("  pip install Pillow numpy")
    sys.exit(1)


# ─────────────────────────────────────────────────
# Core Algorithm
# ─────────────────────────────────────────────────

def normalize_pixels(pixels: np.ndarray) -> np.ndarray:
    """투명 픽셀(alpha=0)의 RGB를 0으로 정규화."""
    if pixels.shape[-1] == 4:  # RGBA
        alpha = pixels[..., 3:4]
        mask = alpha == 0
        normalized = pixels.copy()
        # alpha=0인 픽셀의 RGB도 0으로
        normalized[..., :3] = np.where(mask, 0, pixels[..., :3])
        return normalized
    return pixels


def find_longest_identical_run(data: np.ndarray, tolerance: int = 0) -> tuple:
    """
    1D 배열의 원소(행 또는 열)를 순회하며
    인접 원소가 동일한(또는 tolerance 이내) 최장 연속 구간을 찾음.

    Args:
        data: shape (N, ...) — N개의 행 또는 열
        tolerance: 허용 오차 (0 = 완전 일치)

    Returns:
        (start, end) — 최장 동일 구간의 시작/끝 인덱스 (inclusive)
        또는 None (구간 없음)
    """
    n = len(data)
    if n < 3:
        return None

    # 인접 원소 간 동일성 배열 생성
    is_same = np.zeros(n - 1, dtype=bool)
    for i in range(n - 1):
        if tolerance == 0:
            is_same[i] = np.array_equal(data[i], data[i + 1])
        else:
            diff = np.abs(data[i].astype(int) - data[i + 1].astype(int))
            is_same[i] = np.max(diff) <= tolerance

    # 최장 True 연속 구간 탐색
    max_start = 0
    max_length = 0
    current_start = 0
    current_length = 0

    for i in range(len(is_same)):
        if is_same[i]:
            if current_length == 0:
                current_start = i
            current_length += 1
        else:
            if current_length > max_length:
                max_length = current_length
                max_start = current_start
            current_length = 0

    # 마지막 구간 체크
    if current_length > max_length:
        max_length = current_length
        max_start = current_start

    if max_length == 0:
        return None

    # is_same[i] = True → data[i]와 data[i+1]이 같음
    # 구간: data[max_start] ~ data[max_start + max_length] (inclusive)
    return (max_start, max_start + max_length)


def detect_9slice(image_path: str, tolerance: int = 0,
                  min_border_pct: float = 0.0,
                  symmetry: bool = False) -> dict:
    """
    이미지에서 9-slice border 값 자동 감지.

    Args:
        image_path: PNG 이미지 경로
        tolerance: 픽셀 비교 허용 오차 (0=완전일치, 1-10=그라디언트 허용)
        min_border_pct: 최소 border 크기 (이미지 대비 %, 0.0~0.5)
        symmetry: True면 좌우/상하 border를 대칭으로 맞춤

    Returns:
        dict: {
            'file': str,
            'width': int,
            'height': int,
            'slice': {'top': int, 'right': int, 'bottom': int, 'left': int},
            'stretch_region': {'x': [start, end], 'y': [start, end]},
            'confidence': float,  # 0.0 ~ 1.0
            'suitable': bool,     # 9-slice 적합 여부
            'warnings': list
        }
    """
    img = Image.open(image_path).convert('RGBA')
    pixels = np.array(img)  # shape: (H, W, 4)
    h, w = pixels.shape[:2]

    result = {
        'file': str(image_path),
        'width': w,
        'height': h,
        'slice': {'top': 0, 'right': 0, 'bottom': 0, 'left': 0},
        'stretch_region': {'x': [0, 0], 'y': [0, 0]},
        'confidence': 0.0,
        'suitable': False,
        'warnings': []
    }

    # 너무 작은 이미지
    if w < 4 or h < 4:
        result['warnings'].append(f'이미지가 너무 작음 ({w}x{h})')
        return result

    # Phase 1: 픽셀 정규화
    normalized = normalize_pixels(pixels)

    # Phase 2: 열(Column) 분석 → 좌/우 border
    # columns: shape (W, H, 4) — 각 열은 (H, 4) 배열
    columns = normalized.transpose(1, 0, 2)  # (W, H, 4)
    col_run = find_longest_identical_run(columns, tolerance)

    # Phase 3: 행(Row) 분석 → 상/하 border
    # rows: shape (H, W, 4) — 각 행은 (W, 4) 배열
    rows = normalized  # 이미 (H, W, 4)
    row_run = find_longest_identical_run(rows, tolerance)

    # Phase 4: Border 계산
    warnings = []

    if col_run is None:
        # 열 방향 stretch 영역 못찾음 → 중앙 기본값
        left = w // 3
        right = w // 3
        stretch_x = [left, w - right - 1]
        warnings.append('열 방향 stretch 영역 자동 감지 실패 → 1/3 기본값 사용')
        x_confidence = 0.3
    else:
        left = col_run[0]
        right = w - col_run[1] - 1
        stretch_x = [col_run[0], col_run[1]]
        # 신뢰도: stretch 영역이 넓을수록 높음
        stretch_w = col_run[1] - col_run[0]
        x_confidence = min(1.0, stretch_w / (w * 0.3))

    if row_run is None:
        top = h // 3
        bottom = h // 3
        stretch_y = [top, h - bottom - 1]
        warnings.append('행 방향 stretch 영역 자동 감지 실패 → 1/3 기본값 사용')
        y_confidence = 0.3
    else:
        top = row_run[0]
        bottom = h - row_run[1] - 1
        stretch_y = [row_run[0], row_run[1]]
        stretch_h = row_run[1] - row_run[0]
        y_confidence = min(1.0, stretch_h / (h * 0.3))

    # Phase 5: 최소 border 보장
    min_border_x = max(1, int(w * min_border_pct))
    min_border_y = max(1, int(h * min_border_pct))

    if left < min_border_x:
        left = min_border_x
        warnings.append(f'left border를 최소값({min_border_x}px)으로 조정')
    if right < min_border_x:
        right = min_border_x
        warnings.append(f'right border를 최소값({min_border_x}px)으로 조정')
    if top < min_border_y:
        top = min_border_y
        warnings.append(f'top border를 최소값({min_border_y}px)으로 조정')
    if bottom < min_border_y:
        bottom = min_border_y
        warnings.append(f'bottom border를 최소값({min_border_y}px)으로 조정')

    # Phase 6: 대칭 보정
    if symmetry:
        lr = max(left, right)
        tb = max(top, bottom)
        left = right = lr
        top = bottom = tb

    # Phase 7: 유효성 검증
    stretch_area_w = w - left - right
    stretch_area_h = h - top - bottom

    if stretch_area_w < 1 or stretch_area_h < 1:
        warnings.append('border 합이 이미지 크기를 초과 → 9-slice 불가')
        result['warnings'] = warnings
        return result

    stretch_ratio = (stretch_area_w * stretch_area_h) / (w * h)
    if stretch_ratio < 0.05:
        warnings.append(f'stretch 영역이 매우 작음 ({stretch_ratio:.1%}) → 9-slice 부적합 가능')

    # border가 50% 초과 경고
    if left > w * 0.5:
        warnings.append(f'left border({left}px)가 이미지 폭의 50% 초과')
    if top > h * 0.5:
        warnings.append(f'top border({top}px)가 이미지 높이의 50% 초과')

    # 결과
    confidence = (x_confidence + y_confidence) / 2
    suitable = confidence > 0.4 and stretch_area_w >= 2 and stretch_area_h >= 2

    result.update({
        'slice': {'top': top, 'right': right, 'bottom': bottom, 'left': left},
        'stretch_region': {'x': list(stretch_x), 'y': list(stretch_y)},
        'confidence': round(confidence, 3),
        'suitable': suitable,
        'warnings': warnings
    })

    return result


# ─────────────────────────────────────────────────
# Output Formatters
# ─────────────────────────────────────────────────

def format_human(result: dict) -> str:
    """사람이 읽기 쉬운 출력."""
    s = result['slice']
    lines = [
        f"📐 {result['file']}",
        f"   크기: {result['width']}×{result['height']}",
        f"   slice: top={s['top']}  right={s['right']}  bottom={s['bottom']}  left={s['left']}",
        f"   stretch: x=[{result['stretch_region']['x'][0]}..{result['stretch_region']['x'][1]}]"
        f"  y=[{result['stretch_region']['y'][0]}..{result['stretch_region']['y'][1]}]",
        f"   신뢰도: {result['confidence']:.0%}",
        f"   적합: {'✅' if result['suitable'] else '❌'}",
    ]
    if result['warnings']:
        lines.append(f"   ⚠️  {', '.join(result['warnings'])}")
    return '\n'.join(lines)


def format_css(result: dict, relative_path: str = None) -> str:
    """CSS border-image 코드 생성."""
    s = result['slice']
    path = relative_path or os.path.basename(result['file'])
    return (
        f"/* {path} ({result['width']}×{result['height']}) */\n"
        f".nine-slice-{Path(path).stem.replace(' ', '-').replace('.', '-').lower()} {{\n"
        f"  border-image-source: url('{path}');\n"
        f"  border-image-slice: {s['top']} {s['right']} {s['bottom']} {s['left']};\n"
        f"  border-image-width: {s['top']}px {s['right']}px {s['bottom']}px {s['left']}px;\n"
        f"  border-image-repeat: stretch;\n"
        f"  border-style: solid;\n"
        f"  border-color: transparent;\n"
        f"}}"
    )


def format_godot(result: dict) -> str:
    """Godot NinePatchRect 설정값."""
    s = result['slice']
    name = Path(result['file']).stem
    return (
        f"# {name} ({result['width']}×{result['height']})\n"
        f"# [node name=\"{name}\" type=\"NinePatchRect\"]\n"
        f"patch_margin_left = {s['left']}\n"
        f"patch_margin_top = {s['top']}\n"
        f"patch_margin_right = {s['right']}\n"
        f"patch_margin_bottom = {s['bottom']}"
    )


def format_unity(result: dict) -> str:
    """Unity spriteBorder 값 (L, B, R, T 순서)."""
    s = result['slice']
    return (
        f"// {Path(result['file']).stem}\n"
        f"spriteBorder = new Vector4({s['left']}, {s['bottom']}, {s['right']}, {s['top']});"
    )


# ─────────────────────────────────────────────────
# Batch Processing
# ─────────────────────────────────────────────────

def find_images(directory: str, recursive: bool = False) -> list:
    """디렉토리에서 PNG 이미지 탐색."""
    directory = Path(directory)
    pattern = '**/*.png' if recursive else '*.png'
    images = sorted(directory.glob(pattern))
    # .9.png (Android 9-patch 마커 이미지) 제외
    return [p for p in images if not str(p).endswith('.9.png')]


def batch_process(directory: str, recursive: bool = False,
                  tolerance: int = 0, **kwargs) -> list:
    """디렉토리 내 모든 PNG를 일괄 처리."""
    images = find_images(directory, recursive)
    results = []
    for img_path in images:
        try:
            result = detect_9slice(str(img_path), tolerance=tolerance, **kwargs)
            results.append(result)
        except Exception as e:
            results.append({
                'file': str(img_path),
                'error': str(e),
                'suitable': False
            })
    return results


# ─────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='9-Slice Border 자동 감지 도구',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예제:
  %(prog)s button.png                          # 단일 이미지
  %(prog)s --dir gui/ --recursive              # 디렉토리 일괄
  %(prog)s button.png --format css             # CSS 출력
  %(prog)s --dir gui/ --format json -o out.json  # JSON 저장
  %(prog)s button.png --tolerance 5            # 그라디언트 허용
        """
    )

    # 입력
    parser.add_argument('image', nargs='?', help='분석할 PNG 이미지 경로')
    parser.add_argument('--dir', '-d', help='일괄 처리할 디렉토리')
    parser.add_argument('--recursive', '-r', action='store_true',
                        help='하위 디렉토리 포함')

    # 알고리즘 옵션
    parser.add_argument('--tolerance', '-t', type=int, default=0,
                        help='픽셀 비교 허용 오차 (0=완전일치, 1-10 권장)')
    parser.add_argument('--min-border', type=float, default=0.0,
                        help='최소 border 크기 (이미지 대비 비율, 0.0~0.5)')
    parser.add_argument('--symmetry', '-s', action='store_true',
                        help='좌우/상하 border 대칭 강제')

    # 출력
    parser.add_argument('--format', '-f',
                        choices=['human', 'css', 'godot', 'unity', 'json'],
                        default='human', help='출력 포맷')
    parser.add_argument('--output', '-o', help='결과 파일 저장 경로')
    parser.add_argument('--suitable-only', action='store_true',
                        help='9-slice 적합 이미지만 출력')

    args = parser.parse_args()

    if not args.image and not args.dir:
        parser.print_help()
        sys.exit(1)

    # 처리
    kwargs = {
        'tolerance': args.tolerance,
        'min_border_pct': args.min_border,
        'symmetry': args.symmetry,
    }

    if args.dir:
        results = batch_process(args.dir, args.recursive, **kwargs)
    else:
        results = [detect_9slice(args.image, **kwargs)]

    # 필터
    if args.suitable_only:
        results = [r for r in results if r.get('suitable', False)]

    # 포맷팅
    formatters = {
        'human': format_human,
        'css': format_css,
        'godot': format_godot,
        'unity': format_unity,
    }

    if args.format == 'json':
        output = json.dumps(results, indent=2, ensure_ascii=False)
    else:
        formatter = formatters[args.format]
        output = '\n\n'.join(formatter(r) for r in results)

    # 출력
    if args.output:
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"✅ {len(results)}개 결과 → {args.output}")
    else:
        print(output)

    # 요약 (human 포맷 + 배치 모드일 때)
    if args.format == 'human' and len(results) > 1:
        suitable = sum(1 for r in results if r.get('suitable', False))
        print(f"\n{'='*50}")
        print(f"📊 총 {len(results)}개 | 적합: {suitable} | 부적합: {len(results)-suitable}")


if __name__ == '__main__':
    main()
