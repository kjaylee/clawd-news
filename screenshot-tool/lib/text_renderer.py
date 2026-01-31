"""Multi-language text renderer with auto-sizing."""

import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

from .config import FontDef


# Font cache to avoid reloading
_font_cache: dict[tuple, ImageFont.FreeTypeFont] = {}


def get_font(font_def: FontDef, size: int) -> ImageFont.FreeTypeFont:
    """Load a font from cache or disk."""
    cache_key = (font_def.path, font_def.index, size)
    if cache_key not in _font_cache:
        if not os.path.exists(font_def.path):
            # Fallback to default
            _font_cache[cache_key] = ImageFont.load_default().font_variant(size=size)
        else:
            _font_cache[cache_key] = ImageFont.truetype(
                font_def.path, size, index=font_def.index
            )
    return _font_cache[cache_key]


def measure_text(font: ImageFont.FreeTypeFont, text: str) -> tuple[int, int]:
    """Measure text dimensions."""
    bbox = font.getbbox(text)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def auto_fit_font(
    font_def: FontDef,
    text: str,
    max_width: int,
    target_size: int,
    min_size: int = None,
) -> ImageFont.FreeTypeFont:
    """
    Find the largest font size that fits text within max_width.
    Starts from target_size and shrinks down to min_size.
    """
    if min_size is None:
        min_size = max(int(target_size * 0.5), 16)

    size = target_size
    while size >= min_size:
        font = get_font(font_def, size)
        w, _ = measure_text(font, text)
        if w <= max_width:
            return font
        size -= 2

    return get_font(font_def, min_size)


def wrap_text(
    font: ImageFont.FreeTypeFont,
    text: str,
    max_width: int,
) -> list[str]:
    """Wrap text to fit within max_width."""
    words = text.split()
    if not words:
        return [text]

    lines = []
    current_line = words[0]

    for word in words[1:]:
        test_line = f"{current_line} {word}"
        w, _ = measure_text(font, test_line)
        if w <= max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word

    lines.append(current_line)

    # For CJK text that might not have spaces, try character-level wrapping
    if len(lines) == 1 and measure_text(font, lines[0])[0] > max_width:
        text = lines[0]
        lines = []
        current = ""
        for char in text:
            test = current + char
            w, _ = measure_text(font, test)
            if w <= max_width:
                current = test
            else:
                if current:
                    lines.append(current)
                current = char
        if current:
            lines.append(current)

    return lines


def render_text_block(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    color: str | tuple,
    x_center: int,
    y_start: int,
    max_width: int,
    line_spacing: float = 1.4,
) -> int:
    """
    Render a text block centered at x_center, starting at y_start.
    Returns the y position after the last line.
    """
    if isinstance(color, str):
        from .background import hex_to_rgb
        color = hex_to_rgb(color)

    lines = wrap_text(font, text, max_width)
    y = y_start

    for line in lines:
        w, h = measure_text(font, line)
        x = x_center - w // 2
        draw.text((x, y), line, fill=color, font=font)
        y += int(h * line_spacing)

    return y


def render_headline_subheadline(
    canvas: Image.Image,
    headline: str,
    subheadline: str,
    headline_font_def: FontDef,
    subheadline_font_def: FontDef,
    headline_size: int,
    subheadline_size: int,
    headline_color: str,
    subheadline_color: str,
    y_start: int,
    max_width: int,
    x_center: int = None,
    gap: int = None,
) -> int:
    """
    Render headline + subheadline text block.
    Returns y position after the subheadline.
    """
    if x_center is None:
        x_center = canvas.width // 2
    if gap is None:
        gap = int(headline_size * 0.5)

    draw = ImageDraw.Draw(canvas)

    # Auto-fit headline
    h_font = auto_fit_font(headline_font_def, headline, max_width, headline_size)
    y = render_text_block(draw, headline, h_font, headline_color, x_center, y_start, max_width)

    # Add gap
    y += gap

    # Auto-fit subheadline
    s_font = auto_fit_font(subheadline_font_def, subheadline, max_width, subheadline_size)
    y = render_text_block(draw, subheadline, s_font, subheadline_color, x_center, y, max_width)

    return y
