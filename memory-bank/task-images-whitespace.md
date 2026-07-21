# タスク: 公式HP実画像の取込み + 余白埋め（PR #3 / cursor/family-recovery-manual-f9c8）

## ユーザー要望
1. すべてのページの余白が多い（例: 導入ストーリー2ページ目が下半分空白）→ 余白を埋めて正しいページ構成に。
2. 公式HPから実画像を取り込み、加工なしの実写をたくさん使う。
- 「対応策を応じて作成」「はい」= 対応策に応じて安全に進めることを承認済み。

## 公式サイト画像（DL済み: /workspace/tmp-imgs/）
- `fam_02.png` (838x627) = **相模原ダルク デイケアセンター建物外観**（LUMIRIZEビル、DARC看板、人物なし）→ **目視確認済み・安全・採用**。
- `fam_alcohol.jpg` (1500x918, Photoshop加工) = familyページ公式メインビジュアル → 家族向け公式画像として採用可。
- `topic1/2/3.jpg` (1131x849) = トピックス写真 → 内容・人物・同意未確認。**プライバシー配慮で見送り**。
- s-darc.com の 300_181_* は404。s-darc.com/wp-content/uploads/2025/11/ 等に 1-1-N-280x280.jpg 多数（ギャラリー、内容未確認）。
- 由来: https://new-s-darc.sakura.ne.jp/family/ , https://s-darc.com/

## 重要な制約
- この環境では Read の画像認識が不安定（fam_02 のみ視認できた）。内容未確認の人物写り込みリスク画像は医療機関配布冊子には採用しない方針。

## 採用方針（対応策）
- 実写として `fam_02`（施設外観）と `fam_alcohol`（family公式メイン）を webp 最適化し `src/assets/manual/` に追加、`images.ts` に登録。
- 配置案: 表紙/導入に fam_alcohol、家族会・裏表紙・施設紹介に fam_02。
- topic/ギャラリーは見送り（理由をユーザーに報告）。
- 余白埋めは主にページ構成最適化（分割しすぎページの統合）＋実写配置で対応。

## 現状のページ実測（文字拡大後・全39シート、上限≈1118px）
余白が目立つ軽いページ: P2 story2(740), P4 preface2(583), P20 ch7-2(511), spec系(664/743/799)。
- App.tsx: StoryPages/PrefacePages/Ch7Pages/Ch10Pages 等で Sheet 分割。
- PDF生成: `node scripts/generate-pdf.mjs http://localhost:4173/ public/manual.pdf`（要 build+preview 起動、tmux セッション vite-preview）。
- 計測手法: 各 .sheet を height:auto にして getBoundingClientRect().height、>1118 で溢れ。

## 進捗（2026-07-19 更新）
- webp化完了: `src/assets/manual/facility.webp`(施設外観), `src/assets/manual/family-main.webp`(family公式メイン・内容未確認)。変換script: `scripts/convert-site-images.mjs`（要 `npm i --no-save sharp`）。
- `src/assets/manual/images.ts`: `facility`, `familyMain` を登録済み。
- `src/App.tsx`:
  - `ChapterHero` を `caption?` 対応に拡張済み（`.hero__cap` は index.css に既存）。
  - `PrefacePages` の2ページ目（rest段落の後）に `img.facility` を caption付きで配置済み（P4の余白583pxを埋める狙い）。
- Ch11家族会は既に `img.familyCircle` 配置済み・余白十分。
- **未対応**: familyMain の活用（内容未確認のため保留、ユーザー報告要）。story2(740)/ch7-2(511) の余白（統合不可＝分割必須、画像追加で埋める余地）。
- **次アクション**: lint/build/test → preface2がA4(1118px)内か実測 → PDF再生成 → feature(commit/push, PR#3更新) + preview(dist反映)反映。
- lint/build は直近実行中（結果未確認）。

## 未確認・懸念
- 画像認識が不安定で familyMain/topic の内容目視不可。人物写り込みリスクのある topic/ギャラリーは不採用。familyMain も要ユーザー確認。
- 実写は現状 facility(施設外観)1枚のみ採用。「たくさん」の要望には未達 → ユーザーに状況説明し、使いたい特定写真の指定を仰ぐのが妥当。

## 検証・反映手順
- `npm run lint` / `npm run build` / `npm test`（7件）。
- feature: cursor/family-recovery-manual-f9c8 に commit+push、PR #3 更新。
- preview: cursor/manual-preview-f9c8 に dist 内容(assets/, index.html, manual.pdf)を反映して push。
- 注意: ルート assets/・manual.pdf を feature に混入させない（前回 c8ab83a で汚染→マージ時に除去済み）。
- 公開URL: https://raw.githack.com/hiderock84-sys/darca/cursor/manual-preview-f9c8/index.html
