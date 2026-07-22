#!/usr/bin/env python3
"""A4縦のPDFを、A3横（見開き）に2ページずつ割り付けて出力する。

A4縦（210×297mm）2ページを横に並べると、ちょうどA3横（420×297mm）になる。
これにより「A3用紙・表裏で4面（＝A4 4ページ）」の見開き体裁で印刷・閲覧できる。

使い方:
    python3 scripts/impose-a3.py dist/manual.pdf public/manual.pdf
"""
import sys
import fitz  # PyMuPDF

src_path = sys.argv[1] if len(sys.argv) > 1 else "dist/manual.pdf"
out_path = sys.argv[2] if len(sys.argv) > 2 else "public/manual.pdf"

A4_W, A4_H = 595.276, 841.890  # 210×297mm in pt
A3_W, A3_H = A4_W * 2, A4_H     # A3 landscape = 420×297mm

src = fitz.open(src_path)
out = fitz.open()

# 見開き: (1,2), (3,4), ... の順で左右に配置（読み順のスプレッド）
n = src.page_count
for i in range(0, n, 2):
    page = out.new_page(width=A3_W, height=A3_H)
    # 左ページ
    page.show_pdf_page(fitz.Rect(0, 0, A4_W, A4_H), src, i)
    # 右ページ（存在する場合）
    if i + 1 < n:
        page.show_pdf_page(fitz.Rect(A4_W, 0, A3_W, A4_H), src, i + 1)

out.save(out_path, deflate=True, garbage=4)
print(f"A3 imposed: {out_path}  ({out.page_count} spreads from {n} A4 pages)")
