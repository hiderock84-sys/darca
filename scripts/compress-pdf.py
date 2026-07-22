#!/usr/bin/env python3
"""PDF の埋め込み画像だけを再圧縮・縮小して軽量化する（テキスト層・色帯は保持）。

Copilot 等のオンライン変換サービスはファイルサイズ上限が小さいことがあるため、
写真を JPEG 化・縮小してサイズを下げる。ページ内容（グラデーション帯・文字）は
そのまま保持するため、画像 XObject を個別に差し替える方式を使う。

使い方: python3 scripts/compress-pdf.py public/manual-a4.pdf public/manual-copilot.pdf
"""
import io
import os
import sys

import fitz
from PIL import Image

src = sys.argv[1] if len(sys.argv) > 1 else "public/manual-a4.pdf"
out = sys.argv[2] if len(sys.argv) > 2 else "public/manual-copilot.pdf"
MAXW = int(sys.argv[3]) if len(sys.argv) > 3 else 1000
QUALITY = int(sys.argv[4]) if len(sys.argv) > 4 else 72

d = fitz.open(src)
seen = set()
for page in d:
    for im in list(page.get_images(full=True)):
        xref = im[0]
        if xref in seen:
            continue
        seen.add(xref)
        try:
            pix = fitz.Pixmap(d, xref)
            if pix.n >= 5:  # CMYK 等
                pix = fitz.Pixmap(fitz.csRGB, pix)
            mode = "RGBA" if pix.alpha else "RGB"
            img = Image.frombytes(mode, (pix.width, pix.height), pix.samples).convert("RGB")
            if img.width > MAXW:
                img = img.resize((MAXW, round(img.height * MAXW / img.width)), Image.LANCZOS)
            buf = io.BytesIO()
            img.save(buf, "JPEG", quality=QUALITY)
            page.replace_image(xref, stream=buf.getvalue())
        except Exception as e:
            sys.stderr.write(f"skip {xref}: {e}\n")

d.save(out, garbage=4, deflate=True)
print(f"compressed: {out}  ({round(os.path.getsize(out) / 1e6, 2)} MB, {d.page_count} pages)")
