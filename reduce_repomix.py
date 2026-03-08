#!/usr/bin/env python3
"""Reduce repomix-output.xml by removing files Claude doesn't need."""

import re
import sys

INPUT = "repomix-output.xml"
OUTPUT = "repomix-reduced.xml"

# Extensions to completely exclude
EXCLUDE_EXT = {
    "lrs",    # 69.7 MB - auto-generated Lazarus resource files
    "lfm",    # 43.5 MB - GUI form layout (auto-generated)
    "obj",    #  2.0 MB - object files
    "svg",    #  0.8 MB - images as XML
    "html",   #  4.6 MB - HTML docs
    "htm",    #  0.5 MB - HTML docs
    "lpi",    #  0.8 MB - Lazarus project info (IDE-generated)
    "lpr",    #  0.3 MB - Lazarus project files
    "lpk",    #  0.2 MB - Lazarus package files
    "lps",    #  0.1 MB - Lazarus session files
    "res",    #  0.2 MB - compiled resources
    "po",     #  0.1 MB - translation files
    "dpr",    #        - Delphi project files
    "dproj",  #        - Delphi project files
    "dof",    #        - Delphi option files
    "dfm",    #        - Delphi form files
    "bat",    #        - Windows batch files
    "plist",  #        - macOS plist
    "rsj",    #        - resource string JSON
}

# Path prefixes to exclude entirely (vendored/third-party components)
EXCLUDE_PATHS = [
    "Components/",  # Third-party libraries
]

def get_ext(path):
    if "." in path:
        return path.rsplit(".", 1)[-1].lower()
    return ""

def should_exclude(path):
    for prefix in EXCLUDE_PATHS:
        if path.startswith(prefix):
            return True
    return get_ext(path) in EXCLUDE_EXT

def main():
    print(f"Reading {INPUT}...")
    with open(INPUT, "r", errors="replace") as f:
        content = f.read()

    original_size = len(content)
    kept = 0
    removed = 0
    removed_size = 0

    def replace_file(m):
        nonlocal kept, removed, removed_size
        path = m.group(1)
        if should_exclude(path):
            removed += 1
            removed_size += len(m.group(0))
            return ""
        kept += 1
        return m.group(0)

    print("Filtering files...")
    result = re.sub(
        r'<file path="([^"]+)">(.*?)</file>\n?',
        replace_file,
        content,
        flags=re.DOTALL,
    )

    # Also update the directory_structure section to note filtering
    result = result.replace(
        "</file_summary>",
        f"\n<filtering_note>\n"
        f"This file was filtered to remove {removed} non-essential files.\n"
        f"Removed: {', '.join(sorted(EXCLUDE_EXT))} extensions and Components/ directory.\n"
        f"Kept: {kept} files with source code and essential configuration.\n"
        f"</filtering_note>\n\n</file_summary>",
        1,
    )

    print(f"Writing {OUTPUT}...")
    with open(OUTPUT, "w") as f:
        f.write(result)

    new_size = len(result)
    print(f"\nResults:")
    print(f"  Files kept:    {kept}")
    print(f"  Files removed: {removed}")
    print(f"  Original size: {original_size / 1024 / 1024:.1f} MB")
    print(f"  New size:      {new_size / 1024 / 1024:.1f} MB")
    print(f"  Reduction:     {(1 - new_size / original_size) * 100:.0f}%")

if __name__ == "__main__":
    main()
