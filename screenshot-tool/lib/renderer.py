"""
HTML + Playwright Screenshot Renderer (v2)

Renders App Store screenshots using HTML/CSS templates + Playwright.
Replaces the PIL-based pipeline for superior quality:
  - Vector text rendering (CSS fonts, subpixel AA)
  - Smooth CSS gradients (no banding)
  - Clean CSS box-shadow (smooth, anti-aliased)
  - CSS border-radius (perfect curves)
  - @2x deviceScaleFactor for retina-quality output
"""

import atexit
import base64
import html as html_module
import math
import os
from io import BytesIO
from typing import Optional

from PIL import Image
from jinja2 import Environment, FileSystemLoader

from .config import DeviceConfig


# ─── Constants ──────────────────────────────────────────────────────────────

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'html_templates')

# CSS font families per language (works on macOS + Linux)
FONT_FAMILIES = {
    'ko': '"Noto Sans CJK KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    'ja': '"Noto Sans CJK JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
    'en': '"Inter", "SF Pro Display", "Helvetica Neue", "Noto Sans", sans-serif',
    'zh': '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    'default': '"Inter", "SF Pro Display", "Helvetica Neue", "Noto Sans", sans-serif',
}


# ─── Jinja2 Environment ────────────────────────────────────────────────────

_jinja_env: Optional[Environment] = None


def _get_jinja_env() -> Environment:
    global _jinja_env
    if _jinja_env is None:
        _jinja_env = Environment(
            loader=FileSystemLoader(TEMPLATE_DIR),
            autoescape=False,  # CSS values break with autoescaping
        )
    return _jinja_env


# ─── Playwright Renderer (Singleton) ───────────────────────────────────────

class PlaywrightRenderer:
    """
    Manages a persistent Playwright Chromium browser instance.
    Renders HTML to PNG screenshots at 2x device scale.
    Thread-safe for sequential use (one page at a time).
    """

    _instance: Optional['PlaywrightRenderer'] = None

    @classmethod
    def get_instance(cls) -> 'PlaywrightRenderer':
        if cls._instance is None:
            cls._instance = cls()
            atexit.register(cls._instance.close)
        return cls._instance

    def __init__(self):
        from playwright.sync_api import sync_playwright
        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--font-render-hinting=none',
            ],
        )
        self._alive = True

    def render(
        self,
        html_content: str,
        viewport_w: int,
        viewport_h: int,
        target_w: int,
        target_h: int,
        scale: int = 2,
    ) -> Image.Image:
        """
        Render HTML string to a PIL Image.

        Args:
            html_content: Complete HTML document string
            viewport_w: CSS viewport width (pixels)
            viewport_h: CSS viewport height (pixels)
            target_w: Target output width (= viewport_w * scale)
            target_h: Target output height (= viewport_h * scale)
            scale: Device scale factor (default 2 for retina)

        Returns:
            PIL Image in RGB mode at exact target dimensions
        """
        if not self._alive:
            raise RuntimeError("PlaywrightRenderer has been closed")

        context = self._browser.new_context(
            viewport={'width': viewport_w, 'height': viewport_h},
            device_scale_factor=scale,
        )
        page = context.new_page()

        try:
            page.set_content(html_content, wait_until='load')

            # Wait for all images to finish decoding
            page.evaluate('''() => {
                return Promise.all(
                    [...document.querySelectorAll('img')].map(img => {
                        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
                        return new Promise(resolve => {
                            img.onload = resolve;
                            img.onerror = resolve;
                            setTimeout(resolve, 3000);
                        });
                    })
                );
            }''')

            png_bytes = page.screenshot(type='png')
        finally:
            page.close()
            context.close()

        img = Image.open(BytesIO(png_bytes))

        # Crop to exact target dimensions (handles ceil rounding for odd widths)
        if img.size != (target_w, target_h):
            crop_w = min(img.width, target_w)
            crop_h = min(img.height, target_h)
            img = img.crop((0, 0, crop_w, crop_h))

            # Pad if somehow smaller
            if img.size != (target_w, target_h):
                padded = Image.new('RGB', (target_w, target_h), (0, 0, 0))
                padded.paste(img, (0, 0))
                img = padded

        return img.convert('RGB')

    def close(self):
        self._alive = False
        try:
            if self._browser:
                self._browser.close()
        except Exception:
            pass
        try:
            if self._pw:
                self._pw.stop()
        except Exception:
            pass
        PlaywrightRenderer._instance = None


# ─── Public API ─────────────────────────────────────────────────────────────

def render_screenshot(
    canvas_width: int,
    canvas_height: int,
    screenshot_path: str,
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    lang: str = 'en',
) -> Image.Image:
    """
    Render a complete App Store screenshot using HTML+CSS+Playwright.

    Pipeline:
      1. Encode screenshot image as base64 data URI
      2. Calculate all layout dimensions from style + device config
      3. Render Jinja2 HTML template
      4. Screenshot with Playwright at 2x scale
      5. Crop to exact device dimensions
      6. Return PIL Image (RGB)

    Args:
        canvas_width: Target width in pixels (e.g., 1290)
        canvas_height: Target height in pixels (e.g., 2796)
        screenshot_path: Path to app screenshot image
        headline: Headline text
        subheadline: Subheadline text
        style: Style configuration dict (layout, background, frame, text, screenshot)
        device: DeviceConfig instance
        lang: Language code ('ko', 'en', 'ja')

    Returns:
        PIL Image in RGB mode at canvas_width × canvas_height
    """
    layout = style.get('layout', 'center-top-text')

    # Viewport = ceil(target/2) for 2x deviceScaleFactor
    vw = math.ceil(canvas_width / 2)
    vh = math.ceil(canvas_height / 2)

    # Encode screenshot as data URI
    ss_data_uri = _image_to_data_uri(screenshot_path)

    # Build template context
    ctx = _build_context(
        layout=layout,
        vw=vw, vh=vh,
        ss_data_uri=ss_data_uri,
        headline=headline,
        subheadline=subheadline,
        style=style,
        device=device,
        lang=lang,
    )

    # Render HTML template
    env = _get_jinja_env()
    template = env.get_template('screenshot.html')
    html_str = template.render(**ctx)

    # Screenshot with Playwright
    renderer = PlaywrightRenderer.get_instance()
    return renderer.render(html_str, vw, vh, canvas_width, canvas_height)


# ─── Internal Helpers ───────────────────────────────────────────────────────

def _image_to_data_uri(path: str) -> Optional[str]:
    """Convert image file to a base64 data URI string."""
    if not path or not os.path.exists(path):
        return None

    ext = os.path.splitext(path)[1].lower()
    mime = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
    }.get(ext, 'image/png')

    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('ascii')

    return f'data:{mime};base64,{b64}'


def _bg_to_css(bg_config: dict) -> str:
    """Convert background config dict to a CSS background property string."""
    bg_type = bg_config.get('type', 'solid')

    if bg_type == 'solid':
        return f"background: {bg_config.get('color', '#000000')};"

    elif bg_type == 'gradient':
        colors = bg_config.get('colors', ['#000000', '#333333'])
        angle = bg_config.get('angle', 0)
        return f"background: linear-gradient({angle}deg, {', '.join(colors)});"

    elif bg_type == 'image':
        path = bg_config.get('path', '')
        data_uri = _image_to_data_uri(path) if path else None
        if data_uri:
            return f"background: url({data_uri}) center/cover no-repeat;"
        return "background: #000000;"

    return "background: #000000;"


def _r(val: float) -> float:
    """Round to 2 decimal places for clean CSS output."""
    return round(val, 2)


def _build_context(
    layout: str,
    vw: int, vh: int,
    ss_data_uri: Optional[str],
    headline: str,
    subheadline: str,
    style: dict,
    device: DeviceConfig,
    lang: str,
) -> dict:
    """
    Compute all values needed by the HTML template.

    All dimensions are in viewport pixels (= target device pixels / 2).
    The 2x deviceScaleFactor handles the pixel doubling.
    """
    text_cfg = style.get('text', {})
    ss_cfg = style.get('screenshot', {})
    frame_cfg = style.get('frame', {})
    bg_config = style.get('background', {'type': 'solid', 'color': '#000000'})

    # ── Fonts ──
    font_family = FONT_FAMILIES.get(lang, FONT_FAMILIES['default'])

    # ── Background ──
    bg_css = _bg_to_css(bg_config)

    # ── Text sizes (viewport px) ──
    h_ratio = text_cfg.get('headline', {}).get('size_ratio', 0.04)
    s_ratio = text_cfg.get('subheadline', {}).get('size_ratio', 0.024)
    headline_size = vh * h_ratio
    subheadline_size = vh * s_ratio
    headline_color = text_cfg.get('headline', {}).get('color', '#FFFFFF')
    subheadline_color = text_cfg.get('subheadline', {}).get('color', '#B0B0CC')
    text_gap = headline_size * 0.45

    # ── Screenshot / Device Frame ──
    default_scale = 0.55 if layout == 'feature-highlight' else 0.62
    scale = ss_cfg.get('scale', default_scale)
    corner_radius = ss_cfg.get('corner_radius', device.corner_radius)

    show_frame = frame_cfg.get('show', True)
    show_shadow = frame_cfg.get('shadow', True)
    bezel_color = frame_cfg.get('color', device.bezel_color)

    # All in viewport px (target px / 2)
    bezel_w = (device.bezel_width * scale) / 2 if show_frame else 0
    inner_r = (corner_radius * scale) / 2
    outer_r = inner_r + bezel_w

    # Screenshot container width as % of viewport
    ss_width_pct = scale * 100

    # ── Shadow (viewport px) ──
    shadow_y = vh * 0.004
    shadow_blur = vh * 0.018
    shadow_opacity = 0.35
    # Second, softer shadow for depth
    shadow_y2 = shadow_y * 0.3
    shadow_blur2 = shadow_blur * 0.3
    shadow_opacity2 = shadow_opacity * 0.6

    # ── Layout positions (viewport px) ──
    # center-top-text / dark-premium
    text_top = vh * 0.08
    device_bottom = vh * -0.015

    # feature-highlight
    fh_text_top = vh * 0.10
    fh_device_top = vh * 0.38
    fh_ss_width_pct = ss_width_pct * 0.88

    # full-bleed
    fb_text_top = vh * 0.04

    # text-only (uses layout-specific larger default)
    to_h_ratio = text_cfg.get('headline', {}).get('size_ratio', 0.055)
    to_s_ratio = text_cfg.get('subheadline', {}).get('size_ratio', 0.03)
    to_headline_size = vh * to_h_ratio
    to_subheadline_size = vh * to_s_ratio
    to_text_gap = to_headline_size * 0.4

    # ── HTML-escape text content ──
    safe_headline = html_module.escape(headline or '')
    safe_subheadline = html_module.escape(subheadline or '')

    return {
        # Layout
        'layout': layout,
        'vw': vw, 'vh': vh,

        # Fonts
        'font_family': font_family,

        # Background
        'bg_css': bg_css,

        # Text (HTML-escaped)
        'headline': safe_headline,
        'subheadline': safe_subheadline,
        'headline_size': _r(headline_size),
        'subheadline_size': _r(subheadline_size),
        'headline_color': headline_color,
        'subheadline_color': subheadline_color,
        'text_gap': _r(text_gap),

        # Screenshot
        'has_screenshot': ss_data_uri is not None,
        'ss_data_uri': ss_data_uri or '',
        'ss_width_pct': _r(ss_width_pct),

        # Device frame
        'show_frame': show_frame,
        'show_shadow': show_shadow,
        'inner_r': _r(inner_r),
        'outer_r': _r(outer_r),
        'bezel_w': _r(bezel_w),
        'bezel_color': bezel_color,

        # Shadow
        'shadow_y': _r(shadow_y),
        'shadow_blur': _r(shadow_blur),
        'shadow_opacity': shadow_opacity,
        'shadow_y2': _r(shadow_y2),
        'shadow_blur2': _r(shadow_blur2),
        'shadow_opacity2': _r(shadow_opacity2),

        # Layout positions
        'text_top': _r(text_top),
        'device_bottom': _r(device_bottom),
        'fh_text_top': _r(fh_text_top),
        'fh_device_top': _r(fh_device_top),
        'fh_ss_width_pct': _r(fh_ss_width_pct),
        'fb_text_top': _r(fb_text_top),
        'to_headline_size': _r(to_headline_size),
        'to_subheadline_size': _r(to_subheadline_size),
        'to_text_gap': _r(to_text_gap),
    }
