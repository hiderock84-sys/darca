# 緊急課題: PDFが72ページでスカスカ（2026-07-19 08:13〜）

## ユーザー報告（スクショ添付）
- ダウンロード/印刷したPDFが **72ページ** になり、**各ページの下40〜50%が空白**でスカスカ。
- ファイル名「家族回復支援実践マニュ…」＝ダウンロードボタンのdownload名の可能性。iPhoneで閲覧。

## ★確定した根本原因（08:21）
- **`public/manual.pdf` は実際に72ページ**（pypdfで確認。私のregexカウント39は誤りだった）。
- puppeteer生成PDFですら各 .sheet が約2ページ(1ページ+空白の2ページ目)に分割されている。
- iPhone印刷プレビューでも「1〜72ページ, A4, 100%」= ダウンロードPDF自体が72p。
- → **CSSの印刷レイアウトのバグ**。各 .sheet の高さがA4(297mm)を僅かに超え、page-break-before と相まって空白の2ページ目を生む。box-sizing/padding/@page margin/.booklet gap を精査して「1 .sheet = 厳密に1ページ」にする必要。

## 判明している事実
- 私が puppeteer で生成した `public/manual.pdf` は **39ページ・A4(594.96×841.92pt)**（regex/MediaBoxで確認済み）。
- つまり 72p はおそらく **ブラウザ印刷(window.print)** 経由で各A4シートが約1.85物理ページに分割されたもの（前回46p問題の悪化再現）。72/39≒1.85。
- ただし「各ページ下半分が空白」= 39p版でも軽いページが多くスカスカという本質的課題も併存。

## 根本原因の仮説
1. 72p化: ブラウザ印刷のデフォルト余白で 297mm の .sheet が印刷可能領域(約257mm)に収まらず溢れ、空白の2ページ目が挟まる。→ ダウンロードPDF(39p)を使えば回避できるが、ユーザーはそれでも72pと言う可能性。要検証。
2. スカスカ: 39個の .sheet を機械的にA4 1枚ずつに割り当てた結果、内容の少ないシート(story2/preface2/ch7-2/spec等)や、そもそも各章2〜3ページ分割で1ページの充填率が低い。

## 現在の実装
- `src/App.tsx`: 各ページ=Sheetコンポーネント。全39シート。ChapterHead/Lead/Points/ColumnBox/QaBlock 等。
- `src/index.css`: `.sheet{height:297mm等}`, `@media print{ @page{size:A4;margin:0} .sheet{width:210mm;height:297mm;overflow:hidden} .sheet+.sheet{page-break-before:always} }`, レスポンシブは `@media screen`。
- 計測: `scripts/measure-auto.mjs`（各.sheetをheight:autoで実測、>1118pxで溢れ）。※上限1118pxは狭すぎ＝スカスカの一因。
- PDF: `scripts/generate-pdf.mjs`（puppeteer, preferCSSPageSize, margin0, A4）。要 `npm i --no-save puppeteer`（消えやすい）。sharpも同様(`npm i --no-save sharp`)。
- tmuxセッション `vite-preview` で `npm run preview -- --port 4173 --host`。

## 対策方針（次にやる）
1. **まず puppeteerでスクショを撮り、実際の充填率を目視**（例: 数ページ page.screenshot）。全ページ60%充填なら設計欠陥。
2. **72p化の検証**: 生成PDFを実際に確認。ブラウザ印刷依存を断つため、ダウンロードPDFを主導線に（既に実装済み）。加えて、印刷CSSで各シートが確実に1ページになるよう `height:296mm`微調整や `break-inside:avoid` 検討。
3. **スカスカ解消（本命）**: 過剰なページ分割を統合し、各ページの充填率を上げる。目安として各シート目標を1000〜1090pxまで詰める。特に軽いページ(story2/preface2/ch7-2/spec)を隣接ページと統合、またはコンテンツ(図解/コラム/実写)で充填。ページ数を39→適正化。
4. lint/build/test → PDF再生成(39→減) → feature(PR#3) & preview(cursor/manual-preview-f9c8, dist反映)へpush。

## ブランチ/URL
- 作業: cursor/family-recovery-manual-f9c8 (PR #3, base Hiderock69)。最新 bd84ee9。
- プレビュー: cursor/manual-preview-f9c8。公開 https://raw.githack.com/hiderock84-sys/darca/cursor/manual-preview-f9c8/index.html
- リポジトリ: github.com/hiderock84-sys/darca
- 重要: ルート assets/・manual.pdf を feature に混入させない（過去 c8ab83a 汚染）。preview反映は dist の assets/index.html/manual.pdf のみコピー。

## 注意（この環境の癖）
- ツール出力が疑似混入しやすい。**必ず実Shell結果で再確認**（rev-parse/ls/status）。commit/pushは反映を rev-parse で検証。
- 画像認識は不安定。facility.webp(施設外観・加工なし実写)は「はじめに」に配置済み・採用。familyMain/topicは不採用。
