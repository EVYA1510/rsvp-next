#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Create a new image with the specified dimensions and background color
width, height = 1200, 630
background_color = "#F7F3EC"  # Light background color as requested

# Create the base image with background
image = Image.new('RGB', (width, height), background_color)

# Load the logo
logo_path = "public/LogoBeThere.png"
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    
    # Calculate the maximum size for the logo (15% margin from edges)
    margin_percentage = 0.15
    max_logo_width = int(width * (1 - 2 * margin_percentage))
    max_logo_height = int(height * (1 - 2 * margin_percentage))
    
    # Resize logo to fit within the margins while maintaining aspect ratio
    logo_aspect = logo.width / logo.height
    target_aspect = max_logo_width / max_logo_height
    
    if logo_aspect > target_aspect:
        # Logo is wider, fit to width
        new_logo_width = max_logo_width
        new_logo_height = int(max_logo_width / logo_aspect)
    else:
        # Logo is taller, fit to height
        new_logo_height = max_logo_height
        new_logo_width = int(max_logo_height * logo_aspect)
    
    logo = logo.resize((new_logo_width, new_logo_height), Image.Resampling.LANCZOS)
    
    # Calculate position to center the logo
    x = (width - new_logo_width) // 2
    y = (height - new_logo_height) // 2
    
    # Paste the logo onto the background
    image.paste(logo, (x, y), logo if logo.mode == 'RGBA' else None)
    
    # Save the image
    output_path = "public/site-og.png"
    image.save(output_path, 'PNG', quality=95)
    print(f"Open Graph image created successfully: {output_path}")
    print(f"Dimensions: {width}x{height} pixels")
    print(f"Aspect ratio: {width/height:.2f}:1")
    print(f"Logo size: {new_logo_width}x{new_logo_height} pixels")
    print(f"Logo position: ({x}, {y})")
else:
    print(f"Logo file not found: {logo_path}")
