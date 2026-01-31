# Batch Processing Spec

## Overview
Generate N screenshots × M devices × K languages = full matrix automatically.

## Output Structure
```
output/{app_name}/{lang}/{device}/screen-{NN}.png
```
Example:
```
output/demo/ko/iphone-6.7/screen-01.png
output/demo/en/ipad-12.9/screen-01.png
```

## Generation Matrix
- For each app template
  - For each requested language
    - For each requested device
      - For each screen in template
        → Generate one output image

## Filtering
- --app: specific app only
- --lang: specific language(s) only
- --devices: specific device(s) only
- --screen: specific screen only

## Output Format
- PNG (default, lossless)
- JPEG (optional, for file size)
- Max 8MB per file (App Store limit)
- RGB color space (no alpha for final output)
