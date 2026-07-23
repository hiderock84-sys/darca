# darca

一般社団法人 相模原ダルク（DARC）「ご家族のための回復支援ガイド」の**印刷用冊子**（A5・全20ページ／家族会向け完全版）。依存症と相模原ダルクの解説を4章立てで収録。

## 技術スタック

- Vite + React 19 + TypeScript
- テスト: Vitest + @testing-library/react（jsdom 環境）
- Lint: ESLint (flat config, `eslint.config.js`)
- パッケージマネージャ: npm（`package-lock.json`）

## 主なコマンド（`package.json` の scripts 参照）

- `npm run dev` — 開発サーバ（Vite、ポート 5173、`host: true`）
- `npm run build` — 型チェック (`tsc -b`) + 本番ビルド
- `npm run preview` — ビルド成果物のプレビュー
- `npm run lint` — ESLint
- `npm test` — Vitest（1 回実行）／`npm run test:watch` で監視

## 冊子の構成

- 出力物は **A5 縦（148×210mm）× 全20ページ**。`@page { size: A5 portrait }`、各ページは `.page`（`page-break-after`）。
  - 表紙 / はじめに / 目次 / 第一章（物語）/ 第二章（依存症）/ 第三章（相模原ダルク）/ 第四章（家族へのお願い）/ 回復した家族の声 / 裏表紙、の順。
- 表示テキスト（章立て・本文・声・家族会情報など）はすべて `src/data/guide.ts` に集約。**文言修正は基本ここだけを編集する**。
- ページ構造は `src/App.tsx`（1ページ = 1コンポーネント）、印刷/レイアウトは `src/index.css`。
- アイコンは `src/components/Icons.tsx`、イラスト（夜の街 / 夜明けの道 / 輪になる仲間 など）は `src/components/Illustrations.tsx` のインライン SVG（画像アセットは未使用）。
- ページ寸法は `:root` の `--page-w`/`--page-h`/`--pad` で調整可能。
- **未確定情報**: 相模原ダルク固有の数値（設立年・料金・開催日・ダルクの一日 など）は一般値/プレースホルダ。`guide.ts` のコメント参照。事実確定後に差し替えること。

## Cursor Cloud specific instructions

- 依存関係は起動時の更新スクリプト（`npm install`）で導入済み。手動での再インストールは通常不要。
- **日本語フォント必須（レンダリング確認時）**: この Linux VM には既定で日本語フォントが無く、CJK が中国語字形にフォールバックして表示される。正しい日本語字形で確認・PDF 化するには `sudo apt-get install -y fonts-noto-cjk` を実行する（システム依存のため更新スクリプトには含めない）。CSS の font-family には `Noto Sans CJK JP` を明示済み。
- 印刷/PDF 確認は headless Chrome で可能:
  `google-chrome --headless=new --no-sandbox --disable-gpu --user-data-dir=/tmp/chrome-pdf-<uniq> --no-pdf-header-footer --print-to-pdf=/tmp/booklet.pdf http://localhost:5173/`
  - 既存 Chrome とプロファイル競合（`SingletonLock`）を避けるため `--user-data-dir` は毎回ユニークにする。
  - `--headless=new` はプロセスが終了せずコマンドがハングして見えることがあるが、`/tmp/booklet.pdf` は生成済みなので PID 指定で停止して `pdfinfo` / `pdftoppm` で検証すればよい。
- ブラウザ印刷時の推奨設定: 用紙 A5／余白 なし／背景のグラフィック オン（1ページ = A5 が20枚）。A4 用紙なら「1枚に2ページ」または冊子（ブックレット）印刷。
- 各ページは A5 に収まる前提で文字サイズを調整済み。`guide.ts` の文章を大幅に増やすとページからあふれるので、PDF 化して各ページの見切れを必ず確認する。
- dev サーバは tmux セッション `vite-dev-server` で起動している。動作確認は `curl -s localhost:5173/` で HTTP 200 を確認すればよい。
