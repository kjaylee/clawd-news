"""Background generation: solid colors and gradients (optimized with Pillow-native ops)."""

import math
from PIL import Image, ImageDraw


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color string to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def interpolate_color(c1: tuple, c2: tuple, t: float) -> tuple[int, int, int]:
    """Linearly interpolate between two RGB colors."""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def create_solid_background(width: int, height: int, color) -> Image.Image:
    """Create a solid color background."""
    rgb = hex_to_rgb(color) if isinstance(color, str) else color
    return Image.new('RGB', (width, height), rgb)


def _create_gradient_strip(length: int, colors: list[tuple]) -> Image.Image:
    """Create a 1px wide vertical gradient strip."""
    strip = Image.new('RGB', (1, length))
    pixels = strip.load()
    num_segments = len(colors) - 1

    for y in range(length):
        t = y / max(length - 1, 1)
        seg_t = t * num_segments
        seg_idx = min(int(seg_t), num_segments - 1)
        local_t = seg_t - seg_idx
        c = interpolate_color(colors[seg_idx], colors[seg_idx + 1], local_t)
        pixels[0, y] = c

    return strip


def create_gradient_background(
    width: int,
    height: int,
    colors: list[str],
    angle: float = 0
) -> Image.Image:
    """
    Create a linear gradient background using Pillow-native operations.
    
    Strategy: Create a 1px gradient strip → resize to fill → rotate → crop.
    All heavy ops are in Pillow's C layer, so this is fast even for large images.
    """
    if len(colors) < 2:
        return create_solid_background(width, height, colors[0])

    rgb_colors = [hex_to_rgb(c) for c in colors]

    # For 0 degree (top-to-bottom): simple vertical stretch
    # For 90 degree (left-to-right): horizontal stretch  
    # For arbitrary: create oversized, rotate, crop

    # Normalize angle to 0-360
    angle = angle % 360

    # Calculate diagonal for rotation
    diag = int(math.sqrt(width * width + height * height)) + 4

    # Create 1px wide gradient strip (vertical: top to bottom)
    strip = _create_gradient_strip(diag, rgb_colors)

    # Stretch horizontally to square
    gradient = strip.resize((diag, diag), Image.Resampling.NEAREST)

    # Rotate (angle 0 = top-to-bottom, 90 = left-to-right, etc.)
    if angle != 0:
        gradient = gradient.rotate(-angle, expand=False, resample=Image.Resampling.BILINEAR)

    # Crop center to target size
    cx, cy = gradient.width // 2, gradient.height // 2
    left = cx - width // 2
    top = cy - height // 2
    result = gradient.crop((left, top, left + width, top + height))

    return result


def create_background(width: int, height: int, bg_config: dict) -> Image.Image:
    """
    Create a background based on configuration.
    """
    bg_type = bg_config.get('type', 'solid')

    if bg_type == 'solid':
        color = bg_config.get('color', '#000000')
        return create_solid_background(width, height, color)

    elif bg_type == 'gradient':
        colors = bg_config.get('colors', ['#000000', '#333333'])
        angle = bg_config.get('angle', 0)
        return create_gradient_background(width, height, colors, angle)

    elif bg_type == 'image':
        image_path = bg_config.get('path', '')
        if image_path and image_path.strip():
            try:
                bg = Image.open(image_path).convert('RGB')
                bg = bg.resize((width, height), Image.Resampling.LANCZOS)
                return bg
            except Exception:
                pass
        return create_solid_background(width, height, '#000000')

    else:
        return create_solid_background(width, height, '#000000')
