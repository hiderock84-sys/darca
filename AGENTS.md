# darca

一般社団法人 相模原ダルク（DARC）「ご家族のための回復支援ガイド」の Web 版。

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

## コンテンツ構成

- 表示テキストはすべて `src/data/guide.ts` に集約。文言修正は基本ここを編集する。
- 画面は `src/App.tsx` の単一ページ（表紙 / 夜11時の物語 / ご家族にお願いしたいこと / 家族会 / 裏表紙）。
- アイコンは `src/components/Icons.tsx` のインライン SVG（画像アセットは未使用）。

## Cursor Cloud specific instructions

- 依存関係は起動時の更新スクリプト（`npm install`）で導入済み。手動での再インストールは通常不要。
- ESLint 10 は flat config 必須。`eslint-plugin-react-hooks` は `configs.flat.recommended` を使う（`configs['recommended-latest']` は plugins が配列形式で ESLint 10 では読み込めない）。
- `tsc -b`（`npm run build`）は CSS を import しているため `src/vite-env.d.ts` の `/// <reference types="vite/client" />` が必須。削除すると型解決に失敗しビルドが落ちる。
- dev サーバは tmux セッション `vite-dev-server` で起動している。動作確認は `curl -s localhost:5173/` で HTTP 200 を確認すればよい。
