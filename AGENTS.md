# darca

一般社団法人 相模原ダルク（DARC）「ご家族のための回復支援ガイド」の**印刷用冊子**（A4 二つ折り／仕上がり A5・4ページ）。

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

- 出力物は **A4 横（297×210mm）2枚**。各シートを A5 パネル2つに面付けし、中央で二つ折りにすると 4ページ冊子になる。
  - シート1（外面）: 左＝裏表紙(P4) ／ 右＝表紙(P1)
  - シート2（中面）: 左＝夜11時の物語(P2) ／ 右＝ご家族にお願いしたいこと(P3)
- 表示テキストはすべて `src/data/guide.ts` に集約。文言修正は基本ここを編集する。
- 面付け・パネルの構造は `src/App.tsx`、印刷スタイルは `src/index.css`（`@page { size: A4 landscape }`、`.sheet` / `.panel`）。
- アイコンは `src/components/Icons.tsx` のインライン SVG（画像アセットは未使用）。
- パネル寸法は `:root` の `--panel-w`/`--panel-h`/`--pad` で調整可能。

## Cursor Cloud specific instructions

- 依存関係は起動時の更新スクリプト（`npm install`）で導入済み。手動での再インストールは通常不要。
- **日本語フォント必須（レンダリング確認時）**: この Linux VM には既定で日本語フォントが無く、CJK が中国語字形にフォールバックして表示される。正しい日本語字形で確認・PDF 化するには `sudo apt-get install -y fonts-noto-cjk` を実行する（システム依存のため更新スクリプトには含めない）。CSS の font-family には `Noto Sans CJK JP` を明示済み。
- 印刷/PDF 確認は headless Chrome で可能:
  `google-chrome --headless=new --no-sandbox --disable-gpu --user-data-dir=/tmp/chrome-pdf-<uniq> --no-pdf-header-footer --print-to-pdf=/tmp/booklet.pdf http://localhost:5173/`
  - 既存 Chrome とプロファイル競合（`SingletonLock`）を避けるため `--user-data-dir` は毎回ユニークにする。
  - `--headless=new` はプロセスが終了せずコマンドがハングして見えることがあるが、`/tmp/booklet.pdf` は生成済みなので PID 指定で停止して `pdfinfo` / `pdftoppm` で検証すればよい。
- ブラウザ印刷時の推奨設定: 用紙 A4／向き 横／余白 なし／背景のグラフィック オン／両面（長辺とじ）。
- dev サーバは tmux セッション `vite-dev-server` で起動している。動作確認は `curl -s localhost:5173/` で HTTP 200 を確認すればよい。
