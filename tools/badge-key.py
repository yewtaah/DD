#!/usr/bin/env python3
"""
badge-key.py - turn a generated event badge into a real transparent WebP tile.

WHY THIS EXISTS
    The image generators used to make these badges paint a "transparency
    checkerboard" into the RGB pixels and hand back a file whose alpha channel
    is 255 everywhere. It LOOKS transparent in a preview and is completely
    opaque on the page - you get a badge sitting on a white waffle.

    This keys the checkerboard out for real, trims, squares and re-encodes.

WHY FLOOD FILL RATHER THAN A COLOUR KEY
    A global "delete every light grey pixel" pass would also delete the white
    lettering, the white rings of the dartboard, and any highlight on the badge
    itself. The badge is one contiguous shape, so a fill seeded from the image
    border can never reach the interior - it eats the checkerboard and stops at
    the badge edge. That constraint is the whole trick.

USAGE
    python tools/badge-key.py IN.png OUT.webp [--size 512]
    python tools/badge-key.py IN.png OUT.webp --debug     # writes OUT.mask.png

    Requires Pillow:  python -m pip install Pillow
"""
import argparse
import os
import sys
from collections import deque

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  python -m pip install Pillow")

# A pixel counts as checkerboard if it is near-neutral (little colour) and
# bright. The badges are saturated gold/brown/red and much darker, so this
# separates cleanly. Tuned against the 2026 badge set.
NEUTRAL_SPREAD = 22     # max(R,G,B) - min(R,G,B) below this = "grey"
BRIGHT_MIN = 218        # luminance at or above this = "light"
EDGE_SOFT_LO = 200      # below this an edge pixel stays fully opaque
EDGE_SOFT_HI = 248      # at or above this an edge pixel goes fully clear


def is_background(p):
    r, g, b = p[0], p[1], p[2]
    if max(r, g, b) - min(r, g, b) > NEUTRAL_SPREAD:
        return False
    return (r + g + b) / 3 >= BRIGHT_MIN


def key(im):
    """Flood fill the checkerboard from the border and punch alpha to 0."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()

    clear = bytearray(w * h)
    q = deque()

    def seed(x, y):
        if not clear[y * w + x] and is_background(px[x, y]):
            clear[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                seed(nx, ny)

    # Hard key.
    for i in range(w * h):
        if clear[i]:
            x, y = i % w, i // w
            r, g, b, _ = px[x, y]
            px[x, y] = (r, g, b, 0)

    # Soften the boundary. Badge edges are anti-aliased AGAINST the
    # checkerboard, so the last opaque ring is part badge, part white. Hard
    # keying leaves a pale fringe; scale those pixels' alpha by how
    # background-like they are.
    softened = 0
    for i in range(w * h):
        if clear[i]:
            continue
        x, y = i % w, i // w
        touches = any(
            0 <= nx < w and 0 <= ny < h and clear[ny * w + nx]
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
        )
        if not touches:
            continue
        r, g, b, a = px[x, y]
        if max(r, g, b) - min(r, g, b) > NEUTRAL_SPREAD:
            continue          # coloured edge pixel - leave it alone
        lum = (r + g + b) / 3
        if lum <= EDGE_SOFT_LO:
            continue
        t = (lum - EDGE_SOFT_LO) / (EDGE_SOFT_HI - EDGE_SOFT_LO)
        px[x, y] = (r, g, b, max(0, min(255, int(a * (1 - min(t, 1.0))))))
        softened += 1

    return im, sum(clear), softened


def square_and_resize(im, size):
    """Trim to content, centre on a square canvas with a small margin, resize."""
    bbox = im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    if bbox:
        im = im.crop(bbox)
    side = max(im.size)
    pad = round(side * 0.04)
    canvas = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    canvas.paste(im, ((canvas.width - im.width) // 2,
                      (canvas.height - im.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--size", type=int, default=512,
                    help="output edge length (default 512, matching the set)")
    ap.add_argument("--quality", type=int, default=88)
    ap.add_argument("--debug", action="store_true",
                    help="also write DST.mask.png showing what was keyed")
    a = ap.parse_args()

    src = Image.open(a.src)
    sw, sh = src.size
    alpha_before = src.convert("RGBA").getchannel("A").getextrema()

    keyed, cleared, softened = key(src)
    total = sw * sh
    if cleared == 0:
        print("WARNING: nothing was keyed. Either the image already has real "
              "alpha, or the background is not a light neutral checkerboard.")
    out = square_and_resize(keyed, a.size)

    os.makedirs(os.path.dirname(os.path.abspath(a.dst)), exist_ok=True)
    out.save(a.dst, "WEBP", quality=a.quality, method=6, exact=False)

    if a.debug:
        mask_path = a.dst + ".mask.png"
        keyed.getchannel("A").save(mask_path)
        print(f"  debug mask -> {mask_path}")

    print(f"{os.path.basename(a.src)}  {sw}x{sh}  alpha in {alpha_before}")
    print(f"  keyed    {cleared:,} px ({100*cleared/total:.1f}%), "
          f"softened {softened:,} edge px")
    print(f"  -> {a.dst}  {a.size}x{a.size}  "
          f"{os.path.getsize(a.dst)/1024:.1f} KB")
    if max(sw, sh) < a.size:
        print(f"  NOTE: source is {sw}x{sh}, smaller than the {a.size}px target - "
              f"this is an upscale and will look softer than the rest of the set.")


if __name__ == "__main__":
    main()
