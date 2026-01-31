"""Image composer — orchestrates background + screenshot + frame + text.

v2: HTML+Playwright pipeline (high quality, CSS-rendered)
v1: PIL pipeline (fallback if Playwright unavailable)
"""

from PIL import Image

from .background import create_background
from .frame_renderer import create_device_frame, add_drop_shadow
from .text_renderer import (
    render_headline_subheadline,
    FontDef,
)
from .config import DeviceConfig


# ─── Playwright availability flag ───────────────────────────────────────────

_PLAYWRIGHT_AVAILABLE: bool | None = None


def _check_playwright() -> bool:
    """Check if Playwright + Jinja2 are available (cached)."""
    global _PLAYWRIGHT_AVAILABLE
    if _PLAYWRIGHT_AVAILABLE is not None:
        return _PLAYWRIGHT_AVAILABLE
    try:
        from . import renderer  # noqa: F401
        _PLAYWRIGHT_AVAILABLE = True
    except ImportError:
        _PLAYWRIGHT_AVAILABLE = False
    return _PLAYWRIGHT_AVAILABLE


def compose_screenshot(
    canvas_width: int,
    canvas_height: int,
    screenshot_path: str,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """
    Compose a single App Store screenshot.

    v2 (Playwright): HTML/CSS rendering → pixel-perfect vector text, smooth
    gradients, CSS shadows. Used when playwright + jinja2 are installed.

    v1 (PIL fallback): Bitmap rendering pipeline. Used when Playwright
    is not available.

    Returns:
        PIL Image in RGB mode at canvas_width × canvas_height
    """
    # ── Try Playwright pipeline first ──
    if _check_playwright():
        try:
            from .renderer import render_screenshot
            return render_screenshot(
                canvas_width=canvas_width,
                canvas_height=canvas_height,
                screenshot_path=screenshot_path,
                headline=headline,
                subheadline=subheadline,
                style=style,
                device=device,
                lang=lang,
            )
        except Exception as e:
            import sys
            print(f"⚠️  Playwright render failed, falling back to PIL: {e}", file=sys.stderr)

    # ── PIL fallback ──
    return _compose_pil(
        canvas_width, canvas_height,
        screenshot_path, headline, subheadline,
        style, device, fonts, lang,
    )


def _compose_pil(
    canvas_width: int,
    canvas_height: int,
    screenshot_path: str,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """PIL-based composition pipeline (v1 fallback)."""
    layout = style.get('layout', 'center-top-text')

    # 1. Create background
    bg_config = style.get('background', {'type': 'solid', 'color': '#000000'})
    canvas = create_background(canvas_width, canvas_height, bg_config)

    # 2. Load screenshot
    try:
        ss = Image.open(screenshot_path).convert('RGB')
    except Exception as e:
        # Create placeholder if screenshot not found
        ss = _create_placeholder(400, 800, f"Missing:\n{screenshot_path}")

    # Route to layout handler
    if layout == 'center-top-text':
        return _layout_center_top_text(
            canvas, ss, headline, subheadline, style, device, fonts, lang
        )
    elif layout == 'full-bleed':
        return _layout_full_bleed(
            canvas, ss, headline, subheadline, style, device, fonts, lang
        )
    elif layout == 'feature-highlight':
        return _layout_feature_highlight(
            canvas, ss, headline, subheadline, style, device, fonts, lang
        )
    elif layout == 'text-only':
        return _layout_text_only(
            canvas, ss, headline, subheadline, style, device, fonts, lang
        )
    elif layout == 'dark-premium':
        return _layout_dark_premium(
            canvas, ss, headline, subheadline, style, device, fonts, lang
        )
    else:
        # Default to center-top-text
        return _layout_center_top_text(
            canvas, ss, headline, subheadline, style, device, fonts, lang
        )


def _get_font_defs(fonts: dict, lang: str) -> tuple[FontDef, FontDef]:
    """Get headline (bold) and subheadline (regular/semibold) font defs."""
    lang_fonts = fonts.get(lang, fonts.get('default', {}))
    
    headline_def = lang_fonts.get('bold', FontDef('/System/Library/Fonts/HelveticaNeue.ttc', 1))
    sub_def = lang_fonts.get('semibold', lang_fonts.get('regular',
        FontDef('/System/Library/Fonts/HelveticaNeue.ttc', 0)))
    
    return headline_def, sub_def


def _resize_screenshot_for_device(ss: Image.Image, device: DeviceConfig, scale: float) -> Image.Image:
    """Resize screenshot to fit within the device frame area."""
    target_w = int(device.width * scale)
    target_h = int(device.height * scale)
    
    # Maintain aspect ratio
    ss_ratio = ss.width / ss.height
    target_ratio = target_w / target_h
    
    if ss_ratio > target_ratio:
        # Screenshot is wider — fit by width
        new_w = target_w
        new_h = int(target_w / ss_ratio)
    else:
        # Screenshot is taller — fit by height
        new_h = target_h
        new_w = int(target_h * ss_ratio)
    
    return ss.resize((new_w, new_h), Image.Resampling.LANCZOS)


def _layout_center_top_text(
    canvas: Image.Image,
    screenshot: Image.Image,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """
    Layout: Text on top (25-30%), device screenshot centered below (70-75%).
    Most popular pattern.
    """
    cw, ch = canvas.size
    text_cfg = style.get('text', {})
    ss_cfg = style.get('screenshot', {})
    frame_cfg = style.get('frame', {})

    # Text sizing
    h_size = int(ch * text_cfg.get('headline', {}).get('size_ratio', 0.04))
    s_size = int(ch * text_cfg.get('subheadline', {}).get('size_ratio', 0.025))
    h_color = text_cfg.get('headline', {}).get('color', '#FFFFFF')
    s_color = text_cfg.get('subheadline', {}).get('color', '#CCCCCC')

    # Screenshot sizing
    scale = ss_cfg.get('scale', 0.65)
    ss_corner = ss_cfg.get('corner_radius', device.corner_radius)

    # Resize screenshot
    ss_resized = _resize_screenshot_for_device(screenshot, device, scale)

    # Apply frame
    show_frame = frame_cfg.get('show', True)
    framed = create_device_frame(
        ss_resized,
        corner_radius=int(ss_corner * scale),
        bezel_width=int(device.bezel_width * scale) if show_frame else 0,
        bezel_color=frame_cfg.get('color', device.bezel_color),
        show_frame=show_frame,
    )

    # Add shadow
    if frame_cfg.get('shadow', True):
        shadow_blur = int(ch * 0.012)
        framed_with_shadow, expand = add_drop_shadow(
            framed,
            shadow_offset=(0, int(ch * 0.005)),
            shadow_blur=shadow_blur,
            shadow_opacity=0.35,
        )
    else:
        framed_with_shadow = framed
        expand = 0

    # Layout calculation
    text_area_ratio = 0.28
    text_area_h = int(ch * text_area_ratio)
    text_y_start = int(ch * 0.08)
    text_max_w = int(cw * 0.85)

    # Render text
    h_font_def, s_font_def = _get_font_defs(fonts, lang)
    text_bottom = render_headline_subheadline(
        canvas, headline, subheadline,
        h_font_def, s_font_def,
        h_size, s_size, h_color, s_color,
        y_start=text_y_start,
        max_width=text_max_w,
    )

    # Place framed screenshot
    fw, fh = framed_with_shadow.size
    ss_x = (cw - fw) // 2
    ss_y = ch - fh + expand  # Align to bottom, allowing slight overflow

    # Ensure it doesn't overlap text too much
    min_ss_y = text_bottom + int(ch * 0.02)
    if ss_y < min_ss_y:
        ss_y = min_ss_y

    canvas.paste(framed_with_shadow, (ss_x, ss_y), framed_with_shadow)

    return canvas


def _layout_full_bleed(
    canvas: Image.Image,
    screenshot: Image.Image,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """
    Layout: Full-screen screenshot with optional text overlay at top.
    Good for games and media apps.
    """
    cw, ch = canvas.size
    text_cfg = style.get('text', {})

    # Resize screenshot to fill canvas
    ss = screenshot.resize((cw, ch), Image.Resampling.LANCZOS)
    canvas.paste(ss, (0, 0))

    # Optional text overlay with semi-transparent background
    if headline:
        h_size = int(ch * text_cfg.get('headline', {}).get('size_ratio', 0.045))
        s_size = int(ch * text_cfg.get('subheadline', {}).get('size_ratio', 0.028))
        h_color = text_cfg.get('headline', {}).get('color', '#FFFFFF')
        s_color = text_cfg.get('subheadline', {}).get('color', '#EEEEEE')

        # Draw semi-transparent overlay at top
        from PIL import ImageDraw
        overlay = Image.new('RGBA', (cw, int(ch * 0.22)), (0, 0, 0, 140))
        canvas_rgba = canvas.convert('RGBA')
        canvas_rgba.paste(overlay, (0, 0), overlay)
        canvas = canvas_rgba.convert('RGB')

        h_font_def, s_font_def = _get_font_defs(fonts, lang)
        render_headline_subheadline(
            canvas, headline, subheadline,
            h_font_def, s_font_def,
            h_size, s_size, h_color, s_color,
            y_start=int(ch * 0.04),
            max_width=int(cw * 0.9),
        )

    return canvas


def _layout_feature_highlight(
    canvas: Image.Image,
    screenshot: Image.Image,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """
    Layout: Emoji/icon + headline + subheadline + smaller screenshot below.
    Good for feature-specific screens.
    """
    cw, ch = canvas.size
    text_cfg = style.get('text', {})
    ss_cfg = style.get('screenshot', {})
    frame_cfg = style.get('frame', {})

    h_size = int(ch * text_cfg.get('headline', {}).get('size_ratio', 0.042))
    s_size = int(ch * text_cfg.get('subheadline', {}).get('size_ratio', 0.026))
    h_color = text_cfg.get('headline', {}).get('color', '#FFFFFF')
    s_color = text_cfg.get('subheadline', {}).get('color', '#CCCCCC')

    # Text at top with more space
    h_font_def, s_font_def = _get_font_defs(fonts, lang)
    text_bottom = render_headline_subheadline(
        canvas, headline, subheadline,
        h_font_def, s_font_def,
        h_size, s_size, h_color, s_color,
        y_start=int(ch * 0.10),
        max_width=int(cw * 0.85),
    )

    # Smaller screenshot below
    scale = ss_cfg.get('scale', 0.55)
    ss_resized = _resize_screenshot_for_device(screenshot, device, scale)
    
    show_frame = frame_cfg.get('show', True)
    framed = create_device_frame(
        ss_resized,
        corner_radius=int(device.corner_radius * scale),
        bezel_width=int(device.bezel_width * scale) if show_frame else 0,
        bezel_color=frame_cfg.get('color', device.bezel_color),
        show_frame=show_frame,
    )

    if frame_cfg.get('shadow', True):
        framed, expand = add_drop_shadow(framed, shadow_blur=int(ch * 0.01), shadow_opacity=0.3)
    else:
        expand = 0

    fw, fh = framed.size
    ss_x = (cw - fw) // 2
    ss_y = text_bottom + int(ch * 0.04)

    canvas.paste(framed, (ss_x, ss_y), framed)
    return canvas


def _layout_text_only(
    canvas: Image.Image,
    screenshot: Image.Image,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """
    Layout: Text-centered, minimal. Small or no screenshot.
    Good for premium/wellness apps, social proof screens.
    """
    cw, ch = canvas.size
    text_cfg = style.get('text', {})

    h_size = int(ch * text_cfg.get('headline', {}).get('size_ratio', 0.055))
    s_size = int(ch * text_cfg.get('subheadline', {}).get('size_ratio', 0.03))
    h_color = text_cfg.get('headline', {}).get('color', '#FFFFFF')
    s_color = text_cfg.get('subheadline', {}).get('color', '#CCCCCC')

    h_font_def, s_font_def = _get_font_defs(fonts, lang)
    render_headline_subheadline(
        canvas, headline, subheadline,
        h_font_def, s_font_def,
        h_size, s_size, h_color, s_color,
        y_start=int(ch * 0.35),
        max_width=int(cw * 0.8),
    )

    return canvas


def _layout_dark_premium(
    canvas: Image.Image,
    screenshot: Image.Image,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    fonts: dict,
    lang: str,
) -> Image.Image:
    """
    Layout: Dark background, white text, framed screenshot.
    Premium/modern feel.
    """
    # Force dark background
    from .background import create_solid_background, hex_to_rgb
    bg_config = style.get('background', {})
    if bg_config.get('type') == 'gradient':
        from .background import create_gradient_background
        canvas = create_gradient_background(
            canvas.width, canvas.height,
            bg_config.get('colors', ['#0D0D0D', '#1A1A2E']),
            bg_config.get('angle', 180),
        )
    else:
        canvas = create_solid_background(
            canvas.width, canvas.height,
            bg_config.get('color', '#0D0D0D'),
        )

    # Same as center-top-text but with forced white text
    text_cfg = style.get('text', {})
    text_cfg.setdefault('headline', {})['color'] = '#FFFFFF'
    text_cfg.setdefault('subheadline', {})['color'] = '#AAAAAA'
    style['text'] = text_cfg

    return _layout_center_top_text(
        canvas, screenshot, headline, subheadline, style, device, fonts, lang
    )


def _create_placeholder(width: int, height: int, text: str = "Placeholder") -> Image.Image:
    """Create a placeholder screenshot image."""
    from PIL import ImageDraw
    img = Image.new('RGB', (width, height), (80, 80, 120))
    draw = ImageDraw.Draw(img)
    # Draw crosshair
    draw.line([(0, 0), (width, height)], fill=(120, 120, 160), width=2)
    draw.line([(width, 0), (0, height)], fill=(120, 120, 160), width=2)
    # Draw text
    try:
        font = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 24, index=0)
    except:
        font = ImageFont.load_default()
    for i, line in enumerate(text.split('\n')):
        draw.text((20, 20 + i * 30), line, fill=(200, 200, 220), font=font)
    return img
