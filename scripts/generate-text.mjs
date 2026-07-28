/**
 * 家族回復支援実践マニュアルの全原稿を、編集しやすい素のテキストとして書き出す。
 *   - public/manual.md   … Markdown（見出し・箇条書き付き。AI への貼り付け・清書に最適）
 *   - public/manual.txt  … プレーンテキスト（どんな端末でも開ける最小構成）
 *
 * 単一ソース: scripts/manual.json（src/data/manual.ts から dump-manual.ts で生成）
 *
 * 使い方:
 *   node scripts/generate-text.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(resolve(here, 'manual.json'), 'utf8'))

const md = []
const H = (line = '') => md.push(line)
const P = (t) => {
  H(String(t).trim())
  H('')
}
const rule = () => {
  H('---')
  H('')
}

const isStr = (v) => typeof v === 'string'
const SKIP = new Set(['id', 'no', 'icon', 'tone', 'chapterLabel', 'imageNote'])

// データ構造の形を見て Markdown に落とす（再帰）
function walk(node) {
  if (node == null) return
  if (isStr(node)) {
    P(node)
    return
  }
  if (Array.isArray(node)) {
    node.forEach(walk)
    return
  }
  if (typeof node !== 'object') return
  const n = node

  // Q&A
  if ('q' in n && 'a' in n) {
    H(`**Q. ${n.q}**`)
    H('')
    P(`A. ${n.a}`)
    return
  }
  // 「やめる例 → 代わりの対応」
  if ('do' in n && 'instead' in n) {
    P(`- ${n.do}　→　${n.instead}`)
    return
  }
  // 見出し + 本文
  if ('heading' in n) {
    H(`### ${n.heading}`)
    H('')
    walk(n.body)
    return
  }
  // 図解ステップ / パターン（title + note）
  if ('title' in n && 'note' in n && !('body' in n) && !('items' in n)) {
    P(`- **${n.title}** … ${n.note}`)
    return
  }
  // POINT / 箇条（title + 文字列 body）
  if ('title' in n && isStr(n.body) && !('label' in n)) {
    P(`- **${n.title}**：${n.body}`)
    return
  }

  // ラベル付きブロック（column / case / info など）を見出し化
  const head = [n.label, n.title, n.from, n.person]
    .filter((x) => isStr(x) && x)
    .join('　')
  if (head) {
    H(`### ${head}`)
    H('')
  }
  for (const [k, v] of Object.entries(n)) {
    if (SKIP.has(k)) continue
    if (['label', 'title', 'from', 'person'].includes(k)) continue
    if (k === 'value') {
      P(`**${v}**`)
      continue
    }
    walk(v)
  }
}

// ===== 表紙 =====
H(`# ${data.cover.title.replace(/\n/g, '')}`)
H('')
P(`【${data.cover.category}】`)
P(data.cover.subtitle)
P(data.org.name)
P(data.cover.supply)
rule()

// ===== 導入ストーリー =====
H(`## ${data.openingStory.title}`)
H('')
P(`> ${data.openingStory.lead}`)
data.openingStory.paragraphs.forEach(P)
data.openingStory.closing.forEach(P)
rule()

// ===== はじめに =====
H(`## ${data.preface.title}`)
H('')
data.preface.paragraphs.forEach(P)
if (data.preface.pledge) P(`> ${data.preface.pledge}`)
rule()

// ===== 第1〜11章 =====
for (const ch of data.chapters) {
  H(`## ${ch.no}　${ch.title}`)
  H('')
  if (ch.catch) P(`**${ch.catch}**`)
  for (const [k, v] of Object.entries(ch)) {
    if (['no', 'id', 'title', 'catch'].includes(k)) continue
    walk(v)
  }
  rule()
}

// ===== 私たちが伴走する理由 =====
const w = data.walkReason
H(`## ${w.title}`)
H('')
P(`**${w.headline}**`)
w.body.forEach(P)
H(`### ${w.philosophyLabel}`)
H('')
P(w.philosophy)
w.body2.forEach(P)
w.closing.forEach((l) => P(`**${l}**`))
P(`**${w.tagline}　${w.taglineSub}**`)
rule()

// ===== 約束 =====
const pr = data.promise
H(`## ${pr.title}`)
H('')
pr.paragraphs.forEach(P)
pr.pledges.forEach((p) => P(`- **${p.title}**：${p.note}`))
P(`**${pr.finalMessage}**`)
P(`**${pr.signoff}**`)
rule()

// ===== お問い合わせ（裏表紙） =====
const bc = data.backCover
H('## お問い合わせ')
H('')
P(bc.lead)
P(`**${bc.headline}**`)
P(`- ${bc.hotline.label}：${bc.hotline.value}`)
P(`- ${bc.rep.label}：${bc.rep.value}`)
P(bc.support)
H(`### ${bc.eligibility.title}`)
H('')
P(bc.eligibility.lead)
bc.eligibility.items.forEach((i) => P(`- ${i}`))
P(`${bc.siteLabel}：${bc.site}`)
P(bc.closing)
P(`${bc.issuer}（${bc.brand}）`)
P(bc.disclaimer)

// ===== 出力 =====
const mdText = md.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
const outMd = resolve(here, '..', 'public', 'manual.md')
writeFileSync(outMd, mdText)

// プレーンテキスト（Markdown 記号を軽く落とす）
const txt = mdText
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/^>\s?/gm, '')
  .replace(/\*\*/g, '')
  .replace(/^---$/gm, '────────────────────')
const outTxt = resolve(here, '..', 'public', 'manual.txt')
writeFileSync(outTxt, txt)

console.log(`Markdown: ${outMd}`)
console.log(`Plain text: ${outTxt}`)
