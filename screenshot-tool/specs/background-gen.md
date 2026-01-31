# Background Generation Spec

## Overview
Generate backgrounds programmatically: solid colors, linear/radial gradients.

## Types
1. **solid** — Single color fill
2. **gradient** — Linear gradient with configurable angle and 2+ color stops
3. **image** — Use a provided background image (stretched/cropped to fit)

## Gradient Implementation
- Linear gradient using numpy-free approach (pure Pillow)
- Support 2-4 color stops
- Configurable angle (0-360 degrees)
- Smooth interpolation between color stops

## Color Format
- Hex strings: "#1a1a2e"
- RGB tuples also accepted internally
