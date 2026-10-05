"""Post-processing for downloaded media. Run after `npm run scrape`.
- Crops every bottle cut-out to its visible bounds and scales them to the same height, so no bottle looks smaller than the others.
- Writes the aerial film poster. Needs Pillow and ffmpeg."""
from PIL import Image
import glob, os, subprocess
root = os.path.join(os.path.dirname(__file__), "..", "public", "media")
H = 900
for f in sorted(glob.glob(os.path.join(root, "bottles", "*.png"))):
    im = Image.open(f).convert("RGBA")
    bb = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    im = im.crop(bb)
    im = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
    im.save(f, optimize=True)
    print(os.path.basename(f), im.size)
# The origins photograph ships with transparent bands along the top and right; crop to the solid area.
o = os.path.join(root, "history", "origins.webp")
if os.path.exists(o):
    im = Image.open(o).convert("RGBA")
    alpha = im.getchannel("A")
    top = next(y for y in range(im.height) if sum(alpha.crop((0, y, im.width, y + 1)).getdata()) / im.width > 150)
    right = next(x for x in range(im.width - 1, -1, -1) if sum(alpha.crop((x, top, x + 1, im.height)).getdata()) / (im.height - top) > 150) + 1
    im.crop((0, top, right, im.height)).convert("RGB").save(o, quality=90)
    print("origins cropped to", Image.open(o).size)
film = os.path.join(root, "film", "aerial.mp4")
if os.path.exists(film):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", "10", "-i", film, "-frames:v", "1", "-q:v", "3", os.path.join(root, "film", "aerial-poster.jpg")], check=True)
