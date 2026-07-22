/**
 * 家族回復支援実践マニュアルの全原稿を、編集可能な Word (.docx) として出力する。
 * 原稿は src/data/manual.ts を単一ソースとして参照する（PDF と同じ内容）。
 *
 * 使い方:
 *   npx tsx scripts/generate-docx.ts
 *   → public/manual.docx を生成
 */
import { writeFileSync } from 'node:fs'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx'
import * as M from '../src/data/manual'

const NAVY = '1B3358'
const GREEN = '2F9E6B'
const WARM = 'B06A2C'

const children: Paragraph[] = []
const SKIP = new Set([
  'id',
  'no',
  'tone',
  'icon',
  'cat',
  'catStart',
  'imageNote',
  'subtitle',
])

const isStr = (v: unknown): v is string => typeof v === 'string'

function push(p: Paragraph) {
  children.push(p)
}
function title(text: string) {
  push(new Paragraph({ text, heading: HeadingLevel.TITLE }))
}
function h1(text: string) {
  push(new Paragraph({ text, heading: HeadingLevel.HEADING_1 }))
}
function h2(text: string) {
  push(new Paragraph({ text, heading: HeadingLevel.HEADING_2 }))
}
function h3(text: string) {
  push(new Paragraph({ text, heading: HeadingLevel.HEADING_3 }))
}
function para(text: string) {
  push(new Paragraph({ children: [new TextRun(text)], spacing: { after: 120 } }))
}
function boldPara(text: string, color = NAVY) {
  push(
    new Paragraph({
      children: [new TextRun({ text, bold: true, color })],
      spacing: { after: 120 },
    }),
  )
}
function bullet(text: string) {
  push(new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 40 } }))
}
function quote(text: string) {
  push(
    new Paragraph({
      children: [new TextRun({ text, italics: true, bold: true, color: NAVY })],
      spacing: { before: 80, after: 120 },
      indent: { left: 360 },
    }),
  )
}

// 汎用: データ構造を再帰的にたどり、テキストを見出し/段落/箇条書きに落とす
function walk(node: unknown): void {
  if (node == null) return
  if (isStr(node)) {
    para(node)
    return
  }
  if (Array.isArray(node)) {
    node.forEach(walk)
    return
  }
  if (typeof node === 'object') {
    const n = node as Record<string, unknown>
    // Q&A
    if ('q' in n && 'a' in n) {
      push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Q. ', bold: true, color: NAVY }),
            new TextRun({ text: String(n.q), bold: true }),
          ],
          spacing: { before: 80, after: 20 },
        }),
      )
      push(
        new Paragraph({
          children: [
            new TextRun({ text: 'A. ', bold: true, color: GREEN }),
            new TextRun({ text: String(n.a) }),
          ],
          spacing: { after: 120 },
        }),
      )
      return
    }
    // 「やめる例 → 代わりの対応」
    if ('do' in n && 'instead' in n) {
      bullet(`${String(n.do)}　→　${String(n.instead)}`)
      return
    }
    // 見出し + 本文
    if ('heading' in n) {
      h3(String(n.heading))
      walk(n.body)
      return
    }
    // 図解ステップ / パターン（title + note）
    if ('title' in n && 'note' in n && !('body' in n) && !('items' in n)) {
      bullet(`${String(n.title)} … ${String(n.note)}`)
      return
    }
    // POINT（title + 文字列 body）
    if ('title' in n && isStr(n.body) && !('label' in n)) {
      bullet(`${String(n.title)}：${String(n.body)}`)
      return
    }
    // ラベル付きブロック（column / case / info など）
    const head = [n.label, n.title, n.from]
      .filter((x) => isStr(x) && x)
      .join('　')
    if (head) h3(head)
    for (const [k, v] of Object.entries(n)) {
      if (SKIP.has(k)) continue
      if (k === 'label' || k === 'title' || k === 'from') continue
      if (k === 'caption' || k === 'lead' || k === 'note') {
        walk(v)
        continue
      }
      if (k === 'value') {
        boldPara(String(v))
        continue
      }
      walk(v)
    }
    return
  }
}

// ---- 表紙 ----
title(M.cover.title.replace(/\n/g, ' '))
boldPara(M.cover.category, NAVY)
para(M.cover.subtitle)
para(M.org.name)
para(M.cover.supply)

// ---- 導入ストーリー ----
h1(`${M.openingStory.chapterLabel}　${M.openingStory.title}`)
quote(M.openingStory.lead)
M.openingStory.paragraphs.forEach((t) =>
  t.startsWith('「') ? quote(t) : para(t),
)
M.openingStory.closing.forEach(para)

// ---- はじめに ----
h1(M.preface.title)
M.preface.paragraphs.forEach(para)

// ---- 第1〜11章 ----
const chapters = [
  M.ch1,
  M.ch2,
  M.ch3,
  M.ch4,
  M.ch5,
  M.ch6,
  M.ch7,
  M.ch8,
  M.ch9,
  M.ch10,
  M.ch11,
] as const

for (const ch of chapters) {
  const c = ch as unknown as Record<string, unknown>
  h1(`${String(c.no)}　${String(c.title)}`)
  if (isStr(c.catch)) boldPara(c.catch, WARM)
  for (const [k, v] of Object.entries(c)) {
    if (['no', 'id', 'title', 'catch'].includes(k)) continue
    walk(v)
  }
}

// ---- 私たちが伴走する理由 ----
h1(M.walkReason.title)
boldPara(M.walkReason.headline, WARM)
M.walkReason.body.forEach(para)
h3(M.walkReason.philosophyLabel)
para(M.walkReason.philosophy)
M.walkReason.body2.forEach(para)
M.walkReason.closing.forEach((l) => boldPara(l, NAVY))
boldPara(`${M.walkReason.tagline}　${M.walkReason.taglineSub}`, NAVY)

// ---- 約束 ----
h1(M.promise.title)
M.promise.paragraphs.forEach(para)
M.promise.pledges.forEach((p) => bullet(`${p.title}：${p.note}`))
boldPara(M.promise.finalMessage, NAVY)
boldPara(M.promise.signoff, NAVY)

// ---- お問い合わせ（裏表紙） ----
h1('お問い合わせ')
boldPara(M.backCover.headline, NAVY)
para(`${M.backCover.hotline.label}：${M.backCover.hotline.value}`)
para(`${M.backCover.rep.label}：${M.backCover.rep.value}`)
para(M.backCover.support)
h3(M.backCover.eligibility.title)
para(M.backCover.eligibility.lead)
M.backCover.eligibility.items.forEach(bullet)
para(`${M.backCover.siteLabel}：${M.backCover.site}`)
para(M.org.name)
para(M.backCover.disclaimer)

const doc = new Document({
  creator: '一般社団法人 相模原ダルク',
  title: '家族回復支援実践マニュアル',
  styles: {
    default: {
      document: {
        run: { font: 'Yu Gothic', size: 22 },
      },
    },
  },
  sections: [{ children }],
})

const out = process.argv[2] || 'public/manual.docx'
const buf = await Packer.toBuffer(doc)
writeFileSync(out, buf)
console.log(`DOCX generated: ${out} (${children.length} blocks)`)
