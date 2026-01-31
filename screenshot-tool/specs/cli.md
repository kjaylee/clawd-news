# CLI Spec

## Overview
Python CLI using argparse. Entry point: `generate.py`

## Commands
```bash
# Generate all
python generate.py --app demo --lang ko,en,ja --devices all

# Generate specific
python generate.py --app demo --lang ko --devices iphone-6.7

# List available devices
python generate.py --list-devices

# Validate output
python generate.py --validate --app demo
```

## Arguments
| Argument | Default | Description |
|----------|---------|-------------|
| --app | required | App template name |
| --lang | all | Comma-separated language codes |
| --devices | all | Comma-separated device names |
| --screen | all | Specific screen ID |
| --output | ./output | Output directory |
| --format | png | Output format (png/jpeg) |
| --list-devices | - | List available devices |
| --validate | - | Validate output files |
| --verbose | false | Verbose output |

## Exit Codes
- 0: Success
- 1: Configuration error
- 2: Missing files (screenshots, fonts, etc.)
