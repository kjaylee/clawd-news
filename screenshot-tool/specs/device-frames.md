# Device Frames Spec

## Overview
Programmatic device frame generation using Pillow (no external PNG dependency).

## Supported Devices
| Device | Canvas Size | Platform |
|--------|------------|----------|
| iPhone 6.7" | 1290×2796 | Apple |
| iPhone 6.1" | 1179×2556 | Apple |
| iPad 12.9" | 2048×2732 | Apple |
| Android Phone | 1080×1920 | Google |
| Android Tablet | 1200×1920 | Google |

## Frame Rendering Strategy
- **Programmatic rounded rectangle** with configurable bezel color
- No external PNG frames needed (zero dependency)
- Optional: users can provide custom frame PNG in assets/frames/

## Frame Parameters
- Bezel width: proportional to device size (~2% of width)
- Corner radius: device-specific (iPhone ~55px at native, iPad ~30px)
- Bezel color: configurable (default: #1C1C1E dark, #F5F5F7 silver)
- Drop shadow: optional gaussian blur shadow beneath frame

## Frameless Mode
- Just rounded corners on screenshot + optional drop shadow
- Used for "full-bleed" and "minimal" layouts
