#!/usr/bin/env python3
"""編集可能な PowerPoint（.pptx）を生成する（完成版の内容を網羅）。

既定は互換性の高い標準 16:9 サイズ。第3引数に "a4" で A4縦も可。
src/data/manual.ts をダンプした JSON（scripts/manual.json）を読み、
章見出しの色帯・本文・箇条書き・Q&A・写真をネイティブ図形／テキストで配置。

前提: npx tsx scripts/dump-manual.ts scripts/manual.json を先に実行。
使い方: python3 scripts/generate-pptx.py scripts/manual.json public/manual.pptx [169|a4]
"""
import io
import json
import os
import sys

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Mm, Pt

JSON_PATH = sys.argv[1] if len(sys.argv) > 1 else "scripts/manual.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/manual.pptx"
FMT = sys.argv[3] if len(sys.argv) > 3 else "169"
IMG_DIR = "src/assets/manual"

NAVY = RGBColor(0x1B, 0x33, 0x58)
GREEN = RGBColor(0x2F, 0x9E, 0x6B)
WARM = RGBColor(0xB0, 0x6A, 0x2C)
BLUE = RGBColor(0x3A, 0x86, 0xC4)
RED = RGBColor(0xC0, 0x5C, 0x5C)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
CREAM = RGBColor(0xF2, 0xE7, 0xD6)
INK = RGBColor(0x2B, 0x33, 0x42)
GRAY = RGBColor(0x60, 0x6A, 0x7A)

data = json.load(open(JSON_PATH, encoding="utf-8"))

prs = Presentation()
if FMT == "a4":
    prs.slide_width = Mm(210)
    prs.slide_height = Mm(297)
    PW, PH, MARGIN = 210.0, 297.0, 12.0
    BAND_H, BAND_BIG = 20.0, 60.0
else:  # 16:9 標準（13.333in × 7.5in）
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    PW, PH, MARGIN = 338.67, 190.5, 14.0
    BAND_H, BAND_BIG = 17.0, 44.0

CW = PW - 2 * MARGIN
BODY_TOP = BAND_H + 4
BODY_BOTTOM = PH - MARGIN
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


def rect(s, x, y, w, h, fill):
    sp = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Mm(x), Mm(y), Mm(w), Mm(h))
    sp.fill.solid()
    sp.fill.fore_color.rgb = fill
    sp.line.fill.background()
    sp.shadow.inherit = False
    return sp


def textbox(s, x, y, w, h, anchor=None):
    tb = s.shapes.add_textbox(Mm(x), Mm(y), Mm(w), Mm(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Mm(2)
    tf.margin_right = Mm(2)
    tf.margin_top = Mm(1)
    tf.margin_bottom = Mm(1)
    if anchor is not None:
        tf.vertical_anchor = anchor
    return tf


def addp(tf, text, *, size=11, bold=False, color=INK, bullet=False,
         align=None, sb=0, sa=4, first=False, italic=False):
    p = tf.paragraphs[0] if (first and not tf.paragraphs[0].runs) else tf.add_paragraph()
    p.space_before = Pt(sb)
    p.space_after = Pt(sa)
    p.line_spacing = 1.18
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


def img_data(name, max_w=1500):
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


def add_pic(s, name, x, y, w=None, h=None):
    st, ratio = img_data(name)
    if not st:
        return None
    if w and not h:
        return s.shapes.add_picture(st, Mm(x), Mm(y), width=Mm(w))
    if h and not w:
        return s.shapes.add_picture(st, Mm(x), Mm(y), height=Mm(h))
    return s.shapes.add_picture(st, Mm(x), Mm(y), width=Mm(w), height=Mm(h))


def band(s, no, title, catch=None, big=False):
    h = BAND_BIG if big else BAND_H
    rect(s, 0, 0, PW, h, NAVY)
    tf = textbox(s, MARGIN, 2.5, CW, h - 4, anchor=MSO_ANCHOR.MIDDLE)
    if big:
        addp(tf, no, size=11, bold=True, color=WHITE, first=True, sa=3)
        addp(tf, title, size=22, bold=True, color=WHITE, sa=3)
        if catch:
            addp(tf, catch, size=12.5, bold=True, color=CREAM, sa=0)
    else:
        addp(tf, f"{no}　{title}", size=12, bold=True, color=WHITE, first=True, sa=0)
    return h


def content_slide(no, title):
    s = slide()
    band(s, no, title)
    tf = textbox(s, MARGIN, BODY_TOP, CW, BODY_BOTTOM - BODY_TOP)
    return s, tf


def opener_slide(no, title, catch, imgname, lead_lines):
    s = slide()
    band(s, no, title, catch, big=True)
    top = BAND_BIG + 4
    if imgname:
        # 右側に写真、左側にリード
        img_w = CW * 0.46
        add_pic(s, imgname, MARGIN + CW - img_w, top, w=img_w)
        tf = textbox(s, MARGIN, top, CW - img_w - 6, PH - top - MARGIN)
    else:
        tf = textbox(s, MARGIN, top, CW, PH - top - MARGIN)
    for i, t in enumerate(lead_lines):
        addp(tf, t, size=12, bold=True, color=NAVY, first=(i == 0), sa=6)
    return s


def heading(tf, text, first=False):
    addp(tf, text, size=13.5, bold=True, color=NAVY, first=first, sb=2, sa=3)


# =====================================================================
# 表紙
# =====================================================================
cover = data["cover"]
s = slide()
rect(s, 0, 0, PW, PH, NAVY)
add_pic(s, data["images"]["cover"], PW * 0.5, 0, w=PW * 0.5)
tf = textbox(s, MARGIN, PH * 0.22, PW * 0.5, PH * 0.6, anchor=MSO_ANCHOR.TOP)
addp(tf, cover["category"], size=12, bold=True, color=RGBColor(0x9D, 0xC2, 0xE8), first=True, sa=6)
for line in cover["title"].split("\n"):
    addp(tf, line, size=26 if FMT == "a4" else 24, bold=True, color=WHITE, sa=2)
addp(tf, cover["subtitle"], size=12, color=RGBColor(0xEA, 0xF1, 0xF8), sb=6, sa=0)
tf2 = textbox(s, MARGIN, PH - 22, CW, 16)
addp(tf2, cover["supply"], size=8.5, color=RGBColor(0x9D, 0xC2, 0xE8), first=True, sa=2)
addp(tf2, data["org"]["name"], size=13, bold=True, color=WHITE, sa=0)

# 導入ストーリー
st = data["openingStory"]
opener_slide(st["chapterLabel"], st["title"], "", data["images"]["story"],
             [st["lead"]] + st["paragraphs"][:1])
s2, tf = content_slide(st["chapterLabel"], st["title"])
for i, t in enumerate(st["paragraphs"][1:]):
    addp(tf, t, size=11, color=(NAVY if t.startswith("「") else INK), bold=t.startswith("「"), first=(i == 0))
for t in st["closing"]:
    addp(tf, t, size=11, bold=True, color=NAVY)

# はじめに
pf = data["preface"]
s, tf = content_slide("はじめに", pf["title"])
for i, t in enumerate(pf["paragraphs"]):
    addp(tf, t, size=12, color=INK, first=(i == 0), sa=7)


# =====================================================================
# 各章
# =====================================================================
def render_field(no, title, key, v):
    s, tf = content_slide(no, title)
    first = True
    if key == "sections":
        for sec in v:
            heading(tf, sec["heading"], first=first)
            first = False
            for b in sec["body"]:
                addp(tf, b, size=11)
    elif key == "points":
        heading(tf, "POINT", first=True)
        for it in v:
            addp(tf, it["title"], size=12, bold=True, color=NAVY, sa=1)
            addp(tf, it["body"], size=10.5, color=INK, sa=5)
    elif key in ("column", "boundary", "craft", "consult"):
        heading(tf, f'{v.get("label","")}　{v.get("title","")}'.strip(), first=True)
        for b in v.get("body", []):
            addp(tf, b, size=11)
    elif key in ("cycle", "flow"):
        heading(tf, v["title"], first=True)
        for i, step in enumerate(v["steps"], 1):
            addp(tf, f'{i}. {step["title"]}　{step.get("note","")}', size=11.5, bold=True, color=NAVY, sa=2)
        addp(tf, v.get("caption", ""), size=9, color=GRAY, sb=2)
    elif key == "checklist":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, "☐ " + it, size=11, sa=2)
        addp(tf, v.get("caption", ""), size=9, color=GRAY, sb=2)
    elif key == "examples":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            p = tf.add_paragraph()
            p.line_spacing = 1.18
            p.space_after = Pt(3)
            r = p.add_run(); r.text = "✕ " + it["do"]; r.font.size = Pt(10.5); r.font.color.rgb = RED; set_ea(r)
            r2 = p.add_run(); r2.text = "　→　" + it["instead"]; r2.font.size = Pt(10.5); r2.font.bold = True; r2.font.color.rgb = GREEN; set_ea(r2)
        addp(tf, v.get("caption", ""), size=9, color=GRAY, sb=2)
    elif key == "patterns":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, f'{it["title"]}：{it["note"]}', size=11, bold=True, color=NAVY, sa=2)
        addp(tf, v.get("caption", ""), size=9, color=GRAY, sb=2)
    elif key in ("compare", "saylist"):
        heading(tf, v["title"], first=True)
        if key == "saylist":
            cols = [("こう伝えましょう", v["good"]["items"], GREEN), ("この対応は避けましょう", v["bad"]["items"], RED)]
        else:
            cols = [(v["left"]["title"], v["left"]["items"], RED), (v["right"]["title"], v["right"]["items"], GREEN)]
        for name, items, col in cols:
            addp(tf, name, size=12, bold=True, color=col, sb=3, sa=1)
            for it in items:
                addp(tf, it, size=10.5, bullet=True, sa=1)
        addp(tf, v.get("caption", ""), size=9, color=GRAY, sb=2)
    elif key == "safety":
        addp(tf, "⚠ " + v["label"], size=13, bold=True, color=RED, first=True, sa=3)
        addp(tf, v["body"], size=11)
    elif key == "cases":
        for c in v:
            heading(tf, f'{c["label"]}　{c.get("from","")}', first=first)
            first = False
            for b in c["body"]:
                addp(tf, b, size=11)
    elif key == "impersonation":
        addp(tf, v["label"], size=13, bold=True, color=WARM, first=True, sa=3)
        addp(tf, v["body"], size=11)
    elif key in ("note", "reasonNote"):
        addp(tf, v, size=11.5, bold=True, color=NAVY, first=True)
    elif key == "dont":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, f'✕ {it["title"]}：{it["note"]}', size=11, color=INK, sa=2)
    elif key == "do":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, f'✓ {it["title"]}：{it["note"]}', size=11, color=INK, sa=2)
    elif key in ("recovered", "relapsed"):
        col = GREEN if v.get("tone") == "do" else RED
        addp(tf, f'{v["label"]}　{v.get("person","")}', size=13, bold=True, color=col, first=True, sa=3)
        for b in v["story"]:
            addp(tf, b, size=11)
        if v.get("result"):
            addp(tf, "結果：" + v["result"], size=11, bold=True, color=NAVY, sb=2)
    elif key == "lesson":
        heading(tf, v["title"], first=True)
        addp(tf, v["body"], size=11)
    elif key == "benefits":
        heading(tf, "家族会に参加すると", first=True)
        for b in v:
            addp(tf, b["title"], size=12, bold=True, color=NAVY, sa=1)
            addp(tf, b["body"], size=10.5, sa=5)
    elif key == "voices":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, "“" + it.strip("「」") + "”", size=11, italic=True, color=BLUE, sa=2)
        addp(tf, v.get("caption", ""), size=9, color=GRAY, sb=2)
    elif key == "program":
        heading(tf, v["title"], first=True)
        for it in v["items"]:
            addp(tf, it["title"], size=12, bold=True, color=NAVY, sa=1)
            addp(tf, it["body"], size=10.5, sa=5)
    elif key == "info":
        heading(tf, v["title"], first=True)
        for row in v["rows"]:
            addp(tf, f'{row["label"]}：{row["value"]}', size=11, sa=2)
        addp(tf, "家族会 当日の流れ", size=12.5, bold=True, color=NAVY, sb=5, sa=2)
        for i, t in enumerate([
            "受付・送迎（JR相模原駅 北口より専用送迎車 12:45発・13:00発）",
            "開会（13:30）はじめての方も安心してお越しください",
            "エキスパート講演会（医師・専門家から学ぶ）",
            "家族ミーティング（言いっぱなし・聞きっぱなし）",
            "当事者スタッフ面談（回復者スタッフが一緒に）",
            "閉会（17:00）お帰りも送迎いたします",
        ], 1):
            addp(tf, f"{i}. {t}", size=10.5, sa=1)


chImages = data["chapterImages"]
for ch in data["chapters"]:
    opener_slide(ch["no"], ch["title"], ch.get("catch", ""), chImages.get(ch["id"]), ch.get("lead", []))
    for key in ch:
        if key in ("no", "id", "title", "catch", "lead"):
            continue
        render_field(ch["no"], ch["title"], key, ch[key])

# 私たちが伴走する理由
wr = data["walkReason"]
opener_slide(wr["label"], wr["title"], wr["headline"], None, wr["body"])
s, tf = content_slide(wr["label"], wr["title"])
addp(tf, wr["philosophyLabel"], size=11, bold=True, color=GREEN, first=True, sa=1)
addp(tf, wr["philosophy"], size=12, bold=True, color=NAVY, sa=6)
for t in wr["body2"]:
    addp(tf, t, size=11, sa=5)
s2 = slide()
tf = textbox(s2, MARGIN, PH * 0.28, CW, PH * 0.5, anchor=MSO_ANCHOR.MIDDLE)
for i, t in enumerate(wr["closing"]):
    addp(tf, t, size=15, bold=True, color=NAVY, align=PP_ALIGN.CENTER, sa=5, first=(i == 0))
addp(tf, wr["tagline"], size=26, bold=True, color=NAVY, align=PP_ALIGN.CENTER, sb=8, sa=2)
addp(tf, wr["taglineSub"], size=12, bold=True, color=WARM, align=PP_ALIGN.CENTER)

# 約束
pr = data["promise"]
opener_slide(pr["chapterLabel"], pr["title"], "", data["images"]["walking"], pr["paragraphs"][:1])
s, tf = content_slide(pr["chapterLabel"], pr["title"])
for i, t in enumerate(pr["paragraphs"][1:]):
    addp(tf, t, size=11, first=(i == 0), sa=5)
for p in pr["pledges"]:
    addp(tf, p["title"], size=12.5, bold=True, color=GREEN, sa=1)
    addp(tf, p["note"], size=10.5, sa=4)
addp(tf, pr["finalMessage"], size=13, bold=True, color=NAVY, align=PP_ALIGN.CENTER, sb=6, sa=3)
addp(tf, pr["signoff"], size=12, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

# お問い合わせ
bc = data["backCover"]
s, tf = content_slide("CONTACT", "お問い合わせ")
addp(tf, bc["headline"], size=16, bold=True, color=NAVY, first=True, sa=5)
addp(tf, bc["hotline"]["label"], size=11, bold=True, color=NAVY, sa=1)
addp(tf, bc["hotline"]["value"], size=20, bold=True, color=RED, sa=5)
addp(tf, bc["rep"]["label"], size=11, bold=True, color=NAVY, sa=1)
addp(tf, bc["rep"]["value"], size=16, bold=True, color=NAVY, sa=5)
addp(tf, bc["support"], size=11, sa=6)
addp(tf, bc["eligibility"]["title"], size=13, bold=True, color=GREEN, sa=2)
for it in bc["eligibility"]["items"]:
    addp(tf, "✓ " + it, size=11, sa=1)
addp(tf, f'{bc["siteLabel"]}：{bc["site"]}', size=10.5, color=BLUE, sb=5)
addp(tf, data["org"]["name"], size=12, bold=True, color=NAVY)

prs.save(OUT)
print(f"PPTX ({FMT}) generated: {OUT}  ({len(prs.slides._sldIdLst)} slides)")
