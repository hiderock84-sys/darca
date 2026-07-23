#!/usr/bin/env python3
"""編集可能で、冊子のようにスタイリッシュ・余白の少ない PowerPoint を生成する。

標準 16:9。全面写真＋文字オーバーレイの扉、色パネル／カードで埋めた本文、
感動的なメッセージ面（全面写真＋大きな白文字）で構成。文字はすべて編集可能。

前提: npx tsx scripts/dump-manual.ts scripts/manual.json
使い方: python3 scripts/generate-pptx.py scripts/manual.json public/manual.pptx
"""
import io
import json
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
BG = RGBColor(0xF5, 0xF7, 0xFB)
TINT_GREEN = RGBColor(0xE7, 0xF3, 0xEC)
TINT_BLUE = RGBColor(0xE8, 0xF0, 0xFA)
TINT_GRAY = RGBColor(0xEE, 0xF1, 0xF7)
TINT_RED = RGBColor(0xFA, 0xEA, 0xEA)
TINT_WARM = RGBColor(0xF7, 0xEF, 0xE1)

data = json.load(open(JSON_PATH, encoding="utf-8"))

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
PW, PH, MG = 338.67, 190.5, 14.0
CW = PW - 2 * MG
BAND = 20.0
Y0 = BAND + 6
Y1 = PH - MG
BLANK = prs.slide_layouts[6]


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


def rect(s, x, y, w, h, fill, alpha=None, rounded=False):
    shp = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,
        Mm(x), Mm(y), Mm(w), Mm(h),
    )
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.fill.background()
    shp.shadow.inherit = False
    if alpha is not None:
        srgb = shp.fill.fore_color._xFill.find(qn("a:srgbClr"))
        a = srgb.makeelement(qn("a:alpha"), {"val": str(int(alpha * 1000))})
        srgb.append(a)
    return shp


def tbox(s, x, y, w, h, anchor=MSO_ANCHOR.TOP):
    tb = s.shapes.add_textbox(Mm(x), Mm(y), Mm(w), Mm(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Mm(2)
    tf.margin_right = Mm(2)
    tf.margin_top = Mm(1.5)
    tf.margin_bottom = Mm(1.5)
    tf.vertical_anchor = anchor
    return tf


def addp(tf, text, *, size=12, bold=False, color=INK, bullet=False, align=None,
         sb=0, sa=5, first=False, italic=False, shadow=False):
    p = tf.paragraphs[0] if (first and not tf.paragraphs[0].runs) else tf.add_paragraph()
    p.space_before = Pt(sb)
    p.space_after = Pt(sa)
    p.line_spacing = 1.2
    if align is not None:
        p.alignment = align
    r = p.add_run()
    r.text = ("・" + text) if bullet else text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    set_ea(r)
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


def photo_cover(s, name):
    """スライド全面を写真で覆う（縦横比を保ちセンター基準でカバー）。"""
    st, ratio = img_data(name)
    if not st:
        rect(s, 0, 0, PW, PH, NAVY)
        return
    slide_ratio = PW / PH
    if ratio > slide_ratio:  # 画像が横長 → 高さ合わせ、左右はみ出し
        h = PH
        w = PH * ratio
        x = (PW - w) / 2
        y = 0
    else:  # 縦長 → 幅合わせ
        w = PW
        h = PW / ratio
        x = 0
        y = (PH - h) / 2
    pic = s.shapes.add_picture(st, Mm(x), Mm(y), width=Mm(w), height=Mm(h))
    # スライド範囲外を crop
    s.shapes._spTree.remove(pic._element)
    s.shapes._spTree.append(pic._element)


def hero_slide(name, no, title, catch, *, center=False):
    """全面写真＋暗いスクリム＋白文字オーバーレイの扉スライド。"""
    s = slide()
    photo_cover(s, name)
    rect(s, 0, 0, PW, PH, NAVY, alpha=52)  # 暗幕
    if catch is None:
        catch = ""
    if center:
        tf = tbox(s, PW * 0.1, PH * 0.32, PW * 0.8, PH * 0.4, anchor=MSO_ANCHOR.MIDDLE)
        al = PP_ALIGN.CENTER
    else:
        rect(s, 0, 0, 5, PH, WARM)  # 左アクセントバー
        tf = tbox(s, MG + 4, PH * 0.5, PW * 0.82, PH * 0.45, anchor=MSO_ANCHOR.TOP)
        al = PP_ALIGN.LEFT
    if no:
        addp(tf, no, size=13, bold=True, color=WARM, first=True, sa=4, align=al)
    addp(tf, title, size=34 if not center else 40, bold=True, color=WHITE,
         sa=5, align=al, first=(not no))
    if catch:
        addp(tf, catch, size=15, bold=True, color=CREAM, sa=0, align=al)
    return s


def band(s, no, title):
    rect(s, 0, 0, PW, BAND, NAVY2)
    rect(s, 0, 0, 5, BAND, WARM)
    tf = tbox(s, MG + 3, 1.5, CW, BAND - 3, anchor=MSO_ANCHOR.MIDDLE)
    addp(tf, f"{no}　{title}", size=13, bold=True, color=WHITE, first=True, sa=0)


def content_slide(no, title):
    s = slide()
    rect(s, 0, 0, PW, PH, BG)  # 余白を作らない下地
    band(s, no, title)
    return s


def region_box(s, x=MG, y=Y0, w=CW, h=Y1 - Y0, anchor=MSO_ANCHOR.TOP):
    return tbox(s, x, y, w, h, anchor=anchor)


def heading(tf, text, first=False):
    addp(tf, text, size=15, bold=True, color=NAVY2, first=first, sb=2, sa=4)


# ---- パネル／カード（面を埋める） ----
def big_panel(s, label, title, lines, tint, accent, y=Y0, h=Y1 - Y0):
    rect(s, MG, y, CW, h, tint, rounded=True)
    tf = tbox(s, MG + 6, y + 5, CW - 12, h - 10, anchor=MSO_ANCHOR.MIDDLE)
    if label:
        addp(tf, label, size=12, bold=True, color=accent, first=True, sa=3)
    if title:
        addp(tf, title, size=17, bold=True, color=NAVY2, first=(not label), sa=5)
    for i, t in enumerate(lines):
        addp(tf, t, size=13, color=INK, sa=6, first=(not label and not title and i == 0))


def cards_row(s, items, label, tint, accent):
    n = max(1, len(items))
    gap = 6
    cw = (CW - (n - 1) * gap) / n
    h = Y1 - Y0
    for i, it in enumerate(items):
        x = MG + i * (cw + gap)
        rect(s, x, Y0, cw, h, tint, rounded=True)
        tf = tbox(s, x + 4, Y0 + 5, cw - 8, h - 10, anchor=MSO_ANCHOR.TOP)
        if label:
            addp(tf, label, size=11, bold=True, color=accent, first=True, sa=3)
        addp(tf, it["title"], size=14, bold=True, color=NAVY2, first=(not label), sa=3)
        addp(tf, it.get("body") or it.get("note") or "", size=11.5, color=INK, sa=0)


def two_panels(s, left, right):
    gap = 8
    cw = (CW - gap) / 2
    h = Y1 - Y0
    for i, (side, tint, accent) in enumerate([
        (left, TINT_RED, RED), (right, TINT_GREEN, GREEN),
    ]):
        x = MG + i * (cw + gap)
        rect(s, x, Y0, cw, h, tint, rounded=True)
        tf = tbox(s, x + 5, Y0 + 5, cw - 10, h - 10, anchor=MSO_ANCHOR.TOP)
        addp(tf, side["title"], size=14, bold=True, color=accent, first=True, sa=4)
        for it in side["items"]:
            addp(tf, it, size=12, bullet=True, sa=3)


# =====================================================================
# 表紙
# =====================================================================
cover = data["cover"]
s = slide()
photo_cover(s, data["images"]["cover"])
rect(s, 0, 0, PW, PH, NAVY, alpha=55)
rect(s, 0, 0, 6, PH, WARM)
tf = tbox(s, MG + 6, PH * 0.24, PW * 0.86, PH * 0.6, anchor=MSO_ANCHOR.TOP)
addp(tf, cover["category"], size=14, bold=True, color=CREAM, first=True, sa=8)
for line in cover["title"].split("\n"):
    addp(tf, line, size=38, bold=True, color=WHITE, sa=3)
addp(tf, cover["subtitle"], size=14, color=RGBColor(0xEA, 0xF1, 0xF8), sb=8, sa=0)
tf2 = tbox(s, MG + 6, PH - 20, CW, 14)
addp(tf2, data["org"]["name"], size=14, bold=True, color=WHITE, first=True, sa=0)

# 導入ストーリー（扉＝全面写真）
st = data["openingStory"]
hero_slide(data["images"]["story"], st["chapterLabel"], st["title"], "")
s = content_slide(st["chapterLabel"], st["title"])
tf = region_box(s)
addp(tf, st["lead"], size=13.5, bold=True, italic=True, color=NAVY2, first=True, sa=7)
for t in st["paragraphs"]:
    addp(tf, t, size=12.5, color=(NAVY2 if t.startswith("「") else INK), bold=t.startswith("「"), sa=6)
# 感動的な締め
s = slide()
photo_cover(s, data["images"]["story"])
rect(s, 0, 0, PW, PH, NAVY, alpha=60)
tf = tbox(s, PW * 0.1, PH * 0.3, PW * 0.8, PH * 0.42, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(st["closing"]):
    addp(tf, t, size=17, bold=True, color=WHITE, align=PP_ALIGN.CENTER, sa=8, first=(i == 0))

# はじめに
pf = data["preface"]
s = content_slide("はじめに", pf["title"])
tf = region_box(s, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(pf["paragraphs"]):
    addp(tf, t, size=13.5, color=INK, first=(i == 0), sa=9)


# =====================================================================
# 各章
# =====================================================================
def render_field(no, title, key, v):
    if key == "points":
        s = content_slide(no, title)
        cards_row(s, v, "POINT", TINT_GRAY, BLUE)
        return
    if key == "benefits":
        s = content_slide(no, title)
        cards_row(s, [{"title": b["title"], "body": b["body"]} for b in v], None, TINT_GREEN, GREEN)
        return
    if key == "program":
        s = content_slide(no, title)
        cards_row(s, [{"title": it["title"], "body": it["body"]} for it in v["items"]], "PROGRAM", TINT_GRAY, BLUE)
        return
    if key in ("column", "boundary", "craft", "consult", "lesson"):
        s = content_slide(no, title)
        big_panel(s, v.get("label", ""), v.get("title", ""),
                  v.get("body", []) if v.get("body") else ([v["body"]] if isinstance(v.get("body"), str) else []),
                  TINT_GREEN, GREEN)
        return
    if key in ("compare", "saylist"):
        s = content_slide(no, title)
        if key == "saylist":
            two_panels(s, {"title": v["bad"]["title"], "items": v["bad"]["items"]},
                       {"title": v["good"]["title"], "items": v["good"]["items"]})
        else:
            two_panels(s, v["left"], v["right"])
        return
    if key in ("recovered", "relapsed"):
        s = content_slide(no, title)
        tint = TINT_GREEN if v.get("tone") == "do" else TINT_RED
        accent = GREEN if v.get("tone") == "do" else RED
        big_panel(s, v["label"], v.get("person", ""),
                  list(v["story"]) + (["結果：" + v["result"]] if v.get("result") else []),
                  tint, accent)
        return
    if key in ("safety", "impersonation"):
        s = content_slide(no, title)
        big_panel(s, ("⚠ " + v["label"]) if key == "safety" else v["label"], "",
                  [v["body"]], TINT_RED if key == "safety" else TINT_WARM,
                  RED if key == "safety" else WARM_D)
        return
    if key in ("note", "reasonNote"):
        s = content_slide(no, title)
        big_panel(s, "", "", [v], TINT_WARM, WARM_D)
        return
    if key == "groups":
        qa = [(g["label"], it["q"], it["a"]) for g in v for it in g["items"]]
        per = 4
        for i in range(0, len(qa), per):
            s = content_slide(no, title)
            tf = region_box(s, anchor=MSO_ANCHOR.MIDDLE)
            for j, (lab, q, a) in enumerate(qa[i:i + per]):
                pq = tf.paragraphs[0] if (i == 0 and j == 0) else tf.add_paragraph()
                pq.space_before = Pt(0 if j == 0 else 4)
                pq.space_after = Pt(1)
                pq.line_spacing = 1.15
                r = pq.add_run(); r.text = "Q "; r.font.size = Pt(13); r.font.bold = True; r.font.color.rgb = NAVY2; set_ea(r)
                r2 = pq.add_run(); r2.text = q; r2.font.size = Pt(12.5); r2.font.bold = True; r2.font.color.rgb = NAVY2; set_ea(r2)
                pa = tf.add_paragraph()
                pa.space_after = Pt(5)
                pa.line_spacing = 1.15
                r3 = pa.add_run(); r3.text = "A "; r3.font.size = Pt(13); r3.font.bold = True; r3.font.color.rgb = GREEN; set_ea(r3)
                r4 = pa.add_run(); r4.text = a; r4.font.size = Pt(11.5); r4.font.color.rgb = INK; set_ea(r4)
        return

    # テキスト系（下地＋見出し＋本文で埋める）
    s = content_slide(no, title)
    tf = region_box(s, anchor=MSO_ANCHOR.MIDDLE)
    first = True
    if key == "sections":
        for sec in v:
            heading(tf, sec["heading"], first=first)
            first = False
            for b in sec["body"]:
                addp(tf, b, size=13, sa=6)
    elif key == "cases":
        for c in v:
            heading(tf, f'{c["label"]}　{c.get("from","")}', first=first)
            first = False
            for b in c["body"]:
                addp(tf, b, size=13, sa=6)
    elif key in ("cycle", "flow"):
        heading(tf, v["title"], first=True)
        for i, step in enumerate(v["steps"], 1):
            addp(tf, f'{i}. {step["title"]}　{step.get("note","")}', size=13.5, bold=True, color=NAVY2, sa=5)
        addp(tf, v.get("caption", ""), size=10, color=GRAY, sb=4)
    elif key == "checklist":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, "☐ " + it, size=13, sa=5)
        addp(tf, v.get("caption", ""), size=10, color=GRAY, sb=4)
    elif key == "examples":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            p = tf.add_paragraph()
            p.line_spacing = 1.2
            p.space_after = Pt(5)
            r = p.add_run(); r.text = "✕ " + it["do"]; r.font.size = Pt(12.5); r.font.color.rgb = RED; set_ea(r)
            r2 = p.add_run(); r2.text = "　→　" + it["instead"]; r2.font.size = Pt(12.5); r2.font.bold = True; r2.font.color.rgb = GREEN; set_ea(r2)
        addp(tf, v.get("caption", ""), size=10, color=GRAY, sb=4)
    elif key == "patterns":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, f'{it["title"]}：{it["note"]}', size=13, bold=True, color=NAVY2, sa=5)
        addp(tf, v.get("caption", ""), size=10, color=GRAY, sb=4)
    elif key == "dont":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, f'✕ {it["title"]}：{it["note"]}', size=13, sa=5)
    elif key == "do":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, f'✓ {it["title"]}：{it["note"]}', size=13, sa=5)
    elif key == "voices":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, "“" + it.strip("「」") + "”", size=13, italic=True, color=BLUE, sa=5)
        addp(tf, v.get("caption", ""), size=10, color=GRAY, sb=4)
    elif key == "info":
        heading(tf, v["title"], first=True)
        for row in v["rows"]:
            addp(tf, f'{row["label"]}：{row["value"]}', size=12.5, sa=4)
        addp(tf, "家族会 当日の流れ", size=13.5, bold=True, color=NAVY2, sb=6, sa=3)
        for i, t in enumerate([
            "受付・送迎（JR相模原駅北口 12:45・13:00発）",
            "開会（13:30）／エキスパート講演会",
            "家族ミーティング（言いっぱなし・聞きっぱなし）",
            "当事者スタッフ面談／閉会（17:00・送迎あり）",
        ], 1):
            addp(tf, f"{i}. {t}", size=12, sa=3)


chImages = data["chapterImages"]
FALLBACK = ["hands-support", "seedling-dawn", "path-fork", "boundary", "calm-thread"]
for idx, ch in enumerate(data["chapters"]):
    imgname = chImages.get(ch["id"]) or FALLBACK[idx % len(FALLBACK)]
    hero_slide(imgname, ch["no"], ch["title"], ch.get("catch", ""))
    # リード（扉の次に、余白なく下地付きで）
    if ch.get("lead"):
        s = content_slide(ch["no"], ch["title"])
        tf = region_box(s, anchor=MSO_ANCHOR.MIDDLE)
        for i, t in enumerate(ch["lead"]):
            addp(tf, t, size=15, bold=True, color=NAVY2, align=PP_ALIGN.CENTER, first=(i == 0), sa=8)
    for key in ch:
        if key in ("no", "id", "title", "catch", "lead"):
            continue
        render_field(ch["no"], ch["title"], key, ch[key])

# 私たちが伴走する理由
wr = data["walkReason"]
hero_slide(data["images"]["walking"], wr["label"], wr["title"], wr["headline"])
s = content_slide(wr["label"], wr["title"])
tf = region_box(s, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(wr["body"]):
    addp(tf, t, size=13.5, color=INK, first=(i == 0), sa=6)
addp(tf, wr["philosophyLabel"], size=12, bold=True, color=GREEN, sb=6, sa=1)
addp(tf, wr["philosophy"], size=14, bold=True, color=NAVY2, sa=6)
for t in wr["body2"]:
    addp(tf, t, size=13, sa=5)
# 感動的なタグライン（全面写真）
s = slide()
photo_cover(s, data["images"]["walking"])
rect(s, 0, 0, PW, PH, NAVY, alpha=58)
tf = tbox(s, PW * 0.08, PH * 0.26, PW * 0.84, PH * 0.5, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(wr["closing"]):
    addp(tf, t, size=17, bold=True, color=WHITE, align=PP_ALIGN.CENTER, sa=7, first=(i == 0))
addp(tf, wr["tagline"], size=32, bold=True, color=WHITE, align=PP_ALIGN.CENTER, sb=10, sa=2)
addp(tf, wr["taglineSub"], size=13, bold=True, color=CREAM, align=PP_ALIGN.CENTER)

# 約束
pr = data["promise"]
hero_slide(data["images"]["walking"], pr["chapterLabel"], pr["title"], "")
s = content_slide(pr["chapterLabel"], pr["title"])
tf = region_box(s, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(pr["paragraphs"]):
    addp(tf, t, size=13, first=(i == 0), sa=6)
for p in pr["pledges"]:
    addp(tf, f'◆ {p["title"]}　{p["note"]}', size=13, bold=True, color=GREEN, sa=4)
# 最後のメッセージ（全面写真）
s = slide()
photo_cover(s, data["images"]["cover"])
rect(s, 0, 0, PW, PH, NAVY, alpha=60)
tf = tbox(s, PW * 0.1, PH * 0.3, PW * 0.8, PH * 0.4, anchor=MSO_ANCHOR.MIDDLE)
addp(tf, pr["finalMessage"], size=20, bold=True, color=WHITE, align=PP_ALIGN.CENTER, first=True, sa=12)
addp(tf, pr["signoff"], size=14, bold=True, color=CREAM, align=PP_ALIGN.CENTER)

# お問い合わせ
bc = data["backCover"]
s = content_slide("CONTACT", "お問い合わせ")
big_panel(s, bc["headline"], "", [], TINT_BLUE, NAVY2, y=Y0, h=42)
tf = tbox(s, MG + 6, Y0 + 6, CW - 12, 32, anchor=MSO_ANCHOR.MIDDLE)
addp(tf, f'{bc["hotline"]["label"]}', size=12, bold=True, color=NAVY2, first=True, sa=1)
addp(tf, bc["hotline"]["value"] + "（24時間）", size=22, bold=True, color=RED, sa=0)
tf2 = region_box(s, y=Y0 + 48, h=Y1 - (Y0 + 48))
addp(tf2, f'代表電話：{bc["rep"]["value"]}（9:00〜18:00）', size=14, bold=True, color=NAVY2, first=True, sa=6)
addp(tf2, bc["support"], size=13, sa=6)
addp(tf2, bc["eligibility"]["title"] + "：" + "／".join(bc["eligibility"]["items"]), size=12.5, color=GREEN, bold=True, sa=6)
addp(tf2, f'{bc["siteLabel"]}：{bc["site"]}', size=12, color=BLUE, sa=4)
addp(tf2, data["org"]["name"], size=13, bold=True, color=NAVY2)

prs.save(OUT)
print(f"PPTX (stylish) generated: {OUT}  ({len(prs.slides._sldIdLst)} slides)")
