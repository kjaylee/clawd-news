#!/usr/bin/env python3
"""
App Store Screenshot Generator CLI

Usage:
    python generate.py --app demo --lang ko,en,ja --devices all
    python generate.py --app demo --lang ko --devices iphone-6.7
    python generate.py --list-devices
    python generate.py --validate --app demo
"""

import argparse
import os
import sys
import time

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib.config import (
    load_devices, load_fonts, load_template, load_locale,
    get_screenshot_path, get_output_dir, BASE_DIR,
)
from lib.composer import compose_screenshot


def generate(args):
    """Generate screenshots for the specified app/lang/devices."""
    start_time = time.time()
    
    # Load config
    devices = load_devices()
    fonts = load_fonts()
    template = load_template(args.app)

    # Determine languages
    if args.lang == 'all':
        # Find available locales
        langs = _find_available_langs(args.app)
    else:
        langs = [l.strip() for l in args.lang.split(',')]

    # Determine devices
    if args.devices == 'all':
        target_devices = list(devices.keys())
    else:
        target_devices = [d.strip() for d in args.devices.split(',')]

    # Determine screens
    if args.screen:
        target_screens = [s for s in template.screens if s.id == args.screen]
    else:
        target_screens = template.screens

    # Validate
    for dk in target_devices:
        if dk not in devices:
            print(f"❌ Unknown device: {dk}")
            print(f"   Available: {', '.join(devices.keys())}")
            sys.exit(1)

    total = len(langs) * len(target_devices) * len(target_screens)
    print(f"📱 Generating {total} screenshots...")
    print(f"   App: {template.app_name}")
    print(f"   Languages: {', '.join(langs)}")
    print(f"   Devices: {', '.join(target_devices)}")
    print(f"   Screens: {len(target_screens)}")
    print()

    generated = 0
    errors = 0

    for lang in langs:
        try:
            locale = load_locale(args.app, lang)
        except FileNotFoundError as e:
            print(f"⚠️  Locale not found: {lang}, skipping")
            continue

        for dk in target_devices:
            device = devices[dk]
            out_dir = get_output_dir(args.app, lang, dk, args.output)
            os.makedirs(out_dir, exist_ok=True)

            for screen in target_screens:
                try:
                    # Get text from locale
                    screen_locale = locale.get('screens', {}).get(screen.text_key, {})
                    headline = screen_locale.get('headline', '')
                    subheadline = screen_locale.get('subheadline', '')

                    # Get screenshot path
                    ss_path = get_screenshot_path(args.app, screen.screenshot)

                    # Merge per-screen style overrides
                    effective_style = _deep_copy_dict(template.style)
                    if screen.style_override:
                        effective_style = _merge_dicts(effective_style, screen.style_override)

                    # Compose
                    result = compose_screenshot(
                        canvas_width=device.width,
                        canvas_height=device.height,
                        screenshot_path=ss_path,
                        headline=headline,
                        subheadline=subheadline,
                        style=effective_style,
                        device=device,
                        fonts=fonts,
                        lang=lang,
                    )

                    # Save
                    fmt = args.format.lower()
                    ext = 'jpg' if fmt == 'jpeg' else fmt
                    out_path = os.path.join(out_dir, f"{screen.id}.{ext}")

                    if fmt == 'jpeg' or fmt == 'jpg':
                        result = result.convert('RGB')
                        result.save(out_path, 'JPEG', quality=95)
                    else:
                        result = result.convert('RGB')
                        result.save(out_path, 'PNG')

                    size_kb = os.path.getsize(out_path) / 1024
                    if args.verbose:
                        print(f"  ✅ {out_path} ({device.width}×{device.height}, {size_kb:.0f}KB)")
                    generated += 1

                except Exception as e:
                    print(f"  ❌ Error: {lang}/{dk}/{screen.id}: {e}")
                    if args.verbose:
                        import traceback
                        traceback.print_exc()
                    errors += 1

    elapsed = time.time() - start_time
    print()
    print(f"✨ Done! {generated} screenshots generated in {elapsed:.1f}s")
    if errors:
        print(f"⚠️  {errors} errors occurred")
    print(f"📁 Output: {args.output or os.path.join(BASE_DIR, 'output')}")


def validate(args):
    """Validate generated screenshots."""
    output_base = args.output or os.path.join(BASE_DIR, 'output')
    app_dir = os.path.join(output_base, args.app)

    if not os.path.exists(app_dir):
        print(f"❌ No output found for app: {args.app}")
        sys.exit(1)

    devices = load_devices()
    total = 0
    valid = 0
    issues = []

    for root, dirs, files in os.walk(app_dir):
        for f in files:
            if not f.endswith(('.png', '.jpg', '.jpeg')):
                continue
            total += 1
            path = os.path.join(root, f)
            
            from PIL import Image
            img = Image.open(path)
            w, h = img.size
            size_mb = os.path.getsize(path) / (1024 * 1024)

            # Check size
            if size_mb > 8:
                issues.append(f"❌ {path}: {size_mb:.1f}MB > 8MB limit")
            
            # Check dimensions match a known device
            matched = False
            for dk, dev in devices.items():
                if w == dev.width and h == dev.height:
                    matched = True
                    break
            
            if not matched:
                issues.append(f"⚠️  {path}: {w}×{h} doesn't match any device")
            
            # Check mode
            if img.mode not in ('RGB',):
                issues.append(f"⚠️  {path}: mode={img.mode} (should be RGB)")
            
            valid += 1

    print(f"📋 Validation: {args.app}")
    print(f"   Total files: {total}")
    print(f"   Valid: {valid}")
    if issues:
        print(f"   Issues: {len(issues)}")
        for issue in issues:
            print(f"     {issue}")
    else:
        print("   ✅ All screenshots valid!")


def list_devices(args):
    """List available devices."""
    devices = load_devices()
    print("📱 Available devices:")
    print(f"{'Key':<20} {'Name':<25} {'Size':<15} {'Platform'}")
    print("-" * 70)
    for key, dev in devices.items():
        print(f"{key:<20} {dev.display_name:<25} {dev.width}×{dev.height:<7} {dev.platform}")


def _find_available_langs(app_name: str) -> list[str]:
    """Find available locale files for an app."""
    langs = set()
    
    # Check app-specific locales
    app_locale_dir = os.path.join(BASE_DIR, 'templates', app_name, 'locales')
    if os.path.exists(app_locale_dir):
        for f in os.listdir(app_locale_dir):
            if f.endswith('.yaml') or f.endswith('.yml'):
                langs.add(f.rsplit('.', 1)[0])
    
    # Check global locales
    global_locale_dir = os.path.join(BASE_DIR, 'locales')
    if os.path.exists(global_locale_dir):
        for f in os.listdir(global_locale_dir):
            if f.endswith('.yaml') or f.endswith('.yml'):
                langs.add(f.rsplit('.', 1)[0])
    
    return sorted(langs) if langs else ['en']


def _deep_copy_dict(d):
    """Deep copy a dict (avoid mutating template config across iterations)."""
    if isinstance(d, dict):
        return {k: _deep_copy_dict(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [_deep_copy_dict(v) for v in d]
    return d


def _merge_dicts(base: dict, override: dict) -> dict:
    """Deep merge override dict into base dict."""
    result = _deep_copy_dict(base)
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = _merge_dicts(result[key], value)
        else:
            result[key] = _deep_copy_dict(value)
    return result


def main():
    parser = argparse.ArgumentParser(
        description='App Store Screenshot Generator',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate.py --app demo --lang ko,en,ja --devices all
  python generate.py --app demo --lang ko --devices iphone-6.7
  python generate.py --list-devices
  python generate.py --validate --app demo
        """
    )

    parser.add_argument('--app', type=str, help='App template name')
    parser.add_argument('--lang', type=str, default='all',
                       help='Languages (comma-separated, or "all")')
    parser.add_argument('--devices', type=str, default='all',
                       help='Devices (comma-separated, or "all")')
    parser.add_argument('--screen', type=str, default=None,
                       help='Specific screen ID')
    parser.add_argument('--output', type=str, default=None,
                       help='Output directory')
    parser.add_argument('--format', type=str, default='png',
                       choices=['png', 'jpeg', 'jpg'],
                       help='Output format')
    parser.add_argument('--list-devices', action='store_true',
                       help='List available devices')
    parser.add_argument('--validate', action='store_true',
                       help='Validate output files')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Verbose output')

    args = parser.parse_args()

    if args.list_devices:
        list_devices(args)
        return

    if args.validate:
        if not args.app:
            print("❌ --app is required for validation")
            sys.exit(1)
        validate(args)
        return

    if not args.app:
        print("❌ --app is required")
        parser.print_help()
        sys.exit(1)

    generate(args)


if __name__ == '__main__':
    main()
