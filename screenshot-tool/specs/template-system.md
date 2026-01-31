# Template System Spec

## Overview
YAML-based layout definition system supporting multiple layout patterns from the research.

## Supported Layout Patterns
1. **center-top-text** — Center device + top text (most popular, ~50% of top apps)
2. **full-bleed** — Full screenshot, no frame (games, media)
3. **feature-highlight** — Emoji/icon + description + screenshot
4. **text-only** — Minimal/text-focused (wellness, premium)
5. **dark-premium** — Dark background with white text, premium feel

## Template YAML Structure
```yaml
app_name: "MyApp"
style:
  background:
    type: solid|gradient|image
    color: "#1a1a2e"          # for solid
    colors: ["#1a1a2e", "#0f3460"]  # for gradient
    angle: 135                 # gradient angle
  layout: center-top-text     # layout pattern
  frame:
    show: true
    color: "#1C1C1E"          # device bezel color
    shadow: true
  text:
    headline:
      font_weight: bold
      size_ratio: 0.04        # relative to canvas height
      color: "#FFFFFF"
    subheadline:
      font_weight: regular
      size_ratio: 0.025
      color: "#CCCCCC"
  screenshot:
    scale: 0.65               # relative to canvas
    corner_radius: 12
screens:
  - id: screen-01
    screenshot: "screen-01.png"
    text_key: "screen_01"
```

## Resolution
- Templates are resolution-independent (ratios, not pixels)
- Actual pixel sizes come from devices.yaml
