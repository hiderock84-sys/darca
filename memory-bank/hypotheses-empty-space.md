# 課題: ページに巨大な余白／半分しか埋まっていないページが多発する原因分析

（この文書は前提知識ゼロの読者向けに書く）

## 対象プロダクト
- 相模原ダルク「家族回復支援実践マニュアル」= Vite + React 製の1枚もの電子ブックレット。
- 画面は `src/App.tsx`。全体を「Sheet（=1枚のA4ページ）」という React コンポーネントの連続で構成。現在**39枚のSheet**。
- スタイルは `src/index.css`。`.sheet` は **固定サイズ 210mm×297mm（A4）**。`@media print` でも 297mm 固定、`.sheet + .sheet { page-break-before: always }` で1枚ごとに改ページ。
- 各Sheetに「どのコンテンツ塊を載せるか」は App.tsx に**手作業でハードコード**されている（例: StoryPages=2枚, PrefacePages=2枚, Ch7Pages=2枚, Ch10Pages=扉+Q&A5問ごとの塊…）。

## ユーザーの不満（最重要・2026-07-19 夜）
- 「巨大な余白」「半分しか埋まっていないページ」が多い。
- **height は原因ではない**（触るなと明言）。
- 最終ゴール: 全ページの余白をなくし、バランスよく文章配置／公式HPの実画像を複数使用／不要ページを削除／正しいレイアウト／**文章の情報は一切削らない**。

## 重要な区別: 「余白」には2種類ある
- (A) **設計レベルの充填不足**: 39枚の固定高Sheetに対し、中身が少なく各ページが50〜70%しか埋まらない。→ 正しい39ページ版でも起きる本質問題。**ユーザーが問題視しているのはこれ**。
- (B) **印刷時の空白ページ**: 別課題（72ページ化）。297mmのSheetがブラウザ印刷の印刷可能領域に収まらず溢れ、各Sheetの下端が「ほぼ空白の2枚目」に分割される。ユーザーのスクショの「2/72が空白, 3/72に本文」はこれ。heightに起因するが、ユーザーは今回これを触るなと指示。→ 測定で寄与度を定量化はするが、修正はA優先。

## 有力仮説（Aの充填不足の原因）
### H1: 分割しすぎ（over-splitting）で各Sheetが薄い【本命】
- 過去に「印刷時に溢れると72ページ化やclipが起きる」のを避けるため、**安全側に倒してコンテンツを細かく分割**した。結果、多くのSheetが半端な量しか持たない。
- 既存の実測（文字拡大後）でも: P2 story2=740px, P4 preface2=583px, P19 ch7-2=511px, spec系=664/743/799px … A4高さ≈1122pxに対し明らかに低充填。
- 予測: 39枚中かなりの枚数が充填率<80%。

### H2: 縦方向の充填機構がない（top-align）
- `.sheet__body` は通常フローで上詰め。余ったスペースは下端に溜まる。`justify-content`やフィラー等がないため、少し足りないだけでも下に大きな空白が見える。

### H3: ブロック粒度が粗く早期改行を強いる（bin-packing の無駄）
- Hero画像・POINT枠・コラム・ケース・Q&A塊など**大きく分割不能な単位**を固定サイズの箱に詰めるため、「あと0.5個分入るが1個は入らない」隙間が生じる。
- 章はChapterHeadで必ず新Sheet開始。1.4枚分の章は「満杯1枚＋40%の半端1枚」になり、11章分の“端数ページ”が積み上がる。

### H4: 印刷ダブリング（B）が空白ページを大量注入
- ブラウザ印刷で各297mm Sheetが「本文の1枚＋溢れ分ほぼ空白の1枚」に割れ、39→72。半数が near-blank。ユーザーが見る72p PDFの空白の主因の一つ。heightは触らない方針なので、寄与度の測定のみ。

### H5（対抗仮説・非自明）: CSSが内容以上の高さを強制している
- `min-height` / flex / grid の固定行 / 画像の固定height / aspect-ratio 枠 などが、内容が短くても高さを予約している可能性。要DOM/CSS点検で否定 or 確認。

## 検証計画（経験的に1つずつ／未実行・要承認）
- V1【H1】各Sheetの充填率を実測: puppeteerでプレビューを開き、各`.sheet`を一時的にheight:autoにして内容高さを測り、使用可能高さ（297mm−上下padding）と比較。表出力（index, 内容px, 充填%）。<80%の枚数と場所を特定。
- V2【H2】低充填Sheetのスクショ: 最悪5枚をpuppeteerでscreenshot。空白が下端に集中しているか、何が載っているかを目視確認。
- V3【H3】「分割を後ろへ動かせるか」判定: 各低充填Sheetの内容高さ＋次Sheet先頭ブロックの高さ が使用可能高さ以内なら“早すぎる分割”と確定（=詰め直しで解消可能）。
- V4【H4】印刷ダブリングの定量化: DLしたPuppeteer PDFのページ数（pypdf）と、print相当メディアで各Sheetが印刷可能領域を超える量を測定。heightは変更しない。
- V5【H5】DOM/CSS点検: `.sheet`/`.sheet__body`/hero/画像に min-height・flex・grid行・固定height 等の“高さ予約”がないかをコード検索と算出スタイルで確認。

## 実施結果（2026-07-19 14時台）
- V1で確定: 39ページ中17枚が80%未満。総コンテンツ量≈32ページ分。
- 対応: 公式サイトの実写5点をwebp化し低充填ページへ配置。
  - facility(施設外観)=はじめに / seminar(家族会・顔モザイク済)=第11章 / consultHand(相談・顔なし)=第7章2枚目(xtall) / entranceBack(入口・後ろ姿)=導入ストーリー結び / staffSmile(スタッフ笑顔)=Q&A扉。
  - `.hero--tall`(230px)/`.hero--xtall`(300px)を追加し低ページの画像を拡大。
- 結果: 最悪だったP20 46%→77%、P2 66%→83%、P25 66%→83%、P3 65%→73%、P4 69%→77%。家族向け本文は全て72-95%充填。80%未満は主に72-79%(適正)＋表紙(意図的)＋制作仕様書(内部資料)。
- PDF=39ページ・A4(595×842pt)維持。lint/test(7)通過。
- コミット: feature 57d842f / preview ce695e6。両方 push 済み(L=R検証済)。
- height は一切変更していない（ユーザー指示遵守）。

## 未了・次の候補
- まだ72-79%のページ(各章のpage1/2)は「情報を削らずさらに詰める」には章間ページ統合(cross-chapter packing)が必要=大きめの構造変更。要相談。
- 制作仕様書ページ(P35-38, 内部資料)は家族配布版から外す案も。情報損失になるため要ユーザー確認。
- ブラウザ「印刷」ボタン(window.print)では各シートが2枚に割れ72p化する既知問題は別軸。ダウンロードPDF(39p)を主導線に案内すること。heightは触るなとの指示。

## 連続フロー方式へ刷新（2026-07-19 夜・完了）
- ユーザー承認のもと、固定A4ページ方式を廃止し「連続フロー＋自動改ページ」へ。
- `@media print` を全面書き換え（src/index.css）:
  - `@page { size:A4; margin:10mm 0 }` ＋ 名前付き `@page fullbleed { margin:0 }`。
  - 本文 `.sheet` は `height:auto; padding:0 15mm; display:block; overflow:visible` で連続フロー化。`.runhead/.pagenum` は print で非表示。
  - 表紙/約束/裏表紙は `.sheet--cover/promise/back { page: fullbleed; height:297mm; box-sizing:border-box }` で全面ページ維持（Chrome の名前付きページが機能＝表紙フルブリード確認済み）。
  - 原子ブロック（figure/point/column/case/qa/checklist/cycle/flow/callout/kv__row/benefit/compare/example-row/dd-col/voices/points/chapter-head/toc__row/preface__pledge）に `break-inside:avoid`。見出しは `break-after:avoid`。
  - 特殊ページを `.sheet + .sheet` のマージン対象から除外（末尾空白ページの原因だった）。
- 結果: **39→27ページ**、空白ページなし（PyMuPDFで全ページ走査し確認）。表紙フルブリード、本文は隙間なく充填、分割崩れなし（第6章など目視確認）。A4(595×842pt)。lint/build/test(7)通過。
- 副次効果: 固定297mmシートを廃したため、**ブラウザ「印刷」でも72ページ化しない**見込み（各シートが2枚に割れる原因が解消）。
- PDF検証ツール: PyMuPDF(`pip install pymupdf`)で `d[i].get_pixmap()` 画像化＋空白検出。
- コミット: feature 7860052 / preview 04f426e。

## 環境の注意
- ツール出力が疑似混入しやすい → 必ず実Shell結果（rev-parse/ls/status/wc/grep）で再確認。
- puppeteer/sharp/pypdf は消えやすい → 使用前に存在確認、無ければ `npm i --no-save puppeteer` / `pip install pypdf`。
- ブランチ: 作業=cursor/family-recovery-manual-f9c8 (PR#3, base Hiderock69, HEAD bd84ee9)。プレビュー=cursor/manual-preview-f9c8。
