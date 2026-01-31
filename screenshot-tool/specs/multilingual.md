# Multilingual Text Spec

## Overview
YAML-based locale management with auto font selection for CJK languages.

## Locale File Structure
```yaml
# locales/{lang}.yaml
app_name: "앱 이름"
screens:
  screen_01:
    headline: "헤드라인 텍스트"
    subheadline: "서브 헤드라인 텍스트"
  screen_02:
    headline: "..."
    subheadline: "..."
```

## Font Selection
- **Korean**: Apple SD Gothic Neo Bold (system, /System/Library/Fonts/AppleSDGothicNeo.ttc index 6)
- **English**: SF Pro Display Bold (/Library/Fonts/SF-Pro-Display-Bold.otf) or Helvetica Neue Bold
- **Japanese**: Hiragino Kaku Gothic Pro or Apple SD Gothic Neo

## Auto Font Size Adjustment
- If text exceeds available width, font size is reduced automatically
- Minimum font size: 60% of configured size
- Line wrapping: automatic based on available width

## Text Length Guidelines
- Headline: 3-7 words (EN) / 5-15 chars (KO/JA)
- Subheadline: 7-15 words (EN) / 15-30 chars (KO/JA)
