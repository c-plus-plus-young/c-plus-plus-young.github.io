import os
import json
import re
from datetime import datetime
from pathlib import Path
from PIL import Image

def find_project_root():
    """Print the script location and project structure for clarity"""
    script_path = Path(__file__).resolve()
    script_dir = script_path.parent
    assets_dir = script_dir.parent
    project_root = assets_dir.parent
    
    print(f"\nScript location: {script_path}")
    print(f"Project structure:")
    print(f"{project_root}")
    print(f"└── assets")
    print(f"    ├── images")
    print(f"    └── scripts")
    print(f"        └── update_image_index.py")
    
    return script_dir.parent  # return assets directory

# Get the absolute path to the images directory
assets_dir = find_project_root()  # get assets directory
images_dir = assets_dir / 'images'
index_path = images_dir / 'index.json'

# Categories to scan
categories = [
    "favorites",
    "wildlife",
    "for-sale",
    "portraits",
    "landscape",
    "automotive",
    "game-boy",
    "architecture",
    "macro",
    "paleontology"
]

def extract_date_from_filename(filename):
    """Extract date from filename pattern like '1-category-MM-DD-YYYY'"""
    match = re.search(r'(\d{2})-(\d{2})-(\d{4})', filename)
    if match:
        month, day, year = match.groups()
        try:
            return f"{year}-{month}-{day}"
        except ValueError:
            return None
    return None

def get_image_metadata(file_path):
    """Get image metadata including dimensions and aspect ratio"""
    try:
        with Image.open(file_path) as img:
            width, height = img.size
            aspect_ratio = "portrait" if height > width else "landscape"
            return {
                "width": width,
                "height": height,
                "aspectRatio": aspect_ratio
            }
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def scan_category_directory(directory):
    """Scan directory for .webp files and collect metadata"""
    if not directory.exists():
        return []

    images = []
    for file_path in directory.glob('*.webp'):
        if file_path.is_file():
            filename = file_path.name
            date = extract_date_from_filename(filename)
            metadata = get_image_metadata(file_path)
            
            if metadata:
                images.append({
                    "filename": filename,
                    "date": date,
                    **metadata
                })
    
    # Sort images by date, newest first
    return sorted(images, key=lambda x: x["date"] if x["date"] else "", reverse=True)

def update_index():
    """Update the index.json file with detailed image information"""
    # Create the index dictionary with detailed information
    index = {}
    
    for category in categories:
        category_dir = images_dir / category
        images = scan_category_directory(category_dir)
        index[category] = {
            "count": len(images),
            "images": images
        }
    
    # Write the updated index to file
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2)
    
    print(f"\nUpdated {index_path}")
    print("\nCategory counts:")
    for category, data in index.items():
        print(f"{category}: {data['count']} images")
    
    # Pretty print the counts for verification
    print("\nImage counts:")
    print("-" * 20)
    for category, count in index.items():
        print(f"{category}: {count}")
    
    # Save to index.json
    with open(index_path, 'w') as f:
        json.dump(index, f, indent=2)
    
    print(f"\nIndex updated successfully at: {index_path}")

if __name__ == "__main__":
    print("\nImage Index Update Tool")
    print("=" * 50)
    print("This script can be run from any directory.")
    print("It will update the index.json file in your project's images folder.")
    
    try:
        update_index()
        print("\nTip: You can run this script from any location using:")
        print(f"python {Path(__file__).resolve().relative_to(Path.cwd())}")
    except Exception as e:
        print(f"\nError updating index: {e}")