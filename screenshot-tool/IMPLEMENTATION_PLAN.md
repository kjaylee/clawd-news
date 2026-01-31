# Screenshot Generator v2 — Implementation Plan

## Architecture: HTML+CSS+Playwright

Replace PIL rendering pipeline with HTML/CSS templates → Playwright screenshot.

### Why
| Aspect | PIL (v1) | HTML+Playwright (v2) |
|--------|----------|---------------------|
| Text | Bitmap, aliased | CSS vector, subpixel AA |
| Gradients | Pixel loop, banding | CSS linear-gradient, smooth |
| Shadows | Gaussian blur filter | CSS box-shadow, clean |
| Corners | Mask-based | CSS border-radius, anti-aliased |
| Resolution | Scale 0.65 → lossy | deviceScaleFactor=2, exact |

### Key Design
- **Viewport**: device_width/2 × device_height/2, deviceScaleFactor=2
- **Output**: Exact device dimensions (e.g., 1290×2796 for iPhone 6.7")
- **Screenshots**: Embedded as base64 data URI in HTML
- **Fonts**: CSS font-family (Noto Sans CJK KR/JP, Inter for English)
- **Backward Compatible**: compose_screenshot() still returns PIL Image
- **Fallback**: PIL rendering if Playwright unavailable

### Files
| File | Action | Purpose |
|------|--------|---------|
| `lib/renderer.py` | NEW | Playwright HTML→PNG renderer |
| `lib/html_templates/screenshot.html` | NEW | Jinja2 HTML/CSS template |
| `lib/composer.py` | MODIFY | Add Playwright path, keep PIL fallback |
| `requirements.txt` | MODIFY | Add playwright, jinja2 |

### No Changes Needed
- `generate.py` — Same CLI interface
- `app.py` — Same API endpoints
- `config.py` — Same device/font loading
- `config/devices.yaml` — Same device definitions
- `locales/*.yaml` — Same locale files
- `templates/*/template.yaml` — Same template definitions

### Tasks
1. ✅ Install Inter font on MiniPC
2. ✅ Create `lib/renderer.py`
3. ✅ Create `lib/html_templates/screenshot.html` — 5 layouts (Jinja2+CSS)
4. ✅ Update `lib/composer.py` — Playwright first, PIL fallback
5. ✅ Update `requirements.txt` — playwright, jinja2 added
6. ✅ Deploy to MiniPC — scp transfer, pycache cleared
7. ✅ Test with demo template — all 5 screens 1290×2796, 3.1s on MiniPC
8. Quality comparison (pending visual review)
