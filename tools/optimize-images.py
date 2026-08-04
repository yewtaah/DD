#!/usr/bin/env python3
"""
optimize-images.py - shrink oversized site imagery.

Photographs and hero art get exported straight off a camera or a generator at
print resolution and dropped into images/. Nothing on the site displays wider
than about 1200 CSS px, so a 5376px JPEG is paying a bandwidth cost for detail
no visitor will ever see.

  --report   list candidates and projected savings, change nothing (default)
  --apply    actually rewrite the files

PNG photographs are converted to WebP, which is the single biggest win: PNG is
lossless and catastrophically inefficient for photographic content. Converting
changes the file extension, so any reference has to be updated - the script
prints exactly which files reference it.

Requires Pillow:  python -m pip install Pillow
"""
import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  python -m pip install Pillow")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(REPO, "images")

MAX_EDGE = 1800      # nothing on the site is displayed anywhere near this wide
JPEG_Q = 82
WEBP_Q = 84
MIN_BYTES = 400_000  # leave small files alone


TEXT_EXT = (".html", ".js", ".md", ".json", ".css", ".txt", ".sql")
SKIP_DIRS = {".git", "node_modules", "assets"}


def load_text_corpus():
    """Every text file in the repo, read once, so reference checks are exact.

    Deliberately NOT shelling out to git. An earlier version of this script did,
    swallowed the failure when git was not resolvable, and reported every image
    as unreferenced - which would have deleted the homepage hero image. A
    detection failure must never look like "nothing uses this".
    """
    corpus = {}
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if not f.lower().endswith(TEXT_EXT):
                continue
            p = os.path.join(root, f)
            try:
                with open(p, "r", encoding="utf-8", errors="replace") as fh:
                    corpus[os.path.relpath(p, REPO).replace("\\", "/")] = fh.read()
            except OSError as e:
                sys.exit(f"cannot read {p}: {e}  (refusing to guess at references)")
    if not corpus:
        sys.exit("no text files found - reference detection is broken, aborting")
    return corpus


CORPUS = None


def referenced_by(basename):
    return sorted(p for p, text in CORPUS.items() if basename in text)


def plan():
    jobs = []
    for name in sorted(os.listdir(IMAGES)):
        path = os.path.join(IMAGES, name)
        if not os.path.isfile(path):
            continue
        ext = os.path.splitext(name)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg"):
            continue
        size = os.path.getsize(path)
        if size < MIN_BYTES:
            continue
        try:
            with Image.open(path) as im:
                w, h = im.size
        except Exception:
            continue
        refs = referenced_by(name)
        # PNG photographs -> WebP. Keep JPEGs as JPEG so references still work.
        to_webp = ext == ".png"
        dst = os.path.splitext(path)[0] + ".webp" if to_webp else path
        jobs.append(dict(path=path, name=name, size=size, w=w, h=h,
                         refs=refs, dst=dst, to_webp=to_webp))
    return jobs


def run(job, apply):
    with Image.open(job["path"]) as im:
        w, h = im.size
        if max(w, h) > MAX_EDGE:
            scale = MAX_EDGE / max(w, h)
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        if job["to_webp"]:
            # An all-255 alpha channel is pure overhead on a photograph.
            if im.mode == "RGBA" and im.getchannel("A").getextrema()[0] == 255:
                im = im.convert("RGB")
            if not apply:
                return None
            im.save(job["dst"], "WEBP", quality=WEBP_Q, method=6)
        else:
            if not apply:
                return None
            im.convert("RGB").save(job["dst"], "JPEG", quality=JPEG_Q,
                                   optimize=True, progressive=True)
    return os.path.getsize(job["dst"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()

    global CORPUS
    CORPUS = load_text_corpus()

    jobs = plan()
    if not jobs:
        print("nothing over the size threshold")
        return

    before = after = 0
    for j in jobs:
        before += j["size"]
        new = run(j, a.apply)
        note = ""
        if j["to_webp"]:
            note = "  -> .webp"
            if j["refs"]:
                note += "  UPDATE REFS: " + ", ".join(j["refs"])
            else:
                note += "  (unreferenced)"
        if a.apply:
            after += new
            # Only ever remove the original when nothing references it. A file
            # that IS referenced keeps its original until the reference is
            # updated by hand - the script will not break a live page.
            if j["to_webp"] and j["dst"] != j["path"] and not j["refs"]:
                os.remove(j["path"])
            print(f"{j['name']:<38} {j['w']}x{j['h']}  "
                  f"{j['size']/1048576:.1f} MB -> {new/1048576:.2f} MB{note}")
        else:
            print(f"{j['name']:<38} {j['w']}x{j['h']}  "
                  f"{j['size']/1048576:.1f} MB{note}")

    print()
    if a.apply:
        print(f"TOTAL  {before/1048576:.1f} MB -> {after/1048576:.1f} MB  "
              f"(saved {(before-after)/1048576:.1f} MB)")
    else:
        print(f"{len(jobs)} candidates, {before/1048576:.1f} MB. "
              f"Re-run with --apply to rewrite.")


if __name__ == "__main__":
    main()
