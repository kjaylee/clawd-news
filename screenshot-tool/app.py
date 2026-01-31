#!/usr/bin/env python3
"""
App Store Screenshot Generator — Web Service

Usage:
    python3 app.py                  # Start on http://localhost:5000
    python3 app.py --port 8080      # Custom port
    python3 app.py --host 0.0.0.0   # Allow external access
"""

import argparse
import io
import os
import sys
import time
import uuid
import zipfile
import json
import shutil
from pathlib import Path

from flask import (
    Flask, request, jsonify, send_file, render_template,
    send_from_directory, abort
)
from PIL import Image

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib.config import (
    load_devices, load_fonts, load_template, load_locale,
    get_screenshot_path, get_output_dir, BASE_DIR, DeviceConfig,
)
from lib.composer import compose_screenshot

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max upload

UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Preload config
_devices = None
_fonts = None


def get_devices():
    global _devices
    if _devices is None:
        _devices = load_devices()
    return _devices


def get_fonts():
    global _fonts
    if _fonts is None:
        _fonts = load_fonts()
    return _fonts


def _find_available_templates():
    """Find all template directories."""
    templates_dir = os.path.join(BASE_DIR, 'templates')
    if not os.path.exists(templates_dir):
        return []
    return [d for d in os.listdir(templates_dir)
            if os.path.isdir(os.path.join(templates_dir, d))
            and os.path.exists(os.path.join(templates_dir, d, 'template.yaml'))]


def _find_available_langs():
    """Find all available locale files."""
    langs = set()
    locale_dir = os.path.join(BASE_DIR, 'locales')
    if os.path.exists(locale_dir):
        for f in os.listdir(locale_dir):
            if f.endswith(('.yaml', '.yml')):
                langs.add(f.rsplit('.', 1)[0])
    return sorted(langs) if langs else ['en']


def _deep_copy_dict(d):
    if isinstance(d, dict):
        return {k: _deep_copy_dict(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [_deep_copy_dict(v) for v in d]
    return d


def _merge_dicts(base: dict, override: dict) -> dict:
    result = _deep_copy_dict(base)
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = _merge_dicts(result[key], value)
        else:
            result[key] = _deep_copy_dict(value)
    return result


# ─── Routes ────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


# ─── API: Device List ──────────────────────────────────────────────────────

@app.route('/api/devices')
def api_devices():
    """Return available devices."""
    devices = get_devices()
    result = {}
    for key, dev in devices.items():
        result[key] = {
            'key': key,
            'name': dev.name,
            'display_name': dev.display_name,
            'width': dev.width,
            'height': dev.height,
            'platform': dev.platform,
            'corner_radius': dev.corner_radius,
        }
    return jsonify(result)


# ─── API: Layout List ──────────────────────────────────────────────────────

@app.route('/api/layouts')
def api_layouts():
    """Return available layouts with descriptions."""
    layouts = {
        'center-top-text': {
            'name': 'Center + Top Text',
            'description': 'Classic pattern: text on top, device screenshot centered below.',
            'icon': '📱',
        },
        'feature-highlight': {
            'name': 'Feature Highlight',
            'description': 'Emphasis on a specific feature with smaller screenshot.',
            'icon': '⭐',
        },
        'full-bleed': {
            'name': 'Full Bleed',
            'description': 'Full-screen screenshot with optional text overlay.',
            'icon': '🖼️',
        },
        'dark-premium': {
            'name': 'Dark Premium',
            'description': 'Sleek dark theme with white text.',
            'icon': '🌙',
        },
        'text-only': {
            'name': 'Text Only',
            'description': 'Text-centered, minimal. Good for CTAs.',
            'icon': '✍️',
        },
    }
    return jsonify(layouts)


# ─── API: Templates ────────────────────────────────────────────────────────

@app.route('/api/templates')
def api_templates():
    """Return available templates."""
    templates = _find_available_templates()
    result = {}
    for name in templates:
        try:
            tpl = load_template(name)
            result[name] = {
                'name': name,
                'app_name': tpl.app_name,
                'screens': len(tpl.screens),
            }
        except Exception:
            pass
    return jsonify(result)


# ─── API: Languages ────────────────────────────────────────────────────────

@app.route('/api/languages')
def api_languages():
    """Return available languages."""
    lang_names = {
        'ko': {'name': '한국어', 'flag': '🇰🇷'},
        'en': {'name': 'English', 'flag': '🇺🇸'},
        'ja': {'name': '日本語', 'flag': '🇯🇵'},
        'zh': {'name': '中文', 'flag': '🇨🇳'},
        'fr': {'name': 'Français', 'flag': '🇫🇷'},
        'de': {'name': 'Deutsch', 'flag': '🇩🇪'},
        'es': {'name': 'Español', 'flag': '🇪🇸'},
    }
    langs = _find_available_langs()
    result = {}
    for lang in langs:
        info = lang_names.get(lang, {'name': lang, 'flag': '🌐'})
        result[lang] = info
    return jsonify(result)


# ─── API: Upload Screenshot ────────────────────────────────────────────────

@app.route('/api/upload', methods=['POST'])
def api_upload():
    """Upload screenshot(s). Returns file IDs."""
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    uploaded = []

    for f in files:
        if not f.filename:
            continue
        ext = os.path.splitext(f.filename)[1].lower()
        if ext not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue

        file_id = str(uuid.uuid4())
        save_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
        f.save(save_path)

        # Get dimensions
        img = Image.open(save_path)
        w, h = img.size
        img.close()

        uploaded.append({
            'id': file_id,
            'filename': f.filename,
            'ext': ext,
            'width': w,
            'height': h,
            'path': save_path,
        })

    return jsonify({'files': uploaded})


# ─── API: Preview ──────────────────────────────────────────────────────────

@app.route('/api/preview', methods=['POST'])
def api_preview():
    """Generate a single preview image."""
    data = request.json or {}

    device_key = data.get('device', 'iphone-6.7')
    lang = data.get('lang', 'ko')
    layout = data.get('layout', 'center-top-text')
    headline = data.get('headline', '')
    subheadline = data.get('subheadline', '')
    screenshot_id = data.get('screenshot_id', '')
    bg_config = data.get('background', {'type': 'gradient', 'colors': ['#1a1a2e', '#16213e', '#0f3460'], 'angle': 135})
    frame_config = data.get('frame', {'show': True, 'shadow': True})

    devices = get_devices()
    fonts = get_fonts()

    if device_key not in devices:
        return jsonify({'error': f'Unknown device: {device_key}'}), 400

    device = devices[device_key]

    # Find screenshot
    ss_path = None
    if screenshot_id:
        for ext in ['.png', '.jpg', '.jpeg', '.webp']:
            p = os.path.join(UPLOAD_DIR, f"{screenshot_id}{ext}")
            if os.path.exists(p):
                ss_path = p
                break

    if not ss_path:
        # Use placeholder
        ss_path = None

    # Build style
    style = {
        'layout': layout,
        'background': bg_config,
        'frame': frame_config,
        'text': {
            'headline': {'size_ratio': 0.04, 'color': '#FFFFFF'},
            'subheadline': {'size_ratio': 0.024, 'color': '#B0B0CC'},
        },
        'screenshot': {
            'scale': 0.62,
            'corner_radius': device.corner_radius,
        },
    }

    # Generate at reduced size for preview (1/3 scale)
    preview_scale = 3
    preview_w = device.width // preview_scale
    preview_h = device.height // preview_scale

    # Create a temp device config for preview size
    preview_device = DeviceConfig(
        key=device.key,
        name=device.name,
        display_name=device.display_name,
        width=preview_w,
        height=preview_h,
        platform=device.platform,
        corner_radius=device.corner_radius // preview_scale,
        bezel_width=device.bezel_width // preview_scale,
        bezel_color=device.bezel_color,
    )

    # Scale text proportionally
    preview_style = _deep_copy_dict(style)

    if not ss_path:
        # Create blank placeholder
        from PIL import ImageDraw
        ss = Image.new('RGB', (preview_w, preview_h), (60, 60, 80))
        draw = ImageDraw.Draw(ss)
        draw.text((preview_w // 4, preview_h // 2), "Upload\nScreenshot", fill=(120, 120, 160))
        temp_path = os.path.join(UPLOAD_DIR, '_preview_placeholder.png')
        ss.save(temp_path)
        ss_path = temp_path

    try:
        result = compose_screenshot(
            canvas_width=preview_w,
            canvas_height=preview_h,
            screenshot_path=ss_path,
            headline=headline,
            subheadline=subheadline,
            style=preview_style,
            device=preview_device,
            fonts=fonts,
            lang=lang,
        )

        # Convert to JPEG for faster transfer
        buf = io.BytesIO()
        result.convert('RGB').save(buf, 'JPEG', quality=85)
        buf.seek(0)

        return send_file(buf, mimetype='image/jpeg', download_name='preview.jpg')

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── API: Generate Single ──────────────────────────────────────────────────

@app.route('/api/generate', methods=['POST'])
def api_generate():
    """Generate a full-resolution screenshot."""
    data = request.json or {}

    device_key = data.get('device', 'iphone-6.7')
    lang = data.get('lang', 'ko')
    layout = data.get('layout', 'center-top-text')
    headline = data.get('headline', '')
    subheadline = data.get('subheadline', '')
    screenshot_id = data.get('screenshot_id', '')
    bg_config = data.get('background', {'type': 'gradient', 'colors': ['#1a1a2e', '#16213e', '#0f3460'], 'angle': 135})
    frame_config = data.get('frame', {'show': True, 'shadow': True})
    output_format = data.get('format', 'png')

    devices = get_devices()
    fonts = get_fonts()

    if device_key not in devices:
        return jsonify({'error': f'Unknown device: {device_key}'}), 400

    device = devices[device_key]

    # Find screenshot
    ss_path = _find_upload(screenshot_id)
    if not ss_path:
        return jsonify({'error': 'Screenshot not found. Upload first.'}), 400

    style = {
        'layout': layout,
        'background': bg_config,
        'frame': frame_config,
        'text': {
            'headline': {'size_ratio': 0.04, 'color': '#FFFFFF'},
            'subheadline': {'size_ratio': 0.024, 'color': '#B0B0CC'},
        },
        'screenshot': {
            'scale': 0.62,
            'corner_radius': device.corner_radius,
        },
    }

    try:
        result = compose_screenshot(
            canvas_width=device.width,
            canvas_height=device.height,
            screenshot_path=ss_path,
            headline=headline,
            subheadline=subheadline,
            style=style,
            device=device,
            fonts=fonts,
            lang=lang,
        )

        buf = io.BytesIO()
        if output_format in ('jpg', 'jpeg'):
            result.convert('RGB').save(buf, 'JPEG', quality=95)
            mime = 'image/jpeg'
            ext = 'jpg'
        else:
            result.convert('RGB').save(buf, 'PNG')
            mime = 'image/png'
            ext = 'png'
        buf.seek(0)

        filename = f"screenshot-{device_key}-{lang}.{ext}"
        return send_file(buf, mimetype=mime, download_name=filename)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── API: Batch Generate (ZIP) ─────────────────────────────────────────────

@app.route('/api/batch', methods=['POST'])
def api_batch():
    """
    Batch generate screenshots for multiple devices/languages.
    Returns a ZIP file.
    """
    data = request.json or {}

    device_keys = data.get('devices', ['iphone-6.7'])
    langs = data.get('langs', ['ko'])
    screenshots = data.get('screenshots', [])  # List of {id, headline, subheadline, layout, ...}
    bg_config = data.get('background', {'type': 'gradient', 'colors': ['#1a1a2e', '#16213e', '#0f3460'], 'angle': 135})
    frame_config = data.get('frame', {'show': True, 'shadow': True})
    output_format = data.get('format', 'png')

    if not screenshots:
        return jsonify({'error': 'No screenshots specified'}), 400

    devices = get_devices()
    fonts = get_fonts()

    # Validate devices
    for dk in device_keys:
        if dk not in devices:
            return jsonify({'error': f'Unknown device: {dk}'}), 400

    # Create ZIP in memory
    zip_buf = io.BytesIO()
    total = len(device_keys) * len(langs) * len(screenshots)
    generated = 0

    with zipfile.ZipFile(zip_buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for lang in langs:
            for dk in device_keys:
                device = devices[dk]
                for i, ss_info in enumerate(screenshots):
                    screenshot_id = ss_info.get('id', '')
                    raw_headline = ss_info.get('headline', '')
                    raw_subheadline = ss_info.get('subheadline', '')
                    layout = ss_info.get('layout', 'center-top-text')

                    # Handle headline as string or dict
                    if isinstance(raw_headline, dict):
                        headline = raw_headline.get(lang, '')
                    else:
                        headline = raw_headline
                    if isinstance(raw_subheadline, dict):
                        subheadline = raw_subheadline.get(lang, '')
                    else:
                        subheadline = raw_subheadline

                    ss_path = _find_upload(screenshot_id)
                    if not ss_path:
                        continue

                    style = {
                        'layout': layout,
                        'background': bg_config,
                        'frame': frame_config,
                        'text': {
                            'headline': {'size_ratio': 0.04, 'color': '#FFFFFF'},
                            'subheadline': {'size_ratio': 0.024, 'color': '#B0B0CC'},
                        },
                        'screenshot': {
                            'scale': 0.62,
                            'corner_radius': device.corner_radius,
                        },
                    }

                    try:
                        result = compose_screenshot(
                            canvas_width=device.width,
                            canvas_height=device.height,
                            screenshot_path=ss_path,
                            headline=headline,
                            subheadline=subheadline,
                            style=style,
                            device=device,
                            fonts=fonts,
                            lang=lang,
                        )

                        img_buf = io.BytesIO()
                        ext = 'jpg' if output_format in ('jpg', 'jpeg') else 'png'
                        if ext == 'jpg':
                            result.convert('RGB').save(img_buf, 'JPEG', quality=95)
                        else:
                            result.convert('RGB').save(img_buf, 'PNG')
                        img_buf.seek(0)

                        zip_path = f"{lang}/{dk}/screen-{i+1:02d}.{ext}"
                        zf.writestr(zip_path, img_buf.getvalue())
                        generated += 1

                    except Exception as e:
                        print(f"Error generating {lang}/{dk}/screen-{i+1}: {e}")

    zip_buf.seek(0)
    timestamp = time.strftime('%Y%m%d-%H%M%S')
    return send_file(
        zip_buf,
        mimetype='application/zip',
        download_name=f'screenshots-{timestamp}.zip',
        as_attachment=True,
    )


# ─── API: Cleanup uploads ─────────────────────────────────────────────────

@app.route('/api/cleanup', methods=['POST'])
def api_cleanup():
    """Remove old uploads (>1 hour)."""
    cutoff = time.time() - 3600
    removed = 0
    for f in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, f)
        if os.path.isfile(path) and os.path.getmtime(path) < cutoff:
            os.remove(path)
            removed += 1
    return jsonify({'removed': removed})


# ─── Helpers ───────────────────────────────────────────────────────────────

def _find_upload(file_id: str) -> str | None:
    """Find an uploaded file by ID."""
    if not file_id:
        return None
    for ext in ['.png', '.jpg', '.jpeg', '.webp']:
        p = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
        if os.path.exists(p):
            return p
    return None


# ─── Main ──────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Screenshot Generator Web Server')
    parser.add_argument('--host', default='127.0.0.1', help='Host (default: 127.0.0.1)')
    parser.add_argument('--port', type=int, default=5000, help='Port (default: 5000)')
    parser.add_argument('--debug', action='store_true', help='Debug mode')
    args = parser.parse_args()

    print(f"🚀 Screenshot Generator Web Service")
    print(f"   http://{args.host}:{args.port}")
    print(f"   Press Ctrl+C to stop")
    print()

    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == '__main__':
    main()
