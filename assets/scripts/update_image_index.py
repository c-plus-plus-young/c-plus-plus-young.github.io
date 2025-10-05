import os
import json
from pathlib import Path

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

def count_webp_files(directory):
    """Count .webp files in the given directory"""
    if not directory.exists():
        return 0
    return len([f for f in directory.glob('*.webp') if f.is_file()])

def update_index():
    """Update the index.json file with current image counts"""
    # Create the index dictionary
    index = {category: count_webp_files(images_dir / category) for category in categories}
    
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