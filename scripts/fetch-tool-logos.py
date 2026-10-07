#!/usr/bin/env python3
"""Download the logos for the home page's tooling strip into public/tools/.

The registry is content/tools.json. Each tool's `source` is one of:
  {"url": ...}                          an official logo, usually from SVGL (https://svgl.app),
                                        dark-background variant where one exists
  {"simpleIcons": slug, "color": hex}   Simple Icons (https://simpleicons.org), filled with the brand colour
  {"svg": ...}                          inline SVG
`viewBox` crops a logo that sits in a lot of empty canvas, so its visual weight matches the rest.

Usage: python3 scripts/fetch-tool-logos.py [tool-id ...]   (no ids: every tool)
"""
import json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "tools"
SIMPLE = "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/"

def fetch(source):
    if "svg" in source:
        return source["svg"]
    if "simpleIcons" in source:
        svg = urllib.request.urlopen(SIMPLE + source["simpleIcons"] + ".svg").read().decode()
        return svg.replace("<svg ", f'<svg fill="{source["color"]}" ', 1)
    req = urllib.request.Request(source["url"], headers={"User-Agent": "fetch-tool-logos"})
    return urllib.request.urlopen(req).read().decode()

def main():
    tools = json.loads((ROOT / "content" / "tools.json").read_text())["tools"]
    ids = sys.argv[1:] or list(tools)
    unknown = [i for i in ids if i not in tools]
    assert not unknown, f"not in content/tools.json: {unknown}"
    OUT.mkdir(parents=True, exist_ok=True)
    for tid in ids:
        svg = fetch(tools[tid]["source"])
        if "viewBox" in tools[tid]:
            svg = re.sub(r'viewBox="[^"]*"', f'viewBox="{tools[tid]["viewBox"]}"', svg, count=1)
        (OUT / f"{tid}.svg").write_text(svg)
        print(f"  {tid}")
    print(f"{len(ids)} logos -> {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
