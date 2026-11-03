"""
Generate short, muted hover-preview clips for every project in the portfolio.

For each video id it streams a ~6 s segment straight from Google Drive (HTTP
range requests, so the full file is never downloaded), scales it down and writes
public/previews/<id>.mp4. Existing clips are skipped unless --force is passed.
Afterwards it rewrites content/previews.json, which the site reads.

Requirements: ffmpeg on PATH, or `pip install imageio-ffmpeg`.

Usage:
    python scripts/make_previews.py                # all videos in data/sample.json
    python scripts/make_previews.py ID [ID ...]    # specific Drive file ids
    python scripts/make_previews.py --force
"""

import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "previews"
MANIFEST = ROOT / "content" / "previews.json"
CLIP_SECONDS = 6


def ffmpeg_exe() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it or run: pip install imageio-ffmpeg")


def drive_url(file_id: str) -> str:
    return f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"


def probe_duration(ff: str, url: str) -> float | None:
    p = subprocess.run([ff, "-hide_banner", "-i", url], capture_output=True, text=True, encoding="utf-8", errors="replace")
    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", p.stderr)
    if not m:
        return None
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def download(file_id: str, dest: Path) -> bool:
    """Fallback when Drive refuses streaming reads: fetch the whole file once."""
    curl = shutil.which("curl")
    if not curl:
        return False
    p = subprocess.run([curl, "-sL", "--fail", "-o", str(dest), drive_url(file_id)])
    return p.returncode == 0 and dest.exists() and dest.stat().st_size > 100_000


def make_clip(ff: str, file_id: str, vertical: bool) -> bool:
    url = drive_url(file_id)
    duration = probe_duration(ff, url)
    if not duration:
        with tempfile.TemporaryDirectory() as tmp:
            local = Path(tmp) / f"{file_id}.mp4"
            if download(file_id, local) and (duration := probe_duration(ff, str(local))):
                return encode(ff, file_id, str(local), duration, vertical)
        print(f"  ! could not read {file_id}")
        return False
    return encode(ff, file_id, url, duration, vertical)


def encode(ff: str, file_id: str, url: str, duration: float, vertical: bool) -> bool:
    # Start about a quarter in: past intros/logos, usually into the strongest footage.
    start = max(0.0, min(duration * 0.25, duration - CLIP_SECONDS - 0.5))
    length = min(CLIP_SECONDS, max(1.0, duration - start))
    scale = "scale=-2:640" if vertical else "scale=640:-2"
    dest = OUT / f"{file_id}.mp4"
    cmd = [
        ff, "-hide_banner", "-loglevel", "error", "-y",
        "-ss", f"{start:.2f}", "-i", url, "-t", f"{length:.2f}",
        "-an", "-vf", f"{scale},fps=25",
        "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-profile:v", "main",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        str(dest),
    ]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if p.returncode != 0 or not dest.exists() or dest.stat().st_size < 10_000:
        print(f"  ! ffmpeg failed for {file_id}: {p.stderr.strip()[:200]}")
        dest.unlink(missing_ok=True)
        return False
    print(f"  ok {file_id}  {dest.stat().st_size // 1024} KB  (from {start:.1f}s of {duration:.1f}s)")
    return True


def write_manifest() -> None:
    ids = sorted(p.stem for p in OUT.glob("*.mp4"))
    MANIFEST.write_text(json.dumps({i: f"/previews/{i}.mp4" for i in ids}, indent=2) + "\n", encoding="utf-8")
    print(f"manifest: {len(ids)} previews -> {MANIFEST.relative_to(ROOT)}")


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    ff = ffmpeg_exe()

    data = json.loads((ROOT / "data" / "sample.json").read_text(encoding="utf-8"))
    orientation = {v["id"]: v.get("orientation") == "vertical" for v in data["videos"]}
    ids = args or list(orientation)

    for i, file_id in enumerate(ids, 1):
        if (OUT / f"{file_id}.mp4").exists() and not force:
            continue
        print(f"[{i}/{len(ids)}] {file_id}")
        make_clip(ff, file_id, orientation.get(file_id, False))

    write_manifest()


if __name__ == "__main__":
    main()
