"""Device frame renderer — programmatic rounded rectangles with shadows."""

from PIL import Image, ImageDraw, ImageFilter

from .background import hex_to_rgb


def create_rounded_mask(width: int, height: int, radius: int) -> Image.Image:
    """Create a rounded rectangle mask (white=visible, black=hidden)."""
    mask = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(
        [(0, 0), (width - 1, height - 1)],
        radius=radius,
        fill=255,
    )
    return mask


def apply_rounded_corners(img: Image.Image, radius: int) -> Image.Image:
    """Apply rounded corners to an image, returning RGBA."""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    mask = create_rounded_mask(img.width, img.height, radius)
    result = Image.new('RGBA', img.size, (0, 0, 0, 0))
    result.paste(img, (0, 0), mask)
    return result


def create_device_frame(
    screenshot: Image.Image,
    corner_radius: int = 40,
    bezel_width: int = 16,
    bezel_color: str = "#1C1C1E",
    show_frame: bool = True,
) -> Image.Image:
    """
    Create a device-framed screenshot.
    
    Args:
        screenshot: The screenshot image
        corner_radius: Corner radius of the device
        bezel_width: Width of the bezel border
        bezel_color: Hex color of the bezel
        show_frame: If False, just apply rounded corners (frameless mode)
    
    Returns:
        RGBA image with device frame applied
    """
    sw, sh = screenshot.size

    if not show_frame:
        # Frameless mode: just rounded corners
        return apply_rounded_corners(screenshot, corner_radius)

    # Frame mode: bezel + screenshot + rounded corners
    bw = bezel_width
    frame_w = sw + bw * 2
    frame_h = sh + bw * 2
    outer_radius = corner_radius + bw
    bezel_rgb = hex_to_rgb(bezel_color)

    # Create frame background
    frame = Image.new('RGBA', (frame_w, frame_h), (0, 0, 0, 0))
    
    # Draw outer rounded rectangle (bezel)
    outer_mask = create_rounded_mask(frame_w, frame_h, outer_radius)
    bezel_layer = Image.new('RGBA', (frame_w, frame_h), (*bezel_rgb, 255))
    frame.paste(bezel_layer, (0, 0), outer_mask)
    
    # Apply rounded corners to screenshot
    rounded_ss = apply_rounded_corners(screenshot, corner_radius)
    
    # Paste screenshot into frame
    frame.paste(rounded_ss, (bw, bw), rounded_ss)
    
    return frame


def add_drop_shadow(
    img: Image.Image,
    shadow_offset: tuple[int, int] = (0, 15),
    shadow_blur: int = 30,
    shadow_opacity: float = 0.4,
    shadow_color: tuple[int, int, int] = (0, 0, 0),
) -> Image.Image:
    """
    Add a drop shadow to an RGBA image.
    Returns a larger RGBA image with shadow.
    """
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Expand canvas for shadow
    expand = shadow_blur * 2 + max(abs(shadow_offset[0]), abs(shadow_offset[1]))
    new_w = img.width + expand * 2
    new_h = img.height + expand * 2

    # Create shadow from alpha channel
    alpha = img.getchannel('A')
    shadow = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
    shadow_alpha = Image.new('L', (new_w, new_h), 0)
    
    sx = expand + shadow_offset[0]
    sy = expand + shadow_offset[1]
    shadow_alpha.paste(alpha, (sx, sy))
    
    # Blur the shadow
    shadow_alpha = shadow_alpha.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    # Apply opacity
    shadow_alpha = shadow_alpha.point(lambda p: int(p * shadow_opacity))
    
    # Create colored shadow
    shadow_color_layer = Image.new('RGB', (new_w, new_h), shadow_color)
    shadow = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
    shadow.paste(shadow_color_layer, (0, 0), shadow_alpha)
    
    # Composite original on top
    shadow.paste(img, (expand, expand), img)
    
    return shadow, expand  # Return expand offset for positioning
