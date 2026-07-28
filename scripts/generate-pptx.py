#!/usr/bin/env python3
"""編集可能・スタイリッシュで、冊子と同程度の枚数の PowerPoint を生成する。

各章＝写真ヘッダー付きスライド。本文は2段組で流し込み、長い章だけ複数枚に分割。
表紙・章扉の雰囲気は写真ヘッダー＋色帯で表現。文字はすべて編集可能。

前提: npx tsx scripts/dump-manual.ts scripts/manual.json
使い方: python3 scripts/generate-pptx.py scripts/manual.json public/manual.pptx
"""
import io
import json
import math
import os
import sys

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Inches, Mm, Pt

JSON_PATH = sys.argv[1] if len(sys.argv) > 1 else "scripts/manual.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/manual.pptx"
IMG_DIR = "src/assets/manual"

NAVY = RGBColor(0x14, 0x27, 0x44)
NAVY2 = RGBColor(0x1B, 0x33, 0x58)
GREEN = RGBColor(0x2F, 0x9E, 0x6B)
WARM = RGBColor(0xD6, 0x9A, 0x5C)
WARM_D = RGBColor(0xB0, 0x6A, 0x2C)
BLUE = RGBColor(0x3A, 0x86, 0xC4)
RED = RGBColor(0xC0, 0x5C, 0x5C)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
CREAM = RGBColor(0xF3, 0xE7, 0xD4)
INK = RGBColor(0x24, 0x2C, 0x3A)
GRAY = RGBColor(0x5B, 0x66, 0x76)
BG = RGBColor(0xF6, 0xF8, 0xFB)

data = json.load(open(JSON_PATH, encoding="utf-8"))

# 用紙サイズ: 既定は縦A4。第3引数に wide / 16x9 を指定すると横16:9。
SIZE = (sys.argv[3] if len(sys.argv) > 3 else "a4").lower()

prs = Presentation()
if SIZE in ("wide", "16x9", "169", "16:9"):
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    PW, PH, MG = 338.67, 190.5, 14.0
    NCOL = 2
else:  # A4 縦（ポートレート）
    prs.slide_width = Mm(210)
    prs.slide_height = Mm(297)
    PW, PH, MG = 210.0, 297.0, 16.0
    NCOL = 1
CW = PW - 2 * MG
GAP = 8.0
BLANK = prs.slide_layouts[6]

# 第4引数 onepage で「1章1ページ」試作モード
MODE = (sys.argv[4] if len(sys.argv) > 4 else "").lower()
ONEPAGE = MODE in ("onepage", "1page", "one")


def col_width():
    return CW if NCOL == 1 else (CW - GAP) / 2


def blk(t, **k):
    d = {"t": t, "size": 10.5, "bold": False, "color": INK,
         "italic": False, "sb": 0, "sa": 4, "cpl": 24}
    d.update(k)
    return d


def set_ea(run, name="Yu Gothic"):
    run.font.name = name
    rPr = run._r.get_or_add_rPr()
    ea = rPr.find(qn("a:ea"))
    if ea is None:
        ea = rPr.makeelement(qn("a:ea"), {})
        rPr.append(ea)
    ea.set("typeface", name)


def slide():
    return prs.slides.add_slide(BLANK)


def rect(s, x, y, w, h, fill, alpha=None):
    shp = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Mm(x), Mm(y), Mm(w), Mm(h))
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.fill.background()
    shp.shadow.inherit = False
    if alpha is not None:
        srgb = shp.fill.fore_color._xFill.find(qn("a:srgbClr"))
        srgb.append(srgb.makeelement(qn("a:alpha"), {"val": str(int(alpha * 1000))}))
    return shp


def tbox(s, x, y, w, h, cols=1, anchor=MSO_ANCHOR.TOP):
    tb = s.shapes.add_textbox(Mm(x), Mm(y), Mm(w), Mm(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Mm(2)
    tf.margin_right = Mm(2)
    tf.margin_top = Mm(1)
    tf.margin_bottom = Mm(1)
    tf.vertical_anchor = anchor
    if cols > 1:
        bodyPr = tf._txBody.find(qn("a:bodyPr"))
        bodyPr.set("numCol", str(cols))
        bodyPr.set("spcCol", str(int(Mm(7))))
    return tf


def addrun(p, text, size, bold, color, italic=False):
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    set_ea(r)
    return r


def para(tf, text, *, size=10.5, bold=False, color=INK, bullet=False, italic=False,
         sb=0, sa=4, first=False, align=None):
    p = tf.paragraphs[0] if (first and not tf.paragraphs[0].runs) else tf.add_paragraph()
    p.space_before = Pt(sb)
    p.space_after = Pt(sa)
    p.line_spacing = 1.16
    if align is not None:
        p.alignment = align
    addrun(p, ("・" + text) if bullet else text, size, bold, color, italic)
    return p


def img_data(name, max_w=1600):
    for ext in (".webp", ".jpg", ".png"):
        path = os.path.join(IMG_DIR, name + ext)
        if os.path.exists(path):
            try:
                im = Image.open(path).convert("RGB")
                if im.width > max_w:
                    im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
                buf = io.BytesIO()
                im.save(buf, "JPEG", quality=82)
                buf.seek(0)
                return buf, im.width / im.height
            except Exception as e:
                sys.stderr.write(f"img fail {name}: {e}\n")
    return None, None


def photo_cover(s, name, x, y, w, h):
    st, ratio = img_data(name)
    if not st:
        rect(s, x, y, w, h, NAVY)
        return
    box_ratio = w / h
    if ratio > box_ratio:
        ph = h; pw = h * ratio; px = x - (pw - w) / 2; py = y
    else:
        pw = w; ph = w / ratio; px = x; py = y - (ph - h) / 2
    pic = s.shapes.add_picture(st, Mm(px), Mm(py), width=Mm(pw), height=Mm(ph))
    # crop to box
    cl = max(0, (px * -1 + x)) / pw if pw else 0
    cr = max(0, (px + pw - (x + w))) / pw if pw else 0
    ct = max(0, (py * -1 + y)) / ph if ph else 0
    cb = max(0, (py + ph - (y + h))) / ph if ph else 0
    pic.crop_left = cl; pic.crop_right = cr; pic.crop_top = ct; pic.crop_bottom = cb
    pic.left = Mm(x); pic.top = Mm(y); pic.width = Mm(w); pic.height = Mm(h)


# ---- ブロック収集（1章分の段落仕様を作る） ----
def blocks_of(ch):
    B = []

    def head(t):
        B.append({"t": t, "size": 12.5, "bold": True, "color": NAVY2, "sb": 4, "sa": 3, "cpl": 20})

    def body(t, **k):
        B.append({"t": t, "size": 10.5, "color": INK, "sa": 4, "cpl": 24, **k})

    for t in ch.get("lead", []):
        body(t, bold=True, color=NAVY2, size=11, sa=5)

    for key in ch:
        if key in ("no", "id", "title", "catch", "lead"):
            continue
        v = ch[key]
        if key == "sections":
            for sec in v:
                head(sec["heading"])
                for b in sec["body"]:
                    body(b)
        elif key == "points":
            head("POINT")
            for it in v:
                body(f'● {it["title"]}：{it["body"]}')
        elif key in ("cycle", "flow"):
            head(v["title"])
            for i, st in enumerate(v["steps"], 1):
                body(f'{i}. {st["title"]}　{st.get("note","")}', bold=True, color=NAVY2, sa=2)
            if v.get("caption"):
                body(v["caption"], size=9, color=GRAY)
        elif key in ("column", "boundary", "craft", "consult", "lesson"):
            head(f'{v.get("label","")}　{v.get("title","")}'.strip())
            bd = v.get("body", [])
            for b in (bd if isinstance(bd, list) else [bd]):
                body(b)
        elif key == "checklist":
            head(v["title"])
            for it in v["items"]:
                body("☐ " + it, sa=2)
            if v.get("caption"):
                body(v["caption"], size=9, color=GRAY)
        elif key == "examples":
            head(v["title"])
            for it in v["items"]:
                body(f'✕ {it["do"]}　→　{it["instead"]}', sa=2)
        elif key == "patterns":
            head(v["title"])
            for it in v["items"]:
                body(f'● {it["title"]}：{it["note"]}', sa=2)
        elif key in ("compare", "saylist"):
            head(v["title"])
            if key == "saylist":
                pairs = [("○ " + v["good"]["title"], v["good"]["items"], GREEN),
                         ("✕ " + v["bad"]["title"], v["bad"]["items"], RED)]
            else:
                pairs = [("✕ " + v["left"]["title"], v["left"]["items"], RED),
                         ("○ " + v["right"]["title"], v["right"]["items"], GREEN)]
            for name, items, col in pairs:
                body(name, bold=True, color=col, sa=1, sb=2)
                for it in items:
                    body("・" + it, sa=1)
        elif key == "safety":
            head("⚠ " + v["label"])
            body(v["body"])
        elif key == "impersonation":
            head(v["label"])
            body(v["body"])
        elif key in ("note", "reasonNote"):
            body(v, bold=True, color=NAVY2)
        elif key == "cases":
            for c in v:
                head(f'{c["label"]}　{c.get("from","")}')
                for b in c["body"]:
                    body(b)
        elif key == "dont":
            head(v["title"])
            for it in v["items"]:
                body(f'✕ {it["title"]}：{it["note"]}', sa=2)
        elif key == "do":
            head(v["title"])
            for it in v["items"]:
                body(f'✓ {it["title"]}：{it["note"]}', sa=2)
        elif key in ("recovered", "relapsed"):
            col = GREEN if v.get("tone") == "do" else RED
            head(f'{v["label"]}　{v.get("person","")}')
            for b in v["story"]:
                body(b)
            if v.get("result"):
                body("結果：" + v["result"], bold=True, color=NAVY2)
        elif key == "benefits":
            head("家族会に参加すると")
            for b in v:
                body(f'● {b["title"]}：{b["body"]}')
        elif key == "voices":
            head(v["title"])
            for it in v["items"]:
                body("“" + it.strip("「」") + "”", italic=True, color=BLUE, sa=2)
        elif key == "program":
            head(v["title"])
            for it in v["items"]:
                body(f'● {it["title"]}：{it["body"]}')
        elif key == "info":
            head(v["title"])
            for row in v["rows"]:
                body(f'{row["label"]}：{row["value"]}', sa=2)
            head("家族会 当日の流れ")
            for i, t in enumerate([
                "受付・送迎（JR相模原駅北口 12:45・13:00発）",
                "開会（13:30）／エキスパート講演会",
                "家族ミーティング（言いっぱなし・聞きっぱなし）",
                "当事者スタッフ面談／閉会（17:00・送迎あり）",
            ], 1):
                body(f"{i}. {t}", sa=2)
        elif key == "groups":
            for g in v:
                for it in g["items"]:
                    B.append({"t": "Q " + it["q"], "size": 10.5, "bold": True, "color": NAVY2, "sb": 3, "sa": 1, "cpl": 22})
                    B.append({"t": "A " + it["a"], "size": 10, "color": INK, "sa": 3, "cpl": 24})
    return B


def est_lines(b, col_w=None):
    # 列幅(mm)と文字サイズから、実際の折り返し行数を推定する
    if col_w is None:
        col_w = col_width()
    size = b.get("size", 10.5)
    cpl = max(8, (col_w - 4) / (size * 0.3528))  # 全角1文字≒サイズpt×0.3528mm
    extra = 1 if b.get("bold") and size >= 12 else 0
    return max(1, math.ceil(len(b["t"]) / cpl)) + extra


def band(s, no, title):
    rect(s, 0, 0, PW, 20, NAVY2)
    rect(s, 0, 0, 5, 20, WARM)
    tf = tbox(s, MG + 3, 1, CW, 18, anchor=MSO_ANCHOR.MIDDLE)
    para(tf, f"{no}　{title}", size=13, bold=True, color=WHITE, first=True, sa=0)


def render_blocks_to(tf, blocks, scale=1.0):
    for i, b in enumerate(blocks):
        para(tf, b["t"], size=b.get("size", 10.5) * scale, bold=b.get("bold", False),
             color=b.get("color", INK), italic=b.get("italic", False),
             sb=b.get("sb", 0) * scale, sa=b.get("sa", 4) * scale, first=(i == 0))


def render_cols(s, x, y, w, h, blocks, scale=1.0, anchor=MSO_ANCHOR.MIDDLE):
    """A4(縦)は1段組、横16:9は2段組で本文を流し込む。"""
    if NCOL == 1:
        tf = tbox(s, x, y, w, h, anchor=anchor)
        render_blocks_to(tf, blocks, scale)
        return
    gap = GAP
    cw = (w - gap) / 2
    total = sum(est_lines(b, cw) for b in blocks)
    half = total / 2
    left, right = [], []
    acc = 0
    for b in blocks:
        if acc < half or not left:
            left.append(b)
            acc += est_lines(b, cw)
        else:
            right.append(b)
    lt = tbox(s, x, y, cw, h, anchor=anchor)
    render_blocks_to(lt, left, scale)
    if right:
        rt = tbox(s, x + cw + gap, y, cw, h, anchor=anchor)
        render_blocks_to(rt, right, scale)


def block_height(b, cw, scale):
    """1ブロックが占める高さ(mm)を、折り返し行・行間・段落前後の余白込みで見積もる。"""
    size = b.get("size", 10.5) * scale
    cpl = max(6, (cw - 4) / (size * 0.3528))
    lines = max(1, math.ceil(len(b["t"]) / cpl))
    if b.get("bold") and b.get("size", 10.5) >= 12:
        lines += 1
    lh = size * 1.16 * 0.3528  # 1行の高さ(mm)
    gaps = (b.get("sa", 4) + b.get("sb", 0)) * scale * 0.3528
    return lines * lh + gaps


def fit_scale(blocks, usable_h, cw):
    """本文が usable_h(mm) に収まる最大の文字倍率を探索する。"""
    if not blocks:
        return 1.0
    target = usable_h * 0.95
    s = 1.0
    while s > 0.36:
        total = sum(block_height(b, cw, s) for b in blocks) * 1.12 / NCOL
        if total <= target:
            return round(s, 3)
        s -= 0.02
    return 0.36


def one_page(no, title, catch, imgname, blocks, header="photo"):
    """1つの節・章を、写真ヘッダー(または帯)＋自動縮小の本文で1ページに収める。"""
    s = slide()
    rect(s, 0, 0, PW, PH, BG)
    if header == "photo" and imgname:
        H = 46
        photo_cover(s, imgname, 0, 0, PW, H)
        rect(s, 0, 0, PW, H, NAVY, alpha=46)
        rect(s, 0, 0, 5, H, WARM)
        htf = tbox(s, MG + 4, 7, CW - 8, H - 11, anchor=MSO_ANCHOR.MIDDLE)
        para(htf, no, size=12, bold=True, color=WARM, first=True, sa=2)
        para(htf, title, size=22, bold=True, color=WHITE, sa=2)
        if catch:
            para(htf, catch, size=12, bold=True, color=CREAM, sa=0)
        cy = H + 5
    else:
        band(s, no, title)
        cy = 25
    cw = col_width()
    usable_h = PH - MG - cy
    scale = fit_scale(blocks, usable_h, cw)
    render_cols(s, MG, cy, CW, usable_h, blocks, scale=scale, anchor=MSO_ANCHOR.TOP)
    return s


# ---- 1章1ページ（充填・分割）用のヘルパー ----
RECOVERY_POOL = [
    "family-circle", "hands-support", "consult-hand", "walking-together",
    "seminar", "staff-smile", "seedling-dawn", "calm-thread", "path-fork",
    "boundary", "entrance-back", "facility",
]
FILLER_CAP = {
    "family-circle": "同じ思いのご家族が集う、家族会のイメージ",
    "hands-support": "ひとりで抱えず、支え合いながら",
    "consult-hand": "家族相談は初回無料。まずはご連絡ください",
    "walking-together": "回復の道を、ともに歩む",
    "seminar": "相模原ダルクの家族会・家族セミナー",
    "staff-smile": "回復を経験した当事者スタッフが伴走します",
    "seedling-dawn": "回復は、少しずつ育っていく",
    "calm-thread": "こころに、静かなつながりを",
    "path-fork": "どの道に進むかは、家族の関わりが左右します",
    "boundary": "境界線 ── お互いを尊重するための、しなやかな線",
    "entrance-back": "相模原ダルク デイケアセンター",
    "facility": "相模原ダルク デイケアセンター（ダルクビル）",
}


def content_height_mm(blocks, cw, scale):
    return sum(block_height(b, cw, scale) for b in blocks) * 1.12 / NCOL


def photo_header(s, no, title, catch, imgname, H=46):
    if imgname:
        photo_cover(s, imgname, 0, 0, PW, H)
        rect(s, 0, 0, PW, H, NAVY, alpha=46)
        rect(s, 0, 0, 5, H, WARM)
        htf = tbox(s, MG + 4, 7, CW - 8, H - 11, anchor=MSO_ANCHOR.MIDDLE)
        para(htf, no, size=12, bold=True, color=WARM, first=True, sa=2)
        para(htf, title, size=22, bold=True, color=WHITE, sa=2)
        if catch:
            para(htf, catch, size=12, bold=True, color=CREAM, sa=0)
        return H + 5
    band(s, no, title)
    return 25


def photo_band(s, name, x, y, w, h, caption=None):
    photo_cover(s, name, x, y, w, h)
    if caption:
        ch = 9
        rect(s, x, y + h - ch, w, ch, NAVY, alpha=48)
        ctf = tbox(s, x + 3, y + h - ch, w - 6, ch, anchor=MSO_ANCHOR.MIDDLE)
        para(ctf, caption, size=8.5, color=WHITE, first=True, sa=0)


def add_qr(s, x, y, size, label=None):
    path = os.path.join(IMG_DIR, "qr-family.png")
    if not os.path.exists(path):
        return
    rect(s, x - 2.5, y - 2.5, size + 5, size + 5, WHITE)
    s.shapes.add_picture(path, Mm(x), Mm(y), width=Mm(size), height=Mm(size))
    if label:
        ltf = tbox(s, x - 6, y + size + 1.5, size + 12, 12)
        para(ltf, label, size=9, bold=True, color=NAVY2,
             align=PP_ALIGN.CENTER, first=True, sa=0)


def chapter_page(no, title, catch, header_img, blocks, filler_img=None):
    """1章を1ページに。短ければ画像で充填、多すぎれば2ページに分割する。"""
    HEADER = 46
    cw = col_width()
    scale = fit_scale(blocks, PH - MG - (HEADER + 5), cw)
    if scale < 0.7:  # 文章量が多い → 読みやすさ優先で2ページ
        total = content_height_mm(blocks, cw, 0.95)
        half, acc, split = total / 2, 0.0, 1
        for idx, b in enumerate(blocks):
            acc += block_height(b, cw, 0.95) * 1.12 / NCOL
            if acc >= half:
                split = idx + 1
                break
        for si, chunk in enumerate((blocks[:split], blocks[split:])):
            s = slide()
            rect(s, 0, 0, PW, PH, BG)
            cy = photo_header(s, no, title, catch, header_img if si == 0 else None, HEADER)
            uh = PH - MG - cy
            sc = min(1.0, max(0.7, fit_scale(chunk, uh, cw)))
            render_cols(s, MG, cy, CW, uh, chunk, scale=sc, anchor=MSO_ANCHOR.TOP)
        return
    # 1ページに収める
    s = slide()
    rect(s, 0, 0, PW, PH, BG)
    cy = photo_header(s, no, title, catch, header_img, HEADER)
    usable_h = PH - MG - cy
    sc = min(1.0, scale)
    render_cols(s, MG, cy, CW, usable_h, blocks, scale=sc, anchor=MSO_ANCHOR.TOP)
    ch = content_height_mm(blocks, cw, sc)
    remain = usable_h - ch
    if filler_img and remain > 42:  # 大きく余る → 画像でがっちり埋める
        top = cy + ch + 4
        ih = PH - MG - top
        if ih >= 36:
            photo_band(s, filler_img, MG, top, CW, ih, caption=FILLER_CAP.get(filler_img))
    return s


def chapter_slides(no, title, catch, imgname):
    """写真ヘッダー付き1枚目＋（必要なら）続き。2段組で本文を流す。"""
    ch = chdict[no]
    blocks = blocks_of(ch)
    cw = col_width()
    total = sum(est_lines(b, cw) for b in blocks)
    HEADER = 52  # 1枚目の写真ヘッダー高さ
    LH = 6.2     # 1行あたりの高さ目安(mm)
    cap_first = int((PH - MG - (HEADER + 5)) / LH) * NCOL
    cap_cont = int((PH - MG - 25) / LH) * NCOL
    # スライド数を決める
    n = 1
    while True:
        cap_total = cap_first + (n - 1) * cap_cont
        if total <= cap_total or n >= 6:
            break
        n += 1
    # 均等配分
    per = math.ceil(total / n)
    chunks = [[]]
    acc = 0
    for b in blocks:
        if acc >= per and len(chunks) < n:
            chunks.append([])
            acc = 0
        chunks[-1].append(b)
        acc += est_lines(b, cw)
    for si, chunk in enumerate(chunks):
        s = slide()
        rect(s, 0, 0, PW, PH, BG)
        if si == 0:
            photo_cover(s, imgname, 0, 0, PW, HEADER)
            rect(s, 0, 0, PW, HEADER, NAVY, alpha=46)
            rect(s, 0, 0, 5, HEADER, WARM)
            htf = tbox(s, MG + 4, 8, CW - 8, HEADER - 12, anchor=MSO_ANCHOR.MIDDLE)
            para(htf, no, size=12, bold=True, color=WARM, first=True, sa=2)
            para(htf, title, size=24, bold=True, color=WHITE, sa=2)
            if catch:
                para(htf, catch, size=12.5, bold=True, color=CREAM, sa=0)
            cy = HEADER + 5
        else:
            band(s, no, title)
            cy = 25
        render_cols(s, MG, cy, CW, PH - MG - cy, chunk)


chdict = {c["no"]: c for c in data["chapters"]}
FALLBACK = ["hands-support", "seedling-dawn", "path-fork", "boundary", "calm-thread", "consult-hand"]


def hero_full(name, no, title, catch, *, center=False):
    s = slide()
    photo_cover(s, name, 0, 0, PW, PH)
    rect(s, 0, 0, PW, PH, NAVY, alpha=54)
    if center:
        tf = tbox(s, PW * 0.1, PH * 0.3, PW * 0.8, PH * 0.4, anchor=MSO_ANCHOR.MIDDLE)
        al = PP_ALIGN.CENTER
    else:
        rect(s, 0, 0, 6, PH, WARM)
        tf = tbox(s, MG + 5, PH * 0.52, PW * 0.82, PH * 0.4, anchor=MSO_ANCHOR.TOP)
        al = PP_ALIGN.LEFT
    if no:
        para(tf, no, size=13, bold=True, color=WARM, first=True, sa=4, align=al)
    para(tf, title, size=30 if not center else 36, bold=True, color=WHITE, sa=5, align=al, first=(not no))
    if catch:
        para(tf, catch, size=15, bold=True, color=CREAM, sa=0, align=al)
    return s


def build_one_page_deck():
    # --- 表紙（全面写真） ---
    cv = data["cover"]
    s = slide()
    photo_cover(s, data["images"]["cover"], 0, 0, PW, PH)
    rect(s, 0, 0, PW, PH, NAVY, alpha=55)
    rect(s, 0, 0, 6, PH, WARM)
    tf = tbox(s, MG + 6, PH * 0.24, PW * 0.86, PH * 0.5)
    para(tf, cv["category"], size=14, bold=True, color=CREAM, first=True, sa=8)
    for line in cv["title"].split("\n"):
        para(tf, line, size=34, bold=True, color=WHITE, sa=3)
    para(tf, cv["subtitle"], size=13, color=RGBColor(0xEA, 0xF1, 0xF8), sb=8, sa=0)
    tf2 = tbox(s, MG + 6, PH - 18, CW, 13)
    para(tf2, data["org"]["name"], size=13, bold=True, color=WHITE, first=True, sa=0)

    # --- 導入ストーリー ---
    st = data["openingStory"]
    sb = [blk(st["lead"], size=11, bold=True, italic=True, color=NAVY2, sa=6)]
    for t in st["paragraphs"]:
        q = t.startswith("「")
        sb.append(blk(t, size=10.5, bold=q, color=NAVY2 if q else INK, sa=5))
    for t in st["closing"]:
        sb.append(blk(t, size=10.5, bold=True, color=NAVY2, sa=4))
    chapter_page(st["chapterLabel"], st["title"], "", data["images"]["story"], sb,
                 filler_img="hands-support")

    # --- はじめに ---
    pf = data["preface"]
    pb = [blk(t, size=12, sa=8) for t in pf["paragraphs"]]
    chapter_page("はじめに", pf["title"], "", None, pb, filler_img="family-circle")

    # --- 第1〜11章（各1ページ。短い章は画像で充填、多い章は2ページ許容） ---
    used = set()
    for idx, ch in enumerate(data["chapters"]):
        header = data["chapterImages"].get(ch["id"]) or FALLBACK[idx % len(FALLBACK)]
        used.add(header)
        filler = next((n for n in RECOVERY_POOL if n != header and n not in used), None)
        if filler:
            used.add(filler)
        chapter_page(ch["no"], ch["title"], ch.get("catch", ""), header,
                     blocks_of(ch), filler_img=filler)

    # --- 私たちが伴走する理由 ---
    wr = data["walkReason"]
    wb = [blk(t, size=11.5, sa=5) for t in wr["body"]]
    wb.append(blk(wr["philosophyLabel"], size=11, bold=True, color=GREEN, sb=4, sa=1))
    wb.append(blk(wr["philosophy"], size=12.5, bold=True, color=NAVY2, sa=5))
    wb += [blk(t, size=11, sa=5) for t in wr["body2"]]
    wb += [blk(t, size=12, bold=True, color=NAVY2, sa=3) for t in wr["closing"]]
    wb.append(blk(wr["tagline"] + "　" + wr["taglineSub"], size=15,
                  bold=True, color=WARM_D, sb=5, sa=0))
    chapter_page(wr["label"], wr["title"], wr["headline"], data["images"]["walking"], wb,
                 filler_img="staff-smile")

    # --- 約束 ---
    pr = data["promise"]
    prb = [blk(t, size=11, sa=5) for t in pr["paragraphs"]]
    prb += [blk(f'◆ {p["title"]}：{p["note"]}', size=11, bold=True, color=GREEN, sa=3)
            for p in pr["pledges"]]
    prb.append(blk(pr["finalMessage"], size=13.5, bold=True, color=NAVY2, sb=5, sa=2))
    prb.append(blk(pr["signoff"], size=12, bold=True, color=NAVY2, sa=0))
    chapter_page(pr["chapterLabel"], pr["title"], "", data["images"]["walking"], prb,
                 filler_img="seedling-dawn")

    # --- お問い合わせ（裏表紙）＝ 連絡先＋QR＋ダルクビル ---
    bc = data["backCover"]
    s = slide()
    rect(s, 0, 0, PW, PH, BG)
    band(s, "CONTACT", "お問い合わせ")
    # 左：連絡先
    info_w = CW * 0.60
    tf = tbox(s, MG, 30, info_w, 150, anchor=MSO_ANCHOR.TOP)
    para(tf, bc["headline"], size=16, bold=True, color=NAVY2, first=True, sa=6)
    para(tf, bc["hotline"]["label"], size=11, bold=True, color=NAVY2, sa=1)
    para(tf, bc["hotline"]["value"] + "（24時間）", size=21, bold=True, color=RED, sa=6)
    para(tf, f'代表電話：{bc["rep"]["value"]}', size=12.5, bold=True, color=NAVY2, sa=1)
    para(tf, "（受付 9:00〜18:00）", size=10, color=GRAY, sa=6)
    para(tf, bc["support"], size=11, sa=6)
    para(tf, bc["eligibility"]["title"], size=12, bold=True, color=GREEN, sa=1)
    for it in bc["eligibility"]["items"]:
        para(tf, "・" + it, size=10.5, sa=1)
    # 右：QRコード（家族ページ）
    qr_size = 42
    qx = PW - MG - qr_size - 2
    add_qr(s, qx, 40, qr_size, label=bc["siteLabel"])
    stf = tbox(s, qx - 8, 40 + qr_size + 13, qr_size + 16, 10)
    para(stf, "スマホで読み取り", size=9, color=GRAY, align=PP_ALIGN.CENTER, first=True, sa=0)
    # 下：ダルクビル（施設外観）
    fb_h = 104
    photo_band(s, "facility", MG, PH - MG - fb_h, CW, fb_h,
               caption="相模原ダルク デイケアセンター（ダルクビル）")
    # 発行者
    itf = tbox(s, MG, PH - MG - fb_h - 11, CW, 10)
    para(itf, data["org"]["name"] + "（DARC）", size=12, bold=True, color=NAVY2,
         first=True, sa=0)


if ONEPAGE:
    build_one_page_deck()
    prs.save(OUT)
    print(f"PPTX generated (1章1ページ試作): {OUT}  ({len(prs.slides._sldIdLst)} slides)")
    sys.exit(0)


# =====================================================================
# 表紙
# =====================================================================
cover = data["cover"]
s = slide()
photo_cover(s, data["images"]["cover"], 0, 0, PW, PH)
rect(s, 0, 0, PW, PH, NAVY, alpha=55)
rect(s, 0, 0, 6, PH, WARM)
tf = tbox(s, MG + 6, PH * 0.26, PW * 0.86, PH * 0.55)
para(tf, cover["category"], size=14, bold=True, color=CREAM, first=True, sa=8)
for line in cover["title"].split("\n"):
    para(tf, line, size=38, bold=True, color=WHITE, sa=3)
para(tf, cover["subtitle"], size=14, color=RGBColor(0xEA, 0xF1, 0xF8), sb=8, sa=0)
tf2 = tbox(s, MG + 6, PH - 18, CW, 13)
para(tf2, data["org"]["name"], size=14, bold=True, color=WHITE, first=True, sa=0)

# 導入ストーリー（扉＋本文2段）
st = data["openingStory"]
hero_full(data["images"]["story"], st["chapterLabel"], st["title"], "")
s = slide()
rect(s, 0, 0, PW, PH, BG)
band(s, st["chapterLabel"], st["title"])
tf = tbox(s, MG, 25, CW, PH - MG - 25, cols=NCOL)
para(tf, st["lead"], size=11.5, bold=True, italic=True, color=NAVY2, first=True, sa=6)
for t in st["paragraphs"]:
    para(tf, t, size=10.5, color=(NAVY2 if t.startswith("「") else INK), bold=t.startswith("「"), sa=5)
for t in st["closing"]:
    para(tf, t, size=10.5, bold=True, color=NAVY2, sa=4)

# はじめに
pf = data["preface"]
s = slide()
rect(s, 0, 0, PW, PH, BG)
band(s, "はじめに", pf["title"])
tf = tbox(s, MG, 25, CW, PH - MG - 25, cols=NCOL, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(pf["paragraphs"]):
    para(tf, t, size=12, color=INK, first=(i == 0), sa=8)

# 各章
for idx, ch in enumerate(data["chapters"]):
    img = data["chapterImages"].get(ch["id"]) or FALLBACK[idx % len(FALLBACK)]
    chapter_slides(ch["no"], ch["title"], ch.get("catch", ""), img)

# 私たちが伴走する理由
wr = data["walkReason"]
hero_full(data["images"]["walking"], wr["label"], wr["title"], wr["headline"])
s = slide()
rect(s, 0, 0, PW, PH, BG)
band(s, wr["label"], wr["title"])
tf = tbox(s, MG, 25, CW, PH - MG - 25, cols=NCOL, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(wr["body"]):
    para(tf, t, size=11.5, color=INK, first=(i == 0), sa=5)
para(tf, wr["philosophyLabel"], size=11, bold=True, color=GREEN, sb=4, sa=1)
para(tf, wr["philosophy"], size=12.5, bold=True, color=NAVY2, sa=5)
for t in wr["body2"]:
    para(tf, t, size=11, sa=5)
# 感動的タグライン
s = slide()
photo_cover(s, data["images"]["walking"], 0, 0, PW, PH)
rect(s, 0, 0, PW, PH, NAVY, alpha=58)
tf = tbox(s, PW * 0.08, PH * 0.26, PW * 0.84, PH * 0.5, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(wr["closing"]):
    para(tf, t, size=16, bold=True, color=WHITE, align=PP_ALIGN.CENTER, sa=6, first=(i == 0))
para(tf, wr["tagline"], size=30, bold=True, color=WHITE, align=PP_ALIGN.CENTER, sb=8, sa=2)
para(tf, wr["taglineSub"], size=13, bold=True, color=CREAM, align=PP_ALIGN.CENTER)

# 約束
pr = data["promise"]
s = slide()
rect(s, 0, 0, PW, PH, BG)
photo_cover(s, data["images"]["walking"], 0, 0, PW, 52)
rect(s, 0, 0, PW, 52, NAVY, alpha=46)
rect(s, 0, 0, 5, 52, WARM)
htf = tbox(s, MG + 4, 12, CW - 8, 34, anchor=MSO_ANCHOR.MIDDLE)
para(htf, pr["chapterLabel"], size=12, bold=True, color=WARM, first=True, sa=2)
para(htf, pr["title"], size=24, bold=True, color=WHITE, sa=0)
tf = tbox(s, MG, 57, CW, PH - MG - 57, cols=NCOL)
for i, t in enumerate(pr["paragraphs"]):
    para(tf, t, size=11, first=(i == 0), sa=5)
for p in pr["pledges"]:
    para(tf, f'◆ {p["title"]}：{p["note"]}', size=11, bold=True, color=GREEN, sa=3)
# 最後のメッセージ（全面）
s = slide()
photo_cover(s, data["images"]["cover"], 0, 0, PW, PH)
rect(s, 0, 0, PW, PH, NAVY, alpha=60)
tf = tbox(s, PW * 0.1, PH * 0.32, PW * 0.8, PH * 0.36, anchor=MSO_ANCHOR.MIDDLE)
para(tf, pr["finalMessage"], size=19, bold=True, color=WHITE, align=PP_ALIGN.CENTER, first=True, sa=12)
para(tf, pr["signoff"], size=14, bold=True, color=CREAM, align=PP_ALIGN.CENTER)

# お問い合わせ
bc = data["backCover"]
s = slide()
rect(s, 0, 0, PW, PH, BG)
band(s, "CONTACT", "お問い合わせ")
tf = tbox(s, MG, 28, CW, PH - MG - 28, anchor=MSO_ANCHOR.MIDDLE)
para(tf, bc["headline"], size=17, bold=True, color=NAVY2, first=True, sa=6)
para(tf, f'{bc["hotline"]["label"]}', size=12, bold=True, color=NAVY2, sa=1)
para(tf, bc["hotline"]["value"] + "（24時間）", size=22, bold=True, color=RED, sa=6)
para(tf, f'代表電話：{bc["rep"]["value"]}（9:00〜18:00）', size=13, bold=True, color=NAVY2, sa=6)
para(tf, bc["support"], size=12, sa=6)
para(tf, bc["eligibility"]["title"] + "：" + "／".join(bc["eligibility"]["items"]), size=12, bold=True, color=GREEN, sa=6)
para(tf, f'{bc["siteLabel"]}：{bc["site"]}', size=11.5, color=BLUE, sa=3)
para(tf, data["org"]["name"], size=13, bold=True, color=NAVY2)

prs.save(OUT)
print(f"PPTX generated: {OUT}  ({len(prs.slides._sldIdLst)} slides)")
