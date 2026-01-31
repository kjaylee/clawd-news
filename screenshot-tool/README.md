# App Store Screenshot Generator

CLI tool for generating App Store and Google Play screenshot assets with multi-language support, device frames, and customizable layouts.

## Features

- **Multi-device**: iPhone 6.7", 6.1", iPad 12.9", Android Phone/Tablet
- **Multi-language**: Korean, English, Japanese (extensible via YAML)
- **5 Layout Styles**: center-top-text, feature-highlight, full-bleed, dark-premium, text-only
- **Device Frames**: Programmatic rounded rect bezels with drop shadows
- **Auto-fit Text**: Headlines/subheadlines auto-size to fit available width
- **Gradient Backgrounds**: Multi-stop linear gradients at any angle
- **Batch Processing**: Generate all combinations in one command

## Quick Start

```bash
# Install dependencies
pip3 install Pillow PyYAML

# Generate demo screenshots (Korean + English, all devices)
python3 generate.py --app demo --lang ko,en --devices all --verbose

# Generate for a specific device
python3 generate.py --app demo --lang ko --devices iphone-6.7

# List available devices
python3 generate.py --list-devices

# Validate generated output
python3 generate.py --validate --app demo
```

## Project Structure

```
screenshot-tool/
├── generate.py              # CLI entry point
├── config/
│   └── devices.yaml         # Device specs + font config
├── templates/
│   └── demo/
│       └── template.yaml    # App template (layouts, styles, screens)
├── locales/
│   ├── ko.yaml              # Korean strings
│   ├── en.yaml              # English strings
│   └── ja.yaml              # Japanese strings
├── screenshots/
│   └── demo/                # Source screenshots (PNG)
├── output/                  # Generated screenshots
│   └── {app}/{lang}/{device}/
├── lib/
│   ├── config.py            # YAML loaders + data classes
│   ├── background.py        # Solid/gradient background generation
│   ├── text_renderer.py     # Multi-language text with auto-sizing
│   ├── frame_renderer.py    # Device frame + shadow renderer
│   └── composer.py          # Layout orchestration
└── specs/                   # Design specifications
```

## Creating a New App Template

### 1. Create template directory
```bash
mkdir -p templates/myapp
```

### 2. Add screenshots
```bash
mkdir -p screenshots/myapp
# Place your app screenshots here (any resolution, they'll be resized)
```

### 3. Create template.yaml
```yaml
app_name: "My App"

style:
  layout: center-top-text  # or: feature-highlight, full-bleed, dark-premium, text-only
  background:
    type: gradient          # or: solid, image
    colors: ["#1a1a2e", "#16213e", "#0f3460"]
    angle: 135
  frame:
    show: true
    shadow: true
  text:
    headline:
      size_ratio: 0.04     # relative to canvas height
      color: "#FFFFFF"
    subheadline:
      size_ratio: 0.024
      color: "#B0B0CC"
  screenshot:
    scale: 0.62
    corner_radius: 50

screens:
  - id: screen-01
    screenshot: "screen-01.png"
    text_key: "screen_01"
  - id: screen-02
    screenshot: "screen-02.png"
    text_key: "screen_02"
    style_override:          # per-screen overrides
      layout: feature-highlight
```

### 4. Create locale files
```yaml
# locales/ko.yaml (or templates/myapp/locales/ko.yaml)
app_name: "내 앱"
screens:
  screen_01:
    headline: "헤드라인 텍스트"
    subheadline: "서브헤드라인 텍스트"
```

### 5. Generate
```bash
python3 generate.py --app myapp --lang ko,en --devices all --verbose
```

## Layout Styles

| Layout | Description | Best For |
|--------|-------------|----------|
| `center-top-text` | Text top, framed device below | General purpose |
| `feature-highlight` | Text top, smaller device below | Feature callouts |
| `full-bleed` | Full-screen screenshot + text overlay | Games, media |
| `dark-premium` | Dark bg, white text, framed device | Premium apps |
| `text-only` | Large centered text, no screenshot | CTA, social proof |

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--app` | Template name (required) | — |
| `--lang` | Languages (comma-separated) | `all` |
| `--devices` | Devices (comma-separated) | `all` |
| `--screen` | Specific screen ID | all screens |
| `--output` | Output directory | `./output/` |
| `--format` | Output format (png/jpeg) | `png` |
| `--validate` | Validate output files | — |
| `--list-devices` | Show available devices | — |
| `--verbose` | Verbose output | — |

## Adding a New Device

Edit `config/devices.yaml`:
```yaml
devices:
  my-device:
    name: "My Device"
    display_name: "Device Display Name"
    width: 1290
    height: 2796
    platform: apple  # or: google
    corner_radius: 55
    bezel_width: 18
    bezel_color: "#1C1C1E"
```

## Adding a New Language

1. Create `locales/{lang}.yaml` with screen strings
2. Add font config in `config/devices.yaml` under `fonts:{lang}:`
3. Run with `--lang {lang}`

## Requirements

- Python 3.10+
- Pillow
- PyYAML
- macOS system fonts (SF Pro, Apple SD Gothic Neo) or configure custom fonts
