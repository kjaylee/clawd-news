"""Configuration loader for devices, templates, and locales."""

import os
import yaml
from dataclasses import dataclass, field
from typing import Optional


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@dataclass
class FontDef:
    path: str
    index: int = 0


@dataclass
class DeviceConfig:
    key: str
    name: str
    display_name: str
    width: int
    height: int
    platform: str
    corner_radius: int = 40
    bezel_width: int = 16
    bezel_color: str = "#1C1C1E"


@dataclass
class ScreenConfig:
    id: str
    screenshot: str
    text_key: str
    style_override: Optional[dict] = None


@dataclass
class TemplateConfig:
    app_name: str
    style: dict
    screens: list[ScreenConfig]


def load_yaml(path: str) -> dict:
    with open(path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def load_devices(config_path: str = None) -> dict[str, DeviceConfig]:
    if config_path is None:
        config_path = os.path.join(BASE_DIR, 'config', 'devices.yaml')
    data = load_yaml(config_path)
    devices = {}
    for key, d in data.get('devices', {}).items():
        devices[key] = DeviceConfig(
            key=key,
            name=d['name'],
            display_name=d.get('display_name', d['name']),
            width=d['width'],
            height=d['height'],
            platform=d['platform'],
            corner_radius=d.get('corner_radius', 40),
            bezel_width=d.get('bezel_width', 16),
            bezel_color=d.get('bezel_color', '#1C1C1E'),
        )
    return devices


def load_fonts(config_path: str = None) -> dict:
    if config_path is None:
        config_path = os.path.join(BASE_DIR, 'config', 'devices.yaml')
    data = load_yaml(config_path)
    fonts = {}
    for lang, weights in data.get('fonts', {}).items():
        fonts[lang] = {}
        for weight, fdef in weights.items():
            fonts[lang][weight] = FontDef(
                path=fdef['path'],
                index=fdef.get('index', 0),
            )
    return fonts


def load_template(app_name: str) -> TemplateConfig:
    tpl_path = os.path.join(BASE_DIR, 'templates', app_name, 'template.yaml')
    data = load_yaml(tpl_path)
    screens = []
    for s in data.get('screens', []):
        screens.append(ScreenConfig(
            id=s['id'],
            screenshot=s['screenshot'],
            text_key=s['text_key'],
            style_override=s.get('style_override', None),
        ))
    return TemplateConfig(
        app_name=data.get('app_name', app_name),
        style=data.get('style', {}),
        screens=screens,
    )


def load_locale(app_name: str, lang: str) -> dict:
    # First check app-specific locale
    app_locale = os.path.join(BASE_DIR, 'templates', app_name, 'locales', f'{lang}.yaml')
    if os.path.exists(app_locale):
        return load_yaml(app_locale)
    # Fallback to global locale
    global_locale = os.path.join(BASE_DIR, 'locales', f'{lang}.yaml')
    if os.path.exists(global_locale):
        return load_yaml(global_locale)
    raise FileNotFoundError(f"Locale not found: {lang} (checked {app_locale} and {global_locale})")


def get_screenshot_path(app_name: str, filename: str) -> str:
    return os.path.join(BASE_DIR, 'screenshots', app_name, filename)


def get_output_dir(app_name: str, lang: str, device_key: str, output_base: str = None) -> str:
    if output_base is None:
        output_base = os.path.join(BASE_DIR, 'output')
    return os.path.join(output_base, app_name, lang, device_key)
