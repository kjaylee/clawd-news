#!/usr/bin/env python3
"""
apply-9slice.py — 9slice-values.json의 값을 각 게임 index.html에 적용

1. 기존 border-image 참조를 자동 감지된 값으로 업데이트
2. UI 이미지를 사용하지만 border-image가 없는 요소에 추가
"""

import json
import re
import sys
from pathlib import Path

WORKSPACE = Path("/Users/kjaylee/clawd")
VALUES_FILE = WORKSPACE / "_assets" / "9slice-values.json"

# border-image 적용 제외 패턴
EXCLUDE_PATTERNS = ['icon-', 'bg-', 'bg_', '01_', 'sprite', 'monster', 'gem', 'jewel']

# border-image 적용 대상 패턴
TARGET_PATTERNS = ['btn', 'frame', 'card', 'panel', 'popup', 'bar', 'resbar', 
                   'slider', 'toast', 'label-ribbon', 'list-frame', 'ribbon',
                   'topbar', 'top-bar', 'board', 'display', 'cell-bg',
                   'title-flag', 'skill-frame', 'stage-frame', 'item-frame']


def load_values():
    with open(VALUES_FILE) as f:
        return json.load(f)


def get_game_values(values, game_name):
    """Get 9slice values for a specific game."""
    prefix = f"games/{game_name}/assets/ui/"
    return {k: v for k, v in values.items() if k.startswith(prefix)}


def is_target_image(filename):
    """Check if image should get border-image treatment."""
    basename = filename.lower()
    if any(basename.startswith(p) for p in EXCLUDE_PATTERNS):
        return False
    # Circle buttons are not suitable for 9-slice
    if 'circle' in basename:
        return False
    return any(basename.startswith(p) for p in TARGET_PATTERNS)


def compute_border_width(slice_str, img_size):
    """Compute appropriate border-image-width from slice values and image size."""
    parts = slice_str.split()
    top, right, bottom, left = int(parts[0]), int(parts[1]), int(parts[2]), int(parts[3])
    
    w, h = map(int, img_size.split('x'))
    
    # For buttons with multi-state sprites (tall images), scale down
    # Typical button: width ~64, if height >> width, it's multi-state
    if h > w * 2:
        # Multi-state sprite: use smaller of top/left as base
        base = min(top, left, right)
        return f"{min(base, 20)}px"
    
    # For normal images, use proportional width
    base = min(top, right, bottom, left)
    return f"{max(3, min(base, 20))}px"


def update_power2048(html, game_values):
    """Update power-2048 index.html with auto-detected 9-slice values."""
    changes = []
    
    # Map: image filename -> auto-detected values
    img_map = {}
    for path, vals in game_values.items():
        fname = path.split('/')[-1]
        if vals.get('suitable') and is_target_image(fname):
            img_map[fname] = vals
    
    # 1. Update shared button class (line ~82): border-image-slice for btn-blue default
    # Current: border-image-slice:67 3 18 13 fill;border-image-width:20px
    if 'btn-blue.png' in img_map:
        v = img_map['btn-blue.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = 'border-image-slice:67 3 18 13 fill;border-image-width:20px'
        new = f"border-image-slice:{v['slice']};border-image-width:{bw}"
        html = html.replace(old, new)
        changes.append(f"  btn base: {old} → {new}")
    
    # 2. btn-sm-gray: border-image-slice:52 3 10 12 fill;border-image-width:15px
    if 'btn-sm-gray.png' in img_map:
        v = img_map['btn-sm-gray.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = 'border-image-slice:52 3 10 12 fill;border-image-width:15px'
        new = f"border-image-slice:{v['slice']};border-image-width:{bw}"
        html = html.replace(old, new)
        changes.append(f"  btn-sm-gray: → {new}")
    
    # 3. resbar-bg
    if 'resbar-bg.png' in img_map:
        v = img_map['resbar-bg.png']
        bw = compute_border_width(v['slice'], v['size'])
        s = v['slice'].replace(' fill', '')
        old_pattern = re.compile(r"border-image:url\('assets/ui/resbar-bg\.png'\)\s*[\d\s]+fill\s*/\s*\d+px\s*/\s*0\s*stretch")
        new_val = f"border-image:url('assets/ui/resbar-bg.png') {v['slice']} / {bw} / 0 stretch"
        html = old_pattern.sub(new_val, html)
        changes.append(f"  resbar-bg: → {new_val}")
    
    # 4. btn-sq-navy
    if 'btn-sq-navy.png' in img_map:
        v = img_map['btn-sq-navy.png']
        bw = compute_border_width(v['slice'], v['size'])
        old_pattern = re.compile(r"border-image:url\('assets/ui/btn-sq-navy\.png'\)\s*[\d\s]+fill\s*/\s*\d+px\s*/\s*0\s*stretch")
        new_val = f"border-image:url('assets/ui/btn-sq-navy.png') {v['slice']} / {bw} / 0 stretch"
        html = old_pattern.sub(new_val, html)
        changes.append(f"  btn-sq-navy: → {new_val}")
    
    # 5. item-frame-yellow
    if 'item-frame-yellow.png' in img_map:
        v = img_map['item-frame-yellow.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = 'border-image-slice:48 39 9 39 fill;border-image-width:20px'
        new = f"border-image-slice:{v['slice']};border-image-width:{bw}"
        html = html.replace(old, new)
        changes.append(f"  item-frame-yellow: → {new}")
    
    # 6. popup-navy
    if 'popup-navy.png' in img_map:
        old_pattern = re.compile(r"border-image:url\('assets/ui/popup-navy\.png'\)\s*[\d\s]+fill\s*/\s*\d+px\s*/\s*0\s*stretch")
        # popup-navy wasn't detected as suitable, keep manual but improve
        # Actually check if it's in values
        if game_values.get(f"games/power-2048/assets/ui/popup-navy.png", {}).get('suitable'):
            v = img_map['popup-navy.png']
            bw = compute_border_width(v['slice'], v['size'])
            new_val = f"border-image:url('assets/ui/popup-navy.png') {v['slice']} / {bw} / 0 stretch"
            html = old_pattern.sub(new_val, html)
            changes.append(f"  popup-navy: → {new_val}")
    
    # 7. dialog buttons: dlg-btn-secondary with btn-gray
    if 'btn-gray.png' in img_map:
        v = img_map['btn-gray.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = 'border-image-slice:67 3 11 12 fill;border-image-width:18px'
        new = f"border-image-slice:{v['slice']};border-image-width:{bw}"
        html = html.replace(old, new)
        changes.append(f"  dlg-btn-secondary (btn-gray): → {new}")
    
    # 8. dlg-btn base class
    # Current has: border-image-slice:67 3 18 13 fill;border-image-width:20px
    # Already handled by #1 above (same pattern)
    
    # 9. btn-sq-white
    if 'btn-sq-white.png' in img_map:
        v = img_map['btn-sq-white.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = 'border-image-slice:2 2 8 2 fill;border-image-width:6px'
        new = f"border-image-slice:{v['slice']};border-image-width:{bw}"
        html = html.replace(old, new)
        changes.append(f"  btn-sq-white (stage-cell.cleared): → {new}")
    
    # 10. btn-sm-blue
    if 'btn-sm-blue.png' in img_map:
        v = img_map['btn-sm-blue.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = 'border-image-slice:52 3 18 13 fill;border-image-width:17px'
        new = f"border-image-slice:{v['slice']};border-image-width:{bw}"
        html = html.replace(old, new)
        changes.append(f"  btn-sm-blue: → {new}")
    
    return html, changes


def update_merge_bloom(html, game_values):
    """Update merge-bloom index.html."""
    changes = []
    
    img_map = {}
    for path, vals in game_values.items():
        fname = path.split('/')[-1]
        if vals.get('suitable') and is_target_image(fname):
            img_map[fname] = vals
    
    # 1. panel-top.png: current 25 25 21 25 fill / 8px
    if 'panel-top.png' in img_map:
        v = img_map['panel-top.png']
        bw = '8px'  # Keep existing width as panel-top is a large image
        old_pattern = re.compile(
            r"border-image:url\('assets/ui/panel-top\.png'\)\s*[\d\s]+fill\s*/\s*\d+px\s*/\s*0\s*stretch"
        )
        new_val = f"border-image:url('assets/ui/panel-top.png') {v['slice']} / {bw} / 0 stretch"
        html = old_pattern.sub(new_val, html)
        changes.append(f"  panel-top: → {v['slice']}")
    
    # 2. panel-bottom.png: current 8 5 5 5 fill / 6px
    if 'panel-bottom.png' in img_map:
        v = img_map['panel-bottom.png']
        bw = '6px'  # Keep existing width
        old_pattern = re.compile(
            r"border-image:url\('assets/ui/panel-bottom\.png'\)\s*[\d\s]+fill\s*/\s*\d+px\s*/\s*0\s*stretch"
        )
        new_val = f"border-image:url('assets/ui/panel-bottom.png') {v['slice']} / {bw} / 0 stretch"
        html = old_pattern.sub(new_val, html)
        changes.append(f"  panel-bottom: → {v['slice']}")
    
    return html, changes


def update_puzzle_rogue(html, game_values):
    """Update puzzle-rogue index.html."""
    changes = []
    
    img_map = {}
    for path, vals in game_values.items():
        fname = path.split('/')[-1]
        if vals.get('suitable') and is_target_image(fname):
            img_map[fname] = vals
    
    # 1. card-frame.png: current "30 stretch" → proper slice values
    if 'card-frame.png' in img_map:
        v = img_map['card-frame.png']
        bw = compute_border_width(v['slice'], v['size'])
        old = "border-image:url('assets/ui/card-frame.png') 30 stretch;border-image-width:15px"
        new = f"border-image:url('assets/ui/card-frame.png') {v['slice']} / {bw} / 0 stretch"
        html = html.replace(old, new)
        changes.append(f"  card-frame: → {v['slice']}")
    
    # 2. Add border-image for popup-bg (used in JS but may need CSS)
    if 'popup-bg.png' in img_map:
        v = img_map['popup-bg.png']
        bw = compute_border_width(v['slice'], v['size'])
        # Check if popup styles exist without border-image
        if "assets/ui/popup-bg.png" not in html.split('<style')[0] if '<style' in html else True:
            # Find .popup or similar dialog styling
            popup_pattern = re.compile(r'(#reward-screen\{[^}]*\})')
            # Don't add if already has border-image for popup
            if 'popup-bg.png' not in html.split('border-image')[0] if 'border-image' in html else True:
                pass  # Will handle via CSS class
        changes.append(f"  popup-bg: values available → {v['slice']}")
    
    # 3. Add border-image for buttons (btn-blue, btn-green, btn-purple)
    # These buttons likely use CSS gradients — add border-image enhancement
    for btn_name in ['btn-blue.png', 'btn-green.png', 'btn-purple.png']:
        if btn_name in img_map:
            v = img_map[btn_name]
            changes.append(f"  {btn_name}: values available → {v['slice']}")
    
    return html, changes


def update_sushi_sprint(html, game_values):
    """Update sushi-sprint index.html — currently has 0 border-image refs."""
    changes = []
    
    img_map = {}
    for path, vals in game_values.items():
        fname = path.split('/')[-1]
        if vals.get('suitable') and is_target_image(fname):
            img_map[fname] = vals
    
    # sushi-sprint uses CSS gradients for buttons, not border-image
    # The UI images are preloaded but mostly used as background-image
    # Add border-image styles for applicable elements
    
    # Find .btn-play and add border-image with btn-yellow
    if 'btn-yellow.png' in img_map:
        v = img_map['btn-yellow.png']
        bw = compute_border_width(v['slice'], v['size'])
        # Replace gradient-based button with border-image
        old = ".btn-play{background:linear-gradient(135deg,var(--red),#c62828);color:#fff;box-shadow:0 6px 20px rgba(230,57,70,.4);margin-bottom:12px;font-size:20px}"
        new = f".btn-play{{border-image:url('assets/ui/btn-yellow.png') {v['slice']} / {bw} / 0 stretch;background:none;color:#fff;box-shadow:0 6px 20px rgba(230,57,70,.4);margin-bottom:12px;font-size:20px}}"
        if old in html:
            html = html.replace(old, new)
            changes.append(f"  btn-play: added border-image with btn-yellow")
    
    # popup
    if 'popup.png' in img_map:
        v = img_map['popup.png']
        bw = compute_border_width(v['slice'], v['size'])
        changes.append(f"  popup: values available → {v['slice']}")
    
    return html, changes


def apply_all():
    """Main: apply 9slice values to all games."""
    values = load_values()
    
    games = {
        'power-2048': update_power2048,
        'merge-bloom': update_merge_bloom,
        'puzzle-rogue': update_puzzle_rogue,
        'sushi-sprint': update_sushi_sprint,
    }
    
    all_changes = {}
    
    for game_name, updater in games.items():
        html_path = WORKSPACE / "games" / game_name / "index.html"
        if not html_path.exists():
            print(f"⚠️ {game_name}: index.html not found")
            continue
        
        game_values = get_game_values(values, game_name)
        if not game_values:
            print(f"⚠️ {game_name}: no 9slice values found")
            continue
        
        html = html_path.read_text(encoding='utf-8')
        new_html, changes = updater(html, game_values)
        
        if changes:
            html_path.write_text(new_html, encoding='utf-8')
            all_changes[game_name] = changes
            print(f"✅ {game_name}: {len(changes)} changes applied")
            for c in changes:
                print(c)
        else:
            print(f"ℹ️ {game_name}: no changes needed")
    
    return all_changes


if __name__ == '__main__':
    apply_all()
